# Ooak Data review and DataQuire copy pass

Reviewed October 15, 2026. Sources: [Ooak Data’s live homepage](https://ooakdata.com/) and [its Y Combinator company profile](https://www.ycombinator.com/companies/ooak-data). YC lists Ooak Data in the Summer 2026 batch.

## Useful lessons

Ooak leads with one concrete business purpose, then explains its input, transformation, and output. Named source systems make an unfamiliar data product easier to recognize. Its process explains why the working context matters, rather than relying on broad claims about AI. A short contact invitation follows the explanation.

DataQuire serves the owner of the records. Its copy should explain the owner’s benefit, the records that qualify, the preparation work, and the next action with the same clarity. The existing catalog, Task / Correction / Outcome trace, and interactive role-token exhibit already make that process tangible. This pass removes verbal friction around them.

Ooak’s investment, revenue, customer relationships, anonymization infrastructure, and research capabilities are its own claims. They are not evidence of DataQuire’s operations and were not transferred to DataQuire’s site. No competitor wording, branding, client names, or transaction claims were copied.

## Implemented

- Exact requested hero subheading, process-step sentence, and estimator-band caption.
- A visible “From first call to payout.” process within the existing five-section homepage, with “How a deal moves.” and all five original timeline entries preserved.
- “Timelines vary by deal.” and “Some engagements end without a license.” replace the long timeline disclaimers. The retained final step calls the sequence an example; the shared legal drawer explains its status once.
- Plain estimate wording across industry ranges, FAQs, reading-room articles, estimator entry, dynamic results and copied summaries, referral calculations, the one-pager, and downloadable referral materials.
- A shorter shared legal drawer retaining estimate limitations, owner approval, rights restrictions, custody conditions, confidentiality risks, consent, referral economics, attribution, and written-agreement requirements.
- The de-identification exhibit remains labeled “Sample record. No client data.” It continues to replace direct identifiers with role tokens on interaction.

## Preservation and verification

Seven frozen business, configuration, and delivery modules remain byte-for-byte identical to the foundation baseline. Payload names such as `indicativeRange` and the internal `illustrative-v1` model identifier remain unchanged. These internal values are not displayed as page copy.

Terms changes are limited to replacing “Indicative estimates” with “Estimates”. The regression test permits exactly that substitution before comparing the entire original privacy/terms function against its original hash. No legal provision or economic value was removed.

`npm run verify` passes syntax, lint, types, all 28 tests, the 26-page production build, and static checks for all 25 established routes plus 404. Production browser checks cover every route at 375, 768, and 1440 pixels, with no overflow, old terminology, or console errors. The interactive estimator’s result and readable summary were checked against its unchanged calculation. Browser intake used only the isolated local receiver, with no live lead submission. Both edited print PDFs were rendered and visually reviewed.

Evidence: `output/qa/copy-pass/`.
