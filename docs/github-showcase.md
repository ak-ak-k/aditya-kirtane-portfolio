# GitHub showcase: captures and current verification

Review date: **20 October 2026 (Asia/Kolkata)**. Source baseline: `main`, commit
`4ffba23` (`project page list`), with a clean working tree before this documentation
task. README, documentation, genuine screenshots, and local QA tooling are the intended
changes. Application code, content, styles, timing, assets, manifests, and lockfile are
preserved. No commit, push, deployment, DNS change, or external message was performed.

## Presentation review

The [SlingSip README](https://github.com/ak-ak-k/SlingSip) was reviewed as the owner’s
presentation reference: introduction, real screenshots, experience descriptions,
technology rationale, engineering details, Mermaid diagrams, setup, QA caveats,
structure, and author links. This portfolio adapts that editorial approach to a personal
developer website; desktop-app features and test totals are not transferred here.

The root README now provides the verified professional headline, live-site entry point,
source versions, screenshot galleries, route guide, architecture, engineering decisions,
project evidence boundaries, setup/preview commands, deployment requirements, and a
documentation index. Existing detailed guides remain intact.

## Environment

| Item                       | Executed environment                                  |
| -------------------------- | ----------------------------------------------------- |
| Platform                   | Windows; PowerShell; headless Microsoft Edge          |
| Node                       | 24.19.0, bundled runtime                              |
| npm                        | 11.9.0; manifest declares npm 11.19.0                 |
| Browser                    | Edge 155.0.4283.62                                    |
| App dependencies           | Installed with `npm ci`, committed lockfile unchanged |
| Isolated browser tools     | Playwright 1.63.0, axe-core 4.11.0                    |
| Documentation verification | Mermaid 11.12.0, markdown-it 14.1.0                   |

The default system Node is 24.14.0 and is below the locked Angular engine range.
The first dependency install succeeded but emitted engine warnings because the system
npm launcher selected that Node despite a process-local PATH change. Subsequent checks
invoke npm’s CLI through Node 24.19.0 explicitly and put that runtime first on PATH for
child scripts. No machine-wide runtime configuration was changed. The project accepts
Node `^22.22.3 || ^24.15.0 || >=26.0.0` according to the locked Angular packages.

## Current verification

### Build and types

- `npm run build`: passed, without budget warnings; initial output **278.67 kB**,
  estimated transfer **77.14 kB**, global CSS **16.18 kB**. Feature routes, cursor
  tracking, and route animator are separate lazy chunks. These are builder estimates.
- `npm run typecheck`: passed for application and spec TypeScript configurations.
- No application dependency, test, or production budget was modified.

### Unit tests: failing evidence retained

Two complete `npm run test:ci` executions both exited 1:

| Run     | Test files               | Collected tests                       |
| ------- | ------------------------ | ------------------------------------- |
| Initial | 20 passed, 4 failed / 24 | 149 passed, 2 failed, 2 skipped / 153 |
| Rerun   | 18 passed, 6 failed / 24 | 143 passed, 3 failed, 7 skipped / 153 |

Both runs fail with `TypeError: _win.matchMedia is not a function` while GSAP registers
ScrollTrigger from `src/app/animations/gsap.ts:4`. Some spec files import components/
effects before their `beforeAll` media-query stubs; GSAP captures a jsdom window without
that API. The exact failing suites vary between runs. The historical
[experience redesign report](experience-redesign.md) also records an earlier
matchMedia setup/import-order failure. The precise shared-window/import lifecycle
needs a focused test-harness investigation; this review does not claim a fix.

Initial affected files: `app.routes.spec.ts`, `core/services/ui-state.spec.ts`,
`features/about/about-animation.spec.ts`, and
`features/projects/project-detail/project-detail-animation.spec.ts`.
The rerun affected `app.routes.spec.ts`, `animations/gsap.spec.ts`,
`features/contact/contact-animation.spec.ts`, `features/skills/skills-animation.spec.ts`,
`features/home/home-landing/home-landing.spec.ts`, and
`layout/page-transition/page-transition-animation.spec.ts`.
Collection stops early for some suites, so 153 is not a claim about the full intended
test count. No test was hidden, removed, or rewritten. Historical passing totals of
167/168/170/187 refer to dated checkpoints, not the current run.

### Browser and accessibility

The reusable capture script completed successfully against local **production output**,
served by `scripts/preview-production.mjs` at `http://127.0.0.1:4300/`:

| Evidence                        | Current result                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------- |
| Screenshots                     | 13 captured: 8 desktop and 5 mobile; none missing                               |
| Automated axe audits            | 45 completed, zero violations                                                   |
| Recorded browser checks         | 65 entries covering page states and interaction assertions                      |
| Browser console/runtime/network | Zero recorded errors or warnings; no broken image or overflow assertions failed |
| Separate live browser checks    | Root, About, Ready Inventory, Contact: HTTP 200 and expected rendered headings  |

Of the axe audits, 38 retain `color-contrast` in the incomplete/review-needed list.
These are not counted as violations, and automated tooling has not established contrast
for every layered/background case. Existing contrast tokens and forced-color paths were
inspected, but this review does not replace a complete manual contrast certification.

Coverage includes all six main pages and all six project details at desktop/mobile,
active Projects state, unknown-slug recovery, browser Back/Forward, intro completion
and skip, destination focus, mobile menu/Escape behavior, a keyboard skip link that
preserves the inner route, real résumé download/PDF header/filename, reduced-motion
routes, forced-color Contact, production design-system exclusion, and wildcard redirect.
Image/network/console checks and horizontal overflow assertions run alongside axe.

Supplemental read-only keyboard journeys passed at 1440 and 390 px with both motion
preferences: focus a menu/section control, activate it with Space/Enter, traverse all
primary routes, verify active links and destination H1 focus, return Home without Intro,
then refresh to observe Intro again. These use programmatically placed focus plus real
keyboard activation; they do not claim a complete manual Tab-order or screen-reader audit.
Additional reduced-motion layout checks passed six representative pages at 320 px
(About, Experience, Skills, Projects, Ready Salesman, Contact) and Experience at 768 px.
These supplemental checks are separate from the 45 axe audits/65 capture-run entries.
Their script/report remain in ignored `tmp/readme-qa/`.

`npm start -- --port 4301 --host 127.0.0.1` also started successfully; the development
`/design-system` rendered its expected heading with HTTP 200. Production preview checks
returned 404 for a nonexistent PNG, a reference mockup, and the original source portrait,
confirming that the SPA fallback does not turn missing/excluded assets into HTML.

Automated axe checks include WCAG 2 A/AA, WCAG 2.1 A/AA, and best-practice tags with
no disabled rules. They are scoped automated checks, not an accessibility score or
complete manual WCAG certification. `incomplete` rule IDs are preserved in diagnostics
for review. The brief animated Intro is visually checked; it is not counted as a
stable-state axe audit. No current Lighthouse, real-user performance, screen-reader,
Safari/Firefox, 200% zoom, or broad browser certification is claimed.

### Live deployment

The repository’s public [About panel](https://github.com/ak-ak-k/aditya-kirtane-portfolio)
advertises [this portfolio URL](https://aditya-kirtane-portfolio.vercel.app/).
The web text-fetch tool could not access it, so verification used real headless Edge.
Direct visits to `/`, `/about`, `/projects/ready-inventory`, and `/contact` returned
HTTP 200, rendered the expected H1s, and produced their expected document titles.
This supports the README’s live link. No deployment configuration exists in this
checkout and the deployed commit was not established. The gallery remains a local
production capture, not a claim that a new deployment occurred.

## Screenshot inventory

The documentation verification script confirmed **85 local file/anchor references**,
all **13 PNGs**, and **two Mermaid diagrams** (syntax parsed and SVG rendered). All
**23 unique external URLs** referenced by the reviewed documents returned HTTP 200,
including the four technology badges. The local Markdown preview was visually reviewed.
External HTTP success does not authenticate product details or bypass a possible
LinkedIn challenge page.

The 13 PNG files under `docs/screenshots/` are real Playwright captures. Desktop
viewport is **1440 × 900**; mobile is **390 × 844** with touch/mobile emulation and
device scale factor 1. Content pages use full document height; PNGs retain their actual
captured dimensions. Intro and the expanded mobile menu use viewport captures.

| File                                   | View                                                  |
| -------------------------------------- | ----------------------------------------------------- |
| `portfolio-intro-desktop.png`          | Fully revealed Intro before its actual automatic exit |
| `portfolio-home-desktop.png`           | Canonical Home, portrait, CTAs, launchers             |
| `portfolio-about-desktop.png`          | About, strengths, domains                             |
| `portfolio-experience-desktop.png`     | Career timeline and journey overview                  |
| `portfolio-skills-desktop.png`         | Skills categories and Angular focus                   |
| `portfolio-projects-desktop.png`       | Complete six-entry catalog                            |
| `portfolio-project-detail-desktop.png` | Ready Inventory reusable case study                   |
| `portfolio-contact-desktop.png`        | Contact actions/cards                                 |
| `portfolio-home-mobile.png`            | Stacked Home                                          |
| `portfolio-navigation-mobile.png`      | Expanded mobile navigation                            |
| `portfolio-projects-mobile.png`        | Single-column catalog                                 |
| `portfolio-project-detail-mobile.png`  | Stacked Ready Inventory case study                    |
| `portfolio-contact-mobile.png`         | Mobile contact actions/cards                          |

No requested capture is intentionally omitted. The Intro’s progress/status is part of
the implemented experience; its screenshot is taken after identity content has revealed,
not during Angular startup. The script does not freeze GSAP, delay images, mock network
responses, replace assets, or inject screenshot-only CSS. It waits for fonts/images,
uses real scrolling to activate below-fold content, and waits for motion to finish.
No resizing or visual retouching is applied. Screenshot PNGs use lossless compression.
All 13 final PNGs were visually inspected for complete content, portrait/artwork rendering,
readable layout, and mobile wrapping. A lossless PNG recompression reduced the set from
5,860,354 to **5,546,065 bytes** (about 5.29 MiB), without changing dimensions or pixels.

## Reproduce the captures

Activate a compatible Node runtime first. Install app dependencies and build normally:

```bash
npm ci
npm run build
node scripts/preview-production.mjs
```

Keep that local preview running. In another terminal, install isolated documentation
tools under the already ignored `/tmp` directory; this does not modify the app manifest
or lockfile:

```bash
npm install --prefix tmp/readme-tools --no-save --package-lock=false playwright@1.63.0 axe-core@4.11.0 mermaid@11.12.0 markdown-it@14.1.0
node scripts/capture-readme-screenshots.mjs
node scripts/verify-readme.mjs
```

On Windows the scripts use installed Microsoft Edge. On other platforms, install the
matching Chromium once with `node tmp/readme-tools/node_modules/playwright/cli.js install chromium`.
`BROWSER_CHANNEL` can select another installed Chromium-family browser; unset it for
bundled Chromium off Windows. The script is intended to run from the repository root.

| Optional environment variable | Purpose                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `BASE_URL`                    | Capture an explicitly selected server instead of `http://127.0.0.1:4300`     |
| `PORT`                        | Production preview port; update `BASE_URL` to match                          |
| `README_TOOLS_DIR`            | Isolated package directory instead of `tmp/readme-tools`                     |
| `SCREENSHOT_DIR`              | Alternate PNG output directory for a comparison run                          |
| `BROWSER_CHANNEL`             | Installed browser channel, e.g. `msedge` or `chrome`                         |
| `VERIFY_LIVE_URL`             | Add separate read-only checks of the live root and representative deep links |

Captures overwrite only the named output screenshots; review every PNG before including
it in a commit. Smoke checks download the published résumé into Playwright’s temporary
download area; they do not submit contact actions or mutate application data.
The local preview binds only to loopback and is a QA helper, not a deployment server.

Diagnostics are written to the ignored `tmp/readme-qa/` directory:

- `browser-report.json`: browser version, viewport checks, screenshots, axe outcomes,
  incomplete rules, errors/warnings, optional live checks, and failure stack if any.
- `readme-report.json`: local links/anchors, screenshot dimensions/bytes, parsed/rendered
  Mermaid results, and external URL statuses. Non-200 external responses are recorded
  separately from missing local files; challenges/timeouts are not proof of a dead link.
- `README-preview.html`, `README-preview.png`, `architecture-*.svg`: local Markdown and
  Mermaid rendering review. This approximates GitHub styling; it is not a GitHub upload.

## Publication readiness and limitations

The documentation is intended for manual review before publication. The README openly
records failing unit tests; a stable green unit baseline is still a follow-up.
SlingSip’s public evidence is documented separately from its unchanged minimal page;
CollabSpace remains source-limited. Professional project content is inherited from the
existing résumé-backed configuration, not a fresh audit of those external applications.
No license grant or confidential implementation information is invented.

Existing historical QA/feature guides are preserved and linked. Current runtime metrics,
broader browser coverage, and deployment revision alignment remain unestablished.

## Changed-file inventory

Final review confirmed `main` remains at the original commit, source/manifests/lockfile
have no diff, script `node --check` passes, changed Markdown/JavaScript passes Prettier,
and `git diff --check` reports no whitespace errors. Windows Git emits its ordinary
LF-to-CRLF normalization notice for README; it is not a check failure. The README diff
and all new documentation/tooling were reviewed. No push or deployment occurred.

Exactly 20 intended files are changed or added; generated builds, dependency trees, and
raw diagnostic reports remain ignored. The only modified tracked file is `README.md`.

| File                                                    | Change                                                                 |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| `README.md`                                             | Rewritten repository presentation                                      |
| `docs/architecture.md`                                  | Current ownership and route-transition diagram                         |
| `docs/project-evidence.md`                              | Catalog evidence boundaries and public SlingSip update                 |
| `docs/github-showcase.md`                               | This verification, reproduction, and inventory record                  |
| `scripts/preview-production.mjs`                        | Dependency-free loopback static/SPA preview                            |
| `scripts/capture-readme-screenshots.mjs`                | Production captures and browser/axe smoke checks                       |
| `scripts/verify-readme.mjs`                             | Markdown paths/anchors, PNG metadata, Mermaid rendering, external URLs |
| `docs/screenshots/portfolio-intro-desktop.png`          | Genuine Intro capture                                                  |
| `docs/screenshots/portfolio-home-desktop.png`           | Genuine Home capture                                                   |
| `docs/screenshots/portfolio-about-desktop.png`          | Genuine About capture                                                  |
| `docs/screenshots/portfolio-experience-desktop.png`     | Genuine Experience capture                                             |
| `docs/screenshots/portfolio-skills-desktop.png`         | Genuine Skills capture                                                 |
| `docs/screenshots/portfolio-projects-desktop.png`       | Genuine Projects capture                                               |
| `docs/screenshots/portfolio-project-detail-desktop.png` | Genuine Ready Inventory case-study capture                             |
| `docs/screenshots/portfolio-contact-desktop.png`        | Genuine Contact capture                                                |
| `docs/screenshots/portfolio-home-mobile.png`            | Genuine mobile Home capture                                            |
| `docs/screenshots/portfolio-navigation-mobile.png`      | Genuine expanded mobile menu capture                                   |
| `docs/screenshots/portfolio-projects-mobile.png`        | Genuine mobile Projects capture                                        |
| `docs/screenshots/portfolio-project-detail-mobile.png`  | Genuine mobile case-study capture                                      |
| `docs/screenshots/portfolio-contact-mobile.png`         | Genuine mobile Contact capture                                         |
