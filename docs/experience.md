# Top moments — Step 7

Step 7 replaces only the lazy `/experience` placeholder. The approved Home, About,
Intro, Explorer, navbar, cursor, Signals state, route definitions, motion helper,
design system, dependencies, and supplied assets are preserved. Step 8 now adds
[My Skill Universe](skills.md). The [showcase](projects.md) and
[case studies](project-details.md) now supply Projects. Step 11 adds [Contact](contact.md)
and [route transitions](route-transitions.md). Final production QA is recorded in [final-qa.md](final-qa.md).

## Verified career content

The supplied `src/assets/resume/aditya-kirtane-resume.pdf` was extracted and read
directly. Professional Experience on page 1 verifies all companies, titles, and
dates. Key Projects on pages 1–2 corroborates product labels. The visual reference
`04-experience-top-moments.png` informed only the restrained dark/red sequence;
its dates, logos, and generated content are not published.

| Company                          | Role                           | Dates                   | Technologies                                   |
| -------------------------------- | ------------------------------ | ----------------------- | ---------------------------------------------- |
| Onelife Capital Advisors Limited | Angular Developer — MEAN Stack | May 2023–Present        | Angular, RxJS, Node.js, MongoDB, Ionic, WebRTC |
| Refr                             | Frontend Developer — Angular   | April 2022–May 2023     | Angular, Firebase, AngularFire                 |
| The Contrast                     | Angular Developer Intern       | October 2021–April 2022 | Angular, Git, GitLab                           |

Onelife's five highlights cover production SPAs (Ready Inventory, Customer Portal,
911Care), hospital nursing/inventory/billing/IPD/OPD modules, real-time sales and
inventory dashboards, Razorpay/Paytm and WebRTC integrations, and Ionic biometric,
notification, and payment features. They paraphrase Onelife's first five resume bullets.

Refr's three highlights cover CRM Store/Cart/Wallet/Rewards workflows with Firestore,
a reusable Angular component library, and Firebase CRUD/AngularFire synchronization
with cross-browser checks and API documentation. They paraphrase its three resume bullets.

The Contrast's three highlights cover reusable responsive Angular UI, CRUD/frontend
architecture contributions, and senior-team collaboration using Git/GitLab. They
paraphrase its two resume bullets. No product or achievement number is invented for
the internship.

Published metrics remain attached to their source role:

| Role    | Metric                                       | Source                      |
| ------- | -------------------------------------------- | --------------------------- |
| Onelife | 3 production Angular SPAs                    | Resume p1, Onelife bullet 1 |
| Onelife | 500+ active users                            | Resume p1, Onelife bullet 1 |
| Refr    | 15% reduction in cross-team development time | Resume p1, Refr bullet 2    |

The general summary's 25% load-time claim is omitted because it is not clearly
attributed to a company. No unsupported metric, reference-image claim, computed
tenure, or invented location appears. `Present` is the resume's current-role label;
it is not inferred from the system date.

`experience.config.ts` owns typed readonly roles, date labels/machine values,
summaries, highlights, technologies, project labels, metrics, and source notes.
Source notes stay in code; the page renders professional copy. The component does
not introduce mutable state or duplicate existing UI state.

## Structure and responsive design

One H1, “Top moments,” introduces a semantic ordered list, latest first. Each item
contains a labelled article with company/role H2, dates, summary, 3–5 highlights,
optional metric definition list, 3–6 technology tags, and optional product labels.
A final career summary closes the page. Cards are informational and have no fake
links, buttons, hover lift, or tab stops.

At 75rem and above, cards alternate left/right around a central vertical spine.
Below that, the list becomes a single column with a left-hand spine. The spine is
vertical in both layouts, so its transform uses scaleY throughout. Mobile reduces
card/header padding; dates, technologies, products, and metrics wrap naturally.
The current design-system tokens supply colors, borders, spacing, typography,
cards, badges, and the static header glow.

## Animation and lifecycle

