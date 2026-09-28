// Ichigo in his Bankai coat with a single Tensa Zangetsu.
// The base sprite is traced cell-for-cell from a pixel-art reference (image-to-code),
// with the hair recoloured orange, skin tones restored and the second blade removed.
// Every animation frame is derived from that base so he always matches the reference.
// Frames are character grids shared by the README SVGs and the game at /play.

import { Grid } from './pixel-canvas.js';

export const FRAME_W = 76;
export const FRAME_H = 62;
const BX = 4; // base sprite position inside the frame
const BY = 5;
export const AX = BX + 28;
export const AY = BY + 56;

export const PALETTE = {
  k: '#121218', // coat / line work (off-black)
  K: '#62627a', // coat folds
  j: '#9d9db0', // light grey
  W: '#c8c4d0', // pale grey
  w: '#fff4ea', // white highlights
  Y: '#ffb13b', // hair highlight
  O: '#ff8a1c', // hair
  o: '#e0660e', // hair mid
  q: '#9c3f0a', // hair shadow / outline
  s: '#ffd2ac', // skin
  S: '#e89d78', // skin shade
  e: '#8a3a14', // brows / face line
  r: '#e8203a', // blade edge
  M: '#fff4ea', // hollow mask
  Z: '#c8c4d0', // mask shade
  x: '#7e2553', // glow (mask mode only)
};
export const MASK_PALETTE = PALETTE;
export const BANKAI_PALETTE = PALETTE; // kept for older imports

// 40×55, traced from the reference.
const BASE = [
  '...........................q............',
  '........................q.qOq..qO.......',
  '.......................qO.qOq.qOq.......',
  '.......................qOqOOqqYOq.......',
  '.....................q.qYOOYOYYOqqOq....',
  '......................qqOYYYYYOqYOq.....',
  '......................qOOYOYYYYYOOq.....',
  '......................qYYOOOYOOYOqqOq...',
  '.....................qOYOYqqOqOqOOOq....',
  '....................qOOOOOqsqOqsqOq.....',
  '......................qOOqossqsqoqOq....',
  '.....................qOOqqsqqsssoqq.....',
  '.....................qOqSeswkeSskk......',
  '....................qOqqseswKSssKk......',
  '.......................qSSssssssSk......',
  '.......................qekSssssek.......',
  '......................q.ekkSseeSk.......',
  '.........................kSkSsSk........',
  '........................kjwSkkk.........',
  '......................kkkkkwSSjkk.......',
  '.....................kKKKKKkwSjkkk......',
  '.....................kKKKkKKkjwkkk......',
  '.....................kkKkkKKKkjkkk......',
  '.....................kkkkkkkkKkkkk......',
  '....................kKkkkkkKKkkjkk......',
  '....................kKkk.kkkKKkjkkk.....',
  '....................kKkk.kkkkkkWkkk.....',
  '...................kKkk...kkkkjwjkkk....',
  '...................kKkk...kkkkWjWkkkk...',
  '..................kKkkk...kkkkwjWkkkk...',
  '..................kKkk...kkkkjWkWkkkkk..',
  '..............kk.kkKkk...kkkkWWkwjkkkk..',
  '.............kkkkkkkk....kkkkwjkWWkkSk..',
  '...........kk..kkkssskk.kkkkjWkkjWkSssk.',
  '...........k....kksKksKkkkkkWjkkkWjkSksk',
  '............k....kssKKkkkkkjwjkkkjWkkssk',
  '............k....kskkk..kkkWjkkkkkWjskk.',
  '.............k....k.kkkkKkjwkkkkkKkWkk..',
  '.............k......kkkkkKKkkkkkkKkk....',
  '...................kkkkkkkkKkkkkkkKk....',
  '..................kkkkkkwjkkKKkkkkKk....',
  '.................kkkkkkwjkkkkkKkkkKkk...',
  '................kkkkkkjwkkkkkkkKKkkKk...',
  '...............kkkkkkjwKkkKkkkkkkKKKk...',
  '..............kkkkkKWwKkkkKkkkkkkkkKk...',
  '......kkk...kkkkkkKWWKkkkKkkkkkkkkKk....',
  '........kkkkkkkkKKWKKkKkkKkkkkkkkkKkkk..',
  'k........kkkkkKKWWKrkKkkkKkkkkkkkkKkKkkk',
  '.kkkkkkkkkkkKjjWKrrkkKkkKKkkkkkkkkKkKkk.',
  '...kkkkkkjjjjrrrrr.kkKkkKKkkkkkkkkKkKkk.',
  '.......rrrrrrr.....kKKkkKKkkkkkkkkKkKKkk',
  '..................kkKkkkKkkkkkkkkkkkkkk.',
  '...................kkkkkkkkk...kjjjkjjjk',
  '..................kjkwjkkk......kkkkkkkk',
  '..................kkkkkk................',
];

