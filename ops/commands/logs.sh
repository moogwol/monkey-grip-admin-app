#!/usr/bin/env bash
# ops/commands/logs.sh

service="${1:-}"
if [[ -n "${service}" ]]; then
  docker compose -f docker-compose.prod.yml logs -f --tail=150 "${service}"
else
  docker compose -f docker-compose.prod.yml logs -f --tail=150
fi
