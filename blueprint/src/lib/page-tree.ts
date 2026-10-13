import type { Node, Root } from "fumadocs-core/page-tree";

/**
 * A folder with an index page but no child pages represents only that page.
 * Render it as a page so the sidebar doesn't show an empty expand control.
 */
export function flattenIndexOnlyFolders(tree: Root): Root {
  const flatten = (nodes: Node[]): Node[] =>
    nodes.flatMap((node): Node[] => {
      if (node.type !== "folder") return [node];

      const children = flatten(node.children);
      if (node.index && children.length === 0) return [node.index];

      return [{ ...node, children }];
    });

  return { ...tree, children: flatten(tree.children) };
}
