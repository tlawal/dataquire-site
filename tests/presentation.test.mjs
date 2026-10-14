import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {parseHTML} from "linkedom";
import {routeContent, routeMeta} from "../app.js";

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

test("walkthrough is explicitly hypothetical and notes are consolidated in a disclosure", () => {
  const {document} = parseHTML(routeContent("/"));
  const walkthrough = document.querySelector(".engagement-walkthrough");
  assert.match(walkthrough.querySelector("summary").textContent, /Illustrative engagement/);
  assert.match(walkthrough.textContent, /not a past client engagement/);
  assert.match(walkthrough.textContent, /not a past client engagement, transaction claim, or promised timeline/);
  assert.match(walkthrough.textContent, /Days 28–30/);
  assert.equal(document.querySelectorAll(".advisory-notes details").length, 1);
  assert.match(document.querySelector(".advisory-notes summary").textContent, /Advisory & Legal Notes/);
});

test("all routes avoid unfinished evidence, numbering remnants, and copy concatenation", () => {
  for (const route of Object.keys(routeMeta)) {
    const {document} = parseHTML(routeContent(route));
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
