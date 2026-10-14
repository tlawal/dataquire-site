# DataQuire build report

Verified locally on October 14, 2026. The Astro production build compiles, all 25 content routes and the 404 page render, and the estimator's four branches pass browser acceptance tests. The supplied webhook is configured and returned acknowledgments for two clearly marked synthetic integration submissions.

This is a completed local implementation with an explicit launch-readiness audit, not a claim that every external launch requirement is satisfied. No deployment, commit, or push was performed.

## Seven-point creative brief

1. **Character:** archival, precise, composed. A gathered operating record, presented with the restraint of an advisor.
2. **Typography:** locally hosted Fraunces 600/700 with 600 italic, paired with Instrument Sans 400/500/600/700. Large editorial headlines; compact labels and folios.
3. **Color:** crisp white paper and near-black ink dominate. Cobalt #214FDB is the action color; #E6E8E4 rules and #E9EEFD accents stay cool. #070C0A grounds the cover and vault.
4. **Composition:** a cinematic cover, generous margins, ruled ledgers, numbered custody, and increasingly specific evidence. Homepage folios run 00 through 14. No stock imagery, bento layout, or invented client logos.
5. **Signature interaction:** the working de-identification exhibit replaces identifying text with role tokens while preserving the work's causal sequence. The adjacent copy states the limits of de-identification.
6. **Motion:** one primary easing, 110 ms headline stagger, 1.1-second headline reveal, 0.8-second section reveals, 3.2-second industry rotation, 5-second demand notes, and one 30-second ticker. Pause and reduced-motion paths preserve the content.
7. **Material:** matte white paper, crisp hairlines, framed document exhibits, a restrained dark grain, and an original three-leaf quire mark. Original SVGs supply the visual system instead of decorative illustrations.

## Research and design decisions

