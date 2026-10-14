import defaultMdxComponents from "fumadocs-ui/mdx";

import { StatusBadge } from "@/components/status-badge";

export function featureMdxComponents() {
  return {
    ...defaultMdxComponents,
    StatusBadge,
  };
}
