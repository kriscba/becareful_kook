# Water and barrel forms

Use this when building or replacing the tube, wave wall, foam lip, or any pitching water.

## Why the last tube failed

Extruding a C-shape along Z puts a **flat C cap** toward the camera. Thin inner/outer radii look like a glass hoop. A Hokusai `CanvasTexture` on a torus looks like a printed sticker. The player is at `z = 0` looking toward `-Z`, so they see that cap first.

A barrel from this camera should read as:

1. A **thick wall of water** on the right (the face)
2. A **lip** that throws over at the top
3. A **dark cave** under the throw (green room), not the sky
4. **Whitewater along the lip in Z**, not a foam ring around the opening

## Preferred construction

Build a `Group` with four jobs. Share one water `ShaderMaterial` for wall + curl.

```js
// 1) Face wall — the mass. Box or scaled sphere, planted on the wave, leaning with the face.
wall.position.set(2.0, 1.5, 0);
wall.rotation.z = -0.4; // match waveSlope at this x

// 2) Curl — only the upper throw (t ~ 0.35→1.0), thick (outer − inner ≥ 1.2).
//    Depth along Z should be long (≥ 8) so the hole recedes instead of reading as a ring.

// 3) Cave — dark inward shell occupying the hole (BackSide sphere / partial sphere).
//    Color ~ #042e28. This stops sky-through.

// 4) Foam — CatmullRom along Z at the lip point, TubeGeometry radius ~ 0.35, plus a few squashed spheres.
```

Do **not** add a second torus, an inner open cylinder, or a texture atlas of waves.

## Curl profile (right-hander)

Parameter `t ∈ [0, 1]` around the throw. Center the ellipse on the **face**, not on the player:

- `cx ≈ 1.3`, `cy ≈ 1.8` (local to the tube mesh)
- Start `t = 0` low on the **right** (waterline of the face)
- `t ≈ 0.5` high lip
- `t = 1` curtain coming down toward the player path (`x ≈ 0`), still above the deck

Player rides near local `x = 0`. Keep the hole ≥ ~2.2 wide and ≥ ~1.6 tall at rider height.

Plant the group with `y = waveHeight(item.x)` (see `BASE_Y.tube` in `obstacles.js`). Do not lift the whole group by a leftover torus radius.

## Shader notes

Color from **position and normal**, not UVs from ExtrudeGeometry (those UVs are messy).

- Outer / `+X` / facing light: cyan face
- Inward / `-X` normals: deeper teal → green room
- High `y` on the `+X` side: mix to foam white
- `uReady`: slight green mix when the player is lined up (uniform already used by the spawner on `waveBody`)

Keep vertex displacement tiny (`< 0.05`). Large displacement breaks the silhouette and the collider.

## Wave surface (already in world)

The rideable water is a displaced plane (`createWater`) plus a pitching wall (`createWaveWall`) and a foam cylinder on the lip (`createFoamLip`). A tube should **look like a local exaggeration of that same wave**, not a separate prop floating above it.

## Fast in-game check

After `game.start()`:

```js
game.spawner.spawnNow("tube", game.player.x + 0.3);
const item = game.spawner.items.find((i) => i.type === "tube");
item.z = -14;
item.mesh.position.z = -14;
```

If you see a ring, a sticker, or a rainbow arch over the head: thicken the wall, darken the cave, move mass to `+X`, and kill the facing cap silhouette.
