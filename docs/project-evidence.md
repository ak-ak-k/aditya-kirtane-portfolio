# Project content and public evidence

Reviewed 20 October 2026 against local commit `4ffba23` and the public links below.
This review adds documentation; it does not change published professional history,
project configuration, artwork, or the portfolio’s case-study content.

## Separate the evidence layers

The portfolio implements browsing, navigation, case-study rendering, and native contact/
download actions. Descriptions of inventory systems, healthcare integrations, mobile
apps, databases, and payment providers describe the featured projects. They are not
runtime capabilities of the portfolio.

All six project covers in `src/assets/projects/covers/` are supplied artwork. Baked-in
cover text is not implementation evidence. `docs/screenshots/` contains genuine browser
captures of the portfolio pages, including those artworks inside the interface. No
screenshots of external project applications were captured or fabricated in this task.

## Current catalog

| Slug              | Current page evidence                                                                                                           | Limit                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `slingsip`        | Catalog identity, artwork, collection overview, neighbors                                                                       | Existing page has no technical case-study sections. New public documentation is available separately below. |
| `ready-inventory` | Configuration cites résumé p1 project and Onelife production-SPA contribution; inventory, RBAC, NgRx analytics, product link    | No public implementation repository independently established in this review.                               |
| `ready-salesman`  | Configuration cites résumé p1–2; full-stack contribution, mobile/offline/location workflows, REST API, admin component map      | Do not assign an employer; no public repository/demo URL is supplied by the implemented page.               |
| `customer-portal` | Configuration cites résumé p1 and Onelife context; invoices, statements, payments, WebRTC, rendering optimization, product link | The 35% metric belongs to this résumé-described table optimization, not portfolio performance.              |
| `911care`         | Configuration cites résumé p2 and Onelife context; healthcare/app/admin integrations, Android listing                           | No new client, topology, credential, or production metric is inferred.                                      |
| `collabspace`     | Catalog identity, artwork, collection overview, neighbors                                                                       | Stack, product classification, architecture, and features remain unverified.                                |

The four richer entries preserve existing source-attributed descriptions rather than
claiming a fresh audit of their implementations. Their current source notes are in
[`projects.config.ts`](../src/app/features/projects/projects.config.ts) and
[`project-detail.config.ts`](../src/app/features/projects/project-detail/project-detail.config.ts).
The owner intentionally publishes the linked résumé; no additional private data is added.

## SlingSip: public evidence has advanced

The public [SlingSip repository](https://github.com/ak-ak-k/SlingSip) now documents a
local-first desktop hydration companion built with Angular and Electron. Its README
describes reminders, a tray/background lifecycle, a hydration dashboard, local records,
and an animated companion. That repository also supplies its own architecture and
dated QA limitations. This is enough to identify the product and link readers to
trustworthy first-party documentation.

It does not mean those features are implemented in this portfolio, nor that this review
reran SlingSip’s tests or verified all its implementation claims. The portfolio’s
`slingsip` route remains the existing short collection entry. Integrating a fuller
technical case study is a separate content update; it was not needed to capture or
document the current site, and product content was intentionally preserved.

The older [showcase](projects.md) and [case-study](project-details.md) guides accurately
record the source limits at their earlier checkpoints. Their statement that SlingSip
documentation was unavailable is historical; it should not be read as a current claim
about the public repository.

## CollabSpace and external destinations

The exact public path `https://github.com/ak-ak-k/CollabSpace` returned 404 in this
review. This does not establish that no implementation exists: it could be private,
renamed, or elsewhere. No guessed repository is linked from the README, and the page
retains its identity-only description.

The implemented external project destinations are:

- [Ready Inventory product](https://readybusiness.in/)
- [Customer Portal](https://customerportal.readybusiness.in)
- [911Care Android listing](https://play.google.com/store/apps/details?id=com.fch.care911&hl=en_IN)

These are the existing résumé-annotation destinations recorded by the earlier feature
work. Source attribution does not guarantee availability or authenticate current
external application content. No requests submit forms, send messages, authenticate,
or mutate those products during the portfolio review.
