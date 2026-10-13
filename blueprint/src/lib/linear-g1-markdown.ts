const linearReferencePattern =
  /<(issue|pull-request)\b([^>]*)>([\s\S]*?)<\/\1>/gu;

export function prepareLinearG1Markdown(content: string) {
  const transformations: string[] = [];
  let markdown = content.replace(
    /^\*\*Status:\*\*.*$/mu,
    "**G1 snapshot:** Accepted specification; current delivery status is derived from the linked GitHub pull requests.",
  );
  if (markdown !== content)
    transformations.push("replace-stale-linear-status-metadata");

  const beforeAuthorization = markdown;
  markdown = markdown.replace(
    /G1 authorizes ticket decomposition, not implementation or dispatch\./gu,
    "Under WORKFLOW.md, accepted G1 authorizes implementation through G2.",
  );
  if (markdown !== beforeAuthorization)
    transformations.push("align-g1-authorization-with-workflow");

  const beforeMergeStatus = markdown;
  markdown = markdown.replace(
    /Acceptance of this revision does not authorize merging PR\s+<pull-request\b[^>]*>[\s\S]*?<\/pull-request>\s+yet\./u,
    "Current delivery status is derived from the linked GitHub pull requests.",
  );
  if (markdown !== beforeMergeStatus)
    transformations.push("replace-stale-pr-merge-metadata");

  let convertedReference = false;
  markdown = markdown.replace(
    linearReferencePattern,
    (_element, _kind: string, attributes: string, label: string) => {
      const href = attributes.match(/\bhref="(https:\/\/[^"]+)"/u)?.[1];
      if (
        !href ||
        (!href.startsWith("https://linear.app/") &&
          !/^https:\/\/github\.com\/andrewck24\/volleybro\/pull\/[1-9]\d*$/u.test(
            href,
          ))
      ) {
        return label;
      }
      convertedReference = true;
      const safeLabel = label.trim().replace(/[\\[\]]/gu, "\\$&");
      return `[${safeLabel}](<${href}>)`;
    },
  );
  if (convertedReference)
    transformations.push("convert-linear-reference-elements-to-markdown-links");

  return { markdown, transformations };
}
