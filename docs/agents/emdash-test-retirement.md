# Legacy Blueprint test dispositions

This ledger compares the six removed workflow suites at `d36a03bab24cc4fe20235fb1660ff536323b4c01` with the EmDash implementation reviewed at `5dfb410be853d4483fe93be2a3fa9751094a1fca`. “No keeper” means the tested repository behavior was intentionally retired by the accepted EmDash architecture; it does not claim an equivalent replacement test. Current-owner references name only the narrower surviving contract they actually prove.

## `scripts/__tests__/blueprint-changes.test.js`

These tests exercised the Git-backed `blueprint-changes` store branch, local page synchronization and static publication. EmDash entries are now the editable Change source; those branch operations have no current contract.

| Removed test | What it detected | Disposition |
| --- | --- | --- |
| `scope follows the remote default through cutover and falls back to main` | Selection of the legacy store branch across default-branch cutover. | No keeper; store branch retired. |
| `pull adds missing slugs` | Import of remote-only Change directories into the local tree. | No keeper; authors edit EmDash entries directly. |
| `a pinned build pulls the selected store even after another publication` | Rebuild input pinned to one remote store revision. | No keeper; publication is queried from EmDash at request time. |
| `pull warns only when the store history passes the threshold` | Warning threshold for old store history. | No keeper; no store-history pull remains. |
| `pull keeps a never-pulled local slug` | Preservation of local-only Change directories during pull. | No keeper; Git no longer stores Change pages. |
| `pull refreshes an untouched slug after the remote changes` | Updating an unedited local copy from the store. | No keeper; no local copy exists. |
| `pull keeps a slug that was edited locally after being pulled` | Avoidance of overwriting local edits. | No keeper; EmDash is the authoring boundary. |
| `pull --force <slug> replaces that local slug` | Explicit force replacement of one local page. | No keeper; force-pull command retired. |
| `pull --force with no slug refuses to overwrite an unpublished edit` | Guard against broad destructive overwrite. | No keeper; force-pull command retired. |
| `pull leaves the repository unshallow` | Preservation of Git history during store fetch. | No keeper; no store fetch remains. |
| `missing remote branch: pull warns and exits 0` | Optional local handling when the legacy branch is absent. | No keeper; store branch retired. |
| `missing remote branch: pull exits 1 in CI without any flag` | CI failure when required store branch is absent. | No keeper; CI no longer requires that branch. |
| `missing remote branch: BLUEPRINT_REQUIRE_CHANGES=0 opts CI out` | Environment override for the branch requirement. | No keeper; environment flag retired. |
| `missing remote branch: pull exits 1 under BLUEPRINT_REQUIRE_CHANGES` | Explicit environment enforcement of branch presence. | No keeper; environment flag retired. |
| `publish pushes a commit containing the local slug` | Publishing a local page as a store-branch commit. | No keeper; content publication uses EmDash. |
| `publish records the hash so a later pull of the same content is a no-op` | Idempotent synchronization using a local content hash. | No keeper; store synchronization retired. |
| `publish with no changes: records the hash and commits nothing` | No-op publish behavior for unchanged local content. | No keeper; store synchronization retired. |
| `publish --dry-run does not change the remote` | Dry-run safety for remote Git publishing. | No keeper; Git publishing command retired. |
| `publish to a remote without the branch creates it` | Creation of a missing store branch during publish. | No keeper; store branch retired. |
| `concurrent publishes of different slugs both land on the store branch` | Recovery from concurrent Git pushes without losing either page. | No keeper; the Git store write path is gone. |
| `publish rethrows a push failure that is not a race (pre-receive hook rejects)` | Propagation of a non-race remote push rejection. | No keeper; Git store write path is gone. |
| `publish writes facts.json for a Change and ships it` | Generation and publication of manually derived Change facts. | No keeper for `facts.json`; status and figures are derived from GitHub. The derived summary contract is owned by `blueprint/src/lib/github-change-data.test.ts`, `requires every shard PR to be merged and sorts by final merge time` and `derives complete metrics for a cold index with five PRs`. |
| `publish keeps the facts of a page converted from an earlier format` | Preservation of old-format fields while publishing facts. | No keeper; `facts.json` is not in the current page path. |
| `publish rewrites an unreadable facts.json instead of stopping` | Recovery from malformed local facts data. | No keeper; `facts.json` is retired. |
| `publish records G2 once the page has a Review tab` | Inference of G2 from local Review files. | No keeper; G2 is a GitHub PR gate, not page-derived state. |
| `publish preserves batch facts through a conventional merge and trunk cutover` | Retention of shard facts through Git merges and branch migration. | No keeper; no shard facts file or trunk cutover workflow remains. |
| `a proposal-only publish records G1 even on a later shard's branch` | G1 extraction from a Proposal-only local publish. | No keeper for branch-based G1 extraction; exact EmDash revision/hash admission is owned by `blueprint/src/lib/emdash-publication-policy.test.ts`, `requires the exact accepted draft revision on first publication`. |
| `a failed publish after a proposal-only one leaves the Reviews to the next pull` | Deferral of Review files after a failed Git publish. | No keeper; Git publish sequencing retired. |
| `publish without its Review files ships the Proposal alone` | Partial Git publication of a Proposal while Reviews are absent. | No keeper; the complete G1 entry is authored and published in EmDash. |
| `publish measures a merged Change by the merge commit that landed it` | Derivation of metrics from a local merge commit. | No keeper for local Git metrics; GitHub-derived metrics are owned by `blueprint/src/lib/github-change-data.test.ts`, `derives complete metrics for a cold index with five PRs`. |
| `publish leaves the commit count unknown for a squash-merged Change` | Handling unknown commit counts after squash merge. | No keeper; current PR API supplies commit counts. |
| `publish ships the deploy workflow to the store, and pull leaves it there` | Distribution of the static-store deploy workflow. | No keeper; the store deploy workflow is retired. |
| `a Change starts at its first commit, even one made long before its first publish` | Start-date derivation from the first local commit. | No keeper; current ordering uses `publishedAt` or GitHub `mergedAt`. |
| `a Change with no commit yet starts at its first publish and keeps that start` | Fallback start date and persistence when there is no commit. | No keeper; local commit start dates are retired. |

