import { Diagram } from "@/components/diagram";
import type { DiagramBlock } from "@/lib/diagram-schema";

const specimen = {
  _type: "diagram",
  _version: 1,
  title: "Static typed diagram",
  description: "A preserved two-step path with an authored marker and label.",
  viewBox: { x: 0, y: 0, width: 360, height: 112 },
  preserveAspectRatio: { align: "xMidYMid", mode: "meet" },
  markers: [
    {
      id: "specimen-arrow",
      viewBox: { x: 0, y: 0, width: 10, height: 10 },
      width: 7,
      height: 7,
      refX: 9,
      refY: 5,
      orient: "auto-start-reverse",
      path: [
        { op: "M", values: [0, 0] },
        { op: "L", values: [10, 5] },
        { op: "L", values: [0, 10] },
        { op: "Z", values: [] },
      ],
      fill: "primary",
    },
  ],
  elements: [
    {
      type: "rect",
      id: "authored-step",
      x: 16,
      y: 24,
      width: 116,
      height: 48,
      rx: 8,
      fill: "card",
      stroke: "border",
      strokeWidth: 1,
    },
    {
      type: "text",
      x: 74,
      y: 49,
      text: "Authored text",
      fontSize: 13,
      textAnchor: "middle",
      dominantBaseline: "middle",
    },
    {
      type: "path",
      id: "authored-connector",
      commands: [
        { op: "M", values: [132, 48] },
        { op: "C", values: [176, 48, 178, 48, 220, 48] },
      ],
      stroke: "primary",
      strokeWidth: 2,
      markerEnd: "specimen-arrow",
    },
    {
      type: "circle",
      id: "authored-endpoint",
      cx: 276,
      cy: 48,
      r: 22,
      fill: "primaryWash",
      stroke: "primary",
      strokeWidth: 2,
    },
  ],
} satisfies DiagramBlock;

export default function DiagramShowcase() {
  return (
    <div>
      <h2 id="live-specimen">Live specimen</h2>
      <Diagram diagram={specimen} />

      <h2 id="typed-example">Typed data example</h2>
      <p>
        Authored content uses a versioned object. The line below shows the
        shape; the live specimen above uses the complete strict contract.
      </p>
      <pre>
        <code>{`const diagram: DiagramBlock = {
  _type: "diagram",
  _version: 1,
  viewBox: { x: 0, y: 0, width: 360, height: 112 },
  elements: [
    { type: "text", x: 24, y: 32, text: "Escaped label" },
    { type: "path", commands: [{ op: "M", values: [0, 0] }] },
  ],
};`}</code>
      </pre>
    </div>
  );
}

export const toc = [
  { title: "Live specimen", url: "#live-specimen", depth: 2 },
  { title: "Typed data example", url: "#typed-example", depth: 2 },
];
