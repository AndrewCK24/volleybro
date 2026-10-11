# Artifact lifecycle adapter

| Class                  | Authority                                                                 | Lifecycle                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Working / operational  | Linear issue spec, ticket graph, workpad, progress                        | Mutable during delivery; retain accepted-contract references and extract verified knowledge before PR.     |
| Accepted specification | Independent owning-Team Doc with full G1 spec and JSON receipt            | Preserve each accepted version; renewed G1 creates another Doc rather than rewriting history.              |
| Research               | Owning-Team Doc with complete cited findings                              | Issue carries conclusion and link; promote only adopted, verified knowledge to its repository authority.   |
| G2 evidence            | GitHub PR and explicit developer authorization                            | Bind acceptance to the exact reviewed head; preserve evidence after merge.                                 |
| Visual / historical    | Optional Proposal and read-only historical Reviews in the existing store  | Visual supplement only; preserve accepted historical contents and anchors.                                 |
| Canonical current      | Features, Design System authority, glossary, ADRs, code/tests, Changesets | Update affected knowledge on the same delivery branch before PR/G2; later changes explicitly supersede it. |

## G2 evidence retention

G2 evidence lives in the PR: reviewed head, accepted G1 snapshot/hash, verification and review results. The developer's explicit conversation instruction to merge and clean up authorizes that reviewed revision; a direct human Merge also accepts it. Native PR merge identity and Git ancestry prove completion. There is no G2 event receiver, candidate comment, bot receipt or artifact recovery. Preserve the operational authorization/revision record on the execution issue; do not introduce a repository receipt or duplicate full specification.

## Same-branch knowledge promotion

Before the Pre-PR review, assess observable behavior, capability constraints and reusable UI/UX rules. Promote only supported knowledge to the narrowest affected Features; reusable design rules follow `DESIGN.md` and its explicit supplements, with Blueprint presenting that authority. Record unchanged-page decisions and their reason in the PR. Stable vocabulary follows `docs/agents/domain.md`; ADRs already occupy permanent paths and are never promoted or renumbered.

Run applicable validation and independent review on these edits with the delivery diff. PR feedback that changes behavior or constraints also updates this knowledge on the same branch before renewed acceptance. The verified branch describes the intended merged state; it becomes current on the default branch when merged. Merge does no second documentation-sync PR.

Keep tracker IDs, workspace/claim/retry state and transcripts outside durable Blueprint content. Historical Spectra/OpenSpec documents remain snapshots; promote only still-current knowledge when their migration is authorized. Historical Change Reviews stay read-only in their original files; the shared route changes their presentation without rewriting accepted content.

## Research and working notes

Adapt `research` storage to an independent Linear Doc attached to the owning Team. Preserve full findings, date, source links, what each supports, evidence gaps and relevant dissent. The requesting issue holds the conclusion and Doc link, not a second editable copy. Disposable drafts may be removed after saved content is read back and confirmed complete.

Research is not an accepted specification. Create the complete G1 snapshot through `docs/agents/issue-tracker.md`. Working measurements and plans stay operational; only adopted knowledge needed to understand the delivered capability enters repository authorities. No local backup or repository receipt is required.
