import { Fragment, type ReactNode } from "react";

type InlinePart =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong-marker" };

function tokenize(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const syntax = /`([^`]+)`|\*\*/g;
  let offset = 0;

  for (const match of text.matchAll(syntax)) {
    const index = match.index ?? 0;
    if (index > offset) {
      parts.push({ type: "text", value: text.slice(offset, index) });
    }

    parts.push(
      match[1] === undefined
        ? { type: "strong-marker" }
        : { type: "code", value: match[1] },
    );
    offset = index + match[0].length;
  }

  if (offset < text.length) {
    parts.push({ type: "text", value: text.slice(offset) });
  }

  return parts;
}

function renderPart(part: InlinePart, key: number): ReactNode {
  if (part.type === "code") return <code key={key}>{part.value}</code>;
  if (part.type === "strong-marker") {
    return <Fragment key={key}>{"**"}</Fragment>;
  }
  return <Fragment key={key}>{part.value}</Fragment>;
}

export function renderInline(text: string): ReactNode {
  const parts = tokenize(text);
  const pairedMarkers = new Map<number, number>();
  let openMarker: number | undefined;

  parts.forEach((part, index) => {
    if (part.type !== "strong-marker") return;
    if (openMarker === undefined) {
      openMarker = index;
      return;
    }

    pairedMarkers.set(openMarker, index);
    pairedMarkers.set(index, openMarker);
    openMarker = undefined;
  });

  const rendered: ReactNode[] = [];
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (part.type === "strong-marker") {
      const pairedIndex = pairedMarkers.get(index);
      if (pairedIndex !== undefined && pairedIndex > index) {
        const children = parts
          .slice(index + 1, pairedIndex)
          .map((child, childIndex) => renderPart(child, childIndex));
        rendered.push(<strong key={index}>{children}</strong>);
        index = pairedIndex;
        continue;
      }
      if (pairedIndex !== undefined) continue;
    }

    rendered.push(renderPart(part, index));
  }

  return rendered;
}