## `scripts/__tests__/blueprint-gate.test.js`

These tests exercised branch-state checks and deployed static-page receipts for G1/preview acceptance. The accepted contract now binds G1 to an exact EmDash draft revision and content hash; the old branch/deployment admission path is retired.

| Removed test | What it detected | Disposition |
| --- | --- | --- |
| `the gate refuses a branch ahead of its upstream before publishing` | Rejection of local commits not pushed to the review branch. | No keeper; the local publish gate is retired. |
| `the CLI accepts --preview and reaches the existing branch-state gate` | Preview CLI option routing through branch checks. | No keeper; preview CLI retired. |
| `the production gate accepts only a page rendered from the receipt snapshot` | Match between deployment receipt and rendered static page. | No keeper; deployment receipt acceptance is retired. The current G1 revision/hash rule is narrower and owned by `blueprint/src/lib/emdash-publication-policy.test.ts`, `requires the exact accepted draft revision on first publication`. |
| `the gate keeps polling until a current receipt and rendered page are available` | Poll/retry until a deployment and its page receipt agree. | No keeper; content publication no longer triggers a deployment. |
| `a matching receipt cannot admit a different deployed page snapshot` | Rejection of a page rendered from different content despite a matching receipt. | No keeper for deployed snapshots; current content hash admission is tested by `blueprint/src/lib/emdash-publication-policy.test.ts`, `blocks changed content even when the accepted draft revision matches`. |
| `a page render failure cannot be accepted` | Fail-closed behavior for failed static page rendering. | No keeper; no static page render gate remains. |
| `--gate G1 publishes the Proposal before the whole page` | Proposal-first partial publish ordering. | No keeper; G1 publication is one complete EmDash entry. |
| `preview gate waits for its exact GitHub run and accepts the corresponding page receipt` | Binding preview acceptance to a specific GitHub Actions run. | No keeper; GitHub preview runs and their receipts are retired. |
| `a mockup requires trusted route proof without an explicit preview flag` | Trusted route proof for preview mockup admission. | No keeper; the custom mockup preview endpoint is retired; EmDash owns signed private preview. |
| `a failed preview run stops before hosted acceptance` | Blocking acceptance after failed preview CI. | No keeper; this preview CI path is retired. |
| `a GitHub CLI authentication error stops before hosted acceptance` | Fail-closed preview when GitHub CLI cannot authenticate. | No keeper; preview no longer calls GitHub CLI. |
| `previewUrl folds the branch name into one DNS label` | DNS-safe aliases derived from branch names. | No keeper; branch preview aliases are retired. |

