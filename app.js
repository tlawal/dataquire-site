import {setupWorkingTrace} from "./lib/home-motion.js";
import {deidentificationRecord} from "./lib/de-identification.js";
import {homepage} from "./lib/homepage.js";
import {advisoryNotes} from "./lib/advisory-notes.js";
import {verticalGlyph} from "./lib/illustrations.js";
import {CONFIG} from './config.js';
import {estimate, flow, money, validEmail, referralCode, claimAttribution, estimatorPayload, requestPayload} from './lib/model.js';
import {deliver} from './lib/submission.js';
import {answersHub, answerArticle, articleRoutes, articles} from './lib/answers.js';

const memory = new Map();
const storage = {
  getItem(key) { try { return typeof window === 'undefined' ? memory.get(key) || null : localStorage.getItem(key); } catch { return memory.get(key) || null; } },
  setItem(key, value) { try { if (typeof window !== 'undefined') localStorage.setItem(key, value); } catch { /* Browser storage may be disabled. */ } memory.set(key, value); },
  removeItem(key) { try { if (typeof window !== 'undefined') localStorage.removeItem(key); } catch { /* No persistent store. */ } memory.delete(key); }
};

const STORAGE_KEY = "dataquire-estimator-v1";
const REFERRAL_KEY = "dataquire-referral-v1";
const $ = function (selector, root) { return (root || document).querySelector(selector); };
const $$ = function (selector, root) { return Array.from((root || document).querySelectorAll(selector)); };
const app = typeof document === "undefined" ? null : $("#app");

const routeMeta = {
  "/": ["DataQuire | Specialist advisory for operational data", "Assess and license eligible operational data with a specialist sell-side advisor. Owner-approved scope, access, and terms."],
  "/estimator": ["Data Valuation Estimator | DataQuire", "An indicative prototype estimate in about two minutes. No commitment and no file uploads."],
  "/buyers": ["For Buyers | DataQuire", "License real-world training data. Tell us what you are training. We review your requirements before discussing a package."],
  "/refer": ["Refer and Earn | DataQuire", "Refer a data holder and earn 15 percent of year-one revenue."],
  "/verticals": ["Operational Data by Industry | DataQuire", "Nine industries where operational data becomes AI training data."],
  "/partners": ["Partner Program | DataQuire", "Earn 15 percent of year-one revenue for introducing data holders."],
  "/faq": ["FAQ | DataQuire", "Answers to the questions data owners ask before licensing their operating records."],
  "/contact": ["Contact | DataQuire", "Talk to DataQuire about the data your company owns."],
  "/security": ["Security | DataQuire", "How DataQuire scopes, de-identifies, and licenses operational data."],
  "/privacy": ["Privacy | DataQuire", "DataQuire privacy notice. Attorney review in progress."],
  "/terms": ["Terms | DataQuire", "DataQuire terms. Attorney review in progress."],
  "/answers": ["The Reading Room | DataQuire", "Practical guides to valuation, data rights, licensing, and operational sources."],
  "/one-pager": ["Partner One-Pager | DataQuire", "A co-brandable guide to data licensing for owners."],
  "/templates": ["Partner Templates | DataQuire", "Partner-only introduction emails and talk tracks."],
  "/session": ["Valuation Session | DataQuire", "Request a guided valuation conversation."],
  "/dashboard": ["Partner Dashboard | DataQuire", "Partner access to referral status and earnings."],
  "/scout": ["DataQuire Scouts", "A private invitation to the DataQuire scout program."]
};

for (const article of articles) routeMeta["/answers/" + article[0]] = [article[1] + " | DataQuire", article[2]];

const primaryLabel = "See what your data is worth";
const navLinks = [
  ["/#how-it-works", "How it works"],
  ["/verticals", "Verticals"],
  ["/buyers", "For buyers"],
  ["/faq", "FAQ"]
];

const faqDrafts = [
  ["What moves the number up?", "History length, visible disagreement and correction, workflow complexity, a specialized domain, clean rights, and records with outcomes that can be checked all improve an indicative range. The estimate is not an offer."],
  ["Who buys this data?", "AI labs and model builders. Names are handled under NDA where an active process requires it. Buyer access is limited to de-identified samples and agreed license terms."],
  ["Are you a buyer?", "No. DataQuire acts as a sell-side advisor and broker. We help organize the package, run a process with buyers, and advise on terms. We are paid from license proceeds."],
  ["Will AI clone my business?", "A license must define the permitted use and off-limits material. Training on operational records can carry competitive and confidentiality risks. Scope and restrictions are set in writing before access; no claim of zero risk is made."],
  ["Is licensing company data legal?", "It can be when the company owns the records, contracts permit the intended use, and personal information can be removed. Each prospective package needs a rights and contract review."],
  ["Who sees data before a deal?", "Nobody outside the agreed process. Buyers see only de-identified samples under NDA, and only after the data holder approves that step."],
  ["Do I keep ownership?", "Yes. You keep the business and the data. A license defines a bounded use. Exclusivity is never perpetual, and 24 months is a typical discussion point, not a default commitment."],
  ["Who qualifies?", "The clearest fit is 30 or more employees or 10 or more years of operating history, three or more years on the same systems, US-based, English-language records, and data owned outright. Operating, winding-down, and closed businesses can qualify."],
  ["What does DataQuire charge?", "The written take rate is 25 to 40 percent of license proceeds. There are no upfront fees. The exact rate belongs in the agreement, not in an estimate."],
  ["Does the data need to be clean?", "No. Cleaning and qualification are part of the work. Messy working records can be valuable because they preserve how judgement and correction happened."],
  ["What if we have never exported anything?", "Most owners have not. A future project is conditional on agreement and technical readiness. DataQuire would guide a working session to understand approved sources and exports."],
  ["How much of my team's time is needed?", "The estimator takes about two minutes. A later qualified process may need one working session. The rest depends on the source systems and the scope agreed in writing."],
  ["How long does it take to get paid?", "The estimate is immediate after the questionnaire and is indicative. Qualification, preparation, buyer review, and payment depend on scope and signed terms. There is no verified typical deal timeline or guaranteed payout date."],
  ["Why act now?", "Certain operational records may be useful for model training and evaluation. Archives can disappear when firms close, subscriptions lapse, or systems are retired. The estimate is a calm first step, not a commitment."],
  ["What is excluded?", "A seller's red lines are absolute. Data whose value depends entirely on identifying people, data not owned by the company, and material that cannot be responsibly scoped or de-identified are passed on."],
  ["What are RL tasks?", "Labs often need training-ready environments with calibrated tasks and graders, not only flat files. DataQuire can evaluate seed operational records and coordinate specialist work under an agreement."],
  ["Can customer information be exposed?", "The intent is the opposite. A third-party specialist is expected to remove personal and customer-identifying details before samples are shared. De-identification reduces risk but does not eliminate it."],
  ["What happens after a license?", "The lab receives the agreed licensed copy. You retain the business and underlying data. Raw files are intended to be deleted after processing, subject to the final written agreement."],
  ["How long can a license run?", "The duration is agreed in writing. Exclusivity is never perpetual. Twenty-four months is a discussion point and must fit the owner’s plans, including a future business sale."],
  ["When would DataQuire walk away?", "We pass on records whose value is the identity of the people in them, rights that cannot be cleared, and material that cannot meet the owner’s boundaries. If the owner says do not share it, it stays out."]
];

const faqs = [0,1,2,3,4,16,5,17,6,18,7,8,9,10,11,12,13,14,19,15].map(index => faqDrafts[index]);

const verticals = [
  ["00", "Semiconductors", "Process logs, yield and metrology data, defect imagery, EDA tool traces.", "$90K-$720K", "MES, fab historians, yield management systems.", "We screen for export-controlled technical data before anything moves."],
  ["01", "Aerospace", "Telemetry, maintenance logs, simulation runs, materials test data.", "$75K-$600K", "Flight data systems, MRO platforms.", ""],
  ["02", "Legal", "Briefs and memos, contracts, filings, deposition transcripts.", "$45K-$360K", "Document management systems.", "Privilege and confidentiality review comes before anything else."],
  ["03", "Science labs", "Assay data, instrument logs, lab notebooks, imaging.", "$60K-$480K", "LIMS, electronic lab notebooks.", "Failed experiments can be valuable because they show what does not work."],
  ["04", "Accounting", "Anonymized bookkeeping records, audit workpapers, AP and AR histories.", "$30K-$240K", "QuickBooks, Xero, NetSuite.", ""],
  ["05", "Video and media", "Headcam footage of real work, multi-angle process video, studio archives.", "$20K-$160K", "Headcam capture programs, studio archives, defect image libraries.", "Rights-cleared with signed releases, or we do not touch it."],
  ["06", "Healthcare", "EHR extracts, imaging, claims data, device logs.", "$35K-$280K", "EHR systems, imaging systems, claims platforms.", "An applicable business associate agreement is required before access."],
  ["07", "Insurance claims", "FNOL calls, adjuster notes, coverage memos, reserve decisions, subrogation files.", "$55K-$440K", "Claims platforms, call records, document systems.", "Only approved, de-identified samples may be shared after rights and confidentiality review."],
  ["08", "Construction and architecture", "CAD and BIM, drawing sets, RFIs, change orders, schedules, bids.", "$50K-$400K", "CAD, BIM, field platforms, document systems.", "We screen for client-confidential bid data before anything moves."]
];

function mark(className) {
  return '<svg class="mark ' + (className || "") + '" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M13 22 29 15v34l-16 7V22Zm8-8 16-7v34l-8 4V15l-8 4v-5Zm16-7 14 7v34l-14-7V7Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="m17 27 8-3m-8 10 8-3m16-14 6 3m-6 6 6 3" stroke="currentColor" stroke-width="2"/></svg>';
}

function logo() {
  return '<a class="brand" href="/" data-route aria-label="DataQuire home">' + mark() + '<span>DataQuire</span></a>';
}

function routeLink(route, label, className) {
  return '<a href="' + route + '" data-route class="' + (className || "") + '">' + label + '</a>';
}

function primaryLink(className) {
  return routeLink("/estimator", primaryLabel, "button " + (className || ""));
}

function sectionLabel(_number, label) { return '<p class="eyebrow">' + label + '</p>'; }

function footer(path) {
  const newsletter = path === "/" ? '<div class="footer-newsletter"><div><h2>The monthly ledger.</h2><p>Notes on operational data and licensing. <a href="mailto:hello@dataquire.si?subject=Contribute%20to%20the%20ledger">Contribute to the ledger ↗</a></p></div>' + simpleForm("Ledger", '<div class="split-form"><div class="field"><label for="ledger-email">Work email</label><input id="ledger-email" name="email" type="email" required autocomplete="email"></div><button class="button secondary" type="submit">Get the monthly ledger</button></div>') + '</div>' : '';
  return advisoryNotes() + '<footer class="footer"><div class="wrap">' + newsletter + '<div class="footer-top"><div>' + logo() + '<p class="footer-copy">Specialist advisory for operational data.<br>Gathered knowledge. Defined terms.</p></div><div class="footer-links">' + routeLink("/buyers", "For buyers") + routeLink("/verticals", "Industries") + routeLink("/partners", "Partners") + routeLink("/refer", "Refer and earn") + routeLink("/answers", "Reading room") + routeLink("/security", "Security") + routeLink("/faq", "FAQ") + routeLink("/contact", "Contact") + routeLink("/privacy", "Privacy") + routeLink("/terms", "Terms") + '</div></div><div class="footer-bottom"><span>© 2026 DataQuire. All rights reserved.</span><a href="mailto:hello@dataquire.si">hello@dataquire.si ↗</a><button class="footer-consent" type="button" data-action="consent-settings">Cookie settings</button></div></div></footer>';
}

function nav(currentPath) {
  const links = navLinks.map(function (item) {
    const path = item[0].split("#")[0];
    return '<a href="' + item[0] + '" data-route class="' + (currentPath === path ? "active" : "") + '">' + item[1] + '</a>';
  }).join("");
  const action = currentPath === "/buyers" ? routeLink("/buyers#buyer-intake", "Discuss your requirements", "button nav-cta") : primaryLink("nav-cta");
  return '<div class="progress" aria-hidden="true"></div><header class="nav"><div class="wrap nav-inner">' + logo() + '<nav class="nav-links" aria-label="Main navigation">' + links + '</nav><div class="nav-actions">' + action + '<button class="menu-button" type="button" data-action="menu" aria-label="Open navigation" aria-expanded="false">More <span aria-hidden="true">+</span></button></div></div><nav class="compact-menu" hidden data-compact-menu aria-label="More pages">' + navLinks.map(item => routeLink(item[0], item[1])).join('') + routeLink("/partners", "Partners") + routeLink("/refer", "Refer and earn") + routeLink("/answers", "Reading room") + routeLink("/security", "Security") + routeLink("/contact", "Contact") + '<button type="button" class="menu-accessibility" data-action="pause-motion">Pause motion</button></nav></header>';
}

