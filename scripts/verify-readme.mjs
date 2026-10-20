import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve, dirname, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const requireTools = createRequire(
  resolve(process.env.README_TOOLS_DIR ?? 'tmp/readme-tools', 'package.json'),
);
const MarkdownIt = requireTools('markdown-it');
const { chromium } = requireTools('playwright');
const md = new MarkdownIt({ html: true });
const files = [
  'README.md',
  'docs/architecture.md',
  'docs/project-evidence.md',
  'docs/github-showcase.md',
];
const out = resolve('tmp/readme-qa');
await mkdir(out, { recursive: true });
const sources = new Map(
  await Promise.all(files.map(async (file) => [file, await readFile(file, 'utf8')])),
);
const external = new Set();
const images = new Set();
const diagrams = [];
const results = { localLinks: 0, images: [], diagrams: [], external: [], preview: '' };

function anchors(source) {
  const counts = new Map();
  return md.parse(source, {}).flatMap((token, index, tokens) => {
    if (token.type !== 'heading_open') return [];
    const text = tokens[index + 1].content.replace(/[`*_]/g, '').toLowerCase();
    const slug = text.replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    const count = counts.get(slug) ?? 0;
    counts.set(slug, count + 1);
    return [count ? `${slug}-${count}` : slug];
  });
}

async function checkLink(file, target, image = false) {
  if (/^https?:/.test(target)) {
    external.add(target);
    return;
  }
  if (/^(mailto:|tel:)/.test(target)) return;
  const [pathname, fragment] = target.split('#');
  const path = pathname ? resolve(dirname(file), decodeURIComponent(pathname)) : resolve(file);
  assert.ok((await stat(path)).isFile(), `${file}: missing ${target}`);
  results.localLinks++;
  if (fragment && extname(path) === '.md') {
    assert.ok(
      anchors(await readFile(path, 'utf8')).includes(decodeURIComponent(fragment)),
      `${file}: missing anchor ${target}`,
    );
  }
  if (image) images.add(path);
}

async function walk(file, tokens) {
  for (const token of tokens) {
    if (token.type === 'link_open') await checkLink(file, token.attrGet('href'));
    if (token.type === 'image') await checkLink(file, token.attrGet('src'), true);
    if (token.type === 'fence' && token.info.trim() === 'mermaid')
      diagrams.push({ file, source: token.content });
    if (token.type === 'html_inline' || token.type === 'html_block') {
      for (const match of token.content.matchAll(/(href|src)="([^"]+)"/g))
        await checkLink(file, match[2], match[1] === 'src');
    }
    if (token.children) await walk(file, token.children);
  }
}
for (const [file, source] of sources) await walk(file, md.parse(source, {}));
for (const path of images) {
  const bytes = await readFile(path);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG', `${path}: expected PNG`);
  results.images.push({
    path,
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    bytes: bytes.length,
  });
}

const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_CHANNEL
    ? { channel: process.env.BROWSER_CHANNEL }
    : process.platform === 'win32'
      ? { channel: 'msedge' }
      : {}),
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('about:blank');
  await page.addScriptTag({
    path: resolve(dirname(requireTools.resolve('mermaid')), 'mermaid.min.js'),
  });
  const rendered = [];
  for (const [index, diagram] of diagrams.entries()) {
    const svg = await page.evaluate(
      async ({ source, index }) => {
        window.mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'dark' });
        await window.mermaid.parse(source);
        return (await window.mermaid.render(`diagram-${index}`, source)).svg;
      },
      { source: diagram.source, index },
    );
    rendered.push(svg);
    results.diagrams.push({ file: diagram.file, parsed: true, rendered: true });
    await writeFile(resolve(out, `architecture-${index}.svg`), svg);
  }
  let index = 0;
  md.renderer.rules.fence = (tokens, position) =>
    tokens[position].info.trim() === 'mermaid'
      ? rendered[index++]
      : `<pre><code>${md.utils.escapeHtml(tokens[position].content)}</code></pre>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><base href="${pathToFileURL(resolve('.') + sep).href}">
    <title>Portfolio README preview</title><style>
    body{background:#0d1117;color:#e6edf3;font:16px/1.6 Segoe UI,Arial,sans-serif;margin:0}
    article{max-width:1100px;margin:40px auto;padding:32px;border:1px solid #30363d;border-radius:8px}
    h1,h2{border-bottom:1px solid #30363d;padding-bottom:10px;line-height:1.25}h2{margin-top:36px}
    a{color:#58a6ff}img{max-width:100%;height:auto}img[src^="https://img.shields.io/"]{height:20px;width:auto}
    table{border-collapse:collapse;width:100%;margin:16px 0}td,th{border:1px solid #30363d;padding:8px;vertical-align:top}
    pre{background:#161b22;padding:16px;overflow:auto}code{font:14px/1.6 Consolas,monospace}
    details{margin:20px 0}summary{cursor:pointer}svg{max-width:100%;height:auto}
    </style></head><body><article>${md.render(sources.get('README.md'))}</article></body></html>`;
  const preview = resolve(out, 'README-preview.html');
  await writeFile(preview, html);
  await page.goto(pathToFileURL(preview).href, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('details').count(), 2);
  await page.screenshot({ path: resolve(out, 'README-preview.png') });
  results.preview = preview;
  results.external = await Promise.all(
    [...external].map(async (url) => {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(20000),
          redirect: 'follow',
        });
        const result = { url, status: response.status, finalUrl: response.url };
        await response.body?.cancel();
        return result;
      } catch (error) {
        return { url, error: error.message };
      }
    }),
  );
} finally {
  await browser.close();
}
await writeFile(resolve(out, 'readme-report.json'), JSON.stringify(results, null, 2) + '\n');
console.log(
  JSON.stringify(
    {
      localLinks: results.localLinks,
      screenshots: results.images.length,
      mermaid: results.diagrams,
      external: results.external,
      preview: results.preview,
    },
    null,
    2,
  ),
);
