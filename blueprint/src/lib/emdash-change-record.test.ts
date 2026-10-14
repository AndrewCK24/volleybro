/** @jest-environment node */

import {
  acceptedContentHash,
  blockSchema,
  changeDataSchema,
} from "./emdash-change-record";

const content = {
  title: "Example Change",
  linear_issue: "TEST-123",
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

  it("accepts canonical Portable Text and typed blocks in one ordered stream", () => {
    const result = changeDataSchema.safeParse({
      ...content,
      blocks: [
        {
          _type: "block",
          _key: "heading-key",
          id: "portable-text-heading",
          style: "h2",
          children: [{ _type: "span", text: "History", marks: ["strong"] }],
        },
        {
          _type: "block",
          _key: "list-key",
          listItem: "bullet",
          level: 1,
          children: [{ _type: "span", text: "Preserved list item" }],
        },
        { _type: "code", code: "const answer = 42;", language: "ts" },
        {
          _type: "table",
          rows: [
            {
              _type: "tableRow",
              _key: "row-1",
              cells: [
                {
                  _type: "tableCell",
                  _key: "cell-1",
                  content: [{ _type: "span", _key: "span-1", text: "cell" }],
                },
              ],
            },
          ],
        },
        {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: "media-1",
            url: "/_emdash/api/media/file/media-1.png",
            provider: "local",
          },
          alt: "Diagram",
        },
        {
          _type: "scenario",
          _version: 1,
          id: "S2",
          given: "A",
          when: "B",
          then: "C",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("accepts the native EmDash revision entry envelope", () => {
    const result = changeDataSchema.safeParse({
      ...content,
      id: "01JREVISIONENTRY",
      slug: "canonical-local-smoke",
      status: "draft",
      authorId: "author-1",
      primaryBylineId: null,
      createdAt: new Date("2026-10-14T00:00:00.000Z"),
      updatedAt: new Date("2026-10-14T00:00:00.000Z"),
      publishedAt: null,
      scheduledAt: null,
      draftRevisionId: null,
      liveRevisionId: null,
      locale: "en",
      translationGroup: null,
      seo: {
        title: null,
        description: null,
        image: null,
        canonical: null,
        noIndex: false,
      },
      bylines: [],
      byline: null,
      terms: {},
    });

    expect(result.success).toBe(true);
  });

  it("keeps loader author and taxonomy metadata outside the accepted content hash", async () => {
    const acceptedHash = await acceptedContentHash(content);
    const loaded = {
      ...content,
      description: null,
      bylines: [],
      byline: null,
      terms: {},
    };

    expect(changeDataSchema.safeParse(loaded).success).toBe(true);
    await expect(acceptedContentHash(loaded)).resolves.toBe(acceptedHash);
    expect(
      changeDataSchema.safeParse({ ...loaded, bylines: [{ arbitrary: true }] })
        .success,
    ).toBe(false);
    expect(
      changeDataSchema.safeParse({
        ...loaded,
        terms: { category: [{ id: "term", arbitrary: true }] },
      }).success,
    ).toBe(false);
  });

  it("preserves Unicode source anchors while rejecting unsafe IDs", () => {
    expect(
      blockSchema.safeParse({
        _type: "block",
        id: "３月測試-anchor",
        style: "h2",
        children: [{ _type: "span", text: "三月測試" }],
      }).success,
    ).toBe(true);
    expect(
      blockSchema.safeParse({
        _type: "block",
        id: "archive-assessment-與殘留工作",
        style: "h2",
        children: [{ _type: "span", text: "評估" }],
      }).success,
    ).toBe(true);
    expect(
      blockSchema.safeParse({
        _type: "block",
        id: "heading id",
        children: [{ _type: "span", text: "Unsafe" }],
      }).success,
    ).toBe(false);
    expect(
      blockSchema.safeParse({
        _type: "block",
        id: "　unsafe",
        children: [{ _type: "span", text: "Unsafe" }],
      }).success,
    ).toBe(false);
  });

  it("rejects unsafe links and unapproved HTML blocks", () => {
    expect(
      blockSchema.safeParse({
        _type: "htmlBlock",
        html: "<script>alert(1)</script>",
      }).success,
    ).toBe(false);
    expect(
      blockSchema.safeParse({
        _type: "block",
        children: [{ _type: "span", text: "unsafe", marks: ["missing-link"] }],
      }).success,
    ).toBe(false);
    expect(
      blockSchema.safeParse({
        _type: "block",
        children: [{ _type: "span", text: "unsafe", marks: ["link-1"] }],
        markDefs: [
          { _key: "link-1", _type: "link", href: "javascript:alert(1)" },
        ],
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

  it("binds canonical EmDash media identity to the accepted hash", async () => {
    const mediaContent = {
      title: "Historical Change",
      linear_issue: "TEST-123",
      blocks: [
        {
          _type: "image",
          _key: "image-key",
          alt: "Diagram",
          asset: {
            _type: "reference",
            _ref: "media-alpha",
            url: "/_emdash/api/media/file/media-alpha.png",
            provider: "local",
          },
        },
      ],
    };
    const acceptedHash = await acceptedContentHash(mediaContent);

    expect(
      changeDataSchema.safeParse({
        ...mediaContent,
        blocks: [
          {
            ...mediaContent.blocks[0],
            asset: {
              ...mediaContent.blocks[0].asset,
              url: "https://other.example/image.png",
            },
          },
        ],
      }).success,
    ).toBe(false);
    expect(
      changeDataSchema.safeParse({
        ...mediaContent,
        blocks: [
          {
            ...mediaContent.blocks[0],
            asset: { ...mediaContent.blocks[0].asset, legacyId: "old-id" },
          },
        ],
      }).success,
    ).toBe(false);
    await expect(
      acceptedContentHash({
        ...mediaContent,
        blocks: [
          {
            ...mediaContent.blocks[0],
            asset: { ...mediaContent.blocks[0].asset, _ref: "media-other" },
          },
        ],
      }),
    ).resolves.not.toBe(acceptedHash);
  });
});
