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
    bevelSegments: 3,
  });
  geo.center();
  const deck = new THREE.Mesh(geo, toon(deckColor));
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = 0.06;
  deck.name = "deck";
  addShadow(deck);

  const stripe = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.045, 1.55, 6, 10),
    toon(stripeColor)
  );
  stripe.rotation.x = Math.PI / 2;
  stripe.position.y = 0.12;

  const finMat = toon("#1d3557");
  const finL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26, 8), finMat);
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
  const mid = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), skin);
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

  const boardGroup = createFishBoard("#ffd166", "#e53935");
  const skin = toon("#f4a261");

  const footL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), skin);
  footL.scale.set(1, 0.55, 1.35);
  footL.position.set(-0.11, 0.12, 0.04);
  const footR = footL.clone();
  footR.position.x = 0.11;
  const legL = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.42, 6, 12), skin);
  legL.position.set(-0.11, 0.38, 0);
  addShadow(legL);
  const legR = legL.clone();
  legR.position.x = 0.11;

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.48, 8, 16), toon("#06d6a0"));
  body.position.y = 0.98;
  body.name = "torso";
  addShadow(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 16), skin);
  head.position.y = 1.48;
  addShadow(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 12), toon("#3d2914"));
  hair.position.set(0, 1.61, -0.02);
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), toon("#1b1b1b"));
  eyeL.position.set(-0.08, 1.52, 0.18);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.08;

  const armL = new THREE.Group();
  armL.name = "armL";
  armL.position.set(-0.32, 1.12, 0);
  const armLMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.32, 6, 12), skin);
  armLMesh.position.y = -0.18;
  armL.rotation.z = 0.28;
  armL.add(armLMesh);

  const armR = new THREE.Group();
  armR.name = "armR";
  armR.position.set(0.32, 1.12, 0);
  const armRMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.32, 6, 12), skin);
  armRMesh.position.y = -0.18;
  armR.rotation.z = -0.28;
  armR.add(armRMesh, createShakaHand());

  const rider = new THREE.Group();
  rider.name = "rider";
  rider.add(footL, footR, legL, legR, body, head, hair, eyeL, eyeR, armL, armR);

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
  if (deck) deck.material = toon("#e53935");
  const body = root.getObjectByName("torso");
  if (body) body.material = toon("#ffd166");
  const shaka = root.getObjectByName("shaka");
  if (shaka) shaka.visible = false;
  return root;
}

export function createRockMesh() {
  const root = new THREE.Group();
  const mat = toon("#8d6e63");
  const a = new THREE.Mesh(new THREE.IcosahedronGeometry(0.68, 1), mat);
  a.scale.set(1.15, 0.78, 0.95);
  const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 1), toon("#6d4c41"));
  b.position.set(0.32, 0.12, 0.08);
  addShadow(a);
  addShadow(b);
  root.add(a, b);
  root.position.y = 0.28;
  return root;
}

function addSharkToothArc(parent, mat, opts) {
  const { count, y, z, radius, baseH, rotX, spread, tilt = 0.4 } = opts;
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
    const ang = t * spread;
    const h = baseH * (1.14 - Math.abs(t) * 0.42);
    const r = 0.034 + (1 - Math.abs(t)) * 0.028;
    const tooth = new THREE.Mesh(new THREE.ConeGeometry(r, h, 3), mat);
    tooth.position.set(
      Math.sin(ang) * radius,
      y,
      z + (1 - Math.cos(ang)) * radius * 0.4
    );
    tooth.rotation.set(rotX, ang * 0.12, -ang * tilt);
    parent.add(tooth);
  }
}

