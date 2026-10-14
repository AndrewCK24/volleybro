import { useId } from "react";

import type {
  DiagramBlock,
  DiagramElement,
  DiagramPaint,
  DiagramTransform,
} from "../lib/diagram-schema";

const PAINT_VALUES: Record<Exclude<DiagramPaint, `#${string}`>, string> = {
  foreground: "var(--foreground)",
  background: "var(--background)",
  muted: "var(--muted-foreground)",
  mutedBackground: "var(--muted)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  border: "var(--border)",
  card: "var(--card)",
  success: "var(--success)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
  chart1: "var(--chart-1)",
  chart3: "var(--chart-3)",
  chart5: "var(--chart-5)",
  primaryWash: "color-mix(in srgb, var(--primary) 8%, var(--card))",
  foregroundCard3: "color-mix(in srgb, var(--foreground) 3%, var(--card))",
  foregroundTransparent30:
    "color-mix(in srgb, var(--foreground) 30%, transparent)",
  foregroundTransparent2:
    "color-mix(in srgb, var(--foreground) 2%, transparent)",
  foregroundBackground2:
    "color-mix(in srgb, var(--foreground) 2%, var(--background))",
  warningMuted: "color-mix(in srgb, var(--warning) 65%, var(--foreground))",
  destructiveMuted:
    "color-mix(in srgb, var(--destructive) 65%, var(--foreground))",
  none: "none",
  currentColor: "currentColor",
};

function paintValue(value: DiagramPaint | undefined): string | undefined {
  if (!value) return undefined;
  return value.startsWith("#") ? value : PAINT_VALUES[value];
}

function transformValue(transform: DiagramTransform): string {
  switch (transform.type) {
    case "translate":
      return `translate(${transform.x} ${transform.y})`;
    case "scale":
      return `scale(${transform.x} ${transform.y})`;
    case "rotate":
      return transform.cx === undefined
        ? `rotate(${transform.angle})`
        : `rotate(${transform.angle} ${transform.cx} ${transform.cy})`;
    case "matrix":
      return `matrix(${transform.values.join(" ")})`;
    case "skewX":
      return `skewX(${transform.angle})`;
    case "skewY":
      return `skewY(${transform.angle})`;
  }
}

function sharedProps(element: DiagramElement) {
  return {
    id: element.id,
    fill: paintValue(element.fill),
    stroke: paintValue(element.stroke),
    strokeWidth: element.strokeWidth,
    opacity: element.opacity,
    fillOpacity: element.fillOpacity,
    strokeOpacity: element.strokeOpacity,
    strokeDasharray: element.strokeDasharray?.join(" "),
    strokeLinecap: element.strokeLinecap,
    strokeLinejoin: element.strokeLinejoin as
      "round" | "bevel" | "miter" | undefined,
  };
}

function arrowProps(
  element: Extract<DiagramElement, { type: "line" | "path" | "polyline" }>,
  markerId: string,
) {
  return {
    markerStart: element.markerStart
      ? `url(#${element.markerStart})`
      : element.arrowStart
        ? `url(#${markerId})`
        : undefined,
    markerEnd: element.markerEnd
      ? `url(#${element.markerEnd})`
      : element.arrowEnd
        ? `url(#${markerId})`
        : undefined,
  };
}

function pathData(element: Extract<DiagramElement, { type: "path" }>) {
  return element.commands
    .map(({ op, values }) => (values.length ? `${op}${values.join(" ")}` : op))
    .join(" ");
}

function pointsData(
  element: Extract<DiagramElement, { type: "polygon" | "polyline" }>,
) {
  return element.points.map(([x, y]) => `${x},${y}`).join(" ");
}

