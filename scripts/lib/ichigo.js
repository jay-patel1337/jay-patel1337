// Ichigo-inspired hero in his Bankai coat with a single Tensa Zangetsu katana,
// composed from layered parts so every frame stays consistent. Faces right.
// Frames are 80×54 character grids; feet rest on row AY-2 and are centred on AX.
// Shared by the README SVGs and the game at /play.

import { Grid } from './pixel-canvas.js';

export const FRAME_W = 80;
export const FRAME_H = 54;
const X0 = 18; // local body space (32×44) → frame space
const Y0 = 8;
export const AX = X0 + 17;
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
  k: '#15151f', // coat
  K: '#3a3a55', // coat folds
  j: '#5a5a7a', // coat edge light
  W: '#c8c4d0', // grey highlight / guard
  w: '#fff4ea', // white
  r: '#e8203a', // blade edge / lining
  R: '#8e1030', // lining shade
  p: '#26263a', // hakama under the coat
  f: '#0e0e16', // sandals
  b: '#1c1c2a', // blade
  v: '#9a9ab8', // blade shine
  h: '#2c2c3c', // hilt
  c: '#44445c', // chain
  M: '#fff4ea', // hollow mask
  Z: '#c8c4d0', // mask shade
};

// Hollow-mask mode glows crimson.
export const MASK_PALETTE = { ...PALETTE, x: '#7e2553' };
export const BANKAI_PALETTE = MASK_PALETTE; // kept for older imports

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

// Hollow mask over the face: white bone, red stripes, black eye holes, teeth.
const MASK = [
  '..MMMMMMMMMM..',
  '.MMMMMMMMMMMM.',
  'MMrMMxxMMMxxM.',
  'MMrMMxxMMMxxMM',
  'MMrrMMMMMMMMMM',
  '.MMrMMMMMMMMZ.',
  '..MZMZMZMZMZ..',
  '...ZZZZZZZZ...',
];

// Coat skirt + legs. `stand` is 40 wide at x=-3; the rest are 44 wide at x=-10.
const SKIRT = {
  stand: [
    [
      '............kkkkkkkkkKkkkkkkk...........',
      '...........kkkkkkkkkkRrkkkkkkk..........',
      '..........kkkkKkkkkkRppRkkkKkkkk........',
      '.........kkkkKkkkkkRpppRkkkkKkkkk.......',
      '........kkkkKkkkkkRpppppRkkkkKkkkk......',
      '.......kkkkKkkkkkRppp.pppRkkkkKkkkk.....',
      '......kkkkKkkkkkRppp..pppRkkkkkKkkkk....',
      '.....kkkkKkkkkkRppp...pppRkkkkkKkkkkk...',
      '....kkkkKkkkkkRppp.....pppRkkkkkKkkkkk..',
      '...kkkkKkkkkkRppp......pppRkkkkkKkkkkkk.',
      '..kkkkKkkkkkRppp.......pppRkkkkkkKkkkkkk',
      '.kkkkKkkkkRRppp........pppRRkkkkkKkkkkkk',
      'kkkkkkkkkRR.ppp........ppp.RRkkkkkkkkkkk',
      'k.kk.kkk.k..ppp........ppp..k.kkk.kk.k.k',
      '...........fffff......fffff.............',
      '..........ffffffW.....ffffffW...........',
    ],
    -3,
  ],
  stride: [
    [
      '...................kkkkkkkkkkKkkkkkk........',
      '..............kkkkkkkkkkkkkkRrkkkkkk........',
      '..........kkkkkkkkKkkkkkkkkRppRkkkkkk.......',
      '.......kkkkkkkKkkkkkkkkkkkRpppRkkkkkkk......',
      '....kkkkkkKkkkkkkkkkkkkkkRppppRkkkkkkk......',
      '..kkkkkKkkkkkkRRRkkkkkkkRpppppRkkkkkkkk.....',
      'kkkkkKkkkkkkRRkk.kkkkkkRppp.pppRkkkkkkkk....',
      'kkkKkkkkkRRkk.....kkkkRppp..pppRkkkkkkkk....',
      'kkkkkkRRkk.........kkRppp....ppppRkkkkkkk...',
      'kk.kkkkk...........kppp......pppp.RkkkkKk...',
      'k..k.k............ppp.........pppp..kkkkk...',
      '.................ppp...........pppp..kk.k...',
      '................ppp.............pppp........',
      '...............fff...............ffff.......',
      '..............ffff...............fffffW.....',
      '..............fffW................fffff.....',
    ],
    -10,
  ],
  pass: [
    [
      '...................kkkkkkkkkkKkkkkkk........',
      '...............kkkkkkkkkkkkkRrkkkkkk........',
      '...........kkkkkkkkKkkkkkkkkRppRkkkkk.......',
      '........kkkkkkkKkkkkkkkkkkkRpppRkkkkkk......',
      '.....kkkkkkKkkkkkkkkkkkkkkRpppRkkkkkkk......',
      '...kkkkkKkkkkkkRRRkkkkkkkkRpppRkkkkkkkk.....',
      '.kkkkKkkkkkkRRkk.kkkkkkkkRpppRkkkkkkkkk.....',
      'kkkKkkkkkRRkk......kkkkkRpppRRkkkkkkkk......',
      'kkkkkkRRkk..........kkkRpppp.Rkkkkkkkk......',
      'kk.kkkkk.............kkpppp..pppkkkKkk......',
      'k..k.k.................pppp..pppp.kkkk......',
      '.......................pppp...ffff..k.k.....',
      '.......................pppp...fffW..........',
      '.......................ffff.................',
      '......................fffff.................',
      '......................ffffW.................',
    ],
    -10,
  ],
  jump: [
    [
      '...................kkkkkkkkkkKkkkkkk........',
      '..............kkkkkkkkkkkkkkRrkkkkkk........',
      '..........kkkkkkkkKkkkkkkkkRppRkkkkkk.......',
      '.......kkkkkkkKkkkkkkkkkkkRpppRkkkkkkk......',
      '.....kkkkkKkkkkkkkkkkkkkkRpppppRkkkkkkk.....',
      '....kkkkKkkkkkRRRkkkkkkkRppp.pppRkkkkkkk....',
      '...kkkkKkkkkRRkkkkkkkkkRppp...pppRkkkkkkk...',
      '..kkkKkkkRRkk..kkkkkkkRffff...ffffRkkkkkk...',
      '.kkkkkRRkk......kkkkk.ffffW...ffffWkkkkK....',
      'kk.kkkk..........kkk....................kk..',
      'k..k.k...............................k.k....',
    ],
    -10,
  ],
  fall: [
    [
      '...................kkkkkkkkkkKkkkkkk........',
      '................kkkkkkkkkkkkRrkkkkkkk.......',
      '.............kkkkkkKkkkkkkkRppRkkkkkkk......',
      '..........kkkkKkkkkkkkkkkkRpppRkkkkkkkk.....',
      '.......kkkkKkkkkkkkkkkkkkRpppppRkkkkkkkk....',
      '.....kkkKkkkkkkRRkkkkkkkRppp.pppRkkkkkkkk...',
      '...kkKkkkkkkRRkk..kkkkkRppp...pppRkkKkkkk...',
      '.kkkkkkkkRRk........kkkppp....pppkkkkkkk....',
      'kk.kkkkRk...........kkppp.....ppp.kk.k......',
      'k..k.k................ppp.....ppp...........',
      '......................ppp.....ppp...........',
      '......................fff.....fff...........',
      '.....................ffffW...ffffW..........',
    ],
    -10,
  ],
};

