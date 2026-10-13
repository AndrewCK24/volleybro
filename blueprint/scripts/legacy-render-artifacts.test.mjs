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
      sha256:
        "dddf25a5e872ac39fabdac735f3921683d81a618a2ba6da8ef0a2995e0d2c50d",
      bytes: Buffer.byteLength(css),
      provenance: "authored-presentation",
    },
  ]);
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
});
