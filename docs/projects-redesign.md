# AK Originals redesign - 22 October 2026

> CollabSpace now has a verified screenshot-based engineering case study.
> See [CollabSpace enhancement](collabspace.md); earlier CollabSpace evidence-gap notes below are historical.

This is a Projects-only enhancement based on the detailed approved-design brief.
No separate visual mockup was attached. The existing black/red tokens, shared lazy
routing, UI state, cursor, navbar, global transitions, and other feature pages remain.
Nothing was pushed or deployed.

| Report                | Result                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Structure          | Hero, Independent Builds, Professional Work, Behind This Website, existing contact CTA. Hero count is derived from PROJECTS and is seven.                                                                                                                                                                                                                    |
| 2. Independent Builds | SlingSip, NexBuy, CollabSpace. Their ownership follows the owner-confirmed brief.                                                                                                                                                                                                                                                                            |
| 3. Professional Work  | Ready Inventory, Ready Salesman, Customer Portal, 911Care. Existing descriptions, technologies, highlights, sources, and case-study claims are preserved; no new employer attribution is invented.                                                                                                                                                           |
| 4. Special showcase   | Unnumbered AK Portfolio engineering panel with architecture/source actions and a genuine current local Home screenshot in a CSS desktop frame.                                                                                                                                                                                                               |
| 5. Numbering          | 01 SlingSip, 02 NexBuy, 03 CollabSpace, 04 Ready Inventory, 05 Ready Salesman, 06 Customer Portal, 07 911Care. One decorative HTML badge per main card, none in the special showcase.                                                                                                                                                                        |
| 6. Model              | Added typed ownership, optional verified status, screenshot metadata, and explicit identity-artwork cropping. Existing type labels remain separate from ownership. PROJECTS contains seven full records; PORTFOLIO_PROJECT is separate; ALL_PROJECTS derives the lookup collection without duplicate full records.                                           |
| 7. Routes             | Existing /projects and /projects/:slug routes are unchanged. Shared lookup now resolves NexBuy and AK Portfolio with the existing detail component.                                                                                                                                                                                                          |
| 8. Neighbors          | Seven main case studies derive previous/next from PROJECTS in final order, with no wraparound. AK Portfolio has neither standard neighbor and retains Back to AK Originals.                                                                                                                                                                                  |
| 9. Screenshots        | SlingSip genuine dashboard QA capture, NexBuy genuine repository storefront capture, current local portfolio Home capture. No generated screenshot, screenshot stretch, or video.                                                                                                                                                                            |
| 10. Artwork           | Existing professional cover assets and CollabSpace name-only artwork remain labelled Cover artwork. Portraits, stale baked numbers, and unsupported CollabSpace feature/stack claims are excluded by inspected crops. Screenshot assets are separately disclosed.                                                                                            |
| 11. Desktop           | Three independent columns and four more compact professional columns from 75rem. The portfolio panel uses text left and screen right from 64rem.                                                                                                                                                                                                             |
| 12. Tablet            | Two-column project grids from 48rem, no carousel. The engineering panel stacks below 64rem.                                                                                                                                                                                                                                                                  |
| 13. Mobile            | One column, wrapping metadata row, fluid screenshots, stacked engineering panel, natural document scrolling.                                                                                                                                                                                                                                                 |
| 14. Animation         | Existing scoped hero/card reveals retained, now seven cards; two section-heading reveals and one grouped engineering reveal give ten owned once-only triggers. CSS hover uses -5px card lift, 1.025 image scale, and 4px arrow movement only for fine pointers with motion allowed.                                                                          |
| 15. Reduced motion    | Existing matchMedia context skips feature motion and restores owned styles when preference changes. All base content is visible. No pin, scrub, loop, or scroll hijacking.                                                                                                                                                                                   |
| 16. Accessibility     | One H1, section H2s, card H3s, labelled articles, native RouterLink anchors, decorative/non-focusable badges, honest image alts, safe external link attributes, and visible link/card focus.                                                                                                                                                                 |
| 17. Created           | project-list/project-card.ts/.html/.scss; portfolio-showcase.ts/.html/.scss; assets/projects/nexbuy.svg, ak-portfolio.svg; three screenshots; this report. New icons are simple code-native symbols, not claimed official logos.                                                                                                                             |
| 18. Modified          | projects.config.ts; project-list.ts/.html/.scss and its tests; projects-animation.ts and test; project-detail.config.ts/.html/.scss and its test; app.routes.spec.ts; docs/projects.md and docs/project-details.md. App routing implementation, build configuration, dependencies, and all unrelated feature source are unchanged.                           |
| 19. Tests             | Updated seven-card grouping, exact order/number associations, semantic hierarchy, screenshot/artwork metadata, source action, shared lookup, special exclusion, and case-study neighbors. Routing tests exercise all eight detail URLs. Real GSAP ownership checks ten triggers, complete cleanup, preserved unrelated trigger, and no late writes.          |
| 20. Build             | Production build passes within existing budgets, without warnings. Initial 279.12 kB; lazy list 18.65 kB and detail 22.13 kB. No build setting was changed.                                                                                                                                                                                                  |
| 21. Typecheck         | Strict application and test type checks pass.                                                                                                                                                                                                                                                                                                                |
| 22. Tests             | All 183 tests across 24 files pass. Route tests now install matchMedia before importing the GSAP-backed detail component, addressing an intermittent import-order setup failure.                                                                                                                                                                             |
| 23. AXE               | 64 production AXE audits across the main verification and final responsive rechecks pass with zero violations.                                                                                                                                                                                                                                               |
| 24. Browser           | All seven widths pass with both motion preferences; four requested detail routes pass at desktop/tablet/mobile, plus 200% text checks. Lifecycle results are recorded below.                                                                                                                                                                                 |
| 25. Limitations       | CollabSpace has owner-confirmed prototype context but no implementation repository, real UI screenshot, or verified stack. Its technical sections remain absent. Public NexBuy documentation supports the listed integrations; no purchase, security certification, or production usage is claimed. No Lighthouse scores or fictional metrics are published. |

