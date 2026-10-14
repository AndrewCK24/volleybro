import { render, screen } from "@testing-library/react";

import { Scenarios } from "./scenario-cards";

describe("canonical scenario cards", () => {
  it("renders scenario IDs in authored order with each scenario body", () => {
    render(
      <Scenarios
        items={[
          {
            id: "S2",
            given: "a roster",
            when: "a member joins",
            then: "membership is visible",
          },
          {
            id: "S1",
            given: "a rally",
            when: "it completes",
            then: "the score updates",
          },
        ]}
      />,
    );
    expect(
      screen.getAllByText(/^S[12]$/u).map((label) => label.textContent),
    ).toEqual(["S2", "S1"]);
    expect(screen.getByText("a roster")).toBeInTheDocument();
    expect(screen.getByText("a member joins")).toBeInTheDocument();
    expect(screen.getByText("membership is visible")).toBeInTheDocument();
    expect(screen.getByText("a rally")).toBeInTheDocument();
    expect(screen.getByText("it completes")).toBeInTheDocument();
    expect(screen.getByText("the score updates")).toBeInTheDocument();
  });
});
