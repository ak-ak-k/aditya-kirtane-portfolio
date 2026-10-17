# Final production QA — Step 12

> Current production startup is **Intro → Home** (16 October 2026). Profile-selector/state references below describe the earlier implementation or its dated QA. See [home-cleanup.md](home-cleanup.md) for the replacement and current verification.

**Recommendation: READY for deployment.** The final roadmap step is complete.
The approved design, content, routing, Signals state, and scoped motion architecture
are preserved. No hosting deployment, dependency, video, persistence, or new feature
was introduced. Cold mobile case-study LCP remains a documented performance limitation;
the technical and accessibility checks pass.

Audit date: 14 October 2026. Tested with the installed Node 24.21.0, npm 11.19.0,
Angular 22.2.2, TypeScript 6.0.3, Vitest 4.1.11, and headless Microsoft Edge
122.0.2365.106 on Windows. Playwright/axe-core tooling and screenshots remain outside
the repository in the existing temporary `ak-portfolio-foundation-checks/step-12`
directory. The machine's default NVM shim was not activated; checks used the installed
runtime with a temporary process-local PATH. No machine configuration was changed.

## Corrections made

- Intro's implicit grid minimum and unwrapped top row could clip Skip Intro at
  320 px with 200% text. A `minmax(0, 1fr)` column and wrapping top row resolve it.
- The long “Contribution” eyebrow could extend 2 px beyond the viewport at 200%
  text. The shared eyebrow now permits long words to wrap.
- Long technical terms in Ready Salesman's role list widened its grid at 200%
  text. Local `overflow-wrap: anywhere` resolves the intrinsic width.
- Forced colors now map semantic tokens explicitly to Canvas, CanvasText, LinkText,
  Highlight, and native button colors. This preserves system palettes, visible
  boundaries/active indicators, and accurate computed contrast in the tested browser.
  No AXE rule was disabled.
- Production now overrides the wholesale asset copy with explicit patterns. Live
  URLs and reusable CSS resources are retained; supplied source files are untouched.
- Removed the unused, unimported `RoutePlaceholder` component. Normalized formatting
  in the two TypeScript include/exclude configs without changing their settings.
- Finalized README setup/deployment instructions and linked this audit from the
  earlier step documents.

No global overflow suppression, budget increases, test removals, or design changes
were used to resolve findings.

## Final report

