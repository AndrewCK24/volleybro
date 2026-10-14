import { convertRenderedHtmlToPortableText } from "./portable-text-converter.mjs";

const SLUG = "logo-v-splash-redesign";
const WEIGHT_KEYS = [300, 400, 500, 600, 700, 800, 900];
const SIZE_KEYS = [15, 20, 25, 30];
const CORAL = "#FC7A56";
const IVORY = "#F6F4F5";
const TEAL = "#10687E";

function literalEnd(source, start, slug) {
  if (source[start] === '"' || source[start] === "'") {
    const quote = source[start];
    let escaped = false;
    for (let index = start + 1; index < source.length; index += 1) {
      if (escaped) escaped = false;
      else if (source[index] === "\\") escaped = true;
      else if (source[index] === quote) return index + 1;
    }
    throw new Error(`${slug}: static design string is incomplete.`);
  }
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === "{" || char === "[") depth += 1;
    else if (char === "}" || char === "]") {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }
  throw new Error(`${slug}: static design literal is incomplete.`);
}

function parseLiteral(source, slug) {
  let index = 0;
  const skip = () => {
    while (/\s/u.test(source[index] ?? "")) index += 1;
  };
  const string = () => {
    const quote = source[index++];
    let value = "";
    while (index < source.length) {
      const char = source[index++];
      if (char === quote) return value;
      if (char === "\\") {
        const escaped = source[index++];
        if (escaped === undefined) break;
        value += { n: "\n", r: "\r", t: "\t" }[escaped] ?? escaped;
      } else value += char;
    }
    throw new Error(`${slug}: static design string is unterminated.`);
  };
  const value = () => {
    skip();
    if (source[index] === "'" || source[index] === '"') return string();
    if (source[index] === "[") {
      index += 1;
      const values = [];
      skip();
      while (source[index] !== "]") {
        values.push(value());
        skip();
        if (source[index] === ",") index += 1;
        skip();
        if (source[index] !== "]" && source[index] === undefined)
          throw new Error(`${slug}: static design array is incomplete.`);
      }
      index += 1;
      return values;
    }
    if (source[index] === "{") {
      index += 1;
      const object = {};
      skip();
      while (source[index] !== "}") {
        const key = /^(?:[A-Za-z_$][\w$]*|\d+)/u.exec(source.slice(index))?.[0];
        if (!key) throw new Error(`${slug}: unsupported static design key.`);
        index += key.length;
        skip();
        if (source[index++] !== ":")
          throw new Error(`${slug}: unsupported static design object.`);
        object[key] = value();
        skip();
        if (source[index] === ",") index += 1;
        skip();
        if (source[index] !== "}" && source[index] === undefined)
          throw new Error(`${slug}: static design object is incomplete.`);
      }
      index += 1;
      return object;
    }
    const number = /^-?\d+(?:\.\d+)?/u.exec(source.slice(index))?.[0];
    if (number) {
      index += number.length;
      return Number(number);
    }
    throw new Error(
      `${slug}: unsupported static design literal near ${source.slice(index, index + 24)}.`,
    );
  };
  const parsed = value();
  skip();
  if (index !== source.length)
    throw new Error(`${slug}: trailing static design literal content.`);
  return parsed;
}

function declaration(source, name) {
  const match = new RegExp(
    `\\b(?:const|let)\\s+${name}\\s*(?::[^=]+)?=\\s*`,
    "u",
  ).exec(source);
  if (!match) throw new Error(`${SLUG}: design.tsx is missing static ${name}.`);
  const start = match.index + match[0].length;
  let literal = source.slice(start, literalEnd(source, start, SLUG));
  if (name === "GROUNDS") {
    for (const identifier of ["CORAL", "IVORY", "TEAL"]) {
      const value = declaration(source, identifier);
      literal = literal.replace(
        new RegExp(`\\b${identifier}\\b`, "gu"),
        JSON.stringify(value),
      );
    }
  }
  try {
    return parseLiteral(literal, SLUG);
  } catch (error) {
    throw new Error(`${SLUG}: ${name} literal: ${error.message}`, {
      cause: error,
    });
  }
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
}

