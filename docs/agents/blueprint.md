# Blueprint adapter

Blueprint presents current capability knowledge and published Change pages. `WORKFLOW.md` owns sequencing and gates; `docs/agents/issue-tracker.md` owns G1 acceptance and the Linear receipt.

## EmDash Change pages

Each Blueprint Change is one EmDash entry at `/changes/<slug>`. The entry holds the complete G1 specification, reader-facing Change content, the associated Linear issue key, an allowlisted GitHub PR URL list, Portable Text and versioned typed blocks. It is the only editable specification/page source. Do not copy the full specification into a Team Doc, Git, or the PR.

Authors and Agents write Portable Text and typed blocks directly through EmDash MCP. Portable Text is the sole article body format; do not add a Markdown-to-Portable Text converter, Markdown or Rich Text renderer, legacy runtime path or sanitizer. Reject raw HTML, HTML/CSS/JavaScript blocks, executable TSX, MDX imports and arbitrary component names. New reusable typed blocks and renderers go through a GitHub code PR.

Before G1, use EmDash's signed private preview at the same Blueprint route. The page must identify the exact saved draft revision and accepted-content SHA-256. After the developer accepts G1, record the revision and hash on the Linear issue; the publication policy checks Linear and blocks on missing or mismatched evidence. G1 publication makes the accepted entry public. A later G1 content change needs a new draft, preview and acceptance. Updating only the PR URL list does not change the accepted content hash.

The publication plugin requires its `linearApiKey` secret setting in EmDash's admin interface. Never store that key in Git or a checked-in Wrangler file.

A newly published Change may have an empty PR URL list. It is public as **進行中** and shows no PR-derived metrics until URLs are added. Add one URL for every required PR as it is created. A Change becomes **已合併** only when every required PR is merged, using the last required `merged_at`. Dates and summary order use `mergedAt ?? publishedAt`, descending. The page never shows G1/G2 acceptance badges or a separate discussion state. If a public Change is cancelled, unpublish it and retain its history.

G2 reviews the code PR only. The G2 PR links the accepted EmDash revision/hash; do not republish the Change page at G2. Production activation requires separate approval after G2. When a code PR merges, GitHub-derived status updates on a short cache interval without a Git deployment. A Blueprint code merge to `main` deploys the renderer; content events also request an automated SSG build, artifact upload and deployment.

## Blocks and rendering

Portable Text supplies ordinary prose, headings, lists, quotes, links, code, tables and media. Blueprint-specific semantics use versioned typed blocks such as `decision_cards`, `risk_table`, `scenario`, `scenario_cards`, `interactive_flowchart` and `step_walkthrough`, mapped to existing Astro components after strict schema validation. The renderer accepts only an explicit registry of known block types and versions. There is no legacy HTML block, sanitizer or fallback renderer in the current runtime.

`tldr` version 1 wraps a `blocks` array of native Portable Text content in the Blueprint TLDR component. `disclosure` version 1 stores a non-empty `summary`, an optional document anchor `id`, and a `blocks` array from the same closed registry. It renders semantic `details` and `summary`, preserving nested review/shard groups up to eight disclosure levels. Raw HTML and executable content are rejected. Draft decision discussion may use a disclosure without creating or accepting an ADR.

`annotated_diff` version 1 stores ordered `{ kind, text }` lines, where `kind` is `context`, `add` or `remove`. The renderer escapes code as text and displays visible plus/minus marks, accessible added/removed labels, and semantic colors. It does not parse Markdown, annotations or HTML at runtime.

Portable Text `code` blocks and `annotated_diff` are syntax-highlighted with Shiki during the static build, using the `github-light` and `github-dark` themes through CSS variables. A missing or unknown language renders as plain text. No highlighting runs at request time.

`diagram` version 1 preserves static diagram viewBox, source IDs, typed shapes and numeric paths, positioned text runs, nested groups/transforms and typed marker geometry. Paint accepts controlled Blueprint tokens, strict hex colors, `none` or `currentColor`. Labels are escaped text; raw SVG, arbitrary attributes, CSS, scripts and URL paints are rejected. Authored interactive flowcharts retain the existing `interactive_flowchart` block and complete node details.

`variant_gallery` version 1 is a reusable finite selector for data-authored visual variants. It declares labeled choices, a default selection, and exactly one pre-rendered Portable Text frame for every Cartesian choice combination. Frames contain only standard Portable Text blocks and `diagram` v1; they cannot contain nested galleries or scenario-counting blocks. The server renders every frame with the native Portable Text and typed-diagram renderers. Native buttons switch which existing frame is visible and transfer authored anchor IDs to the active frame, keeping deep links unique. Button labels remain fixed as `aria-pressed` communicates the selection. Authored data never supplies HTML, CSS, JavaScript, or component names.