| #   | Area                 | Result                                                                                                                                                                                                                                            |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Project status       | Step 12 complete; approved experiences preserved.                                                                                                                                                                                                 |
| 2   | Routes               | All 12 published URLs, unknown URL, unknown slug, and production preview fallback verified.                                                                                                                                                       |
| 3   | Full journey         | Intro → Explorer → Angular Home → all primary pages → detail → next detail → Contact → Home → Switch Profile passed; all four profiles passed retention/switch checks in both motion modes.                                                       |
| 4   | Responsive matrix    | 308 distinct screen configurations passed; matrix below.                                                                                                                                                                                          |
| 5   | Mobile               | 320, 360, 375, 390, and 430 px layouts passed without horizontal overflow or unreachable controls.                                                                                                                                                |
| 6   | 200% text            | Every primary screen and all six details passed at 320 and 1440 px; final mobile-menu CTA is reachable by Tab and focus can exit.                                                                                                                 |
| 7   | Accessibility        | One H1, landmarks, heading structure, native actions, alt text, destination focus, visible focus, skip link, contrast, and 44 px action targets reviewed.                                                                                         |
| 8   | AXE                  | 234 final audit configurations: 228 production and six development; zero violations. Repeated intermediate records are excluded from this count.                                                                                                  |
| 9   | Keyboard             | Complete desktop/mobile keyboard-only journeys passed, including Enter/Space profile choice, navigation, case-study links, Contact actions, skip, and profile switching.                                                                          |
| 10  | Reduced motion       | Static readable content, zero ScrollTriggers, no route sweep, no custom cursor; complete journey passes.                                                                                                                                          |
| 11  | Forced colors        | 12 representative route/width audits passed; system-colored focus, controls, cards, timeline, architecture blocks, and active navigation inspected. Route sweep bypass verified.                                                                  |
| 12  | Build                | Production build passes without budget warnings.                                                                                                                                                                                                  |
| 13  | Typecheck            | Strict application and test TypeScript checks pass.                                                                                                                                                                                               |
| 14  | Tests                | All 187 tests across 25 files pass.                                                                                                                                                                                                               |
| 15  | Bundles              | Initial 280.93 kB / estimated transfer 77.73 kB; global CSS 16.18 kB. Lazy chunks listed below.                                                                                                                                                   |
| 16  | Performance          | Equivalent production audits cover Home, Projects, Ready Inventory, and Contact on desktop/mobile, with gzip and uncompressed baselines. No Lighthouse scores are claimed.                                                                        |
| 17  | Layout shifts        | Ordinary measured pages: CLS 0. Scripted Home entry: 0.049 desktop / 0.083 mobile. Delayed portrait/cover and fixed route layer: zero measured image/overlay-driven shift.                                                                        |
| 18  | Lazy loading/network | Fresh Home fetches no project covers, résumé, reference images, or unrelated route features. Cursor tracking stays unloaded on touch; native cover lazy loading is preserved.                                                                     |
| 19  | Animation cleanup    | Four repeated navigation cycles retain 3/3/5/6 About/Experience/Skills/Projects triggers, then zero on Contact. Window/document listener counts stay stable.                                                                                      |
| 20  | Cursor               | VIEW/OPEN/default/interactive modes, tracking, keyboard hiding, touch exclusion, live reduced-motion cleanup, and native-cursor availability pass. Pointermove does not write Signals state.                                                      |
| 21  | Navbar               | Sticky/scroll state, active Projects on details, menu aria-expanded, Escape focus return, navigation close, resize cleanup, and enlarged-text reachability pass.                                                                                  |
| 22  | Transitions          | All requested transitions, Back/Forward, rapid navigation, direct load, unknown-project recovery, media changes, and animator import failure pass without a stuck layer or pointer blocker. Cancel/error/skipped lifecycle cases pass unit tests. |
| 23  | Images/assets        | Approved 511×553 headshot only; head/chest crops retained. Reserved frames, meaningful/decorative alt, priority choices, WebP covers, and artwork labels verified. 40 production assets replace the 72-file wholesale copy.                       |
| 24  | SEO                  | Global description, English language, viewport, theme color, loaded SVG favicon, semantic headings, and route-specific titles verified. Source OG is 1200×630; no origin or OG/canonical metadata was fabricated.                                 |
| 25  | Links/downloads      | 133 link instances inspected; 11 deep-route reloads pass. Product/portal/Play Store returned 200; LinkedIn returned a CAPTCHA page. Actual PDF download/header/filename verified.                                                                 |
| 26  | Console/network      | Zero unexpected browser errors, warnings, image warnings, missing assets, or automatic downloads in final checks. Intentional failed-image/import tests produce expected fault diagnostics only.                                                  |
| 27  | Cleanup              | Removed one obsolete placeholder; production excludes development/source-only assets. No verification scripts, screenshots, logs, or packages were added to the repo.                                                                             |
| 28  | Files                | Exact Step 12 file inventory below; all earlier working changes preserved.                                                                                                                                                                        |
| 29  | Limits               | Source-limited SlingSip/CollabSpace, cold mobile cover LCP, client-rendered SEO, LinkedIn challenge, and browser/lab coverage limits are documented below.                                                                                        |
| 30  | Deployment           | Publish `dist/ak-portfolio/browser/` at `/`, use HTTPS/compression, serve static files normally, and rewrite application routes to `index.html`. Nothing was deployed.                                                                            |
| 31  | Recommendation       | **READY** for deployment with the documented limitations. No technical deployment blocker remains.                                                                                                                                                |

## Routes and content

Verified `/`, `/about`, `/experience`, `/skills`, `/projects`, `/contact`, and all six
details: `/projects/slingsip`, `/projects/ready-inventory`, `/projects/ready-salesman`,
`/projects/customer-portal`, `/projects/911care`, `/projects/collabspace`.
All 11 non-root URLs were reloaded directly with heading/focus checks; all six detail
titles and the active Projects navigation state remained correct. Unknown project
slugs show Project not found and recover through Back to Projects. Unknown top-level
URLs and production `/design-system` redirect home. Back/Forward retains app-instance
profile state; refreshing Home replays Intro and clears selection as designed.

