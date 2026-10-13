/** @jest-environment node */

import { publicationReceiptProblem } from "./publication-receipt";

const hash = "a".repeat(64);
const receipt = (revision: string, acceptedHash = hash) =>
  `<!-- emdash-g1-publication:v1 revision=${revision} sha256=${acceptedHash} -->`;

describe("publicationReceiptProblem", () => {
  it("blocks publication without a parseable Linear G1 receipt", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: "No G1 receipt",
        draftRevisionId: "revision-1",
        actualContentHash: hash,
      }),
    ).toBe("Linear has no accepted G1 revision for this Change.");
  });

  it("requires the exact accepted draft revision on first publication", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("revision-1"),
        draftRevisionId: "revision-2",
        actualContentHash: hash,
      }),
    ).toBe("Linear's accepted G1 revision does not match this draft.");
  });

  it("requires a newly accepted revision after a published draft changes", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("revision-1"),
        draftRevisionId: "revision-2",
        liveRevisionId: "live-revision",
        actualContentHash: hash,
      }),
    ).toBe("Linear's accepted G1 revision does not match this draft.");
  });

  it("rejects a published entry's PR-index-only revision update without new acceptance", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("accepted-revision"),
        draftRevisionId: "pr-index-update",
        liveRevisionId: "live-revision",
        actualContentHash: hash,
      }),
    ).toBe("Linear's accepted G1 revision does not match this draft.");
  });

  it("blocks changed content even when the accepted draft revision matches", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("revision-1"),
        draftRevisionId: "revision-1",
        liveRevisionId: "live-revision",
        actualContentHash: "b".repeat(64),
      }),
    ).toBe("Linear's accepted G1 content hash does not match this draft.");
  });

  it("allows the exact revision and hash accepted for initial publication", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: receipt("revision-1"),
        draftRevisionId: "revision-1",
        actualContentHash: hash,
      }),
    ).toBeUndefined();
  });

  it("matches one ordinary receipt for this revision among receipts for other drafts", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: `${receipt("earlier-revision")}\n${receipt("revision-1")}`,
        draftRevisionId: "revision-1",
        actualContentHash: hash,
      }),
    ).toBeUndefined();
  });

  it("rejects duplicate receipts for the same draft revision", () => {
    expect(
      publicationReceiptProblem({
        issueDescription: `${receipt("revision-1")}\n${receipt("revision-1")}`,
        draftRevisionId: "revision-1",
        actualContentHash: hash,
      }),
    ).toBe("Linear has duplicate G1 receipts for this draft revision.");
  });
});
