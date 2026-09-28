import { C, doc, text, box, bar, sprite, spriteSize, rng, pad, notched, notchedD, rect, textWidth } from './lib/svg.js';
import { textPath, wrap } from './lib/pixel-font.js';
import * as S from './lib/sprites.js';
import * as HW from './lib/hollows.js';
import { Grid } from './lib/pixel-canvas.js';

const W = 840;

function dashes(x, y, w, color, h = 2) {
  let d = '';
  for (let i = 0; i < w; i += 8) d += `M${x + i} ${y}h4v${h}h-4z`;
  return `<path d="${d}" fill="${color}"/>`;
}

// Cycle sprite frames with CSS: each frame is visible for 1/n of the loop.
function frames(list, pal, x, y, s, dur, name) {
  const n = list.length;
  const css = `.${name}{animation:${name} ${dur}s steps(1) infinite}@keyframes ${name}{0%{opacity:1}${(100 / n).toFixed(2)}%,100%{opacity:0}}`;
  const body = list
    .map((rows, i) => sprite(rows, pal, x, y, s, ` class="${name}" style="${i ? 'opacity:0;' : ''}animation-delay:${((dur / n) * i).toFixed(3)}s"`))
    .join('');
  return { css, body };
}

// Title row used inside most panels: yellow label left, optional note right, dashed rule under.
function panelHeader(label, note) {
  let out = text(label, 24, 22, { fill: C.yellow });
  if (note) out += text(note, W - 24, 22, { fill: C.lavender, align: 'right' });
  return out + dashes(24, 44, W - 48, C.slate);
}

// ── 1. Title screen ──────────────────────────────────────────────────────────
export function titleScreen(cfg) {
  const H = 320;
  const r = rng(1337);

  let far = '';
  let near = '';
  let twinkles = '';
  for (let i = 0; i < 64; i++) {
    const x = Math.floor(r() * 210) * 4;
    const y = 12 + Math.floor(r() * 54) * 4;
    const isNear = r() < 0.3;
    const s = isNear ? 4 : 2;
    const d = `M${x} ${y}h${s}v${s}h-${s}zM${x + W} ${y}h${s}v${s}h-${s}z`;
    if (isNear && r() < 0.5) twinkles += `<path class="tw" style="animation-delay:-${(r() * 2).toFixed(2)}s" d="${d}" fill="${C.cream}"/>`;
    else if (isNear) near += d;
    else far += d;
  }

  const logo = cfg.name.toUpperCase();
  const logoW = textWidth(logo, 8);
  const lx = Math.round(W / 2 - logoW / 2);
  const ly = 44;

  let ground = '';
  for (let x = 0; x < W + 64; x += 32) {
    ground += rect(x, 264, 32, 8, C.green) + rect(x + 4, 264, 4, 4, C.forest) + rect(x + 20, 268, 8, 4, C.forest);
    ground += rect(x, 272, 32, 40, C.brown) + rect(x + 6, 282, 4, 4, '#6b2f1a') + rect(x + 22, 296, 4, 4, '#6b2f1a') + rect(x + 14, 304, 4, 4, '#6b2f1a');
  }

  const hs = 2;
  const run = frames(S.HERO_RUN, S.HERO_PAL, 36, 264 - S.HERO_RUN[0].length * hs, hs, 0.48, 'run');
  const css = run.css + `
.far{animation:drift 120s linear infinite}
.near{animation:drift 60s linear infinite}
.tw{animation:blink 1.6s steps(1) infinite}
.ground{animation:scroll .48s steps(8) infinite}
.shoot{opacity:0;animation:shoot 7s linear infinite 2s}
@keyframes drift{to{transform:translateX(-840px)}}
@keyframes scroll{to{transform:translateX(-32px)}}
@keyframes shoot{0%{opacity:1;transform:translate(0,0)}12%{opacity:0;transform:translate(-240px,120px)}100%{opacity:0}}
`;

  const body = `
<defs>
<clipPath id="scr"><path d="${notchedD(8, 8, W - 16, H - 16, 4)}"/></clipPath>
<clipPath id="low"><rect x="0" y="${ly + 32}" width="${W}" height="40"/></clipPath>
<pattern id="d1" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="${C.navy}"/><rect x="4" y="4" width="4" height="4" fill="${C.navy}"/></pattern>
<pattern id="d2" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="${C.plum}"/><rect x="4" y="4" width="4" height="4" fill="${C.plum}"/></pattern>
</defs>
${box(0, 0, W, H, { fill: C.ink })}
<g clip-path="url(#scr)">
${rect(0, 116, W, 12, 'url(#d1)')}${rect(0, 128, W, 120, C.navy)}${rect(0, 236, W, 12, 'url(#d2)')}${rect(0, 248, W, 16, C.plum)}
<path class="far" d="${far}" fill="${C.lavender}"/>
<path class="near" d="${near}" fill="${C.silver}"/>
<g class="near">${twinkles}</g>
<g class="shoot"><path d="M620 28h8v4h-8z" fill="${C.cream}"/><path d="M628 24h8v4h-8z" fill="${C.silver}"/><path d="M636 20h8v4h-8z" fill="${C.slate}"/></g>
${sprite(S.MOON, S.MOON_PAL, 736, 28, 4)}
<path d="${textPath(logo, lx + 8, ly + 8, 8)}" fill="${C.plum}"/>
<path d="${textPath(logo, lx, ly, 8)}" fill="${C.yellow}"/>
<path d="${textPath(logo, lx, ly, 8)}" fill="${C.orange}" clip-path="url(#low)"/>
${text(`${cfg.role} · ${cfg.school}`, W / 2, 136, { align: 'center', fill: C.cream })}
${text(`"${cfg.tagline}"`, W / 2, 164, { align: 'center', fill: C.pink })}
${text('▶ PRESS START ◀', W / 2, 200, { scale: 3, align: 'center', fill: C.yellow, cls: 'blink' })}
<g class="ground">${ground}</g>
${run.body}
${text('▶ CLICK TO PLAY HOLLOW RUSH ◀', W / 2, 288, { align: 'center', fill: C.yellow, cls: 'blink-slow' })}
</g>`;
  return doc({ w: W, h: H, title: `${cfg.name}: ${cfg.tagline}`, css, body });
}