function mobileCta(_path) { return ""; }

function cookieBanner() {
  if (storage.getItem("dataquire-consent") && !showConsent) return "";
  return '<aside class="cookie no-print" aria-label="Cookie choices" data-cookie><h2>Choose analytics settings.</h2><p>Necessary storage keeps an unfinished estimator on this device. Optional analytics and advertising tags stay off until you allow them.</p><div class="cookie-options"><label><input type="checkbox" checked disabled> Necessary storage</label><label><input type="checkbox" data-consent-analytics> Analytics and measurement</label><label><input type="checkbox" data-consent-advertising> Advertising tags</label></div><div class="cookie-actions"><button class="button" type="button" data-action="consent-accept">Allow selected</button><button class="button secondary" type="button" data-action="consent-reject">Reject optional</button></div></aside>';
}

function shell(path, content) {
  return '<div class="site-shell">' + nav(path) + '<main id="main" class="page">' + content + '</main>' + footer(path) + mobileCta(path) + cookieBanner() + '</div>';
}

function home() { return homepage({primaryLink, routeLink}); }

function faqItem(item) {
  return '<details class="faq"><summary>' + item[0] + '</summary><div class="faq-content"><p>' + item[1] + '</p></div></details>';
}

function simpleForm(name, fields, submitLabel) {
  return '<form data-form="' + name + '" novalidate>' + fields + '<div class="form-error" role="alert" hidden></div>' + (submitLabel ? '<button class="button" type="submit">' + submitLabel + '</button>' : '') + '<div class="form-success" hidden></div></form>';
}

function pageHero(eyebrow, title, intro, dark) {
  return '<section class="page-hero ' + (dark ? "dark-page" : "") + '"><div class="wrap">' + (eyebrow ? '<p class="eyebrow">' + eyebrow + '</p>' : "") + '<h1>' + title + '</h1><p class="intro">' + intro + '</p></div></section>';
}

function defaultEstimator() {
  return {
    step: 0, type: "", systems: [], showSystems: false, name: "", company: "", email: "", phone: "",
    vertical: "", volume: "", structured: "", exclusive: "", licensedBefore: "", companySize: "",
    years: "", coreSystem: "", coreYears: "", exportReadiness: "", provenance: "", hasVideo: "",
    format: "", updated: "", domain: "", taskCount: "", graders: "", headless: "", owned: "",
    capture: "", hours: "", angles: "", releases: "", futureCapture: "", submitted: false, question: 0, submissionId: "", draftDelivered: false, otherSystems: "", systemHistory: {}
  };
}

function currentAttribution() {
  try {
    const referral = JSON.parse(storage.getItem("dataquire-attribution") || "null");
    return referral && Date.parse(referral.expiresAt) > Date.now() ? referral : null;
  } catch { return null; }
}

function captureAttribution(code) {
  const attribution = claimAttribution(currentAttribution(), code);
  if (attribution) storage.setItem("dataquire-attribution", JSON.stringify(attribution));
  return attribution;
}

function readConsent() {
  try {
    const stored = storage.getItem("dataquire-consent");
    if (stored === "analytics") return {analytics:true, advertising:false};
    if (stored === "necessary") return {analytics:false, advertising:false};
    return JSON.parse(stored || "null") || {analytics:false, advertising:false};
  } catch { return {analytics:false, advertising:false}; }
}

function motionReduced() {
  return typeof window === "undefined" || storage.getItem("dataquire-motion") === "paused" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobileQuiz() {
  return typeof window !== "undefined" && window.matchMedia("(max-width:760px)").matches;
}

function quizConcepts() {
  const step = estimatorSteps(estimatorState)[estimatorState.step];
  if (!["Dataset","Details","Environment","Video"].includes(step)) return [];
  return $$(".quiz-body > .option-group, .quiz-body > .field-grid > .field");
}

function prepareQuiz() {
  const concepts = quizConcepts();
  concepts.forEach(node => { node.hidden = false; });
  const actions = $(".quiz-actions");
  const old = $("[data-question-count]");
  if (old) old.remove();
  if (!isMobileQuiz() || !concepts.length) return;
  estimatorState.question = Math.min(estimatorState.question || 0, concepts.length - 1);
  concepts.forEach((node, index) => { node.hidden = index !== estimatorState.question; });
  if (actions) actions.insertAdjacentHTML("beforebegin", '<p class="meta" data-question-count>Question ' + (estimatorState.question+1) + ' of ' + concepts.length + '</p>');
}

function loadEstimator() {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
    return Object.assign(defaultEstimator(), saved || {});
  } catch (error) {
    return defaultEstimator();
  }
}

let estimatorState = loadEstimator();

function saveEstimator() {
  // Persist answer fields only. UI status and endpoint responses are not stored.
  const {submitted, ...answers} = estimatorState;
  storage.setItem(STORAGE_KEY, JSON.stringify({...answers, savedAt: new Date().toISOString()}));
}

function estimatorSteps(state) { return flow(state); }

function selectedClass(value, expected) {
  return value === expected ? " active" : "";
}

function choice(field, value, label, detail, current) {
  return '<button type="button" aria-pressed="' + (current === value) + '" class="choice' + selectedClass(current, value) + '" data-choice data-field="' + field + '" data-value="' + value + '"><strong>' + label + '</strong>' + (detail ? '<small>' + detail + '</small>' : "") + '</button>';
}

function chips(field, values, selected, multiple) {
  return values.map(function (value) {
    const active = multiple ? (selected || []).indexOf(value) > -1 : selected === value;
    return '<button type="button" aria-pressed="' + active + '" class="chip' + (active ? " active" : "") + '" data-choice data-field="' + field + '" data-value="' + value + '" ' + (multiple ? 'data-multiple="true"' : "") + '>' + value + '</button>';
  }).join("");
}

function estimatorType(state) {
  return '<h2>What are you submitting?</h2><p>Choose the closest starting point. The questions adapt to what you actually have.</p><div class="choice-grid type-options">' +
    choice("type", "records", "Company records", "Email, drives, CRM, accounting, project files, or the full company archive.", state.type) +
    choice("type", "dataset", "Dataset", "A built dataset: tables, documents, images, audio, or a mixed collection.", state.type) +
    choice("type", "rl", "RL environment", "A training environment with tasks and graders.", state.type) +
    choice("type", "video", "Egocentric video", "Headcam footage of real work being done.", state.type) +
    '</div><p class="save-note">Not yours? <a href="/refer" data-route>Refer it instead.</a> Earn 15 percent of year-one revenue when the owner signs through your link.</p>';
}

function estimatorSystems(state) {
  const categories = [
    ["Team chat", "Where decisions and coordination happen.", ["Slack", "Microsoft Teams", "Other"]],
    ["Email and calendar", "Operational correspondence and schedules.", ["Gmail", "Outlook", "Other"]],
    ["Files and documents", "The written record of the business.", ["Google Drive", "SharePoint", "DocuSign", "iManage", "Other"]],
    ["CRM", "Relationships, pipeline, and customer work.", ["Salesforce", "HubSpot", "Other"]],
    ["Field operations", "Work orders, routes, and service records.", ["ServiceTitan", "ServiceMax", "Other"]],
    ["Phone and call recordings", "Customer and internal operational calls.", ["Gong", "Dialpad", "Other"]],
    ["Meeting recordings", "Recorded working conversations.", ["Zoom", "Google Meet", "Other"]],
    ["Customer support", "Tickets, resolution patterns, outcomes.", ["Zendesk", "ServiceNow", "Other"]],
    ["Project management", "Tasks, assignments, and delivery.", ["Jira", "Asana", "Other"]],
    ["Wiki and notes", "Internal knowledge and operating notes.", ["Notion", "Confluence", "Other"]],
    ["Source code", "Software records and review history.", ["GitHub", "GitLab", "Other"]],
    ["Design and CAD", "Project artifacts and structured design work.", ["AutoCAD", "Revit", "Figma", "Other"]],
    ["Accounting and ERP", "Financial working records.", ["QuickBooks", "Xero", "NetSuite", "Other"]],
    ["Ecommerce", "Orders, catalogs, support, and fulfillment.", ["Shopify", "Amazon Seller", "Other"]],
    ["HR and payroll", "Workforce operations.", ["Gusto", "ADP", "Other"]],
    ["Databases and warehouses", "Approved tables and operational stores.", ["Snowflake", "BigQuery", "Other"]],
    ["Product analytics", "Behavior and product event records.", ["Amplitude", "Mixpanel", "Other"]],
    ["Lab and research", "Lab notebooks and research data.", ["Benchling", "Sapio", "Scispot", "Dotmatics", "GenoFAB", "Other"]],
    ["Photos video and social", "Existing media and visual work records.", ["Video archive", "Headcam footage", "Other"]]
  ];
  const all = categories.map(function (category) {
    return '<details class="system-category"><summary>' + category[0] + '</summary><p>' + category[1] + '</p><div class="chipset">' + chips("systems", category[2].map(v => v === "Other" ? "Other: " + category[0] : v), state.systems, true) + '<button type="button" class="chip" data-action="skip-category" data-values="' + esc(JSON.stringify(category[2])) + '">We do not use this</button></div></details>'; 
  }).join("");
  return '<h2>What does your company run on?</h2><p>Start with the systems that contain the working record. Your answers stay with DataQuire.</p><div class="option-group"><span class="option-label">Quick pick</span><div class="chipset">' + chips("systems", ["Slack", "Gmail", "QuickBooks", "Salesforce", "Zendesk", "HubSpot"], state.systems, true) + '</div></div><button type="button" class="button text" data-action="toggle-systems" style="margin-top:20px">' + (state.showSystems ? "Hide systems" : "See all systems") + '</button><div class="system-list' + (state.showSystems ? " open" : "") + '"' + (state.showSystems ? "" : " hidden") + '><div>' + all + '<div class="system-category"><h4>None of these</h4><p>The list is always growing. You can skip this and describe the systems later.</p><button type="button" class="chip" data-choice data-field="systems" data-value="We do not use these" data-multiple="true">We do not use these</button></div></div></div><div class="field" style="margin-top:24px"><label for="other-systems">Other systems or tools <span style="font-weight:400">(optional)</span></label><input id="other-systems" data-estimator-field="otherSystems" value="' + esc(state.otherSystems) + '" placeholder="Name anything not listed above"></div>';
}

function contactFields(state) {
  return '<h2>Who should we send this to?</h2><p>Continuing sends your contact details and answers so far to DataQuire. The complete valuation is sent only when you request it on the result screen. No files are uploaded here.</p><div class="field-grid" style="margin-top:24px"><div class="field"><label for="est-name">Name</label><input id="est-name" data-estimator-field="name" value="' + esc(state.name) + '" autocomplete="name" required></div><div class="field"><label for="est-company">Company</label><input id="est-company" data-estimator-field="company" value="' + esc(state.company) + '" autocomplete="organization" required></div><div class="field"><label for="est-email">Work email</label><input id="est-email" data-estimator-field="email" type="email" value="' + esc(state.email) + '" autocomplete="email" required></div><div class="field"><label for="est-phone">Phone <span style="font-weight:400">(optional)</span></label><input id="est-phone" data-estimator-field="phone" type="tel" value="' + esc(state.phone) + '" autocomplete="tel"></div></div>';
}

async function captureContactDraft(button) {
  if (estimatorState.draftDelivered) return true;
  if (!estimatorState.submissionId) estimatorState.submissionId=crypto.randomUUID();
  saveEstimator();
  button.disabled=true;
  button.textContent="Saving contact…";
  try {
    const result=await deliver(CONFIG.WEBHOOK_URL ? CONFIG.SUBMISSION_URL : "",estimatorPayload(estimatorState,currentAttribution(),estimatorState.submissionId,"contact"));
    estimatorState.draftDelivered=!result.demo;
    saveEstimator();
    if (!result.demo) sendEvent("lead_submit",{form:"Estimator",phase:"contact"});
    return true;
  } catch {
    const error=$("[data-quiz-error]");
    if (error) {error.hidden=false;error.textContent="Contact delivery could not be confirmed. Your answers are saved on this device. Retry, or continue with the saved draft and submit the complete package later.";}
    const actions=$(".quiz-actions");
    if (actions && !$("[data-action='quiz-offline']")) actions.insertAdjacentHTML("beforeend",'<button type="button" class="button secondary" data-action="quiz-offline">Continue with saved draft</button>');
    return false;
  } finally {button.disabled=false;button.textContent="Continue";}
}

