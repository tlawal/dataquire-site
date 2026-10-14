/**
 * Public integration configuration. No credentials belong in this file.
 * Apps Script receives a flat JSON request with application/json.
 * It must return JSON {ok: true}, {success: true}, or {status: "success"}
 * after persisting a request. Browser access also needs working CORS.
 */
export const CONFIG = Object.freeze({
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbxuzVpTCd04aEIW2jkZM6XJ7OnlwwmQag74-KguseT8gWq-zPEelGp33nOl_r-cnDfOdw/exec",
  SUBMISSION_URL: "/api/lead",
  GTM_CONTAINER_ID: "",
  AUTH_REQUEST_URL: "",
  PARTNER_ASSETS_URL: "",
  REFERRAL_STATUS_URL: "/api/referral-status",
  TELEGRAM_INVITE_URL: "",
  CANONICAL_ORIGIN: "https://dataquire.si"
});
