import * as THREE from "three";

const toon = (color) =>
  new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.08 });

function addShadow(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createFishBoard(deckColor, stripeColor) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.92);
  shape.bezierCurveTo(0.16, 0.88, 0.36, 0.52, 0.4, 0.05);
  shape.lineTo(0.44, -0.38);
  shape.lineTo(0.36, -0.78);
  shape.lineTo(0.22, -1.22);
  shape.lineTo(0.0, -0.72);
  shape.lineTo(-0.22, -1.22);
  shape.lineTo(-0.36, -0.78);
  shape.lineTo(-0.44, -0.38);
  shape.lineTo(-0.4, 0.05);
  shape.bezierCurveTo(-0.36, 0.52, -0.16, 0.88, 0, 0.92);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.018,
    bevelSegments: 1,
  });
  geo.center();
  const deck = new THREE.Mesh(geo, toon(deckColor));
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = 0.06;
  deck.name = "deck";
  addShadow(deck);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 1.7), toon(stripeColor));
  stripe.position.y = 0.12;

  const finMat = toon("#1d3557");
  const finL = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.22, 0.2), finMat);
  finL.position.set(-0.12, -0.02, 0.78);
  finL.rotation.z = 0.18;
  const finR = finL.clone();
  finR.position.x = 0.12;
  finR.rotation.z = -0.18;

  const tailMat = toon(deckColor);
  const wingL = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.38, 3), tailMat);
  wingL.rotation.set(Math.PI / 2, 0, 0.45);
  wingL.position.set(-0.18, 0.06, 1.08);
  const wingR = wingL.clone();
  wingR.rotation.z = -0.45;
  wingR.position.x = 0.18;

  const board = new THREE.Group();
  board.name = "board";
  board.add(deck, stripe, finL, finR, wingL, wingR);
  return board;
}

function createShakaHand() {
  const hand = new THREE.Group();
  hand.name = "shaka";
  const skin = toon("#f4a261");
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), skin);
  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.22, 3, 6), skin);
  thumb.position.set(-0.11, 0.12, 0.03);
  thumb.rotation.z = 1.05;
  const pinky = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.24, 3, 6), skin);
  pinky.position.set(0.11, 0.14, 0.03);
  pinky.rotation.z = -0.7;
  const mid = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.06), skin);
  mid.position.set(0.01, -0.02, 0);
  hand.add(palm, thumb, pinky, mid);
  hand.position.set(0, 0.48, 0);
  hand.scale.setScalar(1.35);
  hand.visible = false;
  return hand;
}

export function createPlayerMesh() {
  const root = new THREE.Group();
  root.name = "player";

  const boardGroup = createFishBoard("#ffd166", "#ef476f");

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.55, 4, 8), toon("#06d6a0"));
  body.position.y = 0.72;
  addShadow(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), toon("#f4a261"));
  head.position.y = 1.22;
  addShadow(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), toon("#3d2914"));
  hair.position.set(0, 1.34, -0.02);
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), toon("#1b1b1b"));
  eyeL.position.set(-0.08, 1.26, 0.18);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.08;

  const armL = new THREE.Group();
  armL.name = "armL";
  armL.position.set(-0.32, 0.95, 0);
  const armLMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.32, 3, 6), toon("#f4a261"));
  armLMesh.position.y = -0.18;
  armL.rotation.z = 0.45;
  armL.add(armLMesh);

  const armR = new THREE.Group();
  armR.name = "armR";
  armR.position.set(0.32, 0.95, 0);
  const armRMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.32, 3, 6), toon("#f4a261"));
  armRMesh.position.y = -0.18;
  armR.rotation.z = -0.45;
  armR.add(armRMesh, createShakaHand());

  const rider = new THREE.Group();
  rider.name = "rider";
  rider.add(body, head, hair, eyeL, eyeR, armL, armR);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.55, 16),
    new THREE.MeshBasicMaterial({ color: "#06283a", transparent: true, opacity: 0.28 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  shadow.name = "blob";

  root.add(boardGroup, rider, shadow);
  return root;
}

export function createKookMesh() {
  const root = createPlayerMesh();
  root.name = "kook";
  const deck = root.getObjectByName("deck");
  if (deck) deck.material = toon("#ef476f");
  const rider = root.getObjectByName("rider");
  const body = rider?.children[0];
  if (body) body.material = toon("#ffd166");
  const shaka = root.getObjectByName("shaka");
  if (shaka) shaka.visible = false;
  return root;
}

export function createRockMesh() {
  const root = new THREE.Group();
  const mat = toon("#8d6e63");
  const a = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), mat);
  a.scale.set(1.1, 0.7, 0.9);
  const b = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 0), toon("#6d4c41"));
  b.position.set(0.35, 0.1, 0.1);
  addShadow(a);
  addShadow(b);
  root.add(a, b);
  root.position.y = 0.28;
  return root;
}

