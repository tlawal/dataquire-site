# DataQuire functional baseline

Captured October 14, 2026 before the creative redesign. Repository inspection is the source of this document; the running production service was not submitted to or changed during the audit.

`npm run verify` passed before redesign: syntax, ESLint, TypeScript, 15 contract tests, static build, all 25 established routes plus the 404 page, unique titles/canonical URLs, JSON-LD, private-template exclusion, and required downloadable assets.

The machine-readable baseline is `tests/fixtures/redesign-baseline.json`. `tests/redesign-contracts.test.mjs` compares frozen module hashes, form contracts, branch validation, model results, complete payloads, and attribution boundaries. Presentation may change while these business behaviors remain the same.

## Architecture and integration boundaries

Astro renders a static multipage build using `src/pages/[...slug].astro` and `src/layouts/Page.astro`. `app.js` supplies rendered content, navigation, forms, saved estimator state, client event handling, consent, and route metadata. `styles.css` provides the presentation. `lib/model.js` is the valuation and payload source of truth. `lib/submission.js` verifies acknowledged delivery. `lib/webhook-proxy.js` provides the same-origin relay and restricted referral lookup. Netlify functions and development/preview middleware share those handlers. `private/partner-templates.json` must stay outside the public build and bundle.

The following frozen files are protected with SHA256 regression checks:

| File | Original SHA256 |
| --- | --- |
| `lib/model.js` | `b87f7b464c4559d872e57e8a12c36d60388d2fbebe0f5cdaa33ba2b6276bfc5a` |
| `lib/submission.js` | `caa8d9be4c5fa133550f6a6a556eb3c6cafd894caedb8827f4124745070d370b` |
| `lib/webhook-proxy.js` | `fd225ce24100067020fa358972d811b0e6bbf3b9ee44590056fd1deee4d92545` |
| `config.js` | `6ce688f1462a38a6743340d7c5ca5d7f034de5f77f4b919313c4074c0f729852` |
| `types/contracts.d.ts` | `11dd9cca930a3bf03b099b98a961aa16da3e90dd4750eb1c51faa246cb075c80` |
| `netlify/functions/lead.mjs` | `7e0465da2bdc007ce877635d2ce587e9557a40c8cc14f8428aee80807bbada77` |
| `netlify/functions/referral-status.mjs` | `b0b79799f86b2ffdb80a1fb6cf72ef6ec712ab614b996c6ec0120488f454f6c6` |

## Routes and destinations

Established page routes: `/`, `/estimator`, `/buyers`, `/refer`, `/verticals`, `/partners`, `/faq`, `/contact`, `/security`, `/privacy`, `/terms`, `/answers`, `/one-pager`, `/templates`, `/session`, `/dashboard`, and `/scout`.

Established answer routes: `/answers/company-data-value`, `/answers/sell-company-data`, `/answers/data-licensing-deal`, `/answers/licensing-vs-selling`, `/answers/is-data-licensing-legal`, `/answers/who-buys-company-data`, `/answers/data-source-guides`, and `/answers/exclusivity`.

Each page has one main landmark and one H1, a unique title and description, a canonical URL based on `https://dataquire.si`, and structured data. Privacy, terms, scout, templates, and dashboard are unlisted/noindex routes excluded from the sitemap. Unknown routes render the existing 404 behavior. Deep links and back/forward navigation must remain operational.

Primary seller CTA wording is `See what your data is worth`, with destination `/estimator`. The supporting `How it works` destination is the existing home process anchor `/#how-it-works`. Buyer, partner, referral, and session intake remain separate funnels.

`/r/<code>` resolves to the estimator and captures the encoded referral before replacing browser history with `/estimator`. Query referral `?ref=<code>` also captures attribution. Existing asset destinations remain `/downloads/dataquire-flyer.pdf`, `/downloads/dataquire-postcard.pdf`, `/downloads/dataquire-pitch.txt`, and the generated personal QR download.

