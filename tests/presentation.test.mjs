import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {parseHTML} from "linkedom";
import {routeContent, routeMeta} from "../app.js";
import {setupWorkingTrace} from "../lib/home-motion.js";

test("requested offer copy and meaningful motion stay within the five-section home", () => {
  const {document} = parseHTML(routeContent("/"));
  assert.equal(document.querySelector("h1").textContent, "Turn the knowledge inside your business into revenue.");
  assert.equal(document.querySelector(".offer-copy > p").textContent, "Earn $20K–$5M for operational data. DataQuire advises you through the process.");
  assert.equal(document.querySelector(".problem-heading h2").textContent.replace(/\s+/g," "), "AI knows the answers. It needs the work behind them.");
  assert.equal(document.querySelectorAll(".gather-leaf").length,3);
  assert.deepEqual([...document.querySelectorAll(".record-examples li")].map(node=>node.textContent),[
    "Signed contracts","Month-end closes","Internal SOPs","Code reviews",
    "Support tickets","Sales call notes","Dispatch logs","Change orders"
  ]);
  assert.equal(document.querySelector(".record-examples").hasAttribute("aria-live"),false);
  assert.deepEqual([...document.querySelectorAll("[data-trace-step]")].map(node=>node.textContent),["Task","Correction","Outcome"]);
  const exhibit=document.querySelector(".process-section [data-redaction]");
  assert.ok(exhibit);
  assert.equal(exhibit.querySelector(".exhibit-label").textContent,"Sample record. No client data.");
  assert.equal(exhibit.querySelectorAll(".pii").length,3);
  assert.equal(exhibit.querySelectorAll(".token").length,3);
  assert.equal(exhibit.querySelector("[data-redaction-status]").getAttribute("role"),"status");
  for(const button of exhibit.querySelectorAll("button")) assert.ok(exhibit.querySelector("#"+button.getAttribute("aria-controls")));
});

test("live private records pause offscreen and in hidden tabs, clean up, and stay complete without motion",()=>{
  const {document}=parseHTML(routeContent("/"));
  const card=document.querySelector("[data-private-record]");
  const originalWindow=globalThis.window;
  const listeners=new Map();
  const timers=new Map();
  let serial=0;
  let notify, observed, disconnected=false, hidden=false;
  Object.defineProperty(document,"hidden",{get:()=>hidden});
  document.addEventListener=(name,callback)=>listeners.set(name,callback);
  document.removeEventListener=(name,callback)=>{if(listeners.get(name)===callback)listeners.delete(name);};
  globalThis.window={
    setInterval(callback,delay){assert.equal(delay,5000);const id=++serial;timers.set(id,callback);return id;},
    clearInterval(id){timers.delete(id);},
    IntersectionObserver:class {
    constructor(callback){notify=callback;}
    observe(node){observed=node;}
    disconnect(){disconnected=true;}
  }};
  try {
    const stop=setupWorkingTrace(document,false);
    assert.equal(observed,card);
    assert.equal(card.classList.contains("is-live"),true);
    assert.equal(card.classList.contains("is-running"),false);
    notify([{target:card,isIntersecting:true}]);
    assert.equal(card.classList.contains("is-running"),true);
    assert.equal(timers.size,1);
    const tick=[...timers.values()][0];
    const captions=[
      "A delivery appointment changes. Dispatch needs a route that meets the new window.",
      "An incorrect pallet count invalidates the first route. Dispatch checks and corrects the load sheet.",
      "The revised route meets capacity and timing requirements. The result can be checked.",
      "The task, the correction, and a verified outcome belong to the same working record."
    ];
    for(const [stage,count] of [1,2,3,0,1].entries()) {
      assert.equal(card.querySelectorAll(".is-complete").length,count);
      assert.equal(card.querySelector("[data-trace-caption]").textContent,captions[stage%4]);
      tick();
    }
    hidden=true;
    listeners.get("visibilitychange")();
    assert.equal(card.classList.contains("is-running"),false);
    assert.equal(timers.size,0);
    hidden=false;
    listeners.get("visibilitychange")();
    assert.equal(card.classList.contains("is-running"),true);
    notify([{target:card,isIntersecting:false}]);
    assert.equal(card.classList.contains("is-running"),false);
    stop();
    assert.equal(disconnected,true);
    assert.equal(listeners.size,0);
    assert.equal(timers.size,0);
    assert.equal(card.classList.contains("is-live"),false);
    assert.equal(card.querySelectorAll(".is-complete").length,3);
    observed=null;
    setupWorkingTrace(document,true)();
    assert.equal(observed,null);
    assert.equal(listeners.size,0);
    assert.equal(card.classList.contains("is-live"),false);
    assert.equal(card.querySelectorAll(".record-examples li").length,8);
    assert.equal(card.querySelectorAll(".is-complete").length,3);
    assert.equal(card.querySelector("[aria-current]"),null);
    assert.match(card.querySelector("[data-trace-caption]").textContent,/same working record/);
  } finally {
    if(originalWindow===undefined) delete globalThis.window;
    else globalThis.window=originalWindow;
  }
});

