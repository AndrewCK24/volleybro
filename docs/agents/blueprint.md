# Blueprint adapter

Blueprint presents current capability knowledge and published Change pages. `WORKFLOW.md` owns sequencing and gates; `docs/agents/issue-tracker.md` owns G1 acceptance and the Linear receipt.

## EmDash Change pages

Each Blueprint Change is one EmDash entry at `/changes/<slug>`. The entry holds the complete G1 specification, reader-facing Change content, the associated Linear issue key, an allowlisted GitHub PR URL list, Portable Text and versioned typed blocks. It is the only editable specification/page source. Do not copy the full specification into a Team Doc, Git, or the PR.

Authors and Agents write Portable Text and typed blocks directly through EmDash MCP. Portable Text is the sole article body format; do not add a Markdown-to-Portable Text converter, Markdown or Rich Text renderer, legacy runtime path or sanitizer. Reject raw HTML, HTML/CSS/JavaScript blocks, executable TSX, MDX imports and arbitrary component names. New reusable typed blocks and renderers go through a GitHub code PR.

Before G1, use EmDash's signed private preview at the same Blueprint route. The page must identify the exact saved draft revision and accepted-content SHA-256. After the developer accepts G1, record the revision and hash on the Linear issue; the publication policy checks Linear and blocks on missing or mismatched evidence. G1 publication makes the accepted entry public. A later G1 content change needs a new draft, preview and acceptance. Updating only the PR URL list does not change the accepted content hash.

The publication plugin requires its `linearApiKey` secret setting in EmDash's admin interface. Never store that key in Git or a checked-in Wrangler file.

A newly published Change may have an empty PR URL list. It is public as **進行中** and shows no PR-derived metrics until URLs are added. Add one URL for every required PR as it is created. A Change becomes **已合併** only when every required PR is merged, using the last required `merged_at`. Dates and summary order use `mergedAt ?? publishedAt`, descending. The page never shows G1/G2 acceptance badges or a separate discussion state. If a public Change is cancelled, unpublish it and retain its history.

G2 reviews the code PR only. The G2 PR links the accepted EmDash revision/hash; do not republish the Change page at G2. Production activation requires separate approval after G2. When a code PR merges, GitHub-derived status updates on a short cache interval without a Git deployment. A Blueprint code merge to `main` deploys the renderer; a content publication does not.

## Blocks and rendering

Portable Text supplies ordinary prose, headings, lists, quotes, links, code, tables and media. Blueprint-specific semantics use versioned typed blocks such as `decision_cards`, `risk_table`, `scenario`, `scenario_cards` and `interactive_flowchart`, mapped to existing Astro components after strict schema validation. The renderer accepts only an explicit registry of known block types and versions. There is no legacy HTML block, sanitizer or fallback renderer in the current runtime.

## PR-derived metrics

Store required GitHub PR URLs as a lookup index, one URL for each required shard. Validate the exact repository and PR URL shape. Derive status, merge date, commits, files changed, insertions, deletions and `src` files from GitHub's PR API; derive scenario count from structured scenario blocks. Store no manual status, merge date, statistics or `facts.json` copy.

Cache unmerged PR data for at most five minutes. Cache merged responses permanently by merge commit SHA. If GitHub is unavailable, use a still-valid verified cache; otherwise omit metrics and keep the status at **進行中**. Do not infer merge from content, commit prose or Linear status. GitHub read token is an optional Worker secret; do not commit credentials. Stay within Cloudflare Free quotas and do not enable paid overage.

## Historical migration and retirement

Convert the fixed `blueprint-changes` snapshot completely on the local machine. Import all 45 pages into an isolated EmDash environment and read them back. Before G2, review every page for semantic and visual fidelity, including text, block order, anchors, links, media bytes and alt text, reviews, shards and structured scenario data. Preserve complete page content and incorporate only the latest effective accepted G1 spec for each slug. A page with no lossless supported representation fails; do not skip content or use a fallback. Keep superseded Team Docs in Linear and respect explicit exemptions from Blueprint Change pages.

The verified conversion/import artifact is sealed for promotion. Formal production import uses that same artifact without reconversion; environment-specific media references may be rebound and verified. Retain the original snapshot and archive evidence. The protected archive tag preserves every commit reachable from the fixed snapshot; earlier commits already unreachable at that snapshot are not guaranteed. Require archive and rollback evidence before G2. Retire the remote branch only after migration, read-back, archive and rollback evidence pass and the retirement step is authorized.

Do not import old `facts.json` values as editable fields or use them as current status/statistics. `record-flows` and `sync-recording` remain public historical entries marked **進行中**, with no invented PRs or PR-derived metrics; that migration exception does not accept or implement either Change.

Keep one-time conversion/import scripts, source inputs and tool tests until production import, read-back, formal cutover and rollback evidence are accepted. Then remove them while retaining final receipts and the protected archive. Migration content and audit output do not become a second Git content store.

Cloudflare activation is a separate, explicit post-G2 approval. At that point, connect Workers Builds to the repository in the Cloudflare Dashboard, create the Free-tier D1, R2 and session KV resources with the pinned Wrangler CLI, and set their IDs in deployment configuration. Store the read-only GitHub API token as the Worker secret `GITHUB_TOKEN`; set EmDash's `linearApiKey` through its plugin admin settings. Do not enable a paid plan or paid overage.

## Current knowledge and writing

Promote verified knowledge through `docs/agents/artifact-lifecycle.md` before the delivery PR, on the same branch. Use the narrowest Feature for capability behavior/constraints and the Design System authority for reusable UI/UX rules. Feature pages render decision records matching their exact capability IDs rather than copying decision text.

- Write Change prose in zh-TW with English technical terms. Features/Design System, scenario strings, ADRs and agent-facing documents use English.
- Component string props using `renderInline` support backtick code and single-level matched `**strong**`; code spans take precedence and unmatched markers remain literal. SVG labels remain plain text.
- Titles name the Change. Other-Change references and prose wrapping follow `CONTRIBUTING.md`.
