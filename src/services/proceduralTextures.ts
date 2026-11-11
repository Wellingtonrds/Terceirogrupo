import * as THREE from 'three';
import { AvatarConfig, EmotionState, EyeStyle, MouthStyle } from '../types/vtuber';

/**
 * Creates procedural brushed titanium texture
 */
export function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#788190');
  grad.addColorStop(0.5, '#9fa7b5');
  grad.addColorStop(1, '#68717f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 300; i++) {
    const y = Math.random() * 512;
    ctx.fillRect(0, y, 512, Math.random() * 2 + 1);
  }

  // Soft rounded panel seam
  ctx.strokeStyle = 'rgba(30, 36, 46, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 440, 440);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural cute glossy candy texture (Pink, Mint, Pearl)
 */
export function createGlossyCandyTexture(baseColor: string, accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Soft pearlescent radial highlight
  const grad = ctx.createRadialGradient(200, 160, 20, 256, 256, 300);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.06)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Cute subtle mecha star decal on side
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.4;
  drawSmallDecalStar(ctx, 420, 90, 14);
  drawSmallDecalStar(ctx, 90, 420, 10);
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawSmallDecalStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const ax = cx + Math.cos(a) * r;
    const ay = cy + Math.sin(a) * r;
    const bx = cx + Math.cos(a + Math.PI / 4) * (r * 0.3);
    const by = cy + Math.sin(a + Math.PI / 4) * (r * 0.3);
    if (i === 0) ctx.moveTo(ax, ay);
    else ctx.lineTo(ax, ay);
    ctx.lineTo(bx, by);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Creates procedural carbon fiber weave texture
 */
