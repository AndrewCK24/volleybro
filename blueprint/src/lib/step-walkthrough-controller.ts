export function installStepWalkthroughController(root: ParentNode) {
  for (const walkthrough of root.querySelectorAll<HTMLElement>(
    "[data-step-walkthrough]",
  )) {
    const panels = [
      ...walkthrough.querySelectorAll<HTMLElement>("[data-scenario-panel]"),
    ];
    const flowNodes = [
      ...walkthrough.querySelectorAll<HTMLElement>("[data-flow-node]"),
    ];
    let panel = panels.find((candidate) => !candidate.hidden) ?? panels[0];
    if (!panel) continue;

    const show = (stepIndex: number) => {
      const steps = [...panel.querySelectorAll<HTMLElement>("[data-step]")];
      const index = Math.min(Math.max(stepIndex, 0), steps.length - 1);
      steps.forEach((step, position) => (step.hidden = position !== index));
      for (const dot of panel.querySelectorAll<HTMLElement>(
        "[data-step-target]",
      )) {
        if (Number(dot.dataset.stepTarget) === index)
          dot.setAttribute("aria-current", "step");
        else dot.removeAttribute("aria-current");
      }
      panel.querySelector<HTMLButtonElement>(
        '[data-step-nav="previous"]',
      )!.disabled = index === 0;
      panel.querySelector<HTMLButtonElement>(
        '[data-step-nav="next"]',
      )!.disabled = index === steps.length - 1;
      panel.dataset.currentStep = String(index);
      const status =
        walkthrough.querySelector<HTMLElement>("[data-step-status]");
      const title =
        steps[index].querySelector<HTMLElement>("[data-step-title]");
      if (status && title) status.textContent = title.textContent?.trim() ?? "";
      const activeNode = steps[index].dataset.node;
      for (const flowNode of flowNodes) {
        if (flowNode.dataset.flowNode === activeNode)
          flowNode.dataset.active = "true";
        else delete flowNode.dataset.active;
      }
    };

    walkthrough.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLButtonElement>("button");
      if (!button || !walkthrough.contains(button)) return;

      const { scenario, stepNav, stepTarget } = button.dataset;
      if (scenario) {
        const next = panels.find(
          (candidate) => candidate.dataset.scenarioPanel === scenario,
        );
        if (!next) return;
        panel = next;
        panels.forEach((candidate) => (candidate.hidden = candidate !== panel));
        for (const option of walkthrough.querySelectorAll<HTMLElement>(
          "button[data-scenario]",
        ))
          option.setAttribute("aria-pressed", String(option === button));
        show(0);
        return;
      }
      const current = Number(panel.dataset.currentStep ?? 0);
      if (stepNav) show(current + (stepNav === "next" ? 1 : -1));
      else if (stepTarget !== undefined) show(Number(stepTarget));
    });

    show(0);
  }
}
