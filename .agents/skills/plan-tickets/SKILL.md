---
name: plan-tickets
description: "Write the slice checklist and the final estimate on a Change's Linear execution issue after its spec exists. Use for the tickets step of a Change; wraps the vendored to-tickets with this repository's overrides."
---

# Plan Tickets

Read `.agents/skills/to-tickets/SKILL.md` and follow it, with only these overrides. The vendored skill stays untouched and keeps following upstream.

1. Publish no sub-issues and no native blocking relations. Write the slices as the checklist in the execution issue description, in the schema of `docs/agents/issue-tracker.md` (Slice checklist). Edit only the checklist; leave the rest of the description as it is. A Change that fits one session gets no checklist.
2. Skip the vendored approval quiz. The developer reviews the checklist together with the spec at G1, after the pre-G1 review.
3. Set the issue's final estimate by the Final row of `docs/agents/issue-tracker.md` (Estimation and capacity). Do not change it afterwards.
4. Do not apply `ready-for-agent`. The issue keeps `ready-for-human`; G1 is the developer's label switch.

Read the adapters named for this skill in `docs/agents/skill-adapters.md` before invoking it.