function diagram(svg, slug) {
  const [block] = convertRenderedHtmlToPortableText(svg, slug);
  if (block?._type !== "diagram" || block._version !== 1)
    throw new Error(
      `${slug}: generated logo graphic did not become Diagram v1.`,
    );
  return block;
}

function svg(viewBox, body, title) {
  return `<svg viewBox="${viewBox}" aria-label="${escapeAttr(title)}"><title>${escapeAttr(title)}</title>${body}</svg>`;
}

function path(d, fill) {
  return `<path d="${escapeAttr(d)}" fill="${escapeAttr(fill)}"></path>`;
}

function symbolDiagram(weight, data, neutral, background, label) {
  const body = `${background ? `<rect x="0" y="0" width="120" height="120" fill="${background}"></rect>` : ""}<path d="${escapeAttr(data.symL)}" fill="${neutral}"></path><path d="${escapeAttr(data.symR)}" fill="${CORAL}"></path><text x="60" y="112" fill="${background ? IVORY : "var(--foreground)"}" font-size="8" text-anchor="middle">${escapeAttr(label)}</text>`;
  return diagram(
    svg(data.symViewBox, body, `Logo symbol ${label} at weight ${weight}`),
    SLUG,
  );
}

function typeDiagram(weight, data, neutral, background, label, letters) {
  const body = `${background ? `<rect x="0" y="0" width="${data.typeW}" height="115" fill="${background}"></rect>` : ""}${path(data.typeL, neutral)}${path(data.typeR, CORAL)}<g transform="translate(${data.lettersShift} 0)" fill="${neutral}">${letters.map((d) => path(d, neutral)).join("")}</g><text x="${data.typeW / 2}" y="110" fill="${background ? IVORY : "var(--foreground)"}" font-size="5" text-anchor="middle">${escapeAttr(label)}</text>`;
  return diagram(
    svg(
      `0 0 ${data.typeW} 115`,
      body,
      `Logo type ${label} at weight ${weight}`,
    ),
    SLUG,
  );
}

function oldVsNewDiagram(data) {
  const [oldViewBox] = ["-10 225 360 360"];
  // Normalize both marks into equally sized panels; preserve their literal path geometry.
  const old = `<g transform="translate(0 0) scale(.5)">${path(data.oldSymLeft, IVORY)}${path(data.oldSymRight, CORAL)}</g>`;
  const next = `<g transform="translate(190 0) scale(.5)">${path(data.symL, IVORY)}${path(data.symR, CORAL)}</g>`;
  const labels = `<text x="90" y="205" fill="var(--foreground)" font-size="10" text-anchor="middle">old — uppercase V (0.95)</text><text x="280" y="205" fill="var(--foreground)" font-size="10" text-anchor="middle">new — lowercase v @${data.weight} (${data.aspect})</text>`;
  return diagram(
    svg(
      `0 0 380 220`,
      `<rect x="0" y="0" width="380" height="220" fill="${TEAL}"></rect>${old}${next}${labels}`,
      `Old and new logo marks at weight ${data.weight}; old viewBox ${oldViewBox}`,
    ),
    SLUG,
  );
}

