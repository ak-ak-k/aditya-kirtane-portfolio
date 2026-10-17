# Experience visual redesign ? 16 October 2026

This change is limited to Experience. Earlier uncommitted portfolio changes are preserved.

| Report item        | Implementation / result                                                                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Layout          | Desktop uses a 46:54 grid: career history on the left, Journey Overview on the right.                                                                                                                                                   |
| 2. Timeline        | Three full cards on one left-hand spine, larger glowing nodes outside cards, restrained red borders.                                                                                                                                    |
| 3. Overview        | Journey overview eyebrow, ?From Ideas / to Impact? H2, professional introduction, landscape, shared company milestones, Build / Learn / Grow. Only Impact is red in this H2.                                                            |
| 4. Landscape       | Component-level inline SVG: three mountain layers, dark foreground ridge, burgundy distance, red halo/moon, and mist. Existing design tokens supply all colors. No raster asset, dependency, video, canvas, or WebGL.                   |
| 5. Path            | Simple upward SVG curve with a restrained broad glow and normalized pathLength. GSAP reveals stroke-dashoffset once; the route continues above Onelife.                                                                                 |
| 6. Milestones      | The Contrast at bottom, Refr in the middle, Onelife at top. Both columns use EXPERIENCE_ROLES; optional journeyLabel fields belong to existing verified highlight objects. No second milestone data source.                             |
| 7. Sticky desktop  | CSS sticky on the JourneyOverview host, top 6.5rem, only at width >=75rem and height >=50rem. Visual height adapts to viewport. No GSAP pinning.                                                                                        |
| 8. Tablet          | Below 75rem, story and overview stack with natural document scrolling.                                                                                                                                                                  |
| 9. Mobile          | Same reading order, wrapping companies/dates/callouts, reduced card padding. No sticky panel or fixed visual width.                                                                                                                     |
| 10. Animation      | Existing heading and three card timelines remain; one additional once-only journey trigger reveals its heading/landscape/path and activates milestones from oldest to newest.                                                           |
| 11. Reduced motion | Existing motion helper skips feature animation, leaving cards, path, nodes, and captions fully visible. No perpetual movement.                                                                                                          |
| 12. Accessibility  | One H1, semantic ordered timeline, real company/role headings and machine-readable dates. Duplicate journey milestones and decorative SVG are aria-hidden; SVG cannot receive focus. Informational cards have no fake buttons or links. |
| 13. Content        | All verified companies, roles, dates, summaries, full highlights, technologies, products, and attributed metrics are retained. Present remains the supplied resume label.                                                               |
| 14. Activity       | Career Activity, contribution heatmap, streaks, and fabricated statistics are absent.                                                                                                                                                   |
| 15. Created        | src/app/features/experience/journey-overview.ts, journey-overview.html, journey-overview.scss; this report.                                                                                                                             |
| 16. Modified       | Experience component TS/template/SCSS, experience.config.ts, experience-animation.ts, both Experience test files, docs/experience.md. No other page, global animation, route, dependency, or asset is changed by this redesign.         |
| 17. Tests          | Added shared-milestone/accessibility checks; updated SVG and static reduced-motion expectations. Real GSAP test checks four owned triggers, context cleanup, restored styles, no late writes, and survival of an unrelated trigger.     |
| 18. Build          | Production build passes without budget warnings. Initial 278.67 kB; lazy Experience 22.00 kB. Strict application/test type checks pass. Panel component keeps each stylesheet within the existing 4 kB warning budget.                  |
| 19. Tests          | 168 tests across 24 files pass. An earlier run encountered a matchMedia setup/import ordering failure; the complete rerun passed.                                                                                                       |
| 20. Browser        | All 14 requested size/motion configurations pass, plus both 320 px / 200% text checks: 16 AXE audits, zero violations, zero horizontal overflow, no console warnings/errors or missing assets.                                          |
| 21. Visual review  | Landscape is intentionally abstract; initials are text rather than company logos. Review the mountain treatment and timeline density as aesthetic preferences. No known implementation blocker.                                         |

## Verification

Production checks covered 1920?1080, 1440?900, 1366?768, 1024?768, 768?1024, 390?844, and 320?740 with both motion preferences. The 320 px / 200% text checks also pass with both preferences. Desktop, tablet, and mobile screenshots were inspected. The initial enlarged-text overflow in the journey grid was corrected with shrinkable columns and wrapping labels before the complete matrix rerun.

Browser checks use the existing temporary Playwright/axe-core installation outside the repository. No project dependency is added. Screenshots and results are stored under the temporary ak-portfolio-foundation-checks/experience-redesign directory.

Browser lifecycle verification also completed four Experience/About round trips: no Experience triggers remain after leaving, and re-entry never creates more than four. Changing reduced motion live removes owned triggers, restores the fully drawn path, and leaves all career cards and captions opaque.

The existing Step 7 resume/source attribution remains in [experience.md](experience.md). Earlier Step 7 build and browser counts are historical.
