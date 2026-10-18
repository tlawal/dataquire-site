import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {routeAliases} from "../lib/route-aliases.js";
import {createPreviewServer} from "../scripts/preview.mjs";

test("natural URLs redirect before the 404 rule and preserve query strings and process fragments",async()=>{
  const rules=(await fs.readFile("public/_redirects","utf8")).trim().split("\n");
  const fallback=rules.indexOf("/* /404.html 404");
  const server=createPreviewServer((_req,_res,next)=>next());
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const origin="http://127.0.0.1:"+server.address().port;
  try {
    for(const [source,target] of Object.entries(routeAliases)) {
      for(const path of [source,source+"/"]) {
        const index=rules.indexOf(path+" "+target+" 301");
        assert.ok(index>=0 && index<fallback,path+" must precede the branded 404");
        const response=await fetch(origin+path,{redirect:"manual"});
        assert.equal(response.status,301);
        assert.equal(response.headers.get("location"),target);
      }
    }
    const response=await fetch(origin+"/process?campaign=owner",{redirect:"manual"});
    assert.equal(response.headers.get("location"),"/?campaign=owner#how-it-works");
  } finally {
    await new Promise(resolve=>server.close(resolve));
  }
});