function recordDetails(state) {
  const verticalOpts = verticals.map(function (item) { return '<option value="' + item[1] + '"' + (state.vertical === item[1] ? " selected" : "") + '>' + item[1] + '</option>'; }).join("");
  return '<h2>Give the record a little context.</h2><p>Estimates are fine. Bigger and older is often better, but a tighter range needs a full review.</p><div class="field-grid" style="margin-top:24px"><div class="field"><label for="vertical">Vertical</label><select id="vertical" data-estimator-field="vertical" required><option value="">Select one</option>' + verticalOpts + '<option value="Other"' + (state.vertical === "Other" ? " selected" : "") + '>Other</option></select></div><div class="field"><label for="volume">Roughly how much?</label><select id="volume" data-estimator-field="volume" required><option value="">Select one</option><option value="Under 10k"' + optionSel(state.volume, "Under 10k") + '>Under 10k records</option><option' + optionSel(state.volume, "10k to 1M") + '>10k to 1M</option><option' + optionSel(state.volume, "1M to 100M") + '>1M to 100M</option><option' + optionSel(state.volume, "Over 100M") + '>Over 100M</option></select></div></div><div class="option-group"><span class="option-label">Labeled or structured?</span><div class="chipset">' + chips("structured", ["yes", "partially", "raw"], state.structured) + '</div></div><div class="option-group"><span class="option-label">Would you consider an exclusive license?</span><div class="chipset">' + chips("exclusive", ["yes", "no", "not sure"], state.exclusive) + '</div></div><div class="option-group"><span class="option-label">Has this been licensed before?</span><div class="chipset">' + chips("licensedBefore", ["yes", "no"], state.licensedBefore) + '</div></div><div class="field-grid" style="margin-top:24px"><div class="field"><label for="company-size">Company size</label><select id="company-size" data-estimator-field="companySize" required><option value="">Select one</option><option' + optionSel(state.companySize, "Under 30") + '>Under 30</option><option' + optionSel(state.companySize, "30-199") + '>30-199</option><option' + optionSel(state.companySize, "200-999") + '>200-999</option><option' + optionSel(state.companySize, "1000+") + '>1000+</option></select></div><div class="field"><label for="years">How long on core systems?</label><select id="years" data-estimator-field="years" required><option value="">Select one</option><option value="under 3"' + optionSel(state.years, "under 3") + '>Under 3 years</option><option value="3+"' + optionSel(state.years, "3+") + '>3+ years</option></select></div><div class="field"><label for="core-system">Which system holds the most history?</label><input id="core-system" data-estimator-field="coreSystem" value="' + esc(state.coreSystem) + '" placeholder="For example, QuickBooks"></div><div class="field"><label for="core-years">Years of history there</label><input id="core-years" type="number" min="0" max="200" data-estimator-field="coreYears" inputmode="numeric" value="' + esc(state.coreYears) + '" placeholder="Optional"></div><div class="field"><label for="readiness">Export or access readiness</label><select id="readiness" data-estimator-field="exportReadiness"><option value="">Optional</option><option' + optionSel(state.exportReadiness, "This month") + '>This month</option><option' + optionSel(state.exportReadiness, "This quarter") + '>This quarter</option><option' + optionSel(state.exportReadiness, "Exploring") + '>Exploring</option></select></div><div class="field"><label for="has-video">Does this include video or media?</label><select id="has-video" data-estimator-field="hasVideo" required><option value="">Select one</option><option' + optionSel(state.hasVideo, "yes") + '>yes</option><option' + optionSel(state.hasVideo, "no") + '>no</option></select></div><div class="field span-2"><label for="provenance">Where did this data come from? Was any of it scraped, and does anyone else own any of it?</label><textarea id="provenance" data-estimator-field="provenance" required placeholder="Describe the source and any ownership or use restrictions.">' + esc(state.provenance) + '</textarea></div></div><p class="save-note">Deals typically need 30+ employees or 10+ years of history and 3+ years on the same systems. Smaller setups may still qualify.</p>';
}

function systemHistoryFields(state) {
  if (!state.systems.length) return "";
  return '<div class="field span-2 history-fields"><span class="option-label">Optional history depth for your top systems</span><div class="field-grid">' + state.systems.slice(0,6).map((system,index)=>'<div class="field"><label for="system-years-'+index+'">'+esc(system)+' · years</label><input id="system-years-'+index+'" type="number" min="0" max="200" inputmode="numeric" data-system-history="'+esc(system)+'" value="'+esc(state.systemHistory[system] ?? "")+'"></div>').join("") + '</div></div>';
}

function datasetQuestions(state) {
  return '<h2>Tell us about the dataset.</h2><p>Format, scale, and structure make the range more useful. Existing data only, no upload.</p><div class="option-group"><span class="option-label">Format</span><div class="chipset">' + chips("format", ["tables/CSV", "documents/PDFs", "images", "audio", "mixed"], state.format) + '</div></div><div class="option-group"><span class="option-label">Volume</span><div class="chipset">' + chips("volume", ["Under 10k", "10k to 1M", "1M to 100M", "Over 100M"], state.volume) + '</div></div><div class="option-group"><span class="option-label">Labeled or structured?</span><div class="chipset">' + chips("structured", ["yes", "partially", "raw"], state.structured) + '</div></div><div class="option-group"><span class="option-label">Still being updated?</span><div class="chipset">' + chips("updated", ["yes", "no"], state.updated) + '</div></div>';
}

function datasetDetails(state) {
  const verticalOpts = verticals.map(function (item) { return '<option value="' + item[1] + '"' + (state.vertical === item[1] ? " selected" : "") + '>' + item[1] + '</option>'; }).join("");
  return '<h2>Finish the context.</h2><p>These details are only used for the transparent prototype range.</p><div class="field-grid" style="margin-top:24px"><div class="field"><label for="dataset-vertical">Vertical</label><select id="dataset-vertical" data-estimator-field="vertical" required><option value="">Select one</option>' + verticalOpts + '<option value="Other"' + (state.vertical === "Other" ? " selected" : "") + '>Other</option></select></div><div class="field"><label for="dataset-size">Company size</label><select id="dataset-size" data-estimator-field="companySize" required><option value="">Select one</option><option' + optionSel(state.companySize, "Under 30") + '>Under 30</option><option' + optionSel(state.companySize, "30-199") + '>30-199</option><option' + optionSel(state.companySize, "200-999") + '>200-999</option><option' + optionSel(state.companySize, "1000+") + '>1000+</option></select></div><div class="field"><label for="dataset-years">Years on systems</label><select id="dataset-years" data-estimator-field="years" required><option value="">Select one</option><option value="under 3"' + optionSel(state.years, "under 3") + '>Under 3 years</option><option value="3+"' + optionSel(state.years, "3+") + '>3+ years</option></select></div><div class="field"><label for="dataset-exclusive">Exclusive license?</label><select id="dataset-exclusive" data-estimator-field="exclusive" required><option value="">Select one</option><option' + optionSel(state.exclusive, "yes") + '>yes</option><option' + optionSel(state.exclusive, "no") + '>no</option><option' + optionSel(state.exclusive, "not sure") + '>not sure</option></select></div><div class="field"><label for="dataset-licensed">Licensed before?</label><select id="dataset-licensed" data-estimator-field="licensedBefore" required><option value="">Select one</option><option' + optionSel(state.licensedBefore, "yes") + '>yes</option><option' + optionSel(state.licensedBefore, "no") + '>no</option></select></div><div class="field span-2"><label for="dataset-provenance">Where did this data come from? Was any of it scraped, and does anyone else own any of it?</label><textarea id="dataset-provenance" data-estimator-field="provenance" required placeholder="Describe the source and any ownership or use restrictions.">' + esc(state.provenance) + '</textarea></div></div>';
}

function environmentQuestions(state) {
  return '<h2>What makes this environment useful?</h2><p>Tasks and graders are the important part of an RL environment.</p><div class="option-group"><span class="option-label">Domain</span><div class="chipset">' + chips("domain", ["customer service", "software engineering", "finance", "legal", "science/lab", "other"], state.domain) + '</div></div><div class="option-group"><span class="option-label">Task count</span><div class="chipset">' + chips("taskCount", ["under 50", "50 to 500", "500+"], state.taskCount) + '</div></div><div class="option-group"><span class="option-label">Graders</span><div class="chipset">' + chips("graders", ["calibrated graders included", "partial checks", "no graders yet"], state.graders) + '</div></div><div class="option-group"><span class="option-label">Runs headless at scale?</span><div class="chipset">' + chips("headless", ["yes", "no"], state.headless) + '</div></div><div class="option-group"><span class="option-label">Owned outright?</span><div class="chipset">' + chips("owned", ["yes", "no"], state.owned) + '</div></div>';
}

function videoQuestions(state) {
  return '<h2>Tell us about the footage.</h2><p>We only consider rights-cleared work records. Existing archives and future capture are distinct conversations.</p><div class="option-group"><span class="option-label">How was it captured?</span><div class="chipset">' + chips("capture", ["headcam/wearable", "fixed cameras", "existing archive"], state.capture) + '</div></div><div class="option-group"><span class="option-label">How many hours?</span><div class="chipset">' + chips("hours", ["under 10", "10-100", "100-1,000", "1,000+"], state.hours) + '</div></div><div class="option-group"><span class="option-label">Single or multi-angle?</span><div class="chipset">' + chips("angles", ["single", "multi-angle"], state.angles) + '</div></div><div class="option-group"><span class="option-label">Are the people in the footage under signed releases?</span><div class="chipset">' + chips("releases", ["yes", "partial", "no"], state.releases) + '</div></div><div class="option-group"><span class="option-label">Would you equip staff with headcams and pay them hourly to capture more?</span><div class="chipset">' + chips("futureCapture", ["yes", "no", "maybe"], state.futureCapture) + '</div><p class="save-note">Future capture is conditional. We fund capture only under signed agreements and a defined technical plan.</p></div>';
}

function validationForStep(name, state) {
  const rules = {
    "Type": ["type"],
    "Systems": ["systems"],
    "Contact": ["name", "company", "email"],
    "Details": state.type === "dataset" ? ["vertical", "exclusive", "licensedBefore", "companySize", "years", "provenance"] : ["vertical", "volume", "structured", "exclusive", "licensedBefore", "companySize", "years", "hasVideo", "provenance"],
    "Dataset": ["format", "volume", "structured", "updated"],
    "Environment": ["domain", "taskCount", "graders", "headless", "owned"],
    "Video": ["capture", "hours", "angles", "releases", "futureCapture"]
  };
  return (rules[name] || []).filter(function (field) {
    const value = state[field];
    return Array.isArray(value) ? value.length === 0 : typeof value === "string" ? !value.trim() : !value;
  });
}

function estimatorRange(state) { const result = estimate(state); return [result.low, result.high]; }

function currency(value) { return money(value); }

function resultMath(state) {
  const model = estimate(state);
  return model.factors.map(f => f[0] + ': ' + (f[2] === 'money' ? money(f[1]) : f[1] + '×')).join(' · ') + '. Midpoint ' + money(model.midpoint) + '. Low = 0.5× (' + money(model.low) + '), high = 2× (' + money(model.high) + ').';
}

function estimatorResult(state) {
  const range = estimatorRange(state);
  const facts = JSON.parse(estimatorPayload(state, currentAttribution(), "summary").message);
  const branch = state.type === "records" ? {...facts.details, systems:state.systems.join(", "), ...facts.video} : state.type === "dataset" ? {...facts.details,...facts.dataset} : state.type === "rl" ? facts.env : facts.video;
  const summary = ["TYPE: " + state.type, "CONTACT: " + state.name + " <" + state.email + ">", "COMPANY: " + state.company, ...Object.entries(branch).filter(([,value])=>value !== "" && value !== undefined).map(([key,value])=>key + ": " + (typeof value==="object" ? JSON.stringify(value) : value)), "INDICATIVE RANGE: " + currency(range[0]) + " to " + currency(range[1])].join("\n");
  return '<div class="result"><p class="eyebrow">Your indicative range</p><h2 class="range">' + currency(range[0]) + "–" + currency(range[1]) + '</h2><p>Indicative range, not an offer. A rights, quality, and buyer-fit review is needed before any licensing proposal.</p><p style="font-size:12px">' + resultMath(state) + ' Every number is indicative and this prototype model is not calibrated market pricing.</p><div class="lead-summary"><span class="meta">Lead summary</span><pre tabindex="0" aria-label="Full lead summary">' + esc(summary) + '</pre><button class="button secondary dark-outline" type="button" data-action="copy-summary">Copy summary</button></div><button class="button" type="button" data-action="submit-estimator">Get a real valuation</button><div class="demo-notice" data-estimator-notice hidden></div><p class="save-note" >Not yours? <a  href="/refer" data-route>Refer it instead.</a> Earn 15 percent of year-one revenue when the owner signs through your link.</p></div>';
}

