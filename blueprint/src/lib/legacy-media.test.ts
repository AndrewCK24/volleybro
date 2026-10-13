import { rewriteLegacyMediaImages } from "./legacy-media";

const media = {
  _type: "legacy_media" as const,
  _version: 1 as const,
  key: "legacy-image-example-one",
  sha256: "a".repeat(64),
  alt: "Diagram",
  asset: {
    id: "media-1",
    provider: "local" as const,
    meta: { storageKey: "media-1.webp" },
  },
};

describe("rewriteLegacyMediaImages", () => {
  it("rewrites only an integrity-matched migration marker to the EmDash local media route", () => {
    const html = rewriteLegacyMediaImages(
      '<figure><img alt="Diagram" data-emdash-media-key="legacy-image-example-one"></figure>',
      [media],
    );

    expect(html).toContain('src="/_emdash/api/media/file/media-1.webp"');
    expect(html).toContain('alt="Diagram"');
    expect(html).not.toContain("data-emdash-media-key");
  });

  it("fails closed for missing, duplicate, or unsafe media references", () => {
    expect(() =>
      rewriteLegacyMediaImages('<img data-emdash-media-key="unknown">', [
        media,
      ]),
    ).toThrow("unknown image");
    expect(() =>
      rewriteLegacyMediaImages(
        '<img data-emdash-media-key="legacy-image-example-one"><img data-emdash-media-key="legacy-image-example-one">',
        [media],
      ),
    ).toThrow("repeats image marker");
    expect(() =>
      rewriteLegacyMediaImages(
        '<img data-emdash-media-key="legacy-image-example-one">',
        [
          {
            ...media,
            asset: { ...media.asset, meta: { storageKey: "../unsafe" } },
          },
        ],
      ),
    ).toThrow("unsafe storage key");
  });
});
