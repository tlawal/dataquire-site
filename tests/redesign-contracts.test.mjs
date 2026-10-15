import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import {parseHTML} from "linkedom";
import {routeContent, routeMeta, defaultEstimator, validationForStep} from "../app.js";
import {estimate, flow, estimatorPayload, referralCode, claimAttribution} from "../lib/model.js";

const baseline=JSON.parse(await fs.readFile(new URL("./fixtures/redesign-baseline.json",import.meta.url),"utf8"));

function stablePayload(payload) {
  const details=JSON.parse(payload.message);
  delete details.submittedAt;
  return {...payload,message:details};
}

function fieldContract(field) {
  return {
    id:field.id,name:field.getAttribute("name"),tag:field.tagName.toLowerCase(),
    type:field.getAttribute("type")||"",required:field.hasAttribute("required"),
    ...(field.tagName==="SELECT" ? {options:[...field.querySelectorAll("option")].map(option=>option.getAttribute("value")??option.textContent)} : {}),
    ...(field.type==="checkbox" ? {value:field.getAttribute("value")} : {})
  };
}

function sortedFields(fields) {
  return fields.toSorted((a,b)=>(a.name+":"+(a.value||"")).localeCompare(b.name+":"+(b.value||"")));
}

test("redesign leaves the frozen valuation, delivery, relay, configuration and server modules byte-for-byte unchanged",async()=>{
  for(const [file,expected] of Object.entries(baseline.frozenSha256)) {
    const bytes=await fs.readFile(new URL("../"+file,import.meta.url));
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),expected,file+" changed after the baseline was frozen");
  }
});

test("all established routes and each submitted form field retain their integration contract",()=>{
  for(const route of baseline.routes) assert.ok(Object.hasOwn(routeMeta,route),"Required route lost: "+route);
  for(const expected of baseline.forms) {
    const {document}=parseHTML(routeContent(expected.route));
    const form=document.querySelector('form[data-form="'+expected.form+'"]');
    assert.ok(form,expected.route+" lost form "+expected.form);
    const actual=[...form.querySelectorAll("input[name],textarea[name],select[name]")].map(fieldContract);
    assert.deepEqual(sortedFields(actual),sortedFields(expected.fields),expected.route+" form fields changed");
    assert.ok(form.querySelector("[role='alert']"),expected.form+" needs accessible validation feedback");
    assert.equal(form.querySelectorAll('input[type="file"]').length,0,expected.form+" must never accept raw file uploads");
  }
});

test("redesign retains estimator state names and required answers on every branch",()=>{
  assert.deepEqual(Object.keys(defaultEstimator()).sort(),Object.keys(baseline.defaultEstimator).sort());
  for(const item of baseline.validation) {
    assert.deepEqual(validationForStep(item.step,{...defaultEstimator(),type:item.type}),item.missing,item.type+" "+item.step);
  }
});

test("representative records, dataset, RL and video fixtures retain identical valuation and complete payloads",()=>{
  for(const fixture of baseline.fixtures) {
    assert.deepEqual(estimate(fixture.state),fixture.estimate,fixture.name+" estimate");
    assert.deepEqual(flow(fixture.state),fixture.flow,fixture.name+" flow");
    const id=fixture.payload.message.submissionId;
    assert.deepEqual(stablePayload(estimatorPayload(fixture.state,baseline.attribution,id)),fixture.payload,fixture.name+" valuation payload");
    assert.deepEqual(stablePayload(estimatorPayload(fixture.state,baseline.attribution,id,"contact")),fixture.contactPayload,fixture.name+" contact draft payload");
  }
});

test("first-link attribution survives a new design with the same twelve-calendar-month boundary",()=>{
  const first=claimAttribution(null,referralCode("introducer@example.com"),new Date("2026-10-14T12:00:00Z"));
  assert.deepEqual(first,baseline.attribution);
  assert.deepEqual(claimAttribution(first,referralCode("later@example.com"),new Date("2027-10-14T11:59:59Z")),first);
  const next=claimAttribution(first,referralCode("later@example.com"),new Date("2027-10-14T12:00:00Z"));
  assert.equal(next.email,"later@example.com");
  assert.equal(next.expiresAt,"2028-10-14T12:00:00.000Z");
});

// Only the requested label change is allowed; the original legal substance stays frozen.
test("privacy and terms retain their complete original legal substance",async()=>{
  const source=await fs.readFile(new URL("../app.js",import.meta.url),"utf8");
  const start=source.indexOf("function legalPage(");
  const end=source.indexOf("\nfunction onePager(",start);
  const legalSource=source.slice(start,end);
  const approvedWording='["Estimates", "Estimates are not offers, promises, historical performance, or a commitment to take a package to market."]';
  assert.ok(legalSource.includes(approvedWording));
  const originalWording=legalSource.replace(approvedWording,approvedWording.replace('"Estimates are','"Indicative estimates are'));
  assert.equal(crypto.createHash("sha256").update(originalWording).digest("hex"),baseline.legalPageSha256);
});
