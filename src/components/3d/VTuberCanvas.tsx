import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { AvatarConfig, EmotionState, StudioBackground, TrackingData } from '../../types/vtuber';
import { AvatarController, buildAvatar } from './AvatarMesh';

interface VTuberCanvasProps {
  avatarConfig: AvatarConfig;
  trackingData: TrackingData;
  emotion: EmotionState;
  background: StudioBackground;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

// Module-scope math helpers to prevent garbage collection in render loop
const _clock = new THREE.Clock();

export const VTuberCanvas: React.FC<VTuberCanvasProps> = ({
  avatarConfig,
  trackingData,
  emotion,
  background,
  onCanvasReady,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to keep current props in render loop without re-triggering effect
  const propsRef = useRef({
    avatarConfig,
    trackingData,
    emotion,
    background,
  });
  propsRef.current = {
    avatarConfig,
    trackingData,
    emotion,
    background,
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      44,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    const initialViewMode = propsRef.current.avatarConfig.cameraViewMode || 'full_body';
    const initialZoom = propsRef.current.avatarConfig.cameraZoom || 0.9;
    const initialDist = (initialViewMode === 'full_body' ? 7.6 : 5.2) / initialZoom;
    const initialY = initialViewMode === 'full_body' ? 0.3 : 0.05;
    camera.position.set(0, initialY, initialDist);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // Needed for recording & screenshots
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;
    if (onCanvasReady) {
      onCanvasReady(renderer.domElement);
    }

    // 2. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Studio Lighting Rig
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(3, 4, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0x7090b0, 0x1a2030, 0.9);
    scene.add(hemiLight);

    // Rim / Backlight for sci-fi silhouette edge
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.8);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Accent under-glow light
    const underLight = new THREE.PointLight(0x00f0ff, 1.2, 8);
    underLight.position.set(0, -2, 1);
    scene.add(underLight);

    // 4. Studio Background & Floor Grid Objects
    const bgGroup = new THREE.Group();
    scene.add(bgGroup);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(24, 24, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -2.0;
    bgGroup.add(gridHelper);

    // Soft Radial Contact Shadow Plane beneath avatar
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext('2d')!;
    const radGrad = sctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    radGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = radGrad;
    sctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const contactShadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -1.98;
    scene.add(contactShadow);

    // Cyber particle dust
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 12;
      particlePos[i + 1] = (Math.random() - 0.5) * 8;
      particlePos[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    bgGroup.add(particlePoints);

    // Function to apply background modes
    function updateBackground(bg: StudioBackground, neon: string) {
      particleMat.color.set(neon);
      underLight.color.set(neon);
      rimLight.color.set(neon);

      switch (bg) {
        case 'chroma_green':
          scene.background = new THREE.Color(0x00b140);
          bgGroup.visible = false;
          contactShadow.visible = false;
          scene.fog = null;
          break;
        case 'chroma_blue':
          scene.background = new THREE.Color(0x0047bb);
          bgGroup.visible = false;
          contactShadow.visible = false;
          scene.fog = null;
          break;
        case 'neon_grid':
          scene.background = new THREE.Color(0x0a0518);
          bgGroup.visible = true;
          gridHelper.visible = true;
          contactShadow.visible = true;
          scene.fog = new THREE.FogExp2(0x0a0518, 0.08);
          break;
        case 'minimal_stage':
          scene.background = new THREE.Color(0x181a20);
          bgGroup.visible = true;
          gridHelper.visible = false;
          contactShadow.visible = true;
          scene.fog = new THREE.FogExp2(0x181a20, 0.06);
          break;
        case 'deep_space':
          scene.background = new THREE.Color(0x020409);
          bgGroup.visible = true;
          gridHelper.visible = false;
          contactShadow.visible = true;
          scene.fog = new THREE.FogExp2(0x020409, 0.05);
          break;
        case 'cyber_studio':
        default:
          scene.background = new THREE.Color(0x090d14);
          bgGroup.visible = true;
          gridHelper.visible = true;
          contactShadow.visible = true;
          scene.fog = new THREE.FogExp2(0x090d14, 0.07);
          break;
      }
    }

    // 5. Build Initial 3D Avatar
    let avatar: AvatarController = buildAvatar(propsRef.current.avatarConfig);
    scene.add(avatar.group);

    let currentAvatarShape = propsRef.current.avatarConfig.shape;
    let currentAvatarMaterial = propsRef.current.avatarConfig.material;
    let currentAvatarNeon = propsRef.current.avatarConfig.neonColor;
    let currentAvatarAccessory = propsRef.current.avatarConfig.accessory;
    let currentBg = propsRef.current.background;

    updateBackground(currentBg, currentAvatarNeon);

    // 6. Smooth Kinematic Trackers
    let currentPitch = 0;
    let currentYaw = 0;
    let currentRoll = 0;
    let currentX = 0;
    let currentY = 0;
    let currentZ = 0;
    let currentBlinkL = 0;
    let currentBlinkR = 0;
    let currentMouthOpen = 0;
    let currentMouthSmile = 0;

    let animId: number;

    // 7. Render Loop
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(_clock.getDelta(), 0.1);
      const elapsed = _clock.getElapsedTime();

      const { avatarConfig: cfg, trackingData: track, emotion: emo, background: bg } = propsRef.current;

      // Rebuild avatar if major properties change
      if (
        cfg.shape !== currentAvatarShape ||
        cfg.material !== currentAvatarMaterial ||
        cfg.neonColor !== currentAvatarNeon ||
        cfg.accessory !== currentAvatarAccessory
      ) {
        currentAvatarShape = cfg.shape;
        currentAvatarMaterial = cfg.material;
        currentAvatarNeon = cfg.neonColor;
        currentAvatarAccessory = cfg.accessory;
        scene.remove(avatar.group);
        avatar.dispose();
        avatar = buildAvatar(cfg);
        scene.add(avatar.group);
        updateBackground(bg, cfg.neonColor);
      }

      if (bg !== currentBg) {
        currentBg = bg;
        updateBackground(bg, cfg.neonColor);
      }

      // Smooth dynamic camera framing (Full Body vs Portrait & Zoom)
      const viewMode = cfg.cameraViewMode || 'full_body';
      const zoom = cfg.cameraZoom || 0.9;
      const targetDist = (viewMode === 'full_body' ? 7.6 : 5.2) / zoom;
      const targetCamY = viewMode === 'full_body' ? 0.3 : 0.05;
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetDist, 10, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 10, delta);

      // Smooth kinematics damping
      const dampFactor = 18;
      currentPitch = THREE.MathUtils.damp(currentPitch, track.pitch, dampFactor, delta);
      currentYaw = THREE.MathUtils.damp(currentYaw, track.yaw, dampFactor, delta);
      currentRoll = THREE.MathUtils.damp(currentRoll, track.roll, dampFactor, delta);

      currentX = THREE.MathUtils.damp(currentX, track.x, dampFactor, delta);
      currentY = THREE.MathUtils.damp(currentY, track.y, dampFactor, delta);
      currentZ = THREE.MathUtils.damp(currentZ, track.z, dampFactor, delta);

      // 2-second automatic blink cycle (at elapsed time)
      const blinkCycle = 2.0;
      const blinkPhase = elapsed % blinkCycle;
      const blinkDuration = 0.18; // 180ms blink duration
      let autoBlinkFactor = 0;
      if (blinkPhase < blinkDuration) {
        autoBlinkFactor = Math.sin((blinkPhase / blinkDuration) * Math.PI);
      }

      // 2-second automatic mouth open cycle (opens mouth rhythmically every 2 seconds)
      const mouthCycle = 2.0;
      // Slight 0.5s phase offset from blink so the avatar blinks and opens mouth naturally
      const mouthPhase = (elapsed + 0.6) % mouthCycle;
      const mouthDuration = 0.55; // 550ms cute, visible mouth opening and closing every 2 seconds
      let autoMouthFactor = 0;
      if (mouthPhase < mouthDuration) {
        autoMouthFactor = Math.sin((mouthPhase / mouthDuration) * Math.PI) * 0.82;
      }

      // Sound-driven mouth opening: opens immediately upon detecting sound with natural syllable bounce
      let soundMouthOpen = 0;
      if (track.audioVolume > 0.015) {
        const syllableBounce = 0.85 + 0.15 * Math.sin(elapsed * 24);
        soundMouthOpen = Math.min(1.35, (track.audioVolume * 2.8) * syllableBounce);
      }

      // Combine user camera/emotes with 2-second auto-blink, 2-second auto-mouth, and sound-driven mouth
      const combinedBlinkL = Math.max(track.eyeBlinkLeft, autoBlinkFactor);
      const combinedBlinkR = Math.max(track.eyeBlinkRight, autoBlinkFactor);
      const combinedMouthOpen = Math.max(track.mouthOpen, soundMouthOpen, autoMouthFactor);

      currentBlinkL = THREE.MathUtils.damp(currentBlinkL, combinedBlinkL, 35, delta);
      currentBlinkR = THREE.MathUtils.damp(currentBlinkR, combinedBlinkR, 35, delta);
      currentMouthOpen = THREE.MathUtils.damp(currentMouthOpen, combinedMouthOpen, 26, delta);
      currentMouthSmile = THREE.MathUtils.damp(currentMouthSmile, track.mouthSmile, 14, delta);

      // Contact shadow sync with avatar position
      contactShadow.position.x = currentX * 1.5;
      contactShadow.position.z = currentZ * 1.0;

      // Gentle floating particle drift
      const pPositions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pPositions[i] += delta * 0.2;
        if (pPositions[i] > 4) pPositions[i] = -4;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Update avatar with eyes & mouth tracking
      avatar.update(
        cfg,
        currentPitch,
        currentYaw,
        currentRoll,
        currentX,
        currentY,
        currentZ,
        currentBlinkL,
        currentBlinkR,
        track.eyeGazeX,
        track.eyeGazeY,
        currentMouthOpen,
        currentMouthSmile,
        track.mouthPucker,
        emo,
        track.audioVolume,
        elapsed
      );

      renderer.render(scene, camera);
    };

    // Pre-warm shader pipeline
    renderer.compile(scene, camera);
    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      scene.remove(avatar.group);
      avatar.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    />
  );
};
