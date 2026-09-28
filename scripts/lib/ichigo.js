// Ichigo-inspired hero (after a perler-bead design), composed from layered parts
// so every frame stays consistent. Faces right. Frames are 80×50 character grids;
// feet rest on row AY-2 and are centred on AX. Shared by the README SVGs and /play.

import { Grid } from './pixel-canvas.js';

export const FRAME_W = 80;
export const FRAME_H = 54;
const X0 = 16; // local body space (32×44) → frame space
const Y0 = 8;
export const AX = X0 + 16;
export const AY = Y0 + 45;

export const PALETTE = {
  x: '#000000', // outline
  O: '#ff8a1c', // hair
  Y: '#ffc93c', // hair highlight
  o: '#d15a10', // hair shadow
  q: '#7a2e0c', // deep shadow / brows
  s: '#ffd2ac', // skin
  S: '#e89d78', // skin shade
  e: '#2b1a14', // eyes
  m: '#a3524a', // mouth
  k: '#161624', // shihakusho
  K: '#34344e', // folds
  j: '#4d4d70', // robe light
  w: '#fff4ea', // white collar / obi / tabi
  W: '#c8c4d0', // white shade
  r: '#e8203a', // strap / coat lining
  R: '#8e1030', // strap shade
  g: '#d6dbe6', // blade
  G: '#ffffff', // blade shine
  B: '#8fbaf0', // blade sheen
  d: '#555a6c', // blade edge
  h: '#2c2c3c', // hilt
  c: '#eeeef4', // cloth wrap / chain
  C: '#a3a3b4', // cloth shade
  n: '#d0223c', // sandals
};

// Bankai glows: the outline turns crimson.
export const BANKAI_PALETTE = { ...PALETTE, x: '#7e2553' };

const HEAD = [
  '..........Y...Y.....',
  '......Y..YO..YO.....',
  '....Y.OY.OOYOOO.Y...',
  '...qOOOOYOOOOOOYO...',
  '..qoOOOOOOOOYOOOOO..',
  '.qooOOOOOOOOOOOOOOY.',
  'qoooOOYOOOOOOOOYOOOO',
  '.qooOOOOOOOOOOOOOOOO',
  'qqooOOOoOOsOOOoOsOOq',
  '.qoooOossOOssOOssOq.',
  '..qooSsqqqssqqqsss..',
  '..qoSSsseessseesss..',
  '..qqSSsseessssesSs..',
  '...qSssssssssssss...',
  '....Sssssssmmmss....',
  '.....SSsssssssss....',
  '.......SSSsssS......',
];

const CROWN = [
  '....Y.......Y.......',
  '...YO......YO....Y..',
  '..YOO.....YOO...YO..',
  '.qOOO....YOOO..YOO..',
  'qoOOOO..OOOOOOOOOO..',
  'qoOOOOOOOOOOOOOOOO..',
  '.qoOOOOOOOOOOOOOOO..',
  'qqoOOOOOOOOOOOOOO...',
];
const BACK_HAIR = ['......o', '....qoO', '..qqooO', 'qqooooO', '..qoooO', '...qooO', '.qqoooO', '...qooo', '....qoo', '......q'];

