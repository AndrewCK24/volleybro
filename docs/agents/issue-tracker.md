# Issue tracker adapter

Linear owns intake, working specifications, active status, dependencies, milestones and dispatch eligibility. `WORKFLOW.md` owns transitions and human gates. Repository knowledge remains understandable without tracker IDs or URLs.

## Specification authority

Read `docs/agents/domain.md` before producing or consuming a specification. Invoke `to-spec` after discussion converges, publishing the complete working specification in the execution issue. Resolve test seams before G1. `to-tickets`, `implement` and the Spec review axis use the independently preserved accepted Team Doc, rather than a mutable issue body or optional Proposal.

Before G1, create an independent Doc attached to the owning Team, containing the complete specification; use no issue attachment or repository copy as its durable authority. Read the saved Doc back and present that content for explicit human acceptance. Append a terminal `## G1 acceptance receipt` section containing one JSON block:

```json
{
  "schemaVersion": 1,
  "change": "stable-change-slug",
  "actor": "github:developer-login",
  "acceptedAt": "2026-01-01T00:00:00Z",
  "specHash": "<canonical SHA-256>",
  "source": "https://linear.app/workspace/issue/identifier/title",
  "normalization": "LF line endings; trim trailing document whitespace; one final LF"
}
```

Hash the connector's actual read-back specification content before the receipt: normalize CRLF/CR to LF, trim trailing document whitespace, append one final LF, then SHA-256 the UTF-8 bytes. Preserve connector Markdown normalization and issue mentions. The receipt is outside the hashed content. Read back after writing and verify that the spec is unchanged, the receipt matches and the Team attachment is real. The issue holds the snapshot link and hash. A mismatch blocks execution; reconcile against the accepted snapshot or use Ingest for a material contract change. Preserve old snapshots when G1 is renewed.

Before Apply, export the actual connector Doc object `{id, url, team: {id}, content}` to a disposable JSON file and run:

```bash
node scripts/delivery-gate.js --snapshot-json <readback.json> --team-id <owning-team-id> --change <slug>
```

The validator checks metadata, receipt and canonical hash and runs repository workflow conformance. A bare Markdown file with a caller's claimed Team is insufficient. Temporary exports are inputs to verification, not another specification authority.

## Tickets and execution

`to-tickets` publishes slice sub-issues under the execution issue according to `WORKFLOW.md`. G1 already authorizes decomposition; the root performs granularity/dependency assessment without the playbook's additional approval stop. Fetch referenced issue bodies and comments when needed, and use native parent/blocking relationships as their source of truth. Preserve the parent and completed evidence; completion follows merge, not ticket creation.

Ticket creation adds no dispatch label. `ready-for-agent` remains separate developer authorization. `implement-spec`'s draft-PR, concurrency and cleanup defaults defer to repository gates, delegation and worktree ownership. Explicitly invoke `implement` for Apply. Skill outputs keep their full relevant contents; old Blueprint summary lengths do not constrain them.
