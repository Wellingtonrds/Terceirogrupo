import * as THREE from 'three';
import { AvatarConfig, AvatarShape, EmotionState } from '../../types/vtuber';
import {
  createBrushedMetalTexture,
  createCarbonFiberTexture,
  createCircuitTexture,
  createGlossyCandyTexture,
  createMechaWhiteTexture,
  RoboticFaceCanvas,
} from '../../services/proceduralTextures';

export interface AvatarController {
  group: THREE.Group;
  faceCanvas: RoboticFaceCanvas;
  update: (
    config: AvatarConfig,
    pitch: number,
    yaw: number,
    roll: number,
    x: number,
    y: number,
    z: number,
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
  ) => void;
  dispose: () => void;
}

export function buildAvatar(config: AvatarConfig): AvatarController {
  const rootGroup = new THREE.Group();
  const avatarRig = new THREE.Group();
  rootGroup.add(avatarRig);

  const faceCanvas = new RoboticFaceCanvas();

  // Procedural body material cache
  let currentMatKey = '';
  let bodyMaterial: THREE.MeshPhysicalMaterial;
  let accentMaterial: THREE.MeshStandardMaterial;
  let darkChassisMaterial: THREE.MeshStandardMaterial;
  let faceScreenMaterial: THREE.MeshBasicMaterial;

  function initMaterials() {
    const key = `${config.material}_${config.neonColor}`;
    if (key === currentMatKey && bodyMaterial) return;
    currentMatKey = key;

    const neon = new THREE.Color(config.neonColor);

    accentMaterial = new THREE.MeshStandardMaterial({
      color: neon,
      emissive: neon,
      emissiveIntensity: 1.4,
      roughness: 0.2,
      metalness: 0.7,
    });

    darkChassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x141822,
      roughness: 0.5,
      metalness: 0.6,
    });

    faceScreenMaterial = new THREE.MeshBasicMaterial({
      map: faceCanvas.texture,
      transparent: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    switch (config.material) {
      case 'candy_pink': {
        const tex = createGlossyCandyTexture('#ffb3d9', config.neonColor);
        bodyMaterial = new THREE.MeshPhysicalMaterial({
          map: tex,
          color: 0xffb6db,
          roughness: 0.2,
          metalness: 0.1,
          clearcoat: 0.9,
          clearcoatRoughness: 0.1,
        });
        break;
      }
      case 'mint_cream': {
        const tex = createGlossyCandyTexture('#bbf7d0', config.neonColor);
        bodyMaterial = new THREE.MeshPhysicalMaterial({
          map: tex,
          color: 0xa7f3d0,
          roughness: 0.22,
          metalness: 0.15,
          clearcoat: 0.85,
        });
        break;
      }
      case 'pearl_white': {
        const tex = createGlossyCandyTexture('#f8fafc', config.neonColor);
        bodyMaterial = new THREE.MeshPhysicalMaterial({
          map: tex,
          color: 0xffffff,
          roughness: 0.12,
          metalness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 0.9,
        });
        break;
      }
      case 'carbon': {
        const tex = createCarbonFiberTexture();
        bodyMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x22262c,
          roughnessMap: tex,
          roughness: 0.45,
          metalness: 0.6,
          clearcoat: 0.8,
        });
        break;
      }
      case 'chrome': {
        bodyMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.05,
          metalness: 0.98,
          clearcoat: 1.0,
        });
        break;
      }
      case 'mecha_white': {
        const tex = createMechaWhiteTexture(config.neonColor);
        bodyMaterial = new THREE.MeshPhysicalMaterial({
          map: tex,
          color: 0xf1f5f9,
          roughness: 0.3,
          metalness: 0.2,
          clearcoat: 0.6,
        });
        break;
      }
      case 'stealth_onyx': {
        const tex = createCircuitTexture(config.neonColor);
        bodyMaterial = new THREE.MeshPhysicalMaterial({
          map: tex,
          color: 0x11141a,
          roughness: 0.5,
          metalness: 0.85,
        });
        break;
      }
      case 'copper': {
        bodyMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xdd7e3b,
          roughness: 0.25,
          metalness: 0.9,
          clearcoat: 0.4,
        });
        break;
      }
      case 'titanium':
      default: {
        const tex = createBrushedMetalTexture();
        bodyMaterial = new THREE.MeshPhysicalMaterial({
          bumpMap: tex,
          bumpScale: 0.03,
          color: 0x8892a0,
          roughness: 0.28,
          metalness: 0.92,
          clearcoat: 0.6,
        });
        break;
      }
    }
  }

  initMaterials();

  // Sub-groups
  const shapeGroup = new THREE.Group();
  const accessoryGroup = new THREE.Group();
  avatarRig.add(shapeGroup);
  avatarRig.add(accessoryGroup);

  // Dynamic animated nodes
  const petals: THREE.Group[] = [];
  const wings: THREE.Group[] = [];
  const satellites: THREE.Group[] = [];
  const orbitalShards: THREE.Mesh[] = [];
  let haloMesh: THREE.Mesh | null = null;
  let heartAntennaMesh: THREE.Group | null = null;
  let bunnyEars: THREE.Group[] = [];
  let catTail: THREE.Group | null = null;
  let ufoRing: THREE.Group | null = null;

  function constructShape(shape: AvatarShape) {
    while (shapeGroup.children.length > 0) {
      const obj = shapeGroup.children[0];
      shapeGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    }
    petals.length = 0;
    orbitalShards.length = 0;
    catTail = null;
    ufoRing = null;

    switch (shape) {
      case 'sphere':
        constructKawaiiSphere();
        break;
      case 'droplet':
        constructKawaiiDroplet();
        break;
      case 'cube':
        constructKawaiiCube();
        break;
      case 'triangle':
        constructKawaiiTriangle();
        break;
      case 'flower':
        constructKawaiiFlower();
        break;
      case 'star':
        constructKawaiiStar();
        break;
      case 'heart':
        constructKawaiiHeart();
        break;
      case 'mushroom':
        constructKawaiiMushroom();
        break;
      case 'capsule':
        constructKawaiiCapsule();
        break;
      case 'cloud':
        constructKawaiiCloud();
        break;
      case 'diamond':
        constructKawaiiDiamond();
        break;
      case 'bear':
        constructKawaiiBear();
        break;
      case 'cat':
        constructKawaiiCat();
        break;
      case 'ufo':
        constructKawaiiUfo();
        break;
    }
  }

  // --- 1. BOLINHA FOFA (KAWAII CHIBI ORB) ---
  function constructKawaiiSphere() {
    const radius = 1.35;

    // Chubby round sphere body
    const bodyGeo = new THREE.SphereGeometry(radius, 48, 48);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
    bodyMesh.castShadow = true;
    shapeGroup.add(bodyMesh);

    // Glowing equator band
    const ringGeo = new THREE.TorusGeometry(radius * 1.01, 0.045, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, accentMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    shapeGroup.add(ringMesh);

    // Rounded face bezel frame
    const bezelGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.08, 32);
    const bezelMesh = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezelMesh.rotation.x = Math.PI / 2;
    bezelMesh.position.set(0, 0.05, radius * 0.76);
    shapeGroup.add(bezelMesh);

    // Front screen
    const faceGeo = new THREE.PlaneGeometry(0.98, 0.98);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0.05, radius * 0.81);
    shapeGroup.add(faceMesh);

    // Cute side ear pods
    [-1, 1].forEach((side) => {
      const earGroup = new THREE.Group();
      const earBaseGeo = new THREE.SphereGeometry(0.32, 24, 24);
      const earBase = new THREE.Mesh(earBaseGeo, darkChassisMaterial);
      earBase.scale.set(0.6, 1, 1);

      const earAccentGeo = new THREE.TorusGeometry(0.24, 0.035, 12, 24);
      const earAccent = new THREE.Mesh(earAccentGeo, accentMaterial);
      earAccent.rotation.y = (Math.PI / 2) * side;

      earGroup.add(earBase);
      earGroup.add(earAccent);
      earGroup.position.set(side * (radius * 0.92), 0.08, 0);
      shapeGroup.add(earGroup);
    });

    // Cute little floating robotic paws at bottom
    [-0.55, 0.55].forEach((px) => {
      const pawGeo = new THREE.SphereGeometry(0.22, 20, 20);
      pawGeo.scale(1, 0.65, 1.2);
      const paw = new THREE.Mesh(pawGeo, bodyMaterial);
      paw.position.set(px, -radius * 0.72, radius * 0.45);
      shapeGroup.add(paw);

      // Pink pad accent
      const padGeo = new THREE.SphereGeometry(0.09, 12, 12);
      padGeo.scale(1, 0.2, 1);
      const pad = new THREE.Mesh(padGeo, accentMaterial);
      pad.position.set(px, -radius * 0.71 + 0.12, radius * 0.5);
      shapeGroup.add(pad);
    });
  }

  // --- 2. GOTA FOFA (KAWAII BABY DROPLET) ---
  function constructKawaiiDroplet() {
    const points: THREE.Vector2[] = [];
    const segments = 28;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = (1 - t) * 2.4 - 0.9;
      // Chubby rounded baby teardrop equation
      const r = Math.sin(t * Math.PI) * Math.pow(t, 0.35) * 1.45;
      points.push(new THREE.Vector2(Math.max(0.01, r), y));
    }

    const dropGeo = new THREE.LatheGeometry(points, 48);
    dropGeo.computeVertexNormals();
    const dropMesh = new THREE.Mesh(dropGeo, bodyMaterial);
    dropMesh.castShadow = true;
    shapeGroup.add(dropMesh);

    // Front screen
    const faceGeo = new THREE.PlaneGeometry(0.96, 0.96);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, -0.1, 1.02);
    shapeGroup.add(faceMesh);

    // Screen bezel
    const bezelGeo = new THREE.BoxGeometry(1.05, 1.05, 0.05);
    const bezelMesh = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezelMesh.position.set(0, -0.1, 0.98);
    shapeGroup.add(bezelMesh);

    // Cute candy glowing tip
    const tipGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const tipMesh = new THREE.Mesh(tipGeo, accentMaterial);
    tipMesh.position.set(0, 1.5, 0);
    shapeGroup.add(tipMesh);

    // Floating candy ring around droplet
    const ringGeo = new THREE.TorusGeometry(1.36, 0.045, 16, 48);
    const ringMesh = new THREE.Mesh(ringGeo, accentMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0, -0.18, 0);
    shapeGroup.add(ringMesh);
  }

  // --- 3. QUADRADO FOFO (KAWAII RETRO CHIBI BOX) ---
  function constructKawaiiCube() {
    const size = 1.95;

    // Rounded chassis
    const cubeGeo = new THREE.BoxGeometry(size, size, size * 0.85);
    const cubeMesh = new THREE.Mesh(cubeGeo, bodyMaterial);
    cubeMesh.castShadow = true;
    shapeGroup.add(cubeMesh);

    // Screen frame
    const bezelGeo = new THREE.BoxGeometry(1.42, 1.42, 0.1);
    const bezelMesh = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezelMesh.position.set(0, 0.05, size * 0.425 + 0.02);
    shapeGroup.add(bezelMesh);

    // Front screen
    const faceGeo = new THREE.PlaneGeometry(1.26, 1.26);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0.05, size * 0.425 + 0.08);
    shapeGroup.add(faceMesh);

    // Cute rounded corner buttons / cheeks
    const cornerGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const corners = [
      [-0.78, 0.78],
      [0.78, 0.78],
      [-0.78, -0.7],
      [0.78, -0.7],
    ];
    corners.forEach(([cx, cy]) => {
      const b = new THREE.Mesh(cornerGeo, accentMaterial);
      b.position.set(cx, cy, size * 0.425 + 0.04);
      shapeGroup.add(b);
    });

    // Cute little top antenna with star
    const antStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12);
    const antStem = new THREE.Mesh(antStemGeo, darkChassisMaterial);
    antStem.position.set(0, size * 0.5 + 0.25, 0);
    shapeGroup.add(antStem);

    const starTipGeo = new THREE.OctahedronGeometry(0.16);
    const starTip = new THREE.Mesh(starTipGeo, accentMaterial);
    starTip.position.set(0, size * 0.5 + 0.52, 0);
    shapeGroup.add(starTip);
  }

  // --- 4. TRIÂNGULO FOFO (KAWAII ONIGIRI PRISM) ---
  function constructKawaiiTriangle() {
    const radius = 1.65;
    const height = 2.1;

    const prismGeo = new THREE.ConeGeometry(radius, height, 3, 1);
    prismGeo.rotateY(Math.PI);
    const prismMesh = new THREE.Mesh(prismGeo, bodyMaterial);
    prismMesh.castShadow = true;
    shapeGroup.add(prismMesh);

    // Front face
    const faceGeo = new THREE.PlaneGeometry(1.05, 1.05);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, -0.08, 0.78);
    shapeGroup.add(faceMesh);

    const bezelGeo = new THREE.BoxGeometry(1.2, 1.2, 0.05);
    const bezelMesh = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezelMesh.position.set(0, -0.08, 0.75);
    shapeGroup.add(bezelMesh);

    // Cute rounded vertex balls on 3 corners
    const cornerGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const nodeTop = new THREE.Mesh(cornerGeo, accentMaterial);
    nodeTop.position.set(0, height * 0.5 + 0.1, 0);
    shapeGroup.add(nodeTop);

    [-1, 1].forEach((side) => {
      const nodeSide = new THREE.Mesh(cornerGeo, accentMaterial);
      nodeSide.position.set(side * (radius * 0.8), -height * 0.45, 0);
      shapeGroup.add(nodeSide);
    });
  }

  // --- 5. FLOR FOFA (KAWAII BLOOMING DAISY / LOTUS) ---
  function constructKawaiiFlower() {
    const centerRadius = 0.95;

    // Center cute orb
    const centerGeo = new THREE.SphereGeometry(centerRadius, 32, 32);
    const centerMesh = new THREE.Mesh(centerGeo, darkChassisMaterial);
    shapeGroup.add(centerMesh);

    // Front screen
    const faceGeo = new THREE.PlaneGeometry(0.9, 0.9);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0, centerRadius * 0.88);
    shapeGroup.add(faceMesh);

    // 8 Rounded cute mechanical petals
    const petalCount = 8;
    const petalGeo = new THREE.SphereGeometry(0.48, 16, 16);
    petalGeo.scale(1, 1.9, 0.28); // Rounded leaf shape

    for (let i = 0; i < petalCount; i++) {
      const petalPivot = new THREE.Group();
      const angle = (i / petalCount) * Math.PI * 2;

      const petalMesh = new THREE.Mesh(petalGeo, bodyMaterial);
      petalMesh.position.set(0, 0.85, 0);
      petalMesh.castShadow = true;

      // Glowing tip
      const petalTipGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const petalTip = new THREE.Mesh(petalTipGeo, accentMaterial);
      petalTip.position.set(0, 1.6, 0.05);

      petalPivot.add(petalMesh);
      petalPivot.add(petalTip);

      petalPivot.rotation.z = angle;
      petalPivot.rotation.x = 0.32;

      shapeGroup.add(petalPivot);
      petals.push(petalPivot);
    }
  }

  // --- 6. ESTRELA FOFA (KAWAII STAR MECHA) ---
  function constructKawaiiStar() {
    const starShape = new THREE.Shape();
    const points = 5;
    const outerR = 1.6;
    const innerR = 0.85;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = -Math.sin(a) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    });
    starGeo.center();

    const starMesh = new THREE.Mesh(starGeo, bodyMaterial);
    starMesh.castShadow = true;
    shapeGroup.add(starMesh);

    // Front screen bezel
    const bezelGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.08, 32);
    const bezelMesh = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezelMesh.rotation.x = Math.PI / 2;
    bezelMesh.position.set(0, 0, 0.36);
    shapeGroup.add(bezelMesh);

    // Front screen
    const faceGeo = new THREE.PlaneGeometry(0.95, 0.95);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0, 0.41);
    shapeGroup.add(faceMesh);

    // Glowing tip spheres on 5 star points
    for (let p = 0; p < points; p++) {
      const a = (p * 2 * Math.PI) / points - Math.PI / 2;
      const tipGeo = new THREE.OctahedronGeometry(0.14);
      const tipMesh = new THREE.Mesh(tipGeo, accentMaterial);
      tipMesh.position.set(Math.cos(a) * (outerR + 0.12), -Math.sin(a) * (outerR + 0.12), 0);
      shapeGroup.add(tipMesh);
    }

    // Rear thruster ring
    const rearRingGeo = new THREE.TorusGeometry(0.45, 0.04, 16, 32);
    const rearRing = new THREE.Mesh(rearRingGeo, accentMaterial);
    rearRing.position.set(0, 0, -0.38);
    shapeGroup.add(rearRing);
  }

  // --- 7. CORAÇÃO CYBER (KAWAII HEART BOT) ---
  function constructKawaiiHeart() {
    const heartShape = new THREE.Shape();
    const x = 0, y = 0.2;
    heartShape.moveTo(x, y + 0.45);
    heartShape.bezierCurveTo(x + 0.75, y + 1.35, x + 1.5, y + 0.75, x + 1.5, y - 0.15);
    heartShape.bezierCurveTo(x + 1.5, y - 0.85, x + 0.75, y - 1.45, x, y - 1.95);
    heartShape.bezierCurveTo(x - 0.75, y - 1.45, x - 1.5, y - 0.85, x - 1.5, y - 0.15);
    heartShape.bezierCurveTo(x - 1.5, y + 0.75, x - 0.75, y + 1.35, x, y + 0.45);

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.65,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.14,
      bevelThickness: 0.14,
    });
    heartGeo.center();

    const heartMesh = new THREE.Mesh(heartGeo, bodyMaterial);
    heartMesh.castShadow = true;
    shapeGroup.add(heartMesh);

    // Front screen frame
    const bezelGeo = new THREE.BoxGeometry(1.05, 1.05, 0.08);
    const bezelMesh = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezelMesh.position.set(0, -0.05, 0.42);
    shapeGroup.add(bezelMesh);

    // Screen
    const faceGeo = new THREE.PlaneGeometry(0.96, 0.96);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, -0.05, 0.47);
    shapeGroup.add(faceMesh);

    // Glowing edge seam ring
    const seamGeo = new THREE.TorusGeometry(1.28, 0.04, 16, 48);
    const seam = new THREE.Mesh(seamGeo, accentMaterial);
    seam.rotation.x = Math.PI / 2;
    seam.position.set(0, -0.05, 0);
    shapeGroup.add(seam);

    // Bottom anti-gravity thruster cone
    const thrusterGeo = new THREE.ConeGeometry(0.22, 0.4, 16);
    const thruster = new THREE.Mesh(thrusterGeo, accentMaterial);
    thruster.position.set(0, -1.25, 0);
    shapeGroup.add(thruster);
  }

  // --- 8. COGUMELO BOT (KAWAII SHROOM DROID) ---
  function constructKawaiiMushroom() {
    // 1. Cap dome
    const capGeo = new THREE.SphereGeometry(1.45, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const capMesh = new THREE.Mesh(capGeo, bodyMaterial);
    capMesh.position.set(0, 0.35, 0);
    capMesh.castShadow = true;
    shapeGroup.add(capMesh);

    // Cap underside rim
    const rimGeo = new THREE.TorusGeometry(1.42, 0.06, 16, 32);
    const rimMesh = new THREE.Mesh(rimGeo, accentMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.set(0, 0.35, 0);
    shapeGroup.add(rimMesh);

    // Glowing Polka-dot sensor nodes on cap
    const spotOffsets = [
      [0, 1.45, 0.6],
      [-0.8, 1.0, 0.7],
      [0.8, 1.0, 0.7],
      [-0.9, 0.7, -0.6],
      [0.9, 0.7, -0.6],
      [0, 1.7, 0],
    ];
    spotOffsets.forEach(([sx, sy, sz]) => {
      const spotGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const spot = new THREE.Mesh(spotGeo, accentMaterial);
      spot.position.set(sx, sy, sz);
      shapeGroup.add(spot);
    });

    // 2. Stem body
    const stemGeo = new THREE.CylinderGeometry(0.72, 0.9, 1.15, 32);
    const stemMesh = new THREE.Mesh(stemGeo, darkChassisMaterial);
    stemMesh.position.set(0, -0.35, 0);
    shapeGroup.add(stemMesh);

    // Front screen on stem
    const faceGeo = new THREE.PlaneGeometry(0.85, 0.85);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, -0.32, 0.82);
    shapeGroup.add(faceMesh);

    // Cute rounded feet at base
    [-0.42, 0.42].forEach((fx) => {
      const footGeo = new THREE.SphereGeometry(0.25, 16, 16);
      footGeo.scale(1, 0.5, 1.3);
      const foot = new THREE.Mesh(footGeo, bodyMaterial);
      foot.position.set(fx, -0.92, 0.2);
      shapeGroup.add(foot);
    });
  }

  // --- 9. CÁPSULA DROID (KAWAII PILL ANDROID) ---
  function constructKawaiiCapsule() {
    // 1. Sleek vertical capsule hull
    const capGeo = new THREE.CapsuleGeometry(0.92, 1.25, 16, 32);
    const capMesh = new THREE.Mesh(capGeo, bodyMaterial);
    capMesh.castShadow = true;
    shapeGroup.add(capMesh);

    // 2. Front horizontal visor bezel band
    const bezelGeo = new THREE.BoxGeometry(1.22, 0.92, 0.1);
    const bezelMesh = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezelMesh.position.set(0, 0.15, 0.86);
    shapeGroup.add(bezelMesh);

    // Front screen
    const faceGeo = new THREE.PlaneGeometry(1.05, 0.82);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0.15, 0.92);
    shapeGroup.add(faceMesh);

    // 3. Glowing waist belt ring
    const beltGeo = new THREE.TorusGeometry(0.96, 0.045, 16, 48);
    const beltMesh = new THREE.Mesh(beltGeo, accentMaterial);
    beltMesh.rotation.x = Math.PI / 2;
    beltMesh.position.set(0, -0.45, 0);
    shapeGroup.add(beltMesh);

    // 4. Side magnetic rotator pods
    [-1, 1].forEach((side) => {
      const podGeo = new THREE.SphereGeometry(0.24, 16, 16);
      podGeo.scale(0.6, 1, 1);
      const pod = new THREE.Mesh(podGeo, darkChassisMaterial);
      pod.position.set(side * 1.05, 0.15, 0);

      const podRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 12, 24), accentMaterial);
      podRing.rotation.y = Math.PI / 2;
      podRing.position.set(side * 1.15, 0.15, 0);

      shapeGroup.add(pod);
      shapeGroup.add(podRing);
    });

    // 5. Bottom hover nozzle
    const hoverGeo = new THREE.CylinderGeometry(0.45, 0.3, 0.15, 24);
    const hoverMesh = new THREE.Mesh(hoverGeo, darkChassisMaterial);
    hoverMesh.position.set(0, -1.5, 0);
    shapeGroup.add(hoverMesh);
  }

  // --- 10. NUVEM CYBER (KAWAII MECHA CLOUD) ---
  function constructKawaiiCloud() {
    // Composite rounded fluffy cloud body
    const cloudSpheres = [
      { r: 1.15, pos: [0, 0, 0] },
      { r: 0.9, pos: [-1.08, -0.08, 0] },
      { r: 0.9, pos: [1.08, -0.08, 0] },
      { r: 0.74, pos: [0.55, 0.65, 0] },
      { r: 0.7, pos: [-0.55, 0.62, 0] },
      { r: 0.78, pos: [0, -0.65, 0] },
    ];

    cloudSpheres.forEach(({ r, pos }) => {
      const puffGeo = new THREE.SphereGeometry(r, 28, 28);
      const puff = new THREE.Mesh(puffGeo, bodyMaterial);
      puff.position.set(pos[0], pos[1], pos[2]);
      puff.castShadow = true;
      shapeGroup.add(puff);
    });

    // Front screen bezel
    const bezelGeo = new THREE.BoxGeometry(1.08, 1.08, 0.06);
    const bezel = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezel.position.set(0, 0.05, 1.05);
    shapeGroup.add(bezel);

    // Front screen
    const faceGeo = new THREE.PlaneGeometry(0.98, 0.98);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0.05, 1.09);
    shapeGroup.add(faceMesh);

    // Bottom glowing cyber rain thrusters (3 teardrops)
    [-0.7, 0, 0.7].forEach((rx) => {
      const dropGeo = new THREE.ConeGeometry(0.14, 0.45, 16);
      dropGeo.rotateX(Math.PI);
      const drop = new THREE.Mesh(dropGeo, accentMaterial);
      drop.position.set(rx, -1.25, 0.1);
      shapeGroup.add(drop);

      const sparkGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const spark = new THREE.Mesh(sparkGeo, accentMaterial);
      spark.position.set(rx, -1.52, 0.1);
      shapeGroup.add(spark);
    });

    // Floating cyber aura ring around cloud
    const auraRingGeo = new THREE.TorusGeometry(1.58, 0.04, 16, 48);
    const auraRing = new THREE.Mesh(auraRingGeo, accentMaterial);
    auraRing.rotation.x = Math.PI / 2;
    auraRing.position.set(0, -0.15, 0);
    shapeGroup.add(auraRing);
  }

  // --- 11. DIAMANTE MECHA (KAWAII CYBER GEM) ---
  function constructKawaiiDiamond() {
    // Faceted jewel body
    const gemGeo = new THREE.OctahedronGeometry(1.5, 0);
    gemGeo.scale(1.0, 1.35, 0.92);
    const gemMesh = new THREE.Mesh(gemGeo, bodyMaterial);
    gemMesh.castShadow = true;
    shapeGroup.add(gemMesh);

    // Glowing edge wireframe rim
    const edgeTorus = new THREE.TorusGeometry(1.35, 0.045, 16, 4);
    const edgeMesh = new THREE.Mesh(edgeTorus, accentMaterial);
    edgeMesh.rotation.x = Math.PI / 2;
    edgeMesh.position.set(0, 0, 0);
    shapeGroup.add(edgeMesh);

    // Screen bezel
    const bezelGeo = new THREE.BoxGeometry(1.05, 1.05, 0.08);
    const bezel = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezel.position.set(0, 0.05, 0.72);
    shapeGroup.add(bezel);

    // Front screen
    const faceGeo = new THREE.PlaneGeometry(0.96, 0.96);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0.05, 0.77);
    shapeGroup.add(faceMesh);

    // Floating crystal orbiting shards
    [
      [-1.3, 0.6, 0],
      [1.3, 0.6, 0],
      [-1.1, -0.8, 0],
      [1.1, -0.8, 0],
    ].forEach(([sx, sy, sz]) => {
      const shardGeo = new THREE.OctahedronGeometry(0.18, 0);
      const shard = new THREE.Mesh(shardGeo, accentMaterial);
      shard.position.set(sx, sy, sz);
      shapeGroup.add(shard);
      orbitalShards.push(shard);
    });

    // Bottom anti-gravity thruster node
    const bottomNode = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), accentMaterial);
    bottomNode.position.set(0, -1.95, 0);
    shapeGroup.add(bottomNode);
  }

  // --- 12. URSINHO MECHA (KAWAII TEDDY DROID) ---
  function constructKawaiiBear() {
    const headRadius = 1.3;

    // Bear main chassis
    const bodyGeo = new THREE.SphereGeometry(headRadius, 40, 40);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
    bodyMesh.castShadow = true;
    shapeGroup.add(bodyMesh);

    // Round Teddy Bear Ears
    [-1, 1].forEach((side) => {
      const earBaseGeo = new THREE.SphereGeometry(0.45, 24, 24);
      earBaseGeo.scale(0.8, 1, 0.45);
      const earBase = new THREE.Mesh(earBaseGeo, bodyMaterial);
      earBase.position.set(side * 0.98, 1.08, -0.05);

      const innerPadGeo = new THREE.SphereGeometry(0.26, 16, 16);
      innerPadGeo.scale(0.8, 1, 0.3);
      const innerPad = new THREE.Mesh(innerPadGeo, accentMaterial);
      innerPad.position.set(side * 0.98, 1.08, 0.12);

      shapeGroup.add(earBase);
      shapeGroup.add(innerPad);
    });

    // Snout bezel plate
    const snoutGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.22, 28);
    snoutGeo.scale(1.15, 1, 0.85);
    const snout = new THREE.Mesh(snoutGeo, darkChassisMaterial);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, -0.22, headRadius * 0.78);
    shapeGroup.add(snout);

    // Cute mecha button nose
    const noseGeo = new THREE.SphereGeometry(0.12, 16, 16);
    noseGeo.scale(1.3, 0.9, 0.8);
    const nose = new THREE.Mesh(noseGeo, accentMaterial);
    nose.position.set(0, -0.08, headRadius * 0.78 + 0.18);
    shapeGroup.add(nose);

    // Front screen above snout
    const bezelGeo = new THREE.BoxGeometry(1.05, 0.88, 0.05);
    const bezel = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezel.position.set(0, 0.28, headRadius * 0.75);
    shapeGroup.add(bezel);

    const faceGeo = new THREE.PlaneGeometry(0.96, 0.8);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0.28, headRadius * 0.78 + 0.03);
    shapeGroup.add(faceMesh);

    // Teddy Paws at bottom
    [-0.58, 0.58].forEach((px) => {
      const pawGeo = new THREE.SphereGeometry(0.24, 20, 20);
      pawGeo.scale(1, 0.7, 1.25);
      const paw = new THREE.Mesh(pawGeo, bodyMaterial);
      paw.position.set(px, -headRadius * 0.72, headRadius * 0.45);
      shapeGroup.add(paw);

      // Cute glowing paw pad
      const padGeo = new THREE.SphereGeometry(0.1, 12, 12);
      padGeo.scale(1, 0.25, 1);
      const pad = new THREE.Mesh(padGeo, accentMaterial);
      pad.position.set(px, -headRadius * 0.72 + 0.14, headRadius * 0.52);
      shapeGroup.add(pad);
    });

    // Belly ring with glowing heart meter
    const bellyRingGeo = new THREE.TorusGeometry(0.48, 0.04, 16, 32);
    const bellyRing = new THREE.Mesh(bellyRingGeo, accentMaterial);
    bellyRing.position.set(0, -0.72, headRadius * 0.7);
    shapeGroup.add(bellyRing);
  }

  // --- 13. GATINHO MECHA (KAWAII CYBER NEKO) ---
  function constructKawaiiCat() {
    const headRadius = 1.3;

    // Cat main head chassis
    const bodyGeo = new THREE.SphereGeometry(headRadius, 40, 40);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
    bodyMesh.castShadow = true;
    shapeGroup.add(bodyMesh);

    // Triangular Cat Ears
    [-1, 1].forEach((side) => {
      const earGeo = new THREE.ConeGeometry(0.46, 0.7, 4);
      const ear = new THREE.Mesh(earGeo, bodyMaterial);
      ear.position.set(side * 0.86, 1.28, 0);
      ear.rotation.z = side * -0.38;
      ear.rotation.y = side * 0.15;

      const innerGeo = new THREE.ConeGeometry(0.28, 0.5, 4);
      const inner = new THREE.Mesh(innerGeo, accentMaterial);
      inner.position.set(side * 0.86, 1.28, 0.09);
      inner.rotation.z = side * -0.38;
      inner.rotation.y = side * 0.15;

      shapeGroup.add(ear);
      shapeGroup.add(inner);
    });

    // 6 Cyber Whisker Antennas (3 left, 3 right)
    [-1, 1].forEach((side) => {
      [-0.12, 0, 0.12].forEach((wy, wIdx) => {
        const whiskerGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8);
        const whisker = new THREE.Mesh(whiskerGeo, darkChassisMaterial);
        whisker.rotation.z = (Math.PI / 2) + (side * (wIdx - 1) * 0.15);
        whisker.position.set(side * (headRadius * 0.95 + 0.28), -0.1 + wy, 0.35);

        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), accentMaterial);
        tip.position.set(side * (headRadius * 0.95 + 0.62), -0.1 + wy * 1.5, 0.35);

        shapeGroup.add(whisker);
        shapeGroup.add(tip);
      });
    });

    // Collar with glowing chime bell
    const collarGeo = new THREE.TorusGeometry(headRadius * 0.92, 0.045, 16, 48);
    const collar = new THREE.Mesh(collarGeo, darkChassisMaterial);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, -headRadius * 0.65, 0);
    shapeGroup.add(collar);

    const bellGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const bell = new THREE.Mesh(bellGeo, accentMaterial);
    bell.position.set(0, -headRadius * 0.65, headRadius * 0.85);
    shapeGroup.add(bell);

    // Screen bezel & screen
    const bezelGeo = new THREE.BoxGeometry(1.08, 1.08, 0.06);
    const bezel = new THREE.Mesh(bezelGeo, darkChassisMaterial);
    bezel.position.set(0, 0.08, headRadius * 0.78);
    shapeGroup.add(bezel);

    const faceGeo = new THREE.PlaneGeometry(0.98, 0.98);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0.08, headRadius * 0.82);
    shapeGroup.add(faceMesh);

    // Swishing Articulated Cat Tail at back
    catTail = new THREE.Group();
    catTail.position.set(0, -headRadius * 0.6, -headRadius * 0.8);
    for (let s = 0; s < 5; s++) {
      const segGeo = new THREE.CylinderGeometry(0.08 - s * 0.01, 0.1 - s * 0.01, 0.25, 12);
      const seg = new THREE.Mesh(segGeo, bodyMaterial);
      seg.position.set(0, s * 0.22, -s * 0.12);
      seg.rotation.x = 0.4 + s * 0.15;
      catTail.add(seg);
    }
    const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), accentMaterial);
    tailTip.position.set(0, 1.25, -0.6);
    catTail.add(tailTip);
    shapeGroup.add(catTail);
  }

  // --- 14. MINI DISCO VOADOR (KAWAII MINI UFO) ---
  function constructKawaiiUfo() {
    // Saucer fuselage disc
    const saucerGeo = new THREE.CylinderGeometry(1.9, 1.5, 0.42, 36);
    saucerGeo.scale(1, 0.8, 1);
    const saucer = new THREE.Mesh(saucerGeo, bodyMaterial);
    saucer.castShadow = true;
    shapeGroup.add(saucer);

    // Glowing porthole LEDs around perimeter
    ufoRing = new THREE.Group();
    const portholes = 8;
    for (let p = 0; p < portholes; p++) {
      const a = (p / portholes) * Math.PI * 2;
      const portGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const port = new THREE.Mesh(portGeo, accentMaterial);
      port.position.set(Math.cos(a) * 1.88, 0, Math.sin(a) * 1.88);
      ufoRing.add(port);
    }
    shapeGroup.add(ufoRing);

    // Upper glass cockpit bubble canopy
    const domeGeo = new THREE.SphereGeometry(1.05, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const domeMat = new THREE.MeshPhysicalMaterial({
      color: 0x111928,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.85,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 0.15, 0);
    shapeGroup.add(dome);

    // Front screen inside cockpit
    const faceGeo = new THREE.PlaneGeometry(0.95, 0.95);
    const faceMesh = new THREE.Mesh(faceGeo, faceScreenMaterial);
    faceMesh.position.set(0, 0.35, 0.72);
    shapeGroup.add(faceMesh);

    // 3 Mini landing gear tripod legs
    for (let l = 0; l < 3; l++) {
      const la = (l / 3) * Math.PI * 2 + Math.PI / 6;
      const legGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.5, 8);
      const leg = new THREE.Mesh(legGeo, darkChassisMaterial);
      leg.position.set(Math.cos(la) * 1.15, -0.4, Math.sin(la) * 1.15);
      leg.rotation.z = Math.cos(la) * 0.35;
      leg.rotation.x = Math.sin(la) * -0.35;

      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), accentMaterial);
      foot.position.set(Math.cos(la) * 1.25, -0.65, Math.sin(la) * 1.25);

      shapeGroup.add(leg);
      shapeGroup.add(foot);
    }

    // Bottom anti-gravity tractor beam cone
    const beamGeo = new THREE.ConeGeometry(0.65, 0.55, 24);
    beamGeo.rotateX(Math.PI);
    const beam = new THREE.Mesh(beamGeo, accentMaterial);
    beam.position.set(0, -0.45, 0);
    shapeGroup.add(beam);
  }

  // --- ACCESSORIES BUILDER ---
  function constructAccessory(acc: AvatarConfig['accessory']) {
    while (accessoryGroup.children.length > 0) {
      const obj = accessoryGroup.children[0];
      accessoryGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    }
    satellites.length = 0;
    wings.length = 0;
    bunnyEars = [];
    haloMesh = null;
    heartAntennaMesh = null;

    if (acc === 'none') return;

    switch (acc) {
      case 'bunny_ears': {
        // Cute Long Mechanical Bunny Ears
        [-1, 1].forEach((side) => {
          const earPivot = new THREE.Group();
          const earGeo = new THREE.CylinderGeometry(0.18, 0.26, 1.2, 16);
          earGeo.scale(0.8, 1, 0.4);
          const ear = new THREE.Mesh(earGeo, bodyMaterial);
          ear.position.set(0, 0.6, 0);

          // Inner pink glow pad
          const innerGeo = new THREE.CylinderGeometry(0.1, 0.16, 1.0, 16);
          innerGeo.scale(0.7, 1, 0.2);
          const inner = new THREE.Mesh(innerGeo, accentMaterial);
          inner.position.set(0, 0.6, 0.08);

          earPivot.add(ear);
          earPivot.add(inner);

          earPivot.position.set(side * 0.48, 1.25, 0);
          earPivot.rotation.z = side * -0.22;
          earPivot.rotation.x = -0.15;

          accessoryGroup.add(earPivot);
          bunnyEars.push(earPivot);
        });
        break;
      }

      case 'cat_ears': {
        [-1, 1].forEach((side) => {
          const earGeo = new THREE.ConeGeometry(0.42, 0.65, 4);
          const ear = new THREE.Mesh(earGeo, bodyMaterial);
          ear.position.set(side * 0.85, 1.4, 0.1);
          ear.rotation.z = side * -0.4;
          ear.rotation.y = side * 0.2;

          const innerGeo = new THREE.ConeGeometry(0.26, 0.45, 4);
          const inner = new THREE.Mesh(innerGeo, accentMaterial);
          inner.position.set(side * 0.85, 1.4, 0.18);
          inner.rotation.z = side * -0.4;
          inner.rotation.y = side * 0.2;

          accessoryGroup.add(ear);
          accessoryGroup.add(inner);
        });
        break;
      }

      case 'angel_wings': {
        // Cute Chibi Mechanical Angel Wings on back
        [-1, 1].forEach((side) => {
          const wingPivot = new THREE.Group();

          // 3 feathered blades
          for (let f = 0; f < 3; f++) {
            const featherGeo = new THREE.ConeGeometry(0.16, 0.8 + f * 0.2, 4);
            featherGeo.scale(1, 1, 0.2);
            const feather = new THREE.Mesh(featherGeo, bodyMaterial);
            feather.position.set(side * (0.35 + f * 0.25), 0.3 - f * 0.18, 0);
            feather.rotation.z = side * (0.8 + f * 0.3);

            const featherGlow = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), accentMaterial);
            featherGlow.position.set(side * (0.35 + f * 0.25), 0.3 - f * 0.18, 0.05);

            wingPivot.add(feather);
            wingPivot.add(featherGlow);
          }

          wingPivot.position.set(side * 0.6, 0.1, -1.0);
          accessoryGroup.add(wingPivot);
          wings.push(wingPivot);
        });
        break;
      }

      case 'star_halo': {
        // Floating Star Halo
        const starGroup = new THREE.Group();
        const haloTorus = new THREE.TorusGeometry(1.25, 0.04, 16, 48);
        haloMesh = new THREE.Mesh(haloTorus, accentMaterial);
        haloMesh.rotation.x = Math.PI / 2.2;
        starGroup.add(haloMesh);

        // 4 glowing star beads on halo
        for (let s = 0; s < 4; s++) {
          const ang = (s * Math.PI) / 2;
          const starNode = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), accentMaterial);
          starNode.position.set(Math.cos(ang) * 1.25, Math.sin(ang) * 1.25 * 0.3, 0);
          starGroup.add(starNode);
        }

        starGroup.position.set(0, 1.7, 0);
        accessoryGroup.add(starGroup);
        break;
      }

      case 'heart_antenna': {
        // Cute springy heart antenna on top
        heartAntennaMesh = new THREE.Group();
        const stemGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.7, 12);
        const stem = new THREE.Mesh(stemGeo, darkChassisMaterial);
        stem.position.set(0, 0.35, 0);

        const heartGeo = new THREE.OctahedronGeometry(0.22);
        const heart = new THREE.Mesh(heartGeo, accentMaterial);
        heart.position.set(0, 0.8, 0);

        heartAntennaMesh.add(stem);
        heartAntennaMesh.add(heart);
        heartAntennaMesh.position.set(0, 1.35, 0);
        accessoryGroup.add(heartAntennaMesh);
        break;
      }

      case 'headphones': {
        // Cute Kitty Headset
        const bandGeo = new THREE.TorusGeometry(1.4, 0.05, 12, 32, Math.PI);
        const band = new THREE.Mesh(bandGeo, darkChassisMaterial);
        band.rotation.z = Math.PI;
        band.position.set(0, 0.1, 0);
        accessoryGroup.add(band);

        [-1, 1].forEach((side) => {
          const cupGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.18, 24);
          const cup = new THREE.Mesh(cupGeo, bodyMaterial);
          cup.rotation.z = Math.PI / 2;
          cup.position.set(side * 1.38, 0.1, 0);

          const ringGeo = new THREE.TorusGeometry(0.3, 0.04, 12, 24);
          const ring = new THREE.Mesh(ringGeo, accentMaterial);
          ring.rotation.y = Math.PI / 2;
          ring.position.set(side * 1.48, 0.1, 0);

          // Glowing cat ear on top of headphone!
          const miniEar = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.3, 4), accentMaterial);
          miniEar.position.set(side * 1.0, 1.1, 0);
          miniEar.rotation.z = side * -0.3;

          accessoryGroup.add(cup);
          accessoryGroup.add(ring);
          accessoryGroup.add(miniEar);
        });
        break;
      }

      case 'satellites': {
        [0, Math.PI].forEach((offset) => {
          const dronePivot = new THREE.Group();
          const droneGeo = new THREE.OctahedronGeometry(0.18);
          const drone = new THREE.Mesh(droneGeo, accentMaterial);
          drone.position.set(2.0, 0, 0);
          dronePivot.rotation.y = offset;
          dronePivot.add(drone);
          accessoryGroup.add(dronePivot);
          satellites.push(dronePivot);
        });
        break;
      }
    }
  }

  constructShape(config.shape);
  constructAccessory(config.accessory);

  let currentShape = config.shape;
  let currentAccessory = config.accessory;

  return {
    group: rootGroup,
    faceCanvas,
    update: (
      cfg,
      pitch,
      yaw,
      roll,
      x,
      y,
      z,
      blinkL,
      blinkR,
      gazeX,
      gazeY,
      mouthOpen,
      mouthSmile,
      mouthPucker,
      emotion,
      audioVol,
      time
    ) => {
      if (cfg.shape !== currentShape) {
        currentShape = cfg.shape;
        initMaterials();
        constructShape(cfg.shape);
        constructAccessory(cfg.accessory);
      } else if (cfg.accessory !== currentAccessory) {
        currentAccessory = cfg.accessory;
        constructAccessory(cfg.accessory);
      }

      // Smooth kinematic head rotation & translation
      avatarRig.rotation.x = pitch;
      avatarRig.rotation.y = yaw;
      avatarRig.rotation.z = roll;

      // Cute squash & stretch when nodding/moving
      const squashY = 1.0 - Math.abs(pitch) * 0.12 + Math.abs(mouthOpen) * 0.08;
      const stretchXZ = 1.0 + Math.abs(pitch) * 0.06;

      // Soft idle breathing & bobbing
      const bobbing = Math.sin(time * 2.8) * 0.07;
      avatarRig.position.x = x * 1.5;
      avatarRig.position.y = y * 1.2 + bobbing;
      avatarRig.position.z = z * 1.0;

      avatarRig.scale.set(
        cfg.scale * stretchXZ,
        cfg.scale * squashY,
        cfg.scale * stretchXZ
      );

      // Flapping cute angel wings
      if (wings.length > 0) {
        const wingFlap = Math.sin(time * 4.5) * 0.35 + (audioVol * 0.3);
        wings.forEach((w, idx) => {
          const dir = idx === 0 ? 1 : -1;
          w.rotation.y = dir * (0.3 + wingFlap);
        });
      }

      // Wiggling bunny ears
      if (bunnyEars.length > 0) {
        const wiggle = Math.sin(time * 3.5) * 0.08 + roll * 0.5;
        bunnyEars.forEach((b, idx) => {
          b.rotation.z = (idx === 0 ? -1 : 1) * -0.22 + wiggle;
        });
      }

      // Wobbling heart antenna
      if (heartAntennaMesh) {
        heartAntennaMesh.rotation.z = Math.sin(time * 4) * 0.15 + roll * 0.6;
        heartAntennaMesh.rotation.x = Math.cos(time * 3.5) * 0.1 - pitch * 0.5;
      }

      // Blooming flower petals
      if (petals.length > 0) {
        const petalFlare = mouthOpen * 0.3 + audioVol * 0.3 + Math.sin(time * 3) * 0.05;
        petals.forEach((p, idx) => {
          p.rotation.x = 0.32 + petalFlare + (emotion === 'happy' ? 0.2 : 0);
          p.rotation.y = Math.sin(time * 2 + idx) * 0.05;
        });
      }

      // Satellites
      satellites.forEach((sat, i) => {
        sat.rotation.y = time * 1.5 + i * Math.PI;
        sat.position.y = Math.sin(time * 3 + i) * 0.15;
      });

      // Cat tail swish
      if (catTail) {
        catTail.rotation.y = Math.sin(time * 3.5) * 0.45 + (yaw * 0.3);
        catTail.rotation.z = Math.cos(time * 2.5) * 0.15;
      }

      // UFO rotating porthole ring
      if (ufoRing) {
        ufoRing.rotation.y = time * 2.0;
      }

      // Diamond orbiting crystal shards
      if (orbitalShards.length > 0) {
        orbitalShards.forEach((shard, idx) => {
          const ang = time * 2.0 + (idx * Math.PI) / 2;
          shard.position.x = Math.cos(ang) * 1.45;
          shard.position.z = Math.sin(ang) * 0.9;
          shard.position.y = Math.sin(time * 3 + idx) * 0.25;
          shard.rotation.x = time * 2 + idx;
          shard.rotation.y = time * 3;
        });
      }

      // Halo float
      if (haloMesh) {
        haloMesh.rotation.z = time * 0.4;
      }

      // Update 2D Canvas Face Texture with eyes and mouth mirroring
      faceCanvas.render(
        cfg,
        blinkL,
        blinkR,
        gazeX,
        gazeY,
        mouthOpen,
        mouthSmile,
        mouthPucker,
        emotion,
        audioVol,
        time
      );
    },
    dispose: () => {
      faceCanvas.texture.dispose();
      bodyMaterial?.dispose();
      accentMaterial?.dispose();
      darkChassisMaterial?.dispose();
      faceScreenMaterial?.dispose();
    },
  };
}