function splashDiagram(data, size, wordmark, letters) {
  const screenWidth = 110;
  const screenHeight = 250;
  const iosSize = Math.round((size / 100) * screenWidth);
  const androidSize = Math.round((25 / 100) * screenWidth);
  const mark = (x, px) =>
    `<g transform="translate(${x + (screenWidth - px) / 2} ${(screenHeight - px) / 2 - 20}) scale(${px / 510})">${path(data.symL, IVORY)}${path(data.symR, CORAL)}</g>`;
  const word = `<g transform="translate(33 222) scale(${44 / data.typeW} .3826)">${path(data.typeL, IVORY)}${path(data.typeR, CORAL)}<g transform="translate(${data.lettersShift} 0)" fill="${IVORY}">${letters.map((d) => path(d, IVORY)).join("")}</g></g>`;
  const phone = (x, label, px, appName) =>
    `<rect x="${x}" y="0" width="110" height="250" rx="14" fill="${TEAL}" stroke="#000000" stroke-width="5"></rect>${mark(x, px)}${appName ? `<text x="${x + 55}" y="235" fill="${IVORY}" font-size="9" text-anchor="middle">VolleyBro</text>` : word}<text x="${x + 55}" y="272" fill="var(--foreground)" font-size="9" text-anchor="middle">${escapeAttr(label)}</text>`;
  const body = `${phone(0, "iOS — apple-splash route", iosSize, false)}${phone(150, "Android — manifest splash (fixed by Chrome)", androidSize, true)}`;
  return diagram(
    svg(
      "0 0 260 285",
      body,
      `iOS splash at ${size}% and fixed Android splash at weight ${data.weight}`,
    ),
    SLUG,
  );
}

function textBlock(text, style = "normal") {
  return { _type: "block", style, children: [{ _type: "span", text }] };
}

function anchoredText(text, style, id) {
  return { ...textBlock(text, style), id };
}

function validateLiterals(weights, letters, grounds, source) {
  const actualWeights = Object.keys(weights)
    .map(Number)
    .sort((a, b) => a - b);
  if (JSON.stringify(actualWeights) !== JSON.stringify(WEIGHT_KEYS))
    throw new Error(
      `${SLUG}: design weight literals differ from the expected 300–900 steps.`,
    );
  if (
    letters.length !== 8 ||
    letters.some((pathData) => typeof pathData !== "string")
  )
    throw new Error(`${SLUG}: logo letter paths are missing or malformed.`);
  if (
    grounds.length !== 3 ||
    grounds.map(({ label }) => label).join("|") !== "Light|Dark|Teal"
  )
    throw new Error(`${SLUG}: three ordered source grounds are required.`);
  const oldSymLeft = declaration(source, "OLD_SYM_LEFT");
  const oldSymRight = declaration(source, "OLD_SYM_RIGHT");
  return { oldSymLeft, oldSymRight };
}

