// HOLLOW RUSH: a retro rooftop runner through Karakura Town at night.
import { setupCanvas, input, bindTouchButtons, text, textWidth, panel, rand, irand, chance, clamp, overlap, VW, VH } from './engine.js';
import { initAudio, resumeAudio, sfx, startMusic, stopMusic, toggleMute, isMuted } from './audio.js';
import { loadArt } from './art.js';
import { AX, AY } from '/scripts/lib/ichigo.js';

const canvas = document.getElementById('screen');
const ctx = setupCanvas(canvas);
const art = loadArt();
bindTouchButtons(document);
const touch = matchMedia('(pointer: coarse)').matches;

const STEP = 1 / 60;
const PX = 86; // player's screen x
const JUMP_V = -396;
const SHUNPO_V = -360;
const G_HELD = 672;
const G = 1380;
const MAX_FALL = 576;
const BANKAI_TIME = 8;

let best = 0;
try {
  best = Number(localStorage.getItem('hollowrush.best')) || 0;
} catch {}

// ── World state ──────────────────────────────────────────────────────────────
let mode = 'title'; // title | play | pause | dying | over
let t = 0;
let cam = 0;
let speed = 0;
let distance = 0;
let points = 0;
let combo = 0;
let comboT = 0;
let hitstop = 0;
let shake = 0;
let flash = 0;
let dyingT = 0;
let hintT = 0;
let banner = null;
let player;
let buildings;
let platforms;
let enemies;
let orbs;
let ceros;
let waves;
let particles;
let popups;
let ghosts;

const score = () => Math.floor(distance) + points;
const difficulty = () => clamp(distance / 2500, 0, 1);

function resetWorld(title = false) {
  cam = 0;
  distance = 0;
  points = 0;
  combo = 0;
  comboT = 0;
  speed = title ? 72 : 132;
  buildings = [];
  platforms = [];
  enemies = [];
  orbs = [];
  ceros = [];
  waves = [];
  particles = [];
  popups = [];
  ghosts = [];
  player = {
    x: PX, y: 180, vy: 0, onGround: true, airJumps: 1, coyote: 0, buffer: 0,
    hp: 3, invuln: 0, hurtT: 0, action: null, actionT: 0, hitId: 0, waveFired: false,
    reiatsu: 0, bankai: 0, getsugaCd: 0, shunpoT: 0, runPhase: 0, ghostT: 0,
  };
  newBuilding(-48, 180, title ? 480 : 624, true);
  extendWorld(title);
}

function newBuilding(x, roof, w, empty = false) {
  const cols = Math.floor((w - 8) / 9);
  const rows = Math.ceil((VH - roof) / 11);
  const b = {
    x, w, roof,
    facade: ['#0f1430', '#141a3a', '#1a1433'][irand(0, 2)],
    windows: Array.from({ length: cols * rows }, () => (chance(0.18) ? 1 : chance(0.07) ? 2 : 0)),
    cols,
    props: [],
  };
  if (w > 120 && chance(0.5)) b.props.push({ type: 'tank', x: Math.floor(rand(20, w - 40)) });
  if (chance(0.5)) b.props.push({ type: 'ac', x: Math.floor(rand(8, w - 30)) });
  if (chance(0.35)) b.props.push({ type: 'antenna', x: Math.floor(rand(8, w - 10)) });
  buildings.push(b);
  if (empty) orbLine(b.x + 216, b.roof - 20, 5);
  else populate(b);
  return b;
}

function extendWorld(title = false) {
  let last = buildings[buildings.length - 1];
  while (last.x + last.w < cam + VW + 240) {
    if (title) {
      last = newBuilding(last.x + last.w, 180, Math.floor(rand(108, 240)), true);
      continue;
    }
    const d = difficulty();
    const gap = Math.round(rand(36, 70) + speed * 0.18 + d * 22);
    const roof = Math.round(clamp(last.roof + rand(-40, 26), 125, 190));
    const w = Math.round(rand(180, 384) - d * 60);
    const prev = last;
    last = newBuilding(prev.x + prev.w + gap, roof, w);
    if (chance(0.55)) orbArc(prev.x + prev.w - 6, prev.roof);
  }
}

function orbLine(x, y, n) {
  for (let i = 0; i < n; i++) orbs.push({ type: 'soul', x: x + i * 16, y, t: rand(0, 1) });
}

// Soul orbs along the arc of a full jump, which also teaches the jump timing.
function orbArc(x0, y0) {
  const g = 912;
  for (let i = 1; i <= 5; i++) {
    const tt = i * 0.13;
    orbs.push({ type: 'soul', x: x0 + speed * tt + 12, y: y0 - 20 + JUMP_V * tt + 0.5 * g * tt * tt, t: rand(0, 1) });
  }
}

