// Hollow + pickup sprites shared by the game (/play) and the README play card.
// Enemies face left (towards the hero). 'x' is added later as an outline.

export const HOLLOW_PAL = { x: '#000000', k: '#1b1b2b', K: '#3a3a5e', w: '#fff1e8', W: '#c2c3c7', r: '#ff004d', m: '#7e2553', c: '#fff1e8', g: '#ff77a8' };

const GRUNT_TOP = [
  '......wwwwwww.........',
  '....wwwwwwwwwww.......',
  '...wwrrwwwwmwwww......',
  '...wwrrwwwwmwwwwk.....',
  '...wwwwwwwwwwwwkkk....',
  '....wWkWkWkWwwkkkkk...',
  '.....wwwwwwwwkkkkkkk..',
  '.....kkkkkkkkkkkkkkkk.',
  '....kkkkkkkkkkkkkkkkkk',
  '...kkkkKkk...kkkkKkkkk',
  '..ckkkKkkk...kkkkkkkk.',
  '.cc.kkkkkkk.kkkkkkkk..',
  '.c..kkkkkkkkkkkkkkk...',
  '....kkkkkkkkkkkkkk....',
];

export const GRUNT = [
  [...GRUNT_TOP, '....kkk..kkkkk..kkk...', '...kkk...kkk....kkk...', '...kk....kk......kk...', '..ccc...ccc......ccc..'],
  [...GRUNT_TOP, '....kkk..kkkkk..kkk...', '....kkk..kkk....kk....', '....kkk..kk.....kkk...', '....ccc.ccc......ccc..'],
];

export const FLYER = [
  ['kk..........kk', 'kkk........kkk', '.kkk.wwww.kkk.', '..kkwrwwrwkk..', '...kwwwwwwk...', '...kwWkWkwk...', '....kkkkkk....', '.....k..k.....'],
  ['..............', '..............', '.....wwww.....', '....wrwwrw....', '..kkwwwwwwkk..', '.kkkwWkWkwkkk.', 'kkk.kkkkkk.kkk', 'kk...k..k...kk'],
];

// Big Hollow; `charging` lights the mouth before it fires a cero.
export const bigHollow = (charging) => [
  '..........wwwwwwwwww..............',
  '........wwwwwwwwwwwwww............',
  '.......wwwwwwwwwwwwwwwww..........',
  '......wwrrrwwwwwwwmmwwwww.........',
  '.....wwwrrrwwwwwwwmmwwwwwk........',
  '....wwwwwwwwwwwwwwwwwwwwkkk.......',
  '...wwwwwwwwwwwwwwwwwwwwkkkkk......',
  charging ? '..wwwgggggggggwwwwwwwkkkkkkkk.....' : '..wwwWkWkWkWkWwwwwwwwkkkkkkkk.....',
  '..wwwwwwwwwwwwwwwwwwkkkkkkkkkk....',
  '...wwwwwwwwwwwwwwwwkkkkkkkkkkkk...',
  '....kkkkkkkkkkkkkkkkkkkkkkkkkkkk..',
  '...kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.',
  '..kkkkKkkkkkkk.....kkkkkkkkkkkkkkk',
  '..kkkKkkkkkkk.......kkkkkkKkkkkkkk',
  '.kkkKkkkkkkkk.......kkkkkkkKkkkkkk',
  '.kkkkkkkkkkkkk.....kkkkkkkkkkkkkkk',
  '.kkk.kkkkkkkkkkkkkkkkkkkkkkkkk.kkk',
  '.kkk..kkkkkkkkkkkkkkkkkkkkkkkk..kk',
  'kkkk...kkkkkkkkkkkkkkkkkkkkkkk...kk',
  'kkk.....kkkkkkkkkkkkkkkkkkkkk....kk',
  'kkk.....kkkkkkkkkkkkkkkkkkkkk....kk',
  'cccc....kkkkkk.........kkkkkk....cc',
  'ccc.....kkkkk...........kkkkk....cc',
  '........kkkkk...........kkkkk......',
  '.......kkkkkk...........kkkkkk.....',
  '......ccccccc...........ccccccc....',
];

export const CERO = ['...rrrr...', '..rggggr..', '.rgwwwwgr.', 'rgwwwwwwgr', 'rgwwwwwwgr', 'rgwwwwwwgr', 'rgwwwwwwgr', '.rgwwwwgr.', '..rggggr..', '...rrrr...'];
export const CERO_PAL = { r: '#ff004d', g: '#ff77a8', w: '#fff1e8' };

export const SOUL = [
  ['...b...', '..bb...', '..bBb..', '.bBBb..', '.bBwBb.', 'bBwwwBb', 'bBwwwBb', '.bBwBb.', '..bbb..'],
  ['....b..', '...bb..', '..bBb..', '..bBBb.', '.bBwBb.', 'bBwwwBb', 'bBwwwBb', '.bBwBb.', '..bbb..'],
];
export const SOUL_PAL = { b: '#29adff', B: '#9fe2ff', w: '#fff1e8' };

export const HEART = ['.rr...rr.', 'rrrr.rrrr', 'rwrrrrrrr', 'rrrrrrrrr', '.rrrrrrr.', '..rrrrr..', '...rrr...', '....r....'];
export const HEART_PAL = { r: '#ff004d', w: '#fff1e8', x: '#000000' };

// Power-up pickup: a small Hollow mask.
export const BANKAI_ORB = ['...MMMMM...', '.MMMMMMMMM.', '.MrMMMMMMM.', 'MMrxxMMxxMM', 'MMrxxMMxxMM', 'MMrrMMMMMMM', '.MMrMMMMMM.', '.MZMZMZMZM.', '..ZZZZZZZ..'];
export const BANKAI_PAL = { M: '#fff4ea', Z: '#c8c4d0', r: '#ff004d', x: '#000000' };

// Getsuga Tensho: the band between two offset ellipses, bright on the leading edge.
export function crescent(h, rim, core, shade) {
  const rows = [];
  const ry = h / 2;
  for (let y = 0; y < h; y++) {
    const dy = (y + 0.5 - ry) / ry;
    const outer = Math.round(17 * Math.sqrt(Math.max(0, 1 - dy * dy)));
    const inner = Math.round(12 * Math.sqrt(Math.max(0, 1 - (dy * 1.12) ** 2))) - 7;
    let row = '';
    for (let x = 0; x < 19; x++) {
      if (x <= outer && x > inner) row += x >= outer - 1 ? 'w' : x <= inner + 1 ? 'B' : 'b';
      else row += '.';
    }
    rows.push(row);
  }
  return { rows, pal: { w: rim, b: core, B: shade } };
}
