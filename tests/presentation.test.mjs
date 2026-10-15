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
  assert.equal(document.querySelector(".problem-heading h2").textContent.replace(/\s+/g," "), "AI can read the answer. It needs the work behind it.");
  assert.equal(document.querySelectorAll(".gather-leaf").length,3);
  assert.deepEqual([...document.querySelectorAll("[data-trace-step]")].map(node=>node.textContent),["Task","Correction","Outcome"]);
  const exhibit=document.querySelector(".process-section [data-redaction]");
  assert.ok(exhibit);
  assert.equal(exhibit.querySelector(".exhibit-label").textContent,"Sample record. No client data.");
  assert.equal(exhibit.querySelectorAll(".pii").length,3);
  assert.equal(exhibit.querySelectorAll(".token").length,3);
  assert.equal(exhibit.querySelector("[data-redaction-status]").getAttribute("role"),"status");
  for(const button of exhibit.querySelectorAll("button")) assert.ok(exhibit.querySelector("#"+button.getAttribute("aria-controls")));
});

test("scroll trace advances and reverses, cleans up after navigation, and stays complete without motion",()=>{
  const {document}=parseHTML(routeContent("/"));
  const trace=document.querySelector("[data-working-trace]");
  const originalWindow=globalThis.window;
  const listeners=new Map(), frames=new Map();
  let top=800, serial=0;
  trace.getBoundingClientRect=()=>({top});
  globalThis.window={innerHeight:900,
    requestAnimationFrame(callback){const id=++serial;frames.set(id,callback);return id;},
    cancelAnimationFrame(id){frames.delete(id);},
    addEventListener(name,callback){listeners.set(name,callback);},
    removeEventListener(name,callback){if(listeners.get(name)===callback)listeners.delete(name);}
  };
  const scrollTo=position=>{
    top=position;
    listeners.get("scroll")();
    for(const [id,callback] of frames){frames.delete(id);callback();}
  };
  try {
    const stop=setupWorkingTrace(document,false);
    assert.equal(trace.dataset.traceStage,"0");
    scrollTo(500);
    assert.equal(trace.dataset.traceStage,"1");
    assert.equal(trace.querySelector('[aria-current="step"]').textContent,"Correction");
    scrollTo(250);
    assert.equal(trace.dataset.traceStage,"2");
    assert.match(trace.querySelector("[data-trace-caption]").textContent,/result can be checked/);
    scrollTo(800);
    assert.equal(trace.dataset.traceStage,"0");
    listeners.get("scroll")();
    stop();
    assert.equal(listeners.size,0);
    assert.equal(frames.size,0);
    assert.equal(trace.classList.contains("trace-enhanced"),false);
    setupWorkingTrace(document,true)();
    assert.equal(listeners.size,0);
    assert.equal(trace.querySelectorAll(".is-complete").length,3);
    assert.equal(trace.querySelector("[aria-current]"),null);
    assert.match(trace.querySelector("[data-trace-caption]").textContent,/same working record/);
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
