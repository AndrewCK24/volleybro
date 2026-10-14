import assert from "node:assert/strict";
import test from "node:test";
import {
  convertMarkdownToPortableText,
  extractMdxStructuredData,
  convertRenderedHtmlToPortableText,
} from "./portable-text-converter.mjs";
import { removeLegacyPresentationArtifacts } from "./legacy-render-artifacts.mjs";

test("maps authored SVG class paints before presentation styles are removed", () => {
  const css = `.paper { fill: var(--background); }
  .node { fill: var(--card); stroke: var(--border); }
  .label { fill: var(--foreground); }`;
  const source = `<svg viewBox="0 0 40 20"><style>${css}</style><rect id="node" class="node" width="40" height="20"></rect></svg>`;
  const extracted = removeLegacyPresentationArtifacts(
    source,
    "style-proof",
    css,
  );
  const blocks = convertRenderedHtmlToPortableText(
    extracted.html,
    "style-proof",
  );

  assert.equal(blocks[0]._type, "diagram");
  assert.equal(blocks[0].elements[0].id, "node");
  assert.equal(blocks[0].elements[0].fill, "card");
  assert.equal(blocks[0].elements[0].stroke, "border");
  assert.equal(blocks[0].elements[0].type, "rect");
  assert.deepEqual(extracted.canonicalPresentationMappings, [
    {
      sha256:
        "5eef537d51180db90dfce5b7cbf59d7465b66ca9e423658b1b7e08b642182d02",
      bytes: Buffer.byteLength(css),
      provenance: "authored-presentation",
      target: "canonical-diagram-paint",
    },
  ]);
});

test("preserves authored structure, inline marks, links, anchors, and lists", () => {
  const result = convertRenderedHtmlToPortableText(
    '<section id="proposal"><h2>Proposal</h2><p>Read <strong>this</strong> <a href="https://example.test">link</a>.</p><ul><li id="one">First</li><li>Second</li></ul></section>',
    "sample-change",
  );

  assert.equal(result[0].id, "proposal");
  assert.equal(result[1].style, "h2");
  assert.equal(
    result[2].children.map((span) => span.text).join(""),
    "Read this link.",
  );
  assert.ok(result[2].children.some((span) => span.marks?.includes("strong")));
  assert.equal(result[2].markDefs[0].href, "https://example.test");
  assert.deepEqual(
    result.slice(-2).map((block) => block.listItem),
    ["bullet", "bullet"],
  );
  assert.equal(result.at(-2).id, "one");
});

test("converts scenario cards and native media without legacy wrappers", () => {
  const result = convertRenderedHtmlToPortableText(
    '<div data-slot="card"><div><span>GIVEN</span><span>team exists</span></div><div><span>WHEN</span><span>open page</span></div><div><span>THEN</span><span>page loads</span></div></div><img data-emdash-media-key="asset-key" alt="court" />',
    "sample-change",
    [{ key: "asset-key", sourceUrl: "https://example.test/court.png" }],
    {
      scenarios: [
        {
          id: "S-1",
          given: "team exists",
          when: "open page",
          then: "page loads",
        },
      ],
      decisionGroups: [],
      riskTables: [],
      flowcharts: [],
    },
  );
  assert.equal(result[0]._type, "scenario");
  assert.equal(result[0].given, "team exists");
  assert.equal(result[1]._type, "image");
  assert.equal(result[1].asset._ref, "asset-key");
  assert.equal(result[1].alt, "court");
  assert.ok(
    result.every(
      (block) =>
        !["legacy_html", "legacy_media", "markdown", "prose"].includes(
          block._type,
        ),
    ),
  );
});

test("compares scenario presentation while retaining authored inline syntax", () => {
  const authored = {
    id: "S-inline",
    given: "every record in `blueprint/content/decisions/`",
    when: "**an agent** opens the page",
    then: "the content appears",
  };
  const result = convertRenderedHtmlToPortableText(
    '<div data-slot="card"><div><span>GIVEN</span><span>every record in blueprint/content/decisions/</span></div><div><span>WHEN</span><span>an agent opens the page</span></div><div><span>THEN</span><span>the content appears</span></div></div>',
    "sample-change",
    [],
    {
      scenarios: [authored],
      decisionGroups: [],
      riskTables: [],
      flowcharts: [],
    },
  );
  assert.deepEqual(
    [result[0].given, result[0].when, result[0].then],
    [authored.given, authored.when, authored.then],
  );
});

