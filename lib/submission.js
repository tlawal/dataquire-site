/** JSON contract confirmed by the owner. Never use an opaque no-cors response. */
/**
 * @param {string} url
 * @param {import("../types/contracts.js").WebhookPayload} payload
 * @param {typeof fetch} fetcher
 */
export async function deliver(url, payload, fetcher = fetch) {
  if (!url) return {demo: true};
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetcher(url, {
      method: "POST", mode: "cors", redirect: "follow",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload), signal: controller.signal
    });
    if (!response.ok || response.type === "opaque") throw new Error("Delivery could not be confirmed. Please retry or email hello@dataquire.si.");
    let result;
    try { result = await response.json(); } catch { throw new Error("The receiving service did not confirm this request. Please retry or email hello@dataquire.si."); }
    if (result.success !== true && result.ok !== true && result.status !== "success") {
      throw new Error("The receiving service did not confirm this request. Please retry or email hello@dataquire.si.");
    }
    return {demo: false, receipt: result};
  } catch (error) {
    if (error.name === "AbortError") throw new Error("The receiving service took too long to respond. Your answers are saved. Please retry.");
    if (error instanceof TypeError) throw new Error("Delivery could not be confirmed. Check your connection or email hello@dataquire.si.");
    throw error;
  } finally { clearTimeout(timeout); }
}