export function createSharkMesh() {
  const root = new THREE.Group();
  root.name = "shark";
  const dorsal = toon("#6d7f8c");
  const dorsalDark = toon("#556671");
  const belly = toon("#f3eee4");
  const gum = toon("#c94a58");
  const caveMat = toon("#2a0d12");
  const tongueMat = toon("#ff5d7a");
  const toothMat = toon("#fff6e8");

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 14), dorsal);
  body.scale.set(0.84, 0.7, 1.72);
  body.position.set(0, 0.58, 0.38);
  addShadow(body);

  const bellyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), belly);
  bellyMesh.scale.set(0.8, 0.48, 1.62);
  bellyMesh.position.set(0, 0.36, 0.32);

  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 12), dorsal);
  snout.scale.set(1.12, 0.58, 0.92);
  snout.position.set(0, 0.92, -0.86);

  const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), belly);
  cheek.scale.set(1.28, 0.48, 0.72);
  cheek.position.set(0, 0.58, -0.82);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), dorsal);
  nose.scale.set(1.45, 0.72, 1.2);
  nose.position.set(0, 0.8, -1.16);
  const nostrilL = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 6), dorsalDark);
  nostrilL.position.set(0.07, 0.82, -1.28);
  const nostrilR = nostrilL.clone();
  nostrilR.position.x = -0.07;

  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.9, 8), dorsalDark);
  fin.position.set(0, 1.3, 0.22);
  fin.rotation.x = 0.2;
  addShadow(fin);

  const pecL = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.74, 8), dorsalDark);
  pecL.rotation.set(0.22, 0.12, 1.22);
  pecL.position.set(0.5, 0.38, 0.02);
  const pecR = pecL.clone();
  pecR.rotation.set(0.22, -0.12, -1.22);
  pecR.position.x = -0.5;

  const tail = new THREE.Group();
  const tailUpper = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.8, 8), dorsalDark);
  tailUpper.rotation.x = 0.7;
  tailUpper.position.set(0, 0.34, 0.08);
  const tailLower = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 8), dorsalDark);
  tailLower.rotation.x = 2.42;
  tailLower.position.set(0, -0.1, 0.06);
  tail.add(tailUpper, tailLower);
  tail.position.set(0, 0.56, 1.4);

  const makeEye = (side) => {
    const g = new THREE.Group();
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.092, 10, 8), toon("#f7f2e8"));
    white.scale.set(1.08, 0.9, 0.82);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 8), toon("#141414"));
    pupil.position.set(side * 0.01, -0.008, -0.052);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), toon("#ffffff"));
    glint.position.set(side * 0.024, 0.024, -0.078);
    const brow = new THREE.Mesh(new THREE.SphereGeometry(0.082, 8, 6), dorsalDark);
    brow.scale.set(1.2, 0.3, 0.68);
    brow.position.set(side * -0.01, 0.1, 0);
    brow.rotation.z = side * -0.45;
    g.add(white, pupil, glint, brow);
    g.position.set(side * 0.38, 0.86, -0.78);
    return g;
  };

  const mouth = new THREE.Group();
  mouth.position.set(0, 0.5, -1.14);

  const cave = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 10), caveMat);
  cave.scale.set(1.22, 1.08, 0.82);
  cave.position.set(0, -0.02, 0.14);

  const upperGum = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), gum);
  upperGum.scale.set(1.4, 0.3, 0.7);
  upperGum.position.set(0, 0.22, -0.02);

  const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), tongueMat);
  tongue.scale.set(0.92, 0.42, 1.05);
  tongue.position.set(0, -0.04, 0.04);

  const jaw = new THREE.Group();
  jaw.position.set(0, -0.28, 0.04);
  jaw.rotation.x = -0.48;

  const jawWhite = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), belly);
  jawWhite.scale.set(1.32, 0.4, 0.9);
  const lowerGum = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), gum);
  lowerGum.scale.set(1.36, 0.26, 0.68);
  lowerGum.position.set(0, 0.1, -0.05);
  jaw.add(jawWhite, lowerGum);

  addSharkToothArc(mouth, toothMat, {
    count: 11,
    y: 0.14,
    z: -0.12,
    radius: 0.38,
    baseH: 0.28,
    rotX: Math.PI,
    spread: 1.12,
  });
  addSharkToothArc(mouth, toothMat, {
    count: 7,
    y: 0.1,
    z: 0.0,
    radius: 0.26,
    baseH: 0.16,
    rotX: Math.PI,
    spread: 0.82,
    tilt: 0.32,
  });
  addSharkToothArc(jaw, toothMat, {
    count: 9,
    y: 0.16,
    z: -0.1,
    radius: 0.34,
    baseH: 0.22,
    rotX: 0,
    spread: 1.02,
  });

  mouth.add(cave, upperGum, tongue, jaw);

  for (let i = 0; i < 4; i += 1) {
    const gill = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.2, 0.042), dorsalDark);
    gill.position.set(0.35, 0.58, -0.18 + i * 0.09);
    gill.rotation.y = 0.22;
    const gillR = gill.clone();
    gillR.position.x = -0.35;
    gillR.rotation.y = -0.22;
    root.add(gill, gillR);
  }

  root.add(
    body,
    bellyMesh,
    snout,
    cheek,
    nose,
    nostrilL,
    nostrilR,
    fin,
    pecL,
    pecR,
    tail,
    makeEye(1),
    makeEye(-1),
    mouth
  );
  root.rotation.y = Math.PI;
  return root;
}

