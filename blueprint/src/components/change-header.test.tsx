import { render, screen } from "@testing-library/react";

import { ChangeHeader } from "./change-header";

describe("ChangeHeader", () => {
  it("shows only the public in-progress status and derived figures", () => {
    render(
      <ChangeHeader
        title="Single Page Change"
        status="in-progress"
        scenarioCount={2}
        metrics={{
          commits: 2,
          filesChanged: 4,
          additions: 12,
          deletions: 3,
          srcFiles: 1,
        }}
      />,
    );

    expect(screen.getByText("進行中")).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Change figures" }),
    ).toHaveTextContent("2 commits");
    expect(
      screen.getByRole("list", { name: "Change figures" }),
    ).toHaveTextContent("2 scenarios");
    expect(screen.queryByText(/G1|G2|討論中/u)).not.toBeInTheDocument();
  });

  it("shows merged status and the verified completion date", () => {
    render(
      <ChangeHeader
        title="Merged Change"
        status="merged"
        mergedAt="2026-10-12T08:30:00.000Z"
        scenarioCount={0}
      />,
    );

    expect(screen.getByText("已合併")).toBeInTheDocument();
    expect(screen.getByText("2026-10-12")).toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: "Change figures" }),
    ).not.toBeInTheDocument();
  });
});
