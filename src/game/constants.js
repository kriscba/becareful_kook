export const START_LIVES = 3;
export const MAX_LIVES = 5;
export const CYCLE_SECONDS = 5 * 60;
export const SPEED_STEP_SECONDS = 10;

export const MIN_X = -5.2;
export const MAX_X = 5.2;

export const MIN_TIME_SPEED = 32;
export const MAX_TIME_SPEED = 64;
export const BRAKE_FACTOR = 0.4;
export const LIFE_BOOST = [0, 0.72, 0.86, 1, 1.2, 1.4];

export const JUMP_VELOCITY = 9.2;
export const GRAVITY = 24;
export const MOVE_ACCEL = 68;
export const MOVE_FRICTION = 16;
export const MAX_MOVE = 17;

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
<svg viewBox="0 0 72 48" aria-hidden="true">
  <path d="M6 36c7.5 0 9.5-14 17-14 7.5 0 9 11 15.5 11 7.2 0 9.2-16 17.5-16 5.8 0 8.2 7 10 9v12H6z" fill="#7be7ff" opacity=".4"/>
  <path d="M5 30c8 0 10.5-15 18.5-15S34 26 41 26s10.5-17 19-17c6 0 8.5 8 11 10" fill="none" stroke="#f4fbff" stroke-width="4.2" stroke-linecap="round"/>
  <path d="M50 13c1.8-6.5 8.5-8.5 13-3.2-1.2 5.2-6 7.8-11.5 7.2" fill="#eefbff" stroke="#fff" stroke-width="1.6"/>
  <circle cx="58.5" cy="11" r="1.5" fill="#fff"/>
</svg>
`;

export const TOOTH_SVG = `
<svg viewBox="0 0 64 88" aria-hidden="true">
  <path d="M32 5c-10.5 1.2-18 12.5-16.8 28.5 1.1 14 6.8 34.5 15.4 50.8 1.2 2.2 3.4 2.2 4.6 0 8.6-16.3 14.3-36.8 15.4-50.8C52 17.5 44.5 6.2 32 5z" fill="#f6efe2" stroke="#c4a57a" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M23 24c4.8-8 13.2-8 18 0" fill="none" stroke="#e2d2b6" stroke-width="2.2" stroke-linecap="round"/>
  <ellipse cx="32" cy="20" rx="8" ry="5.5" fill="#fff" opacity=".5"/>
  <path d="M29 62c1.4 6 2.4 11 3 16" fill="none" stroke="#d9c7a6" stroke-width="1.6" stroke-linecap="round"/>
</svg>
`;

export const BOARD_SVG = `
<svg viewBox="0 0 48 48" aria-hidden="true">
  <path d="M24 4c7.2 2.2 11.4 12.5 11.4 20S31.2 41.6 24 44C16.8 41.6 12.6 31.4 12.6 24S16.8 6.2 24 4z" fill="#ffd166" stroke="#c45a22" stroke-width="2"/>
  <path d="M24 9.5v27" fill="none" stroke="#ef476f" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M20.2 37.5 24 44l3.8-6.5" fill="#ffd166" stroke="#c45a22" stroke-width="1.6" stroke-linejoin="round"/>
</svg>
`;

export const TUBE_SVG = `
<svg viewBox="0 0 48 48" aria-hidden="true">
  <path d="M7 38c2-16 14-28 28-26 4.5.6 8 3.2 10 7.2-7.5-1-16.5 3-20.5 13.5 6.5-3.5 15.5-2.8 22 3.2-3.2 7.8-15 12.5-26.5 8.6C11.2 41.6 7.4 39.2 7 38z" fill="#1287a8"/>
  <path d="M14 35c2.2-11.5 11-18 22-15.5" fill="none" stroke="#7be7ff" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M30 11.5c6.5-2.8 13.5 1.4 15.5 8.2-4.6-1.4-10.2.6-13.8 5.8-1.8-6.2-2.4-11.4-1.7-14z" fill="#f4fbff"/>
  <path d="M18 30c5-2 11-1 16 3" fill="none" stroke="#0b4f78" stroke-width="1.6" stroke-linecap="round" opacity=".35"/>
</svg>
`;
