export function installVariantGalleryController(root: ParentNode) {
  for (const gallery of root.querySelectorAll<HTMLElement>(
    "[data-variant-gallery]",
  )) {
    const buttons = [
      ...gallery.querySelectorAll<HTMLButtonElement>(
        "button[data-choice][data-value]",
      ),
    ];
    const frames = [
      ...gallery.querySelectorAll<HTMLElement>("[data-variant-frame]"),
    ];
    const selected = new Map<string, string>();

    for (const button of buttons) {
      if (button.getAttribute("aria-pressed") === "true") {
        selected.set(button.dataset.choice!, button.dataset.value!);
      }
    }

    const updateFrames = () => {
      for (const frame of frames) {
        let selections: Record<string, string>;
        try {
          selections = JSON.parse(frame.dataset.variantFrame ?? "") as Record<
            string,
            string
          >;
        } catch {
          frame.hidden = true;
          continue;
        }
        const visible = ![...selected].some(
          ([id, selectedValue]) => selections[id] !== selectedValue,
        );
        frame.hidden = !visible;

        for (const element of frame.querySelectorAll<HTMLElement | SVGElement>(
          "[id], [data-variant-source-id]",
        )) {
          if (visible && element.dataset.variantSourceId) {
            element.id = element.dataset.variantSourceId;
            delete element.dataset.variantSourceId;
          } else if (!visible && element.id) {
            element.dataset.variantSourceId = element.id;
            element.removeAttribute("id");
          }
        }
      }
    };

    updateFrames();

    gallery.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLButtonElement>(
        "button[data-choice][data-value]",
      );
      if (!button || !gallery.contains(button)) return;

      const { choice, value } = button.dataset;
      if (!choice || !value) return;
      selected.set(choice, value);

      for (const option of buttons) {
        if (option.dataset.choice === choice) {
          const pressed = option === button;
          option.setAttribute("aria-pressed", String(pressed));
          for (const label of option.querySelectorAll<HTMLElement>(
            "[data-variant-label]",
          )) {
            label.textContent =
              pressed && label.dataset.selectedLabel
                ? label.dataset.selectedLabel
                : (label.dataset.label ?? "");
          }
        }
      }

      updateFrames();
    });
  }
}
