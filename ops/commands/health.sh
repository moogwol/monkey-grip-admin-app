#!/usr/bin/env bash
# ops/commands/health.sh

echo "=== App health ==="
curl -fsS http://localhost/health || echo "Frontend /health failed"
echo
echo "=== API health ==="
curl -fsS http://localhost/api/images/health || echo "API /api/images/health failed"
echo
