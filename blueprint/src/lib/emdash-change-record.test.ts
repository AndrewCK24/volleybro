/** @jest-environment node */

import {
  acceptedContentHash,
  blockSchema,
  changeDataSchema,
} from "./emdash-change-record";

const content = {
  title: "Example Change",
  linear_issue: "ATE-294",
  pull_requests: [{ url: "https://github.com/andrewck24/volleybro/pull/552" }],
  blocks: [
    {
      _type: "scenario",
      _version: 1,
      id: "S1",
      given: "A",
      when: "B",
      then: "C",
    },
  ],
};

describe("EmDash Change schema", () => {
  it("accepts only allowlisted same-repository PR URLs", () => {
    expect(changeDataSchema.safeParse(content).success).toBe(true);
    expect(
      changeDataSchema.safeParse({
        ...content,
        pull_requests: [{ url: "https://github.com/another/repo/pull/552" }],
      }).success,
    ).toBe(false);
  });

  it("fails closed on an unknown block type or version", () => {
    expect(
      blockSchema.safeParse({
        _type: "custom-script",
        _version: 1,
        source: "alert(1)",
      }).success,
    ).toBe(false);
    expect(
      blockSchema.safeParse({
        _type: "scenario",
        _version: 2,
        id: "S1",
        given: "A",
        when: "B",
        then: "C",
      }).success,
    ).toBe(false);
    expect(
      blockSchema.safeParse({
        _type: "scenario",
        _version: 1,
        id: "S1",
        given: "A",
        when: "B",
        then: "C",
        executable: "alert(1)",
      }).success,
    ).toBe(false);
  });

  it("rejects unknown content fields instead of dropping them before hashing", async () => {
    const unsafe = {
      ...content,
      private_notes: "not part of the approved schema",
    };
    expect(changeDataSchema.safeParse(unsafe).success).toBe(false);
    await expect(acceptedContentHash(unsafe)).rejects.toThrow(
      "Change content does not match",
    );
  });

  it("hashes accepted fields in a stable order and excludes CMS metadata", async () => {
    const first = await acceptedContentHash(content);
    const second = await acceptedContentHash({
      blocks: content.blocks,
      linear_issue: content.linear_issue,
      title: content.title,
      id: "cms-id",
      status: "draft",
      draftRevisionId: "revision",
      authorId: "author-id",
      primaryBylineId: null,
      publishedAt: null,
      scheduledAt: null,
      locale: "en",
      translationGroup: null,
    });
    expect(first).toBe(second);
  });

  it("keeps PR association changes outside the G1 content hash", async () => {
    const before = await acceptedContentHash(content);
    const after = await acceptedContentHash({
      ...content,
      pull_requests: [
        { url: "https://github.com/andrewck24/volleybro/pull/553" },
      ],
    });
    expect(after).toBe(before);
  });
});
