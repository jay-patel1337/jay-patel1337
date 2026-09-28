import { C } from './svg.js';
import { buildFrames, trim, PALETTE } from './ichigo.js';

// Hero frames come from the same composer the game uses, cropped for the README.
const HERO = buildFrames(false);
const pick = (names) => Object.fromEntries(names.map((n) => [n, HERO[n]]));
const RUN = trim(pick(['run0', 'run1', 'run2', 'run3']));
const IDLE = trim(pick(['idle0', 'idle1']));
const SLASH = trim(pick(['slash1']));
export const HERO_RUN = [RUN.run0, RUN.run1, RUN.run2, RUN.run3];
export const HERO_IDLE = [IDLE.idle0, IDLE.idle1];
export const HERO_SLASH = SLASH.slash1;
export const HERO_PAL = PALETTE;

export const MOON = [
  '.....yyyyyy.....',
  '...yyyyyyy......',
  '..yyyyyy........',
  '.yyyyyy.........',
  '.yyyyy..........',
  'yyyyyy..........',
  'yyyyy...........',
  'yyyyy...........',
  'yyyyy...........',
  'yyyyyy..........',
  '.yyyyy..........',
  '.yyyyyy.........',
  '..yyyyyy........',
  '...yyyyyyy......',
  '.....yyyyyy.....',
];
export const MOON_PAL = { y: C.cream };

export const HEART = ['.rr.rr.', 'rwrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'];
export const HEART_PAL = { r: C.red, w: C.cream };

export const COIN = ['..oooo..', '.oyyyyo.', 'oyywyyyo', 'oyywyyyo', 'oyywyyyo', 'oyyyyyyo', '.oyyyyo.', '..oooo..'];
export const COIN_PAL = { o: C.orange, y: C.yellow, w: C.cream };

export const STAR = ['....y....', '....y....', '...yyy...', 'yyyyyyyyy', '.yyyyyyy.', '..yyyyy..', '..yy.yy..', '.yy...yy.', 'y.......y'];
export const STAR_PAL = { y: C.yellow };

export const TROPHY = [
  '..oyyyyyyo..',
  'yyoyyyywyoyy',
  'y.oyyyywyo.y',
  'y.oyyyywyo.y',
  '.yoyyyyyyoy.',
  '..oyyyyyyo..',
  '...oyyyyo...',
  '....oyyo....',
  '.....yy.....',
  '....oyyo....',
  '...oooooo...',
  '...oooooo...',
];
export const TROPHY_PAL = { y: C.yellow, o: C.orange, w: C.cream };
export const TROPHY_LOCKED_PAL = { y: C.slate, o: '#3a3530', w: C.slate };

export const LOCK = ['...gggg...', '..g....g..', '..g....g..', '..g....g..', 'gggggggggg', 'ggggddgggg', 'ggggddgggg', 'gggggggggg', 'gggggggggg'];
export const LOCK_PAL = { g: C.silver, d: C.slate };

export const CURSOR = ['#....', '##...', '###..', '####.', '###..', '##...', '#....'];

// 16×16 inventory icons.
const HEX_BODY = (rows) => ['.......dd.......', '.....ddbbdd.....', '...ddbbbbbbdd...', '.ddbbbbbbbbbbdd.', ...rows, '.ddbbbbbbbbbbdd.', '...ddbbbbbbdd...', '.....ddbbdd.....', '.......dd.......'];
const SHIELD = (rows) => ['.bbbbbbbbbbbbbb.', '.bbbbbbbbbbbbbb.', ...rows, '.bbbbbbbbbbbbbb.', '..bbbbbbbbbbbb..', '...bbbbbbbbbb...', '....bbbbbbbb....', '......bbbb......', '................'];

