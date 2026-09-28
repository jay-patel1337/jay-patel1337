// Bakes every sprite and background layer for Hollow Rush.
// Hero and Hollow art live in /scripts/lib so the README can reuse them.
import { buildFrames, PALETTE, BANKAI_PALETTE } from '/scripts/lib/ichigo.js';
import { Grid } from '/scripts/lib/pixel-canvas.js';
import { HOLLOW_PAL, GRUNT, FLYER, bigHollow, CERO, CERO_PAL, SOUL, SOUL_PAL, HEART, HEART_PAL, BANKAI_ORB, BANKAI_PAL, crescent } from '/scripts/lib/hollows.js';
import { bake, VW, VH, rand, chance } from './engine.js';

const outlined = (rows, color = 'x') => {
  const w = Math.max(...rows.map((r) => r.length));
  const g = new Grid(w + 2, rows.length + 2);
  g.stamp(rows, 1, 1);
  return g.outline(color).rows();
};

function moon() {
  const r = 15;
  const rows = [];
  for (let y = 0; y < 2 * r; y++) {
    let row = '';
    for (let x = 0; x < 2 * r; x++) {
      const d = Math.hypot(x - r + 0.5, y - r + 0.5);
      const d2 = Math.hypot(x - r + 7.5, y - r - 2.5);
      row += d < r && d2 >= r - 2 ? (d > r - 2 ? 'W' : 'w') : '.';
    }
    rows.push(row);
  }
  return bake(rows, { w: '#fff1e8', W: '#ffccaa' });
}

// A repeating strip of skyline silhouettes for a parallax layer.
function skyline(width, minH, maxH, body, lit) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = VH;
  const g = c.getContext('2d');
  let x = 0;
  while (x < width) {
    const w = Math.floor(rand(18, 46));
    const h = Math.floor(rand(minH, maxH));
    const top = VH - h;
    g.fillStyle = body;
    g.fillRect(x, top, Math.min(w, width - x), h);
    if (chance(0.3)) g.fillRect(x + Math.floor(w / 2), top - Math.floor(rand(4, 12)), 1, 12);
    g.fillStyle = lit;
    for (let wy = top + 4; wy < VH - 4; wy += 6)
      for (let wx = x + 3; wx < x + w - 3; wx += 5) if (chance(0.12)) g.fillRect(wx, wy, 2, 2);
    x += w + Math.floor(rand(0, 4));
  }
  return c;
}

function sky() {
  const c = document.createElement('canvas');
  c.width = VW;
  c.height = VH;
  const g = c.getContext('2d');
  const bands = [[0, '#0b0e1f'], [72, '#141c3e'], [120, '#1d2b53'], [168, '#3a2250'], [198, '#7e2553']];
  bands.forEach(([y, col], i) => {
    const next = bands[i + 1]?.[0] ?? VH;
    g.fillStyle = col;
    g.fillRect(0, y, VW, next - y);
    if (i > 0) {
      // two rows of checkerboard dither into the band above
      for (let x = 0; x < VW; x += 2) {
        g.fillRect(x, y - 1, 1, 1);
        if (x % 4 === 0) g.fillRect(x + 1, y - 2, 1, 1);
      }
    }
  });
  for (let i = 0; i < 70; i++) {
    g.fillStyle = chance(0.25) ? '#fff1e8' : chance(0.5) ? '#c2c3c7' : '#83769c';
    g.fillRect(Math.floor(rand(0, VW)), Math.floor(rand(0, 144)), 1, 1);
  }
  return c;
}

export function loadArt() {
  const hero = buildFrames(false);
  const bankai = buildFrames(true);
  const each = (frames, fn) => Object.fromEntries(Object.entries(frames).map(([k, rows]) => [k, fn(rows)]));
  const pair = (list, pal) => ({ normal: list.map((r) => bake(outlined(r), pal)), flash: list.map((r) => bake(outlined(r), {}, '#fff1e8')) });

  const grunt = pair(GRUNT, HOLLOW_PAL);
  const flyer = pair(FLYER, HOLLOW_PAL);
  const big = pair([bigHollow(false), bigHollow(true)], HOLLOW_PAL);
  const waveN = crescent(36, '#fff1e8', '#29adff', '#1d62c0');
  const waveB = crescent(44, '#ff004d', '#16162a', '#7e2553');

  return {
    hero: each(hero, (r) => bake(r, PALETTE)),
    bankai: each(bankai, (r) => bake(r, BANKAI_PALETTE)),
    heroFlash: each(hero, (r) => bake(r, {}, '#fff1e8')),
    heroGhost: each(hero, (r) => bake(r, {}, '#29adff')),
    bankaiGhost: each(bankai, (r) => bake(r, {}, '#ff004d')),
    grunt: grunt.normal,
    gruntFlash: grunt.flash,
    flyer: flyer.normal,
    flyerFlash: flyer.flash,
    big: big.normal,
    bigFlash: big.flash,
    cero: bake(CERO, CERO_PAL),
    soul: SOUL.map((rows) => bake(rows, SOUL_PAL)),
    heart: bake(outlined(HEART), HEART_PAL),
    bankaiOrb: bake(outlined(BANKAI_ORB), BANKAI_PAL),
    wave: bake(waveN.rows, waveN.pal),
    waveBankai: bake(waveB.rows, waveB.pal),
    moon: moon(),
    sky: sky(),
    far: skyline(640, 36, 84, '#141a38', '#2b3a6b'),
    mid: skyline(640, 48, 114, '#1f1a3d', '#6b4a2a'),
  };
}
