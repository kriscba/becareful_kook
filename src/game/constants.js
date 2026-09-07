export const START_LIVES = 3;
export const MAX_LIVES = 5;
export const CYCLE_SECONDS = 5 * 60;
export const SPEED_STEP_SECONDS = 10;

export const MIN_X = -5.2;
export const MAX_X = 5.2;

export const MIN_TIME_SPEED = 38.4;
export const MAX_TIME_SPEED = 76.8;
export const BRAKE_FACTOR = 0.4;
export const LIFE_BOOST = [0, 0.72, 0.86, 1, 1.2, 1.4];

export const JUMP_VELOCITY = 9.2;
export const GRAVITY = 24;
export const MOVE_ACCEL = 68;
export const MOVE_FRICTION = 16;
export const MAX_MOVE = 17;
export const TOUCH_MOVE_SCALE = 1;
export const TOUCH_MAX_MOVE_SCALE = 1;
export const LIP_BOOST_SECONDS = 5;
export const LIP_BOOST_MUL = 1.5;

export const SPAWN_Z = -78;
export const DESPAWN_Z = 16;
export const TUBE_APPROACH_Z = -42;
export const FEET_PER_UNIT = 2.4;
export const FT_TO_M = 0.3048;
export const INVULN_SECONDS = 1.15;
export const STOKE_SECONDS = 8;
export const FLOW_SECONDS = 1.15;
export const FLOW_SCALE = 0.42;
export const TUBE_BONUS_FEET = 800;
export const HAKA_SECONDS = 1.6;

export const LEVELS = [
  { id: 1, atFeet: 0, speed: 1, spawn: 1, nameKey: "level1" },
  { id: 2, atFeet: 500, speed: 1.14, spawn: 0.9, nameKey: "level2" },
  { id: 3, atFeet: 1500, speed: 1.28, spawn: 0.8, nameKey: "level3" },
  { id: 4, atFeet: 3200, speed: 1.44, spawn: 0.7, nameKey: "level4" },
  { id: 5, atFeet: 5600, speed: 1.62, spawn: 0.6, nameKey: "level5" },
];

export function getLevel(feet) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (feet >= level.atFeet) current = level;
  }
  return current;
}

export const WAVE_SVG = `
<svg viewBox="0 0 64 40" aria-hidden="true">
  <defs>
    <linearGradient id="wvDeep" x1="4" y1="38" x2="52" y2="4" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#053044"/>
      <stop offset=".5" stop-color="#1390b0"/>
      <stop offset="1" stop-color="#d7f6ff"/>
    </linearGradient>
  </defs>
  <path fill="#073a5a" d="M2 34c10-3 18 2 30-1 12-3 20 3 30 0v7H2z"/>
  <path fill="url(#wvDeep)" d="M4 33c3-8 8-18 18-22 7-3 11 4 19 2 5-8 16-10 22-2-1 6-7 10-13 12-8 4-20 6-32 8-6 1-11 2-14 2z"/>
  <path fill="#fff" d="M36 6c6-5 18-5 24 5 2 4 0 8-4 9-7-1-13 3-18 8-1-6-3-14-2-22z"/>
  <path fill="#f4fbff" d="M42 5c4-3 12-3 16 3 1 3-1 5-4 5-5-1-9 1-12 5 0-5-1-10 0-13z"/>
  <path fill="#fff" d="M54 12c2 0 4 2 4 4-2 1-4 0-5-1 0-1 0-3 1-3zM58 18c1.5 0 3 1 3 2.5-1.5.5-3 0-4-1 .2-1 .4-1.5 1-1.5z"/>
</svg>
`;