export const ICONS = {
  c: {
    rows: HEX_BODY([
      'dbbbbbwwwwbbbbbd',
      'dbbbbwwbbwwbbbbd',
      'dbbbwwbbbbbbbbbd',
      'dbbbwwbbbbbbbbbd',
      'dbbbwwbbbbbbbbbd',
      'dbbbwwbbbbbbbbbd',
      'dbbbbwwbbwwbbbbd',
      'dbbbbbwwwwbbbbbd',
    ]),
    pal: { d: '#1b5e9e', b: C.blue, w: C.cream },
  },
  cpp: {
    rows: HEX_BODY([
      'dbbwwwwbbbbbbbbd',
      'dbwwbbwwbbbbbbbd',
      'dbwwbbbbbbbbbbbd',
      'dbwwbbbbbwbbbwbd',
      'dbwwbbbbwwwbwwwd',
      'dbwwbbbbbwbbbwbd',
      'dbwwbbwwbbbbbbbd',
      'dbbwwwwbbbbbbbbd',
    ]),
    pal: { d: '#16325c', b: '#3a64c8', w: C.cream },
  },
  python: {
    rows: [
      '....bbbbbb......',
      '...bbwbbbbb.....',
      '...bbbbbbbb.....',
      '......bbbbb.....',
      '.bbbbbbbbbb.yy..',
      'bbbbbbbbbbb.yyy.',
      'bbbbbbbbbbb.yyyy',
      'bbbbb.......yyyy',
      'bbbb.......yyyyy',
      'bbbb.yyyyyyyyyyy',
      '.bbb.yyyyyyyyyyy',
      '..bb.yyyyyyyyyy.',
      '.....yyyyy......',
      '.....yyyyyyyy...',
      '.....yyyyywyy...',
      '......yyyyyy....',
    ],
    pal: { b: '#3b7dd8', y: C.yellow, w: C.cream },
  },
  html: {
    rows: SHIELD([
      '.bbbwwwwwwwwbbb.',
      '.bbbwwbbbbbbbbb.',
      '.bbbwwbbbbbbbbb.',
      '.bbbwwwwwwwwbbb.',
      '.bbbbbbbbbbwwbb.',
      '.bbbbbbbbbbwwbb.',
      '.bbbbbbbbbbwwbb.',
      '.bbbwwwwwwwwbbb.',
    ]),
    pal: { b: '#ff5a1f', w: C.cream },
  },
  css: {
    rows: SHIELD([
      '.bbbwwwwwwwwbbb.',
      '.bbbbbbbbbbwwbb.',
      '.bbbbbbbbbbwwbb.',
      '.bbbbbwwwwwwbbb.',
      '.bbbbbbbbbbwwbb.',
      '.bbbbbbbbbbwwbb.',
      '.bbbbbbbbbbwwbb.',
      '.bbbwwwwwwwwbbb.',
    ]),
    pal: { b: '#3d6bff', w: C.cream },
  },
  flask: {
    rows: [
      '....gggggggg....',
      '.....g....g.....',
      '.....g....g.....',
      '.....g....g.....',
      '.....g....g.....',
      '....g......g....',
      '...g........g...',
      '..g..........g..',
      '..gllllllllllg..',
      '.gllwlllllllllg.',
      '.gllllllllwlllg.',
      'gllllllllllllllg',
      'gllllllwlllllllg',
      'gllllllllllllllg',
      '.gggggggggggggg.',
      '................',
    ],
    pal: { g: C.silver, l: C.green, w: C.cream },
  },
  git: {
    rows: [
      '.......rr.......',
      '......rrrr......',
      '.....rrrrrr.....',
      '....rrwwrrrr....',
      '...rrrwwwrrrr...',
      '..rrrrwwrwwrrr..',
      '.rrrrrwwrrwwrrr.',
      'rrrrrrwwrrrwwrrr',
      'rrrrrrwwrrrwwrrr',
      '.rrrrrwwrrrrrrr.',
      '..rrrrwwrrrrrr..',
      '...rrwwwwrrrr...',
      '....rwwwwrrr....',
      '.....rrrrrr.....',
      '......rrrr......',
      '.......rr.......',
    ],
    pal: { r: '#ff5a3c', w: C.cream },
  },
  github: {
    rows: [
      '.....cccccc.....',
      '...cccccccccc...',
      '..cckcccccckcc..',
      '.ccckkcccckkccc.',
      '.ccckkkkkkkkccc.',
      'cccckkkkkkkkcccc',
      'ccckkkkkkkkkkccc',
      'ccckkkkkkkkkkccc',
      'ccckkkkkkkkkkccc',
      'cccckkkkkkkkcccc',
      '.ccccckkkkccccc.',
      '.ckccckkkkccccc.',
      '..cckkkkkkcccc..',
      '...cckkkkkkcc...',
      '.....cckkcc.....',
      '......cccc......',
    ],
    pal: { c: C.cream, k: C.black },
  },
  vscode: {
    rows: [
      '.vvvvvvvvvvvvvv.',
      'vvvvvvvvvvvvvvvv',
      'vvvvvvvvvvvvvvvv',
      'vvvvvvvvvvvvvvvv',
      'vvvvvvvvvwvvvvvv',
      'vvvvwvvvvwvwvvvv',
      'vvvwvvvvwvvvwvvv',
      'vvwvvvvvwvvvvwvv',
      'vvwvvvvwvvvvvwvv',
      'vvvwvvvwvvvvwvvv',
      'vvvvwvwvvvvwvvvv',
      'vvvvvvwvvvvvvvvv',
      'vvvvvvvvvvvvvvvv',
      'vvvvvvvvvvvvvvvv',
      'vvvvvvvvvvvvvvvv',
      '.vvvvvvvvvvvvvv.',
    ],
    pal: { v: '#1f8ad2', w: C.cream },
  },
  mystery: {
    rows: [
      'dddddddddddddddd',
      'dyyyyyyyyyyyyyyd',
      'dydyyyyyyyyyydyd',
      'dyyyyywwwwyyyyyd',
      'dyyyywwyywwyyyyd',
      'dyyyyyyyywwyyyyd',
      'dyyyyyyywwyyyyyd',
      'dyyyyyywwyyyyyyd',
      'dyyyyyywwyyyyyyd',
      'dyyyyyyyyyyyyyyd',
      'dyyyyyywwyyyyyyd',
      'dyyyyyywwyyyyyyd',
      'dyyyyyyyyyyyyyyd',
      'dydyyyyyyyyyydyd',
      'dyyyyyyyyyyyyyyd',
      'dddddddddddddddd',
    ],
    pal: { d: C.brown, y: C.orange, w: C.cream },
  },
};