## Configuration

The original `CONFIG` is frozen:

- `WEBHOOK_URL`: `https://script.google.com/macros/s/AKfycbxuzVpTCd04aEIW2jkZM6XJ7OnlwwmQag74-KguseT8gWq-zPEelGp33nOl_r-cnDfOdw/exec`
- `SUBMISSION_URL`: `/api/lead`
- `REFERRAL_STATUS_URL`: `/api/referral-status`
- `CANONICAL_ORIGIN`: `https://dataquire.si`
- `GTM_CONTAINER_ID`, `AUTH_REQUEST_URL`, `PARTNER_ASSETS_URL`, and `TELEGRAM_INVITE_URL`: empty strings.

Browser submissions use the same-origin lead relay when the webhook is configured. Clearing the webhook enables explicit demo mode, where nothing is sent and no persisted receipt is claimed. Unconfigured authentication, partner assets, and Telegram invite are explained as unavailable, without invented connected services.

The lead relay only accepts POST, caps JSON requests at 65,536 characters, and returns no-store JSON. Both API routes retain their Netlify rewrites; the referral rewrite is present in `public/_redirects`.

## Flat webhook payload

Allowed form names are `Estimator`, `Buyers`, `Partners`, `Refer`, `Contact`, `Ledger`, and `Session`.

The exact flat, ordered payload keys are:

`form`, `name`, `company`, `email`, `phone`, `vertical`, `volume`, `labeled`, `exclusive`, `licensedBefore`, `valuationLow`, `valuationHigh`, `ref`, `message`.

No endpoint credentials or new arbitrary keys belong in browser payloads. An organization value maps to the top-level company key. Estimator contact strings are trimmed. `ref` is the attributed referring email, or an empty string. `message` contains the original free-text message, if any, followed by the JSON representation of submitted fields, `submissionId`, and `submittedAt`. The relay strips unknown top-level keys before forwarding.

Estimator JSON detail keys remain `phase`, `submitType`, `contact`, `systems`, `otherSystems`, `details`, `dataset`, `env`, `video`, `indicativeRange`, `submissionId`, and `submittedAt`. RL serializes `submitType` as `env`. Fields from unrelated branches are omitted or represented by the established empty object/array values. Dataset volume and labeling are serialized as `dataset.dvolume` and `dataset.dlabeled`; records values use `details.volume` and `details.labeled`.

Delivery uses application/json, POST, CORS, redirects followed, and a 20-second browser abort. A success must have both a successful HTTP status and JSON `{ok: true}`, `{success: true}`, or `{status: "success"}`. An opaque response, unparsable response, failed status, or unacknowledged JSON is a failure. The relay has an 18-second upstream timeout. Acknowledged requests deduplicate by submission ID plus phase/form for 24 hours; in-flight duplicates share one upstream operation. Failed requests remain retryable.

## Submitted forms and identifiers

Form IDs, field names, types, required flags, and select/checkbox values are saved in the fixture and covered by regression checks. The following summary distinguishes collected data from decorative controls.

| Route / form | Required fields | Optional fields |
| --- | --- | --- |
| `/` / `Ledger` | `email` (`ledger-email`) | None |
| `/buyers` / `Buyers` | At least one `dataTypes` checkbox; `industries` (`buyer-industries`), `timeline` (`buyer-timeline`), `name` (`buyer-name`), `email` (`buyer-email`), `organization` (`buyer-org`) | `budgetRange` (`buyer-budget`) |
| `/partners` / `Partners` | `name` (`partner-name`), `company` (`partner-company`), `email` (`partner-email`), `potentialIntroductions` (`partner-intros`), `industries` (`partner-industries`) | None |
| `/refer` / `Refer` | `name` (`refer-name`), `email` (`refer-email`), `company` (`refer-company`) | `ownerContact` (`refer-owner`) |
| `/contact` / `Contact` | `name` (`contact-name`), `company` (`contact-company`), `email` (`contact-email`), `vertical` (`contact-vertical`), `message` (`contact-message`) | None |
| `/session` / `Session` | `name` (`session-name`), `email` (`session-email`), `company` (`session-company`), `preferredTime` (`session-time`) | None |