The content review preserves the three resume-backed roles/dates and metric
attribution, About's four factual stats/six domains/eight strengths, five Skills
categories/43 entries without ratings, and the exact six-project catalog order.
No unsupported project-count, availability, version, GitHub, or case-study claim
was introduced. Contact remains native mailto/tel/LinkedIn/location/PDF actions.

Normal Intro completed in 4.65 seconds and reduced Intro in 1.72 seconds in the
end-to-end browser audit, including bootstrap and audit work. The configured reveal
is approximately 3.3 seconds; reduced hold is 900 ms, with 2-second reduced and
6-second overall safety paths. Skip, reload replay, failed portrait recovery,
progress semantics, asset cancellation, and timer cleanup pass. All 13 requested
widths were also rechecked specifically for Intro after its layout correction,
with both motion preferences.

## Responsive and visual coverage

Each row covers Intro, Explorer, Home, About, Experience, Skills, Projects, every
project detail, and Contact. Five core sizes cover both motion preferences; all
13 requested sizes cover normal motion. Enlarged text means a 200% root font size
(32 px), rather than a simulated pinch zoom that does not reflow text.

| Viewport           | Normal | Reduced | 200% text |
| ------------------ | ------ | ------- | --------- |
| 320×740            | Pass   | Pass    | Pass      |
| 360×800            | Pass   | —       | —         |
| 375×812            | Pass   | —       | —         |
| 390×844            | Pass   | Pass    | —         |
| 430×932            | Pass   | —       | —         |
| 768×1024           | Pass   | Pass    | —         |
| 820×1180           | Pass   | —       | —         |
| 1024×768           | Pass   | —       | —         |
| 1280×720           | Pass   | —       | —         |
| 1366×768           | Pass   | —       | —         |
| 1440×900           | Pass   | Pass    | Pass      |
| 1536×864           | Pass   | —       | —         |
| 1920×1080          | Pass   | Pass    | —         |
| 844×390 landscape  | —      | Pass    | —         |
| 1180×820 landscape | —      | Pass    | —         |

Programmatic viewport/document geometry checks and visual review found no final
horizontal overflow. Intentional, locally clipped cover imagery is distinguished
from layout overflow. Native 44 px actions, wrapping values, timeline, tags, case
navigation, and architecture blocks remain usable. Full desktop/mobile screenshots
of the ten requested screens were inspected for hierarchy, spacing, red balance,
consistency, and portrait safety; enlarged-text and forced-color examples were also
reviewed. Below-fold development checks use real wheel input before scrolling,
so late lazy images are not incorrectly treated as initial LCP candidates.

## Performance evidence

Lighthouse is not installed in the temporary tooling. Equivalent checks use production
resources, CDP network/CPU throttling, PerformanceObserver LCP/layout shifts/Event Timing,
AXE, console/network auditing, and manual SEO/best-practice review. These are single
lab samples, not Lighthouse category scores, field Core Web Vitals, or measured INP.

- Desktop: 1440×900, 10 Mbps down / 5 Mbps up, 40 ms latency, CPU 1×.
- Mobile: 390×844, touch, 1.6 Mbps down / 750 Kbps up, 150 ms latency, CPU 4×.
- Cold contexts, headless Edge 122, localhost static SPA fallback. Gzip applies to
  HTML/JS/CSS/SVG; supplied WebP/PDF bytes are unchanged. Uncompressed baseline retained.
- Home portal measurements use programmatic Skip/profile selection; they include
  scripted view replacements and are distinct from the natural Intro timing above.

| Page            | Desktop LCP, gzip | Mobile LCP, gzip | Desktop/mobile CLS | Observed interaction duration, desktop/mobile |
| --------------- | ----------------- | ---------------- | ------------------ | --------------------------------------------- |
| Home portal     | 2.62 s            | 2.76 s           | 0.049 / 0.083      | No event ≥16 ms / 64 ms                       |
| Projects        | 2.45 s            | 2.28 s           | 0 / 0              | 24 / 24 ms                                    |
| Ready Inventory | 0.99 s            | 4.41 s           | 0 / 0              | 24 / 32 ms                                    |
| Contact         | 0.61 s            | 2.03 s           | 0 / 0              | 32 / 48 ms                                    |

