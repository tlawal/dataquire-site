import test from "node:test";
import assert from "node:assert/strict";
import {parseHTML} from "linkedom";
import {routeContent, routeMeta, defaultEstimator, switchEstimatorType, validationForStep, faqs, seoSchema} from "../app.js";
import {estimate, flow, claimAttribution, referralCode, decodeReferral, estimatorPayload, requestPayload, validEmail} from "../lib/model.js";
import {deliver} from "../lib/submission.js";
import {forwardLead,lookupReferralStatus} from "../lib/webhook-proxy.js";

test("company records preserve vertical, volume, structure, exclusivity and licensing math", () => {
  const s={type:"records",vertical:"Semiconductors",volume:"10k to 1M",structured:"yes",exclusive:"yes",licensedBefore:"no"};
  const model=estimate(s);
  assert.equal(model.midpoint,180000*1*1.5*1.8);
  assert.equal(model.low,243000);
  assert.equal(model.high,972000);
  assert.equal(estimate({...s,vertical:"Accounting"}).midpoint,60000*1.5*1.8);
  assert.equal(estimate({...s,licensedBefore:"yes"}).midpoint,model.midpoint*.6);
});
test("dataset uses its own volume and structure plus active-update multiplier", () => {
  const s={type:"dataset",vertical:"Legal",volume:"10k to 1M",structured:"partially",exclusive:"no",licensedBefore:"no",updated:"yes"};
  assert.equal(estimate(s).midpoint,90000*1.2*1.2);
  assert.equal(estimate({...s,updated:"no"}).midpoint,90000*1.2);
  assert.deepEqual(flow(s),["Type","Dataset","Contact","Details","Result"]);
  assert.deepEqual(validationForStep("Details",{...s,companySize:"30-199",years:"3+",provenance:"Owned records."}),[]);
});
test("RL model uses domain, tasks, graders and headless scale", () => {
  assert.equal(estimate({type:"rl",domain:"science/lab",taskCount:"500+",graders:"calibrated graders included",headless:"yes"}).midpoint,675000);
  assert.deepEqual(flow({type:"rl"}),["Type","Environment","Contact","Result"]);
});
test("video estimate increases with hours and applies angle and release multipliers", () => {
  const state={type:"video",angles:"multi-angle",releases:"yes"};
  const values=["under 10","10-100","100-1,000","1,000+"].map(hours=>estimate({...state,hours}).midpoint);
  assert.deepEqual(values,[27000,108000,360000,1080000]);
  assert.ok(values.every((value,i)=>i===0 || value>values[i-1]));
});
test("records video branch can be inserted and removed without a stranded result", () => {
  const state={type:"records",hasVideo:"yes"};
  assert.deepEqual(flow(state),["Type","Systems","Contact","Details","Video","Result"]);
  assert.deepEqual(flow({...state,hasVideo:"no"}),["Type","Systems","Contact","Details","Result"]);
  assert.deepEqual(flow(defaultEstimator()),["Type","Systems","Contact","Details","Result"]);
});
test("contact, email and required data validate before progress", () => {
  assert.deepEqual(validationForStep("Contact",defaultEstimator()),["name","company","email"]);
  assert.deepEqual(validationForStep("Contact",{...defaultEstimator(),name:"  ",company:"  ",email:"qa@example.com"}),["name","company"]);
  assert.equal(validEmail("owner@example.com"),true);
  for (const value of ["","owner","bad@address","x y@example.com"]) assert.equal(validEmail(value),false);
});
test("switching branches starts a fresh submission and clears unrelated history", () => {
  const state={...defaultEstimator(),type:"records",name:"QA",company:"TEST",email:"qa@example.com",systems:["Slack"],systemHistory:{Slack:6},coreSystem:"Slack",submitted:true,draftDelivered:true,submissionId:"old-id",vertical:"Legal",step:4};
  const next=switchEstimatorType(state,"dataset");
  assert.equal(next.name,"QA");
  assert.equal(next.type,"dataset");
  assert.equal(next.step,0);
  assert.equal(next.submitted,false);
  assert.equal(next.draftDelivered,false);
  assert.equal(next.submissionId,"");
  assert.equal(next.vertical,"");
  assert.deepEqual(next.systemHistory,{});
  assert.deepEqual(next.systems,[]);
  assert.ok(!("systemHistory" in JSON.parse(estimatorPayload({...state,type:"dataset"},null,"new-id").message).details));
});
test("first-link attribution lasts 12 calendar months and a later link does not overwrite it", () => {
  const first=claimAttribution(null,referralCode("person@example.com"),new Date("2026-10-14T12:00:00Z"));
  assert.equal(first.expiresAt,"2027-10-14T12:00:00.000Z");
  assert.equal(decodeReferral(first.code),"person@example.com");
  assert.deepEqual(claimAttribution(first,referralCode("other@example.com"),new Date("2026-12-10T12:00:00Z")),first);
  assert.equal(claimAttribution(first,referralCode("other@example.com"),new Date("2027-11-01T12:00:00Z")).email,"other@example.com");
  assert.equal(claimAttribution(null,"not-valid"),null);
  assert.notEqual(referralCode("long-address-one@example.com"),referralCode("long-address-two@example.com"));
});
test("full branch payloads preserve the form contract and omit irrelevant data", () => {
  const state={...defaultEstimator(),name:" Owner ",company:"Example Works",email:"owner@example.com",type:"dataset",volume:"10k to 1M",format:"images",structured:"yes",vertical:"Legal",updated:"yes",provenance:"Owned record."};
  const payload=estimatorPayload(state,null,"id-1");
  assert.equal(payload.form,"Estimator");
  assert.equal(payload.name,"Owner");
  assert.equal(payload.volume,"10k to 1M");
  const details=JSON.parse(payload.message);
  assert.equal(details.details.volume,"");
  assert.deepEqual(details.video,{});
  assert.equal(details.submissionId,"id-1");
  assert.equal(JSON.parse(estimatorPayload({...state,type:"rl"},null,"id-2").message).submitType,"env");
  const draft=estimatorPayload(state,null,"id-1","contact");
  assert.equal(draft.valuationLow,0);
  assert.equal(draft.valuationHigh,0);
  assert.equal(JSON.parse(draft.message).phase,"contact");
  for(const form of ["Buyers","Partners","Refer","Contact","Ledger","Session"]) assert.equal(requestPayload(form,{email:"example@example.com"},null,"id").form,form);
});
test("delivery uses the confirmed JSON contract and requires confirmed persistence", async () => {
  let request;
  const fake=async (url,options) => {request={url,...options}; return new Response(JSON.stringify({success:true}),{status:200});};
  const payload={form:"Estimator",submissionId:"test-id"};
  assert.equal((await deliver("https://example.com/webhook",payload,fake)).demo,false);
  assert.equal(request.headers["Content-Type"],"application/json");
  assert.deepEqual(JSON.parse(request.body),payload);
  assert.equal(request.mode,"cors");
  await assert.rejects(deliver("https://example.com/webhook",payload,async()=>new Response("Forbidden",{status:403})),/confirmed/);
  await assert.rejects(deliver("https://example.com/webhook",payload,async()=>new Response("ok",{status:200})),/did not confirm/);
  await assert.rejects(deliver("https://example.com/webhook",payload,async()=>new Response(JSON.stringify({success:false}),{status:200})),/did not confirm/);
  assert.deepEqual(await deliver("",payload,fake),{demo:true});
});
test("the relay keeps the exact flat contract and deduplicates acknowledged requests", async () => {
  let calls=0, sent;
  const input=estimatorPayload({...defaultEstimator(),type:"video",name:"QA",email:"qa@example.com",company:"TEST",hours:"10-100",angles:"single",releases:"yes"},null,"relay-test-unique");
  const mock=async (url,options)=>{calls++; sent=JSON.parse(options.body); assert.equal(options.headers["Content-Type"],"application/json"); return new Response('{"ok":true}',{status:200});};
  assert.equal((await forwardLead(input,mock)).status,200);
  assert.equal((await forwardLead(input,mock)).status,200);
  assert.equal(calls,1);
  assert.deepEqual(Object.keys(sent),["form","name","company","email","phone","vertical","volume","labeled","exclusive","licensedBefore","valuationLow","valuationHigh","ref","message"]);
  assert.equal((await forwardLead({...input,email:"bad"},mock)).status,400);
  assert.equal((await forwardLead({...input,message:"another request"},async()=>new Response('{"ok":false}'))).status,502);
});
test("status lookup is read-only and returns stages without company, earnings, or documents",async()=>{
  const mock=async url=>{
    assert.equal(url.searchParams.get("action"),"status");
    return new Response(JSON.stringify({ok:true,count:1,leads:[{company:"Private company",amount:500000,document:"private.pdf",status:"Review"}]}));
  };
  const result=await lookupReferralStatus("referrer@example.com",mock);
  assert.deepEqual(result.body,{ok:true,count:1,stages:["Review"]});
  assert.equal((await lookupReferralStatus("bad",mock)).status,400);
});
test("every required route renders one H1, semantic main, complete form labels and JSON-LD", () => {
  for(const route of Object.keys(routeMeta)) {
    const {document}=parseHTML("<html><body>"+routeContent(route)+"</body></html>");
    assert.equal(document.querySelectorAll("h1").length,1,route+" H1 count");
    assert.equal(document.querySelectorAll("main").length,1,route+" main count");
    assert.ok(document.querySelector("h1").textContent.trim(),route+" empty H1");
    for (const link of document.querySelectorAll("a")) if (link.textContent.trim()==="See what your data is worth") assert.equal(link.getAttribute("href"),"/estimator",route+" primary CTA destination");
    for(const field of document.querySelectorAll("input:not([type='checkbox']), select, textarea")) {
      assert.ok(field.getAttribute("aria-label") || (field.id && document.querySelector('label[for="'+field.id+'"]')),route+" field lacks label: "+field.outerHTML);
    }
    assert.doesNotThrow(()=>JSON.parse(JSON.stringify(seoSchema(route))));
    assert.equal(seoSchema(route)["@graph"][0]["@type"],"Organization");
  }
});
test("all route heading levels are sequential and all FAQs are in the requested order", () => {
  for (const route of Object.keys(routeMeta)) {
    const {document}=parseHTML(routeContent(route));
    let previous=0;
    for (const node of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
      const level=Number(node.tagName.slice(1));
      assert.ok(level<=previous+1,route+": heading level skipped before "+node.textContent);
      previous=level;
    }
  }
  assert.equal(faqs.length,20);
  assert.equal(faqs[5][0],"Can customer information be exposed?");
  assert.equal(faqs[19][0],"What are RL tasks?");
});
test("unverified reporting is explicit, take rate is absent at home, protected assets are gated", () => {
  assert.ok(routeContent("/").includes("PLACEHOLDER: source verification pending"));
  assert.ok(!routeContent("/").includes("25 to 40 percent"));
  assert.ok(routeContent("/templates").includes("Partners only"));
  assert.ok(!routeContent("/templates").includes('class="template"'));
  assert.ok(routeContent("/dashboard").includes("Demo data"));
  assert.equal(faqs.length,20);
});