function populate(b) {
  const d = difficulty();
  const n = Math.floor(rand(0, 1.3 + d * 2.2));
  for (let i = 0; i < n; i++) spawnEnemy('grunt', rand(b.x + 72, b.x + b.w - 28), b.roof, b);
  if (chance(0.22 + d * 0.3)) spawnEnemy('flyer', rand(b.x + 48, b.x + b.w), b.roof - rand(48, 82), b);
  if (distance > 350 && b.w > 240 && chance(0.14 + d * 0.26)) spawnEnemy('big', b.x + b.w - 40, b.roof, b);
  if (chance(0.55)) orbLine(Math.floor(rand(b.x + 24, b.x + Math.max(36, b.w - 108))), b.roof - 20, irand(3, 6));
  if (player.hp < 3 && chance(0.07)) orbs.push({ type: 'heart', x: b.x + b.w / 2, y: b.roof - 40, t: 0 });
  if (distance > 250 && player.bankai <= 0 && chance(0.045)) orbs.push({ type: 'bankai', x: b.x + b.w * 0.6, y: b.roof - 60, t: 0 });
}

const ENEMY = {
  grunt: { hp: 1, pts: 100, box: [-10, -18, 20, 17] },
  flyer: { hp: 1, pts: 150, box: [-7, -9, 14, 8] },
  big: { hp: 3, pts: 500, box: [-15, -26, 30, 25] },
};

function spawnEnemy(type, x, y, b) {
  enemies.push({ type, x, y, baseY: y, b, hp: ENEMY[type].hp, t: rand(0, 2), flash: 0, fireT: 1.8, hitBy: -1, dead: false });
}

const enemyBox = (e) => {
  const [ox, oy, w, h] = ENEMY[e.type].box;
  return { x: e.x + ox, y: e.y + oy, w, h };
};
const playerBox = () => ({ x: player.x - 7, y: player.y - 46, w: 14, h: 44 });
const slashBox = () => ({ x: player.x + 4, y: player.y - 46, w: player.bankai > 0 ? 46 : 40, h: 42 });

// ── Effects ──────────────────────────────────────────────────────────────────
function burst(x, y, n, colors, spread = 90, up = 60, g = 300, life = 0.5, size = 1) {
  for (let i = 0; i < n; i++) {
    particles.push({
      x, y, vx: rand(-spread, spread), vy: rand(-up - 40, up * 0.3), g,
      life: rand(life * 0.5, life), max: life, color: colors[irand(0, colors.length - 1)], size: chance(0.3) ? size + 1 : size,
    });
  }
}

function popup(x, y, str, color = '#fff1e8') {
  popups.push({ x, y, str, color, life: 0.8 });
}

function say(str, color = '#ffec27', time = 1.2) {
  banner = { str, color, life: time };
}

// ── Combat ───────────────────────────────────────────────────────────────────
function damage(e, n) {
  e.hp -= n;
  e.flash = 0.1;
  const bx = enemyBox(e);
  burst(bx.x + bx.w / 2, bx.y + bx.h / 2, 6, ['#fff1e8', '#ffec27'], 80, 40, 200, 0.25);
  if (e.hp <= 0) kill(e);
  else {
    sfx.hit();
    hitstop = 0.03;
  }
}

function kill(e) {
  e.dead = true;
  combo = comboT > 0 ? Math.min(combo + 1, 8) : 1;
  comboT = 2.5;
  const pts = ENEMY[e.type].pts * combo;
  points += pts;
  player.reiatsu = Math.min(100, player.reiatsu + 15);
  const bx = enemyBox(e);
  const cx = bx.x + bx.w / 2;
  const cy = bx.y + bx.h / 2;
  burst(cx, cy, e.type === 'big' ? 30 : 14, ['#fff1e8', '#c2c3c7'], 110, 90, 380, 0.7);
  burst(cx, cy, e.type === 'big' ? 20 : 10, ['#1b1b2b', '#3a3a5e', '#5f574f'], 60, 30, -40, 0.9, 2);
  burst(cx, cy, 5, ['#ff004d'], 70, 50, 300, 0.4);
  popup(cx, bx.y - 4, combo > 1 ? `${pts} X${combo}` : String(pts), combo > 1 ? '#ffec27' : '#fff1e8');
  sfx.kill();
  hitstop = e.type === 'big' ? 0.09 : 0.05;
  shake = e.type === 'big' ? 6 : 3;
}

function hurt() {
  const p = player;
  if (p.invuln > 0 || p.bankai > 0 || mode !== 'play') return;
  p.hp -= 1;
  p.invuln = 1.2;
  p.hurtT = 0.35;
  p.vy = -180;
  p.onGround = false;
  combo = 0;
  shake = 5;
  sfx.hurt();
  burst(p.x, p.y - 16, 10, ['#ff004d', '#fff1e8'], 90, 60, 300, 0.4);
  if (p.hp <= 0) die();
}

// Fell into a gap or hit a wall: lose a heart, then stand on a platform of spirit particles.
function rescue(reason) {
  const p = player;
  p.hp -= 1;
  sfx.hurt();
  shake = 5;
  combo = 0;
  if (p.hp <= 0) return die();
  const next = buildings.find((b) => b.x + b.w > p.x + 12) || buildings[buildings.length - 1];
  const x = p.x - 31;
  platforms.push({ x, roof: next.roof, w: Math.max(62, next.x - x + 10), life: 4 });
  p.y = next.roof;
  p.vy = 0;
  p.onGround = true;
  p.airJumps = 1;
  p.invuln = 1.6;
  burst(p.x, p.y - 10, 16, ['#29adff', '#9fe2ff', '#fff1e8'], 70, 70, 100, 0.8);
  say(reason, '#9fe2ff');
}

