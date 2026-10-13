import { parseFragment } from "parse5";

const BLOCK_TAGS = new Map([
  ["p", "normal"],
  ["h1", "h1"],
  ["h2", "h2"],
  ["h3", "h3"],
  ["h4", "h4"],
  ["h5", "h5"],
  ["h6", "h6"],
  ["blockquote", "blockquote"],
]);
const MARKS = new Map([
  ["strong", "strong"],
  ["b", "strong"],
  ["em", "em"],
  ["i", "em"],
  ["u", "underline"],
  ["s", "strike-through"],
  ["del", "strike-through"],
  ["code", "code"],
  ["sup", "superscript"],
  ["sub", "subscript"],
]);

function attr(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value;
}

function text(node) {
  if (node.nodeName === "#text") return node.value;
  return (node.childNodes ?? []).map(text).join("");
}

function stableKey(prefix, index) {
  return `${prefix}-${index + 1}`;
}

function renderedNodePath(node) {
  const path = [];
  for (
    let current = node;
    current && path.length < 6;
    current = current.parentNode
  ) {
    const name = current.tagName ?? current.nodeName ?? "unknown";
    const id = attr(current, "id");
    path.unshift(`${name}${id ? `#${id}` : ""}`);
  }
  return path.join(" > ");
}

function makeBlock(style, children, id, index, markDefs) {
  const block = {
    _type: "block",
    _key: stableKey("portable", index),
    style,
    children: children.length
      ? children
      : [{ _type: "span", _key: "span-1", text: "", marks: [] }],
  };
  if (id) block.id = id;
  if (markDefs.length) block.markDefs = markDefs;
  return block;
}

function inlineNodes(nodes, inheritedMarks, markDefs, counter) {
  const spans = [];
  const append = (value, marks = inheritedMarks) => {
    if (!value) return;
    const previous = spans.at(-1);
    if (previous && JSON.stringify(previous.marks) === JSON.stringify(marks))
      previous.text += value;
    else
      spans.push({
        _type: "span",
        _key: `span-${++counter.value}`,
        text: value,
        ...(marks.length ? { marks: [...marks] } : {}),
      });
  };
  for (const node of nodes) {
    if (node.nodeName === "#text") {
      append(node.value);
      continue;
    }
    const tag = node.tagName;
    if (!tag)
      throw new Error("Unsupported non-element node in inline content.");
    if (tag === "br") {
      append("\n");
      continue;
    }
    if (
      tag === "button" &&
      attr(node, "aria-live") === "polite" &&
      (attr(node, "class") ?? "").includes("group-hover/heading")
    )
      continue;
    if (tag === "svg" && attr(node, "aria-hidden") === "true") continue;
    if (tag === "img")
      throw new Error("Inline image must be emitted as a native media block.");
    let marks = inheritedMarks;
    const mark = tag === "kbd" ? "code" : MARKS.get(tag);
    if (mark) marks = [...inheritedMarks, mark];
    if (tag === "a") {
      const href = attr(node, "href");
      if (!href) throw new Error("Link has no href.");
      const key = `link-${markDefs.length + 1}`;
      markDefs.push({
        _key: key,
        _type: "link",
        href,
        ...(attr(node, "target") === "_blank" ? { blank: true } : {}),
      });
      marks = [...inheritedMarks, key];
    }
    inlineNodes(node.childNodes ?? [], marks, markDefs, counter).forEach(
      (span) => append(span.text, span.marks ?? []),
    );
  }
  return spans;
}

function tableBlock(node, index) {
  const rows = [];
  let hasHeaderRow = false;
  const collectRows = (current) => {
    if (current.tagName === "tr") {
      const cells = (current.childNodes ?? []).filter(
        (cell) => cell.tagName === "td" || cell.tagName === "th",
      );
      if (rows.length === 0)
        hasHeaderRow =
          cells.length > 0 && cells.every((cell) => cell.tagName === "th");
      rows.push(cells.map((cell) => text(cell).trim()));
      return;
    }
    for (const child of current.childNodes ?? []) collectRows(child);
  };
  collectRows(node);
  if (!rows.length || rows.some((row) => row.length !== rows[0].length))
    throw new Error("Table is empty or has inconsistent row widths.");
  return {
    _type: "table",
    _key: stableKey("table", index),
    rows: rows.map((cells, rowIndex) => ({
      _type: "tableRow",
      _key: stableKey(`table-row-${index + 1}`, rowIndex),
      cells: cells.map((content, cellIndex) => ({
        _type: "tableCell",
        _key: stableKey(`table-cell-${index + 1}-${rowIndex + 1}`, cellIndex),
        content: [{ _type: "span", text: content }],
        ...(rowIndex === 0 && hasHeaderRow ? { isHeader: true } : {}),
      })),
    })),
    hasHeaderRow,
  };
}

function scenarioBlock(node, slug, index, source) {
  const labels = ["GIVEN", "WHEN", "THEN"];
  const values = {};
  for (const label of labels) {
    const matches = [];
    const visit = (current) => {
      if (current.tagName === "span" && text(current).trim() === label)
        matches.push(current);
      for (const child of current.childNodes ?? []) visit(child);
    };
    visit(node);
    if (matches.length !== 1)
      throw new Error(
        `${slug}: scenario has ${matches.length} ${label} labels.`,
      );
    const row = matches[0].parentNode;
    const value = row?.childNodes?.filter(
      (child) => child.tagName === "span",
    )?.[1];
    if (!value) throw new Error(`${slug}: scenario ${label} value is missing.`);
    values[label.toLowerCase()] = text(value).trim();
  }
  const visible = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      value.replace(/\s+/gu, " ").trim(),
    ]),
  );
  for (const field of ["given", "when", "then"])
    if (
      visible[field] !==
      String(source?.[field] ?? "")
        .replace(/\s+/gu, " ")
        .trim()
    )
      throw new Error(
        `${slug}: rendered scenario differs from its authored ${field} value.`,
      );
  if (typeof source?.id !== "string" || !source.id.trim())
    throw new Error(`${slug}: authored scenario ID is missing.`);
  return {
    _type: "scenario",
    _version: 1,
    _key: stableKey(`${slug}-scenario`, index),
    id: source.id,
    given: source.given,
    when: source.when,
    then: source.then,
  };
}

