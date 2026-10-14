// Isolated browser QA only. No requests from this server reach Apps Script.
// Not included in dist/ or the deployed Netlify functions.
import process from "node:process";
import {createPreviewServer} from "../scripts/preview.mjs";

const server = createPreviewServer(async (req, res, next) => {
  if (req.url !== "/api/lead" && req.url !== "/api/referral-status") return next();
  let input="";
  for await (const chunk of req) input+=chunk;
  const body=JSON.parse(input);
  let phase="";
  try {phase=JSON.parse(body.message).phase || "";} catch { /* Other forms use a readable prefix. */ }
  console.log("LOCAL QA ONLY", body.form || "Status", phase);
  if (body.email === "failure@example.com") {
    res.writeHead(502,{"Content-Type":"application/json"});
    res.end(JSON.stringify({ok:false,error:"Simulated QA transport failure."}));
    return;
  }
  res.writeHead(200, {"Content-Type":"application/json", "Cache-Control":"no-store"});
  res.end(JSON.stringify(req.url === "/api/referral-status" ? {ok:true,count:0,stages:[]} : {ok:true}));
});
server.listen(4174, "127.0.0.1", () => console.log("Isolated browser QA: http://127.0.0.1:4174"));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close(() => process.exit(0)));
