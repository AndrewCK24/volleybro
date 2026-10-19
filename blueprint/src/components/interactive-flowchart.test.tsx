import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { InteractiveFlowchart } from "./interactive-flowchart";

const source = `flowchart LR
  A["Node A"]
  B{"Node B"}
  C["Node C"]
  A --> B
  B -.-> C
  A --> C`;

const details = {
  A: { title: "Detail A", body: "Body of A" },
  B: { title: "Detail B", body: "Body of B" },
  C: { title: "Empty detail", body: "" },
};

describe("InteractiveFlowchart", () => {
  it("selects Pele nodes with click and keyboard, and lets selection be cancelled", () => {
    render(<InteractiveFlowchart source={source} details={details} />);
    const nodeA = screen.getByRole("button", { name: "Node A" });

    fireEvent.click(nodeA);
    expect(nodeA).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Body of A")).toBeInTheDocument();

    fireEvent.click(nodeA);
    expect(nodeA).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("Body of A")).not.toBeInTheDocument();

    fireEvent.keyDown(nodeA, { key: "Enter" });
    expect(screen.getByText("Body of A")).toBeInTheDocument();
    fireEvent.keyDown(nodeA, { key: " " });
    expect(screen.queryByText("Body of A")).not.toBeInTheDocument();
  });

  it("moves keyboard focus between nodes and hides details without a body", () => {
    render(<InteractiveFlowchart source={source} details={details} />);
    const nodeA = screen.getByRole("button", { name: "Node A" });
    const nodeB = screen.getByRole("button", { name: "Node B" });

    nodeA.focus();
    fireEvent.keyDown(nodeA, { key: "ArrowRight" });
    expect(nodeB).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Node C" }));
    expect(screen.queryByText("Empty detail")).not.toBeInTheDocument();
  });

  it("highlights only the declared path sequence and accepts an empty path list", () => {
    const { rerender } = render(
      <InteractiveFlowchart
        source={source}
        details={details}
        paths={[{ id: "main", label: "Main route", nodeIds: ["A", "B", "C"] }]}
      />,
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Highlight path" }), {
      target: { value: "main" },
    });
    expect(screen.getByRole("button", { name: "Node A" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByRole("button", { name: "Node C" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(
      screen.getByRole("combobox", { name: "Highlight path" }),
    ).toBeInTheDocument();

    rerender(
      <InteractiveFlowchart source={source} details={details} paths={[]} />,
    );
    expect(
      screen.queryByRole("combobox", { name: "Highlight path" }),
    ).not.toBeInTheDocument();
  });

  it("shows invalid source errors as text", () => {
    render(
      <InteractiveFlowchart
        source={'flowchart LR\n  A["<script>alert(1)</script>"]'}
        details={{}}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("raw HTML");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