function renderQuiz(state) {
  const steps = estimatorSteps(state);
  const stepName = steps[Math.min(state.step, steps.length - 1)];
  state.step = Math.min(state.step, steps.length - 1);
  let body = "";
  if (stepName === "Type") body = estimatorType(state);
  if (stepName === "Systems") body = estimatorSystems(state);
  if (stepName === "Contact") body = contactFields(state);
  if (stepName === "Details") body = state.type === "dataset" ? datasetDetails(state) : recordDetails(state).replace('<div class="field span-2"><label for="provenance">',systemHistoryFields(state)+'<div class="field span-2"><label for="provenance">');
  if (stepName === "Dataset") body = datasetQuestions(state);
  if (stepName === "Environment") body = environmentQuestions(state);
  if (stepName === "Video") body = videoQuestions(state);
  if (stepName === "Result") body = estimatorResult(state);
  const isResult = stepName === "Result";
  const actions = isResult ? '<div class="quiz-actions"><button class="back" type="button" data-action="quiz-back">Back</button></div>' : '<div class="quiz-actions"><button class="back" type="button" data-action="quiz-back" ' + (state.step === 0 ? "disabled" : "") + '>Back</button><button class="button" type="submit" data-action="quiz-next">Continue</button></div>';
  return '<section class="quiz" data-quiz><div class="quiz-top"><div class="quiz-meta"><span>Step ' + (state.step + 1) + " of " + steps.length + "</span><span>" + stepName + '</span></div><div class="quiz-progress"><span style="width:' + (((state.step + 1) / steps.length) * 100) + '%"></span></div></div><form class="quiz-body" data-estimator-form novalidate>' + body + '<div class="form-error" data-quiz-error role="alert" hidden></div>' + actions + '<p class="save-note">Your answers are saved on this device as you go. <button type="button" class="inline-control" data-action="clear-estimator">Clear saved answers</button></p></form></section>';
}

function estimator() {
  const fastSize = estimatorState.fastSize || "";
  const fastVertical = estimatorState.fastVertical || "";
  const fastRange = fastSize && fastVertical ? provisionalRange(fastSize, fastVertical) : "";
  return pageHero("The estimator", "An estimate before a commitment.", "About 2 minutes. No file uploads. Your answers are saved on this device as you go.") +
    '<section class="section estimator-section"><div class="wrap estimator-layout"><aside class="estimator-aside"><h2>Your assessment.</h2><p>The questions adapt to your records, dataset, environment, or footage.</p><details class="fast-entry" open><summary>Fast entry · An instant provisional range</summary><div><h3>How many people work at the company?</h3><select data-fast-size aria-label="Company size for provisional estimate"><option value="">Choose a size</option><option value="Under 30"' + optionSel(fastSize, "Under 30") + '>Under 30</option><option value="30-199"' + optionSel(fastSize, "30-199") + '>30-199</option><option value="200-999"' + optionSel(fastSize, "200-999") + '>200-999</option><option value="1000+"' + optionSel(fastSize, "1000+") + '>1000+</option></select><select data-fast-vertical aria-label="Industry for provisional estimate"><option value="">Choose an industry</option>' + verticals.map(function (v) { return '<option value="' + v[1] + '"' + optionSel(fastVertical, v[1]) + '>' + v[1] + '</option>'; }).join("") + '</select>' + (fastRange ? '<div class="provisional"><span class="meta">Provisional indicative range</span><strong>' + fastRange + '</strong><small>Answer two minutes of questions for a tighter range.</small><small>Assumptions: raw records, size mapped to volume, non-exclusive, not licensed before.</small></div>' : '<p class="save-note">Choose both fields for an instant provisional range.</p>') + '</div></details><p class="save-note">A prototype estimate is a starting point for a conversation. Rights, quality, and commercial fit require review.</p><a class="text-link" href="/security" data-route>How data is handled ↗</a></aside><div class="estimator-main">' + renderQuiz(estimatorState) + '</div></div></section>';
}

function provisionalRange(size, vertical) {
  const volume = {"Under 30":"Under 10k", "30-199":"10k to 1M", "200-999":"1M to 100M", "1000+":"Over 100M"}[size];
  if (!volume || !vertical) return "";
  const model = estimate({type:"records",vertical,volume,structured:"raw",exclusive:"no",licensedBefore:"no"});
  return money(model.low) + " to " + money(model.high);
}

function optionSel(actual, expected) {
  return actual === expected ? " selected" : "";
}

