---
"volleybro": patch
---

### Changed

#### Infrastructure

- Commits on a `feat/`, `fix/` or `refactor/` branch now need a `Linear-Issue: <ID>` trailer; `Blueprint-Change: <slug>` is optional and only for a Change that has a Blueprint page.
- `pnpm check:workflow --mapped-change <slug>` replaces `--sharded-change`, and the `--migration` alias is gone.
- Blueprint publishes a Change without calling Linear, and a merged Change reads 已完成.
