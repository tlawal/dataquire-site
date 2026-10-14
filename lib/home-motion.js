export const workingTraceSteps = [
  {label:"Task", detail:"A delivery appointment changes. Dispatch needs a route that meets the new window."},
  {label:"Correction", detail:"An incorrect pallet count invalidates the first route. Dispatch checks and corrects the load sheet."},
  {label:"Outcome", detail:"The revised route meets capacity and timing requirements. The result can be checked."}
];

export function traceStepForViewport(top, viewportHeight) {
  const progress = (viewportHeight * 0.88 - top) / (viewportHeight * 0.60);
  return Math.max(0, Math.min(2, Math.floor(progress * 3)));
}

// One passive scroll listener, one animation frame per update, and a cleanup
// function for the site's existing client-side navigation and motion controls.
export function setupWorkingTrace(root, reduced) {
  const trace = root.querySelector("[data-working-trace]");
  if (!trace) return () => {};
  const nodes = [...trace.querySelectorAll("[data-trace-step]")];
  const caption = trace.querySelector("[data-trace-caption]");
  let frame = 0;
  let previous = -1;
  const show = stage => {
    if (stage === previous) return;
    previous = stage;
    trace.dataset.traceStage = String(stage);
    nodes.forEach((node, index) => {
      node.classList.toggle("is-complete", index < stage || reduced);
      node.classList.toggle("is-current", index === stage && !reduced);
      if (index === stage && !reduced) node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
    });
    if (caption) caption.textContent = reduced
      ? "The task, the correction, and a verified outcome belong to the same working record."
      : workingTraceSteps[stage].detail;
  };
  if (reduced) {
    show(2);
    return () => {};
  }
  trace.classList.add("trace-enhanced");
  const update = () => {
    frame = 0;
    show(traceStepForViewport(trace.getBoundingClientRect().top, window.innerHeight));
  };
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  update();
  window.addEventListener("scroll", schedule, {passive:true});
  window.addEventListener("resize", schedule, {passive:true});
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame) window.cancelAnimationFrame(frame);
    trace.classList.remove("trace-enhanced");
  };
}