// Hakama + feet, 28 wide, placed at local (2, 31).
const pad = (rows) => rows.map((r) => `...${r}.`);
const LEGS = {
  stand: pad([
    '....kkkkkkkkkkkkkkkkk...',
    '...kkkkKkkkkkkkkKkkkkk..',
    '...kkkkKkkkkkkkkKkkkkk..',
    '..kkkkKkkkkkkkkkkKkkkkk.',
    '..kkkkKkkkk.kkkkkKkkkkk.',
    '..kkkKkkkk...kkkkkKkkkk.',
    '.kkkkKkkkk...kkkkkKkkkkk',
    '.kkkKkkkkk...kkkkkkKkkkk',
    'kkkkKkkkk.....kkkkkKkkkk',
    'kkkkkkkkk.....kkkkkkkkkk',
    '..wwwwww.......wwwwwww..',
    '.wwwwwWw.......wwwwwwWw.',
    '.nnnnnnn.......nnnnnnnnn',
  ]),
  stride: [
    '.......kkkkkkkkkkkkkkkkk....',
    '......kkkkKkkkkkkkKkkkkkk...',
    '.....kkkkKkkkkkkkkkKkkkkkk..',
    '....kkkkKkkkk...kkkkKkkkkkk.',
    '...kkkkKkkkk.....kkkkKkkkkkk',
    '..kkkkKkkkk.......kkkkKkkkkk',
    '.kkkkKkkkk.........kkkkkkkkk',
    'kkkkKkkk............kkkkKkkk',
    'kkkkkkk..............kkkkkkk',
    'wwwwk.................kkkkkk',
    'nwww...................wwwww',
    '.n.....................wwwww',
    '.......................nnnnn',
  ],
  pass: [
    '.......kkkkkkkkkkkkkkkkk....',
    '.......kkkkKkkkkkkKkkkkkk...',
    '.......kkkkKkkkkkkkKkkkkkk..',
    '........kkkKkkkkkkkkKkkkkkk.',
    '........kkkKkkkkkkkkkKkkkkk.',
    '.........kkkkkkk..kkkkkkkkk.',
    '.........kkkkKkk...kkkkkkkk.',
    '.........kkkkkkk....kkkwwww.',
    '..........kkkkkk.....nnwwww.',
    '..........kkkkkk.......nnn..',
    '..........wwwwww............',
    '..........wwwwwww...........',
    '.........nnnnnnnn...........',
  ],
  jump: [
    '.......kkkkkkkkkkkkkkkkk....',
    '......kkkkKkkkkkkkKkkkkkk...',
    '.....kkkkKkkkkkkkkkKkkkkkk..',
    '.....kkkKkkkkk..kkkkKkkkkkk.',
    '....kkkKkkkkk.....kkkKkkkkk.',
    '....kkkkkkkk.......kkkkkkkk.',
    '...wwwkkkkk.........kkkkwww.',
    '..nwwwwkk............kkwwwwn',
    '..nnn..................nnn..',
  ],
  fall: [
    '.......kkkkkkkkkkkkkkkkk....',
    '.......kkkkKkkkkkkKkkkkkk...',
    '......kkkkKkkkkkkkkKkkkkkk..',
    '......kkkKkkkkkkkkkkKkkkkk..',
    '......kkkKkkkk..kkkkkKkkkk..',
    '.....kkkKkkkk....kkkkkKkkkk.',
    '.....kkkkkkkk.....kkkkkkkkk.',
    '.....kkkkkkk......kkkkkkkkk.',
    '......wwwww........wwwwwww..',
    '......nnnnn........nnnnnnn..',
  ],
};

// Far (back) arm poses: [stamp, x, y, drawnInFront]
const BACK_ARM = {
  hang: [['..kkkk', '.kkkkk', '.kkkKk', 'kkkkKk', 'kkkkkk', 'kKkkkk', 'kkkkk.', '.kkkk.', '.ssS..', '.sSs..'], 5, 18, false],
  back: [['....kkkk', '...kkkkk', '..kkkKk.', '.kkkKk..', 'kkkkk...', 'sSk.....', 'ss......'], 2, 18, false],
  fwd: [['kkkkkkkk..', '.kkkkkkkk.', '..kkkkkkss', '...kkkkkss'], 18, 20, false],
};

// Near (sword) arm poses: [stamp, x, y]. `hold` grips the hilt beside the face.
const FRONT_ARM = {
  hold: [['.....ss...', '....sSSs..', '....sSsS..', '...kkkkk..', '..kkkkkkk.', '.kkkkKkkkk', 'kkkkKkkkkk', 'kkkkkkkkk.', '.kkkkkkk..', '..kkkkk...', '...kkk....'], 21, 14],
  back: [['.........kkkk', '......kkkkkkk', '...kkkkkkkkk.', 'sskkkkkkkK...', 'sSSkkkkk.....', 'sSs..........'], 6, 18],
  strike: [['.kkkkkk.......', 'kkkkkkkkkkksss', 'kkkkkkkkkkksSs', '.kkkkKkkkk.sss', '..kkkkk.......'], 22, 18],
  follow: [['.......sss', '......sSSs', '......sSss', '.....kkkk.', '....kkkkk.', '...kkkkk..', '..kkkkKk..', '.kkkkkkk..', 'kkkkkkk...'], 21, 10],
};

// Bankai coat tails, drawn behind the legs.
const COAT = {
  run: [['..........kkkk', '........kkkkkk', '......kkkkkkkk', '.....kkkrkkkkk', '....kkkrrkkkkk', '...kkkrrkkkkkk', '..kkkrrkkkkkk.', '.kkkrrkkkkkk..', 'kkkrrkkkkkk...', 'kkrrkkk.kkk...', 'krkkk.k..k....', 'k.k.k.........'], -4, 28],
  stand: [['...kkkk', '..kkkkk', '..kkrkk', '.kkkrkk', '.kkrrkk', '.kkrrkk', 'kkkrrkk', 'kkrrkkk', 'kkrkkkk', 'kkrkkk.', 'k.k.kk.', 'k...k..'], 1, 29],
};