export function createCarbonFiberTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#14171c';
  ctx.fillRect(0, 0, 128, 128);

  const size = 16;
  for (let x = 0; x < 128; x += size) {
    for (let y = 0; y < 128; y += size) {
      const isAlt = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0;
      ctx.fillStyle = isAlt ? '#20242b' : '#2b313a';
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(x + 1, y + 1, size - 2, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * Creates procedural mecha white plating
 */
export function createMechaWhiteTexture(accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#edf2f7';
  ctx.fillRect(40, 40, 432, 432);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 432, 432);

  // Cute pastel accent stripe
  ctx.fillStyle = accentColor;
  ctx.fillRect(60, 50, 40, 8);
  ctx.fillRect(110, 50, 20, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural cyber circuit stealth texture
 */
export function createCircuitTexture(neonColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f141c';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = neonColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = neonColor;
  ctx.shadowBlur = 10;

  const paths = [
    [[40, 120], [120, 120], [160, 160], [220, 160]],
    [[60, 380], [140, 380], [180, 340], [280, 340]],
    [[470, 120], [390, 120], [350, 160], [290, 160]],
    [[450, 390], [370, 390], [330, 350], [250, 350]],
  ];

  paths.forEach((p) => {
    ctx.beginPath();
    ctx.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length; i++) {
      ctx.lineTo(p[i][0], p[i][1]);
    }
    ctx.stroke();

    const last = p[p.length - 1];
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(last[0], last[1], 5, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Ultra-Kawaii Dynamic Robotic Face Canvas.
 * Renders expressive, sparkling anime/mecha eyes, responsive mouth shapes
 * (open, smile, "O" pucker, laugh) and cute blushing cheeks at 60 FPS!
 */
export class RoboticFaceCanvas {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public texture: THREE.CanvasTexture;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 8;
  }

  public render(
    config: AvatarConfig,
    blinkL: number,
    blinkR: number,
    gazeX: number,
    gazeY: number,
    mouthOpen: number,
    mouthSmile: number,
    mouthPucker: number,
    emotion: EmotionState,
    audioVol: number,
    time: number
  ) {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    const neon = config.neonColor;

    // Clear background - smooth, deep cute dark glass screen
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, w, h);

    // Soft rounded visor border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(16, 16, w - 32, h - 32, 36);
    ctx.stroke();

    // Subtle kawaii top decoration: mini glowing heart or star in center forehead
    this.drawForeheadIcon(ctx, neon, emotion, time);

    // 1. Draw Eyes with independent blink and gaze look tracking
    this.drawKawaiiEyes(
      ctx,
      config.eyeStyle,
      blinkL,
      blinkR,
      gazeX,
      gazeY,
      mouthSmile,
      emotion,
      neon,
      time
    );

    // 2. Draw Mouth mimicking the user (open, smile, pucker, talk)
    this.drawKawaiiMouth(
      ctx,
      config.mouthStyle,
      mouthOpen,
      mouthSmile,
      mouthPucker,
      emotion,
      audioVol,
      neon,
      time
    );

    // 3. Draw Kawaii Glowing Blushing Cheeks
    this.drawKawaiiCheeks(ctx, mouthSmile, emotion, time);

    this.texture.needsUpdate = true;
  }

  private drawForeheadIcon(
    ctx: CanvasRenderingContext2D,
    neon: string,
    emotion: EmotionState,
    time: number
  ) {
    ctx.save();
    ctx.translate(256, 68);

    switch (emotion) {
      case 'love': {
        // Beating mini heart
        const scale = 1 + Math.sin(time * 6) * 0.18;
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ff2a85';
        ctx.shadowColor = '#ff2a85';
        ctx.shadowBlur = 12;
        this.drawHeartPath(ctx, 0, 0, 12);
        ctx.fill();
        break;
      }
      case 'angry': {
        // Anime anger vein mark 💢
        ctx.strokeStyle = '#ff2244';
        ctx.shadowColor = '#ff2244';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        const s = 10;
        // 4 curved brackets
        [
          [-s, -s, 0, -s * 1.5, s, -s],
          [-s, s, 0, s * 1.5, s, s],
          [-s, -s, -s * 1.5, 0, -s, s],
          [s, -s, s * 1.5, 0, s, s],
        ].forEach(([x1, y1, cx, cy, x2, y2]) => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(cx, cy, x2, y2);
          ctx.stroke();
        });
        break;
      }
      case 'excited': {
        // Double sparkling star
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 14;
        const scale = 1 + Math.sin(time * 8) * 0.2;
        ctx.scale(scale, scale);
        drawSmallDecalStar(ctx, 0, 0, 11);
        break;
      }
      case 'sleepy': {
        // Floating Z z Z
        ctx.fillStyle = '#a5b4fc';
        ctx.shadowColor = '#a5b4fc';
        ctx.shadowBlur = 8;
        ctx.font = 'bold 16px "JetBrains Mono", sans-serif';
        const zOffset = Math.sin(time * 3) * 4;
        ctx.fillText('Z', -8, -zOffset);
        ctx.font = 'bold 11px "JetBrains Mono", sans-serif';
        ctx.fillText('z', 6, -10 - zOffset);
        break;
      }
      case 'thinking': {
        // Question bubble / icon ?
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.font = 'bold 18px "JetBrains Mono", sans-serif';
        ctx.fillText('?', -5, 6);
        break;
      }
      case 'shocked': {
        // Lightning bolt ⚡
        ctx.fillStyle = '#fde047';
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(2, -12);
        ctx.lineTo(-6, 0);
        ctx.lineTo(0, 0);
        ctx.lineTo(-4, 12);
        ctx.lineTo(8, -2);
        ctx.lineTo(2, -2);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'surprised': {
        // Alert exclamation mark !
        ctx.fillStyle = neon;
        ctx.shadowColor = neon;
        ctx.shadowBlur = 12;
        ctx.font = 'bold 20px "JetBrains Mono", sans-serif';
        ctx.fillText('!', -4, 6);
        break;
      }
      case 'crying_tears': {
        // Teardrop icon
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 4, 6, 0, Math.PI);
        ctx.lineTo(0, -8);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'dizzy': {
        // Mini spinning spiral
        ctx.strokeStyle = '#c084fc';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.2) {
          const r = a * 1.8;
          const x = Math.cos(a + time * 6) * r;
          const y = Math.sin(a + time * 6) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        break;
      }
      case 'cool': {
        // Cyber diamond
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(8, 0);
        ctx.lineTo(0, 9);
        ctx.lineTo(-8, 0);
        ctx.closePath();
        ctx.fill();
        break;
      }
      default: {
        // Cute 4-point twinkle star
        ctx.fillStyle = neon;
        ctx.shadowColor = neon;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2;
          const ax = Math.cos(a) * 8;
          const ay = Math.sin(a) * 8;
          const bx = Math.cos(a + Math.PI / 4) * 2.5;
          const by = Math.sin(a + Math.PI / 4) * 2.5;
          if (i === 0) ctx.moveTo(ax, ay);
          else ctx.lineTo(ax, ay);
          ctx.lineTo(bx, by);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }

  private drawKawaiiEyes(
    ctx: CanvasRenderingContext2D,
    style: EyeStyle,
    blinkL: number,
    blinkR: number,
    gazeX: number,
    gazeY: number,
    smileRatio: number,
    emotion: EmotionState,
    neon: string,
    time: number
  ) {
    const eyeY = 205;
    const leftX = 155;
    const rightX = 357;

    // Independent left & right blink ratios
    let scaleL = Math.max(0.06, 1 - blinkL);
    let scaleR = Math.max(0.06, 1 - blinkR);

    // Emotion overrides for eye opening
    let effectiveStyle = style;
    let customGazeX = gazeX;
    let customGazeY = gazeY;

    if (emotion === 'happy') {
      // Squint into cute happy anime crescents ^ ^
      scaleL = Math.min(scaleL, 0.1);
      scaleR = Math.min(scaleR, 0.1);
    } else if (emotion === 'wink') {
      scaleR = 0.06; // right eye winks
    } else if (emotion === 'smug') {
      scaleL = Math.min(scaleL, 0.45);
      scaleR = 0.08; // cheeky winking smirk
    } else if (emotion === 'sleepy') {
      scaleL = 0.08;
      scaleR = 0.08;
    } else if (emotion === 'love') {
      effectiveStyle = 'heart_eyes';
    } else if (emotion === 'thinking') {
      customGazeX = -0.7;
      customGazeY = 0.6;
      scaleL = Math.min(scaleL, 0.6);
    } else if (emotion === 'surprised' || emotion === 'shocked') {
      scaleL = 1.0;
      scaleR = 1.0;
    } else if (emotion === 'excited') {
      effectiveStyle = 'kawaii_sparkle';
      scaleL = 1.0;
      scaleR = 1.0;
    }

    // Draw Left Eye
    this.drawSingleKawaiiEye(
      ctx,
      effectiveStyle,
      leftX,
      eyeY,
      scaleL,
      customGazeX,
      customGazeY,
      smileRatio,
      emotion,
      neon,
      true,
      time
    );

    // Draw Right Eye
    this.drawSingleKawaiiEye(
      ctx,
      effectiveStyle,
      rightX,
      eyeY,
      scaleR,
      customGazeX,
      customGazeY,
      smileRatio,
      emotion,
      neon,
      false,
      time
    );
  }

  private drawSingleKawaiiEye(
    ctx: CanvasRenderingContext2D,
    style: EyeStyle,
    cx: number,
    cy: number,
    openRatio: number,
    gazeX: number,
    gazeY: number,
    smileRatio: number,
    emotion: EmotionState,
    neon: string,
    isLeft: boolean,
    time: number
  ) {
    ctx.save();
    ctx.translate(cx, cy);

    ctx.shadowColor = neon;
    ctx.shadowBlur = 16;
    ctx.fillStyle = neon;
    ctx.strokeStyle = neon;

    const isBlinking = openRatio < 0.22;

    if (isBlinking) {
      // Adorable Happy Blinking / Winking Arc ^
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      // Curved upward arc ^
      ctx.moveTo(-40, 6);
      ctx.quadraticCurveTo(0, -26, 40, 6);
      ctx.stroke();

      // Cute eyelashes at outer corner
      ctx.lineWidth = 4;
      const lashDir = isLeft ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(36 * lashDir, -6);
      ctx.lineTo(48 * lashDir, -18);
      ctx.stroke();

      ctx.restore();
      return;
    }

    // Emotion: DIZZY (Spinning Hypnotic Spirals @ @)
    if (emotion === 'dizzy') {
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#c084fc';
      ctx.shadowColor = '#c084fc';
      ctx.beginPath();
      const spinSpeed = time * 8;
      for (let a = 0; a < Math.PI * 5; a += 0.25) {
        const r = a * 5.2;
        const x = Math.cos(a + (isLeft ? spinSpeed : -spinSpeed)) * r;
        const y = Math.sin(a + (isLeft ? spinSpeed : -spinSpeed)) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Emotion: SLEEPY (Droopy resting horizontal lines - -)
    if (emotion === 'sleepy') {
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-36, 0);
      ctx.quadraticCurveTo(0, 10, 36, 0);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Emotion: COOL (Cyber Sunglasses / Visor Shade across eyes)
    if (emotion === 'cool') {
      const sw = 48;
      const sh = 28;
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-sw / 2, -sh / 2, sw, sh, 8);
      ctx.fill();
      ctx.stroke();

      // Sharp white futuristic reflection stripe
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-sw * 0.3, -sh * 0.25);
      ctx.lineTo(sw * 0.3, sh * 0.25);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Pupil shift based on gaze
    let pupilShiftX = gazeX * 18;
    let pupilShiftY = gazeY * 12;

    // Emotion: SHOCKED (Tiny trembling pinpoint pupils in wide glowing eye socket)
    if (emotion === 'shocked') {
      const jitterX = (Math.random() - 0.5) * 4;
      const jitterY = (Math.random() - 0.5) * 4;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(jitterX, jitterY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Emotion: ANGRY (Sharp inward slanting eyebrows and fierce pupils)
    if (emotion === 'angry') {
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#ff3344';
      ctx.shadowColor = '#ff3344';
      // Angled sharp brow \ /
      const browDir = isLeft ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(-38 * browDir, -42);
      ctx.lineTo(38 * browDir, -22);
      ctx.stroke();
    }

    switch (style) {
      case 'heart_eyes': {
        // Glowing heart eyes (super kawaii love emote!)
        const hSize = (32 + Math.sin(time * 5) * 3) * Math.min(1, openRatio * 1.2);
        ctx.fillStyle = '#ff2a85';
        ctx.shadowColor = '#ff2a85';
        ctx.save();
        ctx.translate(pupilShiftX * 0.7, pupilShiftY * 0.7);
        this.drawHeartPath(ctx, 0, 0, hSize);
        ctx.fill();

        // Shiny glint on top-left lobe
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-hSize * 0.35, -hSize * 0.35, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }

      case 'anime_led':
      case 'kawaii_sparkle': {
        // Big cute sparkling anime mecha eye
        const eyeW = 44;
        const eyeH = 64 * Math.max(0.2, openRatio);

        // Eye White / Glow Base
        ctx.beginPath();
        ctx.ellipse(0, 0, eyeW, eyeH, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner darker iris ring
        ctx.fillStyle = '#060a12';
        ctx.beginPath();
        ctx.ellipse(pupilShiftX, pupilShiftY, eyeW * 0.8, eyeH * 0.82, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glowing colored pupil
        ctx.fillStyle = emotion === 'angry' ? '#ff3344' : neon;
        ctx.beginPath();
        ctx.ellipse(
          pupilShiftX,
          pupilShiftY + eyeH * 0.15,
          eyeW * 0.55,
          eyeH * 0.55,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Double Sparkling Anime Glints (Kawaii sparkles)
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;

        // Big upper glint
        ctx.beginPath();
        ctx.ellipse(
          pupilShiftX - eyeW * 0.28,
          pupilShiftY - eyeH * 0.26,
          eyeW * 0.28,
          eyeH * 0.24,
          -0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Small lower glint
        ctx.beginPath();
        ctx.arc(
          pupilShiftX + eyeW * 0.24,
          pupilShiftY + eyeH * 0.26,
          eyeW * 0.14,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Extra cute mini star glint
        drawSmallDecalStar(ctx, pupilShiftX + eyeW * 0.22, pupilShiftY - eyeH * 0.18, 6);

        // Upper cute anime eyelid line
        ctx.lineWidth = 5;
        ctx.strokeStyle = emotion === 'angry' ? '#ff3344' : neon;
        ctx.beginPath();
        ctx.arc(0, -eyeH * 0.35, eyeW * 1.05, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        break;
      }

      case 'cute_arcs': {
        // Friendly rounded mecha pill eyes with shiny dot
        const rw = 36;
        const rh = 54 * openRatio;
        ctx.beginPath();
        ctx.roundRect(-rw / 2, -rh / 2, rw, rh, 18);
        ctx.fill();

        // Glint follows gaze
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pupilShiftX * 0.6 - 5, pupilShiftY * 0.6 - rh * 0.22, 7, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'visor': {
        // Continuous sleek horizontal visor band with bright focal eye segments
        const h = 46 * openRatio;
        ctx.fillRect(-45, -h / 2, 90, h);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pupilShiftX - 16, pupilShiftY - h / 4, 32, h / 2);
        break;
      }

      case 'pixel_dots': {
        const dotSize = 9;
        const gap = 5;
        for (let row = -2; row <= 2; row++) {
          for (let col = -2; col <= 2; col++) {
            if (openRatio < 0.6 && Math.abs(row) > 1) continue;
            ctx.beginPath();
            ctx.arc(
              col * (dotSize + gap) + pupilShiftX * 0.4,
              row * (dotSize + gap) * openRatio + pupilShiftY * 0.4,
              dotSize / 2,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
        break;
      }

      case 'goggles':
      default: {
        const r = 44 * Math.min(1, openRatio * 1.1);
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pupilShiftX, pupilShiftY, r * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pupilShiftX - 6, pupilShiftY - 6, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }

  private drawKawaiiMouth(
    ctx: CanvasRenderingContext2D,
    style: MouthStyle,
    openRatio: number,
    smileRatio: number,
    puckerRatio: number,
    emotion: EmotionState,
    audioVol: number,
    neon: string,
    time: number
  ) {
    const mx = 256;
    const my = 352;

    // Sound-driven vocalization check
    const isSoundDetected = audioVol > 0.015;
    const speechSyllable = Math.abs(Math.sin(time * 18)) * 0.45 + Math.sin(time * 8) * 0.2;
    
    // Calculate effective opening: responsive to camera, 2s auto-timer, and audio
    let effectiveOpen = Math.max(0, openRatio);
    if (isSoundDetected) {
      const soundDrivenOpen = Math.min(1.35, Math.max(0.18, audioVol * 2.6 + speechSyllable * 0.6));
      effectiveOpen = Math.max(effectiveOpen, soundDrivenOpen);
    }

    // Emotion open overrides
    if (emotion === 'excited') {
      effectiveOpen = Math.max(effectiveOpen, 0.65);
    } else if (emotion === 'surprised' || emotion === 'shocked') {
      effectiveOpen = Math.max(effectiveOpen, 0.75);
    }

    ctx.save();
    ctx.translate(mx, my);

    ctx.strokeStyle = neon;
    ctx.fillStyle = neon;
    ctx.shadowColor = neon;
    ctx.shadowBlur = 14;

    // Case 1: Pucker "O" mouth (when user rounds lips or says "ooh/uuh")
    if (puckerRatio > 0.35 && effectiveOpen < 0.55 && !isSoundDetected) {
      const oRadius = 14 + puckerRatio * 16;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, oRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner mouth dark cavity
      ctx.fillStyle = '#06090e';
      ctx.beginPath();
      ctx.arc(0, 0, oRadius - 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Case 2: Open Talking Mouth - Triggered on 2s interval, sound detection, or camera open
    if (effectiveOpen > 0.12) {
      const speechWidthPulse = isSoundDetected ? Math.sin(time * 14) * 5 : 0;
      const mw = 42 + smileRatio * 26 + effectiveOpen * 20 + speechWidthPulse;
      const mh = 22 + effectiveOpen * 52;

      // Outer mouth glow border
      ctx.beginPath();
      ctx.ellipse(0, 0, mw / 2, mh / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dark inner throat cavity
      ctx.fillStyle = '#080c14';
      ctx.beginPath();
      ctx.ellipse(0, -2, mw / 2 - 5, mh / 2 - 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Animated Chibi Tongue bobbing
      const tongueBob = isSoundDetected ? Math.sin(time * 18) * 3 : Math.sin(time * 6) * 1.5;
      ctx.fillStyle = '#ff4d94';
      ctx.shadowColor = '#ff4d94';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, mh * 0.2 + tongueBob, mw * 0.24, 0, Math.PI);
      ctx.fill();

      // Cute anime mecha fangs for cat mouth style
      if (style === 'chibi_cat' || emotion === 'smug') {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        // left fang
        ctx.beginPath();
        ctx.moveTo(-mw * 0.25, -mh * 0.35);
        ctx.lineTo(-mw * 0.2, -mh * 0.05);
        ctx.lineTo(-mw * 0.15, -mh * 0.35);
        ctx.fill();
        // right fang
        ctx.beginPath();
        ctx.moveTo(mw * 0.15, -mh * 0.35);
        ctx.lineTo(mw * 0.2, -mh * 0.05);
        ctx.lineTo(mw * 0.25, -mh * 0.35);
        ctx.fill();
      }

      ctx.restore();
      return;
    }

    // Case 3: Closed Mouth with Emotion Overrides
    if (emotion === 'crying_tears') {
      // Trembling wavy crying mouth
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-24, 0);
      ctx.quadraticCurveTo(-12, -8, 0, 0);
      ctx.quadraticCurveTo(12, -8, 24, 0);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (emotion === 'angry') {
      // Sharp downward angry grimace
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#ff3344';
      ctx.shadowColor = '#ff3344';
      ctx.beginPath();
      ctx.moveTo(-28, 8);
      ctx.quadraticCurveTo(0, -6, 28, 8);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (emotion === 'thinking') {
      // Small squiggly wavy mouth ~
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.quadraticCurveTo(-9, 5, 0, 0);
      ctx.quadraticCurveTo(9, -5, 18, 0);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (emotion === 'smug') {
      // Cocky smirk tilted right
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-16, 4);
      ctx.quadraticCurveTo(4, 12, 24, -4);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (emotion === 'sleepy') {
      // Tiny cute snoozing "o"
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Default styles
    switch (style) {
      case 'chibi_cat':
      default: {
        // Adorable :3 Cat Mouth
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        const curveY = 10 + smileRatio * 14;

        // Left lobe of :3
        ctx.beginPath();
        ctx.arc(-13, 0, 13, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // Right lobe of :3
        ctx.beginPath();
        ctx.arc(13, 0, 13, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // Center tiny tick
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -4);
        ctx.stroke();
        break;
      }

      case 'chibi_smile': {
        // Cute smiling arc
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        const smileBend = 10 + smileRatio * 18;
        ctx.beginPath();
        ctx.moveTo(-32, -smileBend * 0.3);
        ctx.quadraticCurveTo(0, smileBend, 32, -smileBend * 0.3);
        ctx.stroke();
        break;
      }

      case 'neon_arc': {
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        const smileBend = 12 + smileRatio * 20;
        ctx.beginPath();
        ctx.moveTo(-36, -smileBend * 0.25);
        ctx.quadraticCurveTo(0, smileBend, 36, -smileBend * 0.25);
        ctx.stroke();
        break;
      }

      case 'waveform': {
        // Equalizer sound wave bars
        const bars = 9;
        const spacing = 12;
        const totalW = (bars - 1) * spacing;
        ctx.fillStyle = neon;
        for (let i = 0; i < bars; i++) {
          const x = -totalW / 2 + i * spacing;
          const dist = Math.abs(i - 4) / 4;
          const barH = Math.max(6, (14 + 60 * effectiveOpen) * Math.cos(dist * 1.5));
          ctx.beginPath();
          ctx.roundRect(x - 3, -barH / 2, 6, barH, 3);
          ctx.fill();
        }
        break;
      }

      case 'mechanical_aperture': {
        const radius = 16 + 26 * effectiveOpen;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
    }

    ctx.restore();
  }

  private drawKawaiiCheeks(
    ctx: CanvasRenderingContext2D,
    smileRatio: number,
    emotion: EmotionState,
    time: number
  ) {
    const isBlushing =
      emotion === 'blush' ||
      emotion === 'love' ||
      emotion === 'happy' ||
      emotion === 'excited' ||
      smileRatio > 0.25;
    const cheekY = 268;
    const blushColor = emotion === 'angry' ? '#ff3344' : '#ff4d94';

    [125, 387].forEach((cx, idx) => {
      ctx.save();
      ctx.translate(cx, cheekY);

      // Emotion: CRYING TEARS (Cascading anime streams of blue tears)
      if (emotion === 'crying_tears') {
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;

        // Big tear pool under eye
        ctx.beginPath();
        ctx.ellipse(0, -12, 22, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2 dripping tear streams flowing down
        const dripCycle1 = (time * 120 + idx * 40) % 90;
        const dripCycle2 = (time * 100 + idx * 70 + 45) % 90;

        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-6, -10);
        ctx.lineTo(-6, -10 + dripCycle1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(8, -10);
        ctx.lineTo(8, -10 + dripCycle2);
        ctx.stroke();

        // Little splashing teardrop at tip
        ctx.beginPath();
        ctx.arc(-6, -10 + dripCycle1 + 3, 4, 0, Math.PI * 2);
        ctx.arc(8, -10 + dripCycle2 + 3, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return;
      }

      if (isBlushing) {
        ctx.fillStyle = blushColor;
        ctx.shadowColor = blushColor;
        ctx.shadowBlur = 18;

        // Soft rosy round glowing blush
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3 Cute Anime Blush Lines (///)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (let l = -1; l <= 1; l++) {
          ctx.beginPath();
          ctx.moveTo(l * 10 - 4, -6);
          ctx.lineTo(l * 10 + 4, 6);
          ctx.stroke();
        }

        // Floating twinkle heart or star
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 4;
        drawSmallDecalStar(ctx, (idx === 0 ? -1 : 1) * 22, -14, 5);
      } else {
        // Resting gentle pastel glow
        ctx.fillStyle = 'rgba(255, 110, 166, 0.22)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 24, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  private drawHeartPath(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    // bottom left curve
    ctx.bezierCurveTo(
      x - size / 2,
      y + (size + topCurveHeight) / 2,
      x,
      y + (size + topCurveHeight) / 2,
      x,
      y + size
    );
    // bottom right curve
    ctx.bezierCurveTo(
      x,
      y + (size + topCurveHeight) / 2,
      x + size / 2,
      y + (size + topCurveHeight) / 2,
      x + size / 2,
      y + topCurveHeight
    );
    // top right curve
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
  }
}
