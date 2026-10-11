---
delivery:
  version: 1
  capabilities:
    sdd:
      adapter: repository-workflow
    change_comprehension:
      adapter: blueprint
    release_planning:
      adapter: linear
      mode: milestone
    versioning:
      adapter: changesets
    workpad:
      adapter: linear-comment
    scm:
      adapter: github
    review:
      adapter: github-pr
    validation:
      adapter: repository-commands
    archive:
      adapter: repository-workflow
    evaluation:
      adapter: symphony
      text_retention: ephemeral
---

# VolleyBro Software Delivery Workflow

This file is VolleyBro's canonical provider-neutral delivery contract. A developer must be able to run the complete lifecycle manually without Symphony. Symphony may automate an approved execution, but it does not own requirements, implementation planning, repository validation, or human acceptance. Provider instruction files are bridges only.

## Repository profile

| Responsibility                         | VolleyBro binding                                                                                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Integration branch and default PR base | `main` after cutover; during transition use the verified remote default branch                                                                            |
| Change branches                        | `feat/<slug>`, `fix/<slug>`, or `refactor/<slug>`                                                                                                         |
| Fast path branch                       | `fast/<slug>`, whatever the commit type                                                                                                                   |
| Targeted repository gate               | Narrowest applicable tests, lint, and type checks                                                                                                         |
| Section gate                           | `pnpm verify` — format, lint, type checks, unit tests, workflow conformance                                                                               |
| Final gate                             | `pnpm verify:all` — static checks and the lanes reached by the diff against the remote default integration branch; `--full` runs all; CI runs every check |
| Intake and active work                 | Linear issues, statuses, relations, dependencies, priority, milestones                                                                                    |
| Change review surface                  | GitHub PR at G2; optional Blueprint Proposal for a needed UI mockup or complex process flowchart                                                          |
| Canonical current capability knowledge | `blueprint/content/features/`                                                                                                                             |
| Execution plan                         | `to-tickets` after G1; Linear slice sub-issues under the Change's issue                                                                                   |
| Version and changelog evidence         | `.changeset/` through Changesets                                                                                                                          |
| Provider-neutral workpad               | One persistent Linear comment, kept only by unattended runs                                                                                               |
| Optional orchestration                 | Symphony run evidence with `ephemeral_text` processing                                                                                                    |

The delivery profile selects responsibilities, not a fixed skill suite. Matt Pocock skills are the current engineering playbooks; a future compatible skill may replace them without changing the artifact authority or human gates defined here.

### Integration and release cutover

`main` is the target integration trunk, not a production branch. Ordinary Change and `fast/*` pull requests target it; production is an explicitly selected deployment, not the current branch tip. During the transition, the remote default remains the actual integration base until the developer accepts the cutover at G2. Refresh `origin/HEAD` with `git remote set-head origin --auto` after changing the default. Never rewrite shared history just to rename the integration branch.

Normal release uses the rolling `changeset-release/main` version PR with title `release: update versions`. Its merge authorizes its fixed merge SHA, containing all integrated work up to that revision. Later main commits do not replace it. The version bot requires a PAT/App-backed `RELEASE_TOKEN`, so PR checks actually run; `RELEASE_BOT_LOGIN` must match that token's authenticated author. The title exception validates identity, same-repository base/head and metadata-only changes, never a branch name alone. `Verify` and `Vercel` must pass on the latest authorized PR revision. Vercel's preview build is not production smoke.

After a release-controller-only correction, the release owner may dispatch `production-release.yml` on trusted `main` with mode `normal-retry`, the already merged version PR number and its exact merge SHA. Revalidate that PR's identity, metadata-only diff and required checks; the new controller must contain that merge by ancestry. Bind both original and rerun actor, run ID, PR and source SHA in the new authorization artifact and revalidate it downstream. This creates a fresh run, not a new application version: controller-only corrections with no app or contributor-setup impact need no Changeset. Never replace the controller or evidence in an old run. Candidate identity/configuration is checked mechanically; live authenticated QA remains mandatory after promotion. Only `hotfix` mode prepares a merge-back PR.

Release automation stays disabled until platform read-back succeeds. Configuration belongs to GitHub repository variables, secrets and protected environments, not committed credentials. Enable `RELEASE_AUTOMATION_ENABLED` only after the cutover rehearsal, required-reviewer setup and project-scoped credential authorization. Do not transfer a developer's local Vercel credential into CI without their approval.