// Where the held sword sits in the base (erased when he swings it from the other hand).
const CHAIN = [[31, 14], [31, 15], [32, 13], [32, 14], [33, 11], [33, 12], [34, 11], [35, 12], [36, 12], [37, 13], [38, 13]];
const BLADE_OVER_COAT = [[40, 24, 25], [41, 23, 24], [42, 22, 23], [43, 21, 23], [44, 19, 22], [45, 18, 21], [46, 16, 20], [47, 13, 20]];
const BLADE_PAST_COAT = [[45, 11], [46, 11], [47, 12], [48, 18], [49, 18], [50, 18]];

// Boots: [dx, dy] offsets for the back boot and the front boot.
const FEET = {
  stand: [[0, 0], [0, 0]],
  stride: [[-4, -1], [3, 0]],
  pass: [[2, 0], [-2, -2]],
  stride2: [[4, 0], [-5, -1]],
  pass2: [[-2, -2], [2, 0]],
  jump: [[2, -3], [-3, -2]],
  fall: [[-1, 0], [1, 0]],
};

// Hollow mask over the visible side of the face (eye hole on the near eye).
const MASK = [
  '.MMMMMMMM..',
  'MMMMMMMMMM.',
  'MrMkkkMMMMM',
  'MrMMkMMMMMM',
  'MrrMMMMMMM.',
  '.MZMZMZMZ..',
  '..ZZZZZZ...',
];

const BLADE = ['j', 'k', 'r']; // shine, black body, red edge

function editedBase({ sword, feet, mask }) {
  const b = BASE.map((r) => [...r, '.', '.', '.', '.', '.', '.']);
  if (sword !== 'held') {
    for (const [y, x] of CHAIN) b[y][x] = '.';
    for (const [y, x0, x1] of BLADE_OVER_COAT) for (let x = x0; x <= x1; x++) if (b[y][x] !== '.') b[y][x] = 'k';
    for (const [y, x1] of BLADE_PAST_COAT) for (let x = 0; x <= x1; x++) b[y][x] = '.';
  }
  // Re-place the boots (rows 52-54): back boot cols 18-27, front boot cols 31-39.
  const cut = (y0, y1, x0, x1) => b.slice(y0, y1 + 1).map((r) => r.slice(x0, x1 + 1));
  const back = cut(52, 54, 18, 27);
  const front = cut(52, 53, 31, 39);
  for (let y = 52; y <= 54; y++) b[y].fill('.');
  const [[bx, by], [fx, fy]] = FEET[feet];
  const put = (rows, x0, y0) => rows.forEach((r, dy) => r.forEach((c, dx) => {
    if (c !== '.' && b[y0 + dy]) b[y0 + dy][x0 + dx] = c;
  }));
  put(back, 18 + bx, 52 + by);
  put(front, 31 + fx, 52 + fy);
  if (mask) put(MASK.map((r) => [...r]), 23, 10);
  return b;
}

