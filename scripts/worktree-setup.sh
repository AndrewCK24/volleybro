#!/bin/sh
# Installs dependencies in a worktree that has none, so husky's prepare script
# installs the git hooks there. Agent tools call it when they create a worktree.
set -eu
cd "${1:-.}"
cd "$(git rev-parse --show-toplevel)"
[ -d node_modules ] && exit 0
echo "worktree-setup: installing dependencies in $(pwd)" >&2
exec pnpm install --frozen-lockfile --prefer-offline
