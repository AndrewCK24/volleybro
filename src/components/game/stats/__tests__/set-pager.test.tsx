import { Stats } from "@/components/game/stats";
import { makeStore, type AppStore } from "@/lib/redux/store";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";

const gameWithSets = (setCount: number) => ({
  id: "game-1",
  sets: Array.from({ length: setCount }, () => ({
    options: { serve: "home" },
    win: null,
    entries: [],
  })),
});

let store: AppStore;

const renderStats = (setCount: number) =>
  render(
    <Provider store={store}>
      <SWRConfig
        value={{
          provider: () =>
            new Map([
              ["/api/games/game-1", { data: gameWithSets(setCount) }],
            ]) as never,
          dedupingInterval: 0,
        }}
      >
        <Stats gameId="game-1" />
      </SWRConfig>
    </Provider>,
  );

beforeEach(() => {
  store = makeStore();
});

describe("Stats set pager header", () => {
  it("shows the overview with a button to the first set and no previous button", () => {
    renderStats(2);

    expect(
      screen.getByRole("heading", { name: "數據總覽" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "總覽" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "第 1 局" })).toBeInTheDocument();
  });

  it("moves from the overview to a set, offering overview and the next set", async () => {
    const user = userEvent.setup();
    renderStats(2);

    await user.click(screen.getByRole("button", { name: "第 1 局" }));

    expect(
      screen.getByRole("heading", { name: "第 1 局數據" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "總覽" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "第 2 局" })).toBeInTheDocument();
  });

  it("has no next button on the last set", async () => {
    const user = userEvent.setup();
    renderStats(2);

    await user.click(screen.getByRole("button", { name: "第 1 局" }));
    await user.click(screen.getByRole("button", { name: "第 2 局" }));

    expect(
      screen.getByRole("heading", { name: "第 2 局數據" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "第 1 局" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "第 3 局" }),
    ).not.toBeInTheDocument();
  });
});