// ── 2. HUD ──────────────────────────────────────────────────────────────────
export function hud(cfg, stats) {
  const H = 84;
  const colW = (W - 16) / 6;
  const cx = (i) => Math.round(8 + colW * (i + 0.5));
  const label = (i, s, cls = '') => text(s, cx(i), 20, { align: 'center', fill: C.pink, cls });
  const value = (i, s, fill = C.cream) => text(s, cx(i), 44, { scale: 3, align: 'center', fill });

  const hearts = [0, 1, 2].map((k) => sprite(S.HEART, S.HEART_PAL, cx(0) - 38 + k * 26, 45, 3)).join('');
  const coinsText = `×${pad(stats.stars, 2)}`;
  const coinsW = 24 + 6 + textWidth(coinsText, 3);
  const coinX = Math.round(cx(4) - coinsW / 2);

  const body = `
${box(0, 0, W, H, { fill: C.ink })}
${label(0, '1UP', 'blink')}${hearts}
${label(1, 'SCORE')}${value(1, pad(stats.contributions, 6))}
${label(2, 'STREAK')}${value(2, pad(stats.currentStreak, 3), C.yellow)}
${label(3, 'BEST')}${value(3, pad(stats.longestStreak, 3))}
${label(4, 'COINS')}${sprite(S.COIN, S.COIN_PAL, coinX, 43, 3)}${text(coinsText, coinX + 30, 44, { scale: 3, fill: C.cream })}
${label(5, 'LVL')}${value(5, pad(stats.repos, 2), C.green)}`;
  const title = `Score ${stats.contributions} contributions this year, ${stats.currentStreak}-day streak, best ${stats.longestStreak}, ${stats.stars} stars, ${stats.repos} repos`;
  return doc({ w: W, h: H, title, body });
}

