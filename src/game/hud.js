import { MAX_LIVES, WAVE_SVG } from "./constants.js";
import { countPhrase, formatDistance, rankPhrase, stageGoalLines, stageWonPhrase, t, unitLabel } from "../i18n.js";
import { waveFlag, waveName, wavePlace } from "./waves.js";
import goKook from "../assets/go_kook.png";
import goRock from "../assets/go_rock.png";
import goShark from "../assets/go_shark.png";
import goSign from "../assets/go_sign.png";

const GO_ART = { shark: goShark, kook: goKook, rock: goRock, sign: goSign };

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
    this.stageclear = document.getElementById("stageclear");
    this.scTitle = document.getElementById("sc-title");
    this.scFlag = document.getElementById("sc-flag");
    this.scSpot = document.getElementById("sc-spot");
    this.scOk = document.getElementById("stage-ok");
    this.scGoals = document.getElementById("sc-goals");
    this.pause = document.getElementById("pause");
    this.scLevel = null;
    this.scFinal = false;
    this.scStats = null;
    this.pauseBtn = document.getElementById("pause-btn");
    this.replayBtn = document.getElementById("replay-btn");
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
    this.goRank = document.getElementById("go-rank");
    this.goCause = "rock";
    this.goTier = "beginner";
    this.goTeethMsg = document.getElementById("go-teeth-msg");
    this.goTubesMsg = document.getElementById("go-tubes-msg");
    this.langBtns = [...document.querySelectorAll("[data-lang]")];
    const icons = { board: "📏", tooth: "🦈", tube: "🌊", wave: WAVE_SVG };
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
    this.#setGoOcean();
    this.#setGoRank();
    this.#setStageClearCopy();
  }

  showMenu() {
    this.menu.classList.remove("hidden");
    this.gameover.classList.add("hidden");
    this.stageclear?.classList.add("hidden");
    this.pause.classList.add("hidden");
    this.hud.classList.add("hidden");
  }

  showPlay() {
    this.menu.classList.add("hidden");
    this.gameover.classList.add("hidden");
    this.stageclear?.classList.add("hidden");
    this.pause.classList.add("hidden");
    this.hud.classList.remove("hidden");
  }

  showPause() {
    this.pause.classList.remove("hidden");
  }

  hidePause() {
    this.pause.classList.add("hidden");
  }

  showStageClear(level, { final = false, ...stats } = {}) {
    this.scLevel = level;
    this.scFinal = final;
    this.scStats = stats;
    this.hud.classList.add("hidden");
    this.pause.classList.add("hidden");
    this.menu.classList.add("hidden");
    this.gameover.classList.add("hidden");
    this.stageclear?.classList.remove("hidden");
    this.#setStageClearCopy();
    this.banner?.classList.add("hidden");
    this.speech?.classList.add("hidden");
    const trophy = document.getElementById("sc-trophy");
    if (trophy) {
      trophy.style.animation = "none";
      trophy.offsetHeight;
      trophy.style.animation = "";
    }
    this.scOk?.focus();
  }

  showGameOver(stats) {
    this.hud.classList.add("hidden");
    this.pause.classList.add("hidden");
    this.stageclear?.classList.add("hidden");
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
    const src = GO_ART[stats.cause] || goRock;
    this.goArt.replaceChildren();
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    this.goArt.append(img);
    this.goCause = stats.cause;
    this.goTier = stats.tier || "beginner";
    this.#setGoCaption();
    this.#setGoOcean();
    this.#setGoRank();
    if (this.goHospital) this.goHospital.textContent = t(this.lang, "hospitalWaits");
  }

  update(state) {
    this.feet.textContent = String(Math.floor(state.displayDistance));
    this.unit.textContent = unitLabel(this.lang);
    this.teeth.textContent = String(state.teeth);
    if (this.tubes) this.tubes.textContent = String(state.tubes ?? 0);
    this.levelNum.textContent = String(state.levelId);
    this.levelName.textContent = state.levelName ?? "";
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
    this.banner.replaceChildren();
    this.banner.textContent = text;
    this.#flashBanner(1200);
  }

  showLevelBanner(level) {
    const line = document.createElement("div");
    line.className = "banner-line";
    line.textContent = `${t(this.lang, "levelUp")} ${level.id}`;
    const waveLine = document.createElement("div");
    waveLine.className = "banner-wave";
    const flag = document.createElement("span");
    flag.className = "banner-flag";
    flag.textContent = waveFlag(level.wave);
    const name = document.createElement("span");
    name.textContent = waveName(level.wave, this.lang);
    waveLine.append(flag, name);
    this.banner.replaceChildren(line, waveLine);
    this.#flashBanner(1700);
  }

  #flashBanner(ms) {
    this.banner.classList.remove("hidden");
    this.banner.style.animation = "none";
    this.banner.offsetHeight;
    this.banner.style.animation = "";
    this.banner.style.color = "black";
    clearTimeout(this._bannerTimer);
    this._bannerTimer = setTimeout(() => this.banner.classList.add("hidden"), ms);
  }

  hitFlash() {
    this.flash.classList.add("on");
    setTimeout(() => this.flash.classList.remove("on"), 140);
  }

  #setGoCaption() {
    const captions = {
      shark: "goOverShark",
      kook: "goOverKook",
      rock: "goOverRock",
      sign: "goOverSign",
    };
    if (!this.goCaption) return;
    this.goCaption.textContent = t(this.lang, captions[this.goCause] || "goOverRock");
  }

  #setGoOcean() {
    const headlines = { shark: "goShark", kook: "goKook", rock: "goRock", sign: "goSign" };
    if (!this.goOcean) return;
    this.goOcean.textContent = t(this.lang, headlines[this.goCause] || "goRock");
  }

  #setGoRank() {
    if (!this.goRank) return;
    this.goRank.textContent = rankPhrase(this.lang, this.goTier);
  }

  #setStageClearCopy() {
    if (!this.scTitle || !this.scLevel) return;
    const place = waveName(this.scLevel.wave, this.lang);
    this.scTitle.textContent = stageWonPhrase(this.lang, place, this.scFinal);
    if (this.scFlag) this.scFlag.textContent = waveFlag(this.scLevel.wave);
    if (this.scSpot) this.scSpot.textContent = wavePlace(this.scLevel.wave, this.lang);
    this.#renderStageGoals();
  }

  #renderStageGoals() {
    if (!this.scGoals) return;
    const lines = stageGoalLines(this.lang, this.scStats ?? {});
    this.scGoals.replaceChildren(
      ...lines.map((text) => {
        const li = document.createElement("li");
        const tick = document.createElement("span");
        tick.className = "sc-tick";
        tick.textContent = "✓";
        tick.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.textContent = text;
        li.append(tick, label);
        return li;
      })
    );
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
