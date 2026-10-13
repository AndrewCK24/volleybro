import { render, screen } from "@testing-library/react";

import { ChangeCard } from "./change-card";

describe("ChangeCard", () => {
  it("shows the derived status, date, and verified figures", () => {
    render(
      <ChangeCard
        change={{
          slug: "a",
          title: "A Change",
          href: "/changes/a",
          description: "What it does.",
          status: "merged",
          publishedAt: "2026-10-01T10:00:00.000Z",
          mergedAt: "2026-10-12T10:00:00.000Z",
          metrics: {
            commits: 3,
            filesChanged: 5,
            additions: 10,
            deletions: 2,
            srcFiles: 1,
          },
          scenarioCount: 2,
        }}
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/changes/a");
    expect(screen.getByText("A Change")).toBeInTheDocument();
    expect(screen.getByText("What it does.")).toBeInTheDocument();
    expect(screen.getByText("已合併")).toBeInTheDocument();
    expect(screen.getByText("2026-10-12")).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Change figures" }),
    ).toHaveTextContent("3 commits");
    expect(screen.queryByText(/archived|draft|G1|G2/u)).not.toBeInTheDocument();
  });
});