function esc(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buyers() {
  const buyerFields = '<div class="field span-2"><span class="option-label">What are you looking for? Pick all that apply.</span><div class="chipset"><label class="check-row"><input type="checkbox" name="dataTypes" value="semiconductor process data"> Semiconductor process data</label><label class="check-row"><input type="checkbox" name="dataTypes" value="aerospace telemetry"> Aerospace telemetry</label><label class="check-row"><input type="checkbox" name="dataTypes" value="legal corpora"> Legal corpora</label><label class="check-row"><input type="checkbox" name="dataTypes" value="lab data"> Lab data</label><label class="check-row"><input type="checkbox" name="dataTypes" value="accounting records"> Accounting records</label><label class="check-row"><input type="checkbox" name="dataTypes" value="video"> Video</label><label class="check-row"><input type="checkbox" name="dataTypes" value="healthcare"> Healthcare</label><label class="check-row"><input type="checkbox" name="dataTypes" value="other"> Other</label></div></div><div class="field span-2"><label for="buyer-industries">Industries or roles</label><input id="buyer-industries" name="industries" required placeholder="For example, claims adjusters or fab process engineering"></div><div class="field"><label for="buyer-timeline">Timeline</label><select id="buyer-timeline" name="timeline" required><option value="">Select one</option><option>ASAP</option><option>This quarter</option><option>Exploring</option></select></div><div class="field"><label for="buyer-budget">Budget range <span style="font-weight:400">(optional)</span></label><input id="buyer-budget" name="budgetRange" placeholder="Optional"></div><div class="field"><label for="buyer-name">Full name</label><input id="buyer-name" name="name" required autocomplete="name"></div><div class="field"><label for="buyer-email">Work email</label><input id="buyer-email" name="email" type="email" required autocomplete="email"></div><div class="field span-2"><label for="buyer-org">Organization</label><input id="buyer-org" name="organization" required autocomplete="organization"></div>';
  return pageHero("For model builders", "Find evidence for the way your models work.", "Discuss operational records for training, evaluation, and reinforcement-learning environments. Start with your task, domain, and constraints.", true) +
    '<section class="section"><div class="wrap buyer-overview"><div><h2>Define the useful record.</h2><p class="intro">A qualified package needs more than a format and a file count. Its origin, rights, utility, and limitations should be clear.</p><div class="buyer-use-list"><article><h3>Training</h3><p>Decisions, revisions, and outcomes in a specialized domain.</p></article><article><h3>Evaluation</h3><p>Tasks with evidence against which an outcome can be checked.</p></article><article><h3>Environments</h3><p>Operational seeds for scoped tasks and graders.</p></article></div></div><div class="package-outline"><h2>What a package documents</h2><div class="term-list"><div class="term"><strong>Record</strong><p>Workflow, source, size, format, and evidence of potential utility.</p></div><div class="term"><strong>Provenance</strong><p>Origin, rights review, exceptions, and known limitations.</p></div><div class="term"><strong>Handling</strong><p>Approved de-identified samples under NDA and owner approval. <a href="/security" data-route>Security & custody ↗</a></p></div><div class="term"><strong>License</strong><p>Permitted use, duration, exclusivity, retention, and payment.</p></div></div></div></div></section>' +
    '<section class="section rule-top" id="buyer-intake"><div class="wrap"><div class="form-shell"><p class="eyebrow">Buyer intake</p><h2>Tell us what you need.</h2><p class="intro">A requirements conversation comes before sample access. No available inventory is implied.</p>' + simpleForm("Buyers", '<div class="field-grid" style="margin-top:28px">' + buyerFields + '</div>', "Send request") + '</div></div></section>';
}

function verticalsPage() {
  const rows = verticals.map(function (item) {
    return '<button type="button" class="vertical-row" data-action="vertical" aria-expanded="false"><span class="vertical-index">' + item[0] + verticalGlyph(Number(item[0])) + '</span><span><strong class="vertical-title">' + item[1] + '</strong><span class="vertical-description">' + item[2] + '</span></span><span class="range">' + item[3] + '<small style="display:block;font-family:Instrument Sans,Arial,sans-serif;font-size:9px;font-style:normal;letter-spacing:.12em;text-transform:uppercase">Indicative</small></span></button><div class="vertical-detail"><div><p><b>Listed sources:</b> ' + item[4] + (item[5] ? '<br><br>' + item[5] : "") + '<br><br>' + routeLink("/estimator", primaryLabel, "button text") + '</p></div></div>';
  }).join("");
  return pageHero("Industry coverage", "Recognize your working record.", "Nine established industry categories, with examples of the records and systems to assess. Other specialist operations can also be reviewed.") +
    '<section class="section"><div class="wrap reveal"><p class="industry-priority">Legal, semiconductor, oil and gas, and video game records are useful starting points for specialist review. Oil and gas and video game businesses use the existing Other estimator option.</p><div class="vertical-list">' + rows + '</div><div class="positioning" style="margin-top:72px"><div class="display">Something else?</div><div><p>Describe a record of real work. We can assess its rights, depth, and potential utility.</p>' + primaryLink() + '</div></div></div></section>';
}

function partners() {
  const partnerFields = '<div class="field-grid" style="margin-top:24px"><div class="field"><label for="partner-name">Name</label><input id="partner-name" name="name" required autocomplete="name"></div><div class="field"><label for="partner-company">Company</label><input id="partner-company" name="company" required autocomplete="organization"></div><div class="field"><label for="partner-email">Work email</label><input id="partner-email" name="email" type="email" required autocomplete="email"></div><div class="field"><label for="partner-intros">Potential introductions</label><select id="partner-intros" name="potentialIntroductions" required><option value="">Select one</option><option>1-5</option><option>5-20</option><option>20+</option></select></div><div class="field span-2"><label for="partner-industries">Client industries</label><input id="partner-industries" name="industries" required placeholder="For example, law, accounting, construction"></div></div>';
  return pageHero("Partner program", "Introduce us to data. Earn 15 percent of year-one revenue.", "You know which of your clients are sitting on valuable data. Make a thoughtful introduction. We coordinate qualification and the commercial process.", true) +
    '<section class="section"><div class="wrap reveal"><div class="steps"><article class="step"><span class="step-number">1</span><h3>Tell us who.</h3><p>One introduction. That is the whole job.</p></article><article class="step"><span class="step-number">2</span><h3>We assess the opportunity.</h3><p>Valuation, de-identification, buyer process, and negotiation. The partner is never in the middle.</p></article><article class="step"><span class="step-number">3</span><h3>You get paid quarterly.</h3><p>15 percent of year-one revenue per closed referral, within 30 days of the lab paying us. Renewals pay again.</p></article></div><div class="calculator" data-calculator><div><label class="option-label" for="close-count">Referrals that close per year</label><select id="close-count" data-calc-count><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="5">5</option></select></div><div><label class="option-label" for="license-value">Average license value</label><select id="license-value" data-calc-value><option value="100000">$100K</option><option value="200000" selected>$200K</option><option value="500000">$500K</option></select></div><div class="calc-output"><span>Illustrative annual referral earnings</span><strong data-calc-output>$60K</strong><small>Illustrative, not a promise.</small></div></div></div></section>' +
    '<section class="section rule-top"><div class="wrap reveal">' + sectionLabel("01", "Good partners") + '<h2>People who already see<br>the operating record.</h2><div class="card-grid"><article class="editorial-card"><p class="meta">MSPs</p><h3>You see the systems.</h3><p>You know where clients operate, which tools contain the history, and when a company is changing hands or changing systems.</p></article><article class="editorial-card"><p class="meta">IT consultants</p><h3>You see the infrastructure.</h3><p>A thoughtful introduction can uncover revenue in records that would otherwise sit idle.</p></article><article class="editorial-card"><p class="meta">Fractional CFOs</p><h3>You see the archive.</h3><p>A data license before a sale can be part of the broader enterprise-value conversation.</p></article><article class="editorial-card"><p class="meta">Business brokers</p><h3>You see the transition.</h3><p>The owner retains the business and the data. Terms are bounded and defined in writing.</p></article></div></div></section>' +
    '<section class="section"><div class="wrap reveal">' + sectionLabel("02", "What you get") + '<h2>Tools for a factual introduction.</h2><p class="intro">Each resource is a working page, not a promised bullet.</p><div class="asset-rows">' + assetRow("/refer", "A referral link", "12-month first-link attribution") + assetRow("/one-pager", "A forwardable one-pager", "Co-brandable and printable") + assetRow("/templates", "Eight email templates and two talk tracks", "Partners only") + assetRow("/session", "A co-branded valuation session", "Public booking page") + assetRow("/dashboard", "Partner dashboard", "Demo data visible before live access") + '</div></div></section>' +
    '<section class="section rule-top"><div class="wrap"><div class="form-shell reveal"><p class="eyebrow">Application</p><h2>Apply to partner.</h2><p class="intro">A personal reply follows in one to two business days.</p>' + simpleForm("Partners", partnerFields, "Apply to partner") + '</div></div></section>' +
    '<section class="section short"><div class="wrap narrow reveal">' + sectionLabel("03", "Partner objections") + '<div class="faq-list">' + faqItem(["Will this annoy my client?", "A well-timed introduction is positioned as found revenue, not another service pitch. The estimate commits the owner to nothing."]) + faqItem(["How much work is it?", "One real introduction. DataQuire handles qualification, the buyer process, and negotiation."]) + faqItem(["When do I get paid?", "Quarterly, within 30 days after the client's first payment clears. Renewals pay again."]) + '</div></div></section>';
}

function assetRow(route, title, detail) {
  return '<a class="asset-row" href="' + route + '" data-route><strong>' + title + '</strong><span>' + detail + ' →</span></a>';
}

function refer() {
  const formFields = '<div class="field-grid" style="margin-top:24px"><div class="field"><label for="refer-name">Your name</label><input id="refer-name" name="name" required autocomplete="name"></div><div class="field"><label for="refer-email">Your email</label><input id="refer-email" name="email" type="email" required autocomplete="email"></div><div class="field"><label for="refer-company">Company being referred</label><input id="refer-company" name="company" required></div><div class="field"><label for="refer-owner">Owner contact <span style="font-weight:400">(if you have it)</span></label><input id="refer-owner" name="ownerContact"></div></div>';
  return pageHero("Referrals", "Make an introduction. Share in the value.", "Earn 15 percent of year-one revenue when a referred owner licenses data. First-link attribution lasts 12 months.") +
    '<section class="section"><div class="wrap"><div class="steps"><article class="step"><span class="step-number">1</span><h3>Refer a real owner.</h3><p>Start with someone you have spoken with, then generate a personal link.</p></article><article class="step"><span class="step-number">2</span><h3>They complete the estimator.</h3><p>The first valid link establishes attribution on the device for 12 calendar months.</p></article><article class="step"><span class="step-number">3</span><h3>Receive your share.</h3><p>15 percent of year-one revenue, uncapped. Paid quarterly within 30 days of the lab paying us. Renewals pay again.</p></article></div><div class="form-shell" style="margin-top:40px"><h2>Generate your referral link.</h2>' + simpleForm("Refer", formFields, "Generate my referral link") + '<div data-referral-result></div></div><div class="faq-list">' + faqItem(["What if I lost my link?", "It is saved on the device where you made it. For a no-link claim, email hello@dataquire.si within seven days of the estimator completion. Written agreements govern named-account exceptions."]) + faqItem(["What should I say?", "DataQuire helps owners assess and license eligible operational records. The estimator is a first step with no commitment. Use the DataQuire name, make factual claims, and respect a decline."]) + '</div><p class="save-note">No sale, no fee. See <a href="/security" data-route>security and custody</a> for data handling.</p></div></section>' +
    '<section class="section rule-top"><div class="wrap"><p class="eyebrow">The hyperlocal kit</p><h2>Make the introduction tangible.</h2><p class="intro">Mail the card, then visit as the follow-up: “I sent you a card last week.” Start with owners you have actually spoken with. Leave them alone if they decline.</p><div class="asset-rows"><a class="asset-row" href="/downloads/dataquire-flyer.pdf" download><strong>One-page flyer</strong><span>US Letter PDF ↓</span></a><a class="asset-row" href="/downloads/dataquire-postcard.pdf" download><strong>Print-ready postcard</strong><span>6 × 4 inches with bleed ↓</span></a><a class="asset-row" href="/downloads/dataquire-pitch.txt" download><strong>The 20-second pitch</strong><span>Plain-text script ↓</span></a></div><div style="margin-top:32px"><p class="meta">Your personal QR</p><div class="kit-qr" data-personal-qr></div><p class="save-note">Generate your referral link above to create a QR that encodes it. The downloadable base postcard uses the estimator URL; include your personal QR when printing a referral card.</p><a class="button secondary" data-download-qr download="dataquire-personal-qr.svg" hidden>Download personal QR</a></div><p class="intro" style="margin-top:32px">Find companies through people you know, LinkedIn, a thoughtful phone call, trade lists, or a local visit. No blasting cold lists.</p></div></section>';
}

function faqPage() {
  return pageHero("Frequently asked questions", "What owners ask on the first call.", "The short version. The long version comes on the call.") +
    '<section class="section"><div class="wrap narrow reveal"><div class="faq-list">' + faqs.map(faqItem).join("") + '</div><div class="cta-row">' + primaryLink() + '</div></div></section>';
}

function referralLookup() {
  return '<div class="form-shell" style="margin-top:48px;max-width:720px"><p class="eyebrow">Referral status lookup</p><h3>Check with the email you referred with.</h3><p class="intro" style="font-size:1rem">This read-only lookup shows pipeline stages returned by the service. Deal amounts and shared documents require authenticated access.</p><form data-referral-lookup novalidate><div class="split-form"><div class="field"><label for="lookup-email">Your referring email</label><input id="lookup-email" type="email" name="email" required autocomplete="email"></div><button type="submit" class="button">Check status</button></div><div class="form-error" role="alert" hidden></div><div data-lookup-result role="status"></div></form></div>';
}

function contact() {
  const fields = '<div class="field-grid" style="margin-top:24px"><div class="field"><label for="contact-name">Name</label><input id="contact-name" name="name" autocomplete="name" required></div><div class="field"><label for="contact-company">Company</label><input id="contact-company" name="company" autocomplete="organization" required></div><div class="field"><label for="contact-email">Work email</label><input id="contact-email" name="email" type="email" autocomplete="email" required></div><div class="field"><label for="contact-vertical">Vertical</label><select id="contact-vertical" name="vertical" required><option value="">Select one</option>' + verticals.map(function (v) { return '<option>' + v[1] + '</option>'; }).join("") + '<option>Other</option></select></div><div class="field span-2"><label for="contact-message">Message</label><textarea id="contact-message" name="message" required placeholder="What records are you considering?"></textarea></div></div>';
  return pageHero("Contact", "Start with the record.", "Tell us what you have or what you are looking for. We review your requirements before discussing a package.") +
    '<section class="section"><div class="wrap narrow"><div class="form-shell reveal">' + simpleForm("Contact", fields, "Send message") + '<p class="save-note">No raw business data belongs in this form. No file uploads, ever.</p></div></div></section>';
}

function security() {
  return pageHero("Security & custody", "Your approval defines the boundary.", "Before access, agree what is included, what is excluded, and which uses are permitted.") +
    '<section class="section"><div class="wrap security-layout"><div><h2>A controlled process.</h2><div class="term-list"><div class="term"><strong>Required approvals</strong><p>A written scope comes before access. Only approved sources may be accessed read-only. Buyers receive redacted samples under NDA and with the owner’s approval.</p></div><div class="term"><strong>Planned safeguards</strong><p>A vetted third-party specialist is contemplated for de-identification. Encryption in transit and at rest is the target. An approximately one-week raw-file hold followed by deletion is intended. Provider, access, retention, and deletion arrangements must be agreed and technically ready before work begins.</p></div><div class="term"><strong>Contractual controls</strong><p>Off-limits lists are binding. The owner retains the underlying data. Use, duration, retention, payment, and any exclusivity are defined in writing. Exclusivity is never perpetual.</p></div><div class="term"><strong>Remaining risks</strong><p>De-identification reduces risk but cannot eliminate re-identification or confidentiality risk. Rights review may prevent a record from being licensed.</p></div></div></div>' + deidentificationRecord("security-sample-record") + '</div></section>';
}

function legalPage(kind) {
  const privacy = kind === "privacy";
  const title = privacy ? "Privacy notice." : "Terms of use.";
  const intro = privacy ? "A plain-English draft while formal policies are being finalized." : "A plain-English draft while formal terms are being finalized.";
  const rows = privacy ? [
    ["What we collect", "Estimator answers, contact details, and the minimum technical information needed to operate the site."],
    ["What we never ask for", "No raw business files are uploaded through the estimator or contact forms. Ever."],
    ["Future processing", "Any future third-party de-identification process, raw-file hold of about one week, and deletion schedule are subject to a signed agreement and technical readiness."],
    ["What buyers see", "De-identified samples under NDA and only with approval. The site does not make data available to buyers."],
    ["Your choices", "You may request deletion of submitted contact information by emailing hello@dataquire.si."],
    ["Analytics", "Basic analytics are optional and gated behind the cookie choice. No ad profiles are created before consent."]
  ] : [
    ["Our role", "DataQuire is positioned as a sell-side broker and advisor, not as a buyer of the data."],
    ["Fees", "No upfront fees. The intended written take rate is 25 to 40 percent of license proceeds."],
    ["Estimates", "Indicative estimates are not offers, promises, historical performance, or a commitment to take a package to market."],
    ["Qualification", "Rights, provenance, commercial usefulness, and de-identification feasibility must be reviewed before a process begins."],
    ["Exclusivity", "Exclusivity is never perpetual. A 24-month period may be discussed in the context of a final agreement."],
    ["Referrals", "15 percent of year-one revenue, 12-month first-link attribution, renewals pay again, and quality rules apply. Final rules require a written partner agreement."],
    ["Ownership", "The owner keeps the business and the data. A license must define use, retention, and scope."]
  ];
  return pageHero(privacy ? "Privacy" : "Terms", title, intro) +
    '<section class="section"><div class="wrap narrow reveal"><div class="form-notice">Attorney review required. This page is a product draft, not a finalized legal policy.</div><div class="term-list">' + rows.map(function (row) { return '<div class="term"><strong>' + row[0] + '</strong><p>' + row[1] + '</p></div>'; }).join("") + '</div><p class="intro">Full legal policies are being finalized. Questions go to <a href="mailto:hello@dataquire.si">hello@dataquire.si</a>.</p></div></section>';
}

function onePager() {
  return '<div class="print-controls no-print"><div class="wrap"><button type="button" class="button secondary" data-action="print">Print / Save as PDF</button></div></div><main id="main" class="page"><article class="one-pager"><div style="display:flex;justify-content:space-between;gap:20px;align-items:center">' + logo() + '<span class="meta">Prepared for <b data-cobrand-header>your client</b><br>Introduced by <b data-cobrand-header-partner>your firm</b></span></div><p class="eyebrow" style="margin-top:62px">Found revenue in operating records</p><h1 style="font-size:clamp(3rem,7vw,5.8rem)">Your operating history may be worth more than you think.</h1><p class="intro">DataQuire values, prepares, and licenses a company’s operational data to multiple AI labs. The owner approves every term.</p><div class="co-brand no-print"><div class="field"><label for="partner-brand">Your name or firm</label><input id="partner-brand" data-cobrand="partner" placeholder="Your firm"></div><div class="field"><label for="client-brand">Client company</label><input id="client-brand" data-cobrand="client" placeholder="Client company"></div></div><div class="form-notice">Prepared for <b data-cobrand-output>your client</b> with an introduction from <b data-cobrand-partner>your firm</b>.</div><div class="steps"><article class="step"><span class="step-number">1</span><h3>Get an estimate.</h3><p>About two minutes. Indicative range. No commitment and no file upload.</p></article><article class="step"><span class="step-number">2</span><h3>Define the package.</h3><p>DataQuire handles qualification, rights review, and de-identification planning.</p></article><article class="step"><span class="step-number">3</span><h3>Approve every deal.</h3><p>Buyers see de-identified samples. Scope and payment are in writing.</p></article></div><div class="term-list"><div class="term"><strong>What qualifies</strong><p>30+ employees or 10+ years of history, 3+ years on systems, repeatable workflows, and owned records.</p></div><div class="term"><strong>What owners keep</strong><p>The business and underlying data. Licenses are bounded. Exclusivity is never perpetual.</p></div><div class="term"><strong>What it costs</strong><p>No upfront fee. DataQuire is paid only from license proceeds.</p></div></div><div class="cta-row no-print">' + primaryLink() + '</div></article></main>';
}

function templatesPage() {
  return pageHero('Partner assets', 'Templates for thoughtful introductions.', 'Eight email templates and two talk tracks for real relationships. Private materials require approved access; authentication is not connected yet.') + '<section class="section"><div class="wrap">' + partnerLock('Templates', true) + '<div data-secure-assets></div></div></section>';
}

function partnerLock(title, demo) {
  return '<div class="locked">' + mark() + '<p class="eyebrow">Partners only</p><h2>' + title + ' access.</h2><p class="intro" style="margin-left:auto;margin-right:auto">Approved partners use a passwordless magic link. ' + (CONFIG.AUTH_REQUEST_URL ? 'Enter your approved work email.' : 'Partner authentication is not connected yet. Apply and we will arrange access.') + '</p>' + (CONFIG.AUTH_REQUEST_URL ? '<form data-auth-form novalidate><div class="field"><label for="auth-email">Approved work email</label><input id="auth-email" type="email" name="email" required></div><div class="form-error" role="alert" hidden></div><button type="submit" class="button">Send magic link</button></form>' : '<div class="cta-row" style="justify-content:center">' + routeLink('/partners', 'Apply to partner', 'button') + '</div>') + (demo ? '<p class="save-note">Available materials: the introduction, the nudge, after the call, the graceful exit, four industry emails, a reassurance talk track, and a phone script.</p>' : '') + '</div>';
}

function sessionPage() {
  const fields = '<div class="field-grid" style="margin-top:24px"><div class="field"><label for="session-name">Name</label><input id="session-name" name="name" required autocomplete="name"></div><div class="field"><label for="session-email">Work email</label><input id="session-email" name="email" type="email" required autocomplete="email"></div><div class="field"><label for="session-company">Company</label><input id="session-company" name="company" required></div><div class="field"><label for="session-time">Preferred time</label><select id="session-time" name="preferredTime" required><option value="">Select one</option><option>Morning</option><option>Afternoon</option><option>Either</option></select></div></div>';
  return pageHero("Partner valuation session", "A practical first conversation.", "A co-branded session is a clear, low-pressure way to explain the estimate, custody, and next steps to a client.") +
    '<section class="section"><div class="wrap"><div class="card-grid two reveal"><article class="editorial-card"><p class="meta">What it is</p><h3>A guided valuation conversation.</h3><p>An introduction to the estimator, the data boundary, and the questions a qualified owner will need to answer.</p></article><article class="editorial-card"><p class="meta">How co-branding works</p><h3>Your relationship, clear roles.</h3><p>The partner opens the door. DataQuire handles valuation and buyer work. Final terms are only ever agreed with the owner in writing.</p></article></div><div class="form-shell" style="margin-top:48px;max-width:760px"><p class="eyebrow">Request a session</p><h2>Book a valuation session.</h2>' + simpleForm("Session", fields, "Request session") + '</div></div></section>';
}

function dashboard() {
  return pageHero('Partner dashboard', 'Your introductions, in one place.', 'Partner authentication and financial reporting require connected services.') + '<section class="section"><div class="wrap">' + partnerLock('Dashboard', false) + '<div class="form-notice">Demo data: no referrals or financial results are shown. A connected authenticated service is required for company details, earnings, and payouts.</div><div data-secure-assets></div></div></section>';
}

function scout() {
  const cta = CONFIG.TELEGRAM_INVITE_URL ? '<a class="button" href="' + CONFIG.TELEGRAM_INVITE_URL + '" target="_blank" rel="noreferrer">Join the scout channel</a>' : '<button class="button" type="button" data-action="telegram-unavailable">Join the scout channel</button>';
  return pageHero("DataQuire scouts", "Find eligible records. Earn 15 percent of year-one revenue.", "Scouts make real introductions to companies with operating history. A private channel is planned for the field guide, templates, and personal links, subject to connection.", true) +
    '<section class="section"><div class="wrap"><div class="card-grid reveal"><article class="editorial-card"><p class="meta">Economics</p><h3>15 percent, uncapped.</h3><p>Of year-one revenue. Paid quarterly within 30 days of the lab paying us. Renewals pay again.</p></article><article class="editorial-card"><p class="meta">Attribution</p><h3>12-month first link.</h3><p>The first link establishes attribution. A written agreement governs named-account registration and exceptions.</p></article><article class="editorial-card"><p class="meta">Example</p><h3>$300K license = $45K</h3><p>Illustrative economics only. No deal amount is promised.</p></article></div><div class="positioning" style="margin-top:72px"><div class="display">Talk first.<br>Real introductions.<br>No spam.</div><div><p>The intended scout resources include a field guide, a personal referral link, templates, and a private channel. Channel access is not connected yet.</p><div class="cta-row">' + cta + '</div></div></div><div class="steps" style="margin-top:60px"><article class="step"><span class="step-number">1</span><h3>Join the channel.</h3></article><article class="step"><span class="step-number">2</span><h3>Get the field guide, templates, and your personal link.</h3></article><article class="step"><span class="step-number">3</span><h3>Hunt.</h3></article></div></div></section><footer class="footer"><div class="wrap"><div class="footer-bottom"><span>Private page. Shared by invitation.</span></div></div></footer>';
}

function routeContent(path) {
  const cleanPath = (path || "/").replace(/\/$/, "") || "/";
  let content = "";
  let unframed = false;
  if (cleanPath === "/") content = home();
  else if (cleanPath === "/estimator") content = estimator();
  else if (cleanPath === "/buyers") content = buyers();
  else if (cleanPath === "/verticals") content = verticalsPage();
  else if (cleanPath === "/partners") content = partners();
  else if (cleanPath === "/refer") content = refer() + '<section class="section"><div class="wrap">' + referralLookup() + '</div></section>';
  else if (cleanPath === "/faq") content = faqPage();
  else if (cleanPath === "/contact") content = contact();
  else if (cleanPath === "/security") content = security();
  else if (cleanPath === "/privacy") content = legalPage("privacy");
  else if (cleanPath === "/terms") content = legalPage("terms");
  else if (cleanPath === "/one-pager") { content = onePager(); unframed = true; }
  else if (cleanPath === "/templates") content = templatesPage();
  else if (cleanPath === "/session") content = sessionPage();
  else if (cleanPath === "/dashboard") content = dashboard();
  else if (cleanPath === "/scout") { content = '<main id="main" class="page">' + scout() + '</main>'; unframed = true; }
  else if (cleanPath === "/answers") content = answersHub();
  else if (cleanPath.startsWith("/answers/")) content = answerArticle(cleanPath);
  else content = pageHero("Not found", "This page is not in the quire.", "Use the main navigation to return to a current DataQuire page.") + '<section class="section"><div class="wrap">' + primaryLink() + '</div></section>';
  const overviewLabels={"/buyers":"Three uses for operational records", "/partners":"How the partner program works", "/refer":"How referrals work", "/one-pager":"The licensing process", "/session":"About the session", "/scout":"Scout economics", "/security":"A de-identification example"};
  if (overviewLabels[cleanPath]) content=content.replace(/<div class="(card-grid[^\"]*|steps|redaction-exhibit)"/, '<h2 class="sr-only">'+overviewLabels[cleanPath]+'</h2><div class="$1"');
  // Definition rows become native disclosure controls on small screens.
  content = content.replace(/<div class="term"><strong>([\s\S]*?)<\/strong><p>([\s\S]*?)<\/p><\/div>/g, '<details class="term" open><summary>$1</summary><div><p>$2</p></div></details>');
  // A responsive layout can hide a BR. Keep semantic whitespace so its words
  // remain separate in both the rendered line and the accessibility tree.
  return (unframed ? content : shell(cleanPath, content)).replace(/<br>(?!\s)/g, "<br>\n");
}

function renderPath(path, hash) {
  const cleanPath = (path || "/").replace(/\/$/, "") || "/";
  app.innerHTML = routeContent(cleanPath);
  setMeta(cleanPath);
  setupPage(cleanPath);
  if (hash) {
    requestAnimationFrame(function () {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) element.scrollIntoView({behavior: motionReduced() ? "auto" : "smooth"});
    });
  } else window.scrollTo(0, 0);
}