function roundedSquareShape(size, corner) {
  const s = new THREE.Shape();
  const h = size / 2;
  const r = Math.min(corner, h * 0.45);
  s.moveTo(-h + r, -h);
  s.lineTo(h - r, -h);
  s.quadraticCurveTo(h, -h, h, -h + r);
  s.lineTo(h, h - r);
  s.quadraticCurveTo(h, h, h - r, h);
  s.lineTo(-h + r, h);
  s.quadraticCurveTo(-h, h, -h, h - r);
  s.lineTo(-h, -h + r);
  s.quadraticCurveTo(-h, -h, -h + r, -h);
  s.closePath();
  return s;
}

function sharkWarningFinShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.2, -0.06);
  s.quadraticCurveTo(-0.16, 0.16, 0.04, 0.4);
  s.lineTo(0.3, -0.05);
  s.quadraticCurveTo(0.08, 0.02, -0.2, -0.06);
  s.closePath();
  return s;
}

function makeWaveStroke(y, amp, phase) {
  const pts = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = i / 12;
    pts.push(
      new THREE.Vector3(-0.34 + t * 0.68, y + Math.sin(t * Math.PI * 2 + phase) * amp, 0)
    );
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.028, 6, false);
}

export function createSignMesh() {
  const root = new THREE.Group();
  root.name = "sign";

  const yellow = new THREE.MeshLambertMaterial({
    color: "#f4c430",
    emissive: "#f4c430",
    emissiveIntensity: 0.18,
  });
  const ink = toon("#141414");
  const postMat = toon("#5b4636");
  const rust = toon("#8a5a32");

  const footing = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.12, 10), rust);
  footing.position.y = 0.04;
  addShadow(footing);

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.92, 8), postMat);
  post.position.y = 0.52;
  addShadow(post);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.07, 8), rust);
  collar.position.y = 0.96;

  const plate = new THREE.Group();
  plate.position.y = 1.18;

  const rimGeo = new THREE.ExtrudeGeometry(roundedSquareShape(1.12, 0.12), {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  rimGeo.translate(0, 0, -0.07);
  const rim = new THREE.Mesh(rimGeo, ink);
  rim.rotation.z = Math.PI / 4;
  addShadow(rim);

  const faceGeo = new THREE.ExtrudeGeometry(roundedSquareShape(0.92, 0.1), {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.018,
    bevelSegments: 2,
  });
  faceGeo.translate(0, 0, -0.05);
  const face = new THREE.Mesh(faceGeo, yellow);
  face.rotation.z = Math.PI / 4;
  addShadow(face);

  const icon = new THREE.Group();
  icon.position.z = 0.12;

  const finGeo = new THREE.ExtrudeGeometry(sharkWarningFinShape(), {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 1,
  });
  finGeo.translate(0, 0, -0.035);
  const finMark = new THREE.Mesh(finGeo, ink);
  finMark.position.set(-0.02, 0.08, 0);
  icon.add(finMark);

  icon.add(
    new THREE.Mesh(makeWaveStroke(-0.12, 0.045, 0.2), ink),
    new THREE.Mesh(makeWaveStroke(-0.22, 0.04, 1.1), ink),
    new THREE.Mesh(makeWaveStroke(-0.32, 0.035, 0.5), ink)
  );

  plate.add(rim, face, icon);
  root.add(footing, post, collar, plate);
  return root;
}

function barrelPoint(t, radius, cx = 1.32, cy = 1.88) {
  const ang = -0.38 * Math.PI + t * 1.38 * Math.PI;
  return {
    x: cx + Math.cos(ang) * radius * 1.12,
    y: cy + Math.sin(ang) * radius * 0.96,
  };
}

function createBarrelShape(rOut, rIn, t0 = 0.3, t1 = 0.98) {
  const shape = new THREE.Shape();
  const n = 40;
  const first = barrelPoint(t0, rOut);
  shape.moveTo(first.x, first.y);
  for (let i = 1; i <= n; i += 1) {
    const p = barrelPoint(t0 + (t1 - t0) * (i / n), rOut);
    shape.lineTo(p.x, p.y);
  }
  for (let i = n; i >= 0; i -= 1) {
    const p = barrelPoint(t0 + (t1 - t0) * (i / n), rIn);
    shape.lineTo(p.x, p.y);
  }
  shape.closePath();
  return shape;
}

function createWaterShader() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReady: { value: 0 },
    },
    side: THREE.DoubleSide,
    transparent: false,
    vertexShader: `
      uniform float uTime;
      varying vec3 vPos;
      varying vec3 vN;
      void main() {
        vPos = position;
        vN = normalize(normalMatrix * normal);
        vec3 p = position;
        p += normal * sin(position.y * 3.6 + position.z * 1.1 + uTime * 2.6) * 0.04;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uReady;
      varying vec3 vPos;
      varying vec3 vN;
      void main() {
        vec3 deep = vec3(0.04, 0.32, 0.5);
        vec3 face = vec3(0.16, 0.74, 0.86);
        vec3 room = vec3(0.05, 0.5, 0.36);
        vec3 foam = vec3(0.96, 0.99, 1.0);
        float inner = smoothstep(-0.15, 0.7, -vN.x);
        vec3 col = mix(face, deep, inner);
        col = mix(col, room, inner * 0.62);
        float lip = smoothstep(2.7, 3.6, vPos.y) * smoothstep(0.6, 2.4, vPos.x);
        float lines = 0.09 * sin(vPos.y * 8.5 + vPos.z * 1.8 + uTime * 2.2);
        col += lines * vec3(0.07, 0.14, 0.18);
        col = mix(col, foam, lip);
        if (uReady > 0.5) {
          col = mix(col, vec3(0.28, 0.92, 0.58), 0.22);
        }
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}

export function createTubeMesh() {
  const root = new THREE.Group();
  const depth = 8.4;
  const waterMat = createWaterShader();

  const shellGeo = new THREE.ExtrudeGeometry(createBarrelShape(2.55, 1.18), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.28,
    bevelSize: 0.2,
    bevelSegments: 3,
    curveSegments: 16,
  });
  shellGeo.translate(0, 0, -depth / 2);
  shellGeo.computeVertexNormals();
  const curl = new THREE.Mesh(shellGeo, waterMat);
  curl.name = "waveBody";

  const cave = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshLambertMaterial({ color: "#042e28", side: THREE.BackSide })
  );
  cave.scale.set(1.2, 0.78, 2.6);
  cave.position.set(0.7, 2.35, 0);
  cave.rotation.z = -0.12;

  const foam = new THREE.Group();
  foam.name = "foamClaws";
  const lip = barrelPoint(0.48, 2.62);
  const foamCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(lip.x, lip.y - 0.05, -3.6),
    new THREE.Vector3(lip.x + 0.2, lip.y + 0.28, 0),
    new THREE.Vector3(lip.x, lip.y - 0.02, 3.6),
  ]);
  foam.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(foamCurve, 32, 0.38, 10, false),
      new THREE.MeshBasicMaterial({ color: "#f8fdff" })
    )
  );
  const splashMat = new THREE.MeshBasicMaterial({ color: "#f4fbff" });
  for (let i = 0; i < 14; i += 1) {
    const p = foamCurve.getPoint(i / 13);
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.14 + (i % 3) * 0.05, 8, 6), splashMat);
    drop.position.set(p.x + 0.06, p.y + 0.16, p.z);
    drop.scale.set(1.4, 0.65, 1.1);
    foam.add(drop);
  }

  root.add(curl, cave, foam);
  return root;
}

export function waveHeight(x) {
  const t = Math.max(0, Math.min(1.12, (x + 5.8) / 12.2));
  return 0.18 + t * t * 4.6;
}

export function waveSlope(x) {
  return (waveHeight(x + 0.25) - waveHeight(x - 0.25)) / 0.5;
}

export function createWater() {
  const geo = new THREE.PlaneGeometry(26, 220, 70, 90);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    pos.setY(i, waveHeight(x));
  }
  geo.computeVertexNormals();

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
      varying float vH;
      void main() {
        vUv = uv;
        vec3 p = position;
        float ripple = sin(p.x * 0.55 + uTime * 2.4) * 0.07 + sin((p.z + uOffset) * 0.22 + uTime) * 0.05;
        p.y += ripple;
        vH = p.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vH;
      void main() {
        vec3 trough = vec3(0.04, 0.28, 0.48);
        vec3 face = vec3(0.12, 0.72, 0.86);
        vec3 lip = vec3(0.92, 0.98, 1.0);
        float t = clamp(vUv.x, 0.0, 1.0);
        vec3 col = mix(trough, face, smoothstep(0.18, 0.62, t));
        col = mix(col, lip, smoothstep(0.72, 0.96, t));
        float lines = 0.08 * sin((vUv.y + vH) * 48.0);
        col += lines * vec3(0.12, 0.18, 0.22);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 0, -40);
  mesh.receiveShadow = true;
  mesh.name = "water";
  return mesh;
}

export function createWaveWall() {
  const geo = new THREE.PlaneGeometry(220, 7.5, 80, 16);
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
        float curl = smoothstep(0.25, 1.0, uv.y);
        p.z += sin(uv.x * 20.0 + uTime * 3.2 + uOffset) * 0.32 * curl;
        p.z -= curl * 2.1;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      void main() {
        vec3 base = mix(vec3(0.08, 0.42, 0.66), vec3(0.55, 0.9, 1.0), vUv.y);
        float lip = smoothstep(0.7, 1.0, vUv.y);
        base = mix(base, vec3(1.0), lip);
        gl_FragColor = vec4(base, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.y = -Math.PI / 2;
  mesh.rotation.z = 0.55;
  const lipX = 8.4;
  mesh.position.set(lipX, waveHeight(lipX) + 2.4, -50);
  return mesh;
}

export function createFoamLip() {
  const geo = new THREE.CylinderGeometry(0.62, 0.95, 220, 10, 1);
  geo.rotateX(Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: "#f8fdff" });
  const mesh = new THREE.Mesh(geo, mat);
  const x = 7.15;
  mesh.position.set(x, waveHeight(x) + 0.45, -40);
  mesh.rotation.z = -Math.atan(waveSlope(x));
  return mesh;
}

export function createSun() {
  const group = new THREE.Group();
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 24, 18),
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
    const a = new THREE.Mesh(new THREE.SphereGeometry(1.6, 14, 12), mat);
    const b = new THREE.Mesh(new THREE.SphereGeometry(1.2, 14, 12), mat);
    b.position.set(1.4, 0.25, 0.15);
    puff.add(a, b);
    puff.position.set(-18 + (i % 4) * 11, 12 + (i % 3) * 1.4, -36 - i * 14);
    group.add(puff);
  }
  return group;
}
