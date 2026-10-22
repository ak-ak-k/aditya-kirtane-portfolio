import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

// Local QA only. Serve assets as files; only extensionless application URLs use SPA fallback.
const root = resolve('dist/ak-portfolio/browser');
const port = Number(process.env.PORT ?? 4300);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};
await stat(resolve(root, 'index.html')).catch(() => {
  throw new Error('Production output missing. Run npm run build first.');
});
createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    let info = await stat(file).catch(() => null);
    if (!info?.isFile()) {
      if (extname(pathname) || pathname.startsWith('/assets/')) {
        response.writeHead(404).end('Not found');
        return;
      }
      file = resolve(root, 'index.html');
      info = await stat(file);
    }
    response.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
    });
    if (request.method === 'HEAD') response.end();
    else
      createReadStream(file)
        .on('error', () => response.destroy())
        .pipe(response);
  } catch {
    response.writeHead(400).end('Invalid request');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Production preview: http://127.0.0.1:${port}`);
});
