#!/usr/bin/env bash
# ops/commands/rebuild.sh

service="${1:-mg-frontend}"
echo "Rebuilding service: ${service}"
docker compose -f docker-compose.prod.yml up -d --build --force-recreate "${service}"
docker compose -f docker-compose.prod.yml ps