## `scripts/__tests__/blueprint-lifecycle.test.js`

| Removed test | What it detected | Disposition |
| --- | --- | --- |
| `a pinned preview retains the selected integration snapshot after main advances` | Snapshot isolation for static integration previews. | No keeper; previews no longer build from the Git store snapshot. |
| `derives landing lifecycle from a complete isolated integration snapshot` | Lifecycle derivation from a deployed Git snapshot. | No keeper for snapshot lifecycle; current PR status is owned by `blueprint/src/lib/github-change-data.test.ts`, `requires every shard PR to be merged and sorts by final merge time`. |
| `keeps a sharded parent open until every declared shard lands` | Parent completion only after every declared shard merges. | The surviving observable rule is that every linked PR must merge; owned by `blueprint/src/lib/github-change-data.test.ts`, `requires every shard PR to be merged and sorts by final merge time`. |
| `scans one integration history and reuses merge-side records across Changes and shards` | Single git-history scan and reuse of merge-side data across page summaries. | No keeper for Git-history scanning; current PR lookup/cache behavior is owned by `blueprint/src/lib/github-change-data.test.ts` cache tests and `blueprint/test/integration/persistence/github-change-data.itest.mjs`. |

## `scripts/__tests__/blueprint-preview.test.js`

All tests covered GitHub Actions preview artifacts, isolated Wrangler uploads, or route evidence. The custom preview-upload protocol and its temporary filesystem do not exist in the EmDash runtime.

| Removed test | What it detected | Disposition |
| --- | --- | --- |
| `upload preflight rejects public branches sharing the same preview alias` | Alias collision rejection before upload. | No keeper; branch-derived upload aliases retired. |
| `request CLI rejects malformed references and untrusted workflow context before network access` | Validation of untrusted workflow event inputs. | No keeper; preview request CLI retired. |
| `request CLI rejects a branch that moved away from the requested source SHA` | Binding preview request to an unchanged source SHA. | No keeper; preview request workflow retired. |
| `artifact CLI accepts the matching receipt and rejects mismatched snapshots` | Artifact acceptance bound to a receipt/snapshot pair. | No keeper; static preview artifact protocol retired. |
| `detects a regular design.tsx only in the requested Change` | Scoping mockup detection to a regular file in one Change. | No keeper; `design.tsx` mockup discovery retired. |
| `detect-mockup writes its conditional output only from trusted main` | Restricting mockup output to trusted main. | No keeper; conditional GitHub Actions output retired. |
| `artifact CLI rejects symlinks and special files from the real filesystem` | Rejecting filesystem objects unsafe to package as an artifact. | No keeper; artifact packaging/upload path retired. |
| `prepare-upload writes a minimal isolated config and a DNS-safe alias` | Isolated Wrangler configuration and safe branch alias. | No keeper; isolated preview deployment retired. |
| `upload CLI invokes Wrangler with static asset options in the isolated directory` | Exact Wrangler static asset upload invocation. | No keeper; Blueprint now runs as a Worker and no preview uploader exists. |

## `scripts/__tests__/blueprint-rebuild.test.js`

| Removed test | What it detected | Disposition |
| --- | --- | --- |
| `drains a cancelled predecessor and deploys the newest publication arriving during a build` | Rebuild queue handling and catch-up after a newer content publish. | No keeper; EmDash publication is read at request time and does not trigger Git deployment. |
| `coalesces queued requests already covered by the deployed receipt` | De-duplication of rebuild requests already represented by a deployed receipt. | No keeper; rebuild queue/receipt retired. |
| `a successful platform build without the requested receipt is not accepted` | Rejection of builds missing the requested publication receipt. | No keeper; publication is not accepted through a platform build. |
| `CLI drains its paginated active build and catches up to inputs published during a build` | Polling a paginated platform build queue and catching up. | No keeper; custom rebuild CLI retired. |
| `CLI refuses to trigger when the configured hook targets another branch` | Branch binding of a deploy hook. | No keeper; deploy hook trigger CLI retired. |
| `CLI rejects malformed trigger and hook configuration before making requests` | Fail-closed validation of rebuild trigger configuration. | No keeper; rebuild trigger CLI retired. |

