import { fireEvent, render, screen } from "@testing-library/react";
import { DecisionCardsList } from "@/components/decision-cards";
import { decisionCardsFor } from "@/lib/decision-cards";
import { parseDecisionRecord } from "@/lib/decision-record";
import oldDecision from "../../content/decisions/0045-two-gates-and-a-change-page-store.json";
import replacementDecision from "../../content/decisions/0061-people-review-at-two-gates.json";

const records = [oldDecision, replacementDecision].map(parseDecisionRecord);

jest.mock("fumadocs-ui/components/codeblock", () =>
  jest.requireActual("@test/support/fumadocs-codeblock"),
);

describe("canonical compact decision cards", () => {
  it("opens decision details and links to the replacement capability", () => {
    render(<DecisionCardsList cards={decisionCardsFor(records, ["0045"])} />);

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
    const [card] = decisionCardsFor(records, ["0045", "0061"]);
    expect(card?.supersededHref).toBe("#adr-0061");
  });

  it("links a PR-valued supersededBy to the pull request", () => {
    const prUrl = "https://github.com/andrewck24/volleybro/pull/610";
    const cards = decisionCardsFor(
      [parseDecisionRecord({ ...oldDecision, supersededBy: prUrl })],
      ["0045"],
    );
    render(<DecisionCardsList cards={cards} />);

    expect(screen.getByText("被 PR #610 取代")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ADR-0045/ }));
    expect(
      screen.getByRole("link", { name: "查看取代它的 PR #610" }),
    ).toHaveAttribute("href", prUrl);
  });

  it("renders cards in the order requested", () => {
    const cards = decisionCardsFor(records, ["0061", "0045"]);
    render(<DecisionCardsList cards={cards} />);

    expect(
      screen
        .getAllByRole("button")
        .map((button) => button.textContent?.match(/ADR-\d{4}/u)?.[0]),
    ).toEqual(["ADR-0061", "ADR-0045"]);
  });
});
