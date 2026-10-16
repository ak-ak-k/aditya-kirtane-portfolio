# AK Originals — project showcase

The lazy `/projects` route now renders a curated six-project showcase. The existing
Home, About, Experience, Skills, navbar, cursor, state, motion helper, and global
design system are preserved. Project detail behavior is documented separately in
[project-details.md](project-details.md). No video or new dependency is introduced.

## Verified catalog and evidence limits

The current resume was extracted directly, including its hyperlink annotations.
The supplied content JSON verifies the six names and cover paths. Repository-wide
search found no SlingSip or CollabSpace implementation documentation. Their generated
cover text is not treated as implementation evidence.

| Order / slug          | Published summary                                                                                 | Classification  | Technologies                                    |
| --------------------- | ------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------- |
| 1 · `slingsip`        | A build in the curated project collection                                                         | Portfolio entry | Omitted pending evidence                        |
| 2 · `ready-inventory` | Sales, purchase, and stock workflows; role-based access and NgRx analytics                        | Professional    | Angular, Node.js, Express.js, MongoDB, NgRx     |
| 3 · `ready-salesman`  | Cross-platform field sales, offline sync, GPS/photo check-ins, tracking dashboard, notifications  | Resume project  | React Native, Expo, Node.js, MongoDB, Socket.IO |
| 4 · `customer-portal` | Invoices, statements, Razorpay payments, WebRTC communication                                     | Professional    | Angular, Node.js, MongoDB, Razorpay, WebRTC     |
| 5 · `911care`         | Healthcare app/admin, prescriptions/labs, Zoom consultations, payments, notifications, biometrics | Professional    | Angular, Ionic, Firebase, Capacitor, Paytm      |
| 6 · `collabspace`     | A build in the curated project collection                                                         | Portfolio entry | Omitted pending evidence                        |

The four technical summaries paraphrase the resume's Key Projects and Professional
Experience sections. Ready Salesman's project is listed in the resume but not assigned
to a particular employer, so its label avoids inventing that relationship. SlingSip
and CollabSpace receive neither personal-product nor prototype labels without evidence.
The owner clarification remains unanswered. These two entries need verified source
content before they can become technical showcases.

`projects.config.ts` owns readonly summaries, stable closed slugs, closed cover/icon
paths, detail routes, featured flags, and source notes. Documented cards have 3–5 tags
and two highlights. Identity-only cards intentionally omit empty tag/highlight lists.
No achievement metric, live button, GitHub link, filter, carousel, or fabricated
feature is added to the list.

## Visuals and interaction

Six existing `assets/projects/covers/{slug}-cover.webp` images are 1600×900 generated
fallback artwork, not product screenshots. Six generic `assets/projects/{slug}.svg`
icons are used decoratively; the documented `icons/projects/` directory does not exist.
No real project screenshots were found.

Every supplied cover repeats a large portrait on its right. The page displays only
the inspected left region (approximately source x=0–940, y=0–470), excluding the
portrait that starts at x=970. For SlingSip/CollabSpace, the crop is narrower in height
(approximately y=190–330) and shows only the name, excluding unverified baked-in
feature/technology text. Source assets are unchanged. These crop rules apply only
to these six inspected files and must be reconsidered if covers are replaced.

The hero supplies one H1 “AK Originals,” the Featured Builds eyebrow, concise copy,
and the actual catalog count of six. A visible artwork disclosure and cover labels
avoid screenshot claims. No hero portrait is used.

Desktop uses a six-track editorial grid: SlingSip spans four tracks, Ready Inventory
two, and the remaining cards form pairs. Tablet uses two balanced columns; mobile
uses one source-ordered column. Each semantic article contains its title, visual,
type/category, supported summary, optional highlights/tags, and one View Project link.
The link's stretched pseudo-element makes the card clickable without nested anchors;
its accessible name combines the project title with View Project. Focus outlines
remain visible around both the link and its card.

Fine-pointer normal-motion hover lifts cards 4 px, scales artwork subtly, and moves
the arrow. Existing cursor tracking displays VIEW. Reduced motion disables all
hover transforms. One bottom CTA points to Contact.

## Motion, loading, routing

Heading and six card reveals use existing GSAP/createMotionContext infrastructure.
Card triggers use `top 85%`, once-only opacity/translation/subtle scale, with no pin,
scrub, parallax, horizontal scrolling, global kill, or perpetual animation. DestroyRef
reverts owned work. Base CSS remains visible; reduced motion skips feature motion.

NgOptimizedImage reserves native dimensions inside fixed-aspect wrappers. Browser
measurement identified SlingSip and Ready Inventory in the leading row as potential
LCP images across layouts, so only those two are priority-loaded. Remaining covers
are lazy-loaded; none are globally preloaded. No other feature's assets are loaded.
Known slugs route to the reusable detail pages. Unknown slugs render the simple
Project not found state and a Back to Projects link; route titles follow that state.

## Files and validation

Created `projects.config.ts`; list template/styles, effects, animation, component
tests, and animation tests under `src/app/features/projects/project-list/`; this guide.
Modified the existing list component and routing tests. Detail implementation and
additional route changes are inventoried in [project-details.md](project-details.md).

List tests cover the six catalog entries, typed/unique aligned slugs/assets, source
limits, tags/highlights, artwork semantics, genuine internal links, reduced motion,
scoped cleanup, and preservation of unrelated ScrollTriggers. Final integrated
build/test/browser results are recorded in the detail guide.

## Step 11 integration

Step 11 supplies [Contact](contact.md) and [global route transitions](route-transitions.md),
including list/detail navigation. Catalog data and source limits are unchanged.
Final production QA is recorded in [final-qa.md](final-qa.md).
