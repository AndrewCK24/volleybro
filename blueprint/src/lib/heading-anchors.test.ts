import type { ChangeBlock } from "./emdash-change-record";
import { withHeadingAnchors } from "./heading-anchors";

const heading = (text: string, id?: string) =>
  ({
    _type: "block",
    style: "h2",
    ...(id ? { id } : {}),
    children: [{ _type: "span", text }],
  }) as ChangeBlock;

describe("withHeadingAnchors", () => {
  it("slugs headings without id, suffixes duplicates and keeps explicit ids", () => {
    const tldr = { _type: "tldr", blocks: [heading("Setup")] } as ChangeBlock;
    const out = withHeadingAnchors([
      heading("Setup Guide"),
      heading("Setup Guide"),
      heading("Custom", "kept"),
      heading("Kept"),
      heading("Setup"),
      tldr,
    ]) as unknown as Array<{ id?: string; blocks?: Array<{ id?: string }> }>;
    expect(out.map((block) => block.id)).toEqual([
      "setup-guide",
      "setup-guide-2",
      "kept",
      "kept-2",
      "setup",
      undefined,
    ]);
    expect(out[5].blocks?.[0].id).toBe("setup-2");
  });
});