// ── 3. Player card ──────────────────────────────────────────────────────────
export function playerCard(cfg) {
  const H = 300;
  const hs = 3;
  // Centre him on his body (x = 126 is the middle of the portrait frame).
  const idle = frames(S.HERO_IDLE, S.HERO_PAL, 126 - S.HERO_IDLE_AX * hs, 204 - S.HERO_IDLE[0].length * hs, hs, 1.4, 'breathe');
  const colors = { red: C.red, blue: C.blue, green: C.green, yellow: C.yellow, pink: C.pink };
  const lx = 252;
  const vx = lx + 84;

  let rows = '';
  rows += text('CLASS', lx, 60, { fill: C.pink }) + text(cfg.role, vx, 60);
  rows += text('GUILD', lx, 84, { fill: C.pink }) + text(cfg.school, vx, 84);
  cfg.about.forEach((line, i) => {
    if (i === 0) rows += text('BIO', lx, 108, { fill: C.pink });
    rows += text(line, vx, 108 + i * 22);
  });

  let bars = '';
  cfg.bars.forEach((b, i) => {
    const y = 160 + i * 22;
    bars += text(b.label, lx, y, { fill: C.cream });
    bars += bar(lx + 36, y, 320, 14, b.value, { fill: colors[b.color] || C.green, seg: 12, gap: 4, delay: 0.3 + i * 0.3 });
    bars += text(b.note, lx + 372, y, { fill: C.lavender });
  });

  const body = `
${box(0, 0, W, H)}
${box(24, 24, 204, H - 48, { fill: C.ink, border: C.yellow })}
${rect(40, 204, 172, 4, C.slate)}
${idle.body}
${text(cfg.name, 126, 218, { align: 'center', fill: C.yellow })}
${text('▶ READY', 126, 244, { align: 'center', fill: C.green, cls: 'blink' })}
${text('STATUS', lx, 28, { fill: C.yellow })}${dashes(lx + 84, 34, W - 24 - lx - 84, C.slate)}
${rows}
${bars}
${box(lx - 4, 224, W - 24 - lx + 4, 52, { u: 2, fill: C.ink, border: C.orange })}
${text('QUEST', lx + 10, 243, { fill: C.orange })}
${text('▶', lx + 82, 243, { fill: C.orange, cls: 'blink' })}
${text(cfg.quest, lx + 106, 243, { fill: C.cream })}`;
  return doc({ w: W, h: H, title: `${cfg.name}: ${cfg.role} at ${cfg.school}. Current quest: ${cfg.quest}`, css: idle.css, body });
}

// ── 4. Inventory ────────────────────────────────────────────────────────────
export function inventory(cfg) {
  const H = 152;
  const items = cfg.inventory;
  const pitch = 80;
  const x0 = Math.round((W - (items.length * pitch - 16)) / 2);
  const known = items.filter((it) => it.icon !== 'mystery').length;

  let slots = '';
  items.forEach((it, i) => {
    const x = x0 + i * pitch;
    const icon = S.ICONS[it.icon];
    const mystery = it.icon === 'mystery';
    slots += box(x, 56, 64, 64, { u: 2, fill: C.ink, border: C.slate });
    slots += sprite(icon.rows, icon.pal, x + 8, 64, 3, mystery ? ' class="bob"' : '');
    slots += text(it.label, x + 32, 128, { align: 'center', fill: mystery ? C.yellow : C.cream, cls: mystery ? 'blink-slow' : '' });
  });

  const selSteps = known;
  const css = `.sel{animation:sel ${selSteps * 1.2}s steps(${selSteps}) infinite}@keyframes sel{to{transform:translateX(${selSteps * pitch}px)}}`;
  const cursor = `<path class="sel" d="M${x0 - 4} 52h72v72h-72zM${x0} 56v64h64v-64z" fill="${C.yellow}" fill-rule="evenodd"/>`;

  const body = `
${box(0, 0, W, H)}
${panelHeader('INVENTORY', `${known} ITEMS + 1 SECRET`)}
${slots}
${cursor}`;
  return doc({ w: W, h: H, title: `Inventory: ${items.map((i) => i.label).join(', ')}`, css, body });
}

// ── 5. Language XP (live) ───────────────────────────────────────────────────
const LANG_COLORS = {
  C: C.silver,
  'C++': C.pink,
  Python: C.blue,
  HTML: '#ff5a1f',
  CSS: C.lavender,
  JavaScript: C.yellow,
  TypeScript: '#3d6bff',
  Java: C.orange,
  Shell: C.green,
};