function markdownInline(source, markDefs) {
  const spans = [];
  const pattern =
    /!\[[^\]]*\]\([^)]+\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|`([^`]+)`/gu;
  let offset = 0;
  let match;
  const push = (value, marks = []) => {
    if (!value) return;
    const previous = spans.at(-1);
    if (
      previous &&
      JSON.stringify(previous.marks ?? []) === JSON.stringify(marks)
    )
      previous.text += value;
    else
      spans.push({
        _type: "span",
        _key: `span-${spans.length + 1}`,
        text: value,
        ...(marks.length ? { marks } : {}),
      });
  };
  while ((match = pattern.exec(source))) {
    push(source.slice(offset, match.index));
    const token = match[0];
    if (token.startsWith("!"))
      throw new Error("Markdown image requires a source media mapping.");
    if (match[1] !== undefined) {
      const key = `link-${markDefs.length + 1}`;
      markDefs.push({ _key: key, _type: "link", href: match[2] });
      push(match[1], [key]);
    } else if (match[3] !== undefined || match[4] !== undefined)
      push(match[3] ?? match[4], ["strong"]);
    else if (match[5] !== undefined || match[6] !== undefined)
      push(match[5] ?? match[6], ["em"]);
    else push(match[7], ["code"]);
    offset = pattern.lastIndex;
  }
  push(source.slice(offset));
  return spans;
}

function markdownAnchor(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/gu, "-");
}

function parseJsLiteral(source, slug) {
  let index = 0;
  const skip = () => {
    while (/\s/u.test(source[index] ?? "")) index += 1;
  };
  const parseString = () => {
    const quote = source[index++];
    let value = "";
    while (index < source.length && source[index] !== quote) {
      if (source[index] === "\\") {
        const escaped = source[index + 1];
        if (escaped === undefined)
          throw new Error(`${slug}: incomplete string escape in MDX data.`);
        if (quote === '"') {
          const end = source.indexOf('"', index + 1);
          if (end < 0) throw new Error(`${slug}: unterminated MDX string.`);
          const raw = source.slice(index - 1, end + 1);
          value += JSON.parse(raw);
          index = end;
        } else {
          value += { n: "\n", r: "\r", t: "\t" }[escaped] ?? escaped;
          index += 1;
        }
      } else value += source[index];
      index += 1;
    }
    if (source[index] !== quote)
      throw new Error(`${slug}: unterminated MDX string.`);
    index += 1;
    return value;
  };
  const parseValue = () => {
    skip();
    const current = source[index];
    if (current === '"' || current === "'") return parseString();
    if (current === "[") {
      index += 1;
      const values = [];
      skip();
      while (source[index] !== "]") {
        values.push(parseValue());
        skip();
        if (source[index] === ",") {
          index += 1;
          skip();
          continue;
        }
        if (source[index] !== "]")
          throw new Error(`${slug}: unsupported MDX array syntax.`);
      }
      index += 1;
      return values;
    }
    if (current === "{") {
      index += 1;
      const value = {};
      skip();
      while (source[index] !== "}") {
        let key;
        if (source[index] === '"' || source[index] === "'") key = parseString();
        else {
          const match = source.slice(index).match(/^[A-Za-z_$][\w$]*/u);
          if (!match) throw new Error(`${slug}: unsupported MDX object key.`);
          key = match[0];
          index += key.length;
        }
        skip();
        if (source[index++] !== ":")
          throw new Error(`${slug}: unsupported MDX object syntax.`);
        value[key] = parseValue();
        skip();
        if (source[index] === ",") {
          index += 1;
          skip();
          continue;
        }
        if (source[index] !== "}")
          throw new Error(`${slug}: unsupported MDX object syntax.`);
      }
      index += 1;
      return value;
    }
    const number = source.slice(index).match(/^-?\d+(?:\.\d+)?/u)?.[0];
    if (number) {
      index += number.length;
      return Number(number);
    }
    for (const [token, value] of [
      ["true", true],
      ["false", false],
      ["null", null],
    ]) {
      if (source.startsWith(token, index)) {
        index += token.length;
        return value;
      }
    }
    throw new Error(
      `${slug}: unsupported MDX literal value near ${source.slice(index, index + 24)}.`,
    );
  };
  const parsed = parseValue();
  skip();
  if (index !== source.length)
    throw new Error(`${slug}: trailing MDX literal content.`);
  return parsed;
}

function expressionForProp(tag, prop, slug) {
  const marker = new RegExp(`\\b${prop}\\s*=\\s*\\{`, "u");
  const match = marker.exec(tag);
  if (!match) throw new Error(`${slug}: ${prop} prop has no expression.`);
  const start = match.index + match[0].length;
  let depth = 1;
  let quote = "";
  let escaped = false;
  for (let index = start; index < tag.length; index += 1) {
    const char = tag[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === "{") depth += 1;
    else if (char === "}" && --depth === 0)
      return parseJsLiteral(tag.slice(start, index), slug);
  }
  throw new Error(`${slug}: unterminated ${prop} expression.`);
}

export function extractMdxStructuredData(proposal, slug) {
  const scenarioMarker = /export\s+const\s+scenarios\s*=\s*/u.exec(proposal);
  let scenarios = [];
  if (scenarioMarker) {
    const start = scenarioMarker.index + scenarioMarker[0].length;
    let depth = 0;
    let quote = "";
    let escaped = false;
    let end = -1;
    for (let index = start; index < proposal.length; index += 1) {
      const char = proposal[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === quote) quote = "";
        continue;
      }
      if (char === '"' || char === "'") quote = char;
      else if (char === "[") depth += 1;
      else if (char === "]" && --depth === 0) {
        end = index + 1;
        break;
      }
    }
    if (end < 0)
      throw new Error(`${slug}: scenario source array is incomplete.`);
    scenarios = parseJsLiteral(proposal.slice(start, end), slug);
  }
  const directScenarios = [
    ...proposal.matchAll(/<Scenario\b[\s\S]*?\/>/gu),
  ].map((match, index) => {
    const values = {};
    for (const field of ["given", "when", "then"]) {
      const quoted = new RegExp(
        `\\b${field}\\s*=\\s*(["'])((?:\\\\.|(?!\\1)[\\s\\S])*)\\1`,
        "u",
      ).exec(match[0]);
      if (quoted)
        values[field] = parseJsLiteral(
          `${quoted[1]}${quoted[2]}${quoted[1]}`,
          slug,
        );
      else values[field] = expressionForProp(match[0], field, slug);
      if (typeof values[field] !== "string")
        throw new Error(`${slug}: Scenario ${field} must be a string literal.`);
    }
    return {
      id: `${slug}-scenario-${scenarios.length + index + 1}`,
      ...values,
    };
  });
  scenarios.push(...directScenarios);
  const tags = [
    ...proposal.matchAll(
      /<(DecisionCards|RiskTable|InteractiveFlowchart)\b[\s\S]*?\/>/gsu,
    ),
  ].map((match) => ({ type: match[1], source: match[0] }));
  const decisionGroups = tags
    .filter((tag) => tag.type === "DecisionCards")
    .map((tag) => expressionForProp(tag.source, "ids", slug))
    .filter((ids) => ids.length > 0);
  const riskTables = tags
    .filter((tag) => tag.type === "RiskTable")
    .map((tag) => expressionForProp(tag.source, "risks", slug));
  const flowcharts = tags
    .filter((tag) => tag.type === "InteractiveFlowchart")
    .map((tag) => ({
      nodes: expressionForProp(tag.source, "nodes", slug),
      edges: expressionForProp(tag.source, "edges", slug),
      details: expressionForProp(tag.source, "details", slug),
    }));
  if (
    !Array.isArray(scenarios) ||
    !Array.isArray(decisionGroups) ||
    decisionGroups.some(
      (ids) => !Array.isArray(ids) || ids.some((id) => typeof id !== "string"),
    )
  )
    throw new Error(
      `${slug}: structured MDX values have an unsupported shape.`,
    );
  return { scenarios, decisionGroups, riskTables, flowcharts };
}

