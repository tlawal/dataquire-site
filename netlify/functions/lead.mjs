import {forwardLead} from "../../lib/webhook-proxy.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") return {statusCode:405,headers:{Allow:"POST"},body:""};
  if (!event.body || event.body.length>65536) return {statusCode:413,body:""};
  try {
    const input=event.isBase64Encoded ? JSON.parse(Buffer.from(event.body,"base64").toString("utf8")) : JSON.parse(event.body);
    const result=await forwardLead(input);
    return {statusCode:result.status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"},body:JSON.stringify(result.body)};
  } catch {
    return {statusCode:400,body:JSON.stringify({ok:false,error:"Invalid request."})};
  }
}