function renderElement(element: DiagramElement, key: string, markerId: string) {
  const common = sharedProps(element);
  switch (element.type) {
    case "rect":
      return (
        <rect
          key={key}
          {...common}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rx={element.rx}
          ry={element.ry}
        />
      );
    case "circle":
      return (
        <circle
          key={key}
          {...common}
          cx={element.cx}
          cy={element.cy}
          r={element.r}
        />
      );
    case "ellipse":
      return (
        <ellipse
          key={key}
          {...common}
          cx={element.cx}
          cy={element.cy}
          rx={element.rx}
          ry={element.ry}
        />
      );
    case "line":
      return (
        <line
          key={key}
          {...common}
          {...arrowProps(element, markerId)}
          x1={element.x1}
          y1={element.y1}
          x2={element.x2}
          y2={element.y2}
        />
      );
    case "path":
      return (
        <path
          key={key}
          {...common}
          {...arrowProps(element, markerId)}
          d={pathData(element)}
        />
      );
    case "polyline":
      return (
        <polyline
          key={key}
          {...common}
          {...arrowProps(element, markerId)}
          points={pointsData(element)}
        />
      );
    case "polygon":
      return <polygon key={key} {...common} points={pointsData(element)} />;
    case "text":
      return (
        <text
          key={key}
          {...common}
          x={element.x}
          y={element.y}
          fontSize={element.fontSize}
          fontFamily={
            element.fontFamily === "mono"
              ? "monospace"
              : element.fontFamily === "serif"
                ? "serif"
                : element.fontFamily === "sans"
                  ? "sans-serif"
                  : undefined
          }
          fontWeight={element.fontWeight}
          textAnchor={element.textAnchor}
          dominantBaseline={element.dominantBaseline}
          letterSpacing={element.letterSpacing}
        >
          {element.runs
            ? element.runs.map((run, index) => (
                <tspan
                  key={run.id ?? index}
                  id={run.id}
                  x={run.x}
                  y={run.y}
                  dx={run.dx}
                  dy={run.dy}
                  rotate={run.rotate?.join(" ")}
                  fill={paintValue(run.fill)}
                  stroke={paintValue(run.stroke)}
                  strokeWidth={run.strokeWidth}
                  opacity={run.opacity}
                  fontSize={run.fontSize}
                  fontFamily={
                    run.fontFamily === "mono"
                      ? "monospace"
                      : run.fontFamily === "serif"
                        ? "serif"
                        : run.fontFamily === "sans"
                          ? "sans-serif"
                          : undefined
                  }
                  fontWeight={run.fontWeight}
                  textAnchor={run.textAnchor}
                  dominantBaseline={run.dominantBaseline}
                  letterSpacing={run.letterSpacing}
                >
                  {run.text}
                </tspan>
              ))
            : element.text}
        </text>
      );
    case "group":
      return (
        <g
          key={key}
          {...common}
          transform={element.transform?.map(transformValue).join(" ")}
        >
          {element.children.map((child, index) =>
            renderElement(child, `${key}-${index}`, markerId),
          )}
        </g>
      );
  }
}

export function Diagram({ diagram }: { diagram: DiagramBlock }) {
  const markerId = `diagram-arrow-${useId().replace(/[^A-Za-z\d_-]/gu, "")}`;
  const hasArrows = diagram.elements.some(hasArrow);

  return (
    <figure className="my-8">
      <svg
        aria-label={diagram.title ?? diagram.description ?? "Diagram"}
        className="h-auto w-full"
        preserveAspectRatio={
          diagram.preserveAspectRatio?.align === "none"
            ? "none"
            : `${diagram.preserveAspectRatio?.align ?? "xMidYMid"} ${diagram.preserveAspectRatio?.mode ?? "meet"}`
        }
        role="img"
        viewBox={`${diagram.viewBox.x} ${diagram.viewBox.y} ${diagram.viewBox.width} ${diagram.viewBox.height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {diagram.title && <title>{diagram.title}</title>}
        {diagram.description && <desc>{diagram.description}</desc>}
        {diagram.anchors?.map((anchor) => (
          <g
            key={`anchor-${anchor.id}`}
            id={anchor.id}
            transform={
              anchor.x === undefined && anchor.y === undefined
                ? undefined
                : `translate(${anchor.x ?? 0} ${anchor.y ?? 0})`
            }
          />
        ))}
        {(hasArrows || diagram.markers?.length) && (
          <defs>
            {hasArrows && (
              <marker
                id={markerId}
                markerHeight="6"
                markerUnits="strokeWidth"
                markerWidth="7"
                orient="auto-start-reverse"
                refX="8"
                refY="5"
                viewBox="0 0 10 10"
              >
                <path d="M 0 0 L 10 5 L 0 10 Z" fill="context-stroke" />
              </marker>
            )}
            {diagram.markers?.map((marker) => (
              <marker
                key={marker.id}
                id={marker.id}
                markerHeight={marker.height}
                markerWidth={marker.width}
                markerUnits={
                  marker.units === "userSpaceOnUse"
                    ? "userSpaceOnUse"
                    : "strokeWidth"
                }
                orient={marker.orient}
                refX={marker.refX}
                refY={marker.refY}
                viewBox={`${marker.viewBox.x} ${marker.viewBox.y} ${marker.viewBox.width} ${marker.viewBox.height}`}
              >
                <path
                  d={marker.path
                    .map(({ op, values }) =>
                      values.length ? `${op}${values.join(" ")}` : op,
                    )
                    .join(" ")}
                  fill={paintValue(marker.fill)}
                  stroke={paintValue(marker.stroke)}
                />
              </marker>
            ))}
          </defs>
        )}
        {diagram.elements.map((element, index) =>
          renderElement(element, `element-${index}`, markerId),
        )}
      </svg>
      {diagram.title && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {diagram.title}
        </figcaption>
      )}
    </figure>
  );
}

function hasArrow(element: DiagramElement): boolean {
  if (
    (element.type === "line" ||
      element.type === "path" ||
      element.type === "polyline") &&
    (("arrowStart" in element && element.arrowStart) ||
      ("arrowEnd" in element && element.arrowEnd))
  )
    return true;
  return element.type === "group" && element.children.some(hasArrow);
}