// Sword arm (holds Tensa Zangetsu): [stamp, x, y].
const SWORD_ARM = {
  low: [['....kkkk', '...kkkkK', '...kkkkk', '..kkkKkk', '..kkkkk.', '.kkkkkk.', '.kkKkk..', '.kkkkk..', 'kkkkk...', 'kkkk....', 'ssS.....', 'sSs.....'], 4, 18],
  strike: [['kkkk.................', 'kkkkkkkk.............', '.kkkkkkkkkkkkkkkkkss.', '..kkkkkKkkkkkkkkkksSs', '....kkkkkkkkkkkkkksss'], 10, 18],
  follow: [['kkkk...............', 'kkkkkk.............', '.kkkkkkkk..........', '..kkkkkkkkkk.......', '....kkkkkKkkkkk....', '......kkkkkkkkkkk..', '........kkkkkkkkkss', '...........kkkkksSs', '...............ssss'], 10, 18],
};

// Free arm: [stamp, x, y].
const FREE_ARM = {
  hip: [['kkkk....', 'kkkkk...', 'kkKkkk..', '.kkkkkk.', '.kkkKkkk', '..kkkkkk', '..kkkkkk', '...kkkkk', '...kkkk.', '....sss.', '....sSs.'], 21, 18],
  fwd: [['kkkk.....', 'kkkkkk...', '.kkkKkkk.', '..kkkkkkk', '...kkkkss', '....kkkss'], 21, 18],
  back: [['.kkkk', 'kkkkk', 'kkKkk', 'kkkk.', 'kkk..', 'ss...', 'sS...'], 19, 18],
  up: [['....ss', '...sSs', '..kkk.', '.kkkk.', 'kkkKk.', 'kkkk..'], 22, 12],
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
  line(x0, y0, x1, y1, colors, vertical = false) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2 || 1;
    for (let s = 0; s <= steps; s++) {
      const x = Math.round(x0 + ((x1 - x0) * s) / steps);
      const y = Math.round(y0 + ((y1 - y0) * s) / steps);
      colors.forEach((c, i) => (vertical ? this.set(x, y + i, c) : this.set(x + i, y, c)));
    }
    return this;
  }
  // Chain: a dotted polyline of links.
  chain(points) {
    let n = 0;
    for (let p = 0; p < points.length - 1; p++) {
      const [x0, y0] = points[p];
      const [x1, y1] = points[p + 1];
      const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
      for (let s = 0; s < steps; s++) {
        if (n++ % 3 === 2) continue;
        this.set(Math.round(x0 + ((x1 - x0) * s) / steps), Math.round(y0 + ((y1 - y0) * s) / steps), 'c');
      }
    }
    return this;
  }
}

