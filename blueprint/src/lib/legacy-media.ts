import { parseFragment, serialize } from "parse5";
import type { ChangeBlock } from "./emdash-change-record";

type LegacyMedia = Extract<ChangeBlock, { _type: "legacy_media" }>;

function storageKeyFor(media: LegacyMedia): string {
  if (!media.asset || !("meta" in media.asset) || !media.asset.meta) {
    throw new Error(
      `Migrated image "${media.key}" has no local EmDash storage reference.`,
    );
  }
  const key = media.asset.meta.storageKey;
  if (!/^[A-Za-z0-9._-]+$/u.test(key)) {
    throw new Error(`Migrated image "${media.key}" has an unsafe storage key.`);
  }
  return key;
}

export function rewriteLegacyMediaImages(
  html: string,
  blocks: ChangeBlock[],
): string {
  const mediaByKey = new Map(
    blocks.flatMap((block) =>
      block._type === "legacy_media" ? [[block.key, block] as const] : [],
    ),
  );
  const usedKeys = new Set<string>();
  const fragment = parseFragment(html);
  const visit = (
    node: typeof fragment | (typeof fragment)["childNodes"][number],
  ) => {
    if ("tagName" in node && node.tagName === "img") {
      const marker = node.attrs.find(
        (attribute) => attribute.name === "data-emdash-media-key",
      );
      if (marker) {
        const media = mediaByKey.get(marker.value);
        if (!media)
          throw new Error(
            `Migrated HTML references unknown image "${marker.value}".`,
          );
        if (usedKeys.has(marker.value))
          throw new Error(
            `Migrated HTML repeats image marker "${marker.value}".`,
          );
        usedKeys.add(marker.value);
        const storageKey = storageKeyFor(media);
        node.attrs = node.attrs.filter(
          (attribute) =>
            attribute.name !== "data-emdash-media-key" &&
            attribute.name !== "src",
        );
        node.attrs.push({
          name: "src",
          value: `/_emdash/api/media/file/${storageKey}`,
        });
      }
    }
    if ("childNodes" in node) node.childNodes.forEach(visit);
  };
  fragment.childNodes.forEach(visit);

  const unreferenced = [...mediaByKey.keys()].filter(
    (key) => !usedKeys.has(key),
  );
  if (unreferenced.length > 0)
    throw new Error(
      `Migrated media blocks are unused: ${unreferenced.join(", ")}.`,
    );
  return serialize(fragment);
}
