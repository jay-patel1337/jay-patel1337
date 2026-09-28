// Vercel serverless function: GET /api/now-playing        -> pixel "now playing" SVG
//                             GET /api/now-playing?open   -> redirect to the track on Spotify
// Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN (see scripts/spotify-token.js).
// Spotify refresh tokens expire 6 months after you authorize; re-run the token script then.

import { nowPlayingCard } from '../scripts/lib/now-playing-card.js';

let cached = { token: null, expires: 0 };

async function accessToken() {
  if (cached.token && Date.now() < cached.expires - 60_000) return cached.token;
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) throw new Error('Spotify env vars are not set');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`token refresh failed (${res.status}): ${JSON.stringify(json)}`);
  cached = { token: json.access_token, expires: Date.now() + json.expires_in * 1000 };
  return cached.token;
}

async function spotify(path, token) {
  const res = await fetch(`https://api.spotify.com/v1${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

async function currentTrack() {
  const token = await accessToken();
  const now = await spotify('/me/player/currently-playing', token);
  if (now?.item && now.is_playing) return { state: 'playing', item: now.item, progressMs: now.progress_ms };
  const recent = await spotify('/me/player/recently-played?limit=1', token);
  const item = recent?.items?.[0]?.track;
  return item ? { state: 'recent', item } : { state: 'idle' };
}

// The 64px album cover, inlined: GitHub's image proxy won't let an SVG load remote images.
async function coverDataUri(item) {
  const images = [...(item.album?.images || [])].sort((a, b) => (a.width || 0) - (b.width || 0));
  if (!images[0]?.url) return null;
  const res = await fetch(images[0].url);
  if (!res.ok) return null;
  const type = res.headers.get('content-type') || 'image/jpeg';
  return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
}

export default async function handler(req, res) {
  let result;
  try {
    result = await currentTrack();
  } catch (err) {
    console.error(err);
    result = { state: 'idle' };
  }

  const url = new URL(req.url, 'http://localhost');
  if (url.searchParams.has('open')) {
    res.statusCode = 302;
    res.setHeader('Location', result.item?.external_urls?.spotify || 'https://open.spotify.com');
    res.setHeader('Cache-Control', 'no-store');
    return res.end();
  }

  const item = result.item;
  const svg = nowPlayingCard({
    state: result.state,
    title: item?.name,
    artist: (item?.artists || []).map((a) => a.name).join(', '),
    art: item ? await coverDataUri(item).catch(() => null) : null,
    progressMs: result.progressMs,
    durationMs: item?.duration_ms,
  });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  // Browsers and GitHub's camo proxy must always re-fetch; Vercel's edge may reuse it for 10s.
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Vercel-CDN-Cache-Control', 'max-age=10');
  res.end(svg);
}