function die() {
  mode = 'dying';
  dyingT = 0;
  player.vy = -260;
  player.hurtT = 9;
  stopMusic();
  sfx.gameOver();
  shake = 8;
  const s = score();
  newRecord = s > best;
  if (newRecord) {
    best = s;
    try {
      localStorage.setItem('hollowrush.best', String(best));
    } catch {}
  }
}
let newRecord = false;

function startBankai() {
  player.bankai = BANKAI_TIME;
  player.reiatsu = 100;
  flash = 0.25;
  shake = 6;
  hitstop = 0.15;
  sfx.bankai();
  say('HOLLOW MASK!', '#ff004d', 1.5);
  burst(player.x, player.y - 16, 40, ['#ff004d', '#16162a', '#7e2553'], 140, 120, 0, 1);
}

// ── Update ───────────────────────────────────────────────────────────────────
// Buildings and reishi platforms share { x, w, roof }.
function onSurface(x, prevY, y, vy) {
  if (vy < 0) return null;
  for (const s of buildings.concat(platforms)) {
    if (x + 3 <= s.x || x - 3 >= s.x + s.w) continue;
    if (prevY <= s.roof + 0.5 && y >= s.roof) return s.roof;
  }
  return null;
}

function supported(x, y) {
  return buildings.concat(platforms).some((s) => x + 3 > s.x && x - 3 < s.x + s.w && Math.abs(s.roof - y) < 1);
}

function updatePlayer(dt) {
  const p = player;
  p.x = cam + PX;

  if (input.take('jump')) p.buffer = 0.12;
  p.buffer -= dt;
  p.coyote -= dt;
  if (p.buffer > 0) {
    if (p.onGround || p.coyote > 0) {
      p.vy = JUMP_V;
      p.onGround = false;
      p.coyote = 0;
      p.buffer = 0;
      p.airJumps = 1;
      sfx.jump();
      burst(p.x - 4, p.y, 5, ['#c2c3c7', '#5f574f'], 40, 10, 100, 0.3);
    } else if (p.airJumps > 0) {
      p.vy = SHUNPO_V;
      p.airJumps--;
      p.buffer = 0;
      p.shunpoT = 0.3;
      sfx.shunpo();
      burst(p.x, p.y - 4, 8, ['#29adff', '#fff1e8'], 60, 10, 0, 0.35);
    }
  }

  const g = p.vy < 0 && input.held('jump') ? G_HELD : G;
  p.vy = Math.min(MAX_FALL, p.vy + g * dt);
  const prevY = p.y;
  p.y += p.vy * dt;

  const land = onSurface(p.x, prevY, p.y, p.vy);
  if (land !== null) {
    if (!p.onGround && p.vy > 200) burst(p.x, land, 6, ['#c2c3c7', '#5f574f'], 50, 10, 120, 0.3);
    p.y = land;
    p.vy = 0;
    p.onGround = true;
    p.airJumps = 1;
  } else if (p.onGround && !supported(p.x, p.y)) {
    p.onGround = false;
    p.coyote = 0.08;
  } else if (p.onGround) {
    p.vy = 0;
  }

  for (const b of buildings) {
    if (b.roof < p.y - 4 && p.x + 6 >= b.x && p.x - 6 < b.x + 5) return rescue('REISHI STEP!');
  }
  if (p.y > VH + 36) return rescue('REISHI STEP!');

  // Presses made mid-swing stay queued and fire as soon as the swing ends.
  if (!p.action && input.take('slash')) {
    p.action = 'slash';
    p.actionT = 0;
    p.hitId++;
    sfx.slash();
  }
  if (!p.action && input.take('special')) {
    const ready = p.bankai > 0 ? p.getsugaCd <= 0 : p.reiatsu >= 100;
    if (ready) {
      p.action = 'getsuga';
      p.actionT = 0;
      p.hitId++;
      p.waveFired = false;
      if (p.bankai <= 0) p.reiatsu = 0;
      p.getsugaCd = 0.5;
      sfx.getsuga();
    } else {
      popup(p.x, p.y - 40, 'NEED REIATSU', '#83769c');
      sfx.select();
    }
  }
  if (p.action) {
    p.actionT += dt;
    if (p.action === 'getsuga') {
      if (p.actionT < 0.14) burst(p.x + 10, p.y - 24, 1, p.bankai > 0 ? ['#ff004d', '#fff1e8'] : ['#ff004d', '#16162a'], 30, 30, 0, 0.3);
      if (!p.waveFired && p.actionT >= 0.14) {
        p.waveFired = true;
        waves.push({ x: p.x + 17, y: p.y - 22, bankai: p.bankai > 0, id: Math.random() });
        shake = 3;
      }
    }
    if (p.actionT >= (p.action === 'slash' ? 0.3 : 0.42)) p.action = null;
  }
  const slashing = p.action === 'slash' && p.actionT > 0.04 && p.actionT < 0.2;

  p.invuln -= dt;
  p.hurtT -= dt;
  p.shunpoT -= dt;
  p.getsugaCd -= dt;
  if (p.bankai > 0) {
    p.bankai -= dt;
    if (chance(0.5)) burst(p.x - 6, p.y - rand(4, 28), 1, ['#ff004d', '#7e2553'], 20, 20, -60, 0.5);
    if (p.bankai <= 0) say('MASK SHATTERED', '#83769c', 1);
  }
  p.runPhase += (speed * dt) / 13;

  p.ghostT -= dt;
  if ((p.shunpoT > 0 || p.bankai > 0) && p.ghostT <= 0) {
    ghosts.push({ x: p.x, y: p.y, frame: heroFrame(), bankai: p.bankai > 0, life: 0.22 });
    p.ghostT = 0.035;
  }
  return slashing;
}