General forms keep native field validity checks plus accessible error messages and focus on invalid input. Buyer intake additionally requires at least one checked data type. Repeated submits are suppressed during a pending request and after confirmed delivery. Failure does not claim receipt. No public form accepts raw file uploads.

The referral status lookup collects email (`lookup-email`) separately from lead submission. It returns count and stage strings only, never company names, earnings, deal amounts, or documents. Invalid email returns 400. Lookup failure returns an explicit retryable error.

## Estimator state, branches, and validation

Saved state names remain:

`step`, `type`, `systems`, `showSystems`, `name`, `company`, `email`, `phone`, `vertical`, `volume`, `structured`, `exclusive`, `licensedBefore`, `companySize`, `years`, `coreSystem`, `coreYears`, `exportReadiness`, `provenance`, `hasVideo`, `format`, `updated`, `domain`, `taskCount`, `graders`, `headless`, `owned`, `capture`, `hours`, `angles`, `releases`, `futureCapture`, `submitted`, `question`, `submissionId`, `draftDelivered`, `otherSystems`, and `systemHistory`.

Fast entry additionally stores `fastSize` and `fastVertical` when used. It never replaces the full contact-capturing path. Switching type preserves contact and fast-entry values, resets step/question/submission state, and clears fields from the previous branch. Changing a completed estimate allows a new submission.

| Branch | Established flow |
| --- | --- |
| Company records | Type, Systems, Contact, Details, Result |
| Company records with video | Type, Systems, Contact, Details, Video, Result |
| Dataset | Type, Dataset, Contact, Details, Result |
| RL environment | Type, Environment, Contact, Result |
| Egocentric video | Type, Video, Contact, Result |

| Step | Required answers |
| --- | --- |
| Type | `type` |
| Systems | At least one `systems` value, including the established none-of-these response |
| Contact | Trimmed nonempty `name`, `company`, valid `email`; `phone` optional |
| Records details | `vertical`, `volume`, `structured`, `exclusive`, `licensedBefore`, `companySize`, `years`, `hasVideo`, `provenance` |
| Dataset | `format`, `volume`, `structured`, `updated` |
| Dataset details | `vertical`, `exclusive`, `licensedBefore`, `companySize`, `years`, `provenance` |
| Environment | `domain`, `taskCount`, `graders`, `headless`, `owned` |
| Video | `capture`, `hours`, `angles`, `releases`, `futureCapture` |

Contact identifiers remain `est-name`, `est-company`, `est-email`, and `est-phone`. Record identifiers remain `vertical`, `volume`, `company-size`, `years`, `core-system`, `core-years`, `readiness`, `has-video`, and `provenance`. Dataset context identifiers remain `dataset-vertical`, `dataset-size`, `dataset-years`, `dataset-exclusive`, `dataset-licensed`, and `dataset-provenance`. Optional systems use `other-systems`. Optional per-system histories use `system-years-<index>` with `data-system-history` containing the actual selected system. Years accept valid numbers between 0 and 200.

Input/select/textarea changes retain `data-estimator-field`; choice controls retain `data-choice`, `data-field`, `data-value`, `data-multiple`, and `aria-pressed`. Existing Back, Continue, saved-draft continuation, clear answers, submit, and copy-summary actions remain.

On mobile, detail concepts are shown one at a time and all required answers still validate before changing steps. State persists in `dataquire-estimator-v1` with a save timestamp. Browser storage failures fall back to memory. Clearing saved answers removes the persisted state and resets the quiz.

