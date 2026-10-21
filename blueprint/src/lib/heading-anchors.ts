import GithubSlugger from "github-slugger";
import type { ChangeBlock } from "./emdash-change-record";

const HEADING = /^h[1-6]$/u;

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

// EmDash admin saves drop a heading's id. Existing links use GitHub-style
// slugs, so every heading advances one slugger in document order, keeping
// duplicate suffixes identical to the ids that were dropped. An explicit id wins.
export function withHeadingAnchors(blocks: ChangeBlock[]): ChangeBlock[] {
  const slugger = new GithubSlugger();
  const assign = (list: ChangeBlock[]): ChangeBlock[] =>
    list.map((block) => {
      if (block._type === "tldr" || block._type === "disclosure")
        return { ...block, blocks: assign(block.blocks) } as ChangeBlock;
      if (!isHeading(block)) return block;
      const text = headingText(block);
      if (!text) return block;
      const slug = slugger.slug(text);
      if ((block as { id?: string }).id) return block;
      return { ...block, id: slug } as ChangeBlock;
    });
  return assign(blocks);
}