export function languageXp(cfg, stats) {
  const langs = stats.languages.slice(0, 5);
  const total = stats.languages.reduce((a, l) => a + l.bytes, 0) || 1;
  const H = 64 + langs.length * 32;
  const fallback = [C.green, C.orange, C.peach, C.red];

  let rows = '';
  langs.forEach((l, i) => {
    const y = 60 + i * 32;
    const pct = l.bytes / total;
    const color = LANG_COLORS[l.name] || fallback[i % fallback.length];
    const lv = Math.max(1, Math.ceil(pct * 10));
    rows += rect(24, y + 2, 10, 10, color);
    rows += text(l.name, 44, y, { fill: C.cream });
    rows += text(`LV${pad(lv, 2)}`, 188, y, { fill: C.yellow });
    rows += bar(252, y, 470, 14, pct, { fill: color, seg: 10, gap: 2, delay: 0.2 + i * 0.25 });
    rows += text(`${(pct * 100).toFixed(1)}%`, W - 24, y, { align: 'right', fill: C.cream });
  });

  const body = `
${box(0, 0, W, H)}
${panelHeader('LANGUAGE XP', 'FROM MY PUBLIC REPOS')}
${rows}`;
  const title = `Languages: ${langs.map((l) => `${l.name} ${((l.bytes / total) * 100).toFixed(1)}%`).join(', ')}`;
  return doc({ w: W, h: H, title, body });
}

// ── 6. Skill tree ───────────────────────────────────────────────────────────
export function skillTree(cfg) {
  const nodes = cfg.skillTree;
  const tiers = Math.max(...nodes.map((n) => n.tier)) + 1;
  const nodeW = 160;
  const nodeH = 36;
  const pitchY = 56;
  const top = 60;
  const gapX = Math.floor((W - 48 - tiers * nodeW) / (tiers - 1));
  const perTier = Array.from({ length: tiers }, (_, t) => nodes.filter((n) => n.tier === t));
  const maxRows = Math.max(...perTier.map((t) => t.length));
  const H = top + (maxRows - 1) * pitchY + nodeH + 24;

  const pos = {};
  perTier.forEach((list, t) => {
    const offset = ((maxRows - list.length) * pitchY) / 2;
    list.forEach((n, i) => {
      pos[n.id] = { x: 24 + t * (nodeW + gapX), y: Math.round(top + offset + i * pitchY), row: i };
    });
  });

  const stateColor = { done: C.green, active: C.yellow, locked: C.slate };

  let edges = '';
  for (const n of nodes) {
    for (const pid of n.from || []) {
      const p = pos[pid];
      const c = pos[n.id];
      const y1 = p.y + nodeH / 2 - 2;
      const y2 = c.y + nodeH / 2 - 2;
      const x1 = p.x + nodeW;
      const mid = x1 + 10 + (p.row % 3) * 12;
      const d = `M${x1} ${y1}h${mid - x1 + 4}v4h-${mid - x1 + 4}z` + `M${mid} ${Math.min(y1, y2)}h4v${Math.abs(y2 - y1) + 4}h-4z` + `M${mid} ${y2}h${c.x - mid}v4h-${c.x - mid}z`;
      edges += `<path d="${d}" fill="${stateColor[n.state]}"/>`;
    }
  }

  let boxes = '';
  for (const n of nodes) {
    const { x, y } = pos[n.id];
    const color = stateColor[n.state];
    boxes += box(x, y, nodeW, nodeH, { u: 2, fill: C.ink, border: color });
    if (n.state === 'active') boxes += `<g class="blink-slow">${box(x, y, nodeW, nodeH, { u: 2, fill: C.ink, border: C.orange })}</g>`;
    if (n.state === 'locked') boxes += sprite(S.LOCK, S.LOCK_PAL, x + 8, y + 9, 2);
    else boxes += text(n.state === 'done' ? '✓' : '▶', x + 12, y + 11, { fill: color, cls: n.state === 'active' ? 'blink' : '' });
    boxes += text(n.label, x + 34, y + 11, { fill: n.state === 'locked' ? C.slate : n.state === 'active' ? C.yellow : C.cream });
  }

  // Legend in the header row.
  const legend = [
    ['DONE', C.green],
    ['IN PROGRESS', C.yellow],
    ['LOCKED', C.slate],
  ];
  let lg = '';
  let lx = W - 24;
  for (const [label, color] of legend.reverse()) {
    const w = textWidth(label, 2);
    lx -= w;
    lg += text(label, lx, 22, { fill: C.lavender });
    lx -= 20;
    lg += rect(lx, 24, 12, 12, color);
    lx -= 24;
  }

  const body = `
${box(0, 0, W, H)}
${text('SKILL TREE', 24, 22, { fill: C.yellow })}${lg}${dashes(24, 44, W - 48, C.slate)}
${edges}
${boxes}`;
  const done = nodes.filter((n) => n.state === 'done').map((n) => n.label);
  const active = nodes.filter((n) => n.state === 'active').map((n) => n.label);
  const locked = nodes.filter((n) => n.state === 'locked').map((n) => n.label);
  return doc({ w: W, h: H, title: `Skill tree. Unlocked: ${done.join(', ')}. In progress: ${active.join(', ')}. Next: ${locked.join(', ')}`, body });
}

