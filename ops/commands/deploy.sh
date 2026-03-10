#!/usr/bin/env bash
# ops/commands/deploy.sh

branch="${1:-$(git branch --show-current)}"
# require_clean_git logic can be added here
echo "Fetching + fast-forwarding branch: ${branch}"
git fetch --all --prune
git checkout "${branch}"
git pull --ff-only origin "${branch}"
echo "Building and restarting prod services..."
docker compose -f docker-compose.prod.yml up -d --build --force-recreate
echo "Deploy complete."
./ops/commands/health.sh
