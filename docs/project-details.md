# Project case studies — Step 10

One reusable standalone ProjectDetail component renders `/projects/:slug` using
typed local data. It preserves the six-project catalog order and the existing
lazy route, navbar, cursor, state, design system, and motion helper. No HTTP data
service, new package, video, embed, carousel, canvas, or later screen is introduced.

## Sources and conditional content

The current resume PDF was read directly, with link annotations extracted. The
catalog/content JSON and all supplied covers/icons were inspected. No actual project
screenshots or additional project implementation documents are present.

| Project         | Sections supported by evidence                                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SlingSip        | Identity, labelled artwork, concise collection overview, neighbor navigation                                                                              |
| Ready Inventory | Overview, contribution, inventory/RBAC/analytics features, full-stack and NgRx highlights, production outcome, product link                               |
| Ready Salesman  | Overview, full-stack contribution, offline/GPS/check-in/notification features, JWT API and live-admin highlights, component map, cross-platform outcome   |
| Customer Portal | Overview, contribution, self-service/payment/chat features, rendering and integration highlights, production outcome, attributed 35% metric, product link |
| 911Care         | Overview, contribution, healthcare/consultation/mobile-integration features, web/mobile and service highlights, production outcome, Android listing       |
| CollabSpace     | Identity, labelled artwork, concise collection overview, neighbor navigation                                                                              |

SlingSip/CollabSpace are identity-only because the repository verifies their names
and covers but not their features, stack, personal/prototype classification, or
architecture. An owner clarification was requested and remains unanswered. The
latest instruction permits shorter entries where sources are insufficient; these
pages intentionally have no technical claims. They need substantive verified content
before being treated as finished engineering case studies. Angular/Electron/IPC,
hydration scheduling, PWA, and collaboration claims are not inferred from artwork.

Ready Inventory uses resume p1 Key Projects and Onelife's production-SPA contribution.
Ready Salesman uses its p1–2 project entry, including the explicitly stated single-person
full-stack contribution. Customer Portal uses its p1 project entry and Onelife context.
911Care uses its p2 project entry and Onelife context. No company-wide 500+ user count,
summary-wide 25% claim, or Refr 15% metric is reassigned to these projects.

Customer Portal alone publishes the resume's 35% rendering improvement for large
data tables after OnPush optimization. Qualitative production/cross-platform outcomes
are kept close to the source wording. No unverified challenge/decision story, client
identity, private endpoint, credential, internal topology, or customer data is exposed.

## Data and reusable rendering

`project-detail.config.ts` owns readonly case-study content and source notes. Shared
names/types/technologies/assets remain in `projects.config.ts`. `getProjectDetail`
returns the matching summary, study, and catalog-derived neighbors or null. Required
slug input drives a computed lookup. No separate implementation exists for each project.

Hero content, overview, and navigation are shared. Contribution, feature grid,
engineering highlights, system map, outcomes, metrics, and external actions render
only when data exists. Unsupported problem/solution/challenge/gallery sections are
not forced into the page. Primary stack badges are in the hero; engineering copy
supplies additional project-specific context without an oversized technology list.

Ready Salesman's map contains four documented components: React Native/Expo field
app, Node.js/Express/JWT REST API, MongoDB storage, Angular/Socket.IO/OSRM admin
dashboard. It uses semantic HTML cards in a responsive grid. No invented deployment
topology or directional data-flow connectors are drawn. No speculative SlingSip
architecture diagram is included.

## Verified external destinations

These URLs are extracted from the matching resume PDF link annotations, not guessed:

- Ready Inventory: `https://readybusiness.in/`
- Customer Portal: `https://customerportal.readybusiness.in`
- 911Care: `https://play.google.com/store/apps/details?id=com.fch.care911&hl=en_IN`

Source attribution verifies the destinations; it does not promise future uptime.
Links open in a new tab with `rel="noopener noreferrer"`, visible external icons,
accessible new-tab text, and the existing OPEN cursor mode. No GitHub URL was verified,
so no GitHub button is shown. No external content is embedded or fetched automatically.

## Visuals, navigation, accessibility

Each route loads only its own cover, with NgOptimizedImage and reserved dimensions.
The above-fold hero artwork is priority-loaded. It is labelled Project artwork, never
screenshot. The inspected left-only crop excludes repeated portraits; the two
identity-only crops also exclude unverified baked-in text. No fake gallery is created
from a single available cover. See [projects.md](projects.md) for exact crop constraints.

The editorial hero has a visible Back to AK Originals link, one H1, verified type/category,
short summary, optional stack/actions, and artwork. Five H2/H3 content patterns keep
paragraphs readable with the existing content measure. Informational cards have no
fake controls, hover lift, or tab stops. Decorative feature icons are aria-hidden.