// ── 7. Level cards ──────────────────────────────────────────────────────────
export function levelCard(cfg, level, stats) {
  const w = 412;
  const H = 184;
  const boss = level.status === 'BOSS';
  const stars = stats.repoStars?.[level.repo] ?? 0;
  const lines = wrap(level.desc, 31).slice(0, 3);

  const status = boss ? '★ BOSS CLEARED' : `★ ${level.status}`;
  let desc = '';
  lines.forEach((l, i) => (desc += text(l, 20, 88 + i * 20, { fill: C.silver })));

  const langColor = LANG_COLORS[level.lang] || (level.lang === 'FLASK' ? C.green : C.cream);

  const body = `
${box(0, 0, w, H, { border: boss ? C.red : C.cream })}
${text(`WORLD ${level.world}`, 20, 20, { fill: C.yellow })}
${text(status, w - 20, 20, { align: 'right', fill: boss ? C.red : C.green })}
${text(level.repo, 20, 46, { scale: 3, fill: C.cream })}
${dashes(20, 76, w - 40, C.slate)}
${desc}
${rect(20, 152, 12, 12, langColor)}
${text(level.lang, 40, 151, { fill: C.cream })}
${text(`★ ${stars}`, 150, 151, { fill: C.yellow })}
${text('▶ ENTER', w - 20, 151, { align: 'right', fill: C.yellow, cls: 'blink' })}`;
  return doc({ w, h: H, title: `${level.repo}: ${level.desc}`, body });
}

// ── 8. Achievements (live) ──────────────────────────────────────────────────
export function achievements(cfg, stats) {
  const list = cfg.achievements.map((a) => ({ ...a, unlocked: a.when ? Boolean(a.when(stats)) : true }));
  const unlocked = list.filter((a) => a.unlocked).length;
  const cols = 3;
  const cellW = Math.floor((W - 48) / cols);
  const rows = Math.ceil(list.length / cols);
  const H = 60 + rows * 64 + 8;

  let cells = '';
  list.forEach((a, i) => {
    const x = 24 + (i % cols) * cellW;
    const y = 60 + Math.floor(i / cols) * 64;
    cells += sprite(S.TROPHY, a.unlocked ? S.TROPHY_PAL : S.TROPHY_LOCKED_PAL, x, y + 4, 3);
    if (a.unlocked) cells += text('*', x + 36, y, { fill: C.cream, cls: 'blink', style: `animation-delay:-${(i * 0.37).toFixed(2)}s` });
    cells += text(a.title, x + 50, y + 8, { fill: a.unlocked ? C.yellow : C.slate });
    cells += text(a.desc, x + 50, y + 30, { fill: a.unlocked ? C.silver : C.slate });
  });

  const body = `
${box(0, 0, W, H)}
${panelHeader('TROPHY ROOM', `UNLOCKED ${unlocked}/${list.length}`)}
${cells}`;
  const title = `Achievements unlocked ${unlocked}/${list.length}: ${list.filter((a) => a.unlocked).map((a) => a.title).join(', ')}`;
  return doc({ w: W, h: H, title, body });
}

// ── 9. Dialogue box (rotates daily) ─────────────────────────────────────────
export function pickQuote(cfg, isoDate) {
  const day = Math.floor(Date.parse(`${isoDate}T00:00:00Z`) / 86400000);
  return cfg.quotes[((day % cfg.quotes.length) + cfg.quotes.length) % cfg.quotes.length];
}

