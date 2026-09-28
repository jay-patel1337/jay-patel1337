// Ichigo-inspired hero, composed from parts so every frame stays consistent.
// Frames are 48×36 character grids; the feet rest on row AY-1 and are centred on AX.
// Used by the README renderer (SVG) and by the game at /play (canvas).

import { Grid } from './pixel-canvas.js';

export const FRAME_W = 48;
export const FRAME_H = 36;
export const AX = 22;
export const AY = 35;
const X0 = 10; // local body space (24×32) → frame space
const Y0 = 2;

export const PALETTE = {
  x: '#000000', // outline
  O: '#ffa300', // hair
  o: '#d0600e', // hair shadow
  s: '#ffccaa', // skin
  S: '#e8967a', // skin shadow
  e: '#1b1030', // eye
  b: '#8a3a12', // brow
  m: '#b25a4a', // mouth
  k: '#16162a', // robe
  K: '#3a3a5e', // robe fold
  w: '#fff1e8', // white collar / tabi / hilt wrap
  W: '#c2c3c7', // white shade
  r: '#ff004d', // strap / coat lining
  R: '#a8123f', // strap shade
  g: '#c2c3c7', // blade
  G: '#fff1e8', // blade edge
  d: '#6b6f80', // blade spine
  n: '#ab5236', // sandals
  c: '#8a8f9e', // chain
};

// Bankai glows: the outline turns crimson.
export const BANKAI_PALETTE = { ...PALETTE, x: '#7e2553' };

const HEAD = [
  '...O....O....',
  '..OO..OOO..O.',
  '.OOOOOOOOOOO.',
  'OOOOOOOOOOOO.',
  '.OOOOOOOOOOOO',
  'OOOoOOOOOOOOO',
  '.OOooOOOOOOOO',
  'OOOoOOsOsOOO.',
  '.OOoOsssbbbO.',
  '.OooSssswess.',
  '..oSsssssssss',
  '...sssssssms.',
  '....sssssss..',
  '.....SSsss...',
];

// Front (near-side) arm poses: [stamp, x, y] in local body space.
const FRONT_ARM = {
  neutral: [['.kkk', 'kkkK', 'kkkK', 'kkkk', 'kKkk', '.kkk', '..ss', '..sS'], 14, 15],
  back: [['....kkk', '...kkkk', '..kkkK.', '.kkkk..', 'ssk....', 'sS.....'], 10, 15],
  fwd: [['.kkk...', 'kkkkk..', 'kkkkkk.', '.kkkkss', '...kkss'], 14, 15],
  raise: [['ss....', 'sSkkk.', '.kkkkk', '..kkkK', '...kkk'], 9, 14],
  strike: [['.kkkk....', 'kkkkkkkss', '.kkkkkkss'], 14, 15],
  follow: [['.kkk...', 'kkkkk..', '.kkkkk.', '..kkkss', '....kss'], 14, 15],
  up: [['ss...', 'sSk..', '.kkk.', '.kkkk', '..kkk', '..kkk'], 13, 9],
};

const FAR_ARM = {
  none: null,
  fwd: [['kkkk.', 'kkkss'], 15, 17],
  back: [['.kkk', 'sskk', 'sS..'], 5, 16],
};

