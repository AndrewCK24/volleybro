import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLogoVSplashGallery,
  replaceLogoVSplashPlaceholder,
} from "./logo-v-splash-gallery.mjs";

const weights = [300, 400, 500, 600, 700, 800, 900]
  .map(
    (weight) =>
      `${weight}: { aspect: 1.03, symViewBox: "-7 -27 564 564", symL: "M0 0L5 10", symR: "M5 10L10 0", typeL: "M0 0L5 10", typeR: "M5 10L10 0", lettersShift: 1, typeW: 10 }`,
  )
  .join(",");

const design = `
const OLD_SYM_VIEWBOX = "-10 225 360 360";
const OLD_SYM_LEFT = "M20 240L180 560L340 240";
const OLD_SYM_RIGHT = "M40 240L180 560L320 240";
const CORAL = "#FC7A56";
const IVORY = "#F6F4F5";
const TEAL = "#10687E";
const WEIGHTS = { ${weights} };
const LETTERS = ["M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10", "M0 0L5 10"];
const GROUNDS = [{ label: "Light", variant: "adaptive" }, { label: "Dark", variant: "adaptive" }, { label: "Teal", variant: "brand" }];
`;

function descendants(elements) {
  return elements.flatMap((element) => [
    element,
    ...(element.children ? descendants(element.children) : []),
  ]);
}

function transformedPoint(group, x, y) {
  const [translate, scale] = group.transform;
  return [translate.x + scale.x * x, translate.y + scale.y * y].map((value) =>
    Number(value.toFixed(6)),
  );
}

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
  assert.deepEqual(
    gallery.choices[0].options.map(({ label }) => label),
    ["300", "400", "500", "600", "700 ✓ pinned", "800", "900"],
  );
  assert.deepEqual(
    gallery.choices[1].options.map(({ label }) => label),
    ["15%", "20%", "25% ✓ selected", "30%"],
  );
  for (const choice of gallery.choices)
    assert.ok(choice.options.every((option) => !("selectedLabel" in option)));
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
    assert.equal(diagrams.length, 4);
    assert.ok(diagrams.every((block) => block._version === 1));
    for (const block of diagrams)
      assert.ok(!JSON.stringify(block).includes("undefined"));
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
      "iOS — apple-splash route",
      "Android — manifest splash (fixed by Chrome)",
    ])
      assert.ok(words.includes(phrase), `Missing ${phrase}`);
  }

  const frame = gallery.frames.find(
    ({ selections }) =>
      selections.weight === "700" && selections["splash-size"] === "25",
  );
  const geometryStart = frame.blocks.findIndex(
    (block) => block.id === "geometry-facts",
  );
  const facts = frame.blocks
    .slice(geometryStart + 1)
    .filter((block) => block._type === "block")
    .map((block) => block.children.map((child) => child.text).join(""));
  assert.deepEqual(
    facts.map((fact) =>
      [
        "Glyph",
        "Symbol viewBox",
        "Type viewBox",
        "Right arm",
        "Neutral parts",
        "Splash field",
        "Splash mark size",
      ].find((label) => fact.startsWith(label)),
    ),
    [
      "Glyph",
      "Symbol viewBox",
      "Type viewBox",
      "Right arm",
      "Neutral parts",
      "Splash field",
      "Splash mark size",
    ],
  );
  const diagrams = frame.blocks.filter((block) => block._type === "diagram");
  const oldVsNew = descendants(diagrams[0].elements).filter(
    (element) => element.type === "group" && element.transform,
  );
  assert.equal(oldVsNew.length, 2);
  assert.deepEqual(transformedPoint(oldVsNew[0], -10, 225), [12, 10]);
  assert.deepEqual(transformedPoint(oldVsNew[0], 350, 585), [152, 150]);
  assert.deepEqual(transformedPoint(oldVsNew[1], -7, -27), [177, 10]);
  assert.deepEqual(transformedPoint(oldVsNew[1], 557, 537), [317, 150]);
  const splashGroups = descendants(diagrams[3].elements).filter(
    (element) => element.type === "group" && element.transform,
  );
  assert.ok(
    splashGroups.every((group) => {
      const scale = group.transform.find(({ type }) => type === "scale");
      return !scale || scale.x === scale.y;
    }),
  );

  const imported = replaceLogoVSplashPlaceholder(
    [{ children: [{ text: "載入設計稿…" }] }],
    gallery,
  );
  assert.deepEqual(imported, [gallery]);
});
