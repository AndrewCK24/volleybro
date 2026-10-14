import { render, screen } from "@testing-library/react";

import { ChangeMetricsBadges } from "./change-metrics-badges";

describe("ChangeMetricsBadges", () => {
  it("shows insertions and deletions as separate badges, named for screen readers", () => {
    render(
      <ChangeMetricsBadges
        metrics={{
          commits: 43,
          filesChanged: 422,
          additions: 2893,
          deletions: 25197,
          srcFiles: 4,
        }}
        scenarioCount={8}
      />,
    );

    expect(
      screen.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual([
      "43 commits",
      "422 files",
      "2893lines added",
      "25197lines removed",
      "4 src files",
      "8 scenarios",
    ]);
  });

  it("renders nothing when every figure is empty", () => {
    render(
      <ChangeMetricsBadges
        metrics={{
          commits: 0,
          filesChanged: 0,
          additions: 0,
          deletions: 0,
          srcFiles: 0,
        }}
        scenarioCount={0}
      />,
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
