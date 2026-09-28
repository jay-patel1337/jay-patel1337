// Hollow Rush leaderboard.
//   GET  /api/scores              -> { enabled, scores: [{ name, score }] }  (top 10)
//   GET  /api/scores?start=1      -> { token }   signed at game start
//   GET  /api/scores?format=svg   -> README hall-of-fame card
//   POST /api/scores { name, score, token }
// Storage: Upstash Redis (Vercel → Storage → Upstash for Redis → connect to this project).
// Without it the endpoint reports enabled:false and the game keeps a local best score only.

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { hallOfFameCard } from '../scripts/lib/hall-of-fame-card.js';

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const SECRET = process.env.SCORE_SECRET || REDIS_TOKEN || '';
const enabled = Boolean(REDIS_URL && REDIS_TOKEN);

const KEY = 'hollowrush:scores';
const KEEP = 50;
const BLOCKED = new Set(['ASS', 'FUK', 'FUC', 'FCK', 'SEX', 'KKK', 'NIG', 'FAG', 'CUM', 'TIT', 'DIK', 'DIC', 'COK', 'VAG', 'NAZ', 'SHT', 'PIS', 'XXX', 'KYS', 'RAP', 'HOE', 'CNT', 'JIZ']);

async function redis(...commands) {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`redis ${res.status} ${await res.text()}`);
  return (await res.json()).map((r) => r.result);
}

async function top(n = 10) {
  const [flat] = await redis(['ZREVRANGE', KEY, 0, n - 1, 'WITHSCORES']);
  const out = [];
  for (let i = 0; i < (flat || []).length; i += 2) out.push({ name: String(flat[i]).split('|')[0], score: Number(flat[i + 1]) });
  return out;
}

const sign = (payload) => createHmac('sha256', SECRET).update(payload).digest('hex').slice(0, 32);

function checkToken(token) {
  const [ts, nonce, sig] = String(token || '').split('.');
  if (!ts || !nonce || !sig) return null;
  const want = Buffer.from(sign(`${ts}.${nonce}`));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  return { elapsed: (Date.now() - Number(ts)) / 1000, nonce };
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = typeof req.body === 'string' ? req.body : '';
  if (!raw) for await (const chunk of req) raw += chunk;
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

function send(res, status, data, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (req.method === 'GET' && url.searchParams.get('format') === 'svg') {
      const scores = enabled ? await top(5) : [];
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      res.setHeader('Vercel-CDN-Cache-Control', 'max-age=30');
      return res.end(hallOfFameCard(scores, { enabled }));
    }

    if (req.method === 'GET' && url.searchParams.has('start')) {
      if (!enabled) return send(res, 200, { token: null });
      const payload = `${Date.now()}.${randomBytes(8).toString('hex')}`;
      return send(res, 200, { token: `${payload}.${sign(payload)}` });
    }

    if (req.method === 'GET') return send(res, 200, { enabled, scores: enabled ? await top(10) : [] });

    if (req.method === 'POST') {
      if (!enabled) return send(res, 200, { ok: false, reason: 'disabled' });
      const body = await readBody(req);
      const score = Math.floor(Number(body.score));
      let name = String(body.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
      const run = checkToken(body.token);
      if (!run || !name || !Number.isFinite(score) || score <= 0) return send(res, 400, { ok: false, reason: 'invalid' });
      // A run can't score faster than ~600 points per second of play (distance + kills with combos).
      if (run.elapsed < 3 || run.elapsed > 7200 || score > run.elapsed * 600 + 2000) return send(res, 400, { ok: false, reason: 'implausible' });
      if (BLOCKED.has(name)) name = '???';

      const ip = String(req.headers['x-forwarded-for'] || 'local').split(',')[0].trim();
      const [fresh, allowed] = await redis(['SET', `hollowrush:nonce:${run.nonce}`, 1, 'NX', 'EX', 7200], ['SET', `hollowrush:ip:${ip}`, 1, 'NX', 'EX', 5]);
      if (fresh !== 'OK') return send(res, 409, { ok: false, reason: 'token used' });
      if (allowed !== 'OK') return send(res, 429, { ok: false, reason: 'slow down' });

      await redis(['ZADD', KEY, score, `${name}|${run.nonce}`], ['ZREMRANGEBYRANK', KEY, 0, -(KEEP + 1)]);
      return send(res, 200, { ok: true, scores: await top(10) });
    }

    send(res, 405, { ok: false });
  } catch (err) {
    console.error(err);
    send(res, 500, { ok: false, enabled, scores: [] });
  }
}
