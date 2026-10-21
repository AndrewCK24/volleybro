import type { ChangeBlock } from "./emdash-change-record";

const HEADING = /^h[1-6]$/u;

function slugify(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

function headingText(block: ChangeBlock): string {
  return (block as { children: { text: string }[] }).children
    .map(({ text }) => text)
    .join("");
}

function isHeading(block: ChangeBlock): boolean {
  return (
    block._type === "block" &&
    HEADING.test(String((block as { style?: unknown }).style))
  );
}

function nestedBlocks(block: ChangeBlock): ChangeBlock[] | undefined {
  return block._type === "tldr" || block._type === "disclosure"
    ? block.blocks
    : undefined;
}

function collectIds(blocks: ChangeBlock[], ids: Set<string>) {
  for (const block of blocks) {
    const id = (block as { id?: string }).id;
    if (id) ids.add(id);
    collectIds(nestedBlocks(block) ?? [], ids);
  }
}

// EmDash admin saves drop a heading's id, so headings without one get a
// page-unique slug of their text. An explicit id always wins.
export function withHeadingAnchors(blocks: ChangeBlock[]): ChangeBlock[] {
  const taken = new Set<string>();
  collectIds(blocks, taken);
  const assign = (list: ChangeBlock[]): ChangeBlock[] =>
    list.map((block) => {
      const nested = nestedBlocks(block);
      if (nested) return { ...block, blocks: assign(nested) } as ChangeBlock;
      if (!isHeading(block) || (block as { id?: string }).id) return block;
      const base = slugify(headingText(block));
      if (!base) return block;
      let id = base;
      for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
      taken.add(id);
      return { ...block, id } as ChangeBlock;
    });
  return assign(blocks);
}
