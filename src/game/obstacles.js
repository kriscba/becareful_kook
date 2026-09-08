import * as THREE from "three";
import {
  DESPAWN_Z,
  MOBILE_PACK_CHANCE,
  SPAWN_Z,
  TUBE_APPROACH_Z,
} from "./constants.js";
import { createKookMesh, createRockMesh, createSharkMesh, createTubeMesh, waveHeight, waveSlope } from "./models.js";

const BASE_Y = { rock: 0.28, shark: 0, kook: 0, tube: 0 };

const FACTORIES = {
  rock: createRockMesh,
  shark: createSharkMesh,
  kook: createKookMesh,
  tube: createTubeMesh,
};

const COLLIDERS = {
  rock: { w: 1.35, h: 0.9, d: 1.3, jumpable: true },
  shark: { w: 1.15, h: 2.4, d: 2.6, jumpable: false },
  kook: { w: 0.9, h: 1.5, d: 1.8, jumpable: false },
  tube: { w: 2.8, h: 3.2, d: 3.0, jumpable: false },
};

export class ObstacleSpawner {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
    this.nextAt = 22;
    this.lastWasTube = false;
  }

  reset() {
    for (const item of this.items) this.scene.remove(item.mesh);
    this.items = [];
    this.nextAt = 22;
    this.lastWasTube = false;
  }

  spawnNow(type, x = 0) {
    this.#spawn(type, x);
  }

  update(dt, scrollSpeed, distance, player, events, spawnMul = 1, mobile = false) {
    this.#maybeSpawn(distance, spawnMul, mobile);
    const leftover = [];
    for (const item of this.items) {
      item.z += scrollSpeed * dt;
      item.mesh.position.z = item.z;
      this.#animate(item, dt, player);
      if (item.type === "tube") this.#trackTube(item, player);

      if (!item.resolved && item.type === "tube") {
        const dx = Math.abs(player.x - item.x);
        const inBarrel = Math.abs(item.z) < 2.6 && dx < 2.15;
        if (inBarrel) {
          item.resolved = true;
          events.onTube(true);
        }
      }

      if (!item.resolved && Math.abs(item.z) < item.size.d * 0.55) {
        this.#collide(item, player, events);
      }

      if (!item.resolved && item.z > 1.4) {
        this.#onPass(item, player, events);
        item.resolved = true;
      }

      if (item.z > DESPAWN_Z) this.scene.remove(item.mesh);
      else leftover.push(item);
    }
    this.items = leftover;
  }

  #maybeSpawn(distance, spawnMul = 1, mobile = false) {
    if (distance < this.nextAt) return;
    const gap = (32 + Math.random() * 18) * spawnMul;
    this.nextAt = distance + gap;

    const packChance = mobile ? MOBILE_PACK_CHANCE : 0.12;
    const pack = Math.random() < packChance ? 2 : 1;
    const usedX = [];
    for (let i = 0; i < pack; i += 1) {
      const type = this.#pickType(pack > 1);
      if (!type) continue;
      let x = THREE.MathUtils.randFloatSpread(8.4);
      if (type === "tube") x = THREE.MathUtils.randFloatSpread(2.6);
      while (usedX.some((u) => Math.abs(u - x) < 2.2)) {
        x = THREE.MathUtils.randFloatSpread(8.4);
      }
      usedX.push(x);
      this.#spawn(type, x);
    }
  }

  #pickType(inPack) {
    if (!inPack && !this.lastWasTube && Math.random() < 0.07) {
      this.lastWasTube = true;
      return "tube";
    }
    this.lastWasTube = false;
    const roll = Math.random();
    if (roll < 0.4) return "rock";
    if (roll < 0.7) return "shark";
    return "kook";
  }

  #spawn(type, x) {
    const mesh = FACTORIES[type]();
    mesh.position.set(x, waveHeight(x) + (BASE_Y[type] ?? 0), SPAWN_Z);
    this.scene.add(mesh);
    const size = COLLIDERS[type];
    this.items.push({
      type,
      mesh,
      x,
      z: SPAWN_Z,
      size,
      hit: false,
      resolved: false,
      brakeValid: false,
      approached: false,
      glow: 0,
    });
  }

  #animate(item, dt, player) {
    const faceTilt = -Math.atan(waveSlope(item.x));
    const base = waveHeight(item.x) + (BASE_Y[item.type] ?? 0);
    item.mesh.rotation.z = faceTilt;

    if (item.type === "shark") {
      item.mesh.position.y = base + 0.15 + Math.sin(item.z * 0.2) * 0.12;
      item.mesh.rotation.z = faceTilt + Math.sin(item.z * 0.15) * 0.08;
    } else {
      item.mesh.position.y = base;
    }
    if (item.type === "kook") {
      const rider = item.mesh.getObjectByName("rider");
      if (rider) rider.rotation.z = Math.sin(item.z * 0.35) * 0.35;
      item.mesh.rotation.y = Math.sin(item.z * 0.2) * 0.15;
    }
    if (item.type === "tube") {
      const claws = item.mesh.getObjectByName("foamClaws");
      if (claws) claws.rotation.z = Math.sin(item.z * 0.18) * 0.04;
      const body = item.mesh.getObjectByName("waveBody");
      if (body?.material?.uniforms) {
        const valid = Math.abs(player.x - item.x) < 2.15 && item.z > -30;
        body.material.uniforms.uReady.value = valid ? 1 : 0;
        body.material.uniforms.uTime.value = Math.abs(item.z) * 0.08;
      }
    }
  }

  #trackTube(item, player) {
    if (!item.approached && item.z >= TUBE_APPROACH_Z) {
      item.approached = true;
      item.brakeValid = player.braking;
    }
    if (item.approached && !player.braking) item.brakeValid = false;
  }

  #collide(item, player, events) {
    const dx = Math.abs(player.x - item.x);
    const dz = Math.abs(player.z - item.z);
    const dy = player.y;
    const hitX = dx < (0.7 + item.size.w) * 0.5;
    const hitZ = dz < (1.6 + item.size.d) * 0.5;
    if (!hitX || !hitZ) return;

    if (item.type === "rock") {
      if (dy > 0.85) return;
      item.hit = true;
      item.resolved = true;
      events.onHazard(item);
      return;
    }
    if (item.type === "shark") {
      item.hit = true;
      item.resolved = true;
      events.onHazard(item);
      return;
    }
    if (item.type === "kook") {
      item.hit = true;
      item.resolved = true;
      events.onHazard(item);
    }
  }

  #onPass(item, player, events) {
    if (item.hit) return;
    if (item.type === "shark") events.onSharkDodge();
    if (item.type === "kook") events.onKookDodge();
  }
}
