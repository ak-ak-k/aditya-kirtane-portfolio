import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

// Tooling stays isolated from the application's dependency tree. See docs/github-showcase.md.
const requireTools = createRequire(
  resolve(process.env.README_TOOLS_DIR ?? 'tmp/readme-tools', 'package.json'),
);
let chromium;
let axePath;
try {
  ({ chromium } = requireTools('playwright'));
  axePath = requireTools.resolve('axe-core/axe.min.js');
} catch (cause) {
  throw new Error(
    'Install isolated Playwright/axe tooling as described in docs/github-showcase.md.',
    { cause },
  );
}
const base = process.env.BASE_URL ?? 'http://127.0.0.1:4300';
const output = resolve(process.env.SCREENSHOT_DIR ?? 'docs/screenshots');
const reportDir = resolve('tmp/readme-qa');
await mkdir(output, { recursive: true });
await mkdir(reportDir, { recursive: true });
const report = {
  capturedAt: new Date().toISOString(),
  base,
  browser: '',
  screenshots: [],
  audits: [],
  checks: [],
  errors: [],
  warnings: [],
  live: [],
};
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_CHANNEL
    ? { channel: process.env.BROWSER_CHANNEL }
    : process.platform === 'win32'
      ? { channel: 'msedge' }
      : {}),
});
report.browser = browser.version();
const routes = [
  ['/', 'Aditya Kirtane', 'home'],
  ['/about', 'The full story', 'about'],
  ['/experience', 'Top moments', 'experience'],
  ['/skills', 'My skill universe', 'skills'],
  ['/projects', 'AK originals', 'projects'],
  ['/projects/ready-inventory', 'Ready Inventory', 'project-detail'],
  ['/contact', 'Let’s build something great', 'contact'],
];
const slugs = [
  'slingsip',
  'ready-inventory',
  'ready-salesman',
  'customer-portal',
  '911care',
  'collabspace',
];
const normalize = (text) => text.replace(/\s+/g, ' ').trim().toLowerCase();

function monitor(page, label) {
  page.on('pageerror', (error) => report.errors.push(`${label}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') report.errors.push(`${label}: ${message.text()}`);
    if (message.type() === 'warning') report.warnings.push(`${label}: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400)
      report.errors.push(`${label}: HTTP ${response.status()} ${response.url()}`);
  });
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(2300); // Includes the journey overview's staggered reveal; no styles are overridden.
  await page.waitForFunction(() => !document.querySelector('.route-transition.is-active'));
}

