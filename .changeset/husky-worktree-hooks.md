---
"volleybro": patch
---

### Changed

#### CI

- Run Git hooks from the committed `.husky/` directory. A commit in a worktree without `node_modules` now fails with an install instruction instead of skipping the hooks. Run `pnpm install` once in any checkout to switch the shared hooks path.
