import fs from "node:fs/promises";
import {routeMeta} from "../app.js";

const unlisted = new Set(["/privacy", "/terms", "/scout", "/templates", "/dashboard"]);
const routes = Object.keys(routeMeta).filter(route => !unlisted.has(route));
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + routes.map(route => "  <url><loc>https://dataquire.si" + route + "</loc></url>").join("\n") + "\n</urlset>\n";
await fs.writeFile("dist/sitemap.xml", sitemap);
console.log("Sitemap generated for " + routes.length + " public routes.");