Reviewed the current [Awwwards directory](https://www.awwwards.com/websites/sites_of_the_day/) and [CSS Design Awards](https://www.cssdesignawards.com/), then inspected accessible examples [Neutomni](https://neutomni.com/) and [Lee Holmes](https://www.leeholmes.uk/). Useful principles were strong type hierarchy, decisive navigation, a structural recurring motif, numbered progression, and concrete evidence. Their palettes, loaders, pixel fonts, and ornamental interactions were not copied.

[Grepped](https://grepped.ai/) informed the clarity of the systems-first intake and separation of holder, buyer, and referral journeys. [Protege](https://withprotege.ai/) was reviewed for its builder/provider content hierarchy. No external animation timings were measured or claimed. The referenced local visual-reference board was not available; the supplied HTML was treated as the quality floor, not as an instruction source or a layout to clone.

Original assets include the quire logo, nine vertical glyphs, three-span bridge, custody diagram, redaction specimen, favicon, social image, personal referral QR, flyer, and postcard. The final subtraction pass removed the extra dark homepage ending, glass-like navigation, duplicate form questions, and partner-asset links from the main navigation.

## Routes and features

- Nine primary routes: `/`, `/estimator`, `/buyers`, `/verticals`, `/partners`, `/refer`, `/faq`, `/contact`, `/answers`.
- Security and legal: `/security`, `/privacy`, `/terms`. Privacy and Terms are direct-link-only, noindex, and excluded from navigation and the sitemap. Attorney-review flags remain visible.
- Partner assets: `/one-pager`, `/templates`, `/session`, `/dashboard`. Public workflows are co-branding/printing and a session request. Templates and dashboard access remain locked until a real identity service is connected; the dashboard specimen is explicitly demo data.
- `/scout` is unlisted, with no inbound site navigation or sitemap entry.
- Eight `/answers/*` articles are built. The reading room is not in launch navigation; FAQ remains the question hub.
- Unique metadata, canonical URLs, Open Graph/Twitter cards, Organization JSON-LD, FAQPage and BreadcrumbList where appropriate, robots, sitemap, manifest, and a real 404.

The estimator includes source-system quick picks and 19 expandable categories, Other/skip paths, optional per-system history, provenance, early contact capture, four branching models, visible assumptions, mobile concept-by-concept progression, saved answers, Back controls, and referral links. Switching type clears unrelated answers and starts a fresh submission while retaining contact details. Confirmed final delivery clears the stored draft.

Other working interactions include the homepage ledger, redaction exhibit, vertical details, partner earnings calculator, referral link/QR/copy/download, read-only referral-stage lookup, granular cookie choices, and motion pause. There are no raw-file uploads.

## Webhook and integration contract

The supplied URL is set in [config.js](/Users/larry/Documents/ChatGPT/DataQuire/config.js). Browser requests use `/api/lead`; the same-origin relay POSTs the raw flat JSON to Google with `Content-Type: application/json`. There is no action envelope and no opaque `no-cors` success shortcut. Google's `doGet` unknown-action response is unrelated to `doPost`.

Exact external top-level keys:

```text
form, name, company, email, phone, vertical, volume, labeled, exclusive,
licensedBefore, valuationLow, valuationHigh, ref, message
```

Branch details and the shared submission ID are preserved in `message`. Contact capture uses phase `contact` with zero valuation values; the final request uses phase `valuation`. Success requires a readable affirmative acknowledgment. Failures stay inline and preserve answers. The contact failure path allows continuing with a saved draft.

The relay coalesces concurrent/repeated acknowledged submissions within one server instance. Durable idempotency and reconciliation of contact/final phases must be implemented in Apps Script or a durable store. Client-side email encoding is referral context, not authentication. First-link device attribution lasts 12 calendar months; financial access and final eligibility need authenticated server records.

Netlify functions and redirects are included. Deploying only the static `dist` folder without the relay will not support form delivery.

## Verification evidence

| Check | Result |
| --- | --- |
| `npm run verify` | Passed syntax, ESLint, pricing/request type checks, 15 tests, Astro production build, and built-route validation |
| Production output | 25 content routes plus 404; 20 public sitemap entries |
| HTTP checks | All 25 routes returned 200; unknown route 404; invalid lead 400; unsupported lead method 405 |
| Browser route sweep | All 25 routes rendered one H1 and one main landmark, without horizontal overflow at 1440 px |
| Responsive sweep | 66 primary/security/legal checks across 375, 390, 768, 1024, 1440, and 1920 px; zero overflow or clipped controls/headings |
| Accessibility basics | Sequential route headings, native labeled controls, inline role-alert errors, focus styles, Enter/Space operation, and mobile step clearance checked |
| Bundle/privacy checks | No native alert calls or private partner-template contents in public bundles; legal/scout exclusions and required assets verified |
| Dependencies | `npm audit --omit=dev`: zero reported vulnerabilities |
| Lighthouse / full WCAG audit | Not measured/certified; no numerical scores or certification claimed |

Browser branch checks used an isolated local receiver in `tests/browser-server.mjs`, never the live Apps Script endpoint. These receipts verify the UI state machine, not live persistence.

| Branch | Observed result |
| --- | --- |
| Records | Systems > Contact > Details > Result; optional video inserted Step 5 of 6 and removed cleanly back to Result Step 5 of 5; Accounting example $45K-$180K |
| Dataset | Dataset > Contact > six-field Details > Result; no repeated volume/structure or video field; $81K-$324K |
| RL environment | Environment > Contact > Result; factors visible; $337.5K-$1.35M |
| Video | Video > Contact > Result; increasing hours moved $13.5K-$54K to $540K-$2.16M |
| Mobile video | Five individual concepts > Contact > Result; $36K-$144K; Step 4 of 4 clears the sticky navigation |

Also verified invalid email blocking, reload persistence, acknowledged contact advance, final receipt, repeat-submit disabling, and fresh submission after switching a completed branch. A simulated 502 in the isolated receiver produced the correct inline contact error; the saved-draft fallback advanced correctly and fit at 375 px. Co-branding updated both the one-pager header and prepared-for line; the standalone one-pager has no app navigation/footer, and print CSS hides its controls. Session validation and confirmation, the $60K to $375K earnings calculation, personal QR rendering, and referral clipboard content passed. Template copy cannot be exercised through authenticated UI until that service exists; ten complete authored templates/talk tracks remain private rather than publicly unlocked.

Two earlier authorized terminal integration tests reached the live webhook: one Contact request and one final Video Estimator request. Both used synthetic QA names, `qa@example.com`, and TEST ONLY/not-a-prospect markers. Both returned HTTP 200 with `{"ok":true}`. No real customer lead or payout is claimed. A read-only status lookup also returned a valid empty result.

Sites local-preview guidance informed browser and responsive verification. PDF skill guidance informed generation, page rendering, and visual inspection of the Letter flyer and the 6-by-4-inch postcard with 0.125-inch bleed/crop marks. Both rendered as one-page PDFs without clipping or overlap. The social image was visually reviewed as well.

Screenshots: [desktop](/Users/larry/Documents/ChatGPT/DataQuire/output/qa/home-desktop.jpg), [mobile](/Users/larry/Documents/ChatGPT/DataQuire/output/qa/home-mobile.jpg). QA servers are stopped at handoff. Run `npm run preview` to reopen the production output on port 4173.

## Definition-of-done audit and remaining launch items

The local implementation checks pass. The complete launch checklist is **not all green**:

- Pages, route metadata, coherent visual anchors, consistent estimator CTA destinations, all four estimator flows, save behavior, native form validation, honest receipts, and no-alert/private-asset checks pass.
- Intended processing, payout timelines, and valuation math remain explicitly conditional or illustrative. No fabricated testimonials, client logos, or DataQuire deal history ship.
- Five supplied market reports remain marked PLACEHOLDER until evidence is available. The airline entry links to the [Axios auction report](https://www.axios.com/2026/08/17/google-spirit-airlines-bankruptcy) and distinguishes the reported winning bid from approval and privacy review.
- GTM container/vendor configuration is missing. Meta and LinkedIn tags are not loaded. Configure and test vendor-level consent before claiming retargeting works.
- Approved-partner passwordless identity, authenticated template/dashboard services, named-account registration, financial/document access, cross-device attribution, and durable payout records still require real backend integration. No client-side unlock bypass is provided.
- A private Telegram invite URL is missing. The scout CTA reports this rather than linking to an invented channel.
- Privacy, Terms, partner economics/eligibility, buyer NDAs, specialist processing, security arrangements, and retention/deletion schedules require attorney and operational approval.
- Lighthouse targets and a complete WCAG 2.1 AA audit remain open. The browser/basic accessibility checks above are not substitutes for those measurements.

The source is ready for review and further integration work. It is not represented as a deployed or unconditionally production-ready service.