function updateWorld(dt) {
  const p = player;
  const slashing = updatePlayer(dt);
  if (mode !== 'play') return;

  const target = 132 + Math.min(168, distance * 0.084) + (p.bankai > 0 ? 48 : 0);
  speed += (target - speed) * Math.min(1, dt * 2);
  cam += speed * dt;
  distance += (speed * dt) / 12;
  comboT -= dt;
  extendWorld();

  const pb = playerBox();
  const sb = slashBox();

  for (const e of enemies) {
    if (e.dead) continue;
    e.t += dt;
    e.flash -= dt;
    if (e.type === 'grunt') e.x = Math.max(e.b.x + 14, e.x - 26 * dt);
    if (e.type === 'flyer') {
      e.x -= 54 * dt;
      e.y = e.baseY + Math.sin(e.t * 3.2) * 14;
    }
    if (e.type === 'big') {
      const sx = e.x - cam;
      if (sx < VW - 16 && sx > PX + 40) {
        e.fireT -= dt;
        if (e.fireT <= 0) {
          ceros.push({ x: e.x - 16, y: e.y - 19, t: 0 });
          sfx.cero();
          e.fireT = 2.4 - difficulty() * 0.8;
        }
      }
    }
    const eb = enemyBox(e);
    if (slashing && e.hitBy !== p.hitId && overlap(sb, eb)) {
      e.hitBy = p.hitId;
      damage(e, p.bankai > 0 ? 3 : 1);
      continue;
    }
    if (overlap(pb, eb)) {
      if (p.bankai > 0) {
        damage(e, 9);
      } else if (p.vy > 72 && p.y < eb.y + 12) {
        damage(e, 1);
        p.vy = -348;
        p.airJumps = 1;
        sfx.jump();
      } else hurt();
    }
  }

  for (const w of waves) {
    w.x += (speed + 312) * dt;
    const h = w.bankai ? 40 : 32;
    const wb = { x: w.x - 2, y: w.y - h / 2, w: 16, h };
    for (const e of enemies) if (!e.dead && e.hitBy !== w.id && overlap(wb, enemyBox(e))) (e.hitBy = w.id), damage(e, 9);
    for (const c of ceros) if (!c.dead && overlap(wb, { x: c.x - 5, y: c.y - 5, w: 10, h: 10 })) (c.dead = true), burst(c.x, c.y, 8, ['#ff004d', '#ff77a8'], 60, 40, 0, 0.3);
    if (chance(0.8)) burst(w.x, w.y + rand(-h / 2, h / 2), 1, w.bankai ? ['#ff004d', '#fff1e8'] : ['#ff004d', '#16162a'], 10, 10, 0, 0.3);
  }

  for (const c of ceros) {
    if (c.dead) continue;
    c.t += dt;
    c.x -= 132 * dt;
    const cb = { x: c.x - 4, y: c.y - 4, w: 8, h: 8 };
    if (slashing && overlap(sb, cb)) {
      c.dead = true;
      points += 50;
      p.reiatsu = Math.min(100, p.reiatsu + 10);
      popup(c.x, c.y - 8, 'PARRY! 50', '#9fe2ff');
      sfx.parry();
      hitstop = 0.06;
      burst(c.x, c.y, 12, ['#ff004d', '#fff1e8'], 90, 60, 0, 0.35);
    } else if (overlap(pb, cb)) {
      c.dead = true;
      hurt();
    }
  }

  for (const o of orbs) {
    if (o.taken) continue;
    o.t += dt;
    if (Math.abs(o.x - p.x) < 10 && o.y > p.y - 44 && o.y < p.y + 4) {
      o.taken = true;
      if (o.type === 'soul') {
        points += 10;
        p.reiatsu = Math.min(100, p.reiatsu + 6);
        sfx.orb();
        burst(o.x, o.y, 4, ['#29adff', '#9fe2ff'], 40, 30, 0, 0.3);
      } else if (o.type === 'heart') {
        p.hp = Math.min(3, p.hp + 1);
        sfx.heart();
        popup(o.x, o.y - 8, '+1 HP', '#ff77a8');
      } else startBankai();
    }
  }

  for (const s of platforms) s.life -= dt;

  const gone = cam - 80;
  enemies = enemies.filter((e) => !e.dead && e.x > gone);
  orbs = orbs.filter((o) => !o.taken && o.x > gone);
  ceros = ceros.filter((c) => !c.dead && c.x > gone);
  waves = waves.filter((w) => w.x < cam + VW + 40);
  platforms = platforms.filter((s) => s.life > 0);
  buildings = buildings.filter((b) => b.x + b.w > gone);
}