// Hakama + feet, 18 wide, placed at local (3, 23).
const LEGS = {
  stand: [
    '.....kkkkkkkkkk...',
    '.....kkkkKkkkkk...',
    '....kkkkkKKkkkkk..',
    '....kkkkKk.kkkkk..',
    '....kkkkK..kkkkk..',
    '...kkkkkK..Kkkkkk.',
    '...kkkkkk..kkkkkk.',
    '.....www....www...',
    '....nnnnn..nnnnn..',
  ],
  stride: [
    '.....kkkkkkkkkk...',
    '....kkkkkKkkkkkk..',
    '...kkkkkK..kkkkkk.',
    '..kkkkkK....kkkkkk',
    '.kkkkkK......kkkkk',
    'kkkkK........kkkkk',
    'ww............kkkk',
    'nw.............www',
    '...............nnn',
  ],
  pass: [
    '.....kkkkkkkkkk...',
    '.....kkkkKkkkkkk..',
    '.....kkkkKkkkkkkk.',
    '......kkkKkkkkkkk.',
    '......kkkk.kkkkkk.',
    '......kkkk...kkww.',
    '......kkkk....nnw.',
    '.......www........',
    '......nnnnn.......',
  ],
  jump: [
    '.....kkkkkkkkkk...',
    '....kkkkkKkkkkkk..',
    '...kkkkkK..kkkkkk.',
    '...kkkkK....kkkkk.',
    '..kkkkk......kkkk.',
    '..wwkk.......kkww.',
    '.nnw..........wnn.',
    '..................',
    '..................',
  ],
  fall: [
    '.....kkkkkkkkkk...',
    '.....kkkkKkkkkk...',
    '.....kkkkKKkkkkk..',
    '.....kkkK..kkkkk..',
    '.....kkkK...kkkkk.',
    '....kkkkK...Kkkkk.',
    '.....www.....www..',
    '.....nnn.....nnn..',
    '..................',
  ],
};

// Bankai coat tails (black with crimson lining), drawn behind the legs.
const COAT = {
  stand: [['..kkk', '.kkkk', '.kkrk', 'kkkrk', 'kkrrk', 'kkrrk', 'kkrkk', 'kkrkk', 'k.k.k'], 5, 21],
  run: [
    ['.......kkk', '.....kkkkk', '....kkkkkk', '...kkrkkkk', '..kkrrkkkk', '.kkrrkkkk.', 'kkrrkkkkk.', 'krrkkkkk..', 'k.krkk.k..', '.k..k.....'],
    0,
    20,
  ],
};

function torso(g, dy) {
  const y0 = 14 + dy;
  g.rect(9, y0, 8, 1, 'k');
  g.rect(8, y0 + 1, 10, 7, 'k');
  g.set(10, y0 + 3, 'K').set(10, y0 + 4, 'K').set(10, y0 + 5, 'K');
  g.set(15, y0 + 5, 'K').set(15, y0 + 6, 'K');
  // white under-robe forming the V collar
  g.set(11, y0, 'w').set(12, y0, 's').set(13, y0, 's').set(14, y0, 'w');
  g.set(12, y0 + 1, 'w').set(13, y0 + 1, 'w');
  // red sword strap from the front shoulder to the back hip
  for (let i = 0; i < 8; i++) {
    g.set(16 - i, y0 + i, 'R');
    g.set(17 - i, y0 + i, 'r');
  }
  // obi
  g.rect(8, y0 + 8, 10, 1, 'w');
  g.set(8, y0 + 8, 'W');
}

// Zangetsu (shikai): a huge cleaver with a white-wrapped hilt.
const edge = (i, w) => (i === 0 ? 'G' : i === w - 1 ? 'd' : 'g');
const katana = (i) => (i === 0 ? 'W' : 'K');

function swordOnBack(g, bankai, dy) {
  if (bankai) {
    g.band(6, 12 + dy, 0, 30, 2, (t, i) => katana(i));
    g.set(5, 11 + dy, 'W').set(6, 11 + dy, 'W').set(7, 11 + dy, 'W').set(6, 10 + dy, 'W').set(6, 12 + dy, 'W');
    g.band(7, 5 + dy, 6, 9 + dy, 1, () => 'k');
    [[8, 4], [9, 5], [9, 6], [10, 7], [10, 8]].forEach(([x, y]) => g.set(x, y + dy, 'c'));
    return;
  }
  g.band(5, 13 + dy, 1, 28, 5, (t, i) => edge(i, 5));
  g.band(4, 5 + dy, 5, 12 + dy, 2, (t, i) => (i ? 'W' : 'w'));
  g.set(3, 5 + dy, 'r').set(2, 6 + dy, 'r').set(2, 7 + dy, 'R');
}

