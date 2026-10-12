import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentType } from "react";

import { changeMdxComponents } from "@/lib/mdx-components";

jest.mock("fumadocs-ui/mdx", () => ({ __esModule: true, default: {} }));
jest.mock("fumadocs-ui/components/codeblock", () =>
  jest.requireActual("@test/support/fumadocs-codeblock"),
);

describe("changeMdxComponents", () => {
  it("keeps the DecisionCards ids adapter and its supersession link", () => {
    const components = changeMdxComponents();
    const DecisionCards = components.DecisionCards as ComponentType<{
      ids?: string[];
    }>;
    render(<DecisionCards ids={["0045"]} />);

    expect(screen.getByRole("button", { name: /ADR-0045/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    fireEvent.click(screen.getByRole("button", { name: /ADR-0045/ }));

    expect(
      screen.getByRole("link", { name: "查看取代它的 ADR-0061" }),
    ).toHaveAttribute("href", "/features/platform/delivery-workflow#adr-0061");
    expect(
      screen.getByText("pnpm blueprint:changes:publish <slug>"),
    ).toHaveProperty("tagName", "CODE");
  });
});