async function inspect(page, label, audit = true) {
  const state = await page.evaluate(async () => {
    await Promise.all(
      [...document.images]
        .filter((image) => image.complete)
        .map((image) => image.decode().catch(() => {})),
    );
    return {
      width: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      headings: document.querySelectorAll('main h1').length,
      broken: [...document.images]
        .filter((image) => image.complete && !image.naturalWidth)
        .map((image) => image.src),
      headingFocused: document.activeElement?.tagName === 'H1',
    };
  });
  assert.ok(
    state.scrollWidth <= state.width + 1,
    `${label}: horizontal overflow ${JSON.stringify(state)}`,
  );
  assert.equal(state.headings, 1, `${label}: expected one main h1`);
  assert.deepEqual(state.broken, [], `${label}: broken images`);
  report.checks.push({ label, ...state });
  if (audit) {
    await page.addScriptTag({ path: axePath });
    const result = await page.evaluate(async () => {
      const result = await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
      });
      return {
        violations: result.violations.map(({ id, impact, nodes }) => ({
          id,
          impact,
          targets: nodes.map((node) => node.target),
        })),
        incomplete: result.incomplete.map(({ id }) => id),
      };
    });
    report.audits.push({ label, ...result });
    assert.deepEqual(
      result.violations,
      [],
      `${label}: axe violations ${JSON.stringify(result.violations)}`,
    );
  }
  await writeFile(
    resolve(reportDir, 'browser-report.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
}

async function visit(page, path, heading) {
  const response = await page.goto(new URL(path, base).href, { waitUntil: 'networkidle' });
  assert.equal(response?.status(), 200, `${path}: did not load`);
  if (path === '/') {
    const skip = page.getByRole('button', { name: /skip intro/i });
    if (await skip.isVisible()) await skip.click();
    await page.locator('#home-title').waitFor();
  }
  await page.locator('main h1').waitFor();
  if (heading)
    assert.equal(normalize(await page.locator('main h1').innerText()), normalize(heading));
  await settle(page);
}

async function capture(page, filename, label) {
  const fullPage = !filename.includes('navigation');
  if (fullPage) {
    // Scroll real content into view so lazy images and once-only section reveals finish.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += page.viewportSize().height / 2) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(120);
    }
    await page.waitForFunction(() => [...document.images].every((image) => image.complete));
    await settle(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await settle(page);
  }
  await inspect(page, label);
  await page.mouse.move(-20, -20);
  await page.waitForTimeout(150);
  await page.screenshot({ path: resolve(output, filename), fullPage });
  report.screenshots.push({
    filename,
    label,
    viewport: page.viewportSize(),
    motion: 'no-preference',
  });
  console.log(`Captured ${filename}`);
}

try {
  for (const [device, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
      ...(device === 'mobile' ? { isMobile: true, hasTouch: true } : {}),
    });
    const page = await context.newPage();
    monitor(page, device);
    if (device === 'desktop') {
      await page.goto(base, { waitUntil: 'load' });
      // Capture the fully revealed intro before its real automatic exit, without freezing GSAP or delaying assets.
      await page.waitForFunction(
        () => {
          const subtitle = document.querySelector('[data-intro-subtitle]');
          const portrait = document.querySelector('[data-intro-portrait]');
          return (
            subtitle &&
            portrait &&
            Number(getComputedStyle(subtitle).opacity) >= 0.99 &&
            Number(getComputedStyle(portrait).opacity) >= 0.99
          );
        },
        null,
        { timeout: 5000 },
      );
      await page.screenshot({ path: resolve(output, 'portfolio-intro-desktop.png') });
      report.screenshots.push({
        filename: 'portfolio-intro-desktop.png',
        label: 'Actual intro reveal',
        viewport,
        motion: 'no-preference',
      });
      await page.locator('#home-title').waitFor({ timeout: 10000 });
      assert.equal(
        await page.locator('#home-title').evaluate((el) => el === document.activeElement),
        true,
      );
      report.checks.push({ label: 'Automatic intro completes and focuses Home', passed: true });
    }
    for (const [path, heading, filename] of routes) {
      await visit(page, path, heading);
      if (
        device === 'desktop' ||
        ['home', 'projects', 'project-detail', 'contact'].includes(filename)
      ) {
        await capture(page, `portfolio-${filename}-${device}.png`, `${device} ${path}`);
      } else await inspect(page, `${device} ${path}`);
      if (device === 'mobile' && path === '/') {
        const menu = page.getByRole('button', { name: 'Menu', exact: true });
        await menu.click();
        await page.getByRole('button', { name: 'Close menu', exact: true }).waitFor();
        await settle(page);
        await capture(page, 'portfolio-navigation-mobile.png', 'mobile open navigation');
        await page.keyboard.press('Escape');
        assert.equal(await menu.getAttribute('aria-expanded'), 'false');
        assert.equal(await menu.evaluate((el) => el === document.activeElement), true);
        await menu.click();
        await page
          .getByRole('navigation', { name: 'Primary', exact: true })
          .getByRole('link', { name: 'Projects', exact: true })
          .click();
        await page.waitForURL('**/projects');
        await settle(page);
        assert.equal(await menu.getAttribute('aria-expanded'), 'false');
        assert.equal(
          await page.locator('main h1').evaluate((el) => el === document.activeElement),
          true,
        );
        report.checks.push({
          label:
            'Mobile menu: Escape restores focus; route selection closes menu and focuses heading',
          passed: true,
        });
      }
    }
    for (const slug of slugs) {
      await visit(page, `/projects/${slug}`);
      await inspect(page, `${device} detail ${slug}`);
      assert.equal(
        await page.locator('#primary-navigation a[href="/projects"]').getAttribute('aria-current'),
        'page',
      );
      // Real scrolling activates below-the-fold images and ScrollTrigger content before inspecting.
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += viewport.height / 2) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(100);
      }
      await settle(page);
      await inspect(page, `${device} scrolled detail ${slug}`, false);
    }
    await visit(page, '/projects/no-such-project', 'Project not found');
    await inspect(page, `${device} unknown project`);
    await page.getByRole('link', { name: 'Back to Projects', exact: true }).click();
    await page.waitForURL('**/projects');
    await page.goBack();
    await page.waitForURL('**/projects/no-such-project');
    await page.goForward();
    await page.waitForURL('**/projects');
    await visit(page, '/contact');
    const download = page.waitForEvent('download');
    await page.getByRole('link', { name: /download resume/i }).click();
    const pdf = await download;
    assert.equal(pdf.suggestedFilename(), 'Aditya-Kirtane-Resume.pdf');
    assert.equal((await readFile(await pdf.path())).subarray(0, 5).toString(), '%PDF-');
    report.checks.push({
      label: `${device} native resume download, PDF signature and filename`,
      passed: true,
    });
    await page.keyboard.press('Tab');
    await page.getByRole('link', { name: 'Skip to content', exact: true }).focus();
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).pathname, '/contact');
    assert.equal(await page.locator('main').evaluate((el) => el === document.activeElement), true);
    report.checks.push({
      label: `${device} keyboard skip preserves inner route and focuses main`,
      passed: true,
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [path, heading] of routes) {
      await visit(page, path, heading);
      await inspect(page, `${device} reduced ${path}`);
      assert.equal(await page.locator('app-cursor').isVisible(), false);
    }
    await page.emulateMedia({ forcedColors: 'active' });
    await visit(page, '/contact');
    await inspect(page, `${device} forced colors contact`);
    await page.emulateMedia({ forcedColors: 'none' });
    await visit(page, '/unrecognized-url', 'Aditya Kirtane');
    assert.equal(new URL(page.url()).pathname, '/');
    await visit(page, '/design-system', 'Aditya Kirtane');
    assert.equal(new URL(page.url()).pathname, '/');
    report.checks.push({
      label: `${device} unknown route and production design-system redirect Home`,
      passed: true,
    });
    await context.close();
  }
  // Optional, separate evidence. The gallery always captures the local build above.
  if (process.env.VERIFY_LIVE_URL) {
    const page = await browser.newPage();
    for (const path of ['/', '/about', '/projects/ready-inventory', '/contact']) {
      try {
        const response = await page.goto(new URL(path, process.env.VERIFY_LIVE_URL).href, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });
        if (path === '/') await page.locator('#home-title').waitFor({ timeout: 10000 });
        report.live.push({
          path,
          status: response?.status(),
          url: page.url(),
          heading: await page.locator('main h1').innerText(),
        });
      } catch (error) {
        report.live.push({ path, error: error.message });
      }
    }
    await page.close();
  }
  assert.deepEqual(report.errors, [], 'Browser console/runtime/network errors; inspect report.');
} catch (error) {
  report.failure = error.stack;
  throw error;
} finally {
  await writeFile(
    resolve(reportDir, 'browser-report.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  await browser.close();
  console.log(`Diagnostics: ${resolve(reportDir, 'browser-report.json')}`);
}