export function convertMarkdownToPortableText(markdown, slug) {
  const lines = markdown.replace(/\r\n?/gu, "\n").split("\n");
  const blocks = [];
  let index = 0;
  const addTextBlock = (style, source, id) => {
    const markDefs = [];
    const children = markdownInline(source, markDefs);
    blocks.push(makeBlock(style, children, id, blocks.length, markDefs));
  };
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/u);
    if (heading) {
      addTextBlock(
        `h${heading[1].length}`,
        heading[2],
        markdownAnchor(heading[2]),
      );
      index += 1;
      continue;
    }
    const fence = line.match(/^\s*(```+|~~~+)\s*([\w+-]+)?\s*$/u);
    if (fence) {
      const content = [];
      index += 1;
      while (
        index < lines.length &&
        !lines[index].trim().startsWith(fence[1][0].repeat(fence[1].length))
      )
        content.push(lines[index++]);
      if (index >= lines.length)
        throw new Error(`${slug}: unterminated Markdown code fence.`);
      blocks.push({
        _type: "code",
        _key: stableKey("code", blocks.length),
        code: content.join("\n"),
        ...(fence[2] ? { language: fence[2] } : {}),
      });
      index += 1;
      continue;
    }
    if (/^\s*\|/u.test(line)) {
      const rows = [];
      while (index < lines.length && /^\s*\|/u.test(lines[index])) {
        const row = lines[index++]
          .trim()
          .replace(/^\|\s*/u, "")
          .replace(/\s*\|$/u, "")
          .split(/(?<!\\)\|/u)
          .map((cell) => cell.replace(/\\\|/gu, "|").trim());
        if (!row.every((cell) => /^:?-{3,}:?$/u.test(cell))) rows.push(row);
      }
      if (!rows.length || rows.some((row) => row.length !== rows[0].length))
        throw new Error(`${slug}: Markdown table is empty or irregular.`);
      blocks.push({
        _type: "table",
        _key: stableKey("table", blocks.length),
        rows,
      });
      continue;
    }
    const listMatch = line.match(/^(\s*)([-*+]\s+|\d+[.)]\s+)(.*)$/u);
    if (listMatch) {
      const baseIndent = listMatch[1].length;
      while (index < lines.length) {
        const item = lines[index].match(/^(\s*)([-*+]\s+|\d+[.)]\s+)(.*)$/u);
        if (!item || item[1].length < baseIndent) break;
        addTextBlock("normal", item[3], undefined);
        const block = blocks.at(-1);
        block.listItem = /^\d/u.test(item[2]) ? "number" : "bullet";
        block.level = Math.max(1, Math.floor(item[1].length / 2) + 1);
        index += 1;
      }
      continue;
    }
    if (/^\s*>/u.test(line)) {
      const quoted = [];
      while (index < lines.length && /^\s*>/u.test(lines[index]))
        quoted.push(lines[index++].replace(/^\s*>\s?/u, ""));
      addTextBlock("blockquote", quoted.join(" "), undefined);
      continue;
    }
    if (/^\s*<\/?[A-Za-z][^>]*>/u.test(line))
      throw new Error(
        `${slug}: raw HTML in Markdown requires an explicit Portable Text mapping.`,
      );
    const paragraph = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6}\s|\s*```|\s*~~~|\s*\||\s*[-*+]\s|\s*\d+[.)]\s|\s*>|\s*<\/?[A-Za-z])/u.test(
        lines[index],
      )
    )
      paragraph.push(lines[index++].trim());
    addTextBlock("normal", paragraph.join(" "), undefined);
  }
  if (!blocks.length)
    throw new Error(`${slug}: Markdown document has no convertible content.`);
  return blocks;
}