export function buildLogoVSplashGallery(designSource, slug = SLUG) {
  if (slug !== SLUG) return null;
  const weights = declaration(designSource, "WEIGHTS");
  const letters = declaration(designSource, "LETTERS");
  const grounds = declaration(designSource, "GROUNDS");
  const { oldSymLeft, oldSymRight } = validateLiterals(
    weights,
    letters,
    grounds,
    designSource,
  );
  const sourceWeights = WEIGHT_KEYS.map((weight) => ({
    weight,
    ...weights[weight],
    oldSymLeft,
    oldSymRight,
  }));
  const frames = [];
  for (const entry of sourceWeights) {
    for (const size of SIZE_KEYS) {
      const { weight, ...data } = entry;
      const selected = { weight: String(weight), splashSize: String(size) };
      const blocks = [
        textBlock(
          "The V mark moves from the Saira Stencil One uppercase V (single-weight family) to the lowercase v of the variable Saira Stencil family, scaled up to cap height. The lowercase glyph is nearly square at the heavier weights, keeps the identical two-arm stencil anatomy, and gives the standalone symbol a balanced footprint in icons and splash screens. Full rationale in the change's design.md.",
        ),
        anchoredText("Weight explorer", "h2", "weight-explorer"),
        textBlock(
          `Every mockup below renders the selected weight. Aspect ratio (w/h) of the bare glyph: ${WEIGHT_KEYS.map((key) => `${key} → ${weights[key].aspect}`).join(", ")}.`,
        ),
        anchoredText("Old vs New", "h2", "old-vs-new"),
        oldVsNewDiagram({ ...data, weight }),
        anchoredText("Logo-symbol variants", "h2", "symbol-variants"),
      ];
      for (const ground of grounds) {
        const neutral =
          ground.variant === "adaptive" ? "var(--foreground)" : IVORY;
        const background =
          ground.label === "Teal"
            ? TEAL
            : ground.label === "Dark"
              ? "var(--background)"
              : null;
        const label = `${ground.label} · ${ground.variant}`;
        blocks.push(symbolDiagram(weight, data, neutral, background, label));
      }
      blocks.push(anchoredText("Logo-type variants", "h2", "type-variants"));
      for (const ground of grounds) {
        const neutral =
          ground.variant === "adaptive" ? "var(--foreground)" : IVORY;
        const background =
          ground.label === "Teal"
            ? TEAL
            : ground.label === "Dark"
              ? "var(--background)"
              : null;
        const label = `${ground.label} · ${ground.variant}`;
        blocks.push(
          typeDiagram(weight, data, neutral, background, label, letters),
        );
      }
      blocks.push(
        anchoredText("Splash mockups", "h2", "splash-mockups"),
        textBlock(
          "iOS renders the generated launch screen: the mark centered at the selected percentage of the shorter device dimension, plus the full wordmark (logo-type, 40% wide) centered near the bottom — the route draws the PNG itself, so the wordmark is the real logo geometry. Android composes its splash from the manifest: background_color teal field, the centered maskable icon (same teal field → bare V), and the app name text drawn by Chrome — that text is not stylable, so Android approximates the iOS layout rather than embedding logo-type. The size percentage below only parameterizes the iOS image; Chrome fixes the icon size on the Android splash itself, so the Android frame does not respond to the selector.",
        ),
        splashDiagram(data, size, data.typeW, letters),
        anchoredText("Geometry facts", "h2", "geometry-facts"),
      );
      blocks.push(
        textBlock(
          `Splash mark size ${size}% of shorter dimension (selected: 25%, iOS image only)`,
        ),
      );
      blocks.push(
        textBlock(
          `Glyph: Saira Stencil (variable, wdth 100) lowercase v @ wght ${weight}`,
        ),
      );
      blocks.push(
        textBlock(
          `Symbol viewBox: ${data.symViewBox} (square, aspect ${data.aspect})`,
        ),
      );
      blocks.push(
        textBlock(
          `Type viewBox: 0 0 ${data.typeW} 115 (v at cap height 82.56, letters ${data.lettersShift >= 0 ? "+" : ""}${data.lettersShift})`,
        ),
      );
      blocks.push(textBlock(`Right arm: ${CORAL} (fixed coral, every theme)`));
      blocks.push(
        textBlock(
          `Neutral parts: currentColor (adaptive) / ${IVORY} (brand ground)`,
        ),
      );
      blocks.push(
        textBlock(
          `Splash field: ${TEAL} (--primary), iOS route + Android manifest`,
        ),
      );
      frames.push({
        selections: selected,
        blocks: blocks.map((block, index) => ({
          ...block,
          _key: `logo-${weight}-${size}-${index + 1}`,
        })),
      });
    }
  }
  return {
    _type: "variant_gallery",
    version: 1,
    title: "Logo weight and splash size explorer",
    choices: [
      {
        id: "weight",
        label: "Weight",
        options: WEIGHT_KEYS.map((weight) => ({
          value: String(weight),
          label: String(weight),
          ...(weight === 700 ? { selectedLabel: "700 ✓ pinned" } : {}),
        })),
      },
      {
        id: "splashSize",
        label: "iOS splash mark size",
        options: SIZE_KEYS.map((size) => ({
          value: String(size),
          label: `${size}%`,
          ...(size === 25 ? { selectedLabel: "25% ✓ selected" } : {}),
        })),
      },
    ],
    defaultValues: { weight: "700", splashSize: "25" },
    frames,
  };
}

export function replaceLogoVSplashPlaceholder(blocks, gallery, slug = SLUG) {
  if (slug !== SLUG) return blocks;
  const matches = [];
  blocks.forEach((block, index) => {
    const value = block.children?.map((child) => child.text ?? "").join("");
    if (value === "載入設計稿…") matches.push(index);
  });
  if (matches.length !== 1)
    throw new Error(
      `${SLUG}: expected one server-rendered design placeholder, found ${matches.length}.`,
    );
  const result = [...blocks];
  result.splice(matches[0], 1, gallery);
  return result;
}
