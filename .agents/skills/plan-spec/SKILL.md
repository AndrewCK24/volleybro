---
name: plan-spec
description: "Write the working spec of a Change on its Linear execution issue once grilling converges. Use for the spec step of a Change; wraps the vendored to-spec with this repository's overrides."
---

# Plan Spec

Read `.agents/skills/to-spec/SKILL.md` and follow it, with only these overrides. The vendored skill stays untouched and keeps following upstream.

1. Publish the spec as the description of the existing execution issue, never as a new issue. If the issue already has a description, keep any slice checklist and update only the spec sections.
2. Do not apply `ready-for-agent`. The issue keeps `ready-for-human`; the developer's switch to `ready-for-agent` is G1 (`WORKFLOW.md`, Linear intake).
3. Write no Blueprint Change page unless `WORKFLOW.md` Lifecycle step 4 says the Change needs one.
4. Next step: `plan-tickets`, then the pre-G1 review, then G1.

Read the adapters named for this skill in `docs/agents/skill-adapters.md` before invoking it.