function isScenario(node) {
  if (node.tagName !== "div" || attr(node, "data-slot") !== "card")
    return false;
  const content = text(node);
  return ["GIVEN", "WHEN", "THEN"].every((label) => content.includes(label));
}

function accessibleSvgFlowchart(svg, descendants, index, slug) {
  const under = (node, ancestor) => {
    for (let current = node; current; current = current.parentNode)
      if (current === ancestor) return true;
    return false;
  };
  const inDefs = (node) =>
    descendants.some(
      (candidate) => candidate.tagName === "defs" && under(node, candidate),
    );
  const rects = descendants.filter(
    (node) => node.tagName === "rect" && !inDefs(node),
  );
  const lines = descendants.filter(
    (node) => node.tagName === "line" && !inDefs(node),
  );
  if (
    !rects.length ||
    !lines.length ||
    descendants.some(
      (node) =>
        ["polygon", "ellipse", "circle", "polyline", "path"].includes(
          node.tagName,
        ) && !inDefs(node),
    )
  )
    throw new Error(
      `${slug}: accessible SVG diagram uses unsupported flowchart geometry.`,
    );

  const numberAttr = (node, name) => {
    const value = Number(attr(node, name));
    return Number.isFinite(value) ? value : null;
  };
  const nested = (node) =>
    (node.childNodes ?? []).flatMap((child) => [child, ...nested(child)]);
  const labels = descendants
    .filter((node) => node.tagName === "text")
    .map((node, labelIndex) => {
      const positioned = [node, ...nested(node)];
      return {
        text: text(node).replace(/\s+/gu, " ").trim(),
        x: positioned
          .map((part) => numberAttr(part, "x"))
          .find(Number.isFinite),
        y: positioned
          .map((part) => numberAttr(part, "y"))
          .find(Number.isFinite),
        labelIndex,
      };
    })
    .filter((label) => label.text);
  const nodes = rects.map((rect, nodeIndex) => {
    const x = numberAttr(rect, "x");
    const y = numberAttr(rect, "y");
    const w = numberAttr(rect, "width");
    const h = numberAttr(rect, "height");
    if ([x, y, w, h].some((value) => value === null))
      throw new Error(
        `${slug}: accessible SVG flowchart node has incomplete geometry.`,
      );
    const contained = labels
      .filter(
        (label) =>
          Number.isFinite(label.x) &&
          Number.isFinite(label.y) &&
          label.x >= x &&
          label.x <= x + w &&
          label.y >= y &&
          label.y <= y + h,
      )
      .sort(
        (left, right) => left.y - right.y || left.labelIndex - right.labelIndex,
      );
    if (!contained.length)
      throw new Error(
        `${slug}: accessible SVG flowchart node has no mapped visible label.`,
      );
    return {
      id: `${slug}-flow-node-${nodeIndex + 1}`,
      label: contained[0].text,
      ...(contained.length > 1
        ? {
            sublabel: contained
              .slice(1)
              .map((label) => label.text)
              .join(" "),
          }
        : {}),
      x,
      y,
      w,
      h,
      shape: "box",
      labelIndexes: contained.map((label) => label.labelIndex),
    };
  });
  const usedLabels = new Set(nodes.flatMap((node) => node.labelIndexes));
  if (labels.some((label) => !usedLabels.has(label.labelIndex)))
    throw new Error(
      `${slug}: accessible SVG has visible text outside mapped flowchart nodes.`,
    );
  const nearestNode = (x, y) =>
    nodes
      .map((node) => ({
        node,
        distance: Math.hypot(node.x + node.w / 2 - x, node.y + node.h / 2 - y),
      }))
      .sort((left, right) => left.distance - right.distance)[0]?.node;
  const edges = lines.map((line) => {
    const coordinates = ["x1", "y1", "x2", "y2"].map((name) =>
      numberAttr(line, name),
    );
    if (coordinates.some((value) => value === null))
      throw new Error(
        `${slug}: accessible SVG flowchart edge has incomplete geometry.`,
      );
    const [x1, y1, x2, y2] = coordinates;
    const from = nearestNode(x1, y1);
    const to = nearestNode(x2, y2);
    if (!from || !to || from === to)
      throw new Error(
        `${slug}: accessible SVG flowchart edge cannot be mapped to nodes.`,
      );
    return { from: from.id, to: to.id };
  });
  const title = descendants.find((node) => node.tagName === "title");
  const description = descendants.find((node) => node.tagName === "desc");
  const details = Object.fromEntries(
    nodes.map((node) => [
      node.id,
      { title: node.label, body: node.sublabel ?? "" },
    ]),
  );
  details.__diagram = {
    title: text(title ?? { childNodes: [] }).trim(),
    body: text(description ?? { childNodes: [] }).trim(),
  };
  return {
    _type: "interactive_flowchart",
    _version: 1,
    _key: stableKey("flowchart", index),
    nodes: JSON.stringify(
      nodes.map((node) => {
        const output = { ...node };
        delete output.labelIndexes;
        return output;
      }),
    ),
    edges: JSON.stringify(edges),
    details: JSON.stringify(details),
  };
}