function setMeta(path) {
  const meta = routeMeta[path] || ["Page Not Found | DataQuire", "This page is not in the quire."];
  const url = CONFIG.CANONICAL_ORIGIN + (routeMeta[path] ? path : "/");
  document.title = meta[0];
  const description = $('meta[name="description"]');
  const canonical = $('link[rel="canonical"]');
  const ogTitle = $('meta[property="og:title"]');
  const ogDesc = $('meta[property="og:description"]');
  if (description) description.content = meta[1];
  if (canonical) canonical.href = url;
  if (ogTitle) ogTitle.content = meta[0];
  if (ogDesc) ogDesc.content = meta[1];
  for (const [selector,content] of [['meta[property="og:url"]',url],['meta[name="twitter:title"]',meta[0]],['meta[name="twitter:description"]',meta[1]]]) {
    const element=$(selector); if (element) element.content=content;
  }
  const oldRobots=$('meta[name="robots"]'); if (oldRobots) oldRobots.remove();
  if (["/privacy","/terms","/scout","/templates","/dashboard"].includes(path) || !routeMeta[path]) {
    const robots=document.createElement("meta"); robots.name="robots"; robots.content="noindex,nofollow"; document.head.appendChild(robots);
  }
  const oldSchema = $("#page-schema");
  if (oldSchema) oldSchema.remove();
  const schema = seoSchema(path);
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "page-schema";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function seoSchema(path) {
  const organization = {"@type":"Organization","@id":"https://dataquire.si/#organization","name":"DataQuire","url":"https://dataquire.si","email":"hello@dataquire.si"};
  const page = path === "/faq" ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(function (item) { return {"@type": "Question", name: item[0], acceptedAnswer: {"@type": "Answer", text: item[1]}}; })
  } : path === "/verticals" ? {
    "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      {"@type":"ListItem","position":1,"name":"Home","item":"https://dataquire.si/"},
      {"@type":"ListItem","position":2,"name":"Verticals","item":"https://dataquire.si/verticals"}
    ]
  } : {"@context":"https://schema.org","@type":"Organization","name":"DataQuire","url":"https://dataquire.si","email":"hello@dataquire.si"};
  return {"@context":"https://schema.org","@graph":[organization, page]};
}

let showConsent = false;
let estimatorStarted = false;
let rotatorTimer;
let demandTimer;
let progressListener;
let stopWorkingTrace = () => {};
function setupPage(path) {
  const compactRows = window.matchMedia("(max-width:820px)").matches;
  $$(".catalog-entry, details.term").forEach(row => { row.open = !compactRows; });
  document.documentElement.classList.toggle("motion-paused", storage.getItem("dataquire-motion") === "paused");
  const motionButton=$('[data-action="pause-motion"]');
  if (motionButton) motionButton.textContent=storage.getItem("dataquire-motion") === "paused" ? "Resume motion" : "Pause motion";
  if (path === "/estimator") {
    prepareQuiz();
    const fast=$(".fast-entry"); if (fast && isMobileQuiz()) fast.open=false;
  }
  clearInterval(rotatorTimer);
  clearInterval(demandTimer);
  setupObserver();
  setupProgress();
  setupStoryMotion();
  setupRotator();
  setupDemand();
  setupCalculator();
  setupCobrand();
  restoreReferral();
  gateAnalytics();
  sendEvent("page_view", {path});
  if (path === "/estimator" && !estimatorStarted) { estimatorStarted = true; sendEvent("estimator_start"); }
}

function setupObserver() {
  const targets = $$(".reveal");
  if (motionReduced()) { targets.forEach(node => node.classList.add("seen")); $$("[data-bridge]").forEach(node => node.classList.add("is-seen")); return; }
  targets.forEach(node => node.classList.add("will-reveal"));
  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (node) { node.classList.add("seen"); });
    $$("[data-bridge]").forEach(function (node) { node.classList.add("is-seen"); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("seen");
        const bridgeNode = entry.target.querySelector("[data-bridge]");
        if (bridgeNode) bridgeNode.classList.add("is-seen");
        if (entry.target.matches("[data-bridge]")) entry.target.classList.add("is-seen");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .14});
  targets.forEach(function (node) { observer.observe(node); });
}

function setupProgress() {
  if (progressListener) window.removeEventListener("scroll",progressListener);
  const progress = $(".progress");
  if (!progress) return;
  const update = function () {
    const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = "100%";
    progress.style.transform = "scaleX(" + Math.min(1, window.scrollY / maximum) + ")";
  };
  update();
  progressListener = update;
  window.addEventListener("scroll", update, {passive: true});
}

function setupStoryMotion() {
  stopWorkingTrace();
  stopWorkingTrace = setupWorkingTrace(document, motionReduced());
}

function setupRotator() {
  const node = $("[data-rotator]");
  if (!node || motionReduced()) return;
  const words = ["law firms", "accounting firms", "manufacturers", "logistics companies", "healthcare groups", "insurance agencies", "research labs", "semiconductor fabs", "restaurant groups", "home service companies"];
  let index = 0;
  rotatorTimer = window.setInterval(function () {
    const old = $("span", node);
    if (!old) return;
    const next = document.createElement("span");
    index = (index + 1) % words.length;
    next.textContent = words[index];
    next.style.transform = "translateY(110%)";
    next.style.opacity = "0";
    node.appendChild(next);
    requestAnimationFrame(function () {
      old.style.transform = "translateY(-110%)";
      old.style.opacity = "0";
      next.style.transform = "translateY(0)";
      next.style.opacity = "1";
    });
    window.setTimeout(function () { if (old.parentNode) old.remove(); }, 520);
  }, 3200);
}

