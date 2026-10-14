import assert from "node:assert/strict";
import test from "node:test";
import {
  convertMarkdownToPortableText,
  extractMdxStructuredData,
  convertRenderedHtmlToPortableText,
} from "./portable-text-converter.mjs";

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
    /SVG flowchart/u,
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

test("converts an accessible SVG flowchart to typed graph data", () => {
  const result = convertRenderedHtmlToPortableText(
    '<svg role="img"><title>Flow</title><desc>Source and target</desc><rect class="sn-node" x="0" y="0" width="20" height="20"></rect><text x="2" y="10">Start</text><rect class="sn-node" x="80" y="0" width="20" height="20"></rect><text x="82" y="10">End</text><line class="sn-wire" x1="20" y1="10" x2="80" y2="10"></line></svg>',
    "sample-change",
  );
  assert.equal(result[0]._type, "interactive_flowchart");
  assert.deepEqual(
    JSON.parse(result[0].nodes).map((node) => node.label),
    ["Start", "End"],
  );
  assert.deepEqual(
    JSON.parse(result[0].edges).map(({ from, to }) => [from, to]),
    [["sample-change-flow-node-1", "sample-change-flow-node-2"]],
  );
  assert.match(
    JSON.parse(result[0].details).__diagram.body,
    /Source and target/u,
  );
});

test("reconstructs accessible rect and line diagrams with every text label", () => {
  const result = convertRenderedHtmlToPortableText(
    '<svg role="img"><title>Build path</title><desc>Credential boundary</desc><rect x="16" y="16" width="192" height="48"></rect><text><tspan x="112" y="32">Native build</tspan></text><text><tspan x="112" y="50">No credential</tspan></text><rect x="16" y="100" width="192" height="48"></rect><text><tspan x="112" y="116">Static export</tspan></text><text><tspan x="112" y="134">Upload artifact</tspan></text><line x1="112" y1="64" x2="112" y2="100" marker-end="url(#arrow)"></line></svg>',
    "build-path",
  );
  assert.equal(result[0]._type, "interactive_flowchart");
  assert.deepEqual(
    JSON.parse(result[0].nodes).map(({ label, sublabel }) => [label, sublabel]),
    [
      ["Native build", "No credential"],
      ["Static export", "Upload artifact"],
    ],
  );
  assert.deepEqual(
    JSON.parse(result[0].edges).map(({ from, to }) => [from, to]),
    [["build-path-flow-node-1", "build-path-flow-node-2"]],
  );
  assert.equal(JSON.parse(result[0].details).__diagram.title, "Build path");
  assert.equal(
    JSON.parse(result[0].details).__diagram.body,
    "Credential boundary",
  );
});

test("maps SVG polygon node geometry and retains secondary labels", () => {
  const result = convertRenderedHtmlToPortableText(
    '<svg viewBox="0 0 120 80"><polygon class="sn-node" points="60,10 100,40 60,70 20,40"></polygon><text x="60" y="38">Decision</text><text x="60" y="52">load()</text></svg>',
    "polygon-diagram",
  );
  const [node] = JSON.parse(result[0].nodes);
  assert.equal(node.shape, "diamond");
  assert.deepEqual([node.x, node.y, node.w, node.h], [20, 10, 80, 60]);
  assert.equal(node.label, "Decision");
  assert.equal(node.sublabel, "load()");
});

test("keeps flowchart legend outside the graph as typed diagram metadata", () => {
  const result = convertRenderedHtmlToPortableText(
    '<svg viewBox="0 0 180 80"><rect class="sn-node" x="10" y="10" width="40" height="20"></rect><text x="30" y="23">Start</text><line class="sn-rule" x1="5" y1="50" x2="175" y2="50"></line><text x="5" y="65">LEGEND</text><rect class="sn-node" x="50" y="55" width="16" height="8"></rect><text x="70" y="65">Action</text></svg>',
    "legend-diagram",
  );
  assert.equal(JSON.parse(result[0].nodes).length, 1);
  assert.deepEqual(JSON.parse(result[0].edges), []);
  assert.deepEqual(JSON.parse(result[0].details).__diagram.legend, [
    { label: "Action", shape: "box", emphasis: false },
  ]);
});

test("reads SVG path endpoints with horizontal and vertical commands", () => {
  const result = convertRenderedHtmlToPortableText(
    '<svg viewBox="0 0 120 50"><rect class="sn-node" x="0" y="0" width="20" height="20"></rect><text x="10" y="12">A</text><rect class="sn-node" x="80" y="0" width="20" height="20"></rect><text x="90" y="12">B</text><path class="sn-wire" d="M20 10 H50 V12 Q55 17 60 17 H80"></path></svg>',
    "path-diagram",
  );
  assert.deepEqual(
    JSON.parse(result[0].edges).map(({ from, to }) => [from, to]),
    [["path-diagram-flow-node-1", "path-diagram-flow-node-2"]],
  );
});

test("reconstructs the recognized dialog wireframe with every label", () => {
  const rects = Array.from(
    { length: 18 },
    (_, index) => `<rect x="${index}" y="10" width="20" height="16"></rect>`,
  ).join("");
  const circles = Array.from(
    { length: 4 },
    (_, index) => `<circle cx="${index}" cy="4" r="2"></circle>`,
  ).join("");
  const result = convertRenderedHtmlToPortableText(
    `<svg role="img" aria-label="兩個 dialog 的線框對照。left and right.">${rects}${circles}<text x="10" y="20">Header</text><text x="40" y="32">Close</text></svg>`,
    "dialog-wireframe",
  );
  const graph = result[0];
  assert.deepEqual(
    JSON.parse(graph.nodes).map(({ label }) => label),
    ["Header", "Close"],
  );
  assert.deepEqual(JSON.parse(graph.edges), []);
  assert.equal(
    JSON.parse(graph.details).__diagram.body,
    "兩個 dialog 的線框對照。left and right.",
  );
  assert.equal(JSON.parse(graph.details).__diagram.decorations.length, 4);
});

test("fails closed when accessible SVG diagram geometry is not mapped", () => {
  assert.throws(
    () =>
      convertRenderedHtmlToPortableText(
        '<svg role="img"><circle cx="10" cy="10" r="8"></circle><text><tspan x="10" y="10">Visible</tspan></text></svg>',
        "unmapped-diagram",
      ),
    /unsupported flowchart geometry/u,
  );
});

test("converts accepted Markdown structure and fails closed on raw HTML", () => {
  const result = convertMarkdownToPortableText(
    "## Scope\n\nKeep **all** [links](https://example.test).\n\n1. First\n2. Second\n\n```ts\nconst x = 1;\n```",
    "accepted-spec",
  );
  assert.equal(result[0].style, "h2");
  assert.equal(result[0].id, "scope");
  assert.ok(result[1].children.some((span) => span.marks?.includes("strong")));
  assert.equal(result[1].markDefs[0].href, "https://example.test");
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
