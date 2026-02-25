#!/usr/bin/env bash
# ops/commands/pull.sh

branch="${1:-$(git branch --show-current)}"
echo "Fetching + fast-forwarding branch: ${branch}"
git fetch --all --prune
git checkout "${branch}"
git pull --ff-only origin "${branch}"
echo "Now at commit: $(git rev-parse --short HEAD)"