Continuing from Contact explicitly discloses that contact and partial answers are sent. This is a `phase: "contact"` payload with zero valuation and null indicativeRange. It uses the same submission ID as the later complete valuation. Confirmed contact delivery is not repeated. If delivery fails, answers remain saved and the user can explicitly continue with the saved draft. The completed valuation submits only from the result screen. Confirmed complete submission clears the saved estimator and marks the state submitted. Demo and failure states retain saved answers.

## Frozen valuation and eligibility

All models multiply their factors to obtain midpoint, use midpoint × 0.5 as the low value, and midpoint × 2 as the high value. These are illustrative USD ranges from `illustrative-v1`, not calibrated market prices, transactions, promises, offers, or valuation opinions.

Company records and datasets use vertical base × volume × structure × exclusivity × prior-license factor. Vertical bases: Semiconductors 180,000; Aerospace 150,000; Legal 90,000; Science labs 120,000; Accounting 60,000; Video and media 40,000; Healthcare 70,000; Insurance claims 110,000; Construction and architecture 100,000; Other 80,000. Volume factors: Under 10k 0.15; 10k to 1M 1; 1M to 100M 8; Over 100M 40. Structure factors: yes 1.5; partially 1.2; raw 1. Exclusive yes adds 1.8; previously licensed yes adds 0.6. Datasets additionally multiply actively updated yes by 1.2.

RL domain bases: customer service 60,000; software engineering 90,000; finance 70,000; legal 80,000; science/lab 100,000; other 50,000. Task factors: under 50 0.5; 50 to 500 1; 500+ 2.5. Grader factors: calibrated graders included 1.8; partial checks 1.2; no graders yet 0.7. Headless yes adds 1.5.

Video hours bases: under 10 15,000; 10-100 60,000; 100-1,000 200,000; 1,000+ 600,000. Multi-angle adds 1.5. Releases factors are yes 1.2, partial 1, no 0.7. Company records with video retain the records model; video answers are additional qualification information, not an added valuation.

Fast entry maps size to records volume: Under 30 to Under 10k; 30-199 to 10k to 1M; 200-999 to 1M to 100M; 1000+ to Over 100M. It assumes raw, nonexclusive records never previously licensed.

| Saved representative fixture | Low | Midpoint | High |
| --- | ---: | ---: | ---: |
| Structured exclusive semiconductor company records | $243,000 | $486,000 | $972,000 |
| Previously licensed construction records with video | $240,000 | $480,000 | $960,000 |
| Partially structured actively updated legal dataset | $64,800 | $129,600 | $259,200 |
| Science/lab RL environment, 500+ tasks, calibrated graders, headless | $337,500 | $675,000 | $1,350,000 |
| Released multi-angle video, 10-100 hours | $54,000 | $108,000 | $216,000 |
| Single-angle video under 10 hours without releases | $5,250 | $10,500 | $21,000 |

Eligibility guidance remains 30 or more employees or 10 or more years of operating history, three or more years on the same systems, US-based English-language records, repeatable workflows, and data owned outright. Operating, winding-down, and closed businesses can qualify. Rights, provenance, quality, usefulness, and de-identification feasibility require review; these are qualification considerations, not automatic estimator rejection rules.

## Referral economics and attribution

Referral/partner/scout share is 15 percent of year-one revenue, uncapped. Renewals pay again. Partner/scout payouts are quarterly within 30 days of the lab paying DataQuire. No sale means no fee. The $300,000 / $45,000 example and partner calculator are illustrative. The calculator remains referrals that close × average license value × 0.15. The default 2 × $200,000 = $60,000 stays unchanged.

Referral codes encode normalized email using URL-safe base64. They identify referrals and do not authenticate them. Attribution is first-link-wins, saved in `dataquire-attribution`, with a 12-calendar-month expiration calculated using UTC full-year arithmetic. A later link cannot replace an unexpired first link. Invalid codes do not create attribution. Attribution remains `mechanism: "first-link"`, `verified: false` pending owner/server verification. Generated links persist in `dataquire-referral-v1` and personal QR codes encode the actual saved referral link.

