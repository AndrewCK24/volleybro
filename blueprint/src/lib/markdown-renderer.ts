import { createMarkdownProcessor } from "@astrojs/markdown-remark";

let processorPromise: ReturnType<typeof createMarkdownProcessor> | undefined;

export async function renderBlueprintMarkdown(
  markdown: string,
): Promise<string> {
  processorPromise ??= createMarkdownProcessor({ syntaxHighlight: false });
  const processor = await processorPromise;
  const result = await processor.render(markdown);
  return result.code;
}
