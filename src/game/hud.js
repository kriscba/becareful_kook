import { MAX_LIVES, WAVE_SVG } from "./constants.js";
import { t } from "../i18n.js";

export class HUD {
  constructor() {
    this.lives = document.getElementById("lives");
    this.feet = document.getElementById("feet");
    this.teeth = document.getElementById("teeth");
    this.cycle = document.getElementById("cycle");
    this.hud = document.getElementById("hud");
    this.menu = document.getElementById("menu");
    this.gameover = document.getElementById("gameover");
    this.pause = document.getElementById("pause");
    this.speech = document.getElementById("speech");
    this.tooth = document.getElementById("tooth-popup");
    this.toothFt = document.getElementById("tooth-ft");
    this.banner = document.getElementById("banner");
    this.brake = document.getElementById("brake-hint");
    this.buffs = document.getElementById("buffs");
    this.flash = document.getElementById("hit-flash");
    this.goFeet = document.getElementById("go-feet");
    this.goTeeth = document.getElementById("go-teeth");
    this.goTubes = document.getElementById("go-tubes");
    this.langBtns = [...document.querySelectorAll("[data-lang]")];
  }

  setLang(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(lang, el.dataset.i18n);
    });
    this.langBtns.forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.lang === lang);
    });
    this.lang = lang;
  }

  showMenu() {
    this.menu.classList.remove("hidden");
    this.gameover.classList.add("hidden");
    this.pause.classList.add("hidden");
    this.hud.classList.add("hidden");
  }

  showPlay() {
    this.menu.classList.add("hidden");
    this.gameover.classList.add("hidden");
    this.pause.classList.add("hidden");
    this.hud.classList.remove("hidden");
  }

  showPause() {
    this.pause.classList.remove("hidden");
  }

  hidePause() {
    this.pause.classList.add("hidden");
  }

  showGameOver(stats) {
    this.hud.classList.add("hidden");
    this.pause.classList.add("hidden");
    this.gameover.classList.remove("hidden");
    this.goFeet.textContent = `${Math.floor(stats.feet)} ft`;
    this.goTeeth.textContent = String(stats.teeth);
    this.goTubes.textContent = String(stats.tubes);
  }

  update(state) {
    this.feet.textContent = String(Math.floor(state.feet));
    this.teeth.textContent = String(state.teeth);
    const left = Math.max(0, state.cycleLeft);
    const m = Math.floor(left / 60);
    const s = Math.floor(left % 60).toString().padStart(2, "0");
    this.cycle.textContent = `${m}:${s}`;
    this.#renderLives(state.lives);
    this.brake.classList.toggle("hidden", !state.braking);
    this.brake.textContent = t(this.lang, "braking");
    this.#buffs(state);
  }

  placeSpeech(x, y, text, ms = 1100) {
    this.speech.textContent = text;
    this.speech.classList.remove("hidden");
    this.speech.style.left = `${x}px`;
    this.speech.style.top = `${y}px`;
    clearTimeout(this._speechTimer);
    this._speechTimer = setTimeout(() => this.speech.classList.add("hidden"), ms);
  }

  showTooth(feet) {
    this.toothFt.textContent = `${feet.toFixed(1)} ft`;
    this.tooth.classList.remove("hidden");
    this.tooth.style.animation = "none";
    this.tooth.offsetHeight;
    this.tooth.style.animation = "";
    clearTimeout(this._toothTimer);
    this._toothTimer = setTimeout(() => this.tooth.classList.add("hidden"), 900);
  }

  showBanner(text) {
    this.banner.textContent = text;
    this.banner.classList.remove("hidden");
    this.banner.style.animation = "none";
    this.banner.offsetHeight;
    this.banner.style.animation = "";
    clearTimeout(this._bannerTimer);
    this._bannerTimer = setTimeout(() => this.banner.classList.add("hidden"), 1200);
  }

  hitFlash() {
    this.flash.classList.add("on");
    setTimeout(() => this.flash.classList.remove("on"), 140);
  }

  #renderLives(count) {
    this.lives.innerHTML = Array.from({ length: MAX_LIVES }, (_, i) => {
      const on = i < count ? "on" : "";
      return `<span class="wave-life ${on}">${WAVE_SVG}</span>`;
    }).join("");
  }

  #buffs(state) {
    const bits = [];
    if (state.stoke > 0) bits.push(`<div class="buff">${t(this.lang, "stoke")}</div>`);
    if (state.flow > 0) bits.push(`<div class="buff">${t(this.lang, "flow")}</div>`);
    this.buffs.innerHTML = bits.join("");
  }
}
