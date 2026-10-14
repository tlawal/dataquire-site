/** @type {Readonly<Record<string, number>>} */
export const VERTICAL_BASE = Object.freeze({
  Semiconductors: 180000, Aerospace: 150000, Legal: 90000,
  "Science labs": 120000, Accounting: 60000, "Video and media": 40000,
  Healthcare: 70000, "Insurance claims": 110000,
  "Construction and architecture": 100000, Other: 80000
});
export const VOLUME = Object.freeze({"Under 10k": .15, "10k to 1M": 1, "1M to 100M": 8, "Over 100M": 40});
export const STRUCTURE = Object.freeze({yes: 1.5, partially: 1.2, raw: 1});
export const DOMAIN_BASE = Object.freeze({"customer service": 60000, "software engineering": 90000, finance: 70000, legal: 80000, "science/lab": 100000, other: 50000});
export const HOURS_BASE = Object.freeze({"under 10": 15000, "10-100": 60000, "100-1,000": 200000, "1,000+": 600000});

/** @param {Partial<import("../types/contracts.js").EstimatorState>} state */
export function estimate(state) {
  /** @type {import("../types/contracts.js").Factor[]} */
  let factors;
  if (state.type === "rl") {
    factors = [
      ["Domain base", DOMAIN_BASE[state.domain] || 50000, "money"],
      ["Task count", {"under 50": .5, "50 to 500": 1, "500+": 2.5}[state.taskCount] || 1],
      ["Graders", {"calibrated graders included": 1.8, "partial checks": 1.2, "no graders yet": .7}[state.graders] || 1],
      ["Headless scale", state.headless === "yes" ? 1.5 : 1]
    ];
  } else if (state.type === "video") {
    factors = [
      ["Hours base", HOURS_BASE[state.hours] || 15000, "money"],
      ["Angles", state.angles === "multi-angle" ? 1.5 : 1],
      ["Signed releases", {yes: 1.2, partial: 1, no: .7}[state.releases] || 1]
    ];
  } else {
    factors = [
      ["Vertical base", VERTICAL_BASE[state.vertical] || 80000, "money"],
      ["Volume", VOLUME[state.volume] || 1],
      ["Structure", STRUCTURE[state.structured] || 1],
      ["Exclusive license", state.exclusive === "yes" ? 1.8 : 1],
      ["Previously licensed", state.licensedBefore === "yes" ? .6 : 1]
    ];
    if (state.type === "dataset") factors.push(["Actively updated", state.updated === "yes" ? 1.2 : 1]);
  }
  const midpoint = factors.reduce((product, factor) => product * factor[1], 1);
  return {midpoint, low: midpoint * .5, high: midpoint * 2, factors};
}

/** @param {Partial<import("../types/contracts.js").EstimatorState>} state */
export function flow(state) {
  if (state.type === "dataset") return ["Type", "Dataset", "Contact", "Details", "Result"];
  if (state.type === "rl") return ["Type", "Environment", "Contact", "Result"];
  if (state.type === "video") return ["Type", "Video", "Contact", "Result"];
  return state.hasVideo === "yes" ? ["Type", "Systems", "Contact", "Details", "Video", "Result"] : ["Type", "Systems", "Contact", "Details", "Result"];
}

/** @param {number} amount */
export function money(amount) {
  if (amount >= 1000000) return "$" + Number((amount / 1000000).toFixed(2)) + "M";
  if (amount >= 1000) return "$" + Number((amount / 1000).toFixed(1)) + "K";
  return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: 0}).format(amount);
}

/** @param {unknown} value */
export function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

/** @param {string} email */
export function referralCode(email) {
  const bytes = new TextEncoder().encode(email.trim().toLowerCase());
  // Reversible encoding identifies a referral. It is not authentication.
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/** @param {string} code */
export function decodeReferral(code) {
  try {
    const binary = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
    const email = new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
    return validEmail(email) ? email : "";
  } catch { return ""; }
}

/**
 * @param {import("../types/contracts.js").Attribution | null} existing
 * @param {string} code
 */
export function claimAttribution(existing, code, now = new Date()) {
  const email = decodeReferral(code);
  if (!email) return existing || null;
  if (existing && new Date(existing.expiresAt).getTime() > now.getTime()) return existing;
  const expiry = new Date(now);
  expiry.setUTCFullYear(expiry.getUTCFullYear() + 1);
  return {code, email, firstSeenAt: now.toISOString(), expiresAt: expiry.toISOString(), mechanism: "first-link", verified: false};
}

/**
 * @param {string} form
 * @param {Record<string, any>} fields
 * @param {import("../types/contracts.js").Attribution | null} attribution
 * @param {string} id
 * @returns {import("../types/contracts.js").WebhookPayload}
 */
export function requestPayload(form, fields, attribution, id) {
  const contact = fields.contact || fields;
  /** @type {Record<string, any>} */
  const additional = {...fields, submissionId:id, submittedAt:new Date().toISOString()};
  delete additional.message;
  return {
    form, name: contact.name || "", company: contact.company || contact.organization || "",
    email: contact.email || "", phone: contact.phone || "", vertical: fields.vertical || fields.details?.vertical || "",
    volume: fields.volume || fields.dataset?.dvolume || fields.details?.volume || "",
    labeled: fields.labeled || fields.dataset?.dlabeled || fields.details?.labeled || "",
    exclusive: fields.exclusive || fields.details?.exclusive || "",
    licensedBefore: fields.licensedBefore || fields.details?.licensedBefore || "",
    valuationLow: fields.indicativeRange?.low || 0,
    valuationHigh: fields.indicativeRange?.high || 0,
    ref: attribution?.email || "",
    message: (fields.message ? fields.message + "\n\n" : "") + JSON.stringify(additional, null, 2)
  };
}

/**
 * @param {import("../types/contracts.js").EstimatorState} state
 * @param {import("../types/contracts.js").Attribution | null} attribution
 * @param {string} id
 */
export function estimatorPayload(state, attribution, id, phase = "valuation") {
  const model = estimate(state);
  const contact = {name: state.name.trim(), company: state.company.trim(), email: state.email.trim(), phone: state.phone.trim()};
  return requestPayload("Estimator", {
    phase,
    submitType: state.type === "rl" ? "env" : state.type,
    contact, systems: state.type === "records" ? state.systems : [],
    otherSystems: state.type === "records" ? (state.otherSystems || "") : "",
    details: state.type === "records" || state.type === "dataset" ? {
      vertical: state.vertical, volume: state.type === "records" ? state.volume : "",
      labeled: state.type === "records" ? state.structured : "", exclusive: state.exclusive,
      licensedBefore: state.licensedBefore, companySize: state.companySize,
      yearsOnSystems: state.years,
      ...(state.type === "records" ? {coreSystem:state.coreSystem, coreYears:state.coreYears, systemHistory:state.systemHistory || {}, exportReadiness:state.exportReadiness} : {}),
      provenance: state.provenance, video: state.type === "records" ? state.hasVideo : ""
    } : {},
    dataset: state.type === "dataset" ? {format: state.format, dvolume: state.volume, dlabeled: state.structured, updated: state.updated} : {},
    env: state.type === "rl" ? {domain: state.domain, tasks: state.taskCount, graders: state.graders, escale: state.headless, erights: state.owned} : {},
    video: state.type === "video" || state.hasVideo === "yes" ? {captureMethod: state.capture, hours: state.hours, angle: state.angles, releases: state.releases, equip: state.futureCapture} : {},
    indicativeRange: phase === "valuation" ? {low: model.low, high: model.high, currency: "USD", model: "illustrative-v1", factors: model.factors} : null
  }, attribution, id);
}