`step_walkthrough` version 1 presents scenarios that step through a declared flow. It stores a flow map (main-row nodes plus branches under them, each a terminal, process or decision) with an optional shape legend, up to four actors, a system label and, per scenario, ordered steps. Each step names its flow node, gives every actor's state — headline, optional toned status, text lines, optional code and an optional highlight — and a system note. The server renders every step with native markup and build-time highlighted code; native buttons switch scenario and step, the flow map follows the visible step, and one polite live region announces the step title. Authored data never supplies HTML, CSS, JavaScript, or component names.

## PR-derived metrics

Store required GitHub PR URLs as a lookup index, one URL for each required shard. Validate the exact repository and PR URL shape. Derive status, merge date, commits, files changed, insertions, deletions and `src` files from GitHub's PR API; derive scenario count from structured scenario blocks. Store no manual status, merge date, statistics or `facts.json` copy.

Cache unmerged PR data for at most five minutes. Cache merged responses permanently by merge commit SHA. If GitHub is unavailable, use a still-valid verified cache; otherwise omit metrics and keep the status at **進行中**. Do not infer merge from content, commit prose or Linear status. GitHub read token is an optional Worker secret; do not commit credentials. Stay within Cloudflare Free quotas and do not enable paid overage.

For the pinned EmDash/Cloudflare 1.2.0 media route, a GET performs one R2 `GetObject`; a failed range read may retry once. Workers Free limits requests to 100,000 per day, bounding this route at 6.2 million Class B operations in a 31-day month, below the 10 million R2 Standard free allowance. Keep media behind that Worker route, keep Workers on Free and check shared-account R2 usage before activation; do not enable public-bucket delivery or paid overage. Recheck this bound when upgrading the media adapter. See [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) and [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

## Historical migration and retirement

The legacy `blueprint-changes` store is retired. Its 45 pages were converted from a fixed snapshot, read back and reviewed page by page, then imported into production EmDash from the same sealed artifact. The remote branch is deleted; the protected tag `archive/blueprint-changes-f010a9e020be` preserves every commit reachable from that snapshot. Earlier commits that were already unreachable are not guaranteed. Superseded Team Docs remain in Linear.

Do not import old `facts.json` values as editable fields or use them as current status/statistics. `record-flows` and `sync-recording` remain public historical entries marked **進行中**, with no invented PRs or PR-derived metrics; that migration exception does not accept or implement either Change.

The one-time conversion and import tools have been removed; publication receipts live in the owning Linear issues. Migration content and audit output never become a second Git content store.

Cloudflare activation is a separate, explicit post-G2 approval. At that point, connect Workers Builds to the repository in the Cloudflare Dashboard, create the Free-tier D1, R2 and session KV resources with the pinned Wrangler CLI, and set their IDs in deployment configuration. Store the read-only GitHub API token as the Worker secret `GITHUB_TOKEN`; set EmDash's `linearApiKey` through its plugin admin settings. Do not enable a paid plan or paid overage.

## Current knowledge and writing

Promote verified knowledge through `docs/agents/artifact-lifecycle.md` before the delivery PR, on the same branch. Use the narrowest Feature for capability behavior/constraints and the Design System authority for reusable UI/UX rules. Feature pages render decision records matching their exact capability IDs rather than copying decision text.

- Write Change prose in zh-TW with English technical terms. Features/Design System, scenario strings, ADRs and agent-facing documents use English.
- Component string props using `renderInline` support backtick code and single-level matched `**strong**`; code spans take precedence and unmatched markers remain literal. SVG labels remain plain text.
- Titles name the Change. Other-Change references and prose wrapping follow `CONTRIBUTING.md`.

## Static Change delivery

Save, publish, unpublish and delete events for `blueprint_changes` request a Cloudflare Workers Build through the plugin's encrypted `cloudflareBuildDeployHookUrl` setting. Restrict it to the official HTTPS `api.cloudflare.com/client/v4/workers/builds/deploy_hooks/<uuid>` endpoint. Do not log the URL. Hooks execute after the CMS response; they do not imply that a page artifact is ready. No daily Agent operation or Git content commit is involved.

Build with `pnpm --filter blueprint build:content`. The build snapshot path selects the configured `BLUEPRINT_DB` using only SELECT statements, validates the canonical Portable Text schema, and binds every view to its content ID, live or current draft revision, content hash and renderer digest. Public data comes from the published entry columns; draft data comes from the revision record. Reject ambiguous slugs, revision mismatches and schema errors. The build stops when a query reports cumulative reads above 10,000, or when read-cost metadata is absent or invalid. This threshold is checked after each query: that query has already consumed its reads and can exceed the threshold. An exhausted or failed reader sends no further query. This is an application stop condition, not a per-query reservation or a server-side D1 quota override.

Compute scenario counts from canonical blocks during the content build and bind them to artifact metadata. Runtime home, navigation, summaries and search read published metadata only; single-page requests read lifecycle metadata by indexed slug. Never expand article JSON or scan revision history to calculate request-time figures. GitHub cache reads remain batched by indexed keys. Audit SDK initialization, redirect, plugin and admin queries separately: their costs are not covered by the article-query budget. A full build intentionally reads each current body by identity, never all historical revisions.

Use the official EmDash Portable Text renderer and existing Blueprint typed-block components for SSG. Client islands retain their JavaScript and interaction handlers. Full SSG is intentional: measured warm builds did not reuse prerendered pages because the installed EmDash virtual module changes between builds. Do not claim incremental cache savings or patch SDK internals to obtain them.

Stage HTML only in ignored `.emdash/page-artifacts/`. Build-only preview routes must be removed from `dist/client` even when a build fails. Upload with `pnpm --filter blueprint upload:pages --remote` only during authorized activation. This verifies bytes and metadata by read-back, then writes the catalog last. `BLUEPRINT_PAGES` must be a dedicated private bucket with no public URL, custom domain or public media route; never reuse `BLUEPRINT_MEDIA`. Do not put drafts or snapshot payloads into public CI caches or artifacts.

Configure Workers Builds with the repository root and `pnpm --filter blueprint deploy:content` as its deployment command (the ordinary validation build is not the deployment step). This command requires a successful content build and artifact upload before `wrangler deploy`; a renderer-only validation build is not deployable content evidence. Local validation uses `node build/blueprint.mjs --database-file <isolated-sqlite>` and `node build/upload-pages.mjs --local --persist-to <isolated-state>` from `blueprint/`. It never requires production D1 access.

At request time, select lifecycle metadata without loading article blocks. Public access requires published status and the exact current live revision; signed private preview requires EmDash's verified content scope and the current draft/live revision. Verify artifact metadata before streaming. A missing or mismatched artifact returns 503 with `Retry-After`; invalid previews return 403 and deleted/unpublished public pages return 404. Never fall back to SSR, an old revision or legacy content. Private preview remains `no-store` and `noindex`.

Public article headers and navigation load `/api/change-summaries`. This endpoint reads compact published metadata and catalog scenario counts, then reuses the existing GitHub PR cache. It does not parse article bodies, traverse JSON blocks, poll or stack another browser TTL. GitHub merges therefore do not rebuild article HTML. Build failure or an unfinished build cannot expose a draft; publishing a new revision may temporarily return 503 until its artifact is ready.

Workers Builds only coalesces queued/initializing builds, not a build already running. Verify account-wide Free build minutes, R2 storage/operations and D1 reads before activation; alerts are not a zero-dollar spending cap. Native EmDash admin/save/publish CPU and the deployed metadata/streaming route require separate Free CPU evidence. Local SSG success alone does not prove them.

Artifact uploads reserve a separate private-bucket budget before any PUT: 1 GB storage and 100,000 monthly Class A operations, including baseline LIST pages and the catalog write. Apply `.emdash/migrations/0002_artifact_upload_budget.sql` to the isolated database before local upload and to the authorized production database before activation. Monthly initialization measures existing private-bucket objects; atomic D1 reservations prevent concurrent batches overselling the remaining allowance. Failed uploads retain reservations. All private-bucket writes must use this path; external writes and shared-account consumption still require account-wide checks. Budget exhaustion blocks deployment; it never upgrades a plan or deletes historical content automatically.

Keep Cloudflare build credentials in encrypted Workers Builds settings. Snapshot reads use SELECT only; the artifact upload stage also writes its dedicated D1 budget ledger and private R2 bucket. Credential scope must permit those operations without granting unrelated repository or account access; do not describe the entire build credential as read-only. Remote binding proxy access also requires the scoped Workers permissions documented by Wrangler. Validate the actual permissions during separately authorized activation.
