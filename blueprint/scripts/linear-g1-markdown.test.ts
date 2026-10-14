import { prepareLinearG1Markdown } from "./linear-g1-markdown";

describe("prepareLinearG1Markdown", () => {
  it("converts Linear issue and pull request references into retained Markdown links", () => {
    const result = prepareLinearG1Markdown(
      '<issue id="issue-id" href="https://linear.app/asatelier/issue/TEST-123">TEST-123</issue> and <pull-request id="pr-id" href="https://linear.app/asatelier/review/change-123">repo#123</pull-request>',
    );

    expect(result.markdown).toBe(
      "[TEST-123](<https://linear.app/asatelier/issue/TEST-123>) and [repo#123](<https://linear.app/asatelier/review/change-123>)",
    );
    expect(result.transformations).toContain(
      "convert-linear-reference-elements-to-markdown-links",
    );
  });

  it("replaces stale G1 and merge authorization metadata with current derived status language", () => {
    const result = prepareLinearG1Markdown(
      [
        "**Status:** G1 accepted.",
        "G1 authorizes ticket decomposition, not implementation or dispatch.",
        'Acceptance of this revision does not authorize merging PR <pull-request id="pr-id" href="https://linear.app/asatelier/review/change-123">repo#123</pull-request> yet.',
      ].join("\n"),
    );

    expect(result.markdown).toContain(
      "**G1 snapshot:** Accepted specification; current delivery status is derived from the linked GitHub pull requests.",
    );
    expect(result.markdown).toContain(
      "Under WORKFLOW.md, accepted G1 authorizes implementation through G2.",
    );
    expect(result.markdown).toContain(
      "Current delivery status is derived from the linked GitHub pull requests.",
    );
    expect(result.transformations).toEqual(
      expect.arrayContaining([
        "replace-stale-linear-status-metadata",
        "align-g1-authorization-with-workflow",
        "replace-stale-pr-merge-metadata",
      ]),
    );
  });

  it("does not create links for unsupported reference destinations", () => {
    const result = prepareLinearG1Markdown(
      '<issue id="bad" href="https://example.com/issue/1">issue</issue>',
    );

    expect(result.markdown).toBe("issue");
    expect(result.transformations).not.toContain(
      "convert-linear-reference-elements-to-markdown-links",
    );
  });
});
