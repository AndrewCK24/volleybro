# Issue tracker adapter

Linear owns intake, execution status, dependencies, milestones and dispatch eligibility. `WORKFLOW.md` owns lifecycle and human gates. Repository knowledge remains understandable without tracker IDs or URLs.

## EmDash Change specification

Each Blueprint Change has one EmDash entry at its stable kebab-case slug. The entry is the complete G1 specification and the page shown after acceptance; do not create a parallel Team Doc specification. Authors and Agents write Portable Text and versioned typed blocks directly through EmDash MCP. Use a signed private EmDash preview at the same Blueprint route for G1 review. G1 acceptance authorizes ticket decomposition and implementation through G2; it does not authorize production resource setup or platform activation.

The preview is bound to EmDash's exact draft revision and a canonical SHA-256 of the accepted fields: `title`, `description`, `linear_issue`, and versioned `blocks`. The `pull_requests` list and `capabilities` paths are lookup metadata and are excluded from that content hash; the accepted body defines scope and acceptance. Before publishing, record this marker in the owning Linear issue description and read it back:

```html
<!-- emdash-g1-publication:v1 revision=<draft-revision-id> sha256=<64 lowercase hex characters> -->
```

The EmDash publication policy fetches the issue from Linear and checks the marker against the saved revision and canonical hash. Missing, unreachable, malformed or mismatched evidence blocks publishing. If accepted content changes after review, create a new draft, preview it, and renew G1; do not overwrite the prior accepted specification. Updating only the PR URL index or capability paths does not change the accepted hash.

The execution issue holds the working state and accepted EmDash revision/hash. A newly accepted Change may publish immediately after G1 with an empty `pull_requests` list; it appears as **進行中** without PR-derived metrics until its PR URLs are added. GitHub is the source for status, merge dates and PR statistics; EmDash stores no manual copies. G2 evidence belongs to the GitHub PR and names the G1 EmDash revision/hash. The PR does not copy the full specification. G2 reviews code only; it does not require a new EmDash publication. See `docs/agents/blueprint.md` for private preview and publication behavior.

## Tickets and execution

`to-tickets` publishes slice sub-issues under the execution issue according to `WORKFLOW.md`. G1 already authorizes decomposition; the root performs granularity and dependency assessment without another approval stop. Fetch referenced issue bodies and comments when needed, and use native parent/blocking relationships as their source of truth. Preserve the parent and completed evidence; mark work complete only after merge.

Ticket creation adds no dispatch label. `ready-for-agent` remains separate developer authorization. `implement-spec` draft-PR, concurrency and cleanup defaults defer to repository gates, delegation and worktree ownership. Explicitly invoke `implement` for Apply. Skill outputs keep their full relevant contents.