// Draws in local body coordinates onto the full frame (local x/y can go negative).
class LocalView {
  constructor(grid) {
    this.g = grid;
  }
  set(x, y, c) {
    this.g.set(x + X0, y + Y0, c);
    return this;
  }
  stamp(rows, x, y) {
    this.g.stamp(rows, x + X0, y + Y0);
    return this;
  }
  rect(x, y, w, h, c) {
    this.g.rect(x + X0, y + Y0, w, h, c);
    return this;
  }
  // Thick line; `vertical` thickness suits shallow angles, horizontal suits steep ones.
  line(x0, y0, x1, y1, w, paint, vertical = false) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2 || 1;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = Math.round(x0 + (x1 - x0) * t);
      const y = Math.round(y0 + (y1 - y0) * t);
      for (let i = 0; i < w; i++) vertical ? this.set(x, y + i, paint(t, i)) : this.set(x + i, y, paint(t, i));
    }
    return this;
  }
  // Polyline through points, painted as a band of colours stacked top to bottom.
  ribbon(points, colors, dotted = false) {
    let n = 0;
    for (let p = 0; p < points.length - 1; p++) {
      const [x0, y0] = points[p];
      const [x1, y1] = points[p + 1];
      const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
      for (let s = 0; s <= steps; s++) {
        n++;
        if (dotted && n % 3 === 0) continue;
        const x = Math.round(x0 + ((x1 - x0) * s) / steps);
        const y = Math.round(y0 + ((y1 - y0) * s) / steps);
        colors.forEach((c, i) => this.set(x, y + i, c));
      }
    }
    return this;
  }
}

const cleaver = (i) => ['d', 'g', 'G', 'g', 'B', 'd'][i] || 'g';
const cleaverV = (i) => ['d', 'g', 'G', 'B', 'd'][i] || 'g';
const katana = (i) => (i === 0 ? 'W' : 'K');

const RIBBONS = {
  front: [
    [[26, 6], [28, 3], [28, 0], [26, -3], [27, -6], [30, -7], [33, -6]],
    [[26, 6], [28, 3], [29, 0], [27, -3], [27, -6], [29, -8], [32, -8]],
  ],
  trail: [
    [[26, 6], [24, 1], [21, -3], [17, -5], [12, -5], [8, -7], [4, -6]],
    [[26, 6], [23, 1], [19, -4], [15, -6], [11, -5], [7, -6], [3, -8]],
  ],
};

function torso(v, dy) {
  const y = (n) => 17 + n + dy;
  v.rect(11, y(0), 14, 1, 'k').rect(9, y(1), 17, 11, 'k');
  v.rect(12, y(0), 3, 1, 'j').set(10, y(1), 'j').set(10, y(2), 'j');
  for (let n = 4; n <= 10; n++) v.set(12, y(n), 'K');
  for (let n = 5; n <= 10; n++) v.set(21, y(n), 'K');
  // white under-robe forming the V collar
  v.set(13, y(0), 'W').set(14, y(0), 'w').rect(15, y(0), 5, 1, 's').set(20, y(0), 'w').set(21, y(0), 'W');
  v.set(14, y(1), 'W').set(15, y(1), 'w').rect(16, y(1), 3, 1, 's').set(19, y(1), 'w').set(20, y(1), 'W');
  v.set(15, y(2), 'W').set(16, y(2), 'w').set(17, y(2), 's').set(18, y(2), 'w').set(19, y(2), 'W');
  v.set(16, y(3), 'W').set(17, y(3), 'w').set(18, y(3), 'W');
  // red strap from the back shoulder to the front hip
  v.line(10, y(1), 22, y(11), 2, (t, i) => (i ? 'R' : 'r'));
  // white obi with its knot at the front
  v.rect(9, y(12), 17, 1, 'w').rect(9, y(13), 17, 1, 'W').set(9, y(12), 'W');
  v.stamp(['.ww.', 'wwWw', 'wWWw', '.wW.', '.w.w', 'w..w'], 21, y(11));
}

function neck(v, dy) {
  v.rect(15, 15 + dy, 4, 3, 's').set(15, 17 + dy, 'S').set(18, 17 + dy, 'S');
}

