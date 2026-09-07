export class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.jumpPressed = false;
    this._jumpLatch = false;

    this._onDown = (e) => this.#set(e.code, true, e);
    this._onUp = (e) => this.#set(e.code, false, e);
  }

  attach() {
    window.addEventListener("keydown", this._onDown);
    window.addEventListener("keyup", this._onUp);
  }

  detach() {
    window.removeEventListener("keydown", this._onDown);
    window.removeEventListener("keyup", this._onUp);
  }

  beginFrame() {
    this.jumpPressed = this.up && !this._jumpLatch;
    this._jumpLatch = this.up;
  }

  reset() {
    this.left = this.right = this.up = this.down = false;
    this.jumpPressed = this._jumpLatch = false;
  }

  #set(code, down, event) {
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
    this[key] = down;
  }
}
