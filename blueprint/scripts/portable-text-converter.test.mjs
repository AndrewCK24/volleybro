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
