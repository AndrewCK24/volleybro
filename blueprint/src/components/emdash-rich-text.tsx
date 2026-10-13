import type { ReactNode } from "react";

type Span = { _key?: string; _type: "span"; text: string; marks?: string[] };
type TextBlock = {
  _type: "block";
  style?: "normal" | "h2" | "h3" | "blockquote";
  children: Span[];
  markDefs?: Array<{ _key: string; href?: string }>;
};

function safeHref(value?: string) {
  if (!value) return undefined;
  if (value.startsWith("/") || value.startsWith("#")) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol)
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}

function renderSpan(span: Span, block: TextBlock): ReactNode {
  const link = span.marks
    ?.map((mark) =>
      block.markDefs?.find((definition) => definition._key === mark),
    )
    .find(Boolean);
  let value: ReactNode = span.text;
  for (const mark of [...(span.marks ?? [])].reverse()) {
    if (mark === "strong") value = <strong>{value}</strong>;
    else if (mark === "em") value = <em>{value}</em>;
    else if (mark === "code") value = <code>{value}</code>;
    else if (link?._key === mark) {
      const href = safeHref(link.href);
      if (href)
        value = (
          <a
            href={href}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
          >
            {value}
          </a>
        );
    }
  }
  return value;
}

export function EmDashRichText({ value }: { value: TextBlock[] }) {
  return value.map((block, index) => {
    const children = block.children.map((span, spanIndex) => (
      <span key={span._key ?? `${index}-${spanIndex}`}>
        {renderSpan(span, block)}
      </span>
    ));
    const key = `paragraph-${index}`;
    if (block.style === "h2") return <h2 key={key}>{children}</h2>;
    if (block.style === "h3") return <h3 key={key}>{children}</h3>;
    if (block.style === "blockquote")
      return <blockquote key={key}>{children}</blockquote>;
    return <p key={key}>{children}</p>;
  });
}
