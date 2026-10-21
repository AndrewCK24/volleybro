# Skill adapters

Most skills in `.agents/skills/` are vendored and written for any repository; an adapter in this directory says how VolleyBro applies one. Before invoking a skill, read every adapter its row names. `pnpm check:workflow` fails when an installed skill has no row, a row names a missing file, or a row outlives its skill.

| Skill                           | Adapters                                                                                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ask-matt`                      | `docs/agents/domain.md`, `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`                                                                  |
| `code-review`                   | `docs/agents/issue-tracker.md`, `docs/agents/artifact-lifecycle.md`, `docs/agents/test-audit.md`                                                         |
| `codebase-design`               | `docs/agents/domain.md`                                                                                                                                  |
| `diagnosing-bugs`               | `docs/agents/domain.md`, `docs/agents/test-audit.md`                                                                                                     |
| `domain-modeling`               | `docs/agents/domain.md`                                                                                                                                  |
| `grill-me`                      | no adapter                                                                                                                                               |
| `grill-with-docs`               | `docs/agents/domain.md`                                                                                                                                  |
| `grilling`                      | no adapter                                                                                                                                               |
| `handoff`                       | `docs/agents/domain.md`                                                                                                                                  |
| `impeccable`                    | no adapter                                                                                                                                               |
| `implement`                     | `docs/agents/issue-tracker.md`, `docs/agents/artifact-lifecycle.md`, `docs/agents/test-audit.md`                                                         |
| `implement-spec`                | `docs/agents/issue-tracker.md`                                                                                                                           |
| `improve-codebase-architecture` | `docs/agents/domain.md`                                                                                                                                  |
| `pr`                            | `docs/agents/domain.md`, `docs/agents/artifact-lifecycle.md`                                                                                             |
| `prototype`                     | no adapter                                                                                                                                               |
| `research`                      | `docs/agents/artifact-lifecycle.md`                                                                                                                      |
| `retro`                         | no adapter                                                                                                                                               |
| `setup-matt-pocock-skills`      | `docs/agents/domain.md`, `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`                                                                  |
| `tdd`                           | `docs/agents/domain.md`, `docs/agents/test-audit.md`                                                                                                     |
| `teach`                         | `docs/agents/domain.md`                                                                                                                                  |
| `test-audit`                    | `docs/agents/test-audit.md`                                                                                                                              |
| `to-questionnaire`              | `docs/agents/artifact-lifecycle.md`                                                                                                                      |
| `to-spec`                       | `docs/agents/domain.md`, `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/artifact-lifecycle.md`, `docs/agents/blueprint.md` |
| `to-tickets`                    | `docs/agents/domain.md`, `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/artifact-lifecycle.md`                             |
| `triage`                        | `docs/agents/domain.md`, `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`                                                                  |
| `wait-what`                     | `docs/agents/domain.md`                                                                                                                                  |
| `wayfinder`                     | `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`                                                                                           |
| `wizard`                        | no adapter                                                                                                                                               |
| `writing-changesets`            | no adapter                                                                                                                                               |
| `writing-for-agents`            | no adapter                                                                                                                                               |
