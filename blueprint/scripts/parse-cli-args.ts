type SeparatorPolicy = "ignore" | "reject";

export function parseCliArgs(
  args: string[],
  { separatorPolicy = "reject" }: { separatorPolicy?: SeparatorPolicy } = {},
): Record<string, string | true> {
  const values: Record<string, string | true> = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--" && separatorPolicy === "ignore") continue;
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}`);
    const key = arg.slice(2);
    if (key === "help") values.help = true;
    else {
      const value = args[index + 1];
      if (!value || value.startsWith("--"))
        throw new Error(`Missing value for --${key}`);
      values[key] = value;
      index += 1;
    }
  }
  return values;
}