test("compares risk table presentation while retaining authored inline syntax", () => {
  const risks = [
    {
      name: "git 2.31 以前沒有 `--disk-usage`",
      severity: "info",
      mitigation: "版本不符時 **明確提示**。",
    },
  ];
  const result = convertRenderedHtmlToPortableText(
    "<table><thead><tr><th>Risk</th><th>Severity</th><th>Mitigation</th></tr></thead><tbody><tr><td>git 2.31 以前沒有 --disk-usage</td><td>info</td><td>版本不符時 明確提示。</td></tr></tbody></table>",
    "sample-change",
    [],
    { scenarios: [], decisionGroups: [], riskTables: [risks], flowcharts: [] },
  );
  assert.equal(result[0]._type, "risk_table");
  assert.equal(JSON.parse(result[0].risks)[0].name, risks[0].name);
  assert.equal(JSON.parse(result[0].risks)[0].mitigation, risks[0].mitigation);
});

test("preserves code and rectangular tables", () => {
  const result = convertRenderedHtmlToPortableText(
    '<pre><code class="language-ts">const x = 1;</code></pre><table><tbody><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></tbody></table>',
    "sample-change",
  );
  assert.deepEqual(result[0], {
    _type: "code",
    _key: "code-1",
    code: "const x = 1;",
    language: "ts",
  });
  assert.deepEqual(
    result[1].rows.map((row) => row.cells.map((cell) => cell.content[0].text)),
    [
      ["A", "B"],
      ["1", "2"],
    ],
  );
  assert.equal(result[1].hasHeaderRow, true);
});

test("fails closed on content with no canonical representation", () => {
  assert.throws(
    () =>
      convertRenderedHtmlToPortableText(
        "<svg><text>Diagram</text></svg>",
        "sample-change",
      ),
    /valid four-number viewBox/u,
  );
  assert.throws(
    () =>
      convertRenderedHtmlToPortableText(
        "<unknown>Content</unknown>",
        "sample-change",
      ),
    /unsupported rendered element/u,
  );
});

test("preserves authored SVG geometry, arrow direction, and text in a native diagram", () => {
  const result = convertRenderedHtmlToPortableText(
    '<svg viewBox="0 0 120 60" aria-label="Verified data path"><title>Data path</title><desc>One write path</desc><defs><marker id="arrow" viewBox="0 0 10 10" markerWidth="7" markerHeight="7" refX="9" refY="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--warning)"></path></marker></defs><g><rect id="source" x="0" y="10" width="30" height="20" fill="var(--card)" stroke="var(--border)"></rect><text x="4" y="22" font-size="12">Queue</text><line x1="30" y1="20" x2="80" y2="20" marker-end="url(#arrow)" stroke="var(--primary)"></line><path d="M 80 20 L 110 20" stroke="var(--muted-foreground)"></path></g></svg>',
    "diagram-source",
  );
  const [diagram] = result;
  assert.equal(diagram._type, "diagram");
  assert.equal(diagram._version, 1);
  assert.deepEqual(diagram.viewBox, { x: 0, y: 0, width: 120, height: 60 });
  assert.equal(diagram.title, "Data path");
  assert.equal(diagram.description, "One write path");
  const [group] = diagram.elements;
  assert.equal(group.type, "group");
  assert.deepEqual(group.children[0], {
    type: "rect",
    id: "source",
    fill: "card",
    stroke: "border",
    x: 0,
    y: 10,
    width: 30,
    height: 20,
  });
  assert.equal(group.children[1].text, "Queue");
  assert.equal(group.children[2].markerEnd, "arrow");
  assert.deepEqual(diagram.markers[0], {
    id: "arrow",
    viewBox: { x: 0, y: 0, width: 10, height: 10 },
    width: 7,
    height: 7,
    refX: 9,
    refY: 5,
    orient: "auto-start-reverse",
    path: [
      { op: "M", values: [0, 0] },
      { op: "L", values: [10, 5] },
      { op: "L", values: [0, 10] },
      { op: "z", values: [] },
    ],
    fill: "warning",
  });
  assert.deepEqual(group.children[3].commands, [
    { op: "M", values: [80, 20] },
    { op: "L", values: [110, 20] },
  ]);
});