The uncompressed mobile baseline was 4.17 / 3.59 / 5.85 / 3.13 seconds LCP in the
same page order. Compression materially improves cold mobile loading. The supplied
approximately 427 kB case-study cover remains expensive on a throttled cold mobile
connection; its 4.41-second LCP is a performance limitation, not a good-vitals claim.
Smaller, visually reviewed artwork derivatives and deployed-origin measurements are
future optimization opportunities. Existing artwork quality/crops were preserved.

Home's synthetic CLS stays below 0.1 and includes programmatic Intro/Explorer/Home
swaps without a real user's recent-input exclusion. Measured ordinary pages remain
at zero. Deliberately delayed portrait and cover requests retain exactly the same
frame geometry and produce zero post-paint image shift. The fixed route overlay
also produces zero measured shift. Sampled keyboard/menu interactions remain below
200 ms; that does not establish field INP.

| Production bundle           | Raw       | Estimated transfer |
| --------------------------- | --------- | ------------------ |
| Initial total               | 280.93 kB | 77.73 kB           |
| Global CSS (included above) | 16.18 kB  | 3.59 kB            |
| Home                        | 33.89 kB  | 7.91 kB            |
| About                       | 13.15 kB  | 3.85 kB            |
| Experience                  | 13.30 kB  | 3.70 kB            |
| Skills                      | 13.23 kB  | 3.64 kB            |
| Project list                | 9.67 kB   | 2.78 kB            |
| Project detail              | 17.99 kB  | 4.87 kB            |
| Contact                     | 8.53 kB   | 2.72 kB            |
| Projects routes             | 3.99 kB   | 1.18 kB            |
| GSAP/ScrollTrigger          | 115.86 kB | 40.78 kB           |
| Optional Flip               | 24.49 kB  | 8.51 kB            |
| Cursor tracking             | 1.67 kB   | 642 B              |
| Route animation             | 657 B     | 657 B              |

Feature routes, GSAP, optional Flip, cursor tracking, and route animation retain
lazy chunk boundaries. Flip is not requested in the audited journey. Fresh Home
requests no covers, PDF, reference PNGs, noise texture, external fonts, or unrelated
feature routes. Only the first two list covers are priority/eager; the remainder
use native lazy loading. Chromium's proximity threshold requested three covers on
mobile and six on the desktop grid. A detail requests only its own cover. Native
lazy loading does not promise that every offscreen image remains unfetched.

## Asset and motion audit

All 72 supplied source assets remain unchanged: 19,503,767 bytes. Production copies
40 assets totaling 3,329,023 bytes, an **82.9% reduction**. The starter root
`public/favicon.ico` is also excluded; the live branding SVG favicon loads correctly.
Production excludes reference mockups, unused branding/company/SEO assets, source
portrait variants, the duplicate `Aditya_Resume.pdf`, content/token JSON references,
unused `home.svg` and `red-glow.svg`, and the separately bundled token CSS file.

Live logo/favicon, the approved headshot, six covers/icons, used UI masks, prepared
CSS texture/background resources, and the intended PDF remain available. The 595 kB
noise texture is retained for the reusable CSS primitive but is not requested by
portfolio pages. The six covers are approximately 424–428 kB each, the PDF is
120,418 bytes, and the headshot is 46,670 bytes. The portrait source remains
511×553; all visible uses remain head/chest/upper body. Project artwork uses the
already inspected local crop, excluding its repeated portrait and, for the two
identity-only projects, unverified baked-in descriptions. No source image is edited.

GSAP usage was reviewed in Intro, Explorer, Home, all content pages, the route layer,
and cursor. Owning contexts/DestroyRef clean feature work; matchMedia handles reduced
motion; image listeners/AbortController and generation guards prevent late writes.
No global `killAll`, pin, scrub, custom perpetual RAF loop, or interval is introduced.
Contact, Home, Intro/Explorer, cursor, and route transitions add no ScrollTriggers.
Four route cycles show stable 3/3/5/6 counts on About/Experience/Skills/Projects and
zero after leaving for Contact; Ready Salesman remains within its seven section
triggers. Listener counts are identical after each warmed cycle. Unit tests verify
unrelated trigger preservation, timer/subscription cleanup, cancellation/error/import
failure, destroyed owners, and no late mutation. This is targeted lifecycle evidence,
not an unlimited-duration heap-leak guarantee.

