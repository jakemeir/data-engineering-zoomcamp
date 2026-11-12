import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');

const MIME_MAP = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.sql': 'text/plain; charset=utf-8',
  '.py': 'text/plain; charset=utf-8',
  '.yaml': 'text/plain; charset=utf-8',
  '.yml': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const serveRepoPlugin = () => ({
  name: 'serve-de-zoomcamp-repo',
  configureServer(server) {
    server.middlewares.use('/repo-raw', (req, res, next) => {
      try {
        const cleanUrl = decodeURIComponent((req.url || '').split('?')[0]);
        const targetPath = path.normalize(path.join(REPO_ROOT, cleanUrl));
        if (!targetPath.startsWith(REPO_ROOT)) {
          res.statusCode = 403;
          res.end('Forbidden');
          return;
        }
        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
          const ext = path.extname(targetPath).toLowerCase();
          res.setHeader('Content-Type', MIME_MAP[ext] || 'application/octet-stream');
          fs.createReadStream(targetPath).pipe(res);
          return;
        }
      } catch {
        // Fallback to next middleware
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), serveRepoPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
