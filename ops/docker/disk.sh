#!/usr/bin/env bash
# ops/docker/disk.sh

echo "=== Docker disk usage ==="
docker system df
echo
echo "=== Largest files under project ==="
du -ah "$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)" | sort -hr | head -n 30
