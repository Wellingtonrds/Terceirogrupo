import { RecordedVideo } from '../types/vtuber';

export class VideoRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private startTime: number = 0;
  private pauseTime: number = 0;
  private totalPausedDuration: number = 0;
  private timerInterval: number | null = null;
  private audioContext: AudioContext | null = null;
  private audioDestination: MediaStreamAudioDestinationNode | null = null;
  private internalAudioStream: MediaStream | null = null;
  private hasAudioTrack: boolean = false;

  public isRecording: boolean = false;
  public isPaused: boolean = false;
  public currentDurationMs: number = 0;

  public onTimeUpdate?: (durationMs: number) => void;

  public static getSupportedMimeType(): string {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/mp4',
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  }

  public async startRecording(
    canvas: HTMLCanvasElement,
    micStream: MediaStream | null,
    fps: number = 60
  ): Promise<boolean> {
    if (this.isRecording) return false;

    try {
      const canvasStream = canvas.captureStream(fps);
      const combinedTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];
      this.hasAudioTrack = false;

      // 1. Obtain Audio Stream (Use provided micStream or request dedicated microphone)
      let activeAudioStream = micStream;
      if (!activeAudioStream || activeAudioStream.getAudioTracks().length === 0) {
        try {
          activeAudioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          this.internalAudioStream = activeAudioStream;
        } catch (e) {
          console.warn('Could not acquire microphone for recording audio:', e);
        }
      }

      // 2. Route through AudioContext & GainNode for clean mixing and volume boost
      if (activeAudioStream && activeAudioStream.getAudioTracks().length > 0) {
        try {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          this.audioContext = new AudioCtx();
          if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
          }

          const source = this.audioContext.createMediaStreamSource(activeAudioStream);
          const gainNode = this.audioContext.createGain();
          gainNode.gain.value = 1.35; // Gentle vocal presence boost for recordings

          this.audioDestination = this.audioContext.createMediaStreamDestination();
          source.connect(gainNode);
          gainNode.connect(this.audioDestination);

          const mixedAudioTrack = this.audioDestination.stream.getAudioTracks()[0];
          if (mixedAudioTrack) {
            combinedTracks.push(mixedAudioTrack);
            this.hasAudioTrack = true;
          }
        } catch (err) {
          console.warn('AudioContext mixing error, falling back to direct track:', err);
          const directTrack = activeAudioStream.getAudioTracks()[0];
          if (directTrack) {
            combinedTracks.push(directTrack);
            this.hasAudioTrack = true;
          }
        }
      }

      const combinedStream = new MediaStream(combinedTracks);
      const mimeType = VideoRecorderService.getSupportedMimeType();

      const options: MediaRecorderOptions = {
        videoBitsPerSecond: 6000000, // 6 Mbps for crisp 1080p
        audioBitsPerSecond: 128000,  // 128 kbps crystal clear stereo/mono audio
      };
      if (mimeType) {
        options.mimeType = mimeType;
      }

      this.mediaRecorder = new MediaRecorder(combinedStream, options);
      this.recordedChunks = [];
      this.startTime = performance.now();
      this.totalPausedDuration = 0;
      this.isRecording = true;
      this.isPaused = false;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      // Emit chunk every 300ms
      this.mediaRecorder.start(300);

      // Start duration ticker
      this.timerInterval = window.setInterval(() => {
        if (this.isRecording && !this.isPaused) {
          this.currentDurationMs = performance.now() - this.startTime - this.totalPausedDuration;
          if (this.onTimeUpdate) {
            this.onTimeUpdate(this.currentDurationMs);
          }
        }
      }, 100);

      return true;
    } catch (err) {
      console.error('Failed to start recording with audio:', err);
      this.isRecording = false;
      return false;
    }
  }

  public pauseRecording() {
    if (this.mediaRecorder && this.isRecording && !this.isPaused) {
      this.mediaRecorder.pause();
      this.isPaused = true;
      this.pauseTime = performance.now();
    }
  }

  public resumeRecording() {
    if (this.mediaRecorder && this.isRecording && this.isPaused) {
      this.mediaRecorder.resume();
      this.isPaused = false;
      this.totalPausedDuration += performance.now() - this.pauseTime;
    }
  }

  public async stopRecording(): Promise<RecordedVideo> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('Nenhuma gravação em andamento'));
        return;
      }

      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      const finalDuration = performance.now() - this.startTime - this.totalPausedDuration;
      const wasAudioIncluded = this.hasAudioTrack;

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'video/webm';
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const name = `mechamorph_vtuber_${dateStr}.${ext}`;

        const recordedVideo: RecordedVideo = {
          blob,
          url,
          durationMs: finalDuration,
          createdAt: new Date(),
          sizeBytes: blob.size,
          name,
          hasAudio: wasAudioIncluded,
        };

        // Clean up audio context
        if (this.audioContext && this.audioContext.state !== 'closed') {
          this.audioContext.close();
          this.audioContext = null;
        }
        if (this.internalAudioStream) {
          this.internalAudioStream.getTracks().forEach((t) => t.stop());
          this.internalAudioStream = null;
        }

        this.isRecording = false;
        this.isPaused = false;
        this.mediaRecorder = null;
        resolve(recordedVideo);
      };

      this.mediaRecorder.stop();
    });
  }

  public static saveToDevice(video: RecordedVideo) {
    const a = document.createElement('a');
    a.href = video.url;
    a.download = video.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  public static captureScreenshot(canvas: HTMLCanvasElement, filename?: string): string {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || `mechamorph_avatar_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return dataUrl;
  }
}
