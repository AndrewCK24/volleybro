---
"volleybro": patch
---

### Changed

#### Infrastructure

- `scripts/worktree-setup.sh` installs dependencies, and with them the git hooks, in a new worktree; agent tools run it when they create one, so commit checks no longer skip silently there.
