#!/usr/bin/env bash
# ops/db/apply-migration.sh
# Usage: ./ops.sh db apply-migration <migration-file> <compose-file>


DB_SERVICE="db"
DB_NAME="bjj_club_db"
DB_USER="bjjuser"

MIGRATION_FILE="${1:-}"
COMPOSE_FILE="${2:-docker-compose.dev.yml}"

if [[ -z "$MIGRATION_FILE" ]]; then
  echo "Usage: ./ops.sh db apply-migration <migration-file> <compose-file> (optional -default: docker-compose.dev.yml)"
  exit 1
fi

if [[ ! -f "$MIGRATION_FILE" ]]; then
  echo "Migration file not found: $MIGRATION_FILE"
  exit 1
fi

echo "Applying migration: $MIGRATION_FILE"
cat "$MIGRATION_FILE" | docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" psql -U "$DB_USER" -d "$DB_NAME"
echo "Migration applied."