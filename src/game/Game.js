import * as THREE from "three";
import {
  BRAKE_FACTOR,
  CYCLE_SECONDS,
  FEET_PER_UNIT,
  FLOW_SCALE,
  FLOW_SECONDS,
  HAKA_SECONDS,
  INVULN_SECONDS,
  LIFE_BOOST,
  LIP_BOOST_MUL,
  MAX_LIVES,
  MAX_TIME_SPEED,
  MIN_TIME_SPEED,
  START_LIVES,
  SPEED_STEP_SECONDS,
  STOKE_SECONDS,
  TOOTH_SVG,
  TUBE_BONUS_FEET,
  WAVE_SVG,
  MOBILE_SPAWN_GAP,
  getLevel,
} from "./constants.js";
import { formatDistance, t, toDisplayDistance } from "../i18n.js";
import { HUD } from "./hud.js";
import { Input } from "./input.js";
import { ObstacleSpawner } from "./obstacles.js";
import { Player } from "./player.js";
import { World } from "./world.js";
import { waveHeight } from "./models.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.lang = "en";
    this.mode = "menu";
    this.hud = new HUD();
    this.input = new Input();
    this.clock = new THREE.Clock();
    this.time = 0;
    this.timeScale = 1;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    this.camera.position.set(0.2, 3.8, 9.2);
    this.camera.lookAt(0, 1.1, -8);
    this.world = new World(this.scene);
    this.player = new Player();
    this.scene.add(this.player.mesh);
    this.spawner = new ObstacleSpawner(this.scene);

    this._shake = 0;
    this.level = getLevel(0);
    this.pendingLife = 0;
    this.deathCause = "rock";
    this._portrait = false;
    this.#resize();
    window.addEventListener("resize", () => this.#resize());
    window.addEventListener("orientationchange", () => {
      setTimeout(() => this.#resize(), 180);
    });
    window.visualViewport?.addEventListener("resize", () => this.#resize());
    window.visualViewport?.addEventListener("scroll", () => this.#resize());
  }

  init() {
    this.input.attach(this.canvas);
    this.hud.setLang(this.lang);
    this.hud.showMenu();
    this.#bindUi();
    this.clock.start();
    this.#resize();
    requestAnimationFrame(() => this.#resize());
    this.renderer.setAnimationLoop(() => this.#frame());
  }

  start() {
    this.mode = "play";
    this.lives = START_LIVES;
    this.feet = 0;
    this.teeth = 0;
    this.tubes = 0;
    this.cycleElapsed = 0;
    this.stoke = 0;
    this.flow = 0;
    this.timeScale = 1;
    this.travel = 0;
    this.level = getLevel(0);
    this.pendingLife = 0;
    this.deathCause = "rock";
    this.player.reset();
    this.spawner.reset();
    if (this.#isMobilePlay()) this.spawner.nextAt = 34;
    this.input.reset();
    this.hud.hidePause();
    this.hud.showPlay();
    this.hud.update(this.#hudState());
  }

  #bindUi() {
    document.getElementById("play").addEventListener("click", (e) => {
      e.stopPropagation();
      this.start();
    });
    document.getElementById("restart").addEventListener("click", (e) => {
      e.stopPropagation();
      this.start();
    });
    this.hud.langBtns.forEach((btn) => {
      btn.addEventListener("pointerdown", (e) => e.stopPropagation());
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.lang = btn.dataset.lang;
        this.hud.setLang(this.lang);
        if (this.mode === "play" || this.mode === "paused") {
          this.hud.update(this.#hudState());
        }
      });
    });
    this.hud.pauseBtn.addEventListener("pointerdown", (e) => e.stopPropagation());
    this.hud.pauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.mode === "play") this.#pause();
    });
    this.hud.pause.addEventListener("pointerdown", (e) => {
      if (e.target.closest("[data-lang], button, .lang-row")) return;
      if (this.mode === "paused") this.#resume();
    });
    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      if (e.code !== "Escape" && e.code !== "KeyP") return;
      if (this.mode === "play") this.#pause();
      else if (this.mode === "paused") this.#resume();
    });
  }

  #frame() {
    const rawDt = Math.min(this.clock.getDelta(), 0.05);
    if (this.mode === "paused") {
      this.renderer.render(this.scene, this.camera);
      return;
    }
    this.time += rawDt;
    if (this.mode === "play") this.#updatePlay(rawDt);
    else this.#idle(rawDt);
    this.#camera();
    this.renderer.render(this.scene, this.camera);
  }

  #idle(dt) {
    this.world.update(this.time, 10, dt);
    this.player.update(dt, { left: false, right: false, down: false, jumpPressed: false }, this.time);
  }

  #updatePlay(rawDt) {
    if (this.flow > 0) {
      this.flow = Math.max(0, this.flow - rawDt);
      this.timeScale = this.flow > 0 ? FLOW_SCALE : 1;
    }
    if (this.stoke > 0) this.stoke = Math.max(0, this.stoke - rawDt);

    if (this.pendingLife > 0) {
      this.pendingLife -= rawDt;
      if (this.pendingLife <= 0) {
        this.pendingLife = 0;
        this.#grantTubeLife();
      }
    }

    const dt = rawDt * this.timeScale;
    this.input.beginFrame();
    this.cycleElapsed += rawDt;
    if (this.cycleElapsed >= CYCLE_SECONDS) this.cycleElapsed = 0;

    const scroll = this.#scrollSpeed();
    const stokeMul = this.stoke > 0 ? 2 : 1;
    this.feet += scroll * dt * FEET_PER_UNIT * stokeMul;
    this.travel += scroll * dt;
    this.#checkLevel();

    this.player.update(dt, this.input, this.time);
    const maneuver = this.player.consumeManeuver();
    if (maneuver === "lip") this.hud.showBanner(t(this.lang, "offTheLip"));
    if (maneuver === "cutback") this.hud.showBanner(t(this.lang, "cutback"));
    this.world.update(this.time, scroll, dt);
    this.spawner.update(dt, scroll, this.travel, this.player, {
      onHazard: (item) => this.#hurt(item.type),
      onKookDodge: () => this.#kookSpeech(),
      onSharkDodge: (ft) => this.#sharkDodge(ft),
      onTube: (ok) => this.#tube(ok),
    }, this.level.spawn * (this.#isMobilePlay() ? MOBILE_SPAWN_GAP : 1), this.#isMobilePlay());

    if (this._shake > 0) this._shake = Math.max(0, this._shake - dt * 8);
    this.hud.update(this.#hudState());
  }

  #isMobilePlay() {
    return this._portrait || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }

  #scrollSpeed() {
    const steps = Math.floor(this.cycleElapsed / SPEED_STEP_SECONDS);
    const maxSteps = Math.max(1, Math.floor(CYCLE_SECONDS / SPEED_STEP_SECONDS));
    const tCycle = Math.min(steps, maxSteps) / maxSteps;
    const timeSpeed = MIN_TIME_SPEED + (MAX_TIME_SPEED - MIN_TIME_SPEED) * tCycle;
    const lifeBoost = LIFE_BOOST[this.lives] ?? 1;
    const levelBoost = this.level?.speed ?? 1;
    const brake = this.player.braking ? BRAKE_FACTOR : 1;
    const lip = this.player.lipBoost > 0 ? LIP_BOOST_MUL : 1;
    return timeSpeed * lifeBoost * levelBoost * brake * lip;
  }

  #pause() {
    this.mode = "paused";
    this.input.clearPointers();
    this.hud.showPause();
  }

  #resume() {
    this.mode = "play";
    this.clock.getDelta();
    this.hud.hidePause();
    this.hud.showPlay();
  }

  #hurt(cause = "rock") {
    if (this.player.invuln > 0) return;
    this.lives -= 1;
    this.deathCause = ["shark", "kook"].includes(cause) ? cause : "rock";
    this.player.hit();
    this.player.invuln = INVULN_SECONDS;
    this.hud.hitFlash();
    this._shake = 1;
    if (this.lives <= 0) this.#gameOver();
  }

  #speechAtPlayer(text, ms = 1100, iconHtml = "") {
    this.hud.placeSpeech(text, ms, iconHtml);
  }

  #kookSpeech() {
    this.#speechAtPlayer(t(this.lang, "kookSpeech"));
  }

  #sharkDodge(ft) {
    this.teeth += 1;
    this.#speechAtPlayer(formatDistance(this.lang, ft, 1), 1400, TOOTH_SVG);
  }

  #tube(ok) {
    if (!ok) return;
    this.tubes += 1;
    this.hud.showBanner(t(this.lang, "tubeRide"));
    this.player.celebrateHaka(HAKA_SECONDS);
    this.#speechAtPlayer(t(this.lang, "hakaSurf"), HAKA_SECONDS * 1000);
    this.pendingLife = HAKA_SECONDS;
    this.stoke = STOKE_SECONDS;
    this.flow = FLOW_SECONDS;
    this.timeScale = FLOW_SCALE;
  }

  #grantTubeLife() {
    if (this.lives < MAX_LIVES) {
      this.lives += 1;
      this.#speechAtPlayer(t(this.lang, "extraLife"), 1200, WAVE_SVG);
    } else {
      this.feet += TUBE_BONUS_FEET;
      this.#speechAtPlayer(t(this.lang, "bonusLife"), 1200, WAVE_SVG);
    }
  }

  #checkLevel() {
    const next = getLevel(this.feet);
    if (next.id === this.level.id) return;
    this.level = next;
    this.hud.showBanner(`${t(this.lang, "levelUp")} ${next.id}`);
  }

  #gameOver() {
    this.mode = "gameover";
    this.hud.showGameOver({
      feet: this.feet,
      teeth: this.teeth,
      tubes: this.tubes,
      cause: this.deathCause,
    });
  }

  #hudState() {
    return {
      lives: this.lives ?? START_LIVES,
      feet: this.feet ?? 0,
      displayDistance: toDisplayDistance(this.lang, this.feet ?? 0),
      teeth: this.teeth ?? 0,
      tubes: this.tubes ?? 0,
      levelId: this.level?.id ?? 1,
      levelNameKey: this.level?.nameKey ?? "level1",
      braking: this.mode === "play" && this.player.braking,
      stoke: this.stoke ?? 0,
      flow: this.flow ?? 0,
      lipBoost: this.player?.lipBoost ?? 0,
      boostKind: this.player?.boostKind,
    };
  }

  #camera() {
    const surface = waveHeight(this.player.x);
    const portrait = this._portrait;
    const target = new THREE.Vector3(
      this.player.x * (portrait ? 0.12 : 0.2) + (portrait ? 0.55 : 1.5),
      surface + (portrait ? 1.35 : 1.55) + this.player.y * 0.2,
      portrait ? -11 : -8
    );
    const desired = new THREE.Vector3(
      this.player.x * (portrait ? 0.14 : 0.22) - (portrait ? 0.45 : 1.5),
      surface + (portrait ? 5.35 : 4.15),
      portrait ? 13.6 : 10.2
    );
    if (this._shake > 0) {
      desired.x += (Math.random() - 0.5) * this._shake * 0.35;
      desired.y += (Math.random() - 0.5) * this._shake * 0.2;
    }
    this.camera.position.lerp(desired, 0.08);
    this.camera.lookAt(target);
  }

  #viewSize() {
    const vv = window.visualViewport;
    if (vv) {
      return {
        w: Math.max(1, Math.round(vv.width)),
        h: Math.max(1, Math.round(vv.height)),
        left: Math.round(vv.offsetLeft),
        top: Math.round(vv.offsetTop),
      };
    }
    return {
      w: Math.max(1, window.innerWidth),
      h: Math.max(1, window.innerHeight),
      left: 0,
      top: 0,
    };
  }

  #resize() {
    const { w, h, left, top } = this.#viewSize();
    document.documentElement.style.setProperty("--app-w", `${w}px`);
    document.documentElement.style.setProperty("--app-h", `${h}px`);
    document.documentElement.style.setProperty("--app-left", `${left}px`);
    document.documentElement.style.setProperty("--app-top", `${top}px`);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this._portrait = this.camera.aspect < 0.82;
    const minHFov = THREE.MathUtils.degToRad(this._portrait ? 46 : 38);
    const needed = THREE.MathUtils.radToDeg(
      2 * Math.atan(Math.tan(minHFov / 2) / Math.max(0.35, this.camera.aspect))
    );
    this.camera.fov = THREE.MathUtils.clamp(this._portrait ? Math.max(62, needed) : 55, 52, 72);
    this.camera.updateProjectionMatrix();
  }
}