function updateFx(dt) {
  for (const q of particles) {
    q.vy += q.g * dt;
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.life -= dt;
  }
  particles = particles.filter((q) => q.life > 0);
  for (const q of popups) {
    q.y -= 18 * dt;
    q.life -= dt;
  }
  popups = popups.filter((q) => q.life > 0);
  for (const q of ghosts) q.life -= dt;
  ghosts = ghosts.filter((q) => q.life > 0);
  if (banner) {
    banner.life -= dt;
    if (banner.life <= 0) banner = null;
  }
  shake = Math.max(0, shake - dt * 30);
  flash = Math.max(0, flash - dt);
}

function update(dt) {
  t += dt;
  if (mode === 'title') {
    cam += speed * dt;
    player.x = cam + PX;
    player.runPhase += (speed * dt) / 13;
    extendWorld(true);
    buildings = buildings.filter((b) => b.x + b.w > cam - 40);
    orbs = [];
    if (input.take('start') || input.take('jump')) startGame();
  } else if (mode === 'play') {
    hintT -= dt;
    updateWorld(dt);
  } else if (mode === 'dying') {
    dyingT += dt;
    player.vy += G * dt;
    player.y += player.vy * dt;
    if (dyingT > 1.3) showGameOver();
  } else if (mode === 'over') {
    if (!lbFormOpen && (input.take('start') || input.take('jump'))) startGame();
  }
  updateFx(dt);
}

function startGame() {
  initAudio();
  resumeAudio();
  sfx.start();
  resetWorld(false);
  mode = 'play';
  hintT = 6;
  input.clear();
  startMusic();
  lbStart();
}

// ── Rendering ────────────────────────────────────────────────────────────────
function heroFrame() {
  const p = player;
  if (p.hurtT > 0) return 'hurt';
  if (p.action) {
    const a = p.actionT;
    if (p.action === 'slash') return a < 0.05 ? 'slash0' : a < 0.16 ? 'slash1' : 'slash2';
    return a < 0.14 ? 'slash0' : a < 0.26 ? 'slash1' : 'slash2';
  }
  if (!p.onGround && mode !== 'title') return p.vy < 0 ? 'jump' : 'fall';
  return `run${Math.floor(p.runPhase) % 4}`;
}

function drawBuilding(b, ox) {
  const sx = Math.round(b.x - cam + ox);
  if (sx > VW || sx + b.w < 0) return;
  for (const pr of b.props) {
    const px = sx + pr.x;
    ctx.fillStyle = '#0b0e1f';
    if (pr.type === 'tank') {
      ctx.fillRect(px, b.roof - 22, 18, 13);
      ctx.fillRect(px + 2, b.roof - 9, 2, 9);
      ctx.fillRect(px + 14, b.roof - 9, 2, 9);
      ctx.fillStyle = '#2b3a6b';
      ctx.fillRect(px + 1, b.roof - 21, 16, 1);
    } else if (pr.type === 'ac') {
      ctx.fillRect(px, b.roof - 8, 14, 8);
      ctx.fillStyle = '#2b3a6b';
      ctx.fillRect(px + 3, b.roof - 6, 5, 4);
    } else {
      ctx.fillRect(px, b.roof - 26, 1, 26);
      ctx.fillRect(px - 3, b.roof - 20, 7, 1);
      if (Math.floor(t * 1.5 + pr.x) % 2 === 0) {
        ctx.fillStyle = '#ff004d';
        ctx.fillRect(px, b.roof - 27, 1, 1);
      }
    }
  }
  ctx.fillStyle = b.facade;
  ctx.fillRect(sx, b.roof, b.w, VH - b.roof);
  ctx.fillStyle = '#0b0e1f';
  ctx.fillRect(sx, b.roof + 3, 2, VH - b.roof);
  ctx.fillRect(sx + b.w - 2, b.roof + 3, 2, VH - b.roof);
  b.windows.forEach((w, i) => {
    const wx = sx + 6 + (i % b.cols) * 9;
    const wy = b.roof + 10 + Math.floor(i / b.cols) * 11;
    ctx.fillStyle = w === 1 ? '#ffec27' : w === 2 ? '#ffa300' : '#1d2b53';
    ctx.fillRect(wx, wy, 4, 5);
  });
  ctx.fillStyle = '#5f574f';
  ctx.fillRect(sx, b.roof + 1, b.w, 2);
  ctx.fillStyle = '#c2c3c7';
  ctx.fillRect(sx, b.roof, b.w, 1);
}

