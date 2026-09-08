import * as THREE from "three";
import {
  GRAVITY,
  JUMP_VELOCITY,
  LIP_BOOST_SECONDS,
  MAX_MOVE,
  MAX_X,
  MIN_X,
  MOVE_ACCEL,
  MOVE_FRICTION,
  TOUCH_MAX_MOVE_SCALE,
  TOUCH_STEER_DAMP,
} from "./constants.js";
import { createPlayerMesh, waveHeight, waveSlope } from "./models.js";

const LIP_EDGE = MAX_X - 0.1;
const TROUGH_EDGE = MIN_X + 0.1;

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
    this.spin = 0;
    this.spinVel = 0;
    this.lipBoost = 0;
    this.boostKind = null;
    this.returning = 0;
    this.lipReady = true;
    this.cutReady = true;
    this.maneuverEvent = null;
    this.cutLean = 0;
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
    this.spin = 0;
    this.spinVel = 0;
    this.lipBoost = 0;
    this.boostKind = null;
    this.returning = 0;
    this.lipReady = true;
    this.cutReady = true;
    this.maneuverEvent = null;
    this.cutLean = 0;
    this.mesh.visible = true;
    this.mesh.rotation.set(0, 0, 0);
    this.#poseHaka(false);
    this.#sync();
  }

  consumeManeuver() {
    const kind = this.maneuverEvent;
    this.maneuverEvent = null;
    return kind;
  }

  update(dt, input, time) {
    this.braking = input.down && this.returning === 0;
    if (this.lipBoost > 0) this.lipBoost = Math.max(0, this.lipBoost - dt);
    else this.boostKind = null;

    if (this.x < MAX_X * 0.35) this.lipReady = true;
    if (this.x > MIN_X * 0.35) this.cutReady = true;

    if (this.returning === 0 && this.lipReady && this.grounded && this.x >= LIP_EDGE) {
      this.#launchLip();
    }
    if (this.returning === 0 && this.cutReady && this.grounded && this.x <= TROUGH_EDGE) {
      this.#launchCutback();
    }

    if (this.returning < 0) {
      this.vx = THREE.MathUtils.damp(this.vx, -MAX_MOVE, 18, dt);
      this.x += this.vx * dt;
      if (this.x <= 0) {
        this.x = 0;
        this.vx = 0;
        if (this.grounded) this.returning = 0;
      }
    } else if (this.returning > 0) {
      this.vx = THREE.MathUtils.damp(this.vx, MAX_MOVE, 18, dt);
      this.x += this.vx * dt;
      if (this.x >= 0) {
        this.x = 0;
        this.vx = 0;
        this.returning = 0;
        this.cutLean = 0;
      }
    } else {
      const dir = input.axis ?? ((input.right ? 1 : 0) - (input.left ? 1 : 0));
      const touch = Boolean(input.touching);
      if (touch) {
        const cap = MAX_MOVE * TOUCH_MAX_MOVE_SCALE;
        this.vx = THREE.MathUtils.damp(this.vx, dir * cap, TOUCH_STEER_DAMP, dt);
      } else {
        if (dir !== 0) this.vx += dir * MOVE_ACCEL * dt;
        else this.vx = THREE.MathUtils.damp(this.vx, 0, MOVE_FRICTION, dt);
        this.vx = THREE.MathUtils.clamp(this.vx, -MAX_MOVE, MAX_MOVE);
      }
      this.x = THREE.MathUtils.clamp(this.x + this.vx * dt, MIN_X, MAX_X);
    }

    if (input.jumpPressed && this.grounded && this.returning === 0) this.#jump();

    if (!this.grounded) {
      this.vy -= GRAVITY * dt;
      this.y += this.vy * dt;
      this.spin += this.spinVel * dt;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.grounded = true;
        this.spin = 0;
        this.spinVel = 0;
        if (this.returning < 0 && this.x <= 0) this.returning = 0;
      }
    }

    const cutTarget = this.returning > 0 ? 1 : 0;
    this.cutLean = THREE.MathUtils.damp(this.cutLean, cutTarget, 10, dt);

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
    this.returning = 0;
    this.cutLean = 0;
  }

  bumpFrom(otherX) {
    this.vx += this.x >= otherX ? 6 : -6;
  }

  headWorld() {
    const v = new THREE.Vector3(this.x, waveHeight(this.x) + this.y + 1.85, this.z);
    return v;
  }

  #jump(velocity = JUMP_VELOCITY) {
    this.vy = velocity;
    this.grounded = false;
    this.spin = 0;
    const air = (2 * velocity) / GRAVITY;
    this.spinVel = (Math.PI * 2) / Math.max(0.35, air);
  }

  #grantBoost(kind) {
    this.lipBoost = LIP_BOOST_SECONDS;
    this.boostKind = kind;
    this.maneuverEvent = kind;
  }

  #launchLip() {
    this.lipReady = false;
    this.returning = -1;
    this.#grantBoost("lip");
    this.#jump(JUMP_VELOCITY * 1.18);
    this.vx = -MAX_MOVE;
  }

  #launchCutback() {
    this.cutReady = false;
    this.returning = 1;
    this.#grantBoost("cutback");
    this.vx = MAX_MOVE;
  }

  #sync(time = 0) {
    const bob = this.grounded ? Math.sin(time * 9) * 0.03 : 0;
    const surface = waveHeight(this.x);
    const faceTilt = Math.atan(waveSlope(this.x));
    const cutT = this.returning > 0
      ? THREE.MathUtils.clamp((this.x - MIN_X) / -MIN_X, 0, 1)
      : 0;
    const carve = Math.sin(cutT * Math.PI) * this.cutLean;

    this.mesh.position.set(this.x, surface + this.y + bob, this.z);
    this.mesh.rotation.z = -faceTilt + (this.grounded ? -carve * 0.7 : Math.sin(this.spin) * 0.28);
    this.mesh.rotation.y = this.grounded
      ? THREE.MathUtils.lerp(this.mesh.rotation.y, carve * 1.25, 0.22)
      : this.spin;
    this.mesh.rotation.x = this.grounded
      ? THREE.MathUtils.lerp(this.mesh.rotation.x, carve * 0.18, 0.22)
      : Math.sin(this.spin * 0.5) * 0.45;

    const board = this.mesh.getObjectByName("board");
    const rider = this.mesh.getObjectByName("rider");
    if (board) {
      const rail = this.returning > 0 ? -carve * 0.45 : -this.vx * 0.05;
      board.rotation.z = THREE.MathUtils.lerp(board.rotation.z, rail, 0.2);
      board.rotation.x = this.braking ? 0.18 : this.grounded ? carve * 0.12 : -0.35;
    }
    if (rider) {
      rider.rotation.z = -this.vx * 0.03 - carve * 0.35;
      rider.position.y = this.braking ? -0.08 : this.grounded ? 0 : 0.06;
    }
    const blob = this.mesh.getObjectByName("blob");
    if (blob) {
      blob.position.y = -this.y + 0.02;
      blob.scale.setScalar(this.grounded ? 1 + carve * 0.35 : 0.7);
    }

    if (this.haka <= 0) {
      if (this.returning > 0) this.#poseCutback(carve);
      else this.#poseAir(!this.grounded);
    }
  }

  #poseAir(on) {
    const armL = this.mesh.getObjectByName("armL");
    const armR = this.mesh.getObjectByName("armR");
    if (armL) armL.rotation.z = on ? 1.35 : 0.28;
    if (armR) {
      armR.rotation.z = on ? -1.45 : -0.28;
      armR.rotation.x = on ? 0.25 : 0;
      armR.rotation.y = 0;
    }
  }

  #poseCutback(carve) {
    const armL = this.mesh.getObjectByName("armL");
    const armR = this.mesh.getObjectByName("armR");
    if (armL) armL.rotation.z = 0.28 + carve * 1.1;
    if (armR) {
      armR.rotation.z = -0.55 - carve * 0.8;
      armR.rotation.x = carve * 0.35;
      armR.rotation.y = -carve * 0.4;
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
