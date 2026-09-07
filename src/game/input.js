const TOUCH_DEAD = 0.14;
const JUMP_ZONE = 0.14;
const BRAKE_ZONE = 0.86;

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
    let last = null;
    for (const p of this._pointers.values()) {
      last = p;
      if (p.ny < JUMP_ZONE) up = true;
      else if (p.ny > BRAKE_ZONE) down = true;
      if (p.startNy - p.ny > 0.16) up = true;
    }
    if (last) {
      axis = (last.nx - 0.5) * 2;
      if (Math.abs(axis) < TOUCH_DEAD) axis = 0;
      else axis = Math.max(-1, Math.min(1, axis));
    }
    const keyDir = (this._keys.right ? 1 : 0) - (this._keys.left ? 1 : 0);
    this.axis = keyDir !== 0 ? keyDir : axis;
    this.left = this.axis < 0;
    this.right = this.axis > 0;
    this.up = this._keys.up || up;
    this.down = this._keys.down || down;
    this.touching = this._pointers.size > 0 && keyDir === 0;
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
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    const pos = this.#norm(e);
    this._pointers.set(e.pointerId, { ...pos, startNx: pos.nx, startNy: pos.ny });
    if (pos.ny < JUMP_ZONE) this._jumpQueued = true;
    this.#sync();
  }

  #pointerMove(e) {
    if (!this._pointers.has(e.pointerId)) return;
    const prev = this._pointers.get(e.pointerId);
    const pos = this.#norm(e);
    this._pointers.set(e.pointerId, { ...pos, startNx: prev.startNx, startNy: prev.startNy });
    this.#sync();
  }

  #pointerUp(e) {
    if (!this._pointers.has(e.pointerId)) return;
    this._pointers.delete(e.pointerId);
    this.#sync();
  }
}