export function dialogue(cfg, isoDate) {
  const H = 196;
  const q = pickQuote(cfg, isoDate);
  const seriesColor = { bleach: C.orange, erased: C.yellow, another: '#3fd0c9' }[q.series] || C.cream;
  const emblem = S.EMBLEMS[q.series];
  const tx = 196;
  const areaW = W - 24 - tx;

  let scale = 3;
  let lines = wrap(`"${q.text}"`, Math.floor((areaW + 3) / 18));
  if (lines.length > 3) {
    scale = 2;
    lines = wrap(`"${q.text}"`, Math.floor((areaW + 2) / 12));
  }
  const pitch = scale === 3 ? 30 : 22;

  let typed = '';
  let delay = 0.4;
  lines.forEach((line, i) => {
    const y = 66 + i * pitch;
    const w = textWidth(line, scale) + scale;
    const steps = line.length;
    const dur = (steps * 0.045).toFixed(2);
    typed += text(line, tx, y, { scale, fill: C.cream });
    typed += `<rect class="type" x="${tx}" y="${y - 2}" width="${w}" height="${7 * scale + 4}" fill="${C.ink}" style="transform:translateX(${w}px);animation-duration:${dur}s;animation-delay:${delay.toFixed(2)}s;animation-timing-function:steps(${steps})"/>`;
    delay += Number(dur) + 0.15;
  });

  const css = `.type{animation-name:type;animation-fill-mode:both}@keyframes type{from{transform:translateX(0)}}`;
  const body = `
<defs><clipPath id="ta"><rect x="${tx}" y="56" width="${areaW}" height="100"/></clipPath></defs>
${box(0, 0, W, H, { fill: C.ink })}
${box(20, 20, 156, 156, { fill: C.navy, border: seriesColor })}
${sprite(emblem.rows, emblem.pal, 50, 50, 8)}
${text(q.speaker, tx, 26, { scale: 3, fill: seriesColor })}
${text('QUOTE OF THE DAY', W - 24, 30, { align: 'right', fill: C.slate })}
<g clip-path="url(#ta)">${typed}</g>
${text(`- ${cfg.seriesNames[q.series] || q.series.toUpperCase()}`, tx, 162, { fill: C.lavender })}
${text('▼', W - 36, 162, { fill: C.cream, cls: 'blink' })}`;
  return doc({ w: W, h: H, title: `${q.speaker} (${cfg.seriesNames[q.series]}): "${q.text}"`, css, body });
}

// ── 10. Section dividers ────────────────────────────────────────────────────
export function divider(label) {
  const H = 48;
  const tw = textWidth(label, 2);
  const bw = tw + 72;
  const bx = Math.round((W - bw) / 2);
  const body = `
${dashes(0, 22, bx - 8, C.slate, 4)}
${dashes(bx + bw + 8, 22, W - bx - bw - 8, C.slate, 4)}
${box(bx, 4, bw, 40, { fill: C.ink })}
${text('▶', bx + 18, 17, { fill: C.orange })}
${text(label, W / 2, 17, { align: 'center', fill: C.yellow })}
${text('◀', bx + bw - 28, 17, { fill: C.orange })}`;
  return doc({ w: W, h: H, title: label, body });
}

// ── 11. Social buttons ──────────────────────────────────────────────────────
export function button(kind, label) {
  const w = 268;
  const H = 68;
  const icon = S.BTN_ICONS[kind];
  const body = `
${box(0, 0, w, H)}
${sprite(icon.rows, icon.pal, 22, 16, 3)}
${text(label, 72, 27, { fill: C.cream })}
${text('▶', w - 32, 27, { fill: C.yellow, cls: 'blink' })}`;
  return doc({ w, h: H, title: label, body });
}

// ── 12. Footer ──────────────────────────────────────────────────────────────
export function gameOver(cfg) {
  const H = 176;
  const cx = Math.round(W / 2 - textWidth('CONTINUE? 9', 3) / 2);
  const digitX = cx + 10 * 18;
  let digits = '';
  for (let n = 9; n >= 0; n--) {
    const i = 9 - n;
    const base = n === 9 ? '' : 'opacity:0;';
    digits += `<path class="cd" style="${base}animation-delay:${i}s" d="${textPath(String(n), digitX, 92, 3)}" fill="${C.red}"/>`;
  }
  const css = `.cd{animation:cd 10s steps(1) infinite}@keyframes cd{0%{opacity:1}10%,100%{opacity:0}}`;
  const body = `
${box(0, 0, W, H, { fill: C.ink })}
${text('THANKS FOR PLAYING!', W / 2, 36, { scale: 4, align: 'center', fill: C.yellow, shadow: C.plum })}
${text('CONTINUE?', cx, 92, { scale: 3, fill: C.red })}
${digits}
${text('▶ HIT FOLLOW TO SAVE YOUR PROGRESS', W / 2, 136, { align: 'center', fill: C.cream, cls: 'blink-slow' })}`;
  return doc({ w: W, h: H, title: 'Thanks for playing! Hit follow to save your progress.', css, body });
}

