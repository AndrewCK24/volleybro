# Blueprint adapter

Blueprint presents current capability knowledge and published Change pages. `WORKFLOW.md` owns sequencing and gates; `docs/agents/issue-tracker.md` owns G1 acceptance and the Linear receipt.

## EmDash Change pages

Each Blueprint Change is one EmDash entry at `/changes/<slug>`. The entry holds the complete G1 specification, reader-facing Change content, the associated Linear issue key, an allowlisted GitHub PR URL list, and versioned declarative blocks. It is the only editable specification/page source. Do not copy the full specification into a Team Doc, Git, or the PR.

Before G1, use EmDash's signed private preview at the same Blueprint route. The page must identify the exact saved draft revision and accepted-content SHA-256. After the developer accepts G1, record the revision and hash on the Linear issue; the publication policy checks Linear and blocks on missing or mismatched evidence. A later G1 content change needs a new draft, preview and acceptance. Updating only the PR URL list does not change the accepted content hash.

The publication plugin requires its `linearApiKey` secret setting in EmDash's admin interface. Never store that key in Git or a checked-in Wrangler file.

After G1 publication, a new Change is public as **進行中** even when its initial PR URL list is empty. Until a PR URL is added, omit PR-derived metrics; add each required PR as it is created. A Change becomes **已合併** only when every required PR is merged, using the last required `merged_at`. Dates and summary order use `mergedAt ?? publishedAt`, descending. The page never shows G1/G2 acceptance badges or a separate discussion state. If a public Change is cancelled, unpublish it and retain its history.

G2 reviews the code PR only. The G2 PR links the accepted EmDash revision/hash; do not republish the Change page at G2 or merge. When the code PR merges, GitHub-derived status updates on a short cache interval without a Git deployment. A Blueprint code merge to `main` deploys the renderer; a content publication does not.

## Blocks and rendering

Content blocks are schema-versioned declarations. The Astro renderer accepts an explicit registry of known block types and validates each version before rendering it through existing Blueprint components:

- `prose` uses EmDash portable text.
- `decision_cards`, `risk_table`, `scenario`, `scenario_cards` and `interactive_flowchart` map to the corresponding current components after Zod validation.
- `legacy_html` is migration-only. Sanitize its HTML at render time; remove scripts, event handlers, unsafe schemes and unsupported elements. New authored Change content uses structured blocks, not `legacy_html`.

EmDash content must not contain executable TSX, JavaScript, MDX imports or arbitrary component names. Add a new component or block schema through a GitHub code PR. Changes to a block's stored shape require a new block version and a migration that preserves old versions.

## PR-derived metrics

Store required GitHub PR URLs as a lookup index, one URL for each required shard. Validate the exact repository and PR URL shape. Derive commits, files changed, insertions, deletions and `src` files from GitHub's PR API; derive scenario count from structured scenario blocks. Store no manual status, merge date or statistics and no `facts.json` copy.

Cache unmerged PR data for at most five minutes. Cache merged responses permanently by merge commit SHA. If GitHub is unavailable, use a still-valid verified cache; otherwise omit metrics and keep the status at **進行中**. Do not infer merge from content, commit prose or Linear status. GitHub read token is an optional Worker secret; do not commit credentials. Stay within Cloudflare Free quotas and do not enable paid overage.

## Historical migration and retirement

Migrate every page in the fixed `blueprint-changes` snapshot into one EmDash entry per slug. Preserve title, description, full page tree, proposal and review content, shard details, sections, nested headings and anchors. Merge the latest effective accepted G1 spec when its slug matches a legacy page. For a Change G1 Doc with no matching legacy page, create a standalone EmDash Change entry at its stable slug. Migrate only the latest effective accepted G1 snapshot; keep superseded Team Docs in Linear. Respect explicit exemptions from Blueprint Change pages. Preserve local images in EmDash media and rewrite their links to the new media URLs. Do not import old `facts.json` values as editable fields or use them as current status/statistics.

The seed's image `$media` references are provisional: EmDash resolves each to a new local media ID and storage key. Never copy the pre-import content hashes to Linear. Import as drafts, retrieve the complete draft list from `/_emdash/api/content/blueprint_changes?status=draft&limit=100` with an EmDash API token that can read drafts, then run `pnpm --filter blueprint migration:finalize -- --audit <audit.json> --seed <seed.json> --media-manifest <media-manifest.json> --readback <draft-list.json> --base-url <EmDash-origin> --out <new-evidence-directory>`. The finalizer compares every imported Change with its seed, verifies each uploaded image's bytes against the fixed-snapshot SHA-256, and hashes the actual local media IDs/storage keys. Only the generated `linear-receipts.md` may be recorded as migration receipts. Do not publish or make the entries public until finalization succeeds.

Use the pinned legacy renderer to produce a complete static historical rendering. Import it as sanitized `legacy_html` alongside any migrated supported structured blocks. Never execute legacy `design.tsx`. The legacy store's two unaccepted pages, `record-flows` and `sync-recording`, remain public historical entries marked **進行中**; this is grandfathered by this migration and does not imply G1 acceptance. New entries still remain private until G1.

Match historical PRs mechanically using the slug, Git branch, commit trailers, PR metadata and dates. Where mechanical matching is inconclusive, record the agent's cited Git/GitHub/Linear evidence in the migration report. An unresolved page remains **進行中** with no fabricated metrics. Before retirement, compare all migrated routes, anchors, sections, media, required PR mappings and accepted specs against the fixed snapshot; verify the archive tag can retrieve every commit reachable from that snapshot. Earlier commits already unreachable from the snapshot are not guaranteed. Keep the old branch until migration, tag, read-back and rollback checks pass; delete it only at the separately authorized retirement step.

The old store publish, gate, static-preview and rebuild-coordinator scripts and workflows are retired. Keep the one-time snapshot importer and its audit receipts available until the archive, read-back and rollback evidence is accepted. Migration content and audit output are disposable; they do not become a second Git content store. Retain owner tests for EmDash content policy, renderer validation, GitHub status/cache, migration integrity and rollback.

Cloudflare activation is a separate, explicit step. At that point, connect Workers Builds to the repository in the Cloudflare Dashboard, create the Free-tier D1, R2 and session KV resources with the pinned Wrangler CLI, and set their IDs in the deployment configuration. Store the read-only GitHub API token as the Worker secret `GITHUB_TOKEN`; set EmDash's `linearApiKey` and `legacyMigrationIssueKey` through its plugin admin settings. Do not enable a paid plan or paid overage. G2 and local migration do not require these account settings.

## Current knowledge and writing

Promote verified knowledge through `docs/agents/artifact-lifecycle.md` before the delivery PR, on the same branch. Use the narrowest Feature for capability behavior/constraints and the Design System authority for reusable UI/UX rules. Feature pages render decision records matching their exact capability IDs rather than copying decision text.

- Write Change prose in zh-TW with English technical terms. Features/Design System, scenario strings, ADRs and agent-facing documents use English.
- Component string props using `renderInline` support backtick code and single-level matched `**strong**`; code spans take precedence and unmatched markers remain literal. SVG labels remain plain text.
- Titles name the Change. Other-Change references and prose wrapping follow `CONTRIBUTING.md`.
