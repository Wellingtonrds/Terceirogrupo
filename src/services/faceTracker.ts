import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { TrackingData, TrackingSettings } from '../types/vtuber';

export class FaceTrackerService {
  private videoElement: HTMLVideoElement | null = null;
  private landmarker: FaceLandmarker | null = null;
  private isLandmarkerLoading = false;
  private isRunning = false;
  private animFrameId: number | null = null;

  // Audio Context & Analyser
  private audioContext: AudioContext | null = null;
  private audioAnalyser: AnalyserNode | null = null;
  private audioDataArray: Uint8Array<ArrayBuffer> | null = null;
  private micStream: MediaStream | null = null;

  // Smoothing buffers
  private currentTracking: TrackingData = {
    hasFace: false,
    pitch: 0,
    yaw: 0,
    roll: 0,
    x: 0,
    y: 0,
    z: 0,
    eyeBlinkLeft: 0,
    eyeBlinkRight: 0,
    eyeSquint: 0,
    eyeWide: 0,
    eyeGazeX: 0,
    eyeGazeY: 0,
    mouthOpen: 0,
    mouthSmile: 0,
    mouthPucker: 0,
    mouthFrown: 0,
    eyebrowRaise: 0,
    audioVolume: 0,
    audioPitch: 0,
  };

  // Calibration zero-offsets
  private neutralOffsets = {
    pitch: 0,
    yaw: 0,
    roll: 0,
    x: 0,
    y: 0,
    mouthOpen: 0,
    mouthSmile: 0,
  };

  // Optical fallback tracker
  private opticalCanvas: HTMLCanvasElement;
  private opticalCtx: CanvasRenderingContext2D;

  public onTrackingUpdate?: (data: TrackingData) => void;
  public onStatusChange?: (status: {
    cameraReady: boolean;
    micReady: boolean;
    landmarkerReady: boolean;
    error: string | null;
  }) => void;

  constructor() {
    this.opticalCanvas = document.createElement('canvas');
    this.opticalCanvas.width = 160;
    this.opticalCanvas.height = 120;
    this.opticalCtx = this.opticalCanvas.getContext('2d', { willReadFrequently: true })!;
  }

