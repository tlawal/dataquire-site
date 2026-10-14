// An illustrative presentation component. No business or client data is used.
export function deidentificationRecord(id) {
  return `<div class="redaction-exhibit" data-redaction>
    <span class="exhibit-label">Illustrative record. No client data.</span>
    <div class="exhibit-controls"><p class="sample-type">Dispatch exception</p><div class="toggle" role="group" aria-label="Record de-identification">
      <button type="button" class="active" data-action="redaction-raw" aria-pressed="true" aria-controls="${id}">Original</button>
      <button type="button" data-action="redaction-on" aria-pressed="false" aria-controls="${id}">De-identify</button>
    </div></div>
    <div class="ticket" id="${id}"><div class="ticket-head">Sample operating record</div>
      <dl class="sample-identifiers">
        <div><dt>Reported by</dt><dd><span class="pii">Jordan Lee</span><span class="token">dispatcher 104</span></dd></div>
        <div><dt>Customer contact</dt><dd><span class="pii">orders@example.com</span><span class="token">customer contact 219</span></dd></div>
        <div><dt>Delivery address</dt><dd><span class="pii">14 Harbor Lane</span><span class="token">service location 032</span></dd></div>
      </dl>
      <p class="sample-decision"><strong>The working record</strong> The first route was rejected because the pallet count was incorrect. Dispatch checked the load sheet, corrected the count, and verified that the revised route met capacity and timing requirements.</p>
    </div>
    <p class="redaction-status" role="status" data-redaction-status>Original: illustrative identifiers are visible.</p>
  </div>`;
}
