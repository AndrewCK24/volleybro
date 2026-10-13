import type { Folder, Item, Root } from "fumadocs-core/page-tree";
import { flattenIndexOnlyFolders } from "./page-tree";

function page(name: string, url: string): Item {
  return { type: "page", name, url };
}

function folder(
  name: string,
  index: Item | undefined,
  ...children: Root["children"]
): Folder {
  return { type: "folder", name, index, children };
}

function tree(...children: Root["children"]): Root {
  return { $id: "source", name: "root", children };
}

describe("flattenIndexOnlyFolders", () => {
  it("replaces nested folders that only contain an index page", () => {
    const index = page("Membership", "/features/team-management/membership");
    const input = tree(
      folder("Team Management", undefined, folder("Membership", index)),
    );

    expect(flattenIndexOnlyFolders(input).children).toEqual([
      folder("Team Management", undefined, index),
    ]);
  });

  it("keeps folders with child pages and recursively cleans their children", () => {
    const index = page("Team Management", "/features/team-management");
    const membership = page(
      "Membership",
      "/features/team-management/membership",
    );
    const roles = page("Roles", "/features/team-management/roles");
    const input = tree(
      folder("Team Management", index, folder("Membership", membership), roles),
    );

    expect(flattenIndexOnlyFolders(input).children).toEqual([
      folder("Team Management", index, membership, roles),
    ]);
  });
});
