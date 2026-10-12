import { createElement, type ReactNode } from "react";

export function CodeBlock({ children }: { children: ReactNode }) {
  return createElement("figure", null, children);
}

export function Pre({ children }: { children: ReactNode }) {
  return createElement("pre", null, children);
}