## `scripts/__tests__/change-page.test.js`

These tests parsed local MDX/TSX and git shortstat to derive old page fields. The parser and those fields were removed; only surviving structured semantics have a current owner.

| Removed test | What it detected | Disposition |
| --- | --- | --- |
| `scenarioIds reads the ids of the exported scenarios` | Scenario IDs extracted from exported TSX. | No keeper for TSX export parsing; current scenario count derives from structured blocks, owned by `blueprint/src/lib/github-change-data.test.ts`, `derives scenarios only from the structured scenario blocks`. |
| `resultIds reads only the ScenarioResults results, not the test plan` | Separation of results from test-plan scenario IDs. | No keeper; there is no current `ScenarioResults` or result-ID metric. |
| `decisionIds reads the ids passed to DecisionCards` | Decision IDs extracted from a TSX prop. | No keeper for source parsing; current typed decision-card resolution is exercised by `blueprint/src/lib/decision-cards.test.tsx`, `renders cards in the order requested`. |
| `reviewSections lists the Review sections in the order they appear` | Extraction/order of sections from Review MDX. | No keeper; Review tab section parsing is retired; content is authored in the ordered Portable Text stream. |
| `parseShortstat reads files, insertions and deletions` | Parsing of git shortstat metrics. | No keeper for git-output parsing; API metrics are owned by `blueprint/src/lib/github-change-data.test.ts`, `derives complete metrics for a cold index with five PRs`. |
| `scenario and result ids accept quoted keys and ignore look-alikes in text` | Static parser handling of TSX keys versus incidental source text. | No keeper; TSX parser retired. |
| `a pending result does not count as a result` | Exclusion of pending result entries from extracted results. | No keeper; result-ID extraction removed. |
| `sections in inline code or fences do not count` | Avoidance of false Review section matches inside code. | No keeper; Review MDX parser removed. |
| `entry keys may come in any order` | Parser support for reordered JSX entry props. | No keeper; JSX parser removed. |
| `a scenario without an id is reported as missing one` | A diagnostic identifying scenarios with missing IDs in exported TSX. | No keeper for the old TSX diagnostic; the new typed schema requires IDs, but the reviewed suite does not test the missing-ID rejection, so this ledger does not claim equivalent test coverage. |
| `backtick and multi-line template values are read like any string` | TSX string/template parsing. | No keeper; TSX parser removed. |
| `only an entry's own id counts, not one nested inside it` | Correct AST ownership when extracting an ID. | No keeper; AST extractor removed. |
| `results are found even after a prop containing =>` | Parser resilience to arrow syntax in an earlier JSX prop. | No keeper; JSX parser removed. |
| `a Review section written on one line is reported as inline` | Detection of inline Review sections. | No keeper; Review-section parser removed. |
| `only pass and fail count as results` | Filtering result states to pass/fail. | No keeper; result-ID summary removed. |
| `scenarios built by spread or from a variable read as malformed` | Rejection of indirect TSX scenario declarations. | No keeper; source-based scenario extraction removed. |
| `frontmatter is not parsed as MDX, whatever it contains` | Exclusion of frontmatter text from body AST parsing. | No keeper; old page parser removed. |
| `a scenario's shard is read as a number` | Extraction of shard numbers from scenario metadata. | No keeper for embedded shard metadata; required PR URLs now identify delivery shards. |
| `shardCount reads a Sharded Change's shard count from the frontmatter` | Shard count extraction from frontmatter. | No keeper; frontmatter is not the current specification format. |
| `readChangeDir reads the index, the Proposal and every Review in shard order` | Assembly/order of local Change and Review files. | No keeper; Git page-directory layout retired. |

