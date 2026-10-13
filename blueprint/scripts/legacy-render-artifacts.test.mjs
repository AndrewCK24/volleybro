import assert from "node:assert/strict";
import test from "node:test";
import { removeLegacyPresentationArtifacts } from "./legacy-render-artifacts.mjs";

test("omits source-backed SVG styling while preserving diagram and code content", () => {
  const css = ".node { fill: white; }";
  const html = `<svg><style>${css}</style><text>Decision</text></svg><pre><code>${css}</code></pre>`;
  const result = removeLegacyPresentationArtifacts(html, "example", css);

  assert.equal(result.html.includes("<style>"), false);
  assert.match(result.html, /<text>Decision<\/text>/u);
  assert.ok(result.html.includes(`<code>${css}</code>`));
  assert.deepEqual(result.removed, [
    {
      kind: "style",
      sha256:
        "dddf25a5e872ac39fabdac735f3921683d81a618a2ba6da8ef0a2995e0d2c50d",
      bytes: Buffer.byteLength(css),
      provenance: "authored-presentation",
    },
  ]);
});

test("removes only recognized Astro boundary and empty inline separator comments", () => {
  const html =
    "<astro-island><span><span>Visible text<!-- --></span></span><!--astro:end--></astro-island>";
  const result = removeLegacyPresentationArtifacts(html, "example", "");

  assert.ok(result.html.includes("Visible text"));
  assert.equal(result.html.includes("<!--"), false);
  assert.deepEqual(
    result.removed.map(({ kind, bytes, provenance }) => ({
      kind,
      bytes,
      provenance,
    })),
    [
      {
        kind: "comment",
        bytes: 1,
        provenance: "renderer-inline-separator",
      },
      {
        kind: "comment",
        bytes: 9,
        provenance: "renderer-island-boundary",
      },
    ],
  );
});

test("fails closed on unrecognized script and style artifacts", () => {
  assert.throws(
    () =>
      removeLegacyPresentationArtifacts(
        "<script>reader interaction</script>",
        "example",
        "",
      ),
    /not a recognized renderer bootstrap/u,
  );
  assert.throws(
    () =>
      removeLegacyPresentationArtifacts("<style>.x{}</style>", "example", ""),
    /no verified presentation-only source provenance/u,
  );
  assert.throws(
    () =>
      removeLegacyPresentationArtifacts(
        "<!-- editorial note -->",
        "example",
        "",
      ),
    /comment has no verified renderer provenance/u,
  );
});