test("home follows the five-scene architecture and preserves the sole hero action", () => {
  const {document} = parseHTML(routeContent("/"));
  const main = document.querySelector("main");
  assert.equal(main.children.length, 5);
  assert.deepEqual([...main.children].map(node => node.tagName), Array(5).fill("SECTION"));
  const hero = main.firstElementChild;
  assert.equal(hero.querySelectorAll("h1").length, 1);
  assert.equal(hero.querySelectorAll("a").length, 1);
  assert.equal(hero.querySelector("a").textContent, "See what your data is worth");
  assert.equal(hero.querySelector("a").getAttribute("href"), "/estimator");
  assert.match(hero.querySelector("p").textContent, /\$20K–\$5M/);
  assert.equal(main.querySelectorAll(".process-steps > li").length, 3);
  const catalog = [...main.querySelectorAll(".catalog-entry")];
  assert.equal(catalog.length, 8);
  assert.deepEqual(catalog.slice(0,4).map(node => node.querySelector("h3").textContent), ["Legal work product", "Oil & gas operations", "Semiconductor process records", "Video game development"]);
  for (const system of ["QuickBooks", "Slack", "Zendesk", "Revit"]) assert.ok(main.textContent.includes(system));
  assert.match(main.textContent, /100\+ employees/);
});

test("the visible deal process retains all five steps and consolidates qualifications", () => {
  const {document} = parseHTML(routeContent("/"));
  const walkthrough = document.querySelector(".engagement-walkthrough");
  assert.equal(walkthrough.tagName,"DIV");
  assert.equal(walkthrough.querySelector("h3").textContent,"From first call to payout.");
  assert.equal(walkthrough.querySelector(".walkthrough-heading p").textContent,"How a deal moves.");
  assert.equal(walkthrough.querySelector(".walkthrough-label").textContent,"Timelines vary by deal.");
  assert.equal(walkthrough.querySelector(".walkthrough-content > p:last-child").textContent,"Some engagements end without a license.");
  assert.deepEqual([...walkthrough.querySelectorAll(".engagement-timeline > li")].map(node=>[...node.children].map(child=>child.textContent)),[
    ["Days 1–3","Onboard & define","Confirm the owner, sources, and exclusions."],
    ["Days 4–10","Review & prepare","Assess rights and quality; prepare the agreed sample."],
    ["Days 11–20","Buyer review","Share only an approved, redacted preview under NDA."],
    ["Days 21–27","Agree the license","Define use, duration, retention, price, and payment."],
    ["Days 28–30","Deliver & receive payment","For this example, payment follows delivery within the agreed period."]
  ]);
  assert.equal(document.querySelectorAll(".advisory-notes details").length, 1);
  assert.match(document.querySelector(".advisory-notes summary").textContent, /Advisory & Legal Notes/);
  assert.match(document.querySelector(".advisory-notes").textContent,/30-day timeline is an example/);
  assert.match(document.querySelector(".process-steps li:first-child p").textContent,/Get your estimate\.$/);
  assert.equal(document.querySelector(".estimate-caption").textContent,"Your estimate before any commitment.");
});

test("all routes avoid unfinished evidence, numbering remnants, and copy concatenation", () => {
  for (const route of Object.keys(routeMeta)) {
    const {document} = parseHTML(routeContent(route));
    assert.doesNotMatch(document.toString(), /\b(indicative|illustrative)\b/i,route);
    assert.doesNotMatch(routeMeta[route].join(" "), /\b(indicative|illustrative)\b/i,route+" metadata");
    assert.doesNotMatch(document.querySelector(".site-shell, main").textContent, /PLACEHOLDER|Folio\s*\d|—/, route);
    for (const heading of document.querySelectorAll("h1,h2,h3")) {
      assert.doesNotMatch(heading.textContent, / {2,}|\b(law firms)\s+\1\b|knowledgeinside/i, route);
      assert.doesNotMatch(heading.textContent, /[a-z][.!?][A-Z]/, route);
    }
    for (const paragraph of document.querySelectorAll("p")) {
      assert.doesNotMatch(paragraph.textContent, /[a-z][.!?][A-Z]/, route + ": " + paragraph.textContent);
      for (const inline of paragraph.querySelectorAll("b,strong,em")) {
        const next = inline.nextSibling;
        if (next?.nodeType === 3 && /[a-z]$/i.test(inline.textContent)) assert.doesNotMatch(next.textContent, /^[a-z]/i, route + " missing inline separation");
      }
    }
  }
});

test("internal links and fragments resolve to existing routes or public assets", async () => {
  const documents = new Map(Object.keys(routeMeta).map(route => [route, parseHTML(routeContent(route)).document]));
  for (const [route, document] of documents) {
    for (const link of document.querySelectorAll("a[href]")) {
      const href = link.getAttribute("href");
      if (!href.startsWith("/") && !href.startsWith("#")) continue;
      const url = new URL(href, "https://dataquire.si" + route);
      if (documents.has(url.pathname)) {
        if (url.hash) assert.ok(documents.get(url.pathname).getElementById(url.hash.slice(1)), route + ": " + href);
      } else await assert.doesNotReject(fs.access("public" + url.pathname), route + ": " + href);
    }
  }
});

test("buyer conversion targets the buyer intake and keyboard focus stays visible on controls", async () => {
  const {document} = parseHTML(routeContent("/buyers"));
  assert.ok(document.querySelector("#buyer-intake form[data-form='Buyers']"));
  assert.equal(document.querySelector(".nav-cta").getAttribute("href"), "/buyers#buyer-intake");
  assert.equal(document.querySelector("main a[href='/estimator']"), null);
  const css = await fs.readFile("styles.css", "utf8");
  assert.match(css, /:focus-visible/);
  assert.match(css, /\[tabindex="-1"\]:focus/);
  assert.match(css, /prefers-reduced-motion/);
});