export function createSharkMesh() {
  const root = new THREE.Group();
  const bodyMat = toon("#5d737e");
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), bodyMat);
  body.scale.set(0.7, 0.7, 2.2);
  body.position.y = 0.55;
  addShadow(body);
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 6), toon("#4a5d66"));
  fin.position.set(0, 1.15, 0.1);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.7, 5), bodyMat);
  tail.rotation.x = Math.PI / 2;
  tail.position.set(0, 0.55, 1.35);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), toon("#111"));
  eye.position.set(0.22, 0.7, -0.85);
  const eye2 = eye.clone();
  eye2.position.x = -0.22;

  const mouth = new THREE.Group();
  mouth.position.set(0, 0.42, -1.12);
  const cavity = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 10, 8),
    toon("#2a1014")
  );
  cavity.scale.set(1.05, 0.7, 0.85);
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.28), toon("#4a5d66"));
  jaw.position.set(0, -0.16, -0.02);
  jaw.rotation.x = 0.35;
  const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), toon("#ff4d6d"));
  tongue.scale.set(0.72, 0.38, 2.35);
  tongue.position.set(0, -0.05, -0.32);
  mouth.add(cavity, jaw, tongue);

  const toothMat = toon("#f7f1e1");
  for (let i = 0; i < 7; i += 1) {
    const upper = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.2, 5), toothMat);
    upper.position.set(-0.2 + i * 0.066, 0.14, -0.12);
    upper.rotation.x = Math.PI;
    const lower = upper.clone();
    lower.position.y = -0.12;
    lower.rotation.x = 0;
    mouth.add(upper, lower);
  }

  root.add(body, fin, tail, eye, eye2, mouth);
  root.rotation.y = Math.PI;
  return root;
}

function createJapaneseWaveTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 512, 0, 0);
  g.addColorStop(0, "#0b3a66");
  g.addColorStop(0.45, "#1a7bb8");
  g.addColorStop(0.78, "#7ec8e8");
  g.addColorStop(1, "#f4fbff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "rgba(8, 28, 58, 0.45)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 18; i += 1) {
    ctx.beginPath();
    const y = 40 + i * 26;
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 16) {
      ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 10);
    }
    ctx.stroke();
  }

  ctx.fillStyle = "#f7fbff";
  ctx.strokeStyle = "#9ad0ea";
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i += 1) {
    const x = 18 + i * 42;
    ctx.beginPath();
    ctx.moveTo(x, 70);
    ctx.bezierCurveTo(x + 8, -8, x + 36, -6, x + 30, 78);
    ctx.bezierCurveTo(x + 22, 28, x + 8, 36, x, 70);
    ctx.fill();
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 280, 150, Math.PI * 0.15, Math.PI * 1.55);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function createTubeMesh() {
  const root = new THREE.Group();
  const tex = createJapaneseWaveTexture();
  const waveMat = new THREE.MeshLambertMaterial({
    map: tex,
    color: "#ffffff",
    side: THREE.DoubleSide,
    emissive: "#0d4f78",
    emissiveIntensity: 0.12,
  });
  waveMat.name = "waveBodyMat";

  const curl = new THREE.Mesh(
    new THREE.TorusGeometry(2.15, 0.82, 14, 36, Math.PI * 1.48),
    waveMat
  );
  curl.rotation.z = -0.18;
  curl.name = "waveBody";

  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(1.85, 1.85, 2.6, 24, 1, true),
    new THREE.MeshLambertMaterial({
      color: "#0d4d7a",
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      map: tex,
    })
  );
  inner.rotation.x = Math.PI / 2;

  const claws = new THREE.Group();
  claws.name = "foamClaws";
  const foamMat = toon("#f7fbff");
  for (let i = 0; i < 14; i += 1) {
    const t = 0.1 + (i / 13) * 0.78;
    const ang = t * Math.PI * 1.48 - 0.08;
    const r = 2.15 + 0.9;
    const claw = new THREE.Group();
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.85, 5), foamMat);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), foamMat);
    tip.position.y = 0.42;
    claw.add(spike, tip);
    claw.position.set(Math.cos(ang) * r, Math.sin(ang) * r, (i % 3) * 0.16 - 0.16);
    claw.lookAt(0.2, 1.6, 0);
    claws.add(claw);
  }

  const swell = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.28, 8, 24, Math.PI),
    toon("#156aa3")
  );
  swell.rotation.x = Math.PI / 2;
  swell.position.y = -1.55;

  root.add(curl, inner, claws, swell);
  root.position.y = 1.85;
  return root;
}

