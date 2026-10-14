import { fireEvent } from "@testing-library/react";

import { blockSchema } from "../lib/emdash-change-record";
import { installVariantGalleryController } from "../lib/variant-gallery-controller";

const text = (value: string) => ({
  _type: "block",
  style: "normal",
  children: [{ _type: "span", text: value }],
});

const combinations = [
  { weight: "300", size: "15" },
  { weight: "300", size: "25" },
  { weight: "700", size: "15" },
  { weight: "700", size: "25" },
];

const gallery = {
  _type: "variant_gallery",
  version: 1,
  title: "Logo variants",
  choices: [
    {
      id: "weight",
      label: "Weight",
      options: [
        { value: "300", label: "300" },
        { value: "700", label: "700 ✓ pinned" },
      ],
    },
    {
      id: "size",
      label: "iOS size",
      options: [
        { value: "15", label: "15%" },
        { value: "25", label: "25%", selectedLabel: "25% ✓ selected" },
      ],
    },
  ],
  defaultValues: { weight: "700", size: "25" },
  frames: combinations.map((selections) => ({
    selections,
    blocks: [text(`${selections.weight} / ${selections.size}`)],
  })),
};

describe("variant_gallery v1 registry contract", () => {
  it("accepts a complete Cartesian set of Portable Text frames", () => {
    expect(blockSchema.safeParse(gallery).success).toBe(true);
  });

  it.each([
    ["an unknown default choice", { ...gallery, defaultValues: { weight: "700", size: "25", platform: "ios" } }],
    ["an unknown option value", { ...gallery, defaultValues: { weight: "1000", size: "25" } }],
    ["an incomplete frame matrix", { ...gallery, frames: gallery.frames.slice(1) }],
    ["a duplicate frame", { ...gallery, frames: [...gallery.frames, gallery.frames[0]] }],
    ["an unknown frame choice", { ...gallery, frames: [{ ...gallery.frames[0], selections: { weight: "300", size: "15", platform: "ios" } }, ...gallery.frames.slice(1)] }],
    ["raw markup", { ...gallery, frames: [{ ...gallery.frames[0], blocks: [{ _type: "html", html: "<script>run()</script>" }] }, ...gallery.frames.slice(1)] }],
    ["nested galleries", { ...gallery, frames: [{ ...gallery.frames[0], blocks: [{ ...gallery, frames: [] }] }, ...gallery.frames.slice(1)] }],
  ])("rejects %s", (_name, candidate) => {
    expect(blockSchema.safeParse(candidate).success).toBe(false);
  });
});

describe("variant gallery controller", () => {
  it("switches the visible pre-rendered frame and pressed state for native button selections", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <section data-variant-gallery>
        <button type="button" data-choice="weight" data-value="300" aria-pressed="false"><span data-variant-label data-label="300">300</span></button>
        <button type="button" data-choice="weight" data-value="700" aria-pressed="true"><span data-variant-label data-label="700 ✓ pinned">700 ✓ pinned</span></button>
        <button type="button" data-choice="size" data-value="15" aria-pressed="false"><span data-variant-label data-label="15%">15%</span></button>
        <button type="button" data-choice="size" data-value="25" aria-pressed="true"><span data-variant-label data-label="25%" data-selected-label="25% ✓ selected">25% ✓ selected</span></button>
        <div data-variant-frame='{"weight":"300","size":"15"}' hidden></div>
        <div data-variant-frame='{"weight":"300","size":"25"}' hidden></div>
        <div data-variant-frame='{"weight":"700","size":"15"}' hidden></div>
        <div data-variant-frame='{"weight":"700","size":"25"}'></div>
      </section>`;
    document.body.append(root);
    installVariantGalleryController(root);

    fireEvent.click(root.querySelector('button[data-choice="weight"][data-value="300"]')!);

    expect(root.querySelector('button[data-choice="weight"][data-value="300"]')).toHaveAttribute("aria-pressed", "true");
    expect(root.querySelector('button[data-choice="weight"][data-value="700"]')).toHaveAttribute("aria-pressed", "false");
    expect(root.querySelector('[data-choice="weight"][data-value="700"] [data-variant-label]')).toHaveTextContent("700 ✓ pinned");
    expect(root.querySelector('[data-choice="size"][data-value="25"] [data-variant-label]')).toHaveTextContent("25%");
    expect(root.querySelector('[data-variant-frame*="300"][data-variant-frame*="25"]')).not.toHaveAttribute("hidden");
    expect(root.querySelector('[data-variant-frame*="700"][data-variant-frame*="25"]')).toHaveAttribute("hidden");
  });
});
