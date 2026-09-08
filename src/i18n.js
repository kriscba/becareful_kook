const LANG_KEY = "becareful-kook-lang";
export const LANGS = ["en", "es", "pt"];

export const STRINGS = {
  en: {
    subtitle: "Dodge kooks, sharks and rocks. Ride the barrel.",
    play: "DROP IN",
    language: "Language",
    controlsMove: "← → or hold and drag to steer",
    controlsJump: "↑ or swipe up — jump rocks",
    controlsBrake: "↓ or swipe down and hold — brake for the tube",
    controlsPause: "❚❚ / Esc — pause",
    paused: "PAUSED",
    clickResume: "Tap to keep riding",
    pauseBtn: "Pause",
    lives: "Lives",
    feet: "ft",
    meters: "m",
    teeth: "Megalodon",
    tubes: "Tubes",
    goTeethOne: "{n} megalodon tooth",
    goTeethMany: "{n} megalodon teeth",
    goTubesOne: "{n} tube",
    goTubesMany: "{n} tubes",
    cycle: "Set",
    level: "Level",
    level1: "Whitewater",
    level2: "Inside",
    level3: "Lineup",
    level4: "The Barrel",
    level5: "Outer Reef",
    levelUp: "LEVEL",
    extraLife: "+1",
    bonusLife: "+800 ft",
    hakaSurf: "🤙 HAKA SURF!!",
    gameOver: "OCEAN WINS",
    hospitalWaits: "Hospital waits for you...",
    goRock: "You're gonna miss a couple of sessions — you cracked your head",
    goShark: "Your career is over — you lost a leg",
    goKook: "HAHA! KOOK ATTACK!!",
    restart: "PADDLE BACK",
    kookSpeech: "Becareful kook!!",
    tubeRide: "TUBE RIDE",
    barrel: "BARREL",
    stoke: "STOKE x2",
    flow: "FLOW",
    braking: "BRAKING",
    distance: "Distance",
    bonusFeet: "+800 ft",
    offTheLip: "OFF THE LIP",
    lipBoost: "LIP x1.5",
    cutback: "CUTBACK",
    cutbackBoost: "CUTBACK x1.5",
  },
  es: {
    subtitle: "Esquivá kooks, tiburones y rocas. Metete en el tubo.",
    play: "QUIERO SURFEAR!",
    language: "Idioma",
    controlsMove: "← → o mantené el dedo y deslizá para surfear",
    controlsJump: "↑ o deslizá hacia arriba — saltar las rocas",
    controlsBrake: "↓ o deslizá hacia abajo y mantené — frená para el tubo",
    controlsPause: "❚❚ / Esc — pausa",
    paused: "PAUSA",
    clickResume: "Tocá para seguir surfeando",
    pauseBtn: "Pausa",
    lives: "Vidas",
    feet: "ft",
    meters: "m",
    teeth: "Megalodón",
    tubes: "Tubos",
    goTeethOne: "{n} diente de megalodón",
    goTeethMany: "{n} dientes de megalodón",
    goTubesOne: "{n} tubo",
    goTubesMany: "{n} tubos",
    cycle: "Serie",
    level: "Nivel",
    level1: "Espuma",
    level2: "Adentro",
    level3: "Peak",
    level4: "El Tubo",
    level5: "Afuera",
    levelUp: "NIVEL",
    extraLife: "+1",
    bonusLife: "+244 m",
    hakaSurf: "🤙 HAKA SURF!!",
    gameOver: "EL OCÉANO GANA",
    hospitalWaits: "El hospital te espera...",
    restart: "REMA DE NUEVO",
    kookSpeech: "¡Cuidado kook!!",
    goRock: "Te vas a perder un par de sesiones, te rompiste la cabeza",
    goShark: "Tu carrera está finalizada, te quedaste sin una pierna",
    goKook: "¡HAHA! KOOK ATTACK!!",
    tubeRide: "TUBE RIDE",
    barrel: "BARRIL",
    stoke: "STOKE x2",
    flow: "FLOW",
    braking: "FRENANDO",
    distance: "Distancia",
    bonusFeet: "+800 ft",
    offTheLip: "OFF THE LIP",
    lipBoost: "LIP x1.5",
    cutback: "CUTBACK",
    cutbackBoost: "CUTBACK x1.5",
  },
  pt: {
    subtitle: "Desvie de haoles, tubarões e pedras. Entre no tubo.",
    play: "BORA SURFAR!",
    language: "Idioma",
    controlsMove: "← → ou segure e arraste para surfar",
    controlsJump: "↑ ou deslize para cima — pular as pedras",
    controlsBrake: "↓ ou deslize para baixo e segure — freie para o tubo",
    controlsPause: "❚❚ / Esc — pausa",
    paused: "PAUSA",
    clickResume: "Toque para continuar",
    pauseBtn: "Pausa",
    lives: "Vidas",
    feet: "ft",
    meters: "m",
    teeth: "Megalodonte",
    tubes: "Tubos",
    goTeethOne: "{n} dente de megalodonte",
    goTeethMany: "{n} dentes de megalodonte",
    goTubesOne: "{n} tubo",
    goTubesMany: "{n} tubos",
    cycle: "Série",
    level: "Nível",
    level1: "Espuma",
    level2: "Inside",
    level3: "Peak",
    level4: "O Barril",
    level5: "Outside",
    levelUp: "NÍVEL",
    extraLife: "+1",
    bonusLife: "+244 m",
    hakaSurf: "🤙 HAKA SURF!!",
    gameOver: "O OCEANO VENCE",
    hospitalWaits: "O hospital espera por você...",
    restart: "REMA DE VOLTA",
    kookSpeech: "Sai fora, haole!!",
    goRock: "Vai perder umas sessões, você bateu a cabeça",
    goShark: "Sua carreira acabou, você ficou sem uma perna",
    goKook: "HAHA! KOOK ATTACK!!",
    tubeRide: "TUBE RIDE",
    barrel: "BARRIL",
    stoke: "STOKE x2",
    flow: "FLOW",
    braking: "FREANDO",
    distance: "Distância",
    bonusFeet: "+800 ft",
    offTheLip: "OFF THE LIP",
    lipBoost: "LIP x1.5",
    cutback: "CUTBACK",
    cutbackBoost: "CUTBACK x1.5",
  },
};

export function t(lang, key) {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}

export function loadLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    /* ignore quota / private mode */
  }
  return "en";
}

export function saveLang(lang) {
  const next = LANGS.includes(lang) ? lang : "en";
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {
    /* ignore quota / private mode */
  }
  return next;
}

export function countPhrase(lang, n, singularKey, pluralKey) {
  const key = n === 1 ? singularKey : pluralKey;
  return t(lang, key).replaceAll("{n}", String(n));
}

export function isMetric(lang) {
  return lang === "es" || lang === "pt";
}

export function unitLabel(lang) {
  return isMetric(lang) ? "m" : "ft";
}

export function toDisplayDistance(lang, feet) {
  return isMetric(lang) ? feet * 0.3048 : feet;
}

export function formatDistance(lang, feet, digits = 0) {
  return `${toDisplayDistance(lang, feet).toFixed(digits)} ${unitLabel(lang)}`;
}
