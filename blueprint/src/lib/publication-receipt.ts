const RECEIPT_PATTERN =
  /<!-- emdash-g1-publication:v1\s+revision=([A-Za-z0-9_-]+)\s+sha256=([a-f0-9]{64})\s*-->/gu;

export function publicationReceiptProblem(input: {
  issueDescription: string;
  draftRevisionId: string;
  liveRevisionId?: string | null;
  actualContentHash: string;
}): string | undefined {
  const receipts = [...input.issueDescription.matchAll(RECEIPT_PATTERN)];
  if (receipts.length === 0)
    return "Linear has no accepted G1 revision for this Change.";
  const matchingReceipts = receipts.filter(
    (receipt) => receipt[1] === input.draftRevisionId,
  );
  if (matchingReceipts.length === 0)
    return "Linear's accepted G1 revision does not match this draft.";
  if (matchingReceipts.length > 1)
    return "Linear has duplicate G1 receipts for this draft revision.";
  const receipt = matchingReceipts[0];
  if (receipt[2] !== input.actualContentHash) {
    return "Linear's accepted G1 content hash does not match this draft.";
  }
  return undefined;
}
