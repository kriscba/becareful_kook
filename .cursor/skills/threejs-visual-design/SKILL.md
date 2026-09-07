---
name: threejs-visual-design
description: >-
  Designs and critiques Three.js meshes, shaders, water, barrels/tubes, foam,
  and low-poly props so they read clearly from the game camera. Use when
  modeling or restyling 3D objects, improving how something looks, replacing
  textures/images, building water/wave/tube/barrel geometry, writing ShaderMaterial,
  or when the user mentions diseño, imágenes, modelos, texturas, tubo, ola,
  foam, torus, or visuales in this Three.js arcade.
---

# Three.js visual design

Read this skill before changing how a 3D object looks. The player never sees a Blender viewport — they see one camera angle in motion.

## Scene facts (this game)

- Camera sits behind the surfer (`z ≈ 10`) looking down the line toward `-Z`.
- Wave breaks to the **right** (`+X` = lip / wall, `-X` = trough).
- Ride surface is `waveHeight(x)` / `waveSlope(x)` in `src/game/models.js`. Plant props on that surface; tilt with the slope.
- Style: cartoon low-poly, Lambert/toon, saturated ocean palette. Not photoreal PBR, not illustrated stickers on 3D.

Palette to stay inside: trough `#0b4f78`, face `#1aa7c4`, foam `#f4fbff`, board `#ffd166`, rashguard `#06d6a0`, sunset `#ff8a4c`.

## Design loop

1. **Name the silhouette from the camera.** Sketch what the player should recognize in one glance (barrel hole, shark fin, rock chunk). If it only looks right in a side view, it is wrong.
2. **Build volume, not a picture.** Prefer solids, thick walls, and foam ridges. Do not paste a canvas drawing (Hokusai, emoji, photo) onto a mesh and call it done.
3. **Check the primitive trap.** A thin `TorusGeometry`, open `CylinderGeometry`, or a shallow extruded C **is a ring**. From behind the player it reads as “un círculo”, not water.
4. **Mass on the wave, hole in the travel path.** Water body lives on `+X` (the face). The rideable gap stays near local `x ≈ 0`. Foam lives on the **lip along Z**, not traced around the hole.
5. **Read it in the running game.** Spawn the object ahead of the player (`z ≈ -12` to `-18`) and look. Geometry that is correct in code is often a hoop on screen.

## Materials

- Characters, boards, rocks, sharks: `MeshLambertMaterial` with a little emissive (the existing `toon()` helper).
- Large water: `ShaderMaterial` with position-based color (deep / face / foam). Vertex ripples only, small displacement.
- Foam and spray: `MeshBasicMaterial` near-white so they stay bright in any light.
- Avoid `CanvasTexture` of illustrations. If you need variation, use vertex colors, cheap noise in the shader, or extra meshes.

## Geometry recipes

For barrels, pitching lips, and water walls, follow [water-forms.md](water-forms.md).

Default building blocks:

| Intent | Use | Avoid |
|---|---|---|
| Board / organic outline | `Shape` + `ExtrudeGeometry` (see the fish board) | A scaled box |
| Character | Group of capsules / spheres | One stretched primitive |
| Water face | Displaced plane + shader | Flat transparent plane |
| Barrel / tube | Thick wall on `+X` + curl + dark cave + foam along Z | Torus, textured cylinder, Japanese-wave quad |
| HUD icons | Compact SVG in `constants.js` | 3D screenshots |

## HUD vs world

- World objects are meshes in `models.js`.
- Header stats are SVGs (`BOARD_SVG`, `TOOTH_SVG`, `TUBE_SVG`, `WAVE_SVG`). Keep them readable at ~28px. Do not reuse game-over illustrations there.

## Critique checklist

Before finishing a visual change:

- [ ] Recognizable from the chase camera, not only in isolation
- [ ] Sits on `waveHeight(x)` and follows `waveSlope(x)`
- [ ] No thin ring / donut / sticker texture
- [ ] Foam and highlight describe the **lip**, not the hole outline
- [ ] Interior of a barrel is darker than the face (green room), not sky showing through a tube
- [ ] Named child meshes the spawner already looks up (`waveBody`, `foamClaws`, `board`, `rider`, …)
- [ ] Verified in the running game, not only by reading vertex math
