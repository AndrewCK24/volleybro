import { parseFragment, serializeOuter } from "parse5";
import { createHash } from "node:crypto";

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
  const normalized = name.toLowerCase().replaceAll("-", "");
  return node.attrs?.find(
    (item) => item.name.toLowerCase().replaceAll("-", "") === normalized,
  )?.value;
}

function text(node) {
  if (node.nodeName === "#text") return node.value;
  return (node.childNodes ?? []).map(text).join("");
}

function hasOnlyElementsAndWhitespace(node) {
  return (node.childNodes ?? []).every(
    (child) =>
      Boolean(child.tagName) ||
      (child.nodeName === "#text" && !child.value.trim()),
  );
}

function renderedTldrBody(node) {
  if (node.tagName !== "div") return null;
  const wrapperClasses = new Set((attr(node, "class") ?? "").split(/\s+/u));
  if (!wrapperClasses.has("border-l-4") || !wrapperClasses.has("rounded-r-md"))
    return null;
  if (!hasOnlyElementsAndWhitespace(node)) return null;
  const children = (node.childNodes ?? []).filter((child) => child.tagName);
  if (children.length !== 2) return null;
  const [label, body] = children;
  if (
    label.tagName !== "span" ||
    text(label).trim() !== "TL;DR" ||
    body.tagName !== "div"
  )
    return null;
  return body;
}

function preformattedNodeText(node) {
  if (node.nodeName === "#text") return node.value;
  if (node.tagName === "br") return "\n";
  return (node.childNodes ?? []).map(preformattedNodeText).join("");
}

function preformattedText(node) {
  const children = node.childNodes ?? [];
  const rows = children.filter(
    (child) =>
      child.tagName === "span" &&
      (attr(child, "class") ?? "").split(/\s+/u).includes("block"),
  );
  if (
    rows.length &&
    children.every(
      (child) =>
        rows.includes(child) ||
        (child.nodeName === "#text" && !child.value.trim()),
    )
  )
    return rows
      .map((row) => {
        const cells = row.childNodes ?? [];
        return cells
          .map(preformattedNodeText)
          .join(
            cells.filter((cell) => cell.tagName === "span").length > 1
              ? "  "
              : "",
          );
      })
      .join("\n");
  return preformattedNodeText(node);
}

function stableKey(prefix, index) {
  return `${prefix}-${index + 1}`;
}