function setupDemand() {
  const node = $("[data-demand-copy]");
  if (!node || storage.getItem("dataquire-demand-dismissed")) {
    const demand = $("[data-demand]");
    if (demand) demand.remove();
    return;
  }
  if (motionReduced()) return;
  const messages = [
    "Assess the operational history already inside your business.",
    "No files are uploaded through the estimator.",
    "A factual note: operational records with verifiable outcomes are easier to assess."
  ];
  let index = 0;
  demandTimer = window.setInterval(function () {
    node.style.opacity = "0";
    window.setTimeout(function () {
      index = (index + 1) % messages.length;
      node.textContent = messages[index];
      node.style.opacity = "1";
    }, 260);
  }, 5000);
}

function setupCalculator() {
  const count = $("[data-calc-count]");
  const value = $("[data-calc-value]");
  const output = $("[data-calc-output]");
  if (!count || !value || !output) return;
  const update = function () {
    output.textContent = "$" + ((Number(count.value) * Number(value.value) * .15) / 1000) + "K";
  };
  count.addEventListener("change", update);
  value.addEventListener("change", update);
}

function updateFastEntry() {
  const result=$(".fast-entry .provisional") || $(".fast-entry .save-note");
  if (!result) return;
  const range=provisionalRange(estimatorState.fastSize,estimatorState.fastVertical);
  result.outerHTML=range
    ? '<div class="provisional"><span class="meta">Provisional indicative range</span><strong>'+range+'</strong><small>Answer two minutes of questions for a tighter range.</small><small>Assumptions: raw records, size mapped to volume, non-exclusive, not licensed before.</small></div>'
    : '<p class="save-note">Choose both fields for an instant provisional range.</p>';
}

function setupCobrand() {
  const partner = $("[data-cobrand='partner']");
  const client = $("[data-cobrand='client']");
  if (!partner || !client) return;
  const update = function () {
    const clientOutput = $("[data-cobrand-output]");
    const partnerOutput = $("[data-cobrand-partner]");
    if (clientOutput) clientOutput.textContent = client.value || "your client";
    const headerClient = $("[data-cobrand-header]"); if (headerClient) headerClient.textContent = client.value || "your client";
    if (partnerOutput) partnerOutput.textContent = partner.value || "your firm";
    const headerPartner = $("[data-cobrand-header-partner]"); if (headerPartner) headerPartner.textContent = partner.value || "your firm";
  };
  partner.addEventListener("input", update);
  client.addEventListener("input", update);
}

function gateAnalytics() {
  const choice = readConsent();
  if (!CONFIG.GTM_CONTAINER_ID) return;
  window.dataLayer = window.dataLayer || [];
  const consent={analytics_storage:choice.analytics ? "granted" : "denied", ad_storage:choice.advertising ? "granted" : "denied", ad_user_data:choice.advertising ? "granted" : "denied", ad_personalization:choice.advertising ? "granted" : "denied"};
  function queueConsent() {window.dataLayer.push(arguments);}
  queueConsent("consent",$("#gtm-script") ? "update" : "default",consent);
  if ((!choice.analytics && !choice.advertising) || $("#gtm-script")) return;
  const script = document.createElement("script");
  script.id = "gtm-script";
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(CONFIG.GTM_CONTAINER_ID);
  window.dataLayer.push({"gtm.start": new Date().getTime(), event: "gtm.js"});
  document.head.appendChild(script);
}

function sendEvent(name, payload) {
  if (!readConsent().analytics && !readConsent().advertising) return;
  if (!CONFIG.GTM_CONTAINER_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({event: name}, payload || {}));
}

async function postPayload(formName, fields) {
  const id = fields.submissionId || crypto.randomUUID();
  return deliver(CONFIG.WEBHOOK_URL ? CONFIG.SUBMISSION_URL : "", requestPayload(formName, fields, currentAttribution(), id));
}

function formDataObject(form) {
  const data = {};
  new FormData(form).forEach(function (value, key) {
    value = typeof value === "string" ? value.trim() : value;
    if (Object.prototype.hasOwnProperty.call(data, key)) data[key] = Array.isArray(data[key]) ? data[key].concat(value) : [data[key], value];
    else data[key] = value;
  });
  return data;
}

function formError(form, message) {
  const error = $("[role='alert']", form);
  if (!error) return;
  error.textContent = message;
  error.hidden = !message;
}

async function submitForm(form) {
  if (form.dataset.pending === "true" || form.dataset.delivered === "true") return;
  const invalid = $$("input[required], select[required], textarea[required]", form).filter(function (input) { return !input.value.trim() || !input.checkValidity(); });
  if (invalid.length) {
    formError(form, "Please complete the required fields before sending.");
    invalid[0].focus();
    return;
  }
  if (form.dataset.form === "Buyers" && !$("input[name='dataTypes']:checked", form)) {
    formError(form, "Select at least one data type.");
    return;
  }
  formError(form, "");
  const button = $("button[type='submit']", form);
  if (!form.dataset.submissionId) form.dataset.submissionId = crypto.randomUUID();
  if (button) { button.dataset.original = button.textContent; button.disabled = true; button.textContent = "Sending…"; }
  form.dataset.pending = "true";
  try {
    const result = await postPayload(form.dataset.form, {...formDataObject(form), submissionId:form.dataset.submissionId});
    const success = $(".form-success", form);
    if (success) {
      if (result.demo) {
        success.innerHTML = "<h3>Demo mode: nothing was sent.</h3><p>No webhook is configured, so this form did not deliver a lead. Add an HTTPS endpoint to CONFIG before using it for production submissions.</p>";
      } else {
        success.setAttribute("role","status");
        if (form.dataset.form === "Partners") {
          success.innerHTML = '<h3>Application received. Here is what happens next.</h3><div class="term-list"><div class="term"><strong>01 · Review</strong><p>A personal reply in one to two business days.</p></div><div class="term"><strong>02 · Agreement</strong><p>15 percent, 12-month attribution, and renewals in writing. Register named target accounts at signup; a registered account closing within 12 months credits the partner, with or without a link.</p></div><div class="term"><strong>03 · Materials</strong><p>A referral link and one-pager; private template access is subject to connected authentication.</p></div><div class="term"><strong>04 · First close</strong><p>Authenticated dashboard access requires a connected service. Payouts are quarterly within 30 days of the lab paying us.</p></div></div>';
          Array.from(form.children).forEach(child => { if (child !== success) child.hidden=true; });
        } else if (form.dataset.form === "Session") {
          success.innerHTML = "<h3>Session request received.</h3><p>We will reply to agree a time. A calendar appointment has not yet been booked.</p>";
        } else if (form.dataset.form === "Ledger") {
          success.innerHTML = "<h3>Subscription request received.</h3><p>The monthly ledger request has been delivered.</p>";
        } else success.innerHTML = "<h3>Request received.</h3><p>We will reply within one business day.</p>";
      }
      success.hidden = false;
    }
    if (form.dataset.form === "Refer") await generateReferral(form, result);
    if (!result.demo) form.dataset.delivered = "true";
    if (form.dataset.form === "Buyers") sendEvent("buyer_request");
    if (form.dataset.form === "Partners") sendEvent("partner_apply");
    if (form.dataset.form === "Contact" || form.dataset.form === "Ledger") sendEvent("lead_submit");
  } catch (error) {
    formError(form, error.message || "The form could not be delivered. Please try again.");
  } finally {
    form.dataset.pending = "false";
    if (button) { button.disabled = form.dataset.delivered === "true"; button.textContent = form.dataset.delivered === "true" ? "Received" : button.dataset.original; }
  }
}

async function generateReferral(form, result) {
  if (result.demo) return;
  const email = $("input[name='email']", form);
  const company = $("input[name='company']", form);
  if (!email || !company) return;
  const code = referralCode(email.value);
  const link = CONFIG.CANONICAL_ORIGIN + "/r/" + code;
  storage.setItem(REFERRAL_KEY, JSON.stringify({link: link, email: email.value, createdAt: new Date().toISOString()}));
  await renderReferralLink(link);
}

