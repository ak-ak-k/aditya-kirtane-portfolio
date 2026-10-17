# My skill universe — Step 8

> Current production startup is **Intro → Home** (16 October 2026). Profile-selector/state references below describe the earlier implementation or its dated QA. See [home-cleanup.md](home-cleanup.md) for the replacement and current verification.

Step 8 replaces only the existing lazy `/skills` placeholder. Routing, Home,
About, Experience, Intro, Explorer, Signals state, navbar, cursor, motion helper,
global styles, supplied assets, and dependencies remain unchanged. The
[showcase](projects.md) and [case studies](project-details.md) now supply Projects.
Step 11 now supplies [Contact](contact.md) and [route transitions](route-transitions.md).
Final production QA is recorded in [final-qa.md](final-qa.md).

## Source verification

The current `src/assets/resume/aditya-kirtane-resume.pdf` was extracted and read
directly before coding. Page 2's Technical Skills section verifies the five groups
below. Page 1 additionally verifies Azure DevOps and Docker in Onelife's delivery
work. The data records a source note for every skill; notes are not rendered.

| Category        | Published skills                                                                                                                                          | Source                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Frontend        | Angular, TypeScript, JavaScript, RxJS, NgRx, HTML, CSS, SCSS, Angular Material, Bootstrap, Tailwind CSS, PrimeNG                                          | Resume p2, Frontend                                            |
| Mobile          | React Native, Expo, Expo Router, EAS Build, React Navigation, Ionic, Capacitor, FCM, Background Geolocation, Offline-first Sync, Biometric Authentication | Resume p2, Mobile; p1 Ionic/Capacitor/FCM/biometric work       |
| Backend & APIs  | Node.js, Express.js, REST APIs, Socket.IO, WebRTC, JWT Authentication                                                                                     | Resume p2, Backend & APIs; p1–2 Key Projects                   |
| Database & Data | MongoDB, Firebase Firestore, Firebase Realtime Database, AngularFire                                                                                      | Resume p2, Database                                            |
| DevOps / Tools  | Git, GitHub, GitLab, GitHub Actions, GitLab CI/CD, Azure DevOps, Docker, NGINX, Postman, Jira                                                             | Resume p2, DevOps & CI/CD and Integrations & Tools; p1 Onelife |

There are 43 published skill items. HTML5/CSS3 and ES6+ are normalized to HTML,
CSS, and JavaScript without version claims. Tailwind/PrimeNg/JIRA are presented
with conventional Tailwind CSS/PrimeNG/Jira naming. Firebase is represented by
the precise verified Firestore and Realtime Database services. WebRTC is explicitly
described as peer communication, rather than a backend framework.

The resume also verifies AI tools (Claude/Claude Code, GitHub Copilot,
OpenAI/ChatGPT, Cursor), integrations (Razorpay, Paytm, Zoom API, Cloudinary,
OSRM), and Agile/Scrum. These are omitted to keep this page focused on the five
engineering categories. Resume certifications and versions are not repeated here.
SSR is omitted because this portfolio has no SSR implementation; no technology is
inferred from a generated reference image. No percentages, stars, ratings,
proficiency labels, or guessed years per technology are published.

## Angular emphasis

Frontend is the largest card and Angular is its sole featured skill, with a visible
“Core specialization” label, display heading, and concise production-SPA context.
Seven “In practice” topics use evidence already present in the resume or portfolio:

- Standalone components — current feature components.
- Signals — existing UI state and Home state.
- Routing — current lazy routes and production Angular SPAs.
- Reactive Forms — resume Summary and hospital modules.
- Reusable components — resume Refr component library.
- Lazy loading — existing loadComponent/loadChildren routes.
- Testing — existing Vitest component, route, and animation coverage.

`skills.config.ts` defines readonly category/skill interfaces, a closed category-ID
union, a closed local-icon path union, source notes, and Angular topics. The page is
stateless and adds no shared state or dynamic class-name generation.

## Composition and assets

The hero has the “My capabilities” eyebrow, one H1 “My skill universe,” concise
supporting copy, and an Angular Developer identity line. Its
abstract universe uses two quiet CSS orbit lines, a ring, a dot, and a restrained
red radial halo, all in one aria-hidden, pointer-transparent clipped layer. These
graphics are static under every motion preference. No canvas, particles, blur
engine, 3D scene, background image, or perpetual work is introduced.

Desktop (75rem+) uses a three-column grid: Frontend spans two columns, Mobile
occupies the third, and Backend/Data/Tools form the second row. Frontend internally
separates the Angular/technology list from engineering topics. Tablet (48rem+)
uses two columns with Frontend spanning both. Mobile uses one column in source
order. Cards and technology names wrap safely, including at 320 px / 200% text.

All cards share the existing opaque card, badge, typography, spacing, and color
tokens; only Frontend has an accent border. Cards are informational, retain the
default cursor, and have no hover lift or fake interaction. Backend's WebRTC
context and Frontend's split content provide different internal reading rhythms.

