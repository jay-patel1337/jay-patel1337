// One-time helper: run `node scripts/spotify-token.js` in YOUR terminal.
// It asks for your Spotify app's Client ID and Secret, opens the Spotify login,
// and prints a refresh token. Paste all three into Vercel's environment variables.
// Nothing is written to disk. Refresh tokens last 6 months; run this again when the card stops updating.

import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { exec } from 'node:child_process';
import { createInterface } from 'node:readline/promises';

const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = 'user-read-currently-playing user-read-recently-played';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const clientId = (process.env.SPOTIFY_CLIENT_ID || (await rl.question('Spotify Client ID: '))).trim();
const clientSecret = (process.env.SPOTIFY_CLIENT_SECRET || (await rl.question('Spotify Client Secret: '))).trim();
rl.close();
if (!clientId || !clientSecret) {
  console.error('Both the Client ID and the Client Secret are required.');
  process.exit(1);
}

const state = randomBytes(12).toString('hex');
const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({ response_type: 'code', client_id: clientId, scope: SCOPES, redirect_uri: REDIRECT, state });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== '/callback') {
    res.writeHead(404).end();
    return;
  }
  const send = (msg) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<body style="font-family:monospace;background:#0b0e1f;color:#fff1e8;padding:40px"><h2>${msg}</h2><p>You can close this tab and go back to the terminal.</p></body>`);
  };
  if (url.searchParams.get('state') !== state || url.searchParams.get('error')) {
    send('Login was cancelled or did not match. Run the script again.');
    console.error('Authorization failed:', url.searchParams.get('error') || 'state mismatch');
    server.close();
    process.exitCode = 1;
    return;
  }
  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: url.searchParams.get('code'), redirect_uri: REDIRECT }),
    });
    const json = await tokenRes.json();
    if (!tokenRes.ok || !json.refresh_token) throw new Error(JSON.stringify(json));
    send('✔ Done! Your refresh token is in the terminal.');
    console.log('\nAdd these three environment variables in Vercel (Project → Settings → Environment Variables):\n');
    console.log(`  SPOTIFY_CLIENT_ID      = ${clientId}`);
    console.log('  SPOTIFY_CLIENT_SECRET  = (the secret you just typed)');
    console.log(`  SPOTIFY_REFRESH_TOKEN  = ${json.refresh_token}\n`);
    console.log('Keep the refresh token private: it gives read access to what you are listening to.');
  } catch (err) {
    send('Token exchange failed. Check the terminal.');
    console.error('Token exchange failed:', err.message);
    process.exitCode = 1;
  }
  server.close();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('\nOpening Spotify login in your browser...');
  console.log(`If it doesn't open, paste this link into your browser:\n\n${authUrl}\n`);
  const opener = process.platform === 'win32' ? `start "" "${authUrl}"` : process.platform === 'darwin' ? `open "${authUrl}"` : `xdg-open "${authUrl}"`;
  exec(opener, { shell: process.platform === 'win32' ? 'cmd.exe' : undefined });
});
