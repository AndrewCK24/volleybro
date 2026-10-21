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
  it("produces GitHub-style slugs, numbers duplicates from -1 and keeps explicit ids", () => {
    const tldr = {
      _type: "tldr",
      blocks: [heading("Decisions")],
    } as ChangeBlock;
    const out = withHeadingAnchors([
      heading("Before / After"),
      heading("Decisions"),
      heading("Decisions"),
      heading("決策 Notes"),
      heading("Other", "custom"),
      tldr,
    ]) as unknown as Array<{ id?: string; blocks?: Array<{ id?: string }> }>;
    expect(out.slice(0, 5).map((block) => block.id)).toEqual([
      "before--after",
      "decisions",
      "decisions-1",
      "決策-notes",
      "custom",
    ]);
    expect(out[5].blocks?.[0].id).toBe("decisions-2");
  });
});
