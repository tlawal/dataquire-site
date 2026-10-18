export const operationalRecords = [
  "Signed contracts", "Month-end closes", "Internal SOPs", "Code reviews",
  "Support tickets", "Sales call notes", "Dispatch logs", "Change orders"
];

export const workingTraceSteps = [
  {label:"Task", detail:"A delivery appointment changes. Dispatch needs a route that meets the new window."},
  {label:"Correction", detail:"An incorrect pallet count invalidates the first route. Dispatch checks and corrects the load sheet."},
  {label:"Outcome", detail:"The revised route meets capacity and timing requirements. The result can be checked."}
];

export const workingTraceOverview = "The task, the correction, and a verified outcome belong to the same working record.";

// Run only while the card is visible. Keep the dots on one clock so each cycle
// clears together, including after a pause or client-side navigation.
export function setupWorkingTrace(root, reduced) {
  const card = root.querySelector("[data-private-record]");
  if (!card) return () => {};
  const trace = card.querySelector("[data-working-trace]");
  const nodes = [...trace.querySelectorAll("[data-trace-step]")];
  const caption = trace.querySelector("[data-trace-caption]");
  const show = stage => {
    trace.dataset.traceStage = String(stage);
    nodes.forEach((node,index) => {
      node.classList.toggle("is-complete", stage < 3 && index <= stage);
      node.classList.toggle("is-connected", stage < 3 && index < stage);
    });
    if (caption) caption.textContent = workingTraceSteps[stage]?.detail || workingTraceOverview;
  };
  const showStatic = () => {
    card.classList.remove("is-live", "is-running");
    show(2);
    if (caption) caption.textContent = workingTraceOverview;
  };
  showStatic();
  if (reduced) return () => {};

  let stage = 0;
  let timer;
  show(stage);
  card.classList.add("is-live");
  const doc = card.ownerDocument;
  let visible = false;
  const stop = () => {
    window.clearInterval(timer);
    timer = undefined;
  };
  const update = () => {
    const running = visible && !doc.hidden;
    card.classList.toggle("is-running", running);
    if (!running) stop();
    else if (timer === undefined) timer = window.setInterval(() => {
      stage = (stage + 1) % 4;
      show(stage);
    },5000);
  };
  const observer = new window.IntersectionObserver(entries => {
    visible = entries.some(entry => entry.target === card && entry.isIntersecting);
    update();
  }, {threshold:0});
  observer.observe(card);
  doc.addEventListener("visibilitychange", update);
  return () => {
    stop();
    observer.disconnect();
    doc.removeEventListener("visibilitychange", update);
    showStatic();
  };
}