## Evidence and visual provenance

Professional catalog records were compared against the previous Git version and
verified unchanged apart from adding ownership. Their existing resume-backed case
studies and Customer Portal metric remain intact.

- SlingSip: [public README](https://github.com/ak-ak-k/SlingSip), package.json,
  electron/shared source tree; dashboard image from
  docs/previews/final-qa-2026-10-08/overview.png (1144 x 781).
- NexBuy: [public README](https://github.com/ak-ak-k/ShoppingFrontend), package.json,
  source tree; docs/screenshots/desktop-home.jpg (1440 x 900). The README identifies
  the product as NexBuy, documents Angular/Express/MongoDB/Razorpay, and separates
  implemented flows from its roadmap. Roadmap capabilities are not copied here.
- Portfolio: this local Angular 22 repository and a 1440 x 900 screenshot of its
  current production Home view, captured with reduced motion after Intro. Focus
  was blurred for a clean image; content and appearance were otherwise unchanged.
- External destinations checked on 22 October 2026: both supplied GitHub repositories,
  the NexBuy live frontend, portfolio live site, and SlingSip product site respond
  successfully. Live apps were read only. No form, purchase, download, push, or
  deployment action was performed.

The complete before-implementation review is in the conversation. Historical Step 9,
Step 10, and 17 October numbering counts in older documents are historical; this
report defines the current collection.

## Final verification

Commands completed:

```text
npm run build
npm run typecheck
npm run test:ci
Prettier checks on all changed TS/HTML/SCSS/Markdown files
git diff --check
```

Production matrix: 1920 x 1080, 1440 x 900, 1366 x 768, 1024 x 768,
768 x 1024, 390 x 844, and 320 x 740 with normal and reduced motion. All 14
Projects configurations pass. The NexBuy, CollabSpace, Ready Inventory, and
AK Portfolio details pass at 1440, 768, and 320 px with both preferences (24 more
audits). Both motion preferences pass 320 px / 200% text on Projects, and the four
requested details pass 320 px / 200% text with reduced motion (6 more audits).
Total: **44 AXE audits, zero violations**.

Browser assertions cover collection counts, ownership sections, exact sequence,
number containment and label separation, image loading, column counts, detail
routing, active Projects navigation, H1 focus transfer, safe source links, and
absence of standard neighbors on AK Portfolio. There were no console warnings,
errors, failed asset requests, or horizontal overflow. Desktop, tablet, and mobile
screenshots were inspected, including the engineering presentation.

QA scripts, source-reference downloads, screenshots, and results remain in the
existing temporary ak-portfolio-foundation-checks directory, outside the repository.
No QA tool dependency was added to the project.

Lifecycle verification passed at 1440 and 320 px with both motion preferences.
Three repeated Projects/About round trips per configuration left zero Projects
triggers after departure, at most ten after re-entry, exactly seven main cards,
and one showcase. Live reduced-motion changes removed all owned triggers and
restored every card/showcase target to opacity 1. Real keyboard Tab/Shift+Tab focus
and Enter activation opened the SlingSip case study and transferred focus to its
H1. Post-load scrolling/revealing recorded CLS 0 in all four configurations.
The enlarged-text badge row and engineering panel were also inspected in close-up.

Final small-screen polish uses naturally wrapping card metadata and more compact
showcase action spacing; decorative CTA icons are omitted at the narrowest layout.
After this CSS refinement, twelve further full-page AXE checks passed at 320, 390,
and 768 px, both motion preferences, and 100%/200% text. Eight final desktop checks
cover 1920, 1440, 1366, and 1024 px with both preferences. Together with the 44
main-matrix/detail audits above, these verification suites contain **64 passing AXE
audits with zero violations**. Number/disclosure overlap and overflow assertions
also pass after the final metadata change. The latest production build remains
within the unchanged budgets without warnings.
