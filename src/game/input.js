const TOUCH_STICK_RANGE = 0.28;
const TOUCH_STICK_DEAD = 0.04;
const TOUCH_JUMP_SWIPE = 0.12;
const TOUCH_BRAKE_SWIPE = 0.1;

function isFinger(type) {
  return type === "touch" || type === "pen";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function analogAxis(dx) {
  const abs = Math.abs(dx);
  if (abs <= TOUCH_STICK_DEAD) return 0;
  const mag = (abs - TOUCH_STICK_DEAD) / (TOUCH_STICK_RANGE - TOUCH_STICK_DEAD);
  return Math.sign(dx) * clamp(mag, 0, 1);
}

export class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.axis = 0;
    this.touching = false;
    this.jumpPressed = false;
    this._jumpLatch = false;
    this._jumpQueued = false;

    this._keys = { left: false, right: false, up: false, down: false };
    this._pointers = new Map();
    this.canvas = null;

    this._onKeyDown = (e) => this.#setKey(e.code, true, e);
    this._onKeyUp = (e) => this.#setKey(e.code, false, e);
    this._onPointerDown = (e) => this.#pointerDown(e);
    this._onPointerMove = (e) => this.#pointerMove(e);
    this._onPointerUp = (e) => this.#pointerUp(e);
    this._onContext = (e) => e.preventDefault();
    this._onTouch = (e) => e.preventDefault();
  }

  attach(canvas) {
    this.canvas = canvas;
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
    canvas.addEventListener("pointerdown", this._onPointerDown);
    canvas.addEventListener("pointermove", this._onPointerMove);
    canvas.addEventListener("pointerup", this._onPointerUp);
    canvas.addEventListener("pointercancel", this._onPointerUp);
    canvas.addEventListener("lostpointercapture", this._onPointerUp);
    canvas.addEventListener("contextmenu", this._onContext);
    canvas.addEventListener("touchstart", this._onTouch, { passive: false });
    canvas.addEventListener("touchmove", this._onTouch, { passive: false });
  }

  detach() {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
    if (this.canvas) {
      this.canvas.removeEventListener("pointerdown", this._onPointerDown);
      this.canvas.removeEventListener("pointermove", this._onPointerMove);
      this.canvas.removeEventListener("pointerup", this._onPointerUp);
      this.canvas.removeEventListener("pointercancel", this._onPointerUp);
      this.canvas.removeEventListener("lostpointercapture", this._onPointerUp);
      this.canvas.removeEventListener("contextmenu", this._onContext);
      this.canvas.removeEventListener("touchstart", this._onTouch);
      this.canvas.removeEventListener("touchmove", this._onTouch);
    }
  }

  beginFrame() {
    this.#sync();
    this.jumpPressed = (this.up && !this._jumpLatch) || this._jumpQueued;
    this._jumpLatch = this.up;
    this._jumpQueued = false;
  }

  reset() {
    this._keys.left = this._keys.right = this._keys.up = this._keys.down = false;
    this.clearPointers();
    this.jumpPressed = this._jumpLatch = this._jumpQueued = false;
    this.axis = 0;
    this.touching = false;
  }

  clearPointers() {
    this._pointers.clear();
    this.#sync();
  }

  #sync() {
    let axis = 0;
    let up = false;
    let down = false;
    let touching = false;
    let primary = null;
    for (const p of this._pointers.values()) {
      if (!isFinger(p.type)) continue;
      touching = true;
      if (!primary) primary = p;
      if (p.startNy - p.ny > TOUCH_JUMP_SWIPE) up = true;
    }
    if (primary) {
      axis = analogAxis(primary.nx - primary.startNx);
      if (primary.ny - primary.startNy > TOUCH_BRAKE_SWIPE) down = true;
    }
    const keyDir = (this._keys.right ? 1 : 0) - (this._keys.left ? 1 : 0);
    this.axis = keyDir !== 0 ? keyDir : axis;
    this.left = this.axis < 0;
    this.right = this.axis > 0;
    this.up = this._keys.up || up;
    this.down = this._keys.down || down;
    this.touching = touching && keyDir === 0;
  }

  #setKey(code, down, event) {
    const map = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      KeyA: "left",
      KeyD: "right",
      KeyW: "up",
      KeyS: "down",
    };
    const key = map[code];
    if (!key) return;
    event.preventDefault();
    this._keys[key] = down;
    if (key === "up" && down) this._jumpQueued = true;
    this.#sync();
  }

  #norm(e) {
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    return {
      nx: (e.clientX - r.left) / w,
      ny: (e.clientY - r.top) / h,
    };
  }

  #pointerDown(e) {
    if (!isFinger(e.pointerType)) return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    const pos = this.#norm(e);
    this._pointers.set(e.pointerId, {
      ...pos,
      startNx: pos.nx,
      startNy: pos.ny,
      jumped: false,
      type: e.pointerType,
    });
    this.#sync();
  }

  #pointerMove(e) {
    if (!this._pointers.has(e.pointerId)) return;
    const prev = this._pointers.get(e.pointerId);
    const pos = this.#norm(e);
    const jumped = prev.jumped || prev.startNy - pos.ny > TOUCH_JUMP_SWIPE;
    if (!prev.jumped && jumped) this._jumpQueued = true;
    this._pointers.set(e.pointerId, {
      ...pos,
      startNx: prev.startNx,
      startNy: prev.startNy,
      jumped,
      type: prev.type,
    });
    this.#sync();
  }

  #pointerUp(e) {
    if (!this._pointers.has(e.pointerId)) return;
    this._pointers.delete(e.pointerId);
    this.#sync();
  }
}