function drawHero(ox, oy) {
  const p = player;
  if (mode === 'play' && p.invuln > 0 && Math.floor(t * 20) % 2 === 0 && p.hurtT <= 0) return;
  const set = p.bankai > 0 ? art.bankai : art.hero;
  const f = heroFrame();
  const img = p.hurtT > 0 && Math.floor(t * 30) % 2 === 0 ? art.heroFlash[f] : set[f];
  ctx.drawImage(img, Math.round(p.x - cam - AX + ox), Math.round(p.y - AY + 1 + oy));
  if (p.action === 'slash' && p.actionT > 0.04 && p.actionT < 0.2) {
    const sx = Math.round(p.x - cam + ox);
    const sy = Math.round(p.y + oy);
    ctx.fillStyle = p.bankai > 0 ? '#ff004d' : '#fff1e8';
    const k = (p.actionT - 0.04) / 0.16;
    for (let a = -1.2; a <= 1.1; a += 0.05) {
      if (a > -1.2 + k * 2.3) break;
      const r = 38;
      ctx.fillRect(sx + 8 + Math.round(Math.cos(a) * r), sy - 24 + Math.round(Math.sin(a) * r * 0.7), 2, 2);
    }
  }
}

function drawHud() {
  const p = player;
  for (let i = 0; i < 3; i++) {
    if (i < p.hp) ctx.drawImage(art.heart, 4 + i * 12, 4);
    else {
      ctx.globalAlpha = 0.25;
      ctx.drawImage(art.heart, 4 + i * 12, 4);
      ctx.globalAlpha = 1;
    }
  }
  const full = p.reiatsu >= 100;
  text(ctx, 'REIATSU', 5, 17, '#83769c');
  for (let i = 0; i < 20; i++) {
    const on = i < Math.floor(p.reiatsu / 5);
    ctx.fillStyle = on ? (full && Math.floor(t * 8) % 2 ? '#fff1e8' : '#29adff') : '#1d2b53';
    ctx.fillRect(4 + i * 3, 26, 2, 4);
  }
  if (full && p.bankai <= 0 && Math.floor(t * 3) % 2 === 0) text(ctx, touch ? 'GETSUGA READY!' : 'GETSUGA READY! [C]', 4, 33, '#9fe2ff');
  if (p.bankai > 0) {
    text(ctx, 'MASK', 5, 34, '#ff004d');
    ctx.fillStyle = '#7e2553';
    ctx.fillRect(32, 35, 40, 4);
    ctx.fillStyle = '#ff004d';
    ctx.fillRect(32, 35, Math.ceil((40 * p.bankai) / BANKAI_TIME), 4);
  }
  text(ctx, String(score()).padStart(6, '0'), VW / 2, 4, '#fff1e8', { scale: 2, align: 'center', shadow: '#000' });
  text(ctx, `HI ${String(Math.max(best, score())).padStart(6, '0')}`, VW - 4, 4, '#ff77a8', { align: 'right' });
  text(ctx, `${Math.floor(distance)}M`, VW - 4, 13, '#83769c', { align: 'right' });
  if (combo > 1 && comboT > 0) text(ctx, `COMBO X${combo}`, VW / 2, 20, '#ffec27', { align: 'center', shadow: '#7e2553' });
  if (isMuted()) text(ctx, 'MUTED', VW - 4, VH - 10, '#5f574f', { align: 'right' });
}

function drawTitle() {
  const lw = textWidth('HOLLOW RUSH', 3);
  const lx = Math.round(VW / 2 - lw / 2);
  text(ctx, 'HOLLOW RUSH', lx + 3, 25, '#7e2553', { scale: 3 });
  text(ctx, 'HOLLOW RUSH', lx, 22, '#ffec27', { scale: 3 });
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 34, VW, 10);
  ctx.clip();
  text(ctx, 'HOLLOW RUSH', lx, 22, '#ffa300', { scale: 3 });
  ctx.restore();
  text(ctx, 'A KARAKURA TOWN NIGHT RUN', VW / 2, 49, '#ff77a8', { align: 'center' });
  if (Math.floor(t * 2) % 2 === 0) text(ctx, touch ? 'TAP TO START' : 'PRESS SPACE TO START', VW / 2, 65, '#ffec27', { align: 'center', shadow: '#000' });
  drawBoard(VW / 2 - 60, 80, 120);
  text(ctx, `BEST ${String(best).padStart(6, '0')}`, VW - 4, 4, '#ff77a8', { align: 'right' });
  ctx.fillStyle = 'rgba(11,14,31,0.85)';
  ctx.fillRect(0, VH - 12, VW, 12);
  if (!touch) text(ctx, 'SPACE JUMP  X SLASH  C GETSUGA  P PAUSE  M MUTE', VW / 2, VH - 9, '#83769c', { align: 'center' });
  else text(ctx, 'JUMP (X2 SHUNPO) · SLASH · GETSUGA', VW / 2, VH - 9, '#83769c', { align: 'center' });
}

