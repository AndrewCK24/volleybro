# Issue tracker adapter

Linear owns intake, execution status, dependencies, milestones and dispatch eligibility. `WORKFLOW.md` owns lifecycle and human gates. Repository knowledge remains understandable without tracker IDs or URLs.

## Specification and G1

The Linear execution issue description is the working spec; do not create a parallel Team Doc specification. A Fast path issue's description is its spec, confirmed once at intake. G1 is the developer switching the issue's label from `ready-for-human` to `ready-for-agent`; Linear's activity log is the record, and nothing is written to EmDash or the issue description for it. G1 acceptance authorizes implementation through G2; it does not authorize production resource setup or platform activation.

## Blueprint Change page

A Blueprint Change page is written only for (a) a major UI change, such as a design-system change, or (b) a flow change that needs a Pele interactive flowchart. It is an EmDash entry at the Change's stable kebab-case slug, written as Portable Text and versioned typed blocks directly through EmDash MCP, and reviewed through a signed private EmDash preview at the same Blueprint route before it is published. The entry's `linear_issue` field is optional. Publishing needs no Linear call. If page content changes after the developer accepted G1, create a new draft, preview it and renew G1; do not overwrite the accepted page.

GitHub is the source for status, merge dates and PR statistics; EmDash stores no manual copies. A page may publish with an empty `pull_requests` list; it appears as **進行中** without PR-derived metrics until its PR URLs are added. G2 evidence belongs to the GitHub PR. G2 reviews code only; it does not require a new EmDash publication. See `docs/agents/blueprint.md` for private preview and publication behavior.

## Tickets and execution

`to-tickets` writes the slice checklist on the execution issue according to `WORKFLOW.md`; slices are not sub-issues and carry no native blocking relations. The root performs granularity and dependency assessment. Fetch referenced issue bodies and comments when needed. Preserve completed evidence.

Ticket creation adds no dispatch label. `ready-for-agent` remains the developer's G1 switch. `implement-spec` draft-PR, concurrency and cleanup defaults defer to repository gates, delegation and worktree ownership. Explicitly invoke `implement` for Apply. Skill outputs keep their full relevant contents.

### Slice checklist

The checklist in the execution issue description is the single source of slice status. One item per slice:

```markdown
- [ ] **S01 — <title>** · pending
  - Capabilities: `platform/delivery-workflow`
  - Outcome: <the narrow complete behavior>
  - Acceptance: <criteria that prove it>
  - Verification: <commands or checks>
  - Depends on: none
```

- IDs are stable (`S01`, `S02`, ...) and never reused or renumbered; merging, splitting or reordering slices keeps the IDs of untouched ones.
- A dependency is text, `Depends on: S01, S02` or `none`.
- Status is `pending` or `completed`. Switch an item to `completed` and tick its box only after its code merges. Runtime state such as claimed, executor or retries is never written into the checklist.
- A slice commit carries `Implements: S0X`.

## Estimation and capacity

Estimate in points: a Fast path issue is 1, a Change is its slice count plus 1 capped at 8, and a wayfinder decision ticket is 1. A cycle holds 20 points (cycles 2–4 averaged about 23; the figure is lowered for weekly dev-notes and articles); revisit it after a few more cycles. A Change whose slices landed in an earlier cycle counts only its remaining point.

## Grill decisions

When a grilling session settles a decision, record it on the issue immediately, one decision at a time, rather than batching them at the end. Create dependency links only from relationships the discussion established; never invent one.
