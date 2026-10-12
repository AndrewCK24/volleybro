import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderInline } from "./render-inline";

describe("renderInline", () => {
  it("returns plain text unchanged", () => {
    render(<div>{renderInline("no code spans here")}</div>);
    expect(screen.getByText("no code spans here")).toBeInTheDocument();
  });

  it("renders one backtick-quoted span as code", () => {
    render(<div>{renderInline("see `file.ts` for details")}</div>);
    const code = screen.getByText("file.ts");
    expect(code.tagName).toBe("CODE");
  });

  it("renders several spans as separate code elements", () => {
    render(<div>{renderInline("rename `a.ts` to `b.ts`")}</div>);
    expect(screen.getByText("a.ts").tagName).toBe("CODE");
    expect(screen.getByText("b.ts").tagName).toBe("CODE");
  });

  it("leaves an unmatched backtick literal", () => {
    render(<div>{renderInline("a stray ` backtick")}</div>);
    expect(screen.getByText("a stray ` backtick")).toBeInTheDocument();
  });

  it("renders a matched strong span with semantic markup", () => {
    render(
      <div>{renderInline("A **critical** result with **two spans**.")}</div>,
    );

    expect(screen.getByText("critical")).toHaveProperty("tagName", "STRONG");
    expect(screen.getByText("two spans")).toHaveProperty("tagName", "STRONG");
  });

  it("leaves unmatched strong markers literal", () => {
    render(<div>{renderInline("An unmatched ** marker")}</div>);

    expect(screen.getByText("An unmatched ** marker")).toBeInTheDocument();
  });

  it("keeps complete code spans atomic while allowing code inside strong text", () => {
    render(
      <div role="group" aria-label="rendered inline text">
        {renderInline("`**literal**` and **bold `code`**")}
      </div>,
    );

    expect(screen.getByText("**literal**")).toHaveProperty("tagName", "CODE");
    expect(
      screen.getByRole("group", { name: "rendered inline text" }),
    ).toContainHTML("<strong>bold <code>code</code></strong>");
    expect(screen.getByText("code")).toHaveProperty("tagName", "CODE");
  });
});