// Single Tensa Zangetsu swung from the front hand (base coordinates).
function swing(v, pose) {
  const chain = (pts) => pts.forEach(([y, x], i) => i % 2 === 0 && v.set(x, y, 'k'));
  if (pose === 'windup') {
    v.rect(37, 31, 3, 1, 'W');
    v.line(38, 30, 45, 6, BLADE);
    chain([[38, 37], [39, 36], [40, 36], [41, 37], [42, 37], [43, 36]]);
  } else if (pose === 'strike') {
    v.rect(40, 33, 1, 4, 'W');
    v.line(41, 34, 66, 34, BLADE, true);
    v.set(67, 35, 'k').set(67, 36, 'r');
    chain([[36, 34], [37, 34], [38, 33], [39, 33], [40, 34], [41, 34], [42, 33]]);
  } else if (pose === 'follow') {
    v.rect(39, 36, 2, 2, 'W');
    v.line(41, 38, 56, 53, BLADE);
    chain([[38, 36], [39, 35], [40, 35], [41, 36], [42, 36]]);
  }
}

class View {
  constructor(grid, dy) {
    this.g = grid;
    this.dy = dy;
  }
  set(x, y, c) {
    this.g.set(x + BX, y + BY + this.dy, c);
    return this;
  }
  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    return this;
  }
  line(x0, y0, x1, y1, colors, vertical = false) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2 || 1;
    for (let s = 0; s <= steps; s++) {
      const x = Math.round(x0 + ((x1 - x0) * s) / steps);
      const y = Math.round(y0 + ((y1 - y0) * s) / steps);
      colors.forEach((c, i) => (vertical ? this.set(x, y + i, c) : this.set(x + i, y, c)));
    }
    return this;
  }
}

function compose({ bob = 0, sway = 0, feet = 'stand', sword = 'held', mask = false }) {
  const g = new Grid(FRAME_W, FRAME_H);
  const b = editedBase({ sword, feet, mask });
  // The coat hem (rows 44-51) trails back more the lower it is.
  b.forEach((row, y) => {
    const off = y >= 44 && y <= 51 ? -Math.round((sway * (y - 43)) / 8) : 0;
    row.forEach((c, x) => g.set(BX + x + off, BY + y + bob, c));
  });
  if (sword !== 'held') swing(new View(g, bob), sword);
  if (mask) g.outline('x');
  return g.rows();
}

const POSES = {
  idle0: {},
  idle1: { bob: 1, sway: 1 },
  run0: { feet: 'stride', sway: 2 },
  run1: { feet: 'pass', bob: -1, sway: 3 },
  run2: { feet: 'stride2', sway: 2 },
  run3: { feet: 'pass2', bob: -1, sway: 3 },
  jump: { feet: 'jump', bob: -1, sway: 4 },
  fall: { feet: 'fall', sway: -1 },
  slash0: { sword: 'windup', sway: 1 },
  slash1: { sword: 'strike', feet: 'stride', sway: 2 },
  slash2: { sword: 'follow', feet: 'stride', sway: 2 },
  hurt: { feet: 'fall', bob: -1, sway: -2 },
};

// `mask` = Hollow-mask power-up frames.
export function buildFrames(mask = false) {
  return Object.fromEntries(Object.entries(POSES).map(([name, pose]) => [name, compose({ ...pose, mask })]));
}

// Crop transparent margins shared by a set of frames (used for README sprites).
export function trim(frames) {
  let x0 = FRAME_W, x1 = 0, y0 = FRAME_H, y1 = 0;
  for (const rows of Object.values(frames))
    rows.forEach((row, y) =>
      [...row].forEach((c, x) => {
        if (c === '.') return;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      })
    );
  return Object.fromEntries(Object.entries(frames).map(([k, rows]) => [k, rows.slice(y0, y1 + 1).map((r) => r.slice(x0, x1 + 1))]));
}