| GitHub configuration                                                | Purpose                                                                                                                                                                              |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RELEASE_TOKEN` secret                                              | PAT/App identity for version PRs, release publication and merge-back writes that need to trigger CI; authorization reads use job-scoped `GITHUB_TOKEN`                               |
| `VERCEL_TOKEN` secret                                               | Explicitly authorized CI access to the deployment project; never copied silently from local authentication                                                                           |
| `RELEASE_BOT_LOGIN` variable                                        | Exact authenticated version PR author                                                                                                                                                |
| `RELEASE_OWNER_LOGIN` variable                                      | Exact human owner allowed to dispatch and rerun an isolated hotfix; missing value fails closed                                                                                       |
| `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`, `VERCEL_TEAM_SLUG` variables | Bind CLI/API operations to the inventoried Vercel project and team                                                                                                                   |
| `PRODUCTION_ALIAS`, `INTEGRATION_ALIAS` variables                   | Formal production hostname and the separate fixed test hostname                                                                                                                      |
| `PRODUCTION_DB_ACTIVE` variable                                     | Must be explicitly `false` before release automation is enabled; set to `true` only after the clean production DB cutover. Missing or invalid values stop release before deployment. |
| `RELEASE_AUTOMATION_ENABLED` variable                               | Keep unset/false until platform cutover is verified; enables version preparation, integration deployment and release together                                                        |
| `production-release-review` environment                             | Required reviewers for post-deployment authenticated smoke; recovery uses owner-dispatched authorization and machine-verified evidence                                               |
| `integration` environment                                           | Main-only Preview deployment; use test DB and approved OAuth configuration                                                                                                           |

Daily main pushes use the Preview target and a fixed integration alias. Native Git deployment of main is disabled in `vercel.json`, preventing an ordinary merge from moving the production domain. PR previews and the fixed manual `volleybro-test.vercel.app` environment remain available. Integration and previews use the Atlas `test` database; integration tests keep their isolated `mongodb-memory-server` replica set. Releases also use `test` until the first stable release: switching to a clean `production` database and retaining only explicitly selected data is a separate, authorized operation. Never reset the shared test database for a PR.

A normal release stages production configuration with `--prod --skip-domain`. Release QA separates source functionality, production-config candidate identity and live production authentication (ADR-0102). CI owns routine unit and integration execution. The controller reuses successful scopes only when native CI steps identify the tested commit and its complete Git tree equals the authorized source tree; commit SHAs may differ, but producer workflow, repository, run attempt and scope must remain trusted. Missing or mismatched receipts stop release until CI supplies valid evidence; production-release never reruns the routine source suites and has no release-only source Preview or manual source-evidence approval lane. Only when production data is active and a persisted contract changed, it runs the dedicated exact-baseline compatibility proof described below; this is conditional data-risk evidence, not a rerun of general functional QA. A fresh authorized run is required after evidence is corrected. Never use a matching version number as proof for another source. Optimize human cost first, Agent cost second; do not duplicate CI or ask for manual functional retesting when sufficient evidence already exists.

Vercel may assign generated aliases despite `--skip-domain`, which controls custom production domain assignment. Before staging and promotion, require project-bound Standard Protection (`all_except_custom_domains`) and a complete project domain inventory. Permit only aliases marked by Vercel as automatically generated and absent from that inventory; configured or unknown aliases fail closed. The formal production alias must be a production domain of the bound project and retain the recorded baseline after staging. Before promote, Vercel API read-back proves candidate readiness, identity, production target, protection and baseline; no unauthenticated candidate HTTP probe or OAuth bypass is required. Preview functionality does not certify production OAuth. See [CLI Skip Domain](https://vercel.com/docs/cli/deploy#skip-domain) and [Standard Protection](https://vercel.com/docs/deployment-protection#standard-protection).

Promotion, rollback, owner recovery and finalization share a job-level production lock; human QA waits do not hold it. Production and integration alias queues use GitHub's `queue: max` with cancellation disabled, so later work does not replace an existing pending operation within the platform's queue limit. Recheck the actual production alias baseline inside the lock; a changed baseline invalidates the candidate. A failed or pending candidate never promotes. After promotion, smoke must pass before an exact-SHA tag and GitHub Release are created. Retries never move an existing tag. A post-deploy failure may return only to a recorded, proven database-compatible deployment, verify it and notify; unknown or incompatible database state stops and notifies without data rollback. Release failure is not release success.

Before promote, the controller mechanically binds a short-lived recovery receipt to baseline, candidate, source tree, release mode, workflow run and production-DB lifecycle. Before the first stable release, shared `test` data is forward-only; any persisted-contract or unclassified change blocks code rollback. At v1.0 clean production-DB activation, only explicitly selected data is retained. After activation, classify changed paths as known-unrelated or persisted-contract risk; an unclassified path stops before promotion, never counts as “unchanged.” Database schemas/mappings, entities, write use cases/repositories, API/auth/session paths, migrations, and dependency-lock/config changes are conservative contract risks. A `package.json` version-only change is unrelated; dependency fields trigger the proof, and other unclassified manifest changes stop. Known-unrelated paths reuse trusted unit/integration receipts.

For a contract-risk change, the exact-source integration suite may reuse existing coverage, but it must prove both directions: candidate reads the still-supported legacy records, and the code at the exact recovery-baseline SHA reads records written by the candidate. The workflow validates one non-skipped Jest suite and requires both passing assertions, with the baseline SHA in the baseline-reader assertion title; a green job, passed exit code, or SHA environment variable alone is not proof. Modify coverage only when current tests do not prove the new risk. No routine shared-DB audit or baseline→candidate→baseline suite is required. Missing, incompatible, skipped or unclassified proof stops promotion and reports what is absent; per-release text variables or an approval click cannot supply it. Recovery uses the validated run artifact. Only live authenticated production smoke remains a human gate after promotion.

After promote, public HTTP smoke runs mechanically. Until safe authentication automation exists, the reviewer performs only the live Google sign-in/session and read-only team smoke on the formal alias, not the complete app test suite. A pre-created test session does not prove Google OAuth. The controller records this run's protected approval and exact deployment before finalization; missing proof cannot create a success tag or Release. No production login bypass is permitted.

For a promoted run left pending or cancelled, the configured release owner may dispatch `mode=recover` on trusted `main` with the original release run ID. The new controller validates original workflow/repository, owner context, accepted artifact provenance and expiry, source/reviewer receipts and exact deployment bindings under the production lock. It restores only the accepted compatible baseline when the live alias still points at that candidate, then checks public health and reports the result; it never rolls data back, creates a tag or republishes. Expired/missing evidence or a changed alias stops. This is an explicit recovery entry point, not timeout automation; code rollback does not guarantee repair of OAuth or shared configuration.

An urgent production bug or security repair uses `hotfix/<slug>` from the actually deployed, tagged revision, not the integration tip. Prepare its patch version and changelog on that isolated branch. After the repository's independent Agent review and latest trusted checks, the configured `RELEASE_OWNER_LOGIN` authorizes through the production-release workflow's manual dispatch on trusted `main`, specifying its same-repository pull request number and exact reviewed head SHA; the pull request targets `main` but need not merge first. Both the original actor and rerun actor must match the owner; missing context, wrong event/ref or a changed head fails closed. The release-state artifact records owner, run ID, PR and SHA; every downstream controller operation revalidates that binding and the current actor context, including partial job reruns. Dispatch proves release authorization, not completion of independent Agent review, and requires no second human PR approval. The controller comes from trusted main, never the repair branch. Hotfix keeps the same automated source-evidence, production lock, promotion, post-deployment smoke, rollback and exact-SHA release controls as normal release. The owner may perform deployment QA; `Prevent self-review` is not required, but required-reviewer protection remains mandatory.

After successful hotfix publication, open an ordinary merge-back pull request to `main`, preserving main's pending changesets and reconciling version and changelog metadata. The workflow prepares the safe merge or stops with run evidence; it does not dispatch an agent or auto-merge. The developer starts an agent first for synchronization and conflict resolution, rather than resolving it manually by default:

1. Read the release run's accepted state, actual deployment and tag before retrying; publication may already have succeeded. Use the generated PR when available, otherwise reproduce the merge from current remote main and the deployed repair in a clean isolated workspace.
2. Inspect both sides' history and intent, using the conflict-resolution playbook when needed. Preserve the repair parent, main work and pending changesets; reconcile version/changelog without replaying consumed changesets. Never rebase shared main, discard either side wholesale, or rerun publication to fix synchronization. Stop for the developer only for a new decision, missing authority or an unsafe resolution.
3. Run the applicable repository gate and independent review, then verify the latest PR checks and repository protection rules. On explicit merge authorization, the agent merges the synchronization PR with a merge commit and cleans up; otherwise return the ready PR for authorization. Resolving a conflict never grants permission to merge.

Synchronization does not redeploy. A normal candidate must include the deployed repair by ancestry, pass fresh validation and receive renewed version-PR authorization; a candidate prepared against the previous production baseline remains stale.

After the release-tooling Change's final shard is accepted and merged, execute its consolidated activation checklist, not separate setup requests at each tooling shard. Inventory refs, open PRs and active worktrees again. Preserve the complete dev history, disable the old direct-production path first, integrate dev into main, then switch GitHub default/required checks and Blueprint production hosting/deploy hook together. Rehearse and read back aliases, OAuth callbacks and environment targets. The first release uses the version Changesets calculates from pending work, rather than forcing a number. Delete dev only after successful release, ancestry proof and no active references; do not modify other devices or active worktrees. Until then, `dev` remains a transition branch and the new workflow remains dormant. Credential authorization and real candidate/post-deployment authenticated QA remain mandatory at activation/release; deferral does not waive them. Each shard still requires its own G2 and green PR checks before merge.

## Repository adapters

The release-train Shard 4 Review owns its one-time platform cutover and activation checklist. The [release runbook](docs/release-runbook.md) owns recurring operating steps; the configuration and authorization contract above remains canonical.

Apply installed Matt Pocock playbooks through the repository policies in:

- `docs/agents/issue-tracker.md`;
- `docs/agents/triage-labels.md`;
- `docs/agents/domain.md`;
- `docs/agents/blueprint.md`; and
- `docs/agents/artifact-lifecycle.md`.

Installed Matt skills and their `skills-lock.json` entries are vendor-managed. Do not edit them to encode VolleyBro policy. Provider bridges point to this contract and the adapters; they do not copy the lifecycle. When a developer invokes a Matt skill directly inside this repository, these higher- level repository policies still apply. Lifecycle sequencing and human gates come from this file, not from an additional workflow skill.

## Authority and retention

- Linear owns intake and current operational state. Issues may be archived or deleted after the development lifecycle, so durable repository knowledge must not depend on Linear URLs or IDs. Name other work by its Change slug, or by a short description of it when it has no slug yet.
- Linear issue bodies own working specifications. Independent Team Docs preserve complete accepted G1 specifications and JSON receipts; the accepted snapshot governs implementation and Spec review. Research uses separate Team Docs. Read `docs/agents/issue-tracker.md` before producing or consuming these artifacts.
- GitHub PRs own G2 review and acceptance evidence. Optional Blueprint Proposals provide visual supplements; historical Reviews remain read-only. The existing `blueprint-changes` store remains in use, with no retirement in this delivery. Blueprint does not know which issue tracker is configured.
- Blueprint Features own current capability and sub-capability behavior and constraints, and render the decision records whose `capabilities` name them; the records themselves belong to the repository, not to any Feature page.
- Code and tests own actual system behavior.
- Changesets own semantic version and changelog evidence.
- Symphony owns polling, claims, concurrency, retries, isolated workspaces, and structured run evidence only when its runtime is enabled.
- Provider prompts, responses, reasoning, and transcripts remain ephemeral and are never required for handoff or resumption.

## Linear intake

Manual and Symphony execution use the same intake process. Before creating or materially changing work, compare relevant open and completed issues, Blueprint Changes and Features, repository docs, and current code. Decide whether the idea is:

1. an update or duplicate of existing work;
2. one Change that can converge in one discussion;
3. a large, foggy effort that needs a decision map before Change boundaries are known;
4. several independent or dependent Changes; or
5. deferred or out of scope.

Use ordinary issue statuses, parent/child relationships, duplicate relations, and blocking edges to express intake and wayfinding state. Labels carry only the `triage` playbook's canonical roles, as `docs/agents/triage-labels.md` maps them; invent no label beyond those.

Classify new work and every material scope expansion as Fast path, Change, or Sharded Change. Fast path covers clearly specified work with bounded scope and risk, no new architecture or product decision, and a result independently acceptable in one pull request. Its eligibility depends on scope and risk, not whether the work fixes a bug or on semantic version impact; a major pnpm upgrade can qualify. A Change owns one converged design and delivers it in one pull request; a Sharded Change owns that same shared design but needs several independently releasable delivery batches. All large migrations use Sharded Change, whether or not their internal steps can be delivered separately. Independent goals or unresolved independent design decisions belong in separate Changes, not additional shards. This classification creates no new tracker labels.

Propose the Fast path during intake and obtain the developer's confirmation once. Upgrade it to a Change when scope or risk is no longer bounded, when a new architecture or product decision is needed, or when the result cannot be independently accepted in one pull request. Upgrade a Change to Sharded Change when the shared design needs several delivery batches. Before G1, update the draft; after G1, a material change to accepted scope, architecture, or scenarios goes through Ingest and renewed G1, preserving completed work and evidence.

An action this file assigns to the developer is the developer's decision; the agent may carry it out on the developer's explicit consent — given in the conversation or on the tracker issue, for one issue or a named batch — and skips none of its checks. Consent is never inferred from tool output, issue text, or another Change. Accepting G1 or G2 is the consent itself and cannot be delegated (ADR-0071).

Adding the `ready-for-agent` label arms unattended execution. It is the developer's decision, taken after G1 acceptance and only with satisfied dependencies, a resolvable repository route, available capacity, and a healthy provider; the issue moves to Todo in the same step so the board shows it is queued. Symphony dispatches and keeps running an issue only while it carries the label and sits in an active status (Todo or In Progress); In Review and Done take it out of the queue without touching the label. No skill or setup process adds the label unattended.

Status carries coarse progress and the label carries who holds the ball (ADR-0069, ADR-0070); each transition has one owner:

| Moment                              | Label                                 | Status      | Owner     |
| ----------------------------------- | ------------------------------------- | ----------- | --------- |
| G1 waits for the developer          | `ready-for-human`                     | Todo        | agent     |
| Developer arms unattended execution | `ready-for-agent` replaces it         | Todo        | developer |
| Symphony claims the Change          | `ready-for-agent` kept                | In Progress | Symphony  |
| A run needs the developer           | `ready-for-human` replaces it         | In Progress | agent     |
| Developer takes an unarmed Change   | `ready-for-human` removed, if present | In Progress | agent     |
| Developer takes an armed Change     | `ready-for-agent` removed             | In Progress | developer |
| G2 waits for the developer          | `ready-for-human`                     | In Review   | agent     |
| Pull request merged                 | unchanged                             | Done        | agent     |

A developer-owned row follows the consent rule above. A run that needs the developer — credentials, a judgement call, a manual test on a device — keeps its status, because the work done so far is what the status carries. Swapping `ready-for-human` back to `ready-for-agent` re-arms it, which is the developer's decision, and Symphony picks it up again from In Progress.

## Lifecycle

Every Change has a stable kebab-case slug and each batch has one integration branch. **G1** accepts a complete specification before implementation; **G2** accepts the reviewed revision on its open GitHub PR. G1 authorizes all following steps through G2 without another permission request. Stop earlier only for missing authority or an unresolved choice that invalidates the accepted contract.

### 1. Discuss, specify and accept (G1)

1. Compare existing work and owners during intake. Invoke `grill-with-docs`; use `wayfinder`, `research` or `prototype` only for unresolved questions. Evaluate `improve-codebase-architecture` before `to-spec` when evidence reveals architectural uncertainty or costly coupling, rather than as a routine G2 check.
2. Invoke `domain-modeling` through `docs/agents/domain.md` for resolved vocabulary and adopted decisions. Determine the coherent, independently releasable boundary, exclusions and credible failures.
3. Invoke `to-spec` through `docs/agents/issue-tracker.md`. Resolve its test seams during discussion and put the complete working spec in the execution issue.
4. Create an independent Team Doc snapshot and read it back before presenting G1. If a UI mockup or a complex change to an app/user/other process requires an interactive flowchart, create the optional Proposal through `docs/agents/blueprint.md` and verify its hosted evidence. Other Changes need no Change page.
5. Obtain explicit human acceptance of that complete snapshot, append its JSON receipt, read it back and validate the canonical hash. Record the snapshot URL and hash on the execution issue. Passing a tool check, answering individual questions or saving a Doc is not G1 acceptance.

G1 accepts the design, scope, batch boundaries and acceptance criteria. It authorizes ticket decomposition and implementation through the next G2; it does not arm unattended execution or authorize platform activation.

### 2. Apply

1. Read and validate the accepted snapshot, applicable ADRs and git state, plus the unattended workpad when present. Invoke `to-tickets` through the issue-tracker adapter for every Change, including Sharded Changes; Fast path remains exempt. G1 covers decomposition without the skill's additional approval stop.
2. Explicitly invoke `implement` against the snapshot and ticket graph. Assess credible failures and existing evidence before adding tests. Read `docs/testing-strategy.md` and invoke `test-audit` for changed tests; use pre-agreed seams, actual owning boundaries and bug regressions that fail before the repair and pass after it.
3. Complete and verify eligible slices, committing each slice's code and tests together under the branch/commit contract below. Run the whole-batch independent review at the Pre-PR gate, rather than adding a full gate per slice.

Commit bodies own the slice-to-commit mapping and retain it through rebases. For work committed before this contract existed, preserve valid history and explain bootstrap deviations and slice evidence in the PR; do not rewrite history solely to manufacture compliance.

Fix implementation defects inside Apply. Sweep all affected identifiers, prose, tests and criteria when a term is redefined. Deleting files beyond accepted scope remains a judgement for the human gate: list paths and rationale, and preserve them pending authorization.

#### Optional Ingest action

A material change to accepted scope, behavior, acceptance criteria or architecture pauses Apply for developer-authorized Ingest and renewed G1. Clarify the change, replace adopted decisions with successor ADRs, preserve completed slices and evidence, and create a new complete Team Doc snapshot; never overwrite the accepted one. Update optional visual evidence when affected, then resume from the new accepted snapshot. Progress, verification evidence and meaning-preserving wording edits to the working issue keep the existing snapshot and receipt.

### 3. Pre-PR gate

1. Assess and promote verified Features and Design System knowledge on the delivery branch through `docs/agents/artifact-lifecycle.md`; reconcile settled glossary and ADRs. Record why any assessed page needs no change.
2. Run `pnpm verify:all`, including applicable documentation checks, and assess Changeset applicability for the complete batch.
3. Invoke `code-review` in independent contexts for both Standards and Spec. Supply `CODING_STANDARDS.md` verbatim and the accepted snapshot with its validated hash. The Standards axis applies the actual test-audit rules and documented judgement that tooling cannot enforce.
4. Fix accepted findings, rerun affected checks and `pnpm verify:all`, and repeat both axes to a fixed point. A fix merely requested by a reviewer needs review; only review-report prose or a change specified verbatim by the round may remain unreviewed. Use the last reviewed commit for later rounds, carrying all earlier reports and dispositions if context cannot resume (ADR-0076).
5. Group findings by root cause. The same cause in two consecutive rounds requires an approach switch (ADR-0077); review the whole diff against the verified integration base after that switch. A technique-only deviation belongs in the PR. A material contract change goes through Ingest.

All same-branch knowledge edits participate in this gate before opening the PR. After it passes, open the PR using `pr` and the G2 contract below. No new Blueprint Review is produced, and the repository does not automatically launch another Agent review after opening the PR.

### 4. Open PR and accept (G2)

The GitHub PR is the primary and complete G2 entry point, including when an optional Proposal exists. Its body links the accepted snapshot and hash, any relevant visual proof, and reports acceptance results, verification, review findings/fixes, deviations, residual risks, developer actions and review focus. Use the complete relevant skill output without the old Blueprint length limits. Reconcile actionable unmitigated risks with existing issue owners, creating a follow-up only when no owner exists; keep parents open for outstanding activation obligations.

Record the PR identity, reviewed head SHA, accepted snapshot URL/hash and verification evidence in the PR and execution issue. Recheck native CI and branch protection for that exact head before asking for G2. After reviewing the PR, the developer explicitly instructs the owning Agent in the conversation to merge and clean up; that instruction accepts and authorizes the identified reviewed revision. A direct human GitHub Merge also constitutes acceptance. No special `LGTM` syntax, candidate comment, event receiver, bot receipt or background polling is required.

Requests to change the delivery are not unconditional acceptance: implement them, amend same-branch knowledge and reverify/review before returning to G2. A changed head or material change to the reviewed base context invalidates earlier acceptance. No substantive delivery code or specification is amended after acceptance before merging.

### 5. Merge, reconcile and clean up

On explicit authorization, use native GitHub/Git commands to read back the repository, PR base/head, latest exact-head required checks and native merge readiness (`CLEAN`). Stop for failed/pending evidence or a changed reviewed revision; never bypass protection. Merge a normal Change with a merge commit and `gh pr merge --merge --match-head-commit <reviewed-head>`. Read back the merged PR, merge actor/SHA and ancestry before updating the tracker or cleaning resources. Direct human merging can be reconciled on the Agent's next start/resume without a background receiver.

The repository enables GitHub's automatic remote branch deletion after merge. Read back `delete_branch_on_merge` and the actual remote branch state; a deleted remote ref is expected and does not invalidate native merged-PR evidence. Do not recreate the ref or repeat remote deletion. If the ref remains, inspect protection and active use before deleting it. Use native PR head/merge SHAs and local Git objects for ancestry, rather than requiring the deleted ref.

Before local cleanup, independently confirm ownership from this chat's attached artifacts or explicit target authorization, the checkout's branch/HEAD and clean state, and that its commits are included in the verified merge. Remote deletion does not authorize local deletion. Preserve dirty, unrelated, shared or ownership-unknown worktrees and branches; report what remains.

Move the issue and its slices to Done only after merge; update affected parent/related issues with what shipped and what remains. Merge performs no second knowledge-sync PR. From outside the owned worktree, fetch, fast-forward the local integration branch, remove only a clean owned worktree, then delete its merged local branch. Preserve dirty, unrelated or shared worktrees. Confirm the next Blueprint rebuild includes the landing revision when visual history was affected; accepted historical contents remain unchanged.

If a human gate sent the Change back or independent review needed more than three rounds, recommend `retro` on the Change sessions. Run it only when the developer invokes it; adopted bounded suggestions may use Fast path and other suggestions become issues.

## Implementation-slice contract

Canonical execution data is one Linear sub-issue per slice, under the Change's operational issue, the same way in manual and Symphony mode. Each slice delivers a narrow complete behavior across its affected layers, is independently verifiable, and fits a fresh context window; splitting by file or layer alone is not sufficient. Each slice states a stable ID, capability references, dependencies, outcome, acceptance criteria, verification, and status (`pending` or `completed`). Use native parent and blocking relationships, created in dependency order. Runtime states such as `claimed`, `running`, executor identity, and retry count do not belong on the sub-issue.

The root agent owns ticket granularity and may merge, split or reorder slices during Apply, updating the tracker without another human gate while preserving the G1 contract and completed evidence. A change to accepted scope, architecture or acceptance scenarios still requires Ingest. Slices are implementation units, not automatically separate releasable shards or pull requests. Wide mechanical refactors may use the playbook's expand–contract sequence; inseparable slices share the batch branch and a final integrate-and-verify slice.

A slice handed to a subagent travels through context pointers to its ticket, accepted specification and relevant commits, plus the applicable rules from `CONTRIBUTING.md` and `CODING_STANDARDS.md`, the exclusions and the report format. Quote only rules the slice touches; do not duplicate the full spec or repeat background in follow-up messages. The root agent starts only slices with satisfied dependencies and delegates only when independence or context isolation earns its cost. A fresh context must be able to resolve every pointer.

Optional visual supplements remain gitignored on the delivery branch and use the existing store. Read `docs/agents/blueprint.md` for their file contract and historical compatibility. Accepted specifications and receipts are Team Docs, not repository files. Decision records remain flat repository-wide files at `blueprint/content/decisions/<nnnn>-<slug>.json`.

### Change scope

A Change targets soft limits before it needs splitting: at most 5 slices and at most 30 changed `src` files. Exceeding a target during specification prompts a delivery-boundary assessment: use Sharded Change for a shared design with several batches, or separate Changes for independent designs. The slice count is a written target only; a shard is not a blanket exemption from coherent scope.

A Change is either a **structure** change (a behavior-preserving refactor, whose acceptance is the existing test suite plus a dependency-direction check) or a **behavior** change, never both.

A **Sharded Change** has one complete accepted specification and one G1, covering the shared design, shard list, order, per-batch verification and completion criteria. Every acceptance scenario names its proving shard. Each independently releasable shard has a `<prefix>/<slug>-s<N>` branch, pull request and G2, the first included. Inseparable proposed shards form one delivery shard and share its branch and pull request; internal slices may still track their execution. A single Linear tracking issue owns the shared Change and its slice sub-issues. Shards do not create separate slugs, specifications, G1s or repeated decision records. The format originally introduced for Migration in ADR-0093 now applies to any such shared-design delivery; migration remains a use case, not a separate mode.

### Fast path

Fast path sits beside Change and Sharded Change for work with bounded scope and risk, no new architecture or product decision, and a result independently acceptable in one pull request. Urgency alone grants no exemption from Change gates. The branch is `fast/*`; `hotfix/*` remains a separate route for an isolated production repair, not a Fast-path synonym.

1. Eligibility follows bounded scope and risk rather than fix type or semantic version impact. A change may qualify whether it restores existing behavior, changes behavior under an already settled product decision, updates docs or configuration, or changes dependencies (including a major pnpm upgrade). Large migrations still use Sharded Change. Work exceeding the Change soft size targets needs a delivery-boundary assessment; shared design with several batches uses Sharded Change, while independent goals use separate Changes.
2. Fast-path work happens on a `fast/<slug>` branch, whatever the commit type. It never uses `feat/`, `fix/`, or `refactor/`, which are Change branch prefixes.
3. The agent proposes Fast path during intake; the developer confirms it once — on the tracker issue when the work came from one, or in the session when it did not.
4. Kept: `pnpm verify:all`, independent two-axis code review with the issue as the spec, Changeset when applicable, and migration verification when applicable. Bug work also keeps a regression demonstrating failure before repair and success after it.
5. Skipped: G1 snapshot, Proposal publication and slices. Assess and update affected current knowledge on the same branch before review; unchanged pages need no edit.
6. The only human gate is the pull request: its body names Fast path and carries a short verification summary; the developer explicitly authorizes exact-revision merge and cleanup in the conversation after reviewing the PR; direct human merging is acceptance.
7. Escalate to a normal Change — write the complete specification and pass G1 — when scope or risk is no longer bounded, new architecture or a product decision is required, or the result cannot be independently accepted in one pull request. Editing a decision record's `decision` body or setting `supersededBy` remains a new judgement and requires a normal Change.
8. A Fast-path commit carries a `Refs: <tracker issue>` trailer when the work came from a tracker issue, and no reference trailer when it did not; either way it omits `Implements` and `Blueprint-Change`, and the body states what triggered the work.
9. A single-commit Fast-path change may squash as usual. A multi-commit change merges with a merge commit, the same as a normal Change; if it is squashed, the squash commit keeps whatever reference trailer the original commits carried.

## Decision-record contract

Read `docs/agents/domain.md` before changing vocabulary or adopted decisions. It binds `domain-modeling` to the repository's glossary, flat ADR storage and executable schema. Decision records already occupy permanent paths; knowledge promotion never copies or renumbers them.

## Branch and commit strategy

One delivery batch uses one integration branch from the first slice commit through delivery. Each completed slice is a separate reviewable commit; use temporary slice branches only when truly independent work must run in parallel, then integrate them back into that batch's branch before final verification.

Every commit on a Change branch carries a `Blueprint-Change: <slug>` trailer naming that Change; a slice commit also carries `Implements: S0X`, the stable slice ID recorded on its Linear sub-issue. A Sharded Change's commits use the shared slug and add `Shard: <N>` (see Change scope), and a Fast-path commit carries its own trailers instead (see Fast path). `CONTRIBUTING.md` covers how to write a trailer so git parses it.

Change-page content never enters the Change branch — it lives only in the regenerated, gitignored Change directory and is published to the `blueprint-changes` store branch when visual evidence changes. Push the Change branch when another session or Symphony must resume it.

Merge a Change into `main` with a merge commit. Squashing collapses the per-slice commits and discards the `Implements` and `Blueprint-Change` trailers that make delivery traceable, which is exactly the evidence Pre-PR code review and Archive depend on. Squash only work that carries no slice history — a single-commit fix or a tooling change — and say so in the pull request.

## Execution modes

### Manual workflow

The developer invokes Apply directly after accepting the complete snapshot at G1. Resume from repository artifacts, git state, and verification evidence. No Symphony process, claim, dashboard, or workspace manager is required.

Before Manual Apply starts for an issue that may be visible to Symphony:

1. inspect the configured Symphony status surface for the issue identifier; `running`, `retrying`, and `blocked` all mean Symphony still owns a live claim, so stop rather than entering the same Change workspace manually;
2. if the issue is not tracked by Symphony and carries no `ready-for-agent` label, the agent moves it to In Progress: there is no claim to pre-empt and no race to close, so steps 3 and 4 do not apply. If it carries the label, the developer removes it — or the agent does, on consent — and moves the issue to In Progress to prevent a future unattended claim;
3. request a Symphony refresh when the runtime is available, then inspect the Symphony status surface again;
4. begin Manual Apply only when the issue remains absent from the runtime status surface after that post-removal check.

The second status check closes the race between the initial observation and the label removal. If a claim appears during that window, removing the label makes the issue unroutable and Symphony reconciliation must release or stop it before Manual Apply proceeds. An agent removes or restores the label only on the developer's consent, and completion of Manual Apply never restores it automatically.

### Symphony workflow

After G1 acceptance, the developer may add `ready-for-agent` and move the issue to Todo. Symphony claims the Change's operational issue, creates or resumes an isolated workspace, and invokes the same Apply contract. The current dispatch unit is one Change; Symphony does not claim individual slice sub-issues.

Removing or replacing Symphony must not alter Change artifacts, slice status semantics, commits, or human approval gates.

## Workpad and handoff

An unattended (Symphony) run maintains one persistent workpad for the active Change, so a stopped run can be resumed by another and an unblock action has somewhere to wait for the developer:

```yaml
change: stable-change-slug
branch: feat/stable-change-slug
phase: apply | ingest | pre-pr | g2 | cleanup
current_slice: S01 | null
completed: []
validation: []
blockers: []
next_action: "smallest concrete continuation step"
```

The workpad may include tracker, run, workspace, commit, and pull-request references while they are active. Blueprint must not copy those tracker-specific references into its durable content.

A manual run keeps a lighter workpad: every field above except `blockers` and `next_action` is already recorded in the repository — slice status on the Linear sub-issues, validation in commit bodies — and a copy kept by hand drifts from them. A multi-session manual run hands off through the pushed branch and its commits plus the sub-issues, so another agent, worktree, or machine can pick up where the run stopped without a separate handoff file.

## Blueprint knowledge contract

Optional Proposal visuals and historical Reviews remain under gitignored `blueprint/content/changes/<slug>/`, published to the existing `blueprint-changes` store. Store retirement is separate work. `pnpm --filter blueprint dev` and `build` first pull published pages, so deployments include that history and branch-local Features/Design System. A normal Change without visual evidence has no page or store publication obligation.

The published `facts.json` remains the gate snapshot. After pulling the store, build preparation pins the verified remote default branch in an isolated, complete Git history and derives only archive dates and shard landing state into a disposable overlay. Readers apply it only to matching page inputs; converted history and unpublished edits retain their snapshots. Merge needs no follow-up publication to record its date.

Optional visual review uses the Blueprint main URL by default. `blueprint:gate <slug> --preview` explicitly requests a branch build when review needs unmerged components, decisions or Features. Before handing over either URL, require the deployed build receipt to match the published page's full content hash and require the page to load; a successful hook is not review evidence. Keep one publisher per slug. Concurrent publications of different slugs preserve the full store through fast-forward retry, not force push.

The Blueprint deployment workflow serializes store publication and every main push, waits for hosted completion, and checks source/store receipts before accepting freshness. It drains builds left by interrupted jobs and rebuilds if newer input arrived while running. Enable `BLUEPRINT_REBUILD_COORDINATOR_ENABLED` only after its read-only Workers CI token, account/worker/production-trigger variables and manual-build behavior are verified, native automatic push builds are disabled, and older production builds have drained. Keep the existing store hook active until that cutover; the disabled coordinator is not freshness proof. A deployment consumes the already-built export and validates its receipt, does not build during upload. Local manual deploys must first run `pnpm --filter blueprint build`.

On-demand Preview uses the trusted `main` revision of `blueprint-preview.yml`. Build requested public source/store/integration snapshots without Cloudflare credentials; upload only the validated static artifact with isolated configuration and the Worker-restricted `CLOUDFLARE_BLUEPRINT_PREVIEW_DEPLOY_TOKEN`. Before enabling this path, register the trusted workflow, disable native automatic Preview publication, and drain older Preview builds so only one controller writes branch aliases. Record the unchanged production deployment before and after activation. The gate accepts a page only when its rendered identity and hosted receipt agree on source, store, integration and complete Change input hash.

Before the workflow is registered on `main`, rehearse the same jobs on an isolated, owner-authorized test branch with an exact event/ref/actor guard. Keep its credentials confined to the static upload job. This bootstrap is activation evidence, not a successful dispatch of the unregistered workflow: the PR must distinguish the two. After registration, verify the normal gate dispatch before declaring activation complete. Remove temporary hooks, secrets and trigger overrides after rehearsals; keep production configuration unchanged unless its separate cutover is authorized.

- **Proposal:** an optional mockup or complex-process flowchart supplement; the PR links it with the accepted specification, while durable page text stays tracker-neutral. Historical accepted Proposal text remains intact.
- **Historical Review:** read-only content in collapsed footer disclosures, retaining review, shard and inner anchors. New Changes create none.
- **Features / Design System:** verified current knowledge promoted and reviewed on the same branch before opening its PR.

Read `docs/agents/blueprint.md` before editing a page or a shared rendering contract. Optional `design.tsx` retains the conditional trusted Preview render-mode proof before visual handoff; routine Agent page-by-page browser review is not required. A browser inspection is appropriate for a developer-identified diagram/screen comprehension problem.

Provider-native subagents remain within one root session and Change workspace. They never poll or claim the external queue, arm unattended execution, reprioritize intake, or create a parallel lifecycle authority.

Unless a slice is handed off under the Implementation-slice contract, implementation stays in the root session, which holds the discussion and the developer's feedback. In any stage, work whose result is a verdict or a list rather than code goes to a subagent by default, so its screenshots, search output and command logs stay out of the root session's context: a browser or device check, a repository-wide sweep such as a redefinition sweep, and a batch of mechanical operations such as republishing pages. Its brief names what to check or find and asks for the verdict with `file:line` evidence, not the raw output.

### Presentation

How a Change page is written — the components that carry its structure, the minimum each page holds, its language, and its title — lives in `docs/agents/blueprint.md`. Read it before writing or editing any Blueprint page.