function swordInHand(g, pose, bankai) {
  const hilt = bankai ? () => 'k' : (t, i) => (i ? 'W' : 'w');
  if (pose === 'raise') {
    g.band(9, 14, 7, 12, 2, hilt);
    if (bankai) g.band(7, 11, -6, -1, 2, (t, i) => katana(i));
    else g.band(6, 11, -4, 0, 4, (t, i) => edge(i, 4));
  } else if (pose === 'strike') {
    g.rect(21, 16, 3, 2, 'w');
    if (bankai) {
      g.rect(24, 15, 1, 4, 'W');
      g.rect(25, 16, 11, 1, 'W').rect(25, 17, 11, 1, 'K');
    } else {
      g.rect(24, 14, 11, 1, 'd').rect(24, 15, 11, 2, 'g').rect(24, 17, 10, 1, 'g').rect(24, 18, 9, 1, 'G');
      g.set(35, 15, 'g').set(35, 16, 'g');
    }
  } else if (pose === 'follow') {
    g.band(19, 19, 21, 21, 2, hilt);
    if (bankai) g.band(22, 22, 32, 32, 2, (t, i) => katana(i));
    else g.band(21, 21, 29, 30, 4, (t, i) => edge(3 - i, 4));
  }
}

// Draws in local body coordinates onto the full frame (local x can go negative for swords).
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
  band(x0, y0, x1, y1, w, paint) {
    this.g.band(x0 + X0, y0 + Y0, x1 + X0, y1 + Y0, w, paint);
    return this;
  }
}

function compose({ legs, front, far = 'none', sword = 'back', bob = 0, bankai = false }) {
  const frame = new Grid(FRAME_W, FRAME_H);
  const view = new LocalView(frame);

  if (sword === 'back') swordOnBack(view, bankai, bob);
  if (sword === 'raise') swordInHand(view, 'raise', bankai);
  if (bankai) {
    const [rows, x, y] = legs === 'stand' || legs === 'fall' ? COAT.stand : COAT.run;
    view.stamp(rows, x, y + bob);
  }
  const farArm = FAR_ARM[far];
  if (farArm) view.stamp(farArm[0], farArm[1], farArm[2] + bob);
  view.stamp(LEGS[legs], 3, 23);
  torso(view, bob);
  view.stamp(HEAD, 6, bob);
  if (sword === 'strike' || sword === 'follow') swordInHand(view, sword, bankai);
  const [arm, ax, ay] = FRONT_ARM[front];
  view.stamp(arm, ax, ay + bob);
  frame.outline('x');
  return frame.rows();
}

const POSES = {
  idle0: { legs: 'stand', front: 'neutral' },
  idle1: { legs: 'stand', front: 'neutral', bob: 1 },
  run0: { legs: 'stride', front: 'back', far: 'fwd' },
  run1: { legs: 'pass', front: 'neutral', bob: -1 },
  run2: { legs: 'stride', front: 'fwd', far: 'back' },
  run3: { legs: 'pass', front: 'neutral', bob: -1 },
  jump: { legs: 'jump', front: 'fwd', far: 'back' },
  fall: { legs: 'fall', front: 'fwd', far: 'back' },
  slash0: { legs: 'stride', front: 'raise', sword: 'raise' },
  slash1: { legs: 'stride', front: 'strike', sword: 'strike' },
  slash2: { legs: 'stride', front: 'follow', sword: 'follow' },
  hurt: { legs: 'pass', front: 'up', far: 'back' },
};

export function buildFrames(bankai = false) {
  return Object.fromEntries(Object.entries(POSES).map(([name, pose]) => [name, compose({ ...pose, bankai })]));
}

// Crop transparent margins (used for README sprites).
export function trim(frames) {
  const all = Object.values(frames);
  let x0 = FRAME_W, x1 = 0, y0 = FRAME_H, y1 = 0;
  for (const rows of all)
    rows.forEach((row, y) =>
      [...row].forEach((c, x) => {
        if (c === '.') return;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      })
    );
  return Object.fromEntries(Object.entries(frames).map(([k, rows]) => [k, rows.slice(y0, y1 + 1).map((r) => r.slice(x0, x1 + 1))]));
}
