import {lookupReferralStatus} from "../../lib/webhook-proxy.js";
export async function handler(event) {
  if (event.httpMethod!=="POST") return {statusCode:405,body:""};
  try {
    const input=JSON.parse(event.body);
    const result=await lookupReferralStatus(input.email);
    return {statusCode:result.status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"},body:JSON.stringify(result.body)};
  } catch {return {statusCode:400,body:JSON.stringify({ok:false,error:"Invalid request."})};}
}
