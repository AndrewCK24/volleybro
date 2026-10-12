import { render, screen } from "@testing-library/react";

import type { DecisionRecord } from "@/lib/decision-record";

import { DecisionTimeline } from "./decision-timeline";

const decision = {
  schemaVersion: 2 as const,
  id: "0001",
  title: "Keep workflow repository-owned",
  capabilities: ["platform/delivery-workflow"],
  decision: "Use a repository-owned workflow contract.",
} satisfies DecisionRecord;

describe("DecisionTimeline layout", () => {
  it("places full-mode records in the open timeline", () => {
    render(<DecisionTimeline decisions={[decision]} />);

    expect(screen.getByText(decision.title)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /0001/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders nothing for an empty capability result", () => {
    const { container } = render(<DecisionTimeline decisions={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