Written partner agreements govern named-account registration and exceptions. A registered account closing within 12 months credits the partner with or without a link. A no-link claim must be emailed within seven days of estimator completion. Outreach quality rules retain genuine introductions, no spam or invented claims, and respecting a declined introduction.

## Consent and optional services

Necessary browser storage saves unfinished estimator answers. Optional analytics and advertising remain off by default. The cookie UI preserves independent analytics and advertising selections, necessary storage displayed as required, Allow selected, Reject optional, and a footer Cookie settings control that reopens the choices.

Consent persists under `dataquire-consent`. Legacy `analytics` and `necessary` values remain supported. Analytics and advertising map independently to Google Consent Mode permissions (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`). No GTM script loads without a configured container plus at least one optional consent. No optional events are emitted before optional consent. Revoked choices update consent permissions; page navigation does not reset preferences. Motion preference uses `dataquire-motion`; system reduced motion and explicit pause both remain respected.

Templates and earnings/documents remain gated behind approved-partner authentication. The currently empty auth/assets configuration shows truthful unavailable states. Public dashboard examples and referral pipeline previews remain explicitly demo/illustrative and contain no real account financials. Anonymous referral lookup reveals stages only. Private template body content must not enter public bundles or `dist`.

## Material disclosure and legal substance

Copy can be rewritten while preserving these provisions and qualifications:

- DataQuire acts as the seller's broker/advisor and is paid from license proceeds. It does not represent itself as a data buyer or unrestricted public marketplace.
- No upfront fees. The intended written take rate remains 25 to 40 percent of license proceeds, disclosed in FAQ, terms, and applicable agreements. Keep that percentage range off the homepage.
- Owners retain the business and underlying data. Licenses define permitted use, retention, duration, scope, payment, and any exclusivity. Exclusivity is never perpetual; 24 months is a discussion point, not a default promise.
- Rights, contract restrictions, provenance, privilege, commercial usefulness, and de-identification feasibility require review. Possessing files does not establish licensing rights. Personal-identity-dependent records, unowned records, unclear rights, and material outside the owner's boundaries can be excluded or declined.
- No raw files are uploaded through public estimator/contact forms. Future access is read-only and limited to approved sources, after signed agreement and technical readiness.
- Buyers see approved de-identified samples under NDA. Sharing requires the owner's approval. Specialist processing, raw retention of about one week followed by deletion, and encryption/security goals remain conditional on agreement and readiness, not claims of a verified live operational program.
- De-identification reduces risk and does not eliminate it. It does not solve all contract/rights issues or guarantee anonymity/confidentiality.
- Healthcare requires business associate agreement handling; semiconductor/aerospace material requires export-control screening; insurance/customer records require de-identification; construction records require client-confidential/bid screening.
- Privacy discloses estimator answers, contact information, minimal technical information, necessary browser storage, optional analytics/advertising consent, future processing conditions, and contact-information deletion requests to `hello@dataquire.si`.
- Privacy and terms remain drafts requiring attorney review. No finalized policy is implied by the redesign.
- Estimates and examples remain hypothetical/indicative. Do not invent DataQuire customers, transactions, buyer relationships, verified results, contracted specialists, or operating-history claims. External market reports must be accurately sourced and separated from DataQuire deals.
- Legal/schema pages stay available, footer legal destinations stay discoverable, and necessary structured data remains valid.

## Verification after redesign

Run `npm run verify` after the presentation is rebuilt. The new regression checks are intentionally independent of prose and styling; existing editorial expectations may be adjusted for new phrasing without weakening the preserved business constraints.

Use a local browser with intercepted/mock acknowledged submissions to verify every estimator branch, Contact draft behavior, recovery after failed delivery, result submission, saved-answer recovery/clearing, regular forms, referral links/QR/lookup, partner calculator, co-branding/printing, protected areas, consent and settings, mobile navigation, focus/error behavior, and reduced motion. Do not generate test leads in the real production webhook.
