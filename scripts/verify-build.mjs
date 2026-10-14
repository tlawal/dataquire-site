import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import {parseHTML} from "linkedom";
import {routeMeta} from "../app.js";

const titles=new Set();
for(const route of Object.keys(routeMeta)) {
  const filename=route==="/" ? "dist/index.html" : path.join("dist",route,"index.html");
  const html=await fs.readFile(filename,"utf8");
  const {document}=parseHTML(html);
  assert.equal(document.querySelectorAll("main").length,1,route);
  assert.equal(document.querySelectorAll("h1").length,1,route);
  assert.equal(document.querySelector('link[rel="canonical"]').getAttribute("href"),"https://dataquire.si"+route);
  assert.ok(!titles.has(document.title),"Duplicate title: "+route);
  titles.add(document.title);
  const schema=JSON.parse(document.querySelector("#page-schema").textContent);
  assert.equal(schema["@context"],"https://schema.org");
  for(const script of document.querySelectorAll("script[src]")) await fs.access(path.join("dist",script.getAttribute("src")));
  assert.ok(!html.includes("alert("));
  assert.ok(!html.includes("—"),route+" em dash");
}
const sitemap=await fs.readFile("dist/sitemap.xml","utf8");
for(const route of ["/privacy","/terms","/scout","/templates","/dashboard"]) assert.ok(!sitemap.includes("https://dataquire.si"+route+"</loc>"));
await fs.access("dist/404.html");
const assets=await fs.readdir("dist/_astro");
for (const asset of assets.filter(name=>name.endsWith(".js"))) {
  const script=await fs.readFile(path.join("dist/_astro",asset),"utf8");
  assert.ok(!/\balert\s*\(/.test(script),"Native alert in "+asset);
  assert.ok(!script.includes("The graceful exit"),"Private partner content in public bundle");
}
assert.ok(!(await fs.readdir("dist")).includes("private"),"Private assets copied to dist");
for (const asset of ["favicon.svg","og-dataquire.png","robots.txt","site.webmanifest","downloads/dataquire-flyer.pdf","downloads/dataquire-postcard.pdf"]) await fs.access(path.join("dist",asset));
console.log("Verified all "+titles.size+" prerendered routes: H1/main, unique SEO, canonical URLs, JSON-LD, script assets, unlisted routes and 404.");
console.log("Production bundles contain no native alert calls or private templates. Social and print assets present.");
