#!/usr/bin/env bash
# ops/commands/shell.sh

service="${1:-}"
if [[ -z "${service}" ]]; then
  echo "Usage: ./ops.sh shell <service>"
  exit 1
fi
docker compose -f docker-compose.prod.yml exec "${service}" sh