export function createWater() {
  const geo = new THREE.PlaneGeometry(48, 220, 50, 90);
  const uniforms = {
    uTime: { value: 0 },
    uOffset: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: `
      uniform float uTime;
      uniform float uOffset;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vUv = uv;
        vec3 p = position;
        float z = p.y + uOffset;
        vWave = sin(p.x * 0.45 + uTime * 2.2) * 0.16 + sin(z * 0.18 + uTime) * 0.1;
        p.z += vWave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vec3 deep = vec3(0.05, 0.35, 0.58);
        vec3 lite = vec3(0.22, 0.78, 0.86);
        vec3 col = mix(deep, lite, vUv.x * 0.45 + vWave * 0.8 + 0.35);
        float foam = smoothstep(0.72, 0.92, vUv.x);
        col = mix(col, vec3(0.93, 0.98, 1.0), foam * 0.85);
        gl_FragColor = vec4(col, 0.96);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(2.5, 0, -40);
  mesh.receiveShadow = true;
  mesh.name = "water";
  return mesh;
}

export function createWaveWall() {
  const geo = new THREE.PlaneGeometry(200, 11, 80, 18);
  const uniforms = {
    uTime: { value: 0 },
    uOffset: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.DoubleSide,
    vertexShader: `
      uniform float uTime;
      uniform float uOffset;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        float curl = smoothstep(0.35, 1.0, uv.y);
        p.z += sin(uv.x * 22.0 + uTime * 3.0 + uOffset) * 0.28 * curl;
        p.z -= curl * 1.15;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      void main() {
        vec3 base = mix(vec3(0.07, 0.38, 0.62), vec3(0.45, 0.88, 0.98), vUv.y);
        float lip = smoothstep(0.78, 1.0, vUv.y);
        base = mix(base, vec3(1.0), lip);
        gl_FragColor = vec4(base, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.y = -Math.PI / 2;
  mesh.rotation.z = 0.18;
  mesh.position.set(7.6, 4.4, -50);
  return mesh;
}

export function createSun() {
  const group = new THREE.Group();
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 16, 12),
    new THREE.MeshBasicMaterial({ color: "#ffd56a" })
  );
  sun.position.set(-18, 16, -70);
  group.add(sun);
  return group;
}

export function createClouds() {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: "#f4fbff" });
  for (let i = 0; i < 8; i += 1) {
    const puff = new THREE.Group();
    const a = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 6), mat);
    const b = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 6), mat);
    b.position.set(1.4, 0.25, 0.15);
    puff.add(a, b);
    puff.position.set(-18 + (i % 4) * 11, 12 + (i % 3) * 1.4, -36 - i * 14);
    group.add(puff);
  }
  return group;
}
