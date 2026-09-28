// Regenerates every SVG in assets/ from profile.config.js.
//   node scripts/build.js                  static build using cached data/stats.json
//   node scripts/build.js --live           refresh stats from GitHub first (used by the daily workflow)
//   node scripts/build.js --date=2026-10-01  preview the dialogue quote for another day

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import config from '../profile.config.js';
import * as R from './render.js';
import { fetchStats } from './github-stats.js';

const root = new URL('../', import.meta.url);
const args = process.argv.slice(2);
const live = args.includes('--live');
const date = args.find((a) => a.startsWith('--date='))?.slice(7) || new Intl.DateTimeFormat('en-CA', { timeZone: config.timezone }).format(new Date());

const statsFile = new URL('data/stats.json', root);
let stats = JSON.parse(await readFile(statsFile, 'utf8').catch(() => 'null'));
if (live || !stats) {
  stats = await fetchStats(config.login, process.env.GITHUB_TOKEN);
  await mkdir(new URL('data/', root), { recursive: true });
  await writeFile(statsFile, JSON.stringify(stats, null, 2) + '\n');
}

const dividers = {
  player: 'WORLD 1 · PLAYER SELECT',
  gear: 'WORLD 2 · GEAR & SKILLS',
  levels: 'WORLD 3 · LEVEL SELECT',
  trophies: 'WORLD 4 · TROPHY ROOM',
  save: 'WORLD 5 · SAVE POINT',
  boss: 'FINAL WORLD · BOSS FIGHT',
  continue: 'CONTINUE?',
};

const assets = {
  'title-screen.svg': R.titleScreen(config),
  'hud.svg': R.hud(config, stats),
  'player-card.svg': R.playerCard(config),
  'inventory.svg': R.inventory(config),
  'lang-xp.svg': R.languageXp(config, stats),
  'skill-tree.svg': R.skillTree(config),
  'achievements.svg': R.achievements(config, stats),
  'dialogue.svg': R.dialogue(config, date),
  'game-over.svg': R.gameOver(config),
  'btn-linkedin.svg': R.button('linkedin', 'LINKEDIN'),
  'btn-instagram.svg': R.button('instagram', 'INSTAGRAM'),
  'btn-email.svg': R.button('email', 'EMAIL'),
};
for (const level of config.levels) assets[`level-${level.repo.toLowerCase()}.svg`] = R.levelCard(config, level, stats);
for (const [key, label] of Object.entries(dividers)) assets[`divider-${key}.svg`] = R.divider(label);

await mkdir(new URL('assets/', root), { recursive: true });
for (const [name, svg] of Object.entries(assets)) await writeFile(new URL(`assets/${name}`, root), svg);

const q = R.pickQuote(config, date);
console.log(`Wrote ${Object.keys(assets).length} assets. Quote for ${date}: ${q.speaker} (${q.series})`);
console.log(`Stats: ${stats.contributions} contributions, streak ${stats.currentStreak}/${stats.longestStreak}, ${stats.stars} stars, ${stats.repos} repos`);