function diagramBlock(svg, index, slug, source) {
  const descendants = [];
  const visit = (node) => {
    descendants.push(node);
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(svg);
  if (source) {
    const visibleText = descendants
      .filter(
        (node) =>
          node.tagName === "text" ||
          node.tagName === "title" ||
          node.tagName === "desc",
      )
      .map((node) => text(node).replace(/\s+/gu, " ").trim())
      .filter(Boolean)
      .join(" ");
    const requiredLabels = [
      ...source.nodes.flatMap((node) =>
        [node.label, node.sublabel].filter(Boolean),
      ),
      ...source.edges.map((edge) => edge.label).filter(Boolean),
    ];
    if (
      requiredLabels.some(
        (label) =>
          !visibleText.includes(String(label).replace(/\s+/gu, " ").trim()),
      )
    )
      throw new Error(
        `${slug}: rendered flowchart labels differ from authored structured data.`,
      );
    return {
      _type: "interactive_flowchart",
      _version: 1,
      _key: stableKey("flowchart", index),
      nodes: JSON.stringify(source.nodes),
      edges: JSON.stringify(source.edges),
      details: JSON.stringify(source.details),
    };
  }
  if (
    attr(svg, "role") === "img" &&
    !descendants.some((node) =>
      /(?:sn-node|sn-focal|sn-ext)/u.test(attr(node, "class") ?? ""),
    )
  )
    return accessibleSvgFlowchart(svg, descendants, index, slug);
  const attrNumber = (node, name) => {
    const value = Number(attr(node, name));
    return Number.isFinite(value) ? value : null;
  };
  const labels = descendants
    .filter((node) => node.tagName === "text")
    .map((node) => ({
      text: text(node).replace(/\s+/gu, " ").trim(),
      x: attrNumber(node, "x"),
      y: attrNumber(node, "y"),
    }))
    .filter((label) => label.text && label.x !== null && label.y !== null);
  const shapes = descendants
    .filter(
      (node) =>
        ["rect", "polygon", "ellipse", "circle"].includes(node.tagName) &&
        /(?:sn-node|sn-focal|sn-ext)/u.test(attr(node, "class") ?? ""),
    )
    .map((node, shapeIndex) => {
      const x = attrNumber(node, "x") ?? attrNumber(node, "cx") ?? 0;
      const y = attrNumber(node, "y") ?? attrNumber(node, "cy") ?? 0;
      const w = attrNumber(node, "width") ?? (attrNumber(node, "r") ?? 0) * 2;
      const h = attrNumber(node, "height") ?? (attrNumber(node, "r") ?? 0) * 2;
      const contained = labels.filter(
        (label) =>
          label.x >= x && label.x <= x + w && label.y >= y && label.y <= y + h,
      );
      return {
        id: `${slug}-flow-node-${shapeIndex + 1}`,
        label: contained.shift()?.text ?? "",
        x,
        y,
        w,
        h,
        shape: node.tagName === "polygon" ? "diamond" : "box",
        _labelSource: contained,
      };
    });
  if (!shapes.length || shapes.some((node) => !node.label))
    throw new Error(
      `${slug}: SVG flowchart node labels or shapes could not be mapped.`,
    );
  const nearestNode = (x, y) => {
    const ranked = shapes
      .map((node) => ({
        node,
        distance: Math.hypot(node.x + node.w / 2 - x, node.y + node.h / 2 - y),
      }))
      .sort((left, right) => left.distance - right.distance);
    return ranked[0]?.node;
  };
  const wires = descendants.filter(
    (node) =>
      ["line", "path"].includes(node.tagName) &&
      /sn-wire/u.test(attr(node, "class") ?? ""),
  );
  const edges = wires.map((wire) => {
    let x1 = attrNumber(wire, "x1");
    let y1 = attrNumber(wire, "y1");
    let x2 = attrNumber(wire, "x2");
    let y2 = attrNumber(wire, "y2");
    if (wire.tagName === "path") {
      const numbers =
        (attr(wire, "d") ?? "").match(/-?\d+(?:\.\d+)?/gu)?.map(Number) ?? [];
      if (numbers.length >= 4)
        [x1, y1, x2, y2] = [
          numbers[0],
          numbers[1],
          numbers.at(-2),
          numbers.at(-1),
        ];
    }
    if (
      [x1, y1, x2, y2].some((number) => number === null || number === undefined)
    )
      throw new Error(`${slug}: SVG flowchart wire has no supported geometry.`);
    const from = nearestNode(x1, y1);
    const to = nearestNode(x2, y2);
    if (!from || !to || from === to)
      throw new Error(
        `${slug}: SVG flowchart wire could not be connected to nodes.`,
      );
    return {
      from: from.id,
      to: to.id,
      dashed: /sn-wire-dash/u.test(attr(wire, "class") ?? ""),
      _mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 },
    };
  });
  const titleNode = descendants.find((node) => node.tagName === "title");
  const descriptionNode = descendants.find((node) => node.tagName === "desc");
  const details = Object.fromEntries(
    shapes.map((node) => [node.id, { title: node.label, body: "" }]),
  );
  details.__diagram = {
    title: text(titleNode ?? { childNodes: [] }).trim(),
    body: text(descriptionNode ?? { childNodes: [] }).trim(),
    labels: labels.map(({ text: label }) => label),
  };
  return {
    _type: "interactive_flowchart",
    _version: 1,
    _key: stableKey("flowchart", index),
    nodes: JSON.stringify(
      shapes.map((node) =>
        Object.fromEntries(
          Object.entries(node).filter(([key]) => key !== "_labelSource"),
        ),
      ),
    ),
    edges: JSON.stringify(
      edges.map((edge) =>
        Object.fromEntries(
          Object.entries(edge).filter(([key]) => key !== "_mid"),
        ),
      ),
    ),
    details: JSON.stringify(details),
  };
}

