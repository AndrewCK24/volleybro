const receiptPattern =
  /<!-- emdash-g1-publication:v1\s+revision=([A-Za-z0-9_-]+)\s+sha256=([a-f0-9]{64})\s*-->/u;
const legacyReceiptPattern =
  /<!-- emdash-legacy-entry:v1\s+snapshot=([a-f0-9]{40})\s+slug=([a-z0-9]+(?:-[a-z0-9]+)*)\s+sha256=([a-f0-9]{64})\s*-->/gu;

export const LEGACY_STORE_SNAPSHOT = "f010a9e020be8a342a7c7bafc31e2a361565135d";

export function publicationReceiptProblem(input: {
  issueDescription: string;
  draftRevisionId: string;
  liveRevisionId?: string | null;
  actualContentHash: string;
}): string | undefined {
  const receipt = receiptPattern.exec(input.issueDescription);
  if (!receipt) return "Linear has no accepted G1 revision for this Change.";
  if (!input.liveRevisionId && receipt[1] !== input.draftRevisionId) {
    return "Linear's accepted G1 revision does not match this unpublished draft.";
  }
  if (receipt[2] !== input.actualContentHash) {
    return "Linear's accepted G1 content hash does not match this draft.";
  }
  return undefined;
}

export function legacyImportReceiptProblem(input: {
  migrationIssueDescription: string;
  actualContentHash: string;
  slug: string;
  hasLegacyHtml: boolean;
}): string | undefined {
  if (!input.hasLegacyHtml)
    return "Legacy publication requires a migrated legacy_html block.";
  const matches = [
    ...input.migrationIssueDescription.matchAll(legacyReceiptPattern),
  ].filter((match) => match[2] === input.slug);
  if (matches.length !== 1) {
    return "Linear has no unique verified legacy migration receipt for this Change.";
  }
  const receipt = matches[0];
  if (receipt[1] !== LEGACY_STORE_SNAPSHOT) {
    return "Linear's legacy migration receipt names a different store snapshot.";
  }
  if (receipt[3] !== input.actualContentHash) {
    return "Linear's legacy migration content hash does not match this draft.";
  }
  return undefined;
}