// 12-wide button icons for the CONTINUE? screen.
export const BTN_ICONS = {
  linkedin: {
    rows: [
      '.bbbbbbbbbb.',
      'bbbbbbbbbbbb',
      'bwwbbbbbbbbb',
      'bwwbbbbbbbbb',
      'bbbbbbbbbbbb',
      'bwwbwwwwwwwb',
      'bwwbwwbbbwwb',
      'bwwbwwbbbwwb',
      'bwwbwwbbbwwb',
      'bwwbwwbbbwwb',
      'bwwbwwbbbwwb',
      '.bbbbbbbbbb.',
    ],
    pal: { b: '#2d7fd3', w: C.cream },
  },
  instagram: {
    rows: [
      '..pppppppp..',
      '.p........p.',
      'p........p.p',
      'p...pppp...p',
      'p..p....p..p',
      'p..p....p..p',
      'p..p....p..p',
      'p..p....p..p',
      'p...pppp...p',
      'p..........p',
      '.p........p.',
      '..pppppppp..',
    ],
    pal: { p: C.pink },
  },
  email: {
    rows: [
      '............',
      'yyyyyyyyyyyy',
      'yy........yy',
      'y.y......y.y',
      'y..y....y..y',
      'y...y..y...y',
      'y....yy....y',
      'y..........y',
      'y..........y',
      'yyyyyyyyyyyy',
      '............',
      '............',
    ],
    pal: { y: C.yellow },
  },
};

// Series emblems for the dialogue box portrait frame.
export const EMBLEMS = {
  bleach: {
    // Crossed katana over a crescent: Soul Reaper energy.
    rows: [
      '..........gg',
      '.........ggg',
      '........ggg.',
      '.......ggg..',
      '......ggg...',
      '.....ggg....',
      '....ggg.....',
      '.o.ggg......',
      '..ooo.......',
      '..koo.......',
      '.kk.o.......',
      'kk..........',
    ],
    pal: { g: C.silver, o: C.orange, k: C.cream },
  },
  erased: {
    // Pocket clock: Revival sends Satoru back in time.
    rows: [
      '....yyyy....',
      '..yy....yy..',
      '.y...c....y.',
      '.y...c....y.',
      'y....c.....y',
      'y....c.....y',
      'y....cccc..y',
      'y..........y',
      '.y........y.',
      '.y........y.',
      '..yy....yy..',
      '....yyyy....',
    ],
    pal: { y: C.yellow, c: C.cream },
  },
  another: {
    // An eye that is watching class 3-3.
    rows: [
      '............',
      '............',
      '....wwww....',
      '..ww....ww..',
      '.w..tttt..w.',
      'w..tt..tt..w',
      'w..tt..tt..w',
      '.w..tttt..w.',
      '..ww....ww..',
      '....wwww....',
      '............',
      '............',
    ],
    pal: { w: C.cream, t: '#3fd0c9' },
  },
};
