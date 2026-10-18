import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import {leadMiddleware} from "../lib/webhook-proxy.js";
import {redirectAlias} from "../lib/route-aliases.js";

const root = path.resolve("dist");
const mime = {".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".json":"application/json", ".xml":"application/xml", ".txt":"text/plain", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".woff2":"font/woff2", ".pdf":"application/pdf", ".webmanifest":"application/manifest+json"};

async function serve(req, res) {
  try {
    let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname.startsWith("/r/")) pathname = "/estimator";
    let filename = path.resolve(root, "." + pathname);
    if (filename !== root && !filename.startsWith(root + path.sep)) {res.writeHead(403); res.end(); return;}
    try {
      if ((await fs.stat(filename)).isDirectory()) filename = path.join(filename, "index.html");
      const body = await fs.readFile(filename);
      res.writeHead(200, {"Content-Type":mime[path.extname(filename)] || "application/octet-stream"});
      res.end(req.method === "HEAD" ? undefined : body);
    } catch {
      res.writeHead(404, {"Content-Type":"text/html; charset=utf-8"});
      res.end(await fs.readFile(path.join(root, "404.html")));
    }
  } catch {res.writeHead(400); res.end("Invalid request.");}
}

export function createPreviewServer(relay = leadMiddleware()) {
  return http.createServer((req, res) => redirectAlias(req, res, () => relay(req, res, () => serve(req, res))));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createPreviewServer();
  server.listen(4173, "127.0.0.1", () => console.log("DataQuire production preview: http://127.0.0.1:4173"));
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close(() => process.exit(0)));
}
