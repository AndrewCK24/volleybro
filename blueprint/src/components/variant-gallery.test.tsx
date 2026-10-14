import { fireEvent, render, screen, within } from "@testing-library/react";

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
        { value: "25", label: "25% ✓ selected" },
      ],
    },
  ],
  defaultValues: { weight: "700", size: "25" },
  frames: combinations.map((selections) => ({
    selections,
    blocks: [text(`${selections.weight} / ${selections.size}`)],
  })),
};

function GalleryHarness() {
  return (
    <section data-variant-gallery aria-label="Logo variants">
      <fieldset>
        <legend>Weight</legend>
        <button
          type="button"
          data-choice="weight"
          data-value="300"
          aria-pressed="false"
        >
          300
        </button>
        <button
          type="button"
          data-choice="weight"
          data-value="700"
          aria-pressed="true"
        >
          700 ✓ pinned
        </button>
      </fieldset>
      <fieldset>
        <legend>iOS size</legend>
        <button
          type="button"
          data-choice="size"
          data-value="15"
          aria-pressed="false"
        >
          15%
        </button>
        <button
          type="button"
          data-choice="size"
          data-value="25"
          aria-pressed="true"
        >
          25% ✓ selected
        </button>
      </fieldset>
      {combinations.map((selections) => (
        <div
          key={`${selections.weight}-${selections.size}`}
          data-variant-frame={JSON.stringify(selections)}
          hidden={selections.weight !== "700" || selections.size !== "25"}
        >
          <h2 id="section-anchor">
            {selections.weight} / {selections.size}
          </h2>
        </div>
      ))}
    </section>
  );
}

describe("variant_gallery v1 registry contract", () => {
  it("accepts a complete Cartesian set of Portable Text frames", () => {
    expect(blockSchema.safeParse(gallery).success).toBe(true);
  });

  it.each([
    [
      "an unknown default choice",
      {
        ...gallery,
        defaultValues: { weight: "700", size: "25", platform: "ios" },
      },
    ],
    [
      "an unknown option value",
      { ...gallery, defaultValues: { weight: "1000", size: "25" } },
    ],
    [
      "an incomplete frame matrix",
      { ...gallery, frames: gallery.frames.slice(1) },
    ],
    [
      "a duplicate frame",
      { ...gallery, frames: [...gallery.frames, gallery.frames[0]] },
    ],
    [
      "an unknown frame choice",
      {
        ...gallery,
        frames: [
          {
            ...gallery.frames[0],
            selections: { weight: "300", size: "15", platform: "ios" },
          },
          ...gallery.frames.slice(1),
        ],
      },
    ],
    [
      "raw markup",
      {
        ...gallery,
        frames: [
          {
            ...gallery.frames[0],
            blocks: [{ _type: "html", html: "<script>run()</script>" }],
          },
          ...gallery.frames.slice(1),
        ],
      },
    ],
    [
      "nested galleries",
      {
        ...gallery,
        frames: [
          { ...gallery.frames[0], blocks: [{ ...gallery, frames: [] }] },
          ...gallery.frames.slice(1),
        ],
      },
    ],
  ])("rejects %s", (_name, candidate) => {
    expect(blockSchema.safeParse(candidate).success).toBe(false);
  });
});

describe("variant gallery controller", () => {
  it("switches the visible pre-rendered frame and pressed state for native button selections", () => {
    const { container } = render(<GalleryHarness />);
    installVariantGalleryController(container);
    const weight = within(screen.getByRole("group", { name: "Weight" }));
    const size = within(screen.getByRole("group", { name: "iOS size" }));

    const expectActiveFrame = (active: string) => {
      for (const selections of combinations) {
        const headingName = `${selections.weight} / ${selections.size}`;
        const heading = screen.getByRole("heading", {
          level: 2,
          name: headingName,
          hidden: true,
        });
        if (headingName === active) {
          expect(heading).toHaveAttribute("id", "section-anchor");
          expect(heading).toBeVisible();
        } else {
          expect(heading).not.toHaveAttribute("id");
          expect(heading).not.toBeVisible();
        }
      }
    };

    expectActiveFrame("700 / 25");
    expect(
      size.getByRole("button", { name: "25% ✓ selected" }),
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(weight.getByRole("button", { name: "300" }));
    expectActiveFrame("300 / 25");
    expect(weight.getByRole("button", { name: "300" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      weight.getByRole("button", { name: "700 ✓ pinned" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      size.getByRole("button", { name: "25% ✓ selected" }),
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(size.getByRole("button", { name: "15%" }));
    expectActiveFrame("300 / 15");
    expect(
      size.getByRole("button", { name: "25% ✓ selected" }),
    ).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(weight.getByRole("button", { name: "700 ✓ pinned" }));
    expectActiveFrame("700 / 15");
    fireEvent.click(size.getByRole("button", { name: "25% ✓ selected" }));
    expectActiveFrame("700 / 25");
    expect(
      size.getByRole("button", { name: "25% ✓ selected" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