// ── 13. Hollow Rush play card (links to the game) ───────────────────────────
function outlined(rows) {
  const w = Math.max(...rows.map((r) => r.length));
  return new Grid(w + 2, rows.length + 2).stamp(rows, 1, 1).outline('x').rows();
}

export function playCard(cfg) {
  const H = 260;
  const r = rng(4242);
  const roofA = 216;
  const roofB = 224;

  let stars = '';
  for (let i = 0; i < 40; i++) stars += `M${Math.floor(r() * 206) * 4 + 8} ${Math.floor(r() * 30) * 4 + 12}h2v2h-2z`;
  let skyline = '';
  for (let x = 8; x < W - 8; ) {
    const w = 24 + Math.floor(r() * 40);
    const h = 30 + Math.floor(r() * 60);
    skyline += `M${x} ${roofA - h + 20}h${Math.min(w, W - 8 - x)}v${h}h-${Math.min(w, W - 8 - x)}z`;
    x += w + 4;
  }
  const building = (x, w, roof) => {
    let win = '';
    for (let wy = roof + 12; wy < H - 10; wy += 14)
      for (let wx = x + 10; wx < x + w - 10; wx += 14) if (r() < 0.25) win += `M${wx} ${wy}h6v6h-6z`;
    return rect(x, roof, w, H - roof, '#141a3a') + rect(x, roof, w, 2, C.silver) + rect(x, roof + 2, w, 4, C.slate) + `<path d="${win}" fill="${C.yellow}"/>`;
  };

  const hs = 2;
  const hero = S.HERO_SLASH;
  const heroX = 110;
  const heroY = roofA - hero.length * hs;
  const wave = HW.crescent(36, C.red, '#16162a', C.plum);
  const grunt = HW.GRUNT.map(outlined);
  const flyer = HW.FLYER.map(outlined);
  const soul = HW.SOUL[0];
  const gx = 660;
  const gy = roofB - grunt[0].length * hs;

  const walk = frames(grunt, HW.HOLLOW_PAL, gx, gy, hs, 0.5, 'walk');
  const flap = frames(flyer, HW.HOLLOW_PAL, 520, 112, hs, 0.3, 'flap');
  let orbs = '';
  [0, 1, 2, 3].forEach((i) => {
    orbs += sprite(soul, HW.SOUL_PAL, 430 + i * 30, roofA - 30 - [0, 14, 14, 0][i], hs, ` class="bob" style="animation-delay:-${i * 0.25}s"`);
  });

  const logo = 'HOLLOW RUSH';
  const css = `${walk.css}${flap.css}
.wave{animation:wave 2.4s steps(48) infinite}
@keyframes wave{0%{transform:translateX(0);opacity:1}70%{transform:translateX(480px);opacity:1}71%,100%{transform:translateX(480px);opacity:0}}`;

  const body = `
<defs><clipPath id="pc"><path d="${notchedD(8, 8, W - 16, H - 16, 4)}"/></clipPath>
<clipPath id="pl"><rect x="0" y="${20 + 16}" width="${W}" height="16"/></clipPath></defs>
${box(0, 0, W, H, { fill: C.ink, border: C.yellow })}
<g clip-path="url(#pc)">
${rect(0, 96, W, H - 96, C.navy)}
<path d="${stars}" fill="${C.lavender}"/>
<path d="${skyline}" fill="#1f1a3d"/>
${building(0, 520, roofA)}
${building(600, 260, roofB)}
${orbs}
${flap.body}
${walk.body}
${sprite(hero, S.HERO_PAL, heroX, heroY, hs)}
<g class="wave">${sprite(wave.rows, wave.pal, heroX + hero[0].length * hs + 8, roofA - 20 - 36, hs)}</g>
</g>
<path d="${textPath(logo, 28, 24, 4)}" fill="${C.plum}"/>
<path d="${textPath(logo, 24, 20, 4)}" fill="${C.yellow}"/>
<path d="${textPath(logo, 24, 20, 4)}" fill="${C.orange}" clip-path="url(#pl)"/>
${text('A PLAYABLE RETRO RUNNER · JUMP, SLASH, GETSUGA!', 24, 62, { fill: C.pink })}
${box(W - 236, 18, 212, 44, { u: 2, fill: C.red, border: C.cream })}
${text('▶ CLICK TO PLAY', W - 130, 33, { align: 'center', fill: C.cream, cls: 'blink' })}`;
  return doc({ w: W, h: H, title: 'Hollow Rush: a playable retro runner. Click to play in your browser.', css, body });
}
