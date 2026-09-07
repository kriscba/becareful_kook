import * as THREE from "three";
import {
  GRAVITY,
  JUMP_VELOCITY,
  MAX_MOVE,
  MAX_X,
  MIN_X,
  MOVE_ACCEL,
  MOVE_FRICTION,
} from "./constants.js";
import { createPlayerMesh } from "./models.js";

export class Player {
  constructor() {
    this.mesh = createPlayerMesh();
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.grounded = true;
    this.braking = false;
    this.invuln = 0;
    this.blink = 0;
    this.haka = 0;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.grounded = true;
    this.braking = false;
    this.invuln = 0;
    this.haka = 0;
    this.mesh.visible = true;
    this.#poseHaka(false);
    this.#sync();
  }

  update(dt, input, time) {
    this.braking = input.down;
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (dir !== 0) this.vx += dir * MOVE_ACCEL * dt;
    else this.vx = THREE.MathUtils.damp(this.vx, 0, MOVE_FRICTION, dt);
    this.vx = THREE.MathUtils.clamp(this.vx, -MAX_MOVE, MAX_MOVE);
    this.x = THREE.MathUtils.clamp(this.x + this.vx * dt, MIN_X, MAX_X);

    if (input.jumpPressed && this.grounded) {
      this.vy = JUMP_VELOCITY;
      this.grounded = false;
    }
    if (!this.grounded) {
      this.vy -= GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.grounded = true;
      }
    }

    if (this.invuln > 0) {
      this.invuln -= dt;
      this.blink += dt;
      this.mesh.visible = Math.floor(this.blink * 12) % 2 === 0;
    } else {
      this.mesh.visible = true;
    }

    if (this.haka > 0) {
      this.haka = Math.max(0, this.haka - dt);
      this.#poseHaka(this.haka > 0);
    }

    this.#sync(time);
  }

  celebrateHaka(seconds = 1.8) {
    this.haka = seconds;
    this.#poseHaka(true);
  }

  hit() {
    this.invuln = 1.15;
    this.blink = 0;
    this.vx += this.x > 0 ? -4 : 4;
  }

  bumpFrom(otherX) {
    this.vx += this.x >= otherX ? 6 : -6;
  }

  headWorld() {
    const v = new THREE.Vector3(this.x, this.y + 1.85, this.z);
    return v;
  }

  #sync(time = 0) {
    const bob = this.grounded ? Math.sin(time * 9) * 0.03 : 0;
    this.mesh.position.set(this.x, this.y + bob, this.z);
    const board = this.mesh.getObjectByName("board");
    const rider = this.mesh.getObjectByName("rider");
    if (board) {
      board.rotation.z = THREE.MathUtils.lerp(board.rotation.z, -this.vx * 0.05, 0.2);
      board.rotation.x = this.braking ? 0.18 : this.grounded ? 0 : -0.22;
    }
    if (rider) {
      rider.rotation.z = -this.vx * 0.03;
      rider.position.y = this.braking ? -0.08 : 0;
    }
    const blob = this.mesh.getObjectByName("blob");
    if (blob) {
      blob.position.y = -this.y + 0.02;
      blob.scale.setScalar(this.grounded ? 1 : 0.7);
    }
  }

  #poseHaka(on) {
    const armR = this.mesh.getObjectByName("armR");
    const shaka = this.mesh.getObjectByName("shaka");
    if (armR) {
      armR.rotation.z = on ? -2.65 : -0.45;
      armR.rotation.x = on ? 0.15 : 0;
      armR.rotation.y = on ? -0.55 : 0;
    }
    if (shaka) shaka.visible = on;
  }
}