Only five existing generic category icons are used:

- `assets/icons/ui/code.svg`
- `assets/icons/ui/mobile.svg`
- `assets/icons/ui/server.svg`
- `assets/icons/ui/database.svg`
- `assets/icons/ui/gear.svg`

They use NgOptimizedImage with explicit 28×28 dimensions and empty alternatives,
inside decorative wrappers. Visible category/technology names carry meaning.
There are no supplied official technology logos, so technology items use text.
No portrait is used: skills remain the main content. No reference image, company
logo, project screenshot, resume, texture, or future-feature asset loads for Skills.
No asset or dependency is added or modified.

## Motion and accessibility

The heading fades/rises once. Five category timelines reveal each card and its
whole content group; skill items are not individually animated. Each trigger uses
`start: 'top 85%'` and `once: true`. There is no pinning, scrub, horizontal scroll,
scroll hijack, orbit motion, or global trigger cleanup.

Initialization uses afterNextRender and the existing createMotionContext helper
scoped to the host. DestroyRef reverts owned work. Reduced motion skips all feature
animations and leaves final content visible. Live preference changes also revert
animations. Base CSS is visible; motion changes only opacity and transforms.

Five H2 category headings label semantic sections; skill items and Angular topics
are lists, with explicit list semantics retained when markers are removed. Angular
and “In practice” use H3 headings. There are no fake buttons or tab stops. Existing
route activation focuses the H1 with a visible side marker, Skills navigation
retains aria-current, and the unchanged mobile menu supports keyboard/Escape.
Forced colors preserve focus and important boundaries. No distinction relies
only on color.

## Files

Created:

- `src/app/features/skills/skills.config.ts`
- `src/app/features/skills/skills.html`
- `src/app/features/skills/skills.scss`
- `src/app/features/skills/skills-animation.ts`
- `src/app/features/skills/skills-effects.ts`
- `src/app/features/skills/skills.spec.ts`
- `src/app/features/skills/skills-animation.spec.ts`
- `docs/skills.md`

Modified:

- `src/app/features/skills/skills.ts` — real page and scoped motion lifecycle.
- `src/app/app.routes.spec.ts` — expected Skills H1 becomes My skill universe.
- `README.md` and `docs/foundation.md`, `design-system.md`, `intro.md`,
  `explorer.md`, `home.md`, `about.md`, `experience.md` — integration status.

All earlier uncommitted working changes are preserved. No global style, route
definition, shared service, package, or asset is changed in Step 8.

## Verification

Strict application/test type checks and Skills/route-test formatting checks pass.
All 121 tests across 17 files pass, including 13 new Skills tests. Twelve component
cases verify title, category order, unique IDs, duplicate-free skills, source-backed
content, featured Angular, supported topics, closed icon paths, reserved image
dimensions, hidden decoration, meaningful lists, absence of scores/unsupported
claims, reduced motion, and lifecycle disposal. The real GSAP test verifies five
owned once-only triggers, no pin/scrub, preservation of an unrelated trigger,
style restoration, and no late writes. The existing route test confirms the real
page, unchanged route title, and active-section state.

Production build passed without budget warnings: 276.94 kB initial (approximately
76.84 kB estimated transfer), with a lazy 13.23 kB Skills chunk. The existing
component-style budget is retained; redundant declarations were removed rather
than raising it. Changed-source/documentation Prettier and `git diff --check` pass.

Development and production each passed six width/motion cases: 1440×900,
768×1024, and 320×740, with normal and reduced motion. All 22 AXE audits passed
with zero violations: six full-page, four open-menu, and one 320 px / 200% text
audit per environment. Browser checks covered all 43 skills, heading hierarchy,
featured Angular, grid composition, icon decoding/dimensions, safe wrapping,
finished category/group reveals, active navigation, route focus, keyboard menu
activation/Escape, visible keyboard link focus, live reduced-motion changes,
repeated early navigation through Experience/About, and default cursor mode on
informational content.

There were no console warnings/errors, missing asset requests, unintended
downloads, horizontal overflow, or measured post-paint layout shifts during
reveals. Focus appearance is measured after painting; the existing reduced-motion
CSS transition rule needs a frame before the final outline is reflected in computed
styles. Screenshots at desktop, tablet, mobile, and 200% text were inspected.
Production Home/About round trips retained the selected profile without replaying
Intro; remaining placeholders, development preview shell, and production preview
exclusion also passed. Playwright/axe-core stayed in the existing temporary
verification directory outside the repository. The development preview remains
available at `http://localhost:4300/skills`.

## Before Step 9

Review `http://localhost:4300/skills`: skill names/grouping, Angular emphasis,
desktop/tablet grid, mobile wrapping, static orbit balance, and restrained reveals.
The [showcase](projects.md) and [case studies](project-details.md) are implemented
with documented source limits. Step 11 now supplies [Contact](contact.md) and
[route transitions](route-transitions.md). Final production QA is recorded in [final-qa.md](final-qa.md).
