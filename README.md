# DataQuire

Astro static-first marketing site with a small JavaScript estimator and a same-origin lead relay.

## Run

    npm install
    npm run dev

The dev server serves /api/lead as well as the website. To review the built output:

    npm run verify
    npm run preview

The production preview is at http://127.0.0.1:4173. Stop it with Ctrl-C. The isolated browser QA receiver can be started with `node tests/browser-server.mjs` on port 4174; it deliberately does not contact Apps Script and is never included in dist/.

The verify command runs syntax checks, lint, pricing/request type checks, tests, the production build, and static route validation. The build emits 25 HTML routes plus a 404 page.

## Configuration and the lead contract

All external endpoints are in config.js. The supplied Google Apps Script URL is configured. No credentials are stored in source or browser code.

The browser posts to /api/lead. The relay forwards the raw JSON body to Google with Content-Type: application/json, reads the response, and returns success only when Google acknowledges it. Direct browser JSON posts require a CORS preflight; the supplied deployment did not return the required preflight headers, so the relay is necessary.

The exact external top-level fields are:

    form, name, company, email, phone, vertical, volume, labeled,
    exclusive, licensedBefore, valuationLow, valuationHigh, ref, message

Additional estimator fields, systems, history, dataset, environment, footage, and prototype math are preserved in message as readable JSON. There is no envelope. The ref value is the referring email decoded from the personal link. Email encoding is not authentication.

Google must return one of:

    {"ok":true}
    {"success":true}
    {"status":"success"}

An HTTP 200 with a failure body, an opaque response, invalid JSON, a timeout, and a network error are failures. Browser forms prevent double-click submissions and retain their ID on retries. The relay coalesces concurrent and recently acknowledged requests in the same server instance; durable idempotency across restarts belongs in Apps Script or a durable store.

The estimator captures contact at the WHO step, then sends a full valuation on the final "Get a real valuation" action. These are two intentional phases, sharing a submission ID in message. Contact capture has zero valuation values and phase "contact"; final confirmation has phase "valuation". Apps Script can reconcile those phases by the shared ID. It does not submit on every field edit. If contact delivery fails, the visitor can continue with a saved draft and retry the complete package later. No files are uploaded.

## Hosting

The Netlify configuration builds dist/ and deploys the relay in netlify/functions/lead.mjs. Do not deploy only dist/ to a host without an equivalent /api/lead route: delivery requires that route.

The site has not been published by this task. Canonical URLs use https://dataquire.si. Referral paths /r/<code> resolve to the estimator and preserve the first valid link for 12 calendar months on that device.

## Intentionally unconfigured services

- GTM, Meta Pixel, LinkedIn: no container ID supplied. Analytics and advertising consent are separate. Nothing loads before consent. Configure vendor consent checks in GTM.
- Approved-partner passwordless access: no identity provider or authenticated assets API supplied. Templates and dashboard remain locked. Templates are authored in private/partner-templates.json and excluded from public output.
- Read-only referral stages are connected through /api/referral-status to the supplied status action. Company details, deal financials, shared documents, cross-device tracking, named-account registration, and payouts need verified authenticated services. Local first-link storage is attribution context, not proof.
- Scout Telegram: no private invite URL supplied.
- Specialist processing, encryption arrangements, deletion schedules, buyer NDAs, and final policies remain subject to agreement and attorney review.

## Print assets

The referral page links to a Letter flyer, a 6 by 4-inch postcard with 0.125-inch bleed and crop marks, a pitch script, and a personal-link QR after a referral is accepted. Base print assets use the estimator URL. Include a personal QR when printing a referral-specific card.

To regenerate PDFs with the bundled Python runtime:

    python3 scripts/create-print-kit.py

To regenerate the original Open Graph raster:

    node scripts/create-social-image.mjs

## Data and verification

Estimator answers are stored on the visitor's device for resume and can be cleared. Confirmed final delivery removes the stored draft. Legal and scout routes are unlisted. All prices use an illustrative prototype. The market ledger marks unverified sources as PLACEHOLDER and never represents DataQuire transactions.

See BUILD-REPORT.md for the creative brief, acceptance evidence, and remaining launch items.