async function renderReferralLink(link) {
  const output = $("[data-referral-result]");
  if (output) output.innerHTML = '<div class="form-success"><h3>Your referral link is ready.</h3><p>Share this link with the owner you have spoken with. The first link is retained for 12 months. Final attribution and eligibility are confirmed against owner and server records. Email encoding identifies the referral; it is not secure verification.</p><div class="refer-link"><input value="' + esc(link) + '" readonly aria-label="Referral link"><button class="button secondary" data-action="copy-referral" type="button">Copy link</button></div></div>';
  const qr = $("[data-personal-qr]");
  if (qr) {
    const {default: QRCode} = await import("qrcode");
    const svg = await QRCode.toString(link, {type:"svg",color:{dark:"#0B0E0C",light:"#FFFFFF"},margin:2});
    qr.innerHTML = svg;
    const download = $("[data-download-qr]");
    if (download) { download.href="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg); download.hidden=false; }
  }
}

function restoreReferral() {
  if (!$("[data-referral-result]")) return;
  try {
    const saved = JSON.parse(storage.getItem(REFERRAL_KEY) || "null");
    if (saved && saved.link) renderReferralLink(saved.link);
  } catch { /* There is no stored link on this device. */ }
}

function switchEstimatorType(state, type) {
  const next=defaultEstimator();
  for (const key of ["name","company","email","phone","fastSize","fastVertical"]) if (state[key] !== undefined) next[key]=state[key];
  next.type=type;
  return next;
}

function setEstimatorField(field, value) {
  if (estimatorState.submitted && estimatorState[field] !== value) {
    estimatorState.submitted=false;
    estimatorState.submissionId="";
    estimatorState.draftDelivered=false;
  }
  if (["name","company","email"].includes(field) && estimatorState[field] !== value) {
    if (estimatorState.draftDelivered) estimatorState.submissionId="";
    estimatorState.draftDelivered=false;
  }
  if (field === "type" && estimatorState.type !== value) {
    estimatorState=switchEstimatorType(estimatorState,value);
  }
  estimatorState[field] = value;
  if (field === "type") { estimatorState.question = 0; if (value !== "records") estimatorState.hasVideo = ""; }
  if (field === "systems" && value.some(v => /video|headcam/i.test(v))) estimatorState.hasVideo = "yes";
  if (field === "type" && value !== "video") {
    if (value !== "records") estimatorState.capture = estimatorState.hours = estimatorState.angles = estimatorState.releases = estimatorState.futureCapture = "";
  }
  saveEstimator();
}

function rerenderEstimator(moveToStep = false) {
  const quiz = $('[data-quiz]');
  if (!quiz) return;
  const openCategories = $$("details.system-category[open]").map(node => $("summary", node).textContent);
  const focused = document.activeElement;
  const selector = focused && focused.dataset.choice !== undefined ? '[data-choice][data-field="' + focused.dataset.field + '"][data-value="' + CSS.escape(focused.dataset.value) + '"]' : null;
  quiz.outerHTML = renderQuiz(estimatorState);
  $$("details.system-category").forEach(node => { node.open = openCategories.includes($("summary", node).textContent); });
  prepareQuiz();
  if (moveToStep) {
    const heading=$("[data-quiz] h2"); if (heading) { heading.setAttribute("tabindex","-1"); heading.focus({preventScroll:true}); }
    $("[data-quiz]").scrollIntoView({behavior:motionReduced() ? "instant" : "smooth",block:"start"});
  } else if (selector) { const replacement = $(selector); if (replacement) replacement.focus({preventScroll:true}); }
}

if (typeof document !== "undefined") {
document.addEventListener("click", async function (event) {
  const link = event.target.closest("a[data-route]");
  if (link && link.origin === window.location.origin) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const url = new URL(link.href);
    history.pushState({}, "", url.pathname + url.hash);
    renderPath(url.pathname, url.hash);
    const heading=$("h1"); if (heading && !url.hash) {heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true});}
    return;
  }
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) return;
  const action = actionElement.dataset.action;
  if (action === "menu") {
    const menu = $("[data-compact-menu]");
    const expanded = actionElement.getAttribute("aria-expanded") === "true";
    actionElement.setAttribute("aria-expanded", String(!expanded));
    actionElement.textContent = expanded ? "More" : "Close";
    if (menu) menu.hidden = expanded;
  }
  if (action === "dismiss-demand") {
    storage.setItem("dataquire-demand-dismissed", "1");
    const demand = $("[data-demand]");
    if (demand) demand.remove();
  }
  if (action === "consent-accept" || action === "consent-reject") {
    const previous=readConsent();
    const analytics = action === "consent-accept" && !!$("[data-consent-analytics]") && $("[data-consent-analytics]").checked;
    const advertising = action === "consent-accept" && !!$("[data-consent-advertising]") && $("[data-consent-advertising]").checked;
    storage.setItem("dataquire-consent", JSON.stringify({analytics, advertising}));
    showConsent = false;
    const banner = $("[data-cookie]");
    if (banner) banner.remove();
    gateAnalytics();
    if ($("#gtm-script") && ((previous.analytics && !analytics) || (previous.advertising && !advertising))) window.location.reload();
  }
  if (action === "consent-settings") {
    const existing = $("[data-cookie]");
    if (existing) return;
    showConsent = true;
    app.insertAdjacentHTML("beforeend", cookieBanner());
    const prefs = readConsent();
    $("[data-consent-analytics]").checked = prefs.analytics;
    $("[data-consent-advertising]").checked = prefs.advertising;
  }
  if (action === "ledger") {
    const open = actionElement.getAttribute("aria-expanded") === "true";
    $$(".ledger-row[aria-expanded='true']").forEach(function (row) { row.setAttribute("aria-expanded", "false"); });
    actionElement.setAttribute("aria-expanded", String(!open));
    $$(".ledger-row").forEach(row => {
      const detail = $(".ledger-extra", row);
      if (detail) detail.setAttribute("aria-hidden", String(row.getAttribute("aria-expanded") !== "true"));
    });
  }
  if (action === "vertical") {
    const open = actionElement.getAttribute("aria-expanded") === "true";
    const detail = actionElement.nextElementSibling;
    $$(".vertical-row[aria-expanded='true']").forEach(function (row) { row.setAttribute("aria-expanded", "false"); if (row.nextElementSibling) row.nextElementSibling.classList.remove("open"); });
    actionElement.setAttribute("aria-expanded", String(!open));
    if (detail) detail.classList.toggle("open", !open);
  }
  if (action === "redaction-on" || action === "redaction-raw") {
    const exhibit = actionElement.closest("[data-redaction]");
    if (!exhibit) return;
    exhibit.classList.toggle("redacted", action === "redaction-on");
    $$(".pii", exhibit).forEach(node => { node.hidden = action === "redaction-on"; });
    $$("button", exhibit).forEach(function (button) { button.classList.remove("active"); button.setAttribute("aria-pressed", String(button === actionElement)); });
    actionElement.classList.add("active");
    const status = $("[data-redaction-status]", exhibit);
    if (status) status.textContent = action === "redaction-on"
      ? "De-identified: role tokens replace direct identifiers. The correction and outcome are preserved."
      : "Original: illustrative identifiers are visible.";
  }
  if (action === "toggle-systems") {
    estimatorState.showSystems = !estimatorState.showSystems;
    saveEstimator();
    rerenderEstimator();
  }
  if (action === "skip-category") {
    const values = JSON.parse(actionElement.dataset.values);
    const category=$("summary",actionElement.closest("details")).textContent;
    estimatorState.systems = estimatorState.systems.filter(value => !values.includes(value) && value !== "Other: "+category);
    saveEstimator();
    rerenderEstimator();
  }
  if (action === "pause-motion") {
    const paused = storage.getItem("dataquire-motion") === "paused";
    storage.setItem("dataquire-motion", paused ? "running" : "paused");
    document.documentElement.classList.toggle("motion-paused",!paused);
    actionElement.textContent = paused ? "Pause motion" : "Resume motion";
    clearInterval(rotatorTimer);
    clearInterval(demandTimer);
    setupStoryMotion();
    if (paused) { setupRotator(); setupDemand(); }
  }
  if (action === "quiz-back") {
    if (isMobileQuiz() && quizConcepts().length && estimatorState.question > 0) { estimatorState.question--; saveEstimator(); rerenderEstimator(true); return; }
    estimatorState.step = Math.max(0, estimatorState.step - 1);
    estimatorState.question = isMobileQuiz() ? 999 : 0;
    saveEstimator();
    rerenderEstimator(true);
  }
  if (action === "quiz-next") {
    event.preventDefault();
    const steps = estimatorSteps(estimatorState);
    const missing = validationForStep(steps[estimatorState.step], estimatorState);
    const error = $("[data-quiz-error]");
    const invalidInput=$$("[data-quiz] input, [data-quiz] textarea, [data-quiz] select").find(node=>node.offsetHeight>0 && !node.checkValidity());
    if (invalidInput) {
      if (error) {error.hidden=false; error.textContent=invalidInput.type==="email" ? "Enter a valid work email before continuing." : "Complete this field with a valid answer before continuing.";}
      invalidInput.setAttribute("aria-invalid","true");
      invalidInput.focus({preventScroll:true});
      return;
    }
    if (steps[estimatorState.step] === "Contact" && !validEmail(estimatorState.email)) missing.push("email");
    const concepts = quizConcepts();
    const currentConcept = isMobileQuiz() && concepts.length ? concepts[estimatorState.question || 0] : null;
    const fieldsHere = currentConcept ? $$("[data-estimator-field], [data-choice]", currentConcept).map(node => node.dataset.estimatorField || node.dataset.field) : null;
    const currentMissing = fieldsHere ? missing.filter(key => fieldsHere.includes(key)) : missing;
    if (currentMissing.length) {
      if (error) { error.hidden = false; error.textContent = currentMissing.includes("email") ? "Enter a valid work email before continuing." : "Choose or complete the required answer before continuing."; }
      const invalidContact = currentMissing.includes("email") ? $("#est-email") : null;
      if (invalidContact) { invalidContact.setAttribute("aria-invalid","true"); invalidContact.focus({preventScroll:true}); }
      if (currentConcept) {
        const input = $("input, select, textarea, button", currentConcept);
        if (input) input.focus({preventScroll:true});
      }
      return;
    }
    if (error) error.hidden = true;
    if (currentConcept && estimatorState.question < concepts.length - 1) {
      estimatorState.question++;
      saveEstimator();
      rerenderEstimator(true);
      return;
    }
    if (missing.length) {
      if (error) { error.hidden=false; error.textContent="Complete the required answers before continuing."; }
      return;
    }
    if (steps[estimatorState.step] === "Contact" && !await captureContactDraft(actionElement)) return;
    estimatorState.step = Math.min(estimatorState.step + 1, steps.length - 1);
    estimatorState.question = 0;
    saveEstimator();
    sendEvent("estimator_step", {step: estimatorState.step});
    rerenderEstimator(true);
  }
  if (action === "quiz-offline") {
    estimatorState.step=Math.min(estimatorState.step+1,estimatorSteps(estimatorState).length-1);
    estimatorState.question=0;
    saveEstimator();
    rerenderEstimator(true);
  }
  if (action === "clear-estimator") {
    storage.removeItem(STORAGE_KEY);
    estimatorState = defaultEstimator();
    rerenderEstimator();
  }
  if (action === "copy-summary") {
    const pre = $(".lead-summary pre");
    if (pre) copyText(pre.textContent, actionElement, "Summary copied");
  }
  if (action === "submit-estimator") {
    submitEstimator(actionElement);
  }
  if (action === "copy-referral") {
    const input = actionElement.closest(".refer-link") && $("input", actionElement.closest(".refer-link"));
    if (input) copyText(input.value, actionElement, "Link copied");
  }
  if (action === "copy-template") {
    const card = actionElement.closest(".template");
    if (card) copyText(($(".subject", card).innerText + "\n\n" + $("pre", card).innerText), actionElement, "Copied");
  }
  if (action === "print") window.print();
  if (action === "telegram-unavailable") {
    actionElement.insertAdjacentHTML("afterend", '<p class="form-notice">The private Telegram invite URL has not been configured in CONFIG. No public channel link is shown.</p>');
    actionElement.disabled = true;
  }
});

document.addEventListener("change", function (event) {
  const field = event.target.dataset.estimatorField;
  if (field) {
    setEstimatorField(field, event.target.value);
    return;
  }
  if (event.target.matches("[data-fast-size]")) {
    estimatorState.fastSize = event.target.value;
    saveEstimator();
    updateFastEntry();
  }
  if (event.target.matches("[data-fast-vertical]")) {
    estimatorState.fastVertical = event.target.value;
    saveEstimator();
    updateFastEntry();
  }
});

document.addEventListener("input", function (event) {
  const system=event.target.dataset.systemHistory;
  if (system !== undefined && event.target.checkValidity()) {
    if (event.target.value==="") delete estimatorState.systemHistory[system];
    else estimatorState.systemHistory[system]=Number(event.target.value);
    saveEstimator();
  }
  const field = event.target.dataset.estimatorField;
  if (field) setEstimatorField(field, event.target.value);
});

document.addEventListener("click", function (event) {
  const choiceNode = event.target.closest("[data-choice]");
  if (!choiceNode) return;
  const field = choiceNode.dataset.field;
  const value = choiceNode.dataset.value;
  if (choiceNode.dataset.multiple === "true") {
    const selected = Array.isArray(estimatorState[field]) ? estimatorState[field].slice() : [];
    const index = selected.indexOf(value);
    if (index > -1) selected.splice(index, 1); else selected.push(value);
    setEstimatorField(field, selected);
  } else setEstimatorField(field, value);
  rerenderEstimator();
});

document.addEventListener("submit", function (event) {
  if (event.target.matches("form[data-estimator-form]")) {event.preventDefault();return;}
  const lookup=event.target.closest("form[data-referral-lookup]");
  if (lookup) {
    event.preventDefault();
    checkReferralStatus(lookup);
    return;
  }
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  submitForm(form);
});

async function checkReferralStatus(form) {
  const input=$("input[name='email']",form);
  if (!validEmail(input.value)) {formError(form,"Enter a valid referring email.");input.focus();return;}
  const button=$("button[type='submit']",form);
  button.disabled=true;
  formError(form,"");
  try {
    const response=await fetch(CONFIG.REFERRAL_STATUS_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:input.value}),signal:AbortSignal.timeout(20000)});
    const data=await response.json();
    if (!response.ok || data.ok !== true) throw new Error("Status could not be retrieved. Please try again.");
    $("[data-lookup-result]",form).innerHTML='<div class="form-success"><h3>'+Number(data.count)+' introductions returned.</h3>'+(data.stages.length ? '<ol>'+data.stages.map(stage=>'<li>'+esc(stage)+'</li>').join("")+'</ol>' : '<p>No attributed introductions were returned for this email.</p>')+'</div>';
  } catch { formError(form,"Status could not be retrieved. Please try again."); }
  finally {button.disabled=false;}
}

async function submitEstimator(button) {
  if (button.disabled || estimatorState.submitted) return;
  if (!estimatorState.submissionId) estimatorState.submissionId = crypto.randomUUID();
  saveEstimator();
  button.disabled = true;
  button.textContent = "Sending…";
  try {
    const result = await deliver(CONFIG.WEBHOOK_URL ? CONFIG.SUBMISSION_URL : "", estimatorPayload(estimatorState, currentAttribution(), estimatorState.submissionId));
    const notice = $("[data-estimator-notice]");
    if (notice) {
      notice.hidden = false;
      notice.setAttribute("role", "status");
      if (result.demo) notice.textContent = "Demo mode: no webhook is configured, so no lead has been delivered. Your answers remain on this device until you clear them.";
      else {
        notice.textContent = "Request received. We will follow up using the contact information you provided.";
        storage.removeItem(STORAGE_KEY);
        estimatorState.submitted = true;
        sendEvent("estimator_complete");
        sendEvent("lead_submit", {form:"Estimator"});
      }
    }
  } catch (error) {
    const notice = $("[data-estimator-notice]");
    if (notice) {
      notice.hidden = false;
      notice.setAttribute("role","alert");
      notice.textContent = error.message || "The request could not be delivered. Please try again.";
    }
  } finally {
    button.disabled = estimatorState.submitted;
    button.textContent = estimatorState.submitted ? "Request received" : "Get a real valuation";
  }
}

async function copyText(text, button, confirmation) {
  try {
    await navigator.clipboard.writeText(text);
    const old = button.textContent;
    button.textContent = confirmation;
    window.setTimeout(function () { button.textContent = old; }, 1400);
  } catch (error) {
    button.textContent = "Copy unavailable";
  }
}

window.addEventListener("popstate", function () {
  renderPath(window.location.pathname, window.location.hash);
});

const incoming = window.location.pathname.match(/^\/r\/([^/]+)\/?$/);
if (incoming) {
  captureAttribution(incoming[1]);
  history.replaceState({}, "", "/estimator");
}
const queryReferral = new URLSearchParams(window.location.search).get("ref");
if (queryReferral) captureAttribution(queryReferral);
renderPath(window.location.pathname, window.location.hash);
window.matchMedia("(max-width:760px)").addEventListener("change", prepareQuiz);
window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => {
  clearInterval(rotatorTimer);
  clearInterval(demandTimer);
  setupObserver();
  setupStoryMotion();
  setupRotator();
  setupDemand();
});

}

export {routeContent, routeMeta, faqs, verticals, estimatorRange, validationForStep, defaultEstimator, switchEstimatorType, articleRoutes, seoSchema};
