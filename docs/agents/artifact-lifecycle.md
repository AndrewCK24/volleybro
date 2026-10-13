# Artifact lifecycle adapter

| Class                                  | Authority                                                         | Lifecycle                                                                                                                                                         |
| -------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Working / operational                  | Linear issue, ticket graph, workpad and progress                  | Mutable during delivery; keep accepted revision references and progress evidence.                                                                                 |
| Accepted specification and Change page | One EmDash entry per Blueprint Change                             | Draft and signed private preview before G1; publish the accepted revision after Linear records the matching revision/hash. Renew G1 for substantive spec changes. |
| Research                               | Owning-Team Linear Doc                                            | Preserve cited findings, evidence gaps and dissent; promote only adopted knowledge to its repository authority.                                                   |
| G2 evidence                            | GitHub PR and exact reviewed head                                 | PR records the accepted EmDash revision/hash, verification and review results. G2 does not republish the Change page.                                             |
| Historical Change content              | EmDash entry migrated from the protected legacy snapshot          | Preserve accepted text, proposal/review sections, shard details and anchors. Older Team Docs remain in Linear.                                                    |
| Canonical current                      | Features, Design System authority, glossary, ADRs, code and tests | Update affected knowledge on the delivery branch before PR/G2; later changes explicitly supersede it.                                                             |

## G2 evidence retention

G2 evidence lives in the GitHub PR: reviewed head, accepted EmDash revision/hash, verification and review results. The developer's explicit instruction to merge and clean up authorizes that exact reviewed revision; a direct human merge also constitutes acceptance. Native PR merge identity and Git ancestry prove completion. Do not add a second G2 event receiver, bot receipt or repository copy of the complete specification.

Preserve the operational authorization and PR identity on the execution issue. Mark the issue and its slices Done only after merge. Platform credentials, Cloudflare resource creation, production cutover and legacy-ref deletion remain separate activation/cleanup actions when their gate is not part of the accepted G1.

## Same-branch knowledge promotion

Before the Pre-PR review, assess observable behavior, capability constraints and reusable UI/UX rules. Promote only supported knowledge to the narrowest affected Features; reusable design rules follow `DESIGN.md` and its explicit supplements, with Blueprint presenting that authority. Record unchanged-page decisions and their reason in the PR. Stable vocabulary follows `docs/agents/domain.md`; ADRs already occupy permanent paths and are never promoted or renumbered.

Run applicable validation and independent review on these edits with the delivery diff. PR feedback that changes behavior or constraints also updates this knowledge on the same branch before renewed G2 acceptance. The verified branch describes the intended merged state; it becomes current on the default branch when merged.

Keep tracker IDs, workspace/claim/retry state and transcripts out of durable Blueprint prose; the EmDash `linear_issue` field is the intentional issue lookup index. Historical Spectra/OpenSpec documents remain snapshots. Historical Change Reviews remain read-only content in the migrated EmDash page.

## Research and working notes

Keep full research in an independent owning-Team Linear Doc. Preserve date, source links, what each supports, evidence gaps and relevant dissent. The requesting issue holds the conclusion and Doc link, not a second editable copy.

Research is not an accepted specification. The complete G1 spec belongs in the EmDash Change entry under `docs/agents/issue-tracker.md`. Working measurements and plans stay operational; only adopted knowledge needed to understand the delivered capability enters repository authorities.