// Sword held beside the face: hilt up to the pommel, blade angled down behind the back.
function heldSword(v, bankai, flutter, dy, style) {
  const path = RIBBONS[style][flutter].map(([x, y]) => [x, y + dy]);
  if (bankai) {
    v.ribbon(path, ['c', 'C'], true);
    v.line(28, 18 + dy, -4, 40, 2, (t, i) => katana(i));
  } else {
    v.ribbon(path, ['c', 'c', 'C']);
    v.line(27, 17 + dy, -6, 37, 7, (t, i) => ['d', 'g', 'G', 'G', 'g', 'B', 'd'][i]);
  }
}

function heldHilt(v, bankai, dy) {
  for (let y = 7; y <= 14; y++) {
    const wrap = !bankai && y % 3 === 0; // white cord wrapped around a dark grip
    v.set(26, y + dy, 'h').set(27, y + dy, wrap ? 'W' : 'h');
  }
  v.set(26, 6 + dy, 'h').set(27, 6 + dy, 'h');
  if (bankai) v.rect(25, 15 + dy, 4, 1, 'W').set(26, 16 + dy, 'W').set(27, 16 + dy, 'W');
}

function swingSword(v, pose, bankai) {
  if (pose === 'back') {
    // Wound back low behind the hip.
    if (bankai) v.line(5, 23, -14, 29, 2, (t, i) => katana(i), true);
    else v.line(5, 21, -14, 27, 5, (t, i) => cleaverV(i), true);
    v.rect(6, 22, 2, 2, 'h');
  } else if (pose === 'strike') {
    v.rect(36, 19, 3, 2, 'h').ribbon([[35, 21], [32, 25], [34, 29], [31, 33]], bankai ? ['c', 'C'] : ['c', 'c', 'C'], bankai);
    if (bankai) {
      v.rect(39, 18, 1, 4, 'W');
      v.rect(40, 19, 20, 1, 'W').rect(40, 20, 20, 1, 'K');
    } else {
      v.rect(39, 17, 21, 1, 'd').rect(39, 18, 21, 1, 'g').rect(39, 19, 21, 1, 'G').rect(39, 20, 20, 1, 'B').rect(39, 21, 19, 1, 'd');
      v.set(60, 18, 'g').set(60, 19, 'g');
    }
  } else if (pose === 'follow') {
    v.rect(29, 10, 2, 2, 'h');
    if (bankai) v.line(31, 9, 47, -3, 2, (t, i) => katana(i));
    else v.line(30, 9, 45, -3, 5, (t, i) => cleaver(i));
  }
}

function compose({ legs, back = 'hang', front = 'hold', bob = 0, flutter = 0, ribbon = 'front', bankai = false }) {
  const frame = new Grid(FRAME_W, FRAME_H);
  const v = new LocalView(frame);
  const holding = front === 'hold';

  if (holding) heldSword(v, bankai, flutter, bob, ribbon);
  if (!holding && front !== 'follow') swingSword(v, front, bankai);
  if (bankai) {
    const [rows, x, y] = legs === 'stand' ? COAT.stand : COAT.run;
    v.stamp(rows, x, y + bob);
  }
  const [bRows, bx, by] = BACK_ARM[back];
  v.stamp(bRows, bx, by + bob);
  v.stamp(LEGS[legs], 2, 31);
  neck(v, bob);
  torso(v, bob);
  v.stamp(CROWN, 4, bob - 3);
  v.stamp(BACK_HAIR, 1, bob + 4);
  v.stamp(HEAD, 7, bob);
  if (holding) heldHilt(v, bankai, bob);
  if (front === 'follow') swingSword(v, 'follow', bankai);
  const [fRows, fx, fy] = FRONT_ARM[front];
  v.stamp(fRows, fx, fy + (holding ? bob : 0));
  frame.outline('x');
  return frame.rows();
}

const POSES = {
  idle0: { legs: 'stand' },
  idle1: { legs: 'stand', bob: 1, flutter: 1 },
  run0: { legs: 'stride', back: 'fwd' },
  run1: { legs: 'pass', bob: -1, flutter: 1 },
  run2: { legs: 'stride', back: 'back' },
  run3: { legs: 'pass', bob: -1, flutter: 1 },
  jump: { legs: 'jump', back: 'back', flutter: 1 },
  fall: { legs: 'fall', back: 'fwd' },
  slash0: { legs: 'stride', front: 'back' },
  slash1: { legs: 'stride', front: 'strike' },
  slash2: { legs: 'stride', front: 'follow' },
  hurt: { legs: 'fall', back: 'back', bob: -1 },
};

export function buildFrames(bankai = false) {
  return Object.fromEntries(Object.entries(POSES).map(([name, pose]) => [name, compose({ ...pose, bankai })]));
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