The heading fades/rises for 0.65 seconds. Each role owns one ScrollTrigger timeline
with `start: 'top 82%'` and `once: true`: the node appears, the card fades/rises
with a subtle scale settle, and the outgoing spine segment draws from its top.
Three triggers and two segments are created. There is no pinning, scrub, scroll
hijacking, perpetual animation, hover animation, or global trigger cleanup.

`afterNextRender` starts the existing `createMotionContext` helper, scoped to the
component host. DestroyRef disposes that context on navigation. Reduced motion
skips all feature animations and shows every card/node/line immediately. Changing
the preference live reverts owned animations. Base CSS is visible, so content
remains available if motion is disabled. Animation uses only opacity/transforms
and reserves layout dimensions.

## Accessibility and assets

Dates use five valid `time` elements with `YYYY-MM` datetime values; Present is
plain text. The list retains explicit list semantics with CSS markers removed.
Decorative nodes, lines, sequence numbers, and initials are aria-hidden. Full
company names remain readable. Existing route activation focuses the H1, whose
visible focus marker follows the About treatment. Forced-color rules preserve
the focus marker, timeline, and initial borders.

No portrait, company SVG, project image, reference image, or resume is rendered or
automatically requested by this feature. Company SVGs are placeholders, so plain
text initials OL/R/TC are used. There are no fake logos, new images, fonts, icon
packages, dependencies, or asset modifications. Existing shell assets remain in use.

## Files

Created:

- `src/app/features/experience/experience.config.ts`
- `src/app/features/experience/experience.html`
- `src/app/features/experience/experience.scss`
- `src/app/features/experience/experience-animation.ts`
- `src/app/features/experience/experience-effects.ts`
- `src/app/features/experience/experience.spec.ts`
- `src/app/features/experience/experience-animation.spec.ts`
- `docs/experience.md`

Modified:

- `src/app/features/experience/experience.ts` — real page and owned lifecycle.
- `src/app/app.routes.spec.ts` — expected Experience H1 becomes Top moments.
- `README.md`, `docs/foundation.md`, `docs/design-system.md`, `docs/intro.md`,
  `docs/explorer.md`, `docs/home.md`, and `docs/about.md` — integration status.

All earlier uncommitted working changes are preserved. No other feature source,
global architecture, package, or supplied asset is changed by Step 7.

## Verification

Production build passed within existing budgets, without warnings: 276.40 kB
initial, approximately 76.05 kB estimated transfer, and a lazy 13.29 kB Experience
chunk. Strict application/test type checks and changed-file Prettier checks passed.
All 108 tests across 15 files passed, including 12 new tests.

Eleven component cases verify resume-backed ordering, companies, titles, valid dates,
highlight/tag constraints, attributed metrics, safe initials, semantics, reduced
motion, and lifecycle cleanup. One real GSAP/ScrollTrigger test verifies that context
revert removes owned triggers, preserves an unrelated trigger, restores styles,
and prevents late writes. The existing route test checks the real page through the
unchanged lazy route.

Development and production each passed six width/motion configurations: 1440×900,
768×1024, and 320×740, with normal and reduced motion. All 22 AXE audits passed
with zero violations: six full-page, four open-menu, and one 320 px / 200% text
audit per environment. Browser checks covered order, company/role/date hierarchy,
spine placement, finished reveals, route focus, active navigation, menu Escape,
live reduced-motion changes, and repeated early navigation through About/Projects.
There were no console warnings/errors, missing requests, unintended downloads,
horizontal overflow, or measured post-paint layout shifts during timeline reveals.

Desktop, tablet, and mobile screenshots were inspected. Production Home/About
round trips retained the selected profile without replaying Intro; remaining
placeholders, the development preview shell, and production preview exclusion
also passed. Browser tooling stayed in the existing temporary Playwright/axe-core
installation outside the repository.

## Before Step 8

Review `http://localhost:4300/experience` for career wording, current-role status,
metric attribution, desktop staggering, mobile reading rhythm, and subtle motion.
No implementation blocker remains. Step 8 is now implemented separately in
[My Skill Universe](skills.md); this Experience review remains applicable.