test("fails closed on unsupported SVG paint and visible primitives", () => {
  assert.throws(
    () =>
      convertRenderedHtmlToPortableText(
        '<svg viewBox="0 0 10 10"><rect x="0" y="0" width="5" height="5" fill="url(#gradient)"></rect></svg>',
        "unsupported-paint",
      ),
    /paint url\(#gradient\) has no canonical paint token/u,
  );
  assert.throws(
    () =>
      convertRenderedHtmlToPortableText(
        '<svg viewBox="0 0 10 10"><foreignObject width="10" height="10"></foreignObject></svg>',
        "unsupported-primitive",
      ),
    /unsupported visible SVG primitive/u,
  );
});

test("converts accepted Markdown structure and fails closed on raw HTML", () => {
  const result = convertMarkdownToPortableText(
    "## Scope\n\nKeep **all** [links](https://example.test) and [angle links](<https://example.test/g1>).\n\n1. First\n2. Second\n\n```ts\nconst x = 1;\n```",
    "accepted-spec",
  );
  assert.equal(result[0].style, "h2");
  assert.equal(result[0].id, "scope");
  assert.ok(result[1].children.some((span) => span.marks?.includes("strong")));
  assert.equal(result[1].markDefs[0].href, "https://example.test");
  assert.equal(result[1].markDefs[1].href, "https://example.test/g1");
  assert.deepEqual(
    result.slice(2, 4).map((block) => block.listItem),
    ["number", "number"],
  );
  assert.equal(result[4].language, "ts");
  assert.throws(
    () => convertMarkdownToPortableText("<div>hidden</div>", "accepted-spec"),
    /raw HTML/u,
  );
});

test("extracts static MDX typed values without evaluating JavaScript", () => {
  const source = `export const scenarios = [{ id: "S1", given: "team", when: "open", then: "show" }];
<DecisionCards ids={["0055", "0056"]} />
<RiskTable risks={[{ name: "Risk", severity: "warning", mitigation: "Review" }]} />
<InteractiveFlowchart nodes={[{ id: "a", label: "Start", x: 1, y: 2 }]} edges={[]} details={{ a: { title: "Start", body: "Begin." } }} />`;
  const result = extractMdxStructuredData(source, "sample-change");
  assert.deepEqual(result.scenarios, [
    { id: "S1", given: "team", when: "open", then: "show" },
  ]);
  assert.deepEqual(result.decisionGroups, [["0055", "0056"]]);
  assert.equal(result.riskTables[0][0].severity, "warning");
  assert.equal(result.flowcharts[0].details.a.body, "Begin.");
  assert.throws(
    () =>
      extractMdxStructuredData(
        "export const scenarios = [runCode()];",
        "sample-change",
      ),
    /unsupported MDX literal/u,
  );
});

test("extracts static Scenario props and fails on executable props", () => {
  const result = extractMdxStructuredData(
    '<Scenario given="A team exists" when="the page opens" then="content appears" />',
    "sample-change",
  );
  assert.deepEqual(result.scenarios, [
    {
      id: "sample-change-scenario-1",
      given: "A team exists",
      when: "the page opens",
      then: "content appears",
    },
  ]);
  assert.throws(
    () =>
      extractMdxStructuredData(
        '<Scenario given={getGiven()} when="open" then="show" />',
        "sample-change",
      ),
    /unsupported MDX literal/u,
  );
});

test("maps authored DecisionCards and RiskTable to their Blueprint typed blocks", () => {
  const structured = {
    scenarios: [],
    decisionGroups: [["0055"]],
    riskTables: [[{ name: "Risk", severity: "warning", mitigation: "Review" }]],
    flowcharts: [],
  };
  const result = convertRenderedHtmlToPortableText(
    '<div data-slot="accordion"><div id="adr-0055"></div></div><table><thead><tr><th>Risk</th><th>Severity</th><th>Mitigation</th></tr></thead><tbody><tr><td>Risk</td><td>warning</td><td>Review</td></tr></tbody></table>',
    "sample-change",
    [],
    structured,
  );
  assert.equal(result[0].id, "adr-0055");
  assert.equal(result[1]._type, "decision_cards");
  assert.deepEqual(JSON.parse(result[1].records), ["0055"]);
  assert.equal(result[2]._type, "risk_table");
  assert.deepEqual(JSON.parse(result[2].risks), structured.riskTables[0]);
});
