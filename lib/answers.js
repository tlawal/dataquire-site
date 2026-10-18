export const articles = [
  ["company-data-value", "How much is my company’s data worth?", "History, judgment, rights, and verifiable outcomes shape the range.", [
    ["Start with the working record.", "A complete workflow shows the task, the disagreement, the correction, and the outcome. A finished table may hide the most useful part. Continuous operating history and a specialized domain can give a package context that public data lacks."],
    ["Rights can move the number to zero.", "A company may hold records without owning the rights to license them. Client agreements, vendor terms, privilege, and personal information all need review. A promising archive can be unsuitable for a license even when its technical quality is high."],
    ["Start with an estimate.", "DataQuire’s estimator shows how record type, volume, and rights affect value. A buyer offer follows review of rights, quality, scope, and commercial fit."]
  ]],
  ["sell-company-data", "How to sell company data to AI labs.", "The process begins with scope and ownership, before any transfer.", [
    ["01. Describe what exists.", "List the systems, records, and years of history. Do not upload raw files to a public intake. An initial estimate should ask for context and contact details, not unrestricted access."],
    ["02. Establish the boundary.", "Confirm who owns the records, which contracts apply, and what the owner will never share. A written agreement defines approved sources, processing, sample access, retention, and payment before anything moves."],
    ["03. Prepare and review.", "Under an agreed process, a specialist can de-identify the package and retain the relationships that make the workflow useful. Buyers review approved samples. The owner decides whether to accept the defined license."]
  ]],
  ["data-licensing-deal", "How does a data licensing deal work?", "From first conversation to a bounded license and payment.", [
    ["A package is defined.", "A license is about an agreed body of records and a specified use. The record’s origin, quality, size, formats, rights, personal-data status, and limitations belong in the package documentation."],
    ["A process is run.", "The sell-side advisor organizes the evidence, presents approved de-identified samples, and helps compare buyer proposals. The owner retains the decision. No proposal from the estimator binds either party."],
    ["The agreement controls delivery.", "Use, duration, exclusivity, retention, and payment are written down. Delivery and payment follow those terms. There is no verified typical DataQuire deal timeline yet."]
  ]],
  ["licensing-vs-selling", "Licensing vs selling company data.", "A bounded permission can preserve ownership of a growing record.", [
    ["A sale transfers an asset.", "An outright sale can transfer ownership of the specified asset. The details depend on the agreement. It prices the transferred record at a particular point in time."],
    ["A license defines permitted use.", "A license can permit a specific use while the owner retains the underlying data. The duration, permitted users, exclusivity, renewal, and treatment of new records must be explicit."],
    ["Growth changes the conversation.", "A business continues producing history. Updated packages and renewals can be negotiated separately. A license should also be assessed against a planned sale of the business."]
  ]],
  ["is-data-licensing-legal", "Is licensing company data legal?", "Three reviews come first: ownership, contracts, and personal information.", [
    ["Ownership is the first question.", "A business’s own operating record and client material held under a master agreement can carry different rights. Possessing a file does not establish permission to license its contents."],
    ["Contracts define restrictions.", "Customer, employee, vendor, and source-system terms may restrict sharing or downstream use. Privilege and regulated information need specialist review. A final legal assessment belongs with qualified counsel."],
    ["De-identification has limits.", "Removing direct identifiers can reduce exposure while preserving operational relationships. It does not make a package perfectly anonymous, and it cannot cure every contractual or rights problem. Some records should be excluded entirely."]
  ]],
  ["who-buys-company-data", "Who buys company data?", "The chain from an operating business to a model builder.", [
    ["Model builders need useful evidence.", "Potential buyers include AI labs developing models, evaluation systems, and training environments. A strong record supports a clear training or evaluation question."],
    ["The advisor prepares the package.", "DataQuire’s role is to organize and present the owner’s records, assess fit, and advise on commercial terms. It is paid from license proceeds under a written agreement."],
    ["The owner controls the process.", "Buyer identities, NDA requirements, permitted samples, and off-limits competitors should be settled before disclosure. Data is not published as a public marketplace listing."]
  ]],
  ["data-source-guides", "A guide to operational data sources.", "Where messages, ledgers, calls, and project histories actually live.", [
    ["Messages and calls.", "Slack, Microsoft Teams, Gmail, Zoom, and Gong can preserve the thread around a decision. Call transcripts are a distinct record: rights, participant consent, audio quality, and transcript accuracy need review."],
    ["Financial and project systems.", "QuickBooks, Xero, NetSuite, CAD, BIM, and project platforms can connect work to its outcome. Continuous history, corrections, approvals, and exceptions are more informative than a one-time snapshot."],
    ["Start with an inventory.", "Note what exists, who administers the system, how far the record goes back, and whether rights are clear. These are source guides, not a request to export. Access and extraction only follow an agreed scope."]
  ]],
  ["exclusivity", "How exclusivity works.", "Duration, scope, and a future business sale must fit together.", [
    ["Name the scope.", "Exclusivity can apply to a defined package, use, or buyer category. Avoid language that reaches every future record or every possible use unless that is the considered intent of both parties."],
    ["Name the end date.", "DataQuire’s position is that exclusivity is never perpetual. Twenty-four months is a discussion point, not a promised default. The exact period and renewal mechanics belong in the final agreement."],
    ["Consider a planned exit.", "A data license can affect what a future business buyer may do with the record. Discuss assignment, change of control, and any remaining exclusive period with counsel before agreeing."]
  ]]
];

export const articleRoutes = articles.map(a => "/answers/" + a[0]);
const link = '<a class="button" data-route href="/estimator">See what your data is worth</a>';

export function answersHub() {
  return '<section class="page-hero"><div class="wrap"><p class="eyebrow">The reading room</p><h1>A record worth understanding.</h1><p class="intro">Eight practical guides to valuation, rights, sources, and the shape of a data license. First-call questions live in the FAQ.</p></div></section><section class="section"><div class="wrap"><div class="answer-index">' + articles.map((a, i) => '<a class="answer-row" data-route href="/answers/' + a[0] + '"><span class="ledger-num">' + String(i+1).padStart(2,"0") + '</span><span><h2>' + a[1] + '</h2><p>' + a[2] + '</p></span><span aria-hidden="true">→</span></a>').join("") + '</div></div></section><section class="final-cta dark"><div class="wrap"><h2>Give your record a starting range.</h2><div class="cta-row">' + link + '</div></div></section>';
}

export function answerArticle(path) {
  const article = articles.find(a => "/answers/" + a[0] === path);
  if (!article) return '<section class="page-hero"><div class="wrap"><h1>Article not found.</h1><div class="cta-row">' + link + '</div></div></section>';
  return '<section class="page-hero"><div class="wrap"><a class="eyebrow" data-route href="/answers">Reading room /</a><h1>' + article[1] + '</h1><p class="intro">' + article[2] + '</p></div></section><section class="section"><div class="wrap article-layout"><aside class="article-note"><span class="meta">A note on estimates</span><p>The estimator gives you a starting range. An offer follows rights, quality, and commercial review.</p>' + link + '</aside><div class="article-body">' + article[3].map(r => '<article><h2>' + r[0] + '</h2><p>' + r[1] + '</p></article>').join("") + '</div></div></section>';
}
