export type AvatarShape =
  | 'sphere'
  | 'droplet'
  | 'cube'
  | 'triangle'
  | 'flower'
  | 'star'
  | 'heart'
  | 'mushroom'
  | 'capsule'
  | 'cloud'
  | 'diamond'
  | 'bear'
  | 'cat'
  | 'ufo';

export type RobotMaterial =
  | 'candy_pink'
  | 'mint_cream'
  | 'pearl_white'
  | 'titanium'
  | 'carbon'
  | 'chrome'
  | 'mecha_white'
  | 'stealth_onyx'
  | 'copper';

export type NeonColor =
  | '#ff70a6' // Sakura / Candy Pink
  | '#70d6ff' // Sky Mint Cyan
  | '#39ff14' // Neon Green
  | '#ffd670' // Sunshine Yellow
  | '#c77dff' // Lavender Dream
  | '#ffffff' // Ice White
  | '#00f0ff' // Cyber Cyan
  | '#ff007f'; // Hot Pink

export type EyeStyle =
  | 'kawaii_sparkle'
  | 'anime_led'
  | 'cute_arcs'
  | 'heart_eyes'
  | 'visor'
  | 'pixel_dots'
  | 'goggles';

export type MouthStyle =
  | 'chibi_cat'
  | 'chibi_smile'
  | 'neon_arc'
  | 'waveform'
  | 'mechanical_aperture';

export type AccessoryType =
  | 'none'
  | 'bunny_ears'
  | 'cat_ears'
  | 'angel_wings'
  | 'star_halo'
  | 'heart_antenna'
  | 'headphones'
  | 'satellites';

export type StudioBackground =
  | 'cyber_studio'
  | 'neon_grid'
  | 'chroma_green'
  | 'chroma_blue'
  | 'minimal_stage'
  | 'deep_space';

export type EmotionState =
  | 'neutral'
  | 'happy'
  | 'surprised'
  | 'cool'
  | 'blush'
  | 'wink'
  | 'angry'
  | 'love'
  | 'excited'
  | 'sleepy'
  | 'thinking'
  | 'crying_tears'
  | 'dizzy'
  | 'smug'
  | 'shocked';

export type CameraViewMode = 'full_body' | 'portrait';

export interface AvatarConfig {
  id: string;
  name: string;
  shape: AvatarShape;
  material: RobotMaterial;
  neonColor: NeonColor;
  secondaryColor: string;
  eyeStyle: EyeStyle;
  mouthStyle: MouthStyle;
  accessory: AccessoryType;
  metalness: number;
  roughness: number;
  bloomIntensity: number;
  scale: number;
  blushIntensity: number; // 0 to 1
  cameraViewMode: CameraViewMode;
  cameraZoom: number; // 0.6 to 1.5
}

export interface TrackingData {
  hasFace: boolean;
  // Head orientation in radians
  pitch: number; // nod up/down
  yaw: number;   // turn left/right
  roll: number;  // tilt side to side
  // Head position offsets normalized (-1 to 1)
  x: number;
  y: number;
  z: number;
  // Blendshapes (0 to 1)
  eyeBlinkLeft: number;
  eyeBlinkRight: number;
  eyeSquint: number;
  eyeWide: number;
  eyeGazeX: number; // -1 (look left) to +1 (look right)
  eyeGazeY: number; // -1 (look down) to +1 (look up)
  mouthOpen: number;
  mouthSmile: number;
  mouthPucker: number; // "O" shape / whistle
  mouthFrown: number;
  eyebrowRaise: number;
  audioVolume: number;
  audioPitch: number;
}

export interface TrackingSettings {
  headSensitivity: number;
  positionSensitivity: number;
  mouthSensitivity: number;
  blinkThreshold: number;
  mirrorCamera: boolean;
  useAudioLipSync: boolean;
  smoothingFactor: number; // 0.1 to 0.95
}

export interface RecordedVideo {
  blob: Blob;
  url: string;
  durationMs: number;
  createdAt: Date;
  sizeBytes: number;
  name: string;
  hasAudio: boolean;
}
