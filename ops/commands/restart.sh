#!/usr/bin/env bash
# ops/commands/restart.sh

service="${1:-}"
if [[ -z "${service}" ]]; then
  echo "Usage: ./ops.sh restart <service>"
  exit 1
fi
docker compose -f docker-compose.prod.yml restart "${service}"
docker compose -f docker-compose.prod.yml ps
