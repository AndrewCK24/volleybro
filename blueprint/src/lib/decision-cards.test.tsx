import { fireEvent, render, screen } from "@testing-library/react";
import { DecisionCardsList } from "@/components/decision-cards";
import { decisionCardsForIds } from "@/lib/decision-cards";
import { changeMdxComponents } from "@/lib/mdx-components";

jest.mock("fumadocs-ui/mdx", () => ({ __esModule: true, default: {} }));
jest.mock("fumadocs-ui/components/codeblock", () =>
  jest.requireActual("@test/support/fumadocs-codeblock"),
);

describe("Change DecisionCards adapter", () => {
  it("maps the historical DecisionCards tag to compact canonical cards", () => {
    function DecisionCardsTestAdapter({ ids = [] }: { ids?: string[] }) {
      return <DecisionCardsList cards={decisionCardsForIds(ids)} />;
    }

    const { DecisionCards } = changeMdxComponents(DecisionCardsTestAdapter);
    render(<DecisionCards ids={["0045", "missing"]} />);

    const trigger = screen.getByRole("button", { name: /ADR-0045/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("button")).toHaveLength(1);
    fireEvent.click(trigger);

    expect(
      screen.getByRole("link", { name: "查看取代它的 ADR-0061" }),
    ).toHaveAttribute("href", "/features/platform/delivery-workflow#adr-0061");
    expect(
      screen.getByText("pnpm blueprint:changes:publish <slug>"),
    ).toHaveProperty("tagName", "CODE");
  });

  it("links to a replacement on the same page", () => {
    const [card] = decisionCardsForIds(["0045", "0061"]);
    expect(card?.supersededHref).toBe("#adr-0061");
  });

  it("renders cards in the order requested", () => {
    const cards = decisionCardsForIds(["0061", "0045"]);
    render(<DecisionCardsList cards={cards} />);

    expect(
      screen
        .getAllByRole("button")
        .map((button) => button.textContent?.match(/ADR-\d{4}/u)?.[0]),
    ).toEqual(["ADR-0061", "ADR-0045"]);
  });
});