function stableMediaAsset(key) {
  return {
    _type: "reference",
    _ref: key,
    url: `/_emdash/api/media/file/${key}`,
  };
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
  const anchors = [];
  const images = [];
  let hasHeaderRow = false;
  const collectRows = (current) => {
    if (current.tagName === "tr") {
      const cells = (current.childNodes ?? []).filter(
        (cell) => cell.tagName === "td" || cell.tagName === "th",
      );
      if (rows.length === 0)
        hasHeaderRow =
          cells.length > 0 && cells.every((cell) => cell.tagName === "th");
      rows.push(
        cells.map((cell) => {
          const markDefs = [];
          const replaceImages = (current) => {
            if (current.tagName === "img") {
              images.push(current);
              return { nodeName: "#text", value: attr(current, "alt") ?? "" };
            }
            return {
              ...current,
              childNodes: (current.childNodes ?? []).map(replaceImages),
            };
          };
          const content = inlineNodes(
            (cell.childNodes ?? []).map(replaceImages),
            [],
            markDefs,
            { value: 0 },
          );
          const collectAnchors = (current) => {
            const id = attr(current, "id");
            if (id) anchors.push(id);
            for (const child of current.childNodes ?? []) collectAnchors(child);
          };
          collectAnchors(cell);
          return { text: text(cell).trim(), content, markDefs };
        }),
      );
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
    block: {
      _type: "table",
      _key: stableKey("table", index),
      rows: rows.map((cells, rowIndex) => ({
        _type: "tableRow",
        _key: stableKey(`table-row-${index + 1}`, rowIndex),
        cells: cells.map(
          ({ text: cellText, content, markDefs }, cellIndex) => ({
            _type: "tableCell",
            _key: stableKey(
              `table-cell-${index + 1}-${rowIndex + 1}`,
              cellIndex,
            ),
            content: content.length
              ? content
              : [{ _type: "span", text: cellText }],
            ...(markDefs.length ? { markDefs } : {}),
            ...(rowIndex === 0 && hasHeaderRow ? { isHeader: true } : {}),
          }),
        ),
      })),
      hasHeaderRow,
    },
    anchors,
    images,
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
      renderedInlineText(String(source?.[field] ?? ""))
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

function renderedInlineText(value) {
  const parts = [];
  const syntax = /`([^`]+)`|\*\*/gu;
  let offset = 0;
  for (const match of value.matchAll(syntax)) {
    const index = match.index ?? 0;
    if (index > offset)
      parts.push({ type: "text", value: value.slice(offset, index) });
    parts.push(
      match[1] === undefined
        ? { type: "strong-marker", value: "**" }
        : { type: "code", value: match[1] },
    );
    offset = index + match[0].length;
  }
  if (offset < value.length)
    parts.push({ type: "text", value: value.slice(offset) });

  const pairedMarkers = new Set();
  let openMarker;
  parts.forEach((part, index) => {
    if (part.type !== "strong-marker") return;
    if (openMarker === undefined) openMarker = index;
    else {
      pairedMarkers.add(openMarker);
      pairedMarkers.add(index);
      openMarker = undefined;
    }
  });
  return parts
    .map((part, index) =>
      part.type === "strong-marker"
        ? pairedMarkers.has(index)
          ? ""
          : part.value
        : part.value,
    )
    .join("");
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
      const href =
        match[2].startsWith("<") && match[2].endsWith(">")
          ? match[2].slice(1, -1)
          : match[2];
      markDefs.push({ _key: key, _type: "link", href });
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
    const start = index;
    const quote = source[index++];
    let value = "";
    while (index < source.length) {
      if (source[index] === quote) {
        index += 1;
        return quote === '"' ? JSON.parse(source.slice(start, index)) : value;
      }
      if (source[index] === "\\") {
        const escaped = source[index + 1];
        if (escaped === undefined)
          throw new Error(`${slug}: incomplete string escape in MDX data.`);
        value += { n: "\n", r: "\r", t: "\t" }[escaped] ?? escaped;
        index += 1;
      } else value += source[index];
      index += 1;
    }
    throw new Error(`${slug}: unterminated MDX string.`);
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

function expressionForProp(tag, prop, slug, sourceText = tag) {
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
    else if (char === "}" && --depth === 0) {
      const expression = tag.slice(start, index).trim();
      const identifier = /^[$A-Z_a-z][$\w]*$/u.exec(expression)?.[0];
      if (!identifier) return parseJsLiteral(expression, slug);
      const declaration = new RegExp(
        `\\b(?:const|let)\\s+${identifier}\\s*(?::\\s*[^=]+)?=\\s*`,
        "u",
      ).exec(sourceText);
      if (!declaration)
        throw new Error(
          `${slug}: ${prop} references unbound static value ${identifier}.`,
        );
      const valueStart = declaration.index + declaration[0].length;
      let valueDepth = 0;
      let valueQuote = "";
      let valueEscaped = false;
      for (
        let valueEnd = valueStart;
        valueEnd < sourceText.length;
        valueEnd += 1
      ) {
        const valueChar = sourceText[valueEnd];
        if (valueQuote) {
          if (valueEscaped) valueEscaped = false;
          else if (valueChar === "\\") valueEscaped = true;
          else if (valueChar === valueQuote) valueQuote = "";
          continue;
        }
        if (valueChar === "'" || valueChar === '"') valueQuote = valueChar;
        else if (valueChar === "[" || valueChar === "{") valueDepth += 1;
        else if (valueChar === "]" || valueChar === "}") {
          valueDepth -= 1;
          if (valueDepth === 0)
            return parseJsLiteral(
              sourceText.slice(valueStart, valueEnd + 1),
              slug,
            );
        }
      }
      throw new Error(`${slug}: static value ${identifier} is incomplete.`);
    }
  }
  throw new Error(`${slug}: unterminated ${prop} expression.`);
}

export function extractMdxStructuredData(
  proposal,
  slug,
  extraFlowchartSource = "",
) {
  const scenarios = [];
  const scenarioMarkers = /export\s+const\s+scenarios\s*=\s*/gu;
  for (const scenarioMarker of proposal.matchAll(scenarioMarkers)) {
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
    const parsed = parseJsLiteral(proposal.slice(start, end), slug);
    if (!Array.isArray(parsed))
      throw new Error(`${slug}: scenario source must be an array.`);
    scenarios.push(...parsed);
  }
  const directScenarios = [
    ...proposal.matchAll(/^[\t ]*<Scenario\b[\s\S]*?\/>/gmu),
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
  const flowchartTags = [
    ...tags.filter((tag) => tag.type === "InteractiveFlowchart"),
    ...[
      ...extraFlowchartSource.matchAll(/<InteractiveFlowchart\b[\s\S]*?\/>/gsu),
    ].map((match) => ({ type: "InteractiveFlowchart", source: match[0] })),
  ];
  const sourceText = `${proposal}\n${extraFlowchartSource}`;
  const flowcharts = flowchartTags.map((tag) => ({
    nodes: expressionForProp(tag.source, "nodes", slug, sourceText),
    edges: expressionForProp(tag.source, "edges", slug, sourceText),
    details: expressionForProp(tag.source, "details", slug, sourceText),
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
        rows: rows.map((cells, rowIndex) => ({
          _type: "tableRow",
          _key: stableKey(`table-row-${blocks.length + 1}`, rowIndex),
          cells: cells.map((cell, cellIndex) => {
            const markDefs = [];
            const content = markdownInline(cell, markDefs);
            return {
              _type: "tableCell",
              _key: stableKey(
                `table-cell-${blocks.length + 1}-${rowIndex + 1}`,
                cellIndex,
              ),
              content,
              ...(markDefs.length ? { markDefs } : {}),
              ...(rowIndex === 0 ? { isHeader: true } : {}),
            };
          }),
        })),
        hasHeaderRow: true,
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

function canonicalSvgDiagramBlock(svg, index, slug, source) {
  const descendants = [];
  const visit = (node) => {
    descendants.push(node);
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(svg);
  const sourceTitle = text(
    descendants.find((node) => node.tagName === "title") ?? { childNodes: [] },
  ).trim();
  const sourceDescription = text(
    descendants.find((node) => node.tagName === "desc") ?? { childNodes: [] },
  ).trim();
  const ariaLabel = attr(svg, "aria-label")?.trim();
  const title = sourceTitle || ariaLabel || "";
  const description =
    sourceDescription ||
    (sourceTitle && ariaLabel && ariaLabel !== sourceTitle ? ariaLabel : "");
  if (source) {
    const renderedText = descendants
      .filter((node) => ["text", "title", "desc"].includes(node.tagName))
      .map((node) => text(node).replace(/\s+/gu, " ").trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/gu, "");
    const authoredLabels = [
      ...source.nodes.flatMap((node) =>
        [node.label, node.sublabel].filter(Boolean),
      ),
      ...source.edges.map((edge) => edge.label).filter(Boolean),
    ];
    const missing = authoredLabels.filter(
      (label) => !renderedText.includes(String(label).replace(/\s+/gu, "")),
    );
    if (missing.length)
      throw new Error(
        `${slug}: rendered SVG labels differ from authored flowchart data (${JSON.stringify(missing)}).`,
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
  const interactionControls = descendants.filter(
    (node) =>
      attr(node, "tabindex") !== undefined ||
      attr(node, "aria-pressed") !== undefined,
  );
  if (interactionControls.length)
    throw new Error(
      `${slug}: SVG contains interactive controls without a canonical diagram interaction contract.`,
    );

  const number = (node, name, { positive = false } = {}) => {
    const raw = attr(node, name);
    const value = raw === undefined ? undefined : Number(raw);
    if (
      value !== undefined &&
      (!Number.isFinite(value) || (positive && value <= 0))
    )
      throw new Error(
        `${slug}: SVG ${node.tagName} has invalid ${name}=${raw}.`,
      );
    return value;
  };
  const paintTokens = new Map([
    ["var(--background)", "background"],
    ["var(--muted)", "mutedBackground"],
    ["var(--primary-foreground)", "primaryForeground"],
    ["var(--foreground)", "foreground"],
    ["var(--muted-foreground)", "muted"],
    ["var(--primary)", "primary"],
    ["var(--border)", "border"],
    ["var(--card)", "card"],
    ["var(--success)", "success"],
    ["var(--warning)", "warning"],
    ["var(--destructive)", "destructive"],
    ["var(--chart-1)", "chart1"],
    ["var(--chart-3)", "chart3"],
    ["var(--chart-5)", "chart5"],
    [
      "color-mix(in oklch, var(--warning) 65%, var(--foreground))",
      "warningMuted",
    ],
    [
      "color-mix(in oklch, var(--destructive) 65%, var(--foreground))",
      "destructiveMuted",
    ],
    ["color-mix(in srgb,var(--primary) 8%,var(--card))", "primaryWash"],
    ["color-mix(in srgb,var(--foreground) 3%,var(--card))", "foregroundCard3"],
    [
      "color-mix(in srgb,var(--foreground) 30%,transparent)",
      "foregroundTransparent30",
    ],
    [
      "color-mix(in srgb,var(--foreground) 2%,transparent)",
      "foregroundTransparent2",
    ],
    [
      "color-mix(in srgb,var(--foreground) 2%,var(--background))",
      "foregroundBackground2",
    ],
  ]);
  const paint = (raw) => {
    if (raw === undefined) return undefined;
    if (paintTokens.has(raw)) return paintTokens.get(raw);
    if (
      ["none", "currentColor"].includes(raw) ||
      /^#[\da-f]{3}(?:[\da-f]{3})?$/iu.test(raw)
    )
      return raw;
    throw new Error(`${slug}: SVG paint ${raw} has no canonical paint token.`);
  };
  const viewBox = (attr(svg, "viewbox") ?? "")
    .trim()
    .split(/[\s,]+/u)
    .map(Number);
  if (
    viewBox.length !== 4 ||
    viewBox.some((value) => !Number.isFinite(value)) ||
    viewBox[2] <= 0 ||
    viewBox[3] <= 0
  )
    throw new Error(`${slug}: SVG requires a valid four-number viewBox.`);
  const markerNodes = descendants.filter((node) => node.tagName === "marker");
  const markerIds = new Set(
    markerNodes.map((node) => attr(node, "id")).filter(Boolean),
  );
  const presentationRules = new Map();
  const parsePresentationDeclarations = (source) => {
    const result = {};
    for (const part of source.split(";")) {
      if (!part.trim()) continue;
      const separator = part.indexOf(":");
      if (separator < 1)
        throw new Error(`${slug}: SVG presentation declaration is malformed.`);
      const property = part.slice(0, separator).trim().toLowerCase();
      const raw = part.slice(separator + 1).trim();
      if (property === "fill" || property === "stroke")
        result[property] = paint(raw);
      else if (property === "letter-spacing")
        result.letterSpacing = Number(raw);
      else if (property === "stroke-width") result.strokeWidth = Number(raw);
      else if (property === "stroke-dasharray")
        result.strokeDasharray =
          raw === "none" ? undefined : raw.split(/[\s,]+/u).map(Number);
      else if (property === "stroke-linecap") result.strokeLinecap = raw;
      else if (property === "stroke-linejoin") result.strokeLinejoin = raw;
      else if (property === "font-family")
        result.fontFamily = /mono/u.test(raw)
          ? "mono"
          : /serif/u.test(raw) && !/sans/u.test(raw)
            ? "serif"
            : "sans";
      else if (
        [
          "font-size",
          "font-weight",
          "fill-opacity",
          "stroke-opacity",
          "opacity",
        ].includes(property)
      ) {
        const key = {
          "font-size": "fontSize",
          "font-weight": "fontWeight",
          "fill-opacity": "fillOpacity",
          "stroke-opacity": "strokeOpacity",
          opacity: "opacity",
        }[property];
        const numeric = Number(raw);
        result[key] =
          property === "font-weight" && !Number.isFinite(numeric)
            ? raw
            : numeric;
      } else
        throw new Error(
          `${slug}: SVG CSS property ${property} has no canonical diagram field.`,
        );
    }
    return result;
  };
  for (const styleNode of descendants.filter(
    (node) => node.tagName === "style",
  )) {
    const css = text(styleNode);
    const rule = /\.([A-Za-z_][\w-]*)\s*\{([^{}]*)\}/gu;
    let match;
    while ((match = rule.exec(css))) {
      presentationRules.set(match[1], parsePresentationDeclarations(match[2]));
    }
    rule.lastIndex = 0;
    if (css.replace(rule, "").trim())
      throw new Error(
        `${slug}: SVG CSS contains a selector or construct outside the supported class-rule subset.`,
      );
  }
  const pathCommands = (raw) => {
    const tokens =
      raw.match(/[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/gu) ??
      [];
    const arity = {
      M: 2,
      L: 2,
      H: 1,
      V: 1,
      C: 6,
      S: 4,
      Q: 4,
      T: 2,
      A: 7,
      Z: 0,
    };
    const commands = [];
    let op;
    for (let i = 0; i < tokens.length;) {
      if (/^[A-Za-z]$/u.test(tokens[i])) op = tokens[i++];
      if (!op || !(op.toUpperCase() in arity))
        throw new Error(`${slug}: SVG path contains unsupported command.`);
      const count = arity[op.toUpperCase()];
      if (count === 0) {
        commands.push({ op, values: [] });
        op = undefined;
        continue;
      }
      if (
        i + count > tokens.length ||
        /^[A-Za-z]$/u.test(tokens[i + count - 1])
      )
        throw new Error(`${slug}: SVG path command is incomplete.`);
      const values = tokens.slice(i, i + count).map(Number);
      if (values.some((value) => !Number.isFinite(value)))
        throw new Error(`${slug}: SVG path has a non-number coordinate.`);
      commands.push({ op, values });
      i += count;
      if (op === "M") op = "L";
      else if (op === "m") op = "l";
    }
    if (!commands.length) throw new Error(`${slug}: SVG path is empty.`);
    return commands;
  };
  const transforms = (raw) => {
    if (!raw) return undefined;
    const result = [];
    const regex = /([A-Za-z]+)\(([^)]*)\)/gu;
    let match;
    while ((match = regex.exec(raw))) {
      const values = match[2]
        .trim()
        .split(/[\s,]+/u)
        .map(Number);
      if (values.some((value) => !Number.isFinite(value)))
        throw new Error(`${slug}: SVG transform has invalid coordinates.`);
      const name = match[1];
      if (name === "translate" && [1, 2].includes(values.length))
        result.push({ type: name, x: values[0], y: values[1] ?? 0 });
      else if (name === "scale" && [1, 2].includes(values.length))
        result.push({ type: name, x: values[0], y: values[1] ?? values[0] });
      else if (name === "rotate" && [1, 3].includes(values.length))
        result.push({
          type: name,
          angle: values[0],
          ...(values.length === 3 ? { cx: values[1], cy: values[2] } : {}),
        });
      else if (name === "matrix" && values.length === 6)
        result.push({ type: name, values });
      else if (["skewX", "skewY"].includes(name) && values.length === 1)
        result.push({ type: name, angle: values[0] });
      else throw new Error(`${slug}: SVG transform ${name} is not supported.`);
    }
    if (!result.length || raw.replace(regex, "").trim())
      throw new Error(`${slug}: SVG transform is malformed.`);
    return result;
  };
  const markerReference = (node, name) => {
    const value = attr(node, name);
    if (value === undefined) return undefined;
    const match = /^url\(#([^)]+)\)$/u.exec(value);
    if (!match || !markerIds.has(match[1]))
      throw new Error(`${slug}: SVG ${name} references an unknown marker.`);
    return match[1];
  };
  const common = (node, inherited = {}) => {
    const value = {};
    const fields = [
      ["id", "id"],
      ["fill", "fill", paint],
      ["stroke", "stroke", paint],
      ["strokewidth", "strokeWidth", (raw) => Number(raw)],
      ["opacity", "opacity", (raw) => Number(raw)],
      ["fillopacity", "fillOpacity", (raw) => Number(raw)],
      ["strokeopacity", "strokeOpacity", (raw) => Number(raw)],
      [
        "strokedasharray",
        "strokeDasharray",
        (raw) =>
          raw
            .trim()
            .split(/[\s,]+/u)
            .map(Number),
      ],
      ["strokelinecap", "strokeLinecap"],
      ["strokelinejoin", "strokeLinejoin"],
    ];
    for (const [from, to, convert] of fields) {
      const raw = attr(node, from);
      if (raw !== undefined) value[to] = convert ? convert(raw) : raw;
    }
    const markerStart = markerReference(node, "markerstart");
    const markerEnd = markerReference(node, "markerend");
    if (markerStart) value.markerStart = markerStart;
    if (markerEnd) value.markerEnd = markerEnd;
    const classes = (attr(node, "class") ?? "").split(/\s+/u).filter(Boolean);
    const classStyle = Object.assign(
      {},
      ...classes.map((className) => presentationRules.get(className) ?? {}),
    );
    const inlineStyle = attr(node, "style");
    const inline = inlineStyle
      ? parsePresentationDeclarations(inlineStyle)
      : {};
    return { ...inherited, ...value, ...classStyle, ...inline };
  };
  const numberList = (raw) => {
    const values = raw
      .trim()
      .split(/[\s,]+/u)
      .map(Number);
    if (
      values.length < 4 ||
      values.length % 2 ||
      values.some((value) => !Number.isFinite(value))
    )
      throw new Error(`${slug}: SVG point list is invalid.`);
    return Array.from({ length: values.length / 2 }, (_, index) => [
      values[index * 2],
      values[index * 2 + 1],
    ]);
  };
  const convert = (node, inherited = {}) => {
    if (["defs", "title", "desc", "style"].includes(node.tagName)) return null;
    if (node.tagName === "g") {
      const properties = common(node, inherited);
      const children = (node.childNodes ?? [])
        .map((child) => convert(child, properties))
        .filter(Boolean);
      const groupProperties = Object.fromEntries(
        Object.entries(properties).filter(
          ([key]) =>
            ![
              "fontFamily",
              "fontSize",
              "fontWeight",
              "textAnchor",
              "dominantBaseline",
            ].includes(key),
        ),
      );
      return children.length
        ? {
            type: "group",
            ...groupProperties,
            ...(transforms(attr(node, "transform"))
              ? { transform: transforms(attr(node, "transform")) }
              : {}),
            children,
          }
        : null;
    }
    const base = common(node, inherited);
    for (const key of [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "textAnchor",
      "dominantBaseline",
    ])
      delete base[key];
    if (node.tagName === "rect")
      return {
        type: "rect",
        ...base,
        x: number(node, "x") ?? 0,
        y: number(node, "y") ?? 0,
        width: number(node, "width", { positive: true }),
        height: number(node, "height", { positive: true }),
        ...(number(node, "rx") === undefined ? {} : { rx: number(node, "rx") }),
        ...(number(node, "ry") === undefined ? {} : { ry: number(node, "ry") }),
      };
    if (node.tagName === "circle")
      return {
        type: "circle",
        ...base,
        cx: number(node, "cx"),
        cy: number(node, "cy"),
        r: number(node, "r", { positive: true }),
      };
    if (node.tagName === "ellipse")
      return {
        type: "ellipse",
        ...base,
        cx: number(node, "cx"),
        cy: number(node, "cy"),
        rx: number(node, "rx", { positive: true }),
        ry: number(node, "ry", { positive: true }),
      };
    if (node.tagName === "line")
      return {
        type: "line",
        ...base,
        x1: number(node, "x1"),
        y1: number(node, "y1"),
        x2: number(node, "x2"),
        y2: number(node, "y2"),
      };
    if (node.tagName === "path")
      return {
        type: "path",
        ...base,
        commands: pathCommands(attr(node, "d") ?? ""),
      };
    if (["polyline", "polygon"].includes(node.tagName))
      return {
        type: node.tagName,
        ...base,
        points: numberList(attr(node, "points") ?? ""),
      };
    if (node.tagName === "text") {
      const textStyle = (sourceNode) => {
        const rawFamily =
          attr(sourceNode, "fontfamily") ?? attr(node, "fontfamily") ?? "sans";
        const fontFamily = /mono/u.test(rawFamily)
          ? "mono"
          : /serif/u.test(rawFamily) && !/sans/u.test(rawFamily)
            ? "serif"
            : "sans";
        const rawWeight =
          attr(sourceNode, "fontweight") ?? attr(node, "fontweight");
        const fontWeight =
          rawWeight === undefined
            ? undefined
            : /^\d{3}$/u.test(rawWeight)
              ? Number(rawWeight)
              : rawWeight;
        const style = common(sourceNode, common(node, inherited));
        const letterSpacing =
          number(sourceNode, "letterspacing") ??
          number(node, "letterspacing") ??
          style.letterSpacing;
        const fontSize =
          number(sourceNode, "fontsize") ??
          number(node, "fontsize") ??
          style.fontSize;
        return {
          ...(attr(sourceNode, "id") ? { id: attr(sourceNode, "id") } : {}),
          ...["fill", "stroke", "strokeWidth", "opacity"].reduce(
            (fields, key) => {
              if (style[key] !== undefined) fields[key] = style[key];
              return fields;
            },
            {},
          ),
          fontFamily: style.fontFamily ?? fontFamily,
          ...(fontWeight === undefined && style.fontWeight === undefined
            ? {}
            : { fontWeight: fontWeight ?? style.fontWeight }),
          ...(letterSpacing === undefined ? {} : { letterSpacing }),
          ...((attr(sourceNode, "textanchor") ?? attr(node, "textanchor"))
            ? {
                textAnchor:
                  attr(sourceNode, "textanchor") ?? attr(node, "textanchor"),
              }
            : {}),
          ...((attr(sourceNode, "dominantbaseline") ??
          attr(node, "dominantbaseline"))
            ? {
                dominantBaseline:
                  attr(sourceNode, "dominantbaseline") ??
                  attr(node, "dominantbaseline"),
              }
            : {}),
          ...(fontSize === undefined ? {} : { fontSize }),
        };
      };
      const textRuns = (node.childNodes ?? []).filter(
        (child) => child.tagName === "tspan" || child.nodeName === "#text",
      );
      const tspanChildren = textRuns.filter(
        (child) => child.tagName === "tspan",
      );
      if (tspanChildren.length) {
        const runs = textRuns
          .map((child) => {
            const value =
              child.nodeName === "#text" ? child.value : text(child);
            if (!value.trim()) return null;
            const sourceNode = child.tagName === "tspan" ? child : node;
            return {
              ...(attr(sourceNode, "id") ? { id: attr(sourceNode, "id") } : {}),
              text: value,
              ...(child.tagName === "tspan" &&
              number(sourceNode, "x") !== undefined
                ? { x: number(sourceNode, "x") }
                : {}),
              ...(child.tagName === "tspan" &&
              number(sourceNode, "y") !== undefined
                ? { y: number(sourceNode, "y") }
                : {}),
              ...textStyle(sourceNode),
            };
          })
          .filter(Boolean);
        return {
          type: "text",
          ...base,
          x: number(node, "x") ?? 0,
          y: number(node, "y") ?? 0,
          text: text(node),
          runs,
          ...(number(node, "fontsize") === undefined
            ? {}
            : { fontSize: number(node, "fontsize") }),
          ...(attr(node, "letterspacing") === undefined
            ? {}
            : { letterSpacing: number(node, "letterspacing") }),
          ...(attr(node, "textanchor")
            ? { textAnchor: attr(node, "textanchor") }
            : {}),
          ...(attr(node, "dominantbaseline")
            ? { dominantBaseline: attr(node, "dominantbaseline") }
            : {}),
        };
      }
      const rawFontFamily = attr(node, "fontfamily") ?? "sans";
      const fontFamily = /mono/u.test(rawFontFamily)
        ? "mono"
        : /serif/u.test(rawFontFamily) && !/sans/u.test(rawFontFamily)
          ? "serif"
          : "sans";
      const fontWeightRaw = attr(node, "fontweight");
      const fontWeight =
        fontWeightRaw === undefined
          ? undefined
          : /^\d{3}$/u.test(fontWeightRaw)
            ? Number(fontWeightRaw)
            : fontWeightRaw;
      return {
        type: "text",
        ...base,
        x: number(node, "x"),
        y: number(node, "y"),
        text: text(node),
        ...(number(node, "fontsize") === undefined
          ? {}
          : { fontSize: number(node, "fontsize") }),
        fontFamily,
        ...(fontWeight === undefined ? {} : { fontWeight }),
        ...(attr(node, "textanchor")
          ? { textAnchor: attr(node, "textanchor") }
          : {}),
        ...(attr(node, "dominantbaseline")
          ? { dominantBaseline: attr(node, "dominantbaseline") }
          : {}),
      };
    }
    throw new Error(
      `${slug}: unsupported visible SVG primitive <${node.tagName}>.`,
    );
  };
  const elements = (svg.childNodes ?? []).map(convert).filter(Boolean);
  if (!elements.length)
    throw new Error(`${slug}: SVG has no canonical diagram elements.`);
  const markers = markerNodes.map((marker) => {
    const id = attr(marker, "id");
    if (!id) throw new Error(`${slug}: SVG marker is missing its source ID.`);
    const width = number(marker, "markerwidth", { positive: true });
    const height = number(marker, "markerheight", { positive: true });
    const viewBox = (attr(marker, "viewbox") ?? `0 0 ${width} ${height}`)
      .trim()
      .split(/[\s,]+/u)
      .map(Number);
    if (
      viewBox.length !== 4 ||
      viewBox.some((value) => !Number.isFinite(value)) ||
      viewBox[2] <= 0 ||
      viewBox[3] <= 0
    )
      throw new Error(`${slug}: SVG marker ${id} has an invalid viewBox.`);
    const shapes = (marker.childNodes ?? []).filter(
      (child) => child.tagName === "path" || child.tagName === "polygon",
    );
    if (shapes.length !== 1)
      throw new Error(
        `${slug}: SVG marker ${id} must contain exactly one supported path or polygon.`,
      );
    const shape = shapes[0];
    const style = common(shape);
    const path =
      shape.tagName === "path"
        ? pathCommands(attr(shape, "d") ?? "")
        : (() => {
            const points = numberList(attr(shape, "points") ?? "");
            return [
              { op: "M", values: points[0] },
              ...points.slice(1).map((point) => ({ op: "L", values: point })),
              { op: "Z", values: [] },
            ];
          })();
    const rawOrient = attr(marker, "orient") ?? "0";
    const orient = ["auto", "auto-start-reverse"].includes(rawOrient)
      ? rawOrient
      : Number(rawOrient);
    if (typeof orient === "number" && !Number.isFinite(orient))
      throw new Error(
        `${slug}: SVG marker ${id} has invalid orient=${rawOrient}.`,
      );
    const units = attr(marker, "markerunits");
    if (
      units !== undefined &&
      !["strokeWidth", "userSpaceOnUse"].includes(units)
    )
      throw new Error(
        `${slug}: SVG marker ${id} has unsupported markerUnits=${units}.`,
      );
    return {
      id,
      viewBox: {
        x: viewBox[0],
        y: viewBox[1],
        width: viewBox[2],
        height: viewBox[3],
      },
      width,
      height,
      refX: number(marker, "refx"),
      refY: number(marker, "refy"),
      orient,
      ...(units ? { units } : {}),
      path,
      ...(style.fill === undefined ? {} : { fill: style.fill }),
      ...(style.stroke === undefined ? {} : { stroke: style.stroke }),
    };
  });
  const emittedIds = [];
  const collectIds = (element) => {
    if (element.id) emittedIds.push(element.id);
    for (const run of element.runs ?? []) if (run.id) emittedIds.push(run.id);
    for (const child of element.children ?? []) collectIds(child);
  };
  elements.forEach(collectIds);
  const anchors = descendants
    .map((node) => ({ node, id: attr(node, "id") }))
    .filter(({ id }) => id && !emittedIds.includes(id) && !markerIds.has(id))
    .map(({ node, id }) => ({
      id,
      ...(number(node, "x") === undefined ? {} : { x: number(node, "x") }),
      ...(number(node, "y") === undefined ? {} : { y: number(node, "y") }),
      ...(number(node, "cx") === undefined ? {} : { x: number(node, "cx") }),
      ...(number(node, "cy") === undefined ? {} : { y: number(node, "cy") }),
    }));
  const sourceIds = descendants.map((node) => attr(node, "id")).filter(Boolean);
  const representedIds = [
    ...emittedIds,
    ...markers.map(({ id }) => id),
    ...anchors.map(({ id }) => id),
  ].sort();
  if (JSON.stringify([...sourceIds].sort()) !== JSON.stringify(representedIds))
    throw new Error(
      `${slug}: SVG source id inventory is not completely represented.`,
    );
  const block = {
    _type: "diagram",
    _version: 1,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(attr(svg, "preserveaspectratio")
      ? {
          preserveAspectRatio: (() => {
            const [align, mode] = attr(svg, "preserveaspectratio")
              .trim()
              .split(/\s+/u);
            return align === "none"
              ? { align: "none" }
              : { align, ...(mode ? { mode } : {}) };
          })(),
        }
      : {}),
    viewBox: {
      x: viewBox[0],
      y: viewBox[1],
      width: viewBox[2],
      height: viewBox[3],
    },
    elements,
    ...(markers.length ? { markers } : {}),
    ...(anchors.length ? { anchors } : {}),
  };
  return block;
}

function svgMatchesFlowchartSource(svg, source) {
  const visibleText = [];
  const visit = (node) => {
    if (["text", "title", "desc"].includes(node.tagName))
      visibleText.push(text(node));
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(svg);
  const rendered = visibleText.join(" ").replace(/\s+/gu, "");
  const required = [
    ...source.nodes.flatMap((node) =>
      [node.label, node.sublabel].filter(Boolean),
    ),
    ...source.edges.map((edge) => edge.label).filter(Boolean),
  ];
  return required.every((label) =>
    rendered.includes(String(label).replace(/\s+/gu, "")),
  );
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
  graphMappings = [],
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
    const tldrBody = renderedTldrBody(node);
    if (tldrBody) {
      const bodyStart = blocks.length;
      for (const child of tldrBody.childNodes ?? []) pushNode(child);
      const bodyBlocks = blocks.splice(bodyStart);
      const nonNativeBlock = bodyBlocks.find(
        (block) => !["block", "image", "code", "table"].includes(block._type),
      );
      if (nonNativeBlock)
        throw new Error(
          `${slug}: TL;DR wrapper contains a non-native Portable Text block: ${nonNativeBlock._type}.`,
        );
      blocks.push({
        _type: "tldr",
        _version: 1,
        _key: stableKey("tldr", blocks.length),
        blocks: bodyBlocks,
      });
      return;
    }
    if (tag === "svg") {
      if (attr(node, "aria-hidden") === "true") return;
      const flowchart = structured.flowcharts[flowchartIndex.value];
      const isAuthoredFlowchart =
        flowchart && svgMatchesFlowchartSource(node, flowchart);
      const diagram = canonicalSvgDiagramBlock(
        node,
        blocks.length,
        slug,
        isAuthoredFlowchart ? flowchart : undefined,
      );
      const svgText = [];
      const svgNodes = [];
      const collectSvgText = (child) => {
        svgNodes.push(child);
        if (["title", "desc", "text"].includes(child.tagName)) {
          const value = text(child).replace(/\s+/gu, " ").trim();
          if (value) svgText.push(value);
        }
        for (const descendant of child.childNodes ?? [])
          collectSvgText(descendant);
      };
      collectSvgText(node);
      const sourceSvgIds = svgNodes
        .map((child) => attr(child, "id"))
        .filter(Boolean);
      const sourceTextCount = svgNodes.filter(
        (child) => child.tagName === "text",
      ).length;
      const canonicalTextCount =
        diagram._type === "diagram"
          ? (JSON.stringify(diagram.elements).match(/"type":"text"/gu)
              ?.length ?? 0)
          : JSON.parse(diagram.nodes).length;
      const canonicalSvgIds =
        diagram._type === "diagram"
          ? [
              ...diagram.elements.flatMap((element) => {
                const ids = [];
                const collect = (candidate) => {
                  if (candidate.id) ids.push(candidate.id);
                  for (const run of candidate.runs ?? [])
                    if (run.id) ids.push(run.id);
                  for (const child of candidate.children ?? []) collect(child);
                };
                collect(element);
                return ids;
              }),
              ...(diagram.markers ?? []).map(({ id }) => id),
              ...(diagram.anchors ?? []).map(({ id }) => id),
            ]
          : [
              ...JSON.parse(diagram.nodes).map(({ id }) => id),
              ...JSON.parse(diagram.edges).flatMap(({ from, to }) => [
                from,
                to,
              ]),
              ...Object.keys(JSON.parse(diagram.details)),
            ];
      const authoredFlowchartData =
        diagram._type === "interactive_flowchart"
          ? {
              nodes: JSON.parse(diagram.nodes),
              edges: JSON.parse(diagram.edges),
              details: JSON.parse(diagram.details),
            }
          : null;
      const authoredFlowchartDataPreserved = authoredFlowchartData
        ? JSON.stringify(authoredFlowchartData) === JSON.stringify(flowchart)
        : null;
      graphMappings.push({
        renderedSvgIndex: graphMappings.length + 1,
        ariaLabel: attr(node, "aria-label") ?? null,
        blockType: diagram._type,
        sourceSvgSha256: createHash("sha256")
          .update(serializeOuter(node))
          .digest("hex"),
        canonicalDataSha256: createHash("sha256")
          .update(JSON.stringify(diagram))
          .digest("hex"),
        canonicalElementCount:
          diagram._type === "diagram"
            ? (JSON.stringify(diagram.elements).match(
                /"type":"(?:rect|circle|ellipse|line|path|polyline|polygon|text|group)"/gu,
              )?.length ?? 0)
            : JSON.parse(diagram.nodes).length,
        sourceTextCount,
        canonicalTextCount,
        sourceSvgIds,
        canonicalSvgIds,
        svgIdsPreserved:
          diagram._type === "diagram"
            ? JSON.stringify([...sourceSvgIds].sort()) ===
              JSON.stringify([...canonicalSvgIds].sort())
            : null,
        authoredFlowchartDataPreserved,
        ...(authoredFlowchartData
          ? {
              sourceFlowchartDataSha256: createHash("sha256")
                .update(JSON.stringify(flowchart))
                .digest("hex"),
              canonicalFlowchartDataSha256: createHash("sha256")
                .update(JSON.stringify(authoredFlowchartData))
                .digest("hex"),
            }
          : {}),
        labels: svgText,
        mappedEdges:
          diagram._type === "interactive_flowchart"
            ? JSON.parse(diagram.edges)
            : [],
        tableRows: diagram._type === "table" ? diagram.rows.length : null,
      });
      blocks.push(diagram);
      if (isAuthoredFlowchart) flowchartIndex.value += 1;
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
        asset: stableMediaAsset(key),
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
            `${slug}: RiskTable source data is missing or malformed at index ${riskIndex.value - 1} (${JSON.stringify(risks)?.slice(0, 300) ?? "missing"}).`,
          );
        const severityOrder = { critical: 0, warning: 1, info: 2, ok: 3 };
        const expectedRows = [...risks]
          .sort(
            (left, right) =>
              severityOrder[left.severity] - severityOrder[right.severity],
          )
          .map((risk) => [risk.name, risk.severity, risk.mitigation])
          .map((row) => row.map(renderedInlineText));
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
      const converted = tableBlock(node, blocks.length);
      for (const image of converted.images) {
        const key = attr(image, "data-emdash-media-key");
        if (!key || !mediaByKey.has(key))
          throw new Error(
            `${slug}: table image was not matched to source media.`,
          );
        blocks.push({
          _type: "image",
          _key: stableKey("image", blocks.length),
          asset: stableMediaAsset(key),
          alt: attr(image, "alt") ?? "",
          ...(attr(image, "title") ? { title: attr(image, "title") } : {}),
        });
        usedMediaKeys.add(key);
      }
      for (const id of converted.anchors) {
        const anchor = uniqueAnchor(id);
        if (anchor)
          blocks.push(makeBlock("normal", [], anchor, blocks.length, []));
      }
      blocks.push(converted.block);
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
        ids.forEach((id) => uniqueAnchor(`adr-${id}`));
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
        code: preformattedText(code),
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
        if (!media || media.slug !== entry.slug || media.alt !== block.alt)
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