export const TOOTH_SVG = `
<svg viewBox="0 0 56 84" aria-hidden="true">
  <defs>
    <linearGradient id="thEnamel" x1="16" y1="20" x2="40" y2="80" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff8e8"/>
      <stop offset=".55" stop-color="#edd5a3"/>
      <stop offset="1" stop-color="#c9a05a"/>
    </linearGradient>
  </defs>
  <path fill="#3e2414" d="M15 5c-1 9 1 17 6 21h14c5-4 7-12 6-21-2-5-24-5-26 0z"/>
  <path fill="#6b4423" d="M18 4c3-3 8-4 10-4s7 1 10 4c-2 5-7 7-10 7s-8-2-10-7z"/>
  <path fill="#7a5a20" d="M16 24h24c-3 7-10 10-12 10s-9-3-12-10z"/>
  <path fill="url(#thEnamel)" d="M18 26c-2 12-1 28 4 44 2 8 4 14 6 14s4-6 6-14c5-16 6-32 4-44C34 24 22 24 18 26z"/>
  <path fill="#d4b07a" d="M16 30l-5 4 5 2zM15 38l-5 4 6 2zM15 47l-5 4 6 2zM16 56l-4 4 6 2zM18 64l-3 4 5 1z"/>
  <path fill="#d4b07a" d="M40 30l5 4-5 2zM41 38l5 4-6 2zM41 47l5 4-6 2zM40 56l4 4-6 2zM38 64l3 4-5 1z"/>
  <path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2.8" opacity=".5" d="M22 34c4-8 12-8 16 0"/>
  <path fill="none" stroke="#b88948" stroke-linecap="round" stroke-width="2" opacity=".55" d="M28 46v28"/>
</svg>
`;

export const BOARD_SVG = `
<svg viewBox="0 0 56 64" aria-hidden="true">
  <defs>
    <linearGradient id="bdDeck" x1="16" y1="6" x2="44" y2="58" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffe58a"/>
      <stop offset="1" stop-color="#e09220"/>
    </linearGradient>
  </defs>
  <path fill="#06283a" opacity=".3" d="M20 50c8 6 20 6 28 0 0 5-8 10-16 10s-16-5-12-10z"/>
  <path fill="#c45a22" d="M28 3c9 2 16 14 17 27 1 12-4 24-13 29l4 6-7-2-6 3 3-7C17 53 12 41 13 28 14 14 20 5 28 3z"/>
  <path fill="url(#bdDeck)" d="M28 6c7 2 13 13 14 24 1 11-3 22-11 26l3 5-6-2-5 2 2-5C16 51 12 40 13 29 14 17 21 8 28 6z"/>
  <path fill="none" stroke="#ef476f" stroke-linecap="round" stroke-width="2.2" d="M28 11v32"/>
  <path fill="#fff" opacity=".4" d="M24 12c3-4 10-4 12 1-3 4-8 5-12-1z"/>
  <path fill="#1d3557" d="M23 47c-1 3-1 6 1 7 2 0 3-2 3-5 0-2-2-3-4-2z"/>
  <path fill="#1d3557" d="M33 47c1 3 3 6 5 6 2-1 1-4-1-7-2-1-4-1-4 1z"/>
</svg>
`;

export const TUBE_SVG = `
<svg viewBox="0 0 64 56" aria-hidden="true">
  <defs>
    <linearGradient id="tbWall" x1="6" y1="50" x2="58" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#04283c"/>
      <stop offset=".45" stop-color="#0e86a4"/>
      <stop offset="1" stop-color="#e8fbff"/>
    </linearGradient>
  </defs>
  <path fill="#073a5a" d="M4 44c12-4 22 2 34-2 12-4 18 2 22 0v14H4z"/>
  <path fill="url(#tbWall)" d="M6 42c2-14 12-28 28-32 12-3 20 4 24 12 2 6-4 10-10 11-7 2-11 10-20 14-8 4-18 3-22 1-2-1 0-5 0-6z"/>
  <path fill="#02181c" d="M20 34c1-9 9-15 18-14 8 1 13 7 13 14-1 8-9 13-17 12-8-1-15-4-14-12z"/>
  <path fill="#0a5c4c" d="M24 34c1-6 6-10 12-9 6 1 9 5 9 10-1 6-6 9-12 8-6-1-10-3-9-9z"/>
  <path fill="#fff" d="M32 8c9-4 22-2 28 10 2 4-1 8-6 8-8-3-14 2-20 9-1-8-3-18-2-27z"/>
  <path fill="#fff" d="M54 16c3 0 6 3 6 6-3 1-6 0-8-2 0-2 1-4 2-4zM58 24c2 0 4 2 4 3-2 1-4 0-5-1 0-1 0-2 1-2z"/>
</svg>
`;