const BLADE = ['v', 'b', 'r']; // shine on top, black body, red edge
const CHAINS = [
  [[9, 25], [6, 22], [3, 23], [1, 20], [-2, 22], [-4, 19]],
  [[9, 25], [6, 23], [3, 21], [0, 22], [-2, 19], [-5, 20]],
];

function sword(v, pose, flutter) {
  if (pose === 'low' || pose === 'back') {
    // Held low at the hip, blade trailing down behind him; chain swinging off the pommel.
    v.chain(CHAINS[flutter]);
    v.line(7, 28, 9, 25, ['h']);
    v.rect(3, 29, 3, 1, 'W').set(4, 28, 'W').set(4, 30, 'W');
    if (pose === 'low') v.line(3, 30, -16, 42, BLADE, true);
    else v.line(3, 29, -17, 32, BLADE, true);
  } else if (pose === 'strike') {
    v.chain([[28, 22], [27, 26], [29, 29], [27, 32]]);
    v.rect(31, 19, 1, 5, 'W');
    v.line(32, 20, 59, 20, BLADE, true);
    v.set(60, 21, 'r');
  } else if (pose === 'follow') {
    v.chain([[27, 25], [24, 28], [26, 31], [23, 33]]);
    v.rect(29, 24, 1, 5, 'W');
    v.line(30, 26, 46, 40, ['v', 'b', 'r']);
  }
}

function collar(v, dy) {
  v.set(13, 15 + dy, 'k').set(21, 15 + dy, 'k');
  v.rect(12, 16 + dy, 11, 1, 'k').set(13, 16 + dy, 'K').set(21, 16 + dy, 'K');
  v.rect(12, 17 + dy, 11, 1, 'k');
}

function coat(v, dy) {
  const y = (n) => 17 + n + dy;
  v.rect(11, y(0), 13, 1, 'k').rect(9, y(1), 17, 10, 'k');
  v.rect(10, y(1), 4, 1, 'K').rect(21, y(1), 4, 1, 'K').set(9, y(2), 'j').set(25, y(2), 'j');
  for (let n = 4; n <= 10; n++) v.set(12, y(n), 'K');
  // open lapel: grey edge with the crimson lining peeking out
  v.line(18, y(1), 20, y(10), ['W']);
  v.line(17, y(2), 19, y(10), ['R']);
}

function compose({ legs, arm = 'low', free = 'hip', bob = 0, flutter = 0, mask = false }) {
  const frame = new Grid(FRAME_W, FRAME_H);
  const v = new LocalView(frame);
  const low = arm === 'low' || arm === 'back';

  if (free === 'back') v.stamp(FREE_ARM.back[0], FREE_ARM.back[1], FREE_ARM.back[2] + bob);
  const [skirt, sx] = SKIRT[legs];
  v.stamp(skirt, sx, 28);
  collar(v, bob);
  coat(v, bob);
  v.stamp(CROWN, 4, bob - 3);
  v.stamp(BACK_HAIR, 1, bob + 4);
  v.stamp(HEAD, 7, bob);
  if (mask) v.stamp(MASK, 11, 8 + bob);
  if (free !== 'back') v.stamp(FREE_ARM[free][0], FREE_ARM[free][1], FREE_ARM[free][2] + bob);
  sword(v, arm, flutter);
  const [aRows, ax, ay] = SWORD_ARM[low ? 'low' : arm];
  v.stamp(aRows, ax, ay + bob);
  frame.outline('x');
  return frame.rows();
}

const POSES = {
  idle0: { legs: 'stand' },
  idle1: { legs: 'stand', bob: 1, flutter: 1 },
  run0: { legs: 'stride', free: 'fwd' },
  run1: { legs: 'pass', bob: -1, flutter: 1 },
  run2: { legs: 'stride', free: 'back' },
  run3: { legs: 'pass', bob: -1, flutter: 1 },
  jump: { legs: 'jump', free: 'fwd', flutter: 1 },
  fall: { legs: 'fall', free: 'up' },
  slash0: { legs: 'stride', arm: 'back', free: 'fwd' },
  slash1: { legs: 'stride', arm: 'strike' },
  slash2: { legs: 'stride', arm: 'follow' },
  hurt: { legs: 'fall', free: 'up', bob: -1, flutter: 1 },
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