  public async initMediaPipe() {
    if (this.landmarker || this.isLandmarkerLoading) return;
    this.isLandmarkerLoading = true;

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        runningMode: 'VIDEO',
        numFaces: 1,
      });

      this.isLandmarkerLoading = false;
      this.notifyStatus();
    } catch (err) {
      console.warn('MediaPipe CDN load failed, using optical fallback tracker:', err);
      this.isLandmarkerLoading = false;
      this.notifyStatus();
    }
  }

  public async startCameraAndMic(videoEl: HTMLVideoElement): Promise<MediaStream> {
    this.videoElement = videoEl;

    // Start loading MediaPipe in background
    this.initMediaPipe();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      videoEl.srcObject = stream;
      await new Promise<void>((resolve) => {
        videoEl.onloadedmetadata = () => {
          videoEl.play();
          resolve();
        };
      });

      // Setup audio analyzer
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        this.setupAudioAnalysis(stream);
      }

      this.isRunning = true;
      this.loop(performance.now(), {
        headSensitivity: 1.2,
        positionSensitivity: 1.0,
        mouthSensitivity: 1.5,
        blinkThreshold: 0.35,
        mirrorCamera: true,
        useAudioLipSync: true,
        smoothingFactor: 0.65,
      });

      this.notifyStatus();
      return stream;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Permissão de câmera ou microfone negada';
      this.notifyStatus(msg);
      throw err;
    }
  }

  private setupAudioAnalysis(stream: MediaStream) {
    try {
      this.micStream = stream;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.audioAnalyser = this.audioContext.createAnalyser();
      this.audioAnalyser.fftSize = 256;
      this.audioAnalyser.smoothingTimeConstant = 0.3;
      source.connect(this.audioAnalyser);

      const bufferLength = this.audioAnalyser.frequencyBinCount;
      this.audioDataArray = new Uint8Array(bufferLength);
    } catch (e) {
      console.warn('AudioContext setup error:', e);
    }
  }

  public calibrateNeutral() {
    this.neutralOffsets.pitch = this.currentTracking.pitch;
    this.neutralOffsets.yaw = this.currentTracking.yaw;
    this.neutralOffsets.roll = this.currentTracking.roll;
    this.neutralOffsets.x = this.currentTracking.x;
    this.neutralOffsets.y = this.currentTracking.y;
    this.neutralOffsets.mouthOpen = this.currentTracking.mouthOpen;
    this.neutralOffsets.mouthSmile = this.currentTracking.mouthSmile;
  }

  public loop(timestamp: number, settings: TrackingSettings) {
    if (!this.isRunning) return;

    // 1. Process Audio with high sensitivity
    let audioVol = 0;
    if (this.audioAnalyser && this.audioDataArray) {
      this.audioAnalyser.getByteFrequencyData(this.audioDataArray);
      let sum = 0;
      // Focus on vocal speech frequencies (bins 2 to 50: ~100Hz to 4000Hz)
      const maxBin = Math.min(this.audioDataArray.length, 50);
      for (let i = 2; i < maxBin; i++) {
        sum += this.audioDataArray[i];
      }
      const avg = sum / (maxBin - 2);
      // High sensitivity threshold: speech sounds immediately trigger volume
      audioVol = Math.min(1.0, (avg / 60) * 2.0);
    }

    // 2-second automatic blink cycle (2000ms period)
    const blinkCycleMs = 2000;
    const blinkPhase = timestamp % blinkCycleMs;
    const blinkDurationMs = 160;
    let autoBlink = 0;
    if (blinkPhase < blinkDurationMs) {
      // Natural smooth sine envelope: 0 -> 1 -> 0
      autoBlink = Math.sin((blinkPhase / blinkDurationMs) * Math.PI);
    }

    // Sound-driven mouth opening with natural syllable bounce
    let soundMouth = 0;
    if (audioVol > 0.02) {
      const syllableBounce = 0.85 + 0.15 * Math.sin(timestamp * 0.025);
      soundMouth = Math.min(1.3, (audioVol * 2.6) * syllableBounce * settings.mouthSensitivity);
    }

    // 2. Process Video tracking
    let rawData: Partial<TrackingData> = {
      hasFace: false,
      audioVolume: audioVol,
    };

    if (this.videoElement && this.videoElement.readyState >= 2) {
      if (this.landmarker) {
        rawData = this.processMediaPipe(timestamp, settings);
      } else {
        rawData = this.processOpticalFallback(settings);
      }
    }

    rawData.audioVolume = audioVol;

    // Responsive smoothing filter
    const smooth = Math.max(0.05, Math.min(0.9, settings.smoothingFactor));
    const invSmooth = 1 - smooth;

    this.currentTracking.hasFace = rawData.hasFace ?? false;

    if (this.currentTracking.hasFace) {
      // Relative to calibrated neutral pose
      const mirrorMultiplier = settings.mirrorCamera ? -1 : 1;
      const targetPitch =
        ((rawData.pitch ?? 0) - this.neutralOffsets.pitch) * settings.headSensitivity;
      const targetYaw =
        ((rawData.yaw ?? 0) - this.neutralOffsets.yaw) * settings.headSensitivity * mirrorMultiplier;
      const targetRoll =
        ((rawData.roll ?? 0) - this.neutralOffsets.roll) * settings.headSensitivity * mirrorMultiplier;

      const targetX =
        ((rawData.x ?? 0) - this.neutralOffsets.x) * settings.positionSensitivity * mirrorMultiplier;
      const targetY =
        ((rawData.y ?? 0) - this.neutralOffsets.y) * settings.positionSensitivity;
      const targetZ = (rawData.z ?? 0) * settings.positionSensitivity;

      this.currentTracking.pitch = this.currentTracking.pitch * smooth + targetPitch * invSmooth;
      this.currentTracking.yaw = this.currentTracking.yaw * smooth + targetYaw * invSmooth;
      this.currentTracking.roll = this.currentTracking.roll * smooth + targetRoll * invSmooth;

      this.currentTracking.x = this.currentTracking.x * smooth + targetX * invSmooth;
      this.currentTracking.y = this.currentTracking.y * smooth + targetY * invSmooth;
      this.currentTracking.z = this.currentTracking.z * smooth + targetZ * invSmooth;

      // Eye Blinking: Combine user's camera blink with 2-second automatic blink
      const rawBlinkL = rawData.eyeBlinkLeft ?? 0;
      const rawBlinkR = rawData.eyeBlinkRight ?? 0;
      const cameraBlinkL = rawBlinkL > settings.blinkThreshold ? 1 : rawBlinkL * 0.8;
      const cameraBlinkR = rawBlinkR > settings.blinkThreshold ? 1 : rawBlinkR * 0.8;

      const targetBlinkL = Math.max(cameraBlinkL, autoBlink);
      const targetBlinkR = Math.max(cameraBlinkR, autoBlink);

      this.currentTracking.eyeBlinkLeft =
        this.currentTracking.eyeBlinkLeft * 0.25 + targetBlinkL * 0.75;
      this.currentTracking.eyeBlinkRight =
        this.currentTracking.eyeBlinkRight * 0.25 + targetBlinkR * 0.75;

      this.currentTracking.eyeSquint =
        this.currentTracking.eyeSquint * 0.4 + (rawData.eyeSquint ?? 0) * 0.6;
      this.currentTracking.eyeWide =
        this.currentTracking.eyeWide * 0.4 + (rawData.eyeWide ?? 0) * 0.6;

      // Eye Gaze direction (looking around)
      const targetGazeX = (rawData.eyeGazeX ?? 0) * (settings.mirrorCamera ? -1 : 1);
      const targetGazeY = rawData.eyeGazeY ?? 0;
      this.currentTracking.eyeGazeX = this.currentTracking.eyeGazeX * 0.4 + targetGazeX * 0.6;
      this.currentTracking.eyeGazeY = this.currentTracking.eyeGazeY * 0.4 + targetGazeY * 0.6;

      // Mouth Tracking: Open mouth whenever sound is detected OR camera mouth opens
      const cameraMouthOpen = (rawData.mouthOpen ?? 0) * settings.mouthSensitivity;
      const targetMouthOpen = Math.max(cameraMouthOpen, soundMouth);

      this.currentTracking.mouthOpen =
        this.currentTracking.mouthOpen * 0.3 + targetMouthOpen * 0.7;

      const targetSmile = Math.max(0, (rawData.mouthSmile ?? 0) - this.neutralOffsets.mouthSmile);
      this.currentTracking.mouthSmile =
        this.currentTracking.mouthSmile * 0.35 + targetSmile * 0.65;

      this.currentTracking.mouthPucker =
        this.currentTracking.mouthPucker * 0.35 + (rawData.mouthPucker ?? 0) * 0.65;
      this.currentTracking.mouthFrown =
        this.currentTracking.mouthFrown * 0.35 + (rawData.mouthFrown ?? 0) * 0.65;
      this.currentTracking.eyebrowRaise =
        this.currentTracking.eyebrowRaise * 0.35 + (rawData.eyebrowRaise ?? 0) * 0.65;
    } else {
      // Soft return to center when face not in frame, but KEEP 2-second blink & sound mouth active!
      this.currentTracking.pitch *= 0.9;
      this.currentTracking.yaw *= 0.9;
      this.currentTracking.roll *= 0.9;
      this.currentTracking.x *= 0.9;
      this.currentTracking.y *= 0.9;
      this.currentTracking.z *= 0.9;
      this.currentTracking.eyeBlinkLeft = this.currentTracking.eyeBlinkLeft * 0.25 + autoBlink * 0.75;
      this.currentTracking.eyeBlinkRight = this.currentTracking.eyeBlinkRight * 0.25 + autoBlink * 0.75;
      this.currentTracking.eyeGazeX *= 0.85;
      this.currentTracking.eyeGazeY *= 0.85;

      if (soundMouth > 0.05) {
        this.currentTracking.mouthOpen =
          this.currentTracking.mouthOpen * 0.3 + soundMouth * 0.7;
      } else {
        this.currentTracking.mouthOpen *= 0.8;
      }
    }

    this.currentTracking.audioVolume = audioVol;

    if (this.onTrackingUpdate) {
      this.onTrackingUpdate(this.currentTracking);
    }

    this.animFrameId = requestAnimationFrame((t) => this.loop(t, settings));
  }

  private processMediaPipe(timestamp: number, settings: TrackingSettings): Partial<TrackingData> {
    if (!this.landmarker || !this.videoElement) return { hasFace: false };

    try {
      const results = this.landmarker.detectForVideo(this.videoElement, timestamp);

      if (!results || !results.faceLandmarks || results.faceLandmarks.length === 0) {
        return { hasFace: false };
      }

      const landmarks = results.faceLandmarks[0];
      const blendshapes = results.faceBlendshapes?.[0]?.categories || [];

      // Helper to find blendshape score
      const getScore = (name: string): number => {
        const found = blendshapes.find((b) => b.categoryName === name);
        return found ? found.score : 0;
      };

      // Key Facial Anchor Landmarks:
      const nose = landmarks[1];
      const chin = landmarks[152];
      const forehead = landmarks[10];
      const leftCheek = landmarks[263];
      const rightCheek = landmarks[33];

      // Yaw (horizontal turn)
      const cheekMidX = (leftCheek.x + rightCheek.x) / 2;
      const cheekDist = Math.abs(leftCheek.x - rightCheek.x);
      const rawYaw = ((nose.x - cheekMidX) / Math.max(0.1, cheekDist)) * 2.0;

      // Pitch (vertical nod)
      const faceMidY = (forehead.y + chin.y) / 2;
      const faceHeight = Math.abs(chin.y - forehead.y);
      const rawPitch = ((nose.y - faceMidY) / Math.max(0.1, faceHeight)) * 2.4;

      // Roll (tilt)
      const dy = leftCheek.y - rightCheek.y;
      const dx = leftCheek.x - rightCheek.x;
      const rawRoll = Math.atan2(dy, dx);

      // Precise eye blendshapes
      const blinkL = getScore('eyeBlinkLeft');
      const blinkR = getScore('eyeBlinkRight');
      const squintL = getScore('eyeSquintLeft');
      const squintR = getScore('eyeSquintRight');
      const wideL = getScore('eyeWideLeft');
      const wideR = getScore('eyeWideRight');

      // Eye gaze directions
      const lookInL = getScore('eyeLookInLeft');
      const lookOutL = getScore('eyeLookOutLeft');
      const lookInR = getScore('eyeLookInRight');
      const lookOutR = getScore('eyeLookOutRight');
      const lookUpL = getScore('eyeLookUpLeft');
      const lookUpR = getScore('eyeLookUpRight');
      const lookDownL = getScore('eyeLookDownLeft');
      const lookDownR = getScore('eyeLookDownRight');

      // Net Gaze X & Y (-1 to 1)
      const gazeX = Math.min(1, Math.max(-1, (lookOutL - lookInL + lookInR - lookOutR) * 1.6));
      const gazeY = Math.min(1, Math.max(-1, (lookUpL + lookUpR - lookDownL - lookDownR) * 1.6));

      // Precise mouth blendshapes
      const jawOpen = getScore('jawOpen');
      const smileL = getScore('mouthSmileLeft');
      const smileR = getScore('mouthSmileRight');
      const stretchL = getScore('mouthStretchLeft');
      const stretchR = getScore('mouthStretchRight');
      const pucker = getScore('mouthPucker');
      const funnel = getScore('mouthFunnel');
      const frownL = getScore('mouthFrownLeft');
      const frownR = getScore('mouthFrownRight');

      const browUpL = getScore('browOuterUpLeft');
      const browUpR = getScore('browOuterUpRight');
      const browInnerUp = getScore('browInnerUp');

      return {
        hasFace: true,
        pitch: rawPitch,
        yaw: rawYaw,
        roll: rawRoll,
        x: (nose.x - 0.5) * 2,
        y: -(nose.y - 0.5) * 2,
        z: (1 - Math.min(1.5, cheekDist * 3)) * 0.8,
        eyeBlinkLeft: blinkL,
        eyeBlinkRight: blinkR,
        eyeSquint: (squintL + squintR) / 2,
        eyeWide: (wideL + wideR) / 2,
        eyeGazeX: gazeX,
        eyeGazeY: gazeY,
        mouthOpen: jawOpen,
        mouthSmile: (smileL + smileR + stretchL + stretchR) / 3,
        mouthPucker: pucker + funnel * 0.6,
        mouthFrown: (frownL + frownR) / 2,
        eyebrowRaise: (browUpL + browUpR + browInnerUp) / 3,
      };
    } catch {
      return { hasFace: false };
    }
  }

  /**
   * Real-time zero-delay optical centroid fallback
   */
  private processOpticalFallback(settings: TrackingSettings): Partial<TrackingData> {
    if (!this.videoElement) return { hasFace: false };

    const vw = this.opticalCanvas.width;
    const vh = this.opticalCanvas.height;
    this.opticalCtx.drawImage(this.videoElement, 0, 0, vw, vh);

    const frame = this.opticalCtx.getImageData(0, 0, vw, vh);
    const data = frame.data;

    let weightedX = 0;
    let weightedY = 0;
    let totalWeight = 0;

    for (let y = 0; y < vh; y += 4) {
      for (let x = 0; x < vw; x += 4) {
        const i = (y * vw + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r > 60 && g > 40 && b > 20 && r > g && r > b) {
          const w = r - g + (r - b);
          weightedX += x * w;
          weightedY += y * w;
          totalWeight += w;
        }
      }
    }

    if (totalWeight < 1000) {
      return { hasFace: false };
    }

    const cx = weightedX / totalWeight;
    const cy = weightedY / totalWeight;

    const normX = (cx / vw - 0.5) * 2;
    const normY = -(cy / vh - 0.5) * 2;

    return {
      hasFace: true,
      pitch: normY * 0.7,
      yaw: normX * 0.9,
      roll: normX * 0.35,
      x: normX * 0.5,
      y: normY * 0.5,
      z: 0,
      eyeBlinkLeft: 0,
      eyeBlinkRight: 0,
      eyeSquint: 0,
      eyeWide: 0,
      eyeGazeX: normX * 0.4,
      eyeGazeY: normY * 0.4,
      mouthOpen: 0,
      mouthSmile: 0,
      mouthPucker: 0,
      mouthFrown: 0,
      eyebrowRaise: 0,
    };
  }

  private notifyStatus(error: string | null = null) {
    if (this.onStatusChange) {
      this.onStatusChange({
        cameraReady: !!(this.videoElement && this.videoElement.readyState >= 2),
        micReady: !!this.audioAnalyser,
        landmarkerReady: !!this.landmarker,
        error,
      });
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      this.videoElement.srcObject = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.landmarker) {
      this.landmarker.close();
      this.landmarker = null;
    }
  }
}
