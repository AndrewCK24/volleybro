#!/bin/sh
# Installs dependencies in a worktree that has none, so husky's prepare script
# installs the git hooks there. Agent tools call it when they create a worktree.
set -eu
cd "${1:-.}"
top=$(git rev-parse --show-toplevel)
cd "$top"
# Both must exist: an interrupted install can leave node_modules without hooks.
[ -d node_modules ] && [ -d .husky/_ ] && exit 0
echo "worktree-setup: installing dependencies in $top" >&2
exec pnpm install --frozen-lockfile --prefer-offline