export function convertRenderedHtmlToPortableText(
  html,
  slug,
  media = [],
  structured = {
    scenarios: [],
    decisionGroups: [],
    riskTables: [],
    flowcharts: [],
  },
) {
  const fragment = parseFragment(html);
  const blocks = [];
  const scenarioIndex = { value: 0 };
  const decisionIndex = { value: 0 };
  const riskIndex = { value: 0 };
  const flowchartIndex = { value: 0 };
  const mediaByKey = new Map(media.map((row) => [row.key, row]));
  const usedMediaKeys = new Set();
  const anchorIds = new Set();
  const uniqueAnchor = (id) => {
    if (!id || anchorIds.has(id)) return null;
    anchorIds.add(id);
    return id;
  };
  const pushNode = (node) => {
    if (node.nodeName === "#text") {
      if (node.value.trim())
        blocks.push(
          makeBlock(
            "normal",
            [{ _type: "span", text: node.value }],
            null,
            blocks.length,
            [],
          ),
        );
      return;
    }
    const tag = node.tagName;
    if (!tag) {
      const nodeName = node.nodeName ?? "unknown";
      throw new Error(
        `${slug}: unsupported rendered node nodeName=${nodeName} tagName=${String(tag)} path=${renderedNodePath(node)}.`,
      );
    }
    if (tag === "svg") {
      if (attr(node, "aria-hidden") === "true") return;
      const flowchart = structured.flowcharts[flowchartIndex.value];
      blocks.push(diagramBlock(node, blocks.length, slug, flowchart));
      if (flowchart) flowchartIndex.value += 1;
      return;
    }
    if (
      [
        "script",
        "style",
        "iframe",
        "video",
        "audio",
        "object",
        "embed",
      ].includes(tag)
    )
      throw new Error(
        `${slug}: rendered <${tag}> requires a reusable typed block.`,
      );
    if (tag === "img") {
      const key = attr(node, "data-emdash-media-key");
      const source = mediaByKey.get(key);
      if (!key || !source)
        throw new Error(
          `${slug}: rendered image was not matched to source media.`,
        );
      blocks.push({
        _type: "image",
        _key: stableKey("image", blocks.length),
        asset: { _ref: key },
        alt: attr(node, "alt") ?? "",
        ...(attr(node, "title") ? { title: attr(node, "title") } : {}),
      });
      usedMediaKeys.add(key);
      return;
    }
    if (tag === "button") {
      const classes = attr(node, "class") ?? "";
      if (
        attr(node, "aria-live") === "polite" &&
        classes.includes("group-hover/heading")
      )
        return;
      throw new Error(
        `${slug}: authored button requires a reusable typed block.`,
      );
    }
    if (tag === "a" && !attr(node, "href") && attr(node, "id")) {
      blocks.push(
        makeBlock(
          "normal",
          [],
          uniqueAnchor(attr(node, "id")),
          blocks.length,
          [],
        ),
      );
      for (const child of node.childNodes ?? []) pushNode(child);
      return;
    }
    if (tag === "hr") {
      blocks.push(
        makeBlock(
          "normal",
          [{ _type: "span", text: "────────" }],
          null,
          blocks.length,
          [],
        ),
      );
      return;
    }
    if (isScenario(node)) {
      blocks.push(
        scenarioBlock(
          node,
          slug,
          scenarioIndex.value,
          structured.scenarios[scenarioIndex.value],
        ),
      );
      scenarioIndex.value += 1;
      return;
    }
    if (tag === "table") {
      const rows = [];
      const collectRows = (current) => {
        if (current.tagName === "tr") {
          rows.push(
            (current.childNodes ?? [])
              .filter((cell) => cell.tagName === "td" || cell.tagName === "th")
              .map((cell) => text(cell).replace(/\s+/gu, " ").trim()),
          );
          return;
        }
        for (const child of current.childNodes ?? []) collectRows(child);
      };
      collectRows(node);
      if (
        rows[0]?.map((cell) => cell.toLowerCase()).join("|") ===
        "risk|severity|mitigation"
      ) {
        const risks = structured.riskTables[riskIndex.value++];
        if (
          !Array.isArray(risks) ||
          risks.some(
            (risk) =>
              !risk ||
              typeof risk.name !== "string" ||
              !["critical", "warning", "info", "ok"].includes(risk.severity) ||
              typeof risk.mitigation !== "string",
          )
        )
          throw new Error(
            `${slug}: RiskTable source data is missing or malformed.`,
          );
        const severityOrder = { critical: 0, warning: 1, info: 2, ok: 3 };
        const expectedRows = [...risks]
          .sort(
            (left, right) =>
              severityOrder[left.severity] - severityOrder[right.severity],
          )
          .map((risk) => [risk.name, risk.severity, risk.mitigation]);
        if (JSON.stringify(rows.slice(1)) !== JSON.stringify(expectedRows))
          throw new Error(
            `${slug}: rendered RiskTable differs from its authored data.`,
          );
        blocks.push({
          _type: "risk_table",
          _version: 1,
          _key: stableKey("risk-table", blocks.length),
          risks: JSON.stringify(risks),
        });
        return;
      }
      blocks.push(tableBlock(node, blocks.length));
      return;
    }
    if (tag === "div" && attr(node, "data-slot") === "accordion") {
      const ids = [];
      const collectIds = (current) => {
        const id = attr(current, "id");
        if (id && /^adr-[0-9]{4}$/u.test(id)) ids.push(id.slice(4));
        for (const child of current.childNodes ?? []) collectIds(child);
      };
      collectIds(node);
      if (ids.length) {
        const authored = structured.decisionGroups[decisionIndex.value++];
        if (!authored || JSON.stringify(ids) !== JSON.stringify(authored))
          throw new Error(
            `${slug}: rendered DecisionCards IDs differ from their authored values.`,
          );
        ids.forEach((id) =>
          blocks.push(
            makeBlock(
              "normal",
              [],
              uniqueAnchor(`adr-${id}`),
              blocks.length,
              [],
            ),
          ),
        );
        blocks.push({
          _type: "decision_cards",
          _version: 1,
          _key: stableKey("decision-cards", blocks.length),
          records: JSON.stringify(authored),
        });
        return;
      }
    }
    if (tag === "pre") {
      const code = (node.childNodes ?? []).find(
        (child) => child.tagName === "code",
      );
      if (!code)
        throw new Error(`${slug}: preformatted block has no code child.`);
      const languageClass = (attr(code, "class") ?? "").match(
        /(?:^|\s)language-([\w+-]+)/u,
      )?.[1];
      blocks.push({
        _type: "code",
        _key: stableKey("code", blocks.length),
        code: text(code),
        ...(languageClass ? { language: languageClass } : {}),
      });
      return;
    }
    if (tag === "ul" || tag === "ol") {
      const listItem = tag === "ul" ? "bullet" : "number";
      const items = (node.childNodes ?? []).filter(
        (child) => child.tagName === "li",
      );
      if (!items.length)
        throw new Error(`${slug}: empty list cannot be migrated.`);
      for (const item of items) {
        const markDefs = [];
        const children = inlineNodes(item.childNodes ?? [], [], markDefs, {
          value: 0,
        });
        const block = makeBlock(
          "normal",
          children,
          uniqueAnchor(attr(item, "id")),
          blocks.length,
          markDefs,
        );
        block.listItem = listItem;
        block.level = 1;
        blocks.push(block);
      }
      return;
    }
    const style = BLOCK_TAGS.get(tag);
    if (style) {
      const markDefs = [];
      const children = inlineNodes(node.childNodes ?? [], [], markDefs, {
        value: 0,
      });
      blocks.push(
        makeBlock(
          style,
          children,
          uniqueAnchor(attr(node, "id")),
          blocks.length,
          markDefs,
        ),
      );
      return;
    }
    if (
      [
        "div",
        "section",
        "article",
        "main",
        "header",
        "footer",
        "aside",
        "details",
        "summary",
        "figure",
        "figcaption",
        "span",
        "astro-island",
      ].includes(tag)
    ) {
      if (attr(node, "id"))
        blocks.push(
          makeBlock(
            "normal",
            [],
            uniqueAnchor(attr(node, "id")),
            blocks.length,
            [],
          ),
        );
      for (const child of node.childNodes ?? []) pushNode(child);
      return;
    }
    throw new Error(`${slug}: unsupported rendered element <${tag}>.`);
  };
  for (const node of fragment.childNodes ?? []) pushNode(node);
  const unusedMedia = [...mediaByKey.keys()].filter(
    (key) => !usedMediaKeys.has(key),
  );
  if (unusedMedia.length)
    throw new Error(
      `${slug}: source media not found in rendered content: ${unusedMedia.join(", ")}.`,
    );
  if (
    scenarioIndex.value !== structured.scenarios.length ||
    decisionIndex.value !== structured.decisionGroups.length ||
    riskIndex.value !== structured.riskTables.length ||
    flowchartIndex.value !== structured.flowcharts.length
  )
    throw new Error(
      `${slug}: authored typed MDX blocks were absent from the rendered page.`,
    );
  if (!blocks.length)
    throw new Error(`${slug}: rendered page has no convertible content.`);
  return blocks;
}

export function serializeTransferMediaPlaceholders(entries, mediaManifest) {
  const mediaByKey = new Map(mediaManifest.map((row) => [row.key, row]));
  if (mediaByKey.size !== mediaManifest.length)
    throw new Error("Media manifest contains duplicate stable keys.");
  const used = new Set();
  const content = entries.map((entry) => ({
    ...entry,
    data: {
      ...entry.data,
      blocks: entry.data.blocks.map((block) => {
        if (block._type !== "image") return block;
        const key = block.asset?._ref;
        const media = mediaByKey.get(key);
        if (!media || media.slug !== entry.slug)
          throw new Error(
            `${entry.slug}: image reference has no exact source manifest row.`,
          );
        used.add(key);
        const stableBlock = { ...block };
        delete stableBlock.asset;
        return {
          ...stableBlock,
          asset: {
            $media: {
              url: media.sourceUrl,
              alt: block.alt,
              filename: `${media.slug}-${media.filename}`,
            },
          },
        };
      }),
    },
  }));
  if (used.size !== mediaByKey.size)
    throw new Error("Media manifest contains unused or unmapped assets.");
  return content;
}
