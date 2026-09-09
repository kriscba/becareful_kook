import { BOARD_SVG, MAX_LIVES, TOOTH_SVG, TUBE_SVG, WAVE_SVG } from "./constants.js";
import { ROCK_GO_SVG, SHARK_GO_SVG, KOOK_GO_SVG } from "./illustrations.js";
import { countPhrase, formatDistance, t, unitLabel } from "../i18n.js";

export class HUD {
  constructor() {
    this.lives = document.getElementById("lives");
    this.feet = document.getElementById("feet");
    this.unit = document.getElementById("unit");
    this.teeth = document.getElementById("teeth");
    this.tubes = document.getElementById("tubes");
    this.levelNum = document.getElementById("level-num");
    this.levelName = document.getElementById("level-name");
    this.hud = document.getElementById("hud");
    this.menu = document.getElementById("menu");
    this.gameover = document.getElementById("gameover");
    this.pause = document.getElementById("pause");
    this.pauseBtn = document.getElementById("pause-btn");
    this.speech = document.getElementById("speech");
    this.speechIcon = document.getElementById("speech-icon");
    this.speechText = document.getElementById("speech-text");
    this.banner = document.getElementById("banner");
    this.brake = document.getElementById("brake-hint");
    this.buffs = document.getElementById("buffs");
    this.flash = document.getElementById("hit-flash");
    this.goFeet = document.getElementById("go-feet");
    this.goTeeth = document.getElementById("go-teeth");
    this.goTubes = document.getElementById("go-tubes");
    this.goArt = document.getElementById("go-art");
    this.goCaption = document.getElementById("go-caption");
    this.goOcean = document.getElementById("go-ocean");
    this.goHospital = document.getElementById("go-hospital");
    this.goCause = "rock";
    this.goTeethMsg = document.getElementById("go-teeth-msg");
    this.goTubesMsg = document.getElementById("go-tubes-msg");
    this.langBtns = [...document.querySelectorAll("[data-lang]")];
    const icons = { board: BOARD_SVG, tooth: TOOTH_SVG, tube: TUBE_SVG, wave: WAVE_SVG };
    document.querySelectorAll("[data-stat-icon]").forEach((el) => {
      el.innerHTML = icons[el.dataset.statIcon] || "";
    });
  }

  setLang(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(lang, el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(lang, el.dataset.i18nAria));
    });
    this.langBtns.forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.lang === lang);
    });
    this.lang = lang;
    document.documentElement.lang = lang;
    if (this.unit) this.unit.textContent = unitLabel(lang);
    this.#setGoCaption();
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
    this.goFeet.textContent = formatDistance(this.lang, stats.feet, 0);
    this.goTeeth.textContent = String(stats.teeth);
    this.goTubes.textContent = String(stats.tubes);
    if (this.goTeethMsg) {
      this.goTeethMsg.textContent = countPhrase(this.lang, stats.teeth, "goTeethOne", "goTeethMany");
    }
    if (this.goTubesMsg) {
      this.goTubesMsg.textContent = countPhrase(this.lang, stats.tubes, "goTubesOne", "goTubesMany");
    }
    const arts = { shark: SHARK_GO_SVG, kook: KOOK_GO_SVG, rock: ROCK_GO_SVG };
    this.goArt.innerHTML = arts[stats.cause] || ROCK_GO_SVG;
    this.goCause = stats.cause;
    this.#setGoCaption();
    if (this.goOcean) this.goOcean.textContent = t(this.lang, "gameOver");
    if (this.goHospital) this.goHospital.textContent = t(this.lang, "hospitalWaits");
  }

  update(state) {
    this.feet.textContent = String(Math.floor(state.displayDistance));
    this.unit.textContent = unitLabel(this.lang);
    this.teeth.textContent = String(state.teeth);
    if (this.tubes) this.tubes.textContent = String(state.tubes ?? 0);
    this.levelNum.textContent = String(state.levelId);
    this.levelName.textContent = t(this.lang, state.levelNameKey);
    this.#renderLives(state.lives);
    this.brake.classList.toggle("hidden", !state.braking);
    this.brake.textContent = t(this.lang, "braking");
    this.#buffs(state);
  }

  placeSpeech(text, ms = 1100, iconHtml = "") {
    this.speechText.textContent = text;
    if (iconHtml) {
      this.speechIcon.innerHTML = iconHtml;
      this.speechIcon.classList.remove("hidden");
    } else {
      this.speechIcon.innerHTML = "";
      this.speechIcon.classList.add("hidden");
    }
    this.speech.classList.remove("hidden");
    this.speech.style.left = "";
    this.speech.style.top = "";
    clearTimeout(this._speechTimer);
    this._speechTimer = setTimeout(() => this.speech.classList.add("hidden"), ms);
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

  #setGoCaption() {
    const captions = { shark: "goShark", kook: "goKook", rock: "goRock" };
    if (!this.goCaption) return;
    this.goCaption.textContent = t(this.lang, captions[this.goCause] || "goRock");
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
    if (state.lipBoost > 0) {
      const key = state.boostKind === "cutback" ? "cutbackBoost" : "lipBoost";
      bits.push(`<div class="buff">${t(this.lang, key)}</div>`);
    }
    this.buffs.innerHTML = bits.join("");
  }
}
