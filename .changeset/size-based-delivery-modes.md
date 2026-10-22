---
"volleybro": patch
---

### Changed

#### Infrastructure

- Commits on a `feat/`, `fix/` or `refactor/` branch now need a `Linear-Issue: <ID>` trailer; `Blueprint-Change: <slug>` is optional and only for a Change that has a Blueprint page.
- `pnpm check:workflow --change-shards <slug>` replaces `--sharded-change`, and the `--migration` alias is gone.
