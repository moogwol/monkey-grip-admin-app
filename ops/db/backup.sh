#!/usr/bin/env bash
# ops/db/backup.sh

BACKUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/backups"
DATE_TAG="$(date +%Y%m%d-%H%M%S)"
DB_SERVICE="db"
DB_NAME="bjj_club_db"
DB_USER="bjjuser"

mkdir -p "${BACKUP_DIR}"
out="${BACKUP_DIR}/db-${DB_NAME}-${DATE_TAG}.sql.gz"
echo "Creating DB backup: ${out}"
docker compose -f docker-compose.prod.yml exec -T "${DB_SERVICE}" pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip -9 > "${out}"
echo "Backup complete: ${out}"
ls -lh "${out}"
