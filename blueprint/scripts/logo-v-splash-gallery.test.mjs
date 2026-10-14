import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLogoVSplashGallery,
  replaceLogoVSplashPlaceholder,
} from "./logo-v-splash-gallery.mjs";

const weights = [300, 400, 500, 600, 700, 800, 900]
  .map(
    (weight) =>
      `${weight}: { aspect: 1.03, symViewBox: "0 0 10 10", symL: "M0 0L5 10", symR: "M5 10L10 0", typeL: "M0 0L5 10", typeR: "M5 10L10 0", lettersShift: 1, typeW: 10 }`,
  )
  .join(",");

const design = `
const CORAL = "#FC7A56";
const IVORY = "#F6F4F5";
const TEAL = "#10687E";
const WEIGHTS = { ${weights} };
const OLD_SYM_LEFT = "M0 0L5 10";
const OLD_SYM_RIGHT = "M5 10L10 0";
const LETTERS = ["M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10"];
const GROUNDS = [{ label: "Light", variant: "adaptive" }, { label: "Dark", variant: "adaptive" }, { label: "Teal", variant: "brand" }];
`;

test("converts the complete selector matrix into portable text and Diagram v1", () => {
  const gallery = buildLogoVSplashGallery(design);

  assert.equal(gallery._type, "variant_gallery");
  assert.equal(gallery.version, 1);
  assert.deepEqual(gallery.defaultValues, {
    weight: "700",
    "splash-size": "25",
  });
  assert.deepEqual(
    gallery.choices.map(({ id, options }) => [id, options.length]),
    [
      ["weight", 7],
      ["splash-size", 4],
    ],
  );
  assert.equal(
    gallery.choices[0].options.find(({ value }) => value === "700")
      .selectedLabel,
    "700 ✓ pinned",
  );
  assert.equal(
    gallery.choices[1].options.find(({ value }) => value === "25")
      .selectedLabel,
    "25% ✓ selected",
  );
  assert.equal(gallery.frames.length, 28);

  for (const frame of gallery.frames) {
    const ids = frame.blocks
      .filter((block) => block.id)
      .map((block) => block.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.deepEqual(ids, [
      "weight-explorer",
      "old-vs-new",
      "symbol-variants",
      "type-variants",
      "splash-mockups",
      "geometry-facts",
    ]);
    const diagrams = frame.blocks.filter((block) => block._type === "diagram");
    assert.equal(diagrams.length, 8);
    assert.ok(diagrams.every((block) => block._version === 1));
    const words = frame.blocks
      .filter((block) => block._type === "block")
      .flatMap((block) => block.children.map((child) => child.text))
      .join(" ");
    for (const phrase of [
      "Weight explorer",
      "Old vs New",
      "Logo-symbol variants",
      "Logo-type variants",
      "Splash mockups",
      "Geometry facts",
      "iOS",
      "Android",
      "currentColor",
      "#FC7A56",
      "#F6F4F5",
      "#10687E",
    ])
      assert.ok(words.includes(phrase), `Missing ${phrase}`);
  }

  const imported = replaceLogoVSplashPlaceholder(
    [{ children: [{ text: "載入設計稿…" }] }],
    gallery,
  );
  assert.deepEqual(imported, [gallery]);
});