Previous/next links derive from catalog order, without wraparound: SlingSip has only
Next, CollabSpace only Previous. Links use RouterLink and existing VIEW mode. Slug
changes reuse the component, update all content/title/neighbors, and reinitialize
only current motion. Unknown slugs render Project not found and Back to Projects,
without loading any project image. Projects stays active on all detail routes.

The project route title resolver uses the catalog name, e.g. Ready Inventory |
Aditya Kirtane. Unknown routes use Project not found | Aditya Kirtane. Existing shell
focus behavior tracks selectedProject and focuses the new H1 on slug changes.

Desktop uses an editorial two-column hero; tablet/mobile stack it. Feature,
engineering, system-map, and neighbor grids collapse to one column on mobile.
Titles and badges wrap, images reserve their space, and focus markers support
forced colors. Reduced motion exposes all content immediately and keeps links usable.

## Animation lifecycle

The existing createMotionContext helper owns heading and once-only grouped section
reveals. Only opacity and translation animate. No pin, scrub, scroll hijack, cover
scaling, ongoing parallax, architecture motion, or global kill is introduced.
afterRenderEffect reads the computed project and registers onCleanup, which reverts
the previous context on slug changes, invalid slugs, and component destruction.
This handles reused route components as well as leaving the feature entirely.

## Files

Created in `src/app/features/projects/project-detail/`:

- `project-detail.config.ts`
- `project-detail.html`
- `project-detail.scss`
- `project-detail-animation.ts`
- `project-detail-effects.ts`
- `project-detail.spec.ts`
- `project-detail-animation.spec.ts`

Created this guide and the [showcase guide](projects.md). Updated the existing
detail component, `projects.routes.ts` title resolver, and `app.routes.spec.ts`.
The catalog gained the two minimal identity entries needed to map all six requested
routes; its list omits empty sections and uses accessible stretched CTA links.
README and earlier integration notes reflect the current routes. Earlier uncommitted
changes remain preserved; no package, supplied asset, global style, or shared
service is changed.

## Validation

Production build passed within existing budgets without warnings: 277.20 kB initial
(approximately 76.91 kB estimated transfer), 17.96 kB lazy detail chunk, 9.67 kB list
chunk, and 3.99 kB project routes/catalog chunk. No budget or dependency changed.
Strict application/test type checks, changed-file/documentation Prettier, and
`git diff --check` pass.

All 157 tests across 21 files pass. This sequence adds 36 tests beyond Step 8:
12 list cases, one list animation test, one unknown-route test, 15 detail cases,
one detail animation test, and six actual detail-route/title/state tests. Coverage
includes all catalog mappings, source-limited optional sections, image isolation,
safe external attributes, metrics, neighbor derivation, unknown recovery, reduced
motion, cleanup on reused slugs and destruction, preservation of unrelated triggers,
and no late DOM writes. Tests do not assert exact animation milliseconds.

Development and production each passed 16 detail cases: all six projects at 1440×900
with both motion preferences, plus Ready Salesman at 768×1024 and 320×740 with both.
The showcase passed six width/motion cases per environment. All 58 AXE audits
passed with zero violations: per environment, 16 detail audits, six list audits,
four open-menu audits, two 320 px / 200% text audits, and one unknown-slug audit.

Browser checks cover project-specific H1/title/type/sections, only-current-cover
requests, safe crops, reserved image frames, reveal completion, active Projects nav,
keyboard View Project activation, back/next navigation through a reused component,
live reduced motion, unknown recovery, VIEW cursor, and disabled hover scaling under
reduced motion. The final checks have no console warnings/errors, missing requests,
horizontal overflow, or measured post-paint layout shifts during reveals. Real
wheel input precedes below-fold list scrolling so synthetic scrolling does not
misclassify later lazy covers as initial LCP candidates. The leading list covers
and current detail hero alone receive priority loading.

Desktop and mobile screenshots of the case studies and showcase were inspected,
including the short identity-only entries. Production Home/About regression checks
preserve profile state and avoid Intro replay. The Contact placeholder and development
style-preview shell remain intact; the preview stays excluded from production.
Browser tooling remains in the existing temporary Playwright/axe-core installation.
The development server remains at `http://localhost:4300/projects/ready-salesman`.

## Before Step 11

Review the four technical case studies for wording, role attribution, the Customer
Portal metric, external destinations, and navigation. SlingSip/CollabSpace need
owner-verified project documentation to add substantive case-study content; they
currently contain identity only. Step 11 now supplies [Contact](contact.md) and
[route transitions](route-transitions.md), preserving slug reuse, titles, focus,
and case-study data. Final production QA is recorded in [final-qa.md](final-qa.md).
