import assert from "node:assert/strict";
import test from "node:test";
import { removeLegacyPresentationArtifacts } from "./legacy-render-artifacts.mjs";

test("retains verified SVG styles for canonical paint conversion", () => {
  const css = ".node { fill: white; }";
  const html = `<svg><style>${css}</style><text>Decision</text></svg><pre><code>${css}</code></pre>`;
  const result = removeLegacyPresentationArtifacts(html, "example", css);

  assert.ok(result.html.includes(`<style>${css}</style>`));
  assert.match(result.html, /<text>Decision<\/text>/u);
  assert.ok(result.html.includes(`<code>${css}</code>`));
  assert.deepEqual(result.removed, []);
  assert.deepEqual(result.canonicalPresentationMappings, [
    {
      sha256:
        "dddf25a5e872ac39fabdac735f3921683d81a618a2ba6da8ef0a2995e0d2c50d",
      bytes: Buffer.byteLength(css),
      provenance: "authored-presentation",
      target: "canonical-diagram-paint",
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

test("removes and audits only the legacy code-copy control", () => {
  const html =
    '<figure><div><button aria-live="polite"><svg class="lucide-clipboard"></svg><span class="sr-only">Copy Text</span></button></div><pre><code>const x = 1;</code></pre></figure>';
  const result = removeLegacyPresentationArtifacts(html, "example", "");
  assert.ok(result.html.includes("<code>const x = 1;</code>"));
  assert.equal(result.html.includes("Copy Text"), false);
  assert.deepEqual(
    result.removed.map(({ kind, provenance }) => ({ kind, provenance })),
    [{ kind: "button", provenance: "renderer-code-copy-control" }],
  );
  const standalone = removeLegacyPresentationArtifacts(
    '<button aria-live="polite"><svg class="lucide-clipboard"></svg><span class="sr-only">Copy Text</span></button>',
    "example",
    "",
  );
  assert.equal(standalone.html.includes("<button"), true);
  assert.deepEqual(standalone.removed, []);
});

test("fails closed on unrecognized script and style artifacts", () => {
  assert.throws(
    () =>
      removeLegacyPresentationArtifacts(
        "<script>reader interaction</script>",
        "example",
        "",
      ),
    /no verified renderer provenance/u,
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