function drawBoard(x, y, w) {
  const rows = LB.enabled ? LB.scores.slice(0, 5) : [];
  if (!rows.length) return;
  const h = 14 + rows.length * 9;
  panel(ctx, x, y, w, h, '#0b0e1f', '#ffa300');
  text(ctx, 'HALL OF FAME', x + w / 2, y + 4, '#ffa300', { align: 'center' });
  rows.forEach((r, i) => {
    const yy = y + 14 + i * 9;
    text(ctx, `${i + 1}. ${r.name}`, x + 8, yy, i === 0 ? '#ffec27' : '#fff1e8');
    text(ctx, String(r.score).padStart(6, '0'), x + w - 8, yy, '#c2c3c7', { align: 'right' });
  });
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(11,14,31,0.6)';
  ctx.fillRect(0, 0, VW, VH);
  panel(ctx, VW / 2 - 90, 20, 180, 66);
  text(ctx, 'GAME OVER', VW / 2, 28, '#ff004d', { scale: 2, align: 'center', shadow: '#7e2553' });
  text(ctx, `SCORE ${String(score()).padStart(6, '0')}`, VW / 2, 48, '#fff1e8', { align: 'center' });
  text(ctx, `BEST  ${String(best).padStart(6, '0')}`, VW / 2, 58, '#ff77a8', { align: 'center' });
  if (newRecord && Math.floor(t * 3) % 2 === 0) text(ctx, 'NEW RECORD!', VW / 2, 70, '#ffec27', { align: 'center' });
  drawBoard(VW / 2 - 60, 96, 120);
  if (!lbFormOpen && Math.floor(t * 2) % 2 === 0) text(ctx, touch ? 'TAP TO RETRY' : 'PRESS SPACE TO RETRY', VW / 2, VH - 14, '#ffec27', { align: 'center', shadow: '#000' });
}

function render() {
  const ox = Math.round(rand(-shake, shake));
  const oy = Math.round(rand(-shake, shake));
  ctx.drawImage(art.sky, 0, 0);
  ctx.drawImage(art.moon, VW - 52, 26);
  const far = Math.floor(cam * 0.1) % 640;
  ctx.drawImage(art.far, -far, 0);
  ctx.drawImage(art.far, 640 - far, 0);
  const mid = Math.floor(cam * 0.3) % 640;
  ctx.drawImage(art.mid, -mid, 14);
  ctx.drawImage(art.mid, 640 - mid, 14);

  for (const b of buildings) drawBuilding(b, ox);
  for (const s of platforms) {
    if (s.life < 1 && Math.floor(t * 12) % 2 === 0) continue;
    const sx = Math.round(s.x - cam + ox);
    ctx.fillStyle = '#29adff';
    ctx.fillRect(sx, s.roof, s.w, 2);
    ctx.fillStyle = '#9fe2ff';
    for (let i = Math.floor(t * 20) % 4; i < s.w; i += 4) ctx.fillRect(sx + i, s.roof, 1, 1);
    ctx.fillStyle = 'rgba(41,173,255,0.25)';
    ctx.fillRect(sx, s.roof + 2, s.w, 3);
  }
  for (const o of orbs) {
    const sx = Math.round(o.x - cam + ox);
    const bob = Math.round(Math.sin((t + o.t) * 5) * 2);
    const img = o.type === 'soul' ? art.soul[Math.floor((t + o.t) * 6) % 2] : o.type === 'heart' ? art.heart : art.bankaiOrb;
    if (o.type === 'bankai' && Math.floor(t * 8) % 2) {
      ctx.fillStyle = 'rgba(255,0,77,0.35)';
      ctx.fillRect(sx - 9, o.y - 9 + bob + oy, 18, 18);
    }
    ctx.drawImage(img, sx - (img.width >> 1), Math.round(o.y - (img.height >> 1) + bob + oy));
  }
  for (const e of enemies) {
    const sx = Math.round(e.x - cam + ox);
    const f = Math.floor(e.t * (e.type === 'flyer' ? 8 : 5)) % 2;
    let img;
    if (e.type === 'big') img = (e.flash > 0 ? art.bigFlash : art.big)[e.fireT < 0.5 ? 1 : 0];
    else img = (e.flash > 0 ? art[`${e.type}Flash`] : art[e.type])[f];
    ctx.drawImage(img, sx - (img.width >> 1), Math.round(e.y - img.height + 1 + oy));
    if (e.type === 'big' && e.fireT < 0.5 && Math.floor(t * 20) % 2) burst(e.x - 16, e.y - 19, 1, ['#ff004d', '#ff77a8'], 20, 20, 0, 0.2);
  }
  for (const c of ceros) {
    const sx = Math.round(c.x - cam + ox);
    ctx.drawImage(art.cero, sx - 5, Math.round(c.y - 5 + oy));
  }
  for (const w of waves) {
    const img = w.bankai ? art.waveBankai : art.wave;
    ctx.drawImage(img, Math.round(w.x - cam + ox), Math.round(w.y - img.height / 2 + oy));
  }
  for (const g of ghosts) {
    ctx.globalAlpha = (g.life / 0.22) * 0.45;
    const img = (g.bankai ? art.bankaiGhost : art.heroGhost)[g.frame];
    ctx.drawImage(img, Math.round(g.x - cam - AX + ox), Math.round(g.y - AY + 1 + oy));
  }
  ctx.globalAlpha = 1;
  drawHero(ox, oy);
  for (const q of particles) {
    ctx.globalAlpha = Math.min(1, q.life / (q.max * 0.5));
    ctx.fillStyle = q.color;
    ctx.fillRect(Math.round(q.x - cam + ox), Math.round(q.y + oy), q.size, q.size);
  }
  ctx.globalAlpha = 1;
  for (const q of popups) text(ctx, q.str, Math.round(q.x - cam), Math.round(q.y), q.color, { align: 'center', shadow: '#000' });

  if (mode === 'title') drawTitle();
  else {
    drawHud();
    if (banner) text(ctx, banner.str, VW / 2, 52, banner.color, { scale: 2, align: 'center', shadow: '#000' });
    if (mode === 'play' && hintT > 0 && Math.floor(t * 2) % 2 === 0) {
      text(ctx, touch ? 'TAP JUMP TWICE FOR SHUNPO' : 'SPACE: JUMP, TWICE FOR SHUNPO', VW / 2, 72, '#fff1e8', { align: 'center', shadow: '#000' });
      text(ctx, touch ? 'SLASH HOLLOWS, FILL REIATSU, GETSUGA!' : 'X: SLASH HOLLOWS  C: GETSUGA TENSHO', VW / 2, 82, '#9fe2ff', { align: 'center', shadow: '#000' });
    }
    if (mode === 'pause') {
      ctx.fillStyle = 'rgba(11,14,31,0.7)';
      ctx.fillRect(0, 0, VW, VH);
      text(ctx, 'PAUSED', VW / 2, 88, '#ffec27', { scale: 2, align: 'center' });
      text(ctx, touch ? 'TAP PAUSE TO RESUME' : 'PRESS P TO RESUME', VW / 2, 110, '#fff1e8', { align: 'center' });
    }
    if (mode === 'over') drawGameOver();
  }
  if (flash > 0) {
    ctx.fillStyle = `rgba(255,241,232,${Math.min(1, flash * 4)})`;
    ctx.fillRect(0, 0, VW, VH);
  }
}

