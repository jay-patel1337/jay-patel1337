// Local preview: `npm run dev`, then open http://localhost:3000/play
// Serves the repo as static files and runs api/*.js handlers the way Vercel does.

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT) || 3000;
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png' };

http
  .createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    try {
      const api = path.match(/^\/api\/([\w-]+)$/);
      if (api) {
        const mod = await import(pathToFileURL(join(root, 'api', `${api[1]}.js`)).href);
        return await mod.default(req, res);
      }
      let file = normalize(join(root, path));
      if (!file.startsWith(root)) throw new Error('outside root');
      if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': `${TYPES[extname(file)] || 'application/octet-stream'}; charset=utf-8` });
      res.end(body);
    } catch (err) {
      if (!res.headersSent) res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(String(err.message || err));
    }
  })
  .listen(port, () => console.log(`Hollow Rush → http://localhost:${port}/play`));
