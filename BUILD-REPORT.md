# DataQuire structural rebuild

Completed October 14, 2026, from foundation commit `40838f7`.

## Foundation and direction

The first action was to inspect Git status and history. The unfinished Operating Memorandum changes were set aside with `git stash push --include-untracked` under the name “Set aside unfinished Operating Memorandum direction before structural rebuild”. That stash remains recoverable. Implementation restarted from the clean foundation, preserving its Astro architecture and business infrastructure.

[Grepped](https://www.grepped.ai/) was inspected live in a browser and through source retrieval on October 14. Its offer, problem, catalog, process, and estimate progression informed the architecture. Its wording, yellow palette, pixel illustration, earnings claims, and seven-day payment promise were not copied.

The original site had fifteen numbered homepage scenes, repetitive custody explanations, unverified market entries, conflicting timing copy, prominent speculative statistics, a buyer journey ending in a seller CTA, and fragile forced headline breaks. The rebuild uses five homepage sections:

1. An offer, one subheading with the illustrative $20K–$5M range, and one hero CTA to `/estimator`.
2. A working-record claim and private/public data contrast, without invented AI performance statistics.
3. Eight numbered record categories, led by legal, oil and gas, semiconductors, and game development; concrete source systems and qualification guidance, including the qualified 100+ employee upper-range context.
4. Exactly three numbered process steps, one trust line, and an expandable hypothetical 30-day engagement walkthrough.
5. A value-before-commitment estimator band: about two minutes, no file uploads, a private estimate, and an explicit explanation of early contact capture.

The newsletter remains in the footer, preserving its original Ledger submission contract. The market ledger is an intentional “Contribute to the ledger” state, with no claimed transactions or visible unfinished entries.

## Brand and editorial system

- Pale mineral `#e9f0ec`, deep teal `#153b43`, terracotta `#ae422b`, and white catalog surfaces.
- Instrument Sans supplies the principal hierarchy, including display headlines. Fraunces italic provides focused emphasis. Fonts remain locally bundled and licensed through the existing font packages.
- The established DataQuire name and quire mark remain. A lightweight original SVG expands that mark into gathered leaves. No image or animation dependency was added.
- Broad contrast surfaces, restrained rules, numbered catalog entries, and simple native disclosures replace the Folio scene system.
- Motion now explains the record: one gather entrance for the hero leaves, scroll-driven Task / Correction / Outcome states, and role-token feedback in the de-identification exhibit. Pause motion and `prefers-reduced-motion` are supported. The decorative page fade was removed.
- Shared qualifications sit in one “Advisory & Legal Notes” drawer near the footer. Relevant contact-capture consent, result qualifications, and the hypothetical walkthrough label remain at the point of use.

The hypothetical walkthrough explicitly assumes clear rights, technical readiness, buyer interest, and signed terms. It states that no historical engagement or guaranteed timeline is represented. No customer names, transaction history, claimed buyer relationships, or fabricated statistics were introduced.

## Supporting pages and files

`lib/homepage.js` contains the new presentation. `lib/advisory-notes.js` contains shared disclosures. `app.js` retains functional state and event infrastructure while simplifying the estimator, buyer, security, referral, industry, and dashboard presentations. `lib/answers.js` no longer emits Folio labels. `styles.css` provides the new responsive system across all routes. Page theme metadata, favicon, social artwork, and manifest were aligned.

The buyer page uses its own intake CTA. Security explains custody once and includes a working illustrative redaction control. The estimator retains all branches, provisional entry, early contact capture, saved drafts, final confirmation, and copy-summary control. The referral page retains personal links, QR generation, print downloads, status lookup, economics, and attribution explanations. Unconnected private services remain gated and are described accurately. Legal-page source is unchanged.

The referral flyer, postcard, and pitch script were updated for color and timing consistency. PDF dimensions, links, QR destinations, and crop marks remain unchanged. Both PDFs were rendered and visually inspected.

## Functional contracts

See `docs/FUNCTIONAL-BASELINE.md` and `tests/fixtures/redesign-baseline.json`.

- All 25 established routes, plus 404 and `/r/<code>` handling.
- Exact field names, IDs, input types, required flags, select choices, and checkbox values on all submitted forms.
- Exact fourteen-key flat payload contract and configured webhook/relay endpoints.
- All valuation weights, assumptions, branch dependencies, output ranges, and contact/full payload fixtures.
- Contact capture at the existing step, shared submission ID, confirmed persistence semantics, retry behavior, and no file uploads.
- First-link attribution for twelve calendar months, 15 percent year-one referral economics, uncapped earnings, renewals, and quarterly payment terms.
- Brokerage 25–40 percent terms remain in FAQ and terms, with percentages absent from the homepage.
- Separate consent choices and analytics gating, private asset gating, and read-only referral status behavior.
- SHA-256 checks verify that seven frozen functional/configuration/server modules are byte-for-byte unchanged. A separate hash confirms the entire original privacy/terms function is unchanged.

## Verification results

`npm run verify` passes syntax checks, ESLint, TypeScript, 28 tests, production build, and static validation of all 25 routes plus 404. Checks cover unique SEO/canonical metadata, JSON-LD, main/H1 structure, semantic heading order, complete labels, private assets, forms, internal links and fragments, five-section architecture, illustrative labeling, absence of placeholders/Folio labels/em dashes, and text separation.

Production browser QA used the isolated receiver on port 4174. No fake lead was sent to Apps Script or any live service.

- All 25 routes were rendered at 375, 768, and 1440 pixels: 75 route/viewport checks, all with one H1, one main, and no horizontal overflow.
- Full screenshots of nine major routes at each size were saved in `output/qa/rebuild/`; key pages and the linked print assets were visually reviewed.
- The catalog and definition rows collapse into native disclosures at 375 and 768 pixels. Vertical rows remain keyboard-operable accordions.
- The three-step records path, required-answer validation, early contact capture, result, and final request were exercised. The result remained $243K–$972K for the frozen representative semiconductor case.
- Buyers, Partners, Contact, Session, Refer, and Ledger each reached confirmed success through the local mock receiver. Six representative records/dataset/RL/video fixtures are additionally covered by automated contract tests.
- The mobile menu, buyer navigation, redaction control, walkthrough, legal drawer, consent rejection, and motion pause/resume were exercised.
- Programmatically focused quiz H2 targets retain `tabindex="-1"`, with computed outline style `none` and width `0px`. Controls retain a visible keyboard focus rule.
- No browser console errors were observed in the final route review.

Responsive line-break corruption was traced to hidden `<br>` elements joining words. The shared HTML rendering boundary now preserves semantic whitespace after line breaks, and the hero uses natural wrapping. Regression checks cover headings, punctuation concatenation, inline emphasis boundaries, and repeated whitespace.

Machine-readable route, form, and focus evidence is in `output/qa/rebuild/`.

## Limits

Actual payout timing, buyer demand, transaction outcomes, and availability of specialists are not verified and are not represented as facts. The 30-day path is hypothetical. Legal policies still require attorney review. Authentication, private-channel access, and financial dashboards still depend on unconfigured services. Live webhook delivery was intentionally not tested; integration code and endpoint configuration are preserved, while browser submissions used mocks. Native OS reduced-motion emulation was unavailable in the browser interface; the media query was checked in source and the equivalent pause control was tested in the rendered product. Existing Netlify publication is driven by the requested Git push; a successful push alone does not confirm completion of a Netlify deployment.

## Copy and motion follow-up

The requested H1, hero subheading, and second-section H2 were applied verbatim. The social artwork was aligned with the new H1. A shared illustrative de-identification component now appears in the homepage trust area and on Security. The homepage still has five sections and exactly three process steps.

The hero leaf entrance runs once for 0.85 seconds with small staggered offsets. Scrolling updates the active task, correction, or outcome and its explanation. One passive listener schedules a single animation-frame update; cleanup removes listeners and pending work during client navigation or a motion-preference change. Reduced motion presents the full trace without scroll-driven changes. No important text waits for animation.

Production browser QA verified nonzero initial leaf transforms, their settled pose, trace stages 0 / 1 / 2 under actual scrolling, keyboard operation of the exhibit, visible control focus, scoped pressed states, status announcements, all three replacement tokens, and a static Pause motion state. Home and Security were inspected at 375, 768, and 1440 pixels in both exhibit modes with no overflow or console errors. Two regression tests cover exact requested copy, the shared exhibit, forward/reverse scroll states, listener cleanup, and the reduced-motion alternative. Evidence is under `output/qa/motion-pass/`. All frozen contract and legal-source checks continue to pass.

## Ooak review and copy tightening, October 15

The competitor review and implemented lessons are recorded in `docs/OOAK-COPY-REVIEW.md`. The requested hero, estimate caption, and first process-step copy are applied verbatim. The engagement walkthrough is now visible within the existing process section as “From first call to payout.” with “How a deal moves.” All five timeline entries remain unchanged. The two long timeline qualifications are replaced by the requested short sentences.

All user-facing “indicative” and “illustrative” labels have been removed from the site, metadata, result summary, referral pitch, and print downloads. The shared legal drawer is shorter while retaining essential limitations and linking to the existing detailed policies. Sample records remain identified as samples; no client history or successful transaction has been invented. The timeline’s retained final step identifies it as an example.

The seven frozen engineering modules, original payloads and economic calculations remain unchanged. The only terms change is “Indicative estimates” to “Estimates”; the legal-source test allows that exact replacement and hashes all remaining source against the original baseline. The baseline fixture itself is unchanged.

Verification: `npm run verify` passes all 28 tests and the 26-page production build. All 25 routes render at 375, 768, and 1440 pixels, with no horizontal overflow, old terminology, or console warnings/errors. The dynamic records result remains $108K–$432K for the tested semiconductor / 10k-to-1M / partially structured / non-exclusive / previously unlicensed scenario. Its copied summary uses “ESTIMATE”, and the programmatically focused result heading has no visible outline. No fake data reached the live webhook. The two print PDFs were regenerated, rendered, and visually inspected. Evidence is in `output/qa/copy-pass/`.

## Live private-record card, October 18

The homepage problem heading now reads “AI knows the answers. It needs the work behind them.” The private card rotates through the eight requested record types every 2.5 seconds with a 200ms opacity fade. Task, Correction, and Outcome fill in order at one-second intervals, then all dots clear before the loop restarts. The public card remains static with a softer surface and heading color.

The record list is semantic HTML containing every example once. It is not a live region, so the visual changes do not repeatedly interrupt screen readers. Without JavaScript, with `prefers-reduced-motion`, or with Pause motion, all eight examples remain visible and the complete timeline is shown. No text is removed from the accessibility tree. An intersection observer and document visibility listener suspend both animations while the card is offscreen or the tab is hidden. Navigation and motion-preference changes remove the observer, listener, and timeline timer.

Verification: the 28-test suite covers the updated copy, exact record order, sequential dots and reset, offscreen and hidden-tab suspension, cleanup, and the reduced-motion branch. The production build and all 25 route checks pass. A 21.5-second browser sample captured all eight names in order, a return to the start, all four timeline states, stable card height, and a static public card. Home was inspected at 375, 768, and 1440 pixels in live and paused modes, with no horizontal overflow. Native OS reduced-motion emulation is unavailable in the browser tool; the reduced branch is unit-tested and its equivalent Pause motion state was visually verified at all three widths. Evidence is in `output/qa/live-card/`. All frozen engineering and legal-substance checks remain passing.

## Caption restoration, October 18

The timed-loop update had dropped the three specific descriptions from the earlier scroll interaction. Restored the original Task, Correction, and Outcome wording and synchronized each caption with its matching loop stage. The overview sentence appears during reset and in the static reduced-motion/Pause motion state. The record-name rotation is unchanged. A regression assertion now checks every caption across a complete cycle and reset. All 28 tests, the production build, and static route checks pass. Browser checks at 375, 768, and 1440 pixels captured all descriptions with stable card height, no horizontal overflow, and no console warnings or errors. Evidence is in `output/qa/caption-fix/`.

## Caption pacing, October 18

Slowed the synchronized timeline and captions from one second to five seconds per stage so the descriptions have reading time. Record names continue fading every 2.5 seconds. The existing cycle, reset, pause, visibility, reduced-motion, and cleanup checks pass with the updated interval. `npm run verify` passes all 28 tests and the production build. A browser timing sample confirmed consecutive caption changes approximately five seconds apart, unchanged record rotation, and no console warnings/errors. Evidence is in `output/qa/caption-pace/`.