// ── Leaderboard (optional: needs Upstash Redis on Vercel) ───────────────────
const LB = { enabled: false, scores: [], token: null };
let lbFormOpen = false;
const form = document.getElementById('initials');
const nameInput = document.getElementById('initials-name');

async function lbLoad() {
  try {
    const r = await fetch('/api/scores');
    const j = await r.json();
    LB.enabled = Boolean(j.enabled);
    LB.scores = j.scores || [];
  } catch {}
}

async function lbStart() {
  LB.token = null;
  if (!LB.enabled) return;
  try {
    const r = await fetch('/api/scores?start=1');
    LB.token = (await r.json()).token || null;
  } catch {}
}

function showGameOver() {
  mode = 'over';
  input.clear();
  const s = score();
  const qualifies = LB.enabled && LB.token && s > 0 && (LB.scores.length < 10 || s > LB.scores[LB.scores.length - 1].score);
  if (qualifies) {
    lbFormOpen = true;
    input.enabled = false;
    form.hidden = false;
    nameInput.value = localStorage.getItem('hollowrush.name') || '';
    setTimeout(() => nameInput.focus(), 50);
  }
}

function closeForm() {
  lbFormOpen = false;
  form.hidden = true;
  input.enabled = true;
  input.clear();
  canvas.focus();
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
  if (name.length < 1) return;
  try {
    localStorage.setItem('hollowrush.name', name);
  } catch {}
  closeForm();
  try {
    const r = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score: score(), token: LB.token }),
    });
    const j = await r.json();
    if (j.scores) LB.scores = j.scores;
    say(j.ok ? 'SCORE SAVED!' : 'NOT SAVED', j.ok ? '#00e436' : '#ff004d', 1.5);
  } catch {}
});
document.getElementById('initials-skip')?.addEventListener('click', closeForm);

// ── Loop & meta controls ─────────────────────────────────────────────────────
canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  initAudio();
  resumeAudio();
  const a = mode === 'play' ? 'jump' : 'start';
  input.press(a);
  setTimeout(() => input.release(a), 80);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && mode === 'play') mode = 'pause';
});

let last = performance.now();
let acc = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (input.take('mute')) {
    initAudio();
    toggleMute();
  }
  if (input.take('pause')) {
    if (mode === 'play') mode = 'pause';
    else if (mode === 'pause') {
      mode = 'play';
      input.clear();
    }
  }
  if (mode === 'pause') {
    input.clear();
  } else if (hitstop > 0) {
    hitstop -= dt;
  } else {
    acc += dt;
    while (acc >= STEP) {
      update(STEP);
      acc -= STEP;
    }
  }
  render();
  requestAnimationFrame(frame);
}

// ?debug exposes state for automated play-testing.
if (new URLSearchParams(location.search).has('debug')) {
  window.__hr = {
    get player() { return player; },
    get buildings() { return buildings; },
    get enemies() { return enemies; },
    get cam() { return cam; },
    get mode() { return mode; },
    get score() { return score(); },
    startBankai,
    spawn(type) {
      const x = cam + 250;
      const b = buildings.find((bb) => x >= bb.x && x <= bb.x + bb.w) || buildings[buildings.length - 1];
      spawnEnemy(type, Math.max(x, b.x + 20), type === 'flyer' ? b.roof - 50 : b.roof, b);
    },
  };
}

resetWorld(true);
lbLoad();
requestAnimationFrame(frame);
