#!/usr/bin/env bash
# ops/commands/status.sh

echo "=== Host ==="
uptime
echo
echo "=== Disk ==="
df -h
echo
echo "=== Memory ==="
free -h
echo
echo "=== Containers ==="
docker compose -f docker-compose.prod.yml ps
