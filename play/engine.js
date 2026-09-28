// Canvas, input, sprite baking and pixel text for Hollow Rush.
import { glyph, normalize } from '/scripts/lib/pixel-font.js';

export const VW = 320;
export const VH = 180;

export function setupCanvas(canvas) {
  canvas.width = VW;
  canvas.height = VH;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const fit = () => {
    const availW = canvas.parentElement.clientWidth;
    const availH = window.innerHeight - (matchMedia('(pointer: coarse)').matches ? 150 : 90);
    let s = Math.min(availW / VW, availH / VH);
    if (s >= 2) s = Math.floor(s);
    canvas.style.width = `${Math.floor(VW * s)}px`;
    canvas.style.height = `${Math.floor(VH * s)}px`;
  };
  addEventListener('resize', fit);
  fit();
  return ctx;
}

// ── Input ────────────────────────────────────────────────────────────────────
const KEYS = {
  Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', KeyZ: 'jump',
  KeyX: 'slash', KeyJ: 'slash',
  KeyC: 'special', KeyK: 'special',
  KeyP: 'pause', Escape: 'pause',
  KeyM: 'mute',
  Enter: 'start',
};

const held = new Set();
const pressed = new Set();

export const input = {
  held: (a) => held.has(a),
  // True once per press.
  take(a) {
    const hit = pressed.has(a);
    pressed.delete(a);
    return hit;
  },
  clear() {
    pressed.clear();
  },
  press(a) {
    if (!held.has(a)) pressed.add(a);
    held.add(a);
  },
  release(a) {
    held.delete(a);
  },
  enabled: true,
};

addEventListener('keydown', (e) => {
  if (!input.enabled) return;
  const a = KEYS[e.code];
  if (!a) return;
  e.preventDefault();
  if (!e.repeat) input.press(a);
});
addEventListener('keyup', (e) => {
  const a = KEYS[e.code];
  if (a) input.release(a);
});
addEventListener('blur', () => held.clear());

export function bindTouchButtons(root) {
  for (const el of root.querySelectorAll('[data-action]')) {
    const a = el.dataset.action;
    const down = (e) => {
      e.preventDefault();
      el.classList.add('on');
      input.press(a);
    };
    const up = (e) => {
      e.preventDefault();
      el.classList.remove('on');
      input.release(a);
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', up);
  }
}

// ── Sprites ──────────────────────────────────────────────────────────────────
function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Character-grid rows + palette → offscreen canvas. `solid` paints every pixel one colour (hit flash).
export function bake(rows, palette, solid = null) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  const img = g.createImageData(w, h);
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const col = ch === '.' ? null : solid || palette[ch];
      if (!col) return;
      const [r, gg, b] = rgb(col);
      const i = (y * w + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = gg;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    })
  );
  g.putImageData(img, 0, 0);
  return c;
}

// ── Pixel text ───────────────────────────────────────────────────────────────
const textCache = new Map();

function textCanvas(str, color, scale) {
  const key = `${str}|${color}|${scale}`;
  let c = textCache.get(key);
  if (c) return c;
  const chars = [...normalize(str)];
  c = document.createElement('canvas');
  c.width = Math.max(1, (chars.length * 6 - 1) * scale);
  c.height = 7 * scale;
  const g = c.getContext('2d');
  g.fillStyle = color;
  chars.forEach((ch, i) =>
    glyph(ch).forEach((row, y) =>
      [...row].forEach((p, x) => {
        if (p === '#') g.fillRect((i * 6 + x) * scale, y * scale, scale, scale);
      })
    )
  );
  textCache.set(key, c);
  return c;
}

export function textWidth(str, scale = 1) {
  return Math.max(0, ([...normalize(str)].length * 6 - 1) * scale);
}

export function text(ctx, str, x, y, color = '#fff1e8', { scale = 1, align = 'left', shadow = null } = {}) {
  const c = textCanvas(String(str), color, scale);
  const dx = Math.round(align === 'center' ? x - c.width / 2 : align === 'right' ? x - c.width : x);
  if (shadow) ctx.drawImage(textCanvas(String(str), shadow, scale), dx + scale, Math.round(y) + scale);
  ctx.drawImage(c, dx, Math.round(y));
}

// Notched pixel window.
export function panel(ctx, x, y, w, h, fill = '#0b0e1f', border = '#fff1e8') {
  ctx.fillStyle = '#000';
  ctx.fillRect(x + 1, y, w - 2, h);
  ctx.fillRect(x, y + 1, w, h - 2);
  ctx.fillStyle = border;
  ctx.fillRect(x + 2, y + 1, w - 4, h - 2);
  ctx.fillRect(x + 1, y + 2, w - 2, h - 4);
  ctx.fillStyle = fill;
  ctx.fillRect(x + 3, y + 2, w - 6, h - 4);
  ctx.fillRect(x + 2, y + 3, w - 4, h - 6);
}

export const rand = (a, b) => a + Math.random() * (b - a);
export const irand = (a, b) => Math.floor(rand(a, b + 1));
export const chance = (p) => Math.random() < p;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