The CSS review preserves semantic tokens, scoped component styles, static atmosphere,
and system fonts. Existing `!important` overrides serve reduced-motion accessibility.
The only backdrop blur is the opt-in 8 px glass primitive; no expensive effect or
new repeating animation was added. No video file, video element, autoplay source,
YouTube iframe, video preload, or video library is present. A generic reset selector
for native `video` does not render or fetch video.

## Links, SEO, and deployment

| Verified destination                                                                             | Audit response                                                                |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| [ReadyBusiness](https://readybusiness.in/)                                                       | HTTP 200; product page returned.                                              |
| [Customer Portal](https://customerportal.readybusiness.in/)                                      | HTTP 200; customer portal returned.                                           |
| [911Care on Google Play](https://play.google.com/store/apps/details?id=com.fch.care911&hl=en_IN) | HTTP 200; 911Care listing returned.                                           |
| [LinkedIn](https://linkedin.com/in/adityakirtane)                                                | HTTP 200 with reCAPTCHA challenge; public profile contents were not verified. |

These are point-in-time availability checks, not uptime guarantees. External anchors
retain new-tab context and `noopener noreferrer`. Email and phone use the verified
mailto/tel destinations. Home/About/Contact consistently use
`assets/resume/aditya-kirtane-resume.pdf`; deliberate download verifies `%PDF-`,
120,418 bytes, and `Aditya-Kirtane-Resume.pdf`. No selection or navigation auto-fetches
the résumé. Actual mail/phone application launch is OS-dependent and was not exercised.

Project titles remain project-specific; global description/language/viewport/theme
and favicon are correct. The supplied `src/assets/seo/og-image.png` is 1200×630,
342,878 bytes. No deployment origin is configured, so this source-only image is not
shipped or referenced by invented absolute OG/canonical URLs. No manifest/PWA or
external font is added. Client rendering limits initial crawler/social metadata;
choose the real host before implementing deployment-specific social tags.

Publish `dist/ak-portfolio/browser/` at the domain root. Serve existing static files
with correct MIME types; return 404 for missing static assets and rewrite application
URLs to `index.html`. Deep refresh was tested with this SPA fallback. Use HTTPS,
Brotli/gzip, immutable caching for hashed JS/CSS, revalidation for HTML, and sensible
versioning/caching for unhashed assets. The installed Angular CLI accepts Node
`^22.22.3 || ^24.15.0 || >=26.0.0`; the tested choice is Node 24.21.0/npm 11.19.0.
No provider-specific files were added and nothing was deployed.

Known content enhancement opportunity: SlingSip and CollabSpace remain identity-only
entries pending verified project documentation. This does not block deployment.
Browser coverage is the installed Edge/Chromium engine with simulated widths/touch,
not physical devices, Safari, Firefox, a screen reader certification, or field vitals.
The source-limited entries, cold mobile cover performance, LinkedIn challenge, and
unconfigured deployment/social origin are the remaining documented limitations.

## Step 12 files and final checks

Modified:

- `angular.json`
- `src/app/features/home/intro/intro.scss`
- `src/app/features/projects/project-detail/project-detail.scss`
- `src/styles/_typography.scss`
- `src/styles/_accessibility.scss`
- `tsconfig.app.json`, `tsconfig.spec.json` (formatting only)
- `README.md`
- The final-QA status links in `docs/foundation.md`, `design-system.md`, `intro.md`,
  `explorer.md`, `home.md`, `about.md`, `experience.md`, `skills.md`, `projects.md`,
  `project-details.md`, `contact.md`, and `route-transitions.md`.

Created this document. Deleted the unused
`src/app/shared/components/route-placeholder/route-placeholder.ts`.
No Step 12 package or asset-source change was made. All earlier uncommitted working
changes are preserved; no commit, push, or deployment was performed.

Production build, `npm run typecheck`, all 187 tests, Prettier for application/styles/
configuration/docs, and `git diff --check` pass. The development preview passes six
width/motion audits with no image warnings; production bundles contain neither its
route nor component. Final browser checks have zero unexpected console/network
issues. The temporary static QA servers exit after checks; the development server
is available at `http://localhost:4300/`.
