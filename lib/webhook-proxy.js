import {CONFIG} from "../config.js";
import {validEmail} from "./model.js";

const allowedForms = new Set(["Estimator","Buyers","Partners","Refer","Contact","Ledger","Session"]);
const allowedKeys = ["form","name","company","email","phone","vertical","volume","labeled","exclusive","licensedBefore","valuationLow","valuationHigh","ref","message"];
const acknowledged = new Map();
const pending = new Map();

function requestKey(body) {
  try {
    const marker=body.message.lastIndexOf("\n\n{");
    const details=JSON.parse(marker<0 ? body.message : body.message.slice(marker+2));
    return details.submissionId ? details.submissionId + ":" + (details.phase || body.form) : "";
  } catch { return ""; }
}

export async function forwardLead(body, fetcher = fetch) {
  if (!body || !allowedForms.has(body.form) || !validEmail(body.email)) {
    return {status:400, body:{ok:false, error:"A valid form and email are required."}};
  }
  const payload=Object.fromEntries(allowedKeys.map(key=>[key, body[key] ?? (key.startsWith("valuation") ? 0 : "")]));
  const key=requestKey(body);
  const cached=key && acknowledged.get(key);
  if (cached && Date.now()-cached.at<86400000) return cached.result;
  if (key && pending.has(key)) return pending.get(key);
  const operation=send(payload,fetcher);
  if (key) pending.set(key,operation);
  const result=await operation;
  if (key) {
    pending.delete(key);
    if (result.status===200) acknowledged.set(key,{at:Date.now(),result});
    if (acknowledged.size>500) acknowledged.delete(acknowledged.keys().next().value);
  }
  return result;
}

async function send(payload,fetcher) {
  try {
    const response=await fetcher(CONFIG.WEBHOOK_URL,{
      method:"POST",redirect:"follow",headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload),signal:AbortSignal.timeout(18000)
    });
    const result=await response.json();
    if (!response.ok || !(result.ok === true || result.success === true || result.status === "success")) {
      return {status:502,body:{ok:false,error:"The receiving service did not confirm delivery."}};
    }
    return {status:200,body:result};
  } catch {
    return {status:502,body:{ok:false,error:"The receiving service could not be reached."}};
  }
}

export async function lookupReferralStatus(email,fetcher=fetch) {
  if (!validEmail(email)) return {status:400,body:{ok:false,error:"Enter a valid email."}};
  const url=new URL(CONFIG.WEBHOOK_URL);
  url.searchParams.set("action","status");
  url.searchParams.set("email",email.trim().toLowerCase());
  try {
    const response=await fetcher(url,{signal:AbortSignal.timeout(18000)});
    const data=await response.json();
    if (!response.ok || data.ok !== true || !Array.isArray(data.leads)) throw new Error("Unconfirmed status.");
    // Anonymous lookup reveals stages only. Deal documents and financials
    // must be served behind the separate approved-partner authentication.
    return {status:200,body:{ok:true,count:data.leads.length,stages:data.leads.map(lead=>String(lead.stage || lead.status || "Status not provided").slice(0,80))}};
  } catch { return {status:502,body:{ok:false,error:"Status could not be retrieved. Please try again."}}; }
}

export function leadMiddleware() {
  return async (req,res,next) => {
    const route=req.url?.split("?")[0];
    if (route !== "/api/lead" && route !== "/api/referral-status") return next();
    if (req.method !== "POST") { res.writeHead(405,{"Allow":"POST"}); res.end(); return; }
    let input="";
    try {
      for await (const chunk of req) {
        input+=chunk;
        if (input.length>65536) {res.writeHead(413); res.end(); return;}
      }
      const fields=JSON.parse(input);
      const result=route === "/api/referral-status" ? await lookupReferralStatus(fields.email) : await forwardLead(fields);
      res.writeHead(result.status,{"Content-Type":"application/json","Cache-Control":"no-store"});
      res.end(JSON.stringify(result.body));
    } catch {
      res.writeHead(400,{"Content-Type":"application/json"});
      res.end(JSON.stringify({ok:false,error:"Invalid JSON request."}));
    }
  };
}
