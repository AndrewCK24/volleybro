import { parseCliArgs } from "./parse-cli-args";

describe("parseCliArgs", () => {
  it("parses valued options and the help flag", () => {
    expect(parseCliArgs(["--audit", "audit.json", "--help"])).toEqual({
      audit: "audit.json",
      help: true,
    });
  });

  it("rejects unexpected positional arguments and missing option values", () => {
    expect(() => parseCliArgs(["audit.json"])).toThrow(
      "Unexpected argument: audit.json",
    );
    expect(() => parseCliArgs(["--audit", "--help"])).toThrow(
      "Missing value for --audit",
    );
  });

  it("ignores a separator only when the caller allows it", () => {
    expect(() => parseCliArgs(["--", "--audit", "audit.json"])).toThrow(
      "Missing value for --",
    );
    expect(
      parseCliArgs(["--", "--audit", "audit.json"], {
        separatorPolicy: "ignore",
      }),
    ).toEqual({ audit: "audit.json" });
  });
});
