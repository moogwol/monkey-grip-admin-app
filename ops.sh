#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Monkey Grip Admin - Ops helper
# -----------------------------------------------------------------------------
# Usage:
#   ./ops.sh help
#   ./ops.sh status
#   ./ops.sh logs [service]
#   ./ops.sh health
#   ./ops.sh pull [branch]
#   ./ops.sh deploy [branch]
#   ./ops.sh rebuild [service]
#   ./ops.sh restart [service]
#   ./ops.sh ps
#   ./ops.sh shell <service>
#   ./ops.sh db-backup
#   ./ops.sh disk
#   ./ops.sh prune
#
# Notes:
# - Run this from repo root on droplet.
# - Assumes docker compose file: docker-compose.prod.yml
# -----------------------------------------------------------------------------

COMPOSE_FILE="docker-compose.prod.yml"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${PROJECT_DIR}/backups"
DATE_TAG="$(date +%Y%m%d-%H%M%S)"

# Change these if your DB env changes
DB_SERVICE="db"
DB_NAME="bjj_club_db"
DB_USER="bjjuser"

cd "${PROJECT_DIR}"

compose() {
  docker compose -f "${COMPOSE_FILE}" "$@"
}

require_clean_git() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Working tree is dirty. Commit/stash first."
    exit 1
  fi
}

cmd_help() {
  sed -n '1,60p' "$0"
}

cmd_status() {
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
  compose ps
}

cmd_ps() {
  compose ps
}

cmd_logs() {
  local service="${1:-}"
  if [[ -n "${service}" ]]; then
    compose logs -f --tail=150 "${service}"
  else
    compose logs -f --tail=150
  fi
}

cmd_health() {
  echo "=== App health ==="
  curl -fsS http://localhost/health || echo "Frontend /health failed"
  echo
  echo "=== API health ==="
  curl -fsS http://localhost/api/images/health || echo "API /api/images/health failed"
  echo
}

cmd_pull() {
  local branch="${1:-$(git branch --show-current)}"
  echo "Fetching + fast-forwarding branch: ${branch}"
  git fetch --all --prune
  git checkout "${branch}"
  git pull --ff-only origin "${branch}"
  echo "Now at commit: $(git rev-parse --short HEAD)"
}

cmd_deploy() {
  local branch="${1:-$(git branch --show-current)}"
  require_clean_git
  cmd_pull "${branch}"
  echo "Building and restarting prod services..."
  compose up -d --build --force-recreate
  echo "Deploy complete."
  cmd_health
}

cmd_rebuild() {
  local service="${1:-mg-frontend}"
  echo "Rebuilding service: ${service}"
  compose up -d --build --force-recreate "${service}"
  compose ps
}

cmd_restart() {
  local service="${1:-}"
  if [[ -z "${service}" ]]; then
    echo "Usage: ./ops.sh restart <service>"
    exit 1
  fi
  compose restart "${service}"
  compose ps
}

cmd_shell() {
  local service="${1:-}"
  if [[ -z "${service}" ]]; then
    echo "Usage: ./ops.sh shell <service>"
    exit 1
  fi
  compose exec "${service}" sh
}

cmd_db_backup() {
  mkdir -p "${BACKUP_DIR}"
  local out="${BACKUP_DIR}/db-${DB_NAME}-${DATE_TAG}.sql.gz"
  echo "Creating DB backup: ${out}"

  # Use pg_dump inside db container; compress on host side
  compose exec -T "${DB_SERVICE}" pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip -9 > "${out}"

  echo "Backup complete: ${out}"
  ls -lh "${out}"
}

cmd_disk() {
  echo "=== Docker disk usage ==="
  docker system df
  echo
  echo "=== Largest files under project ==="
  du -ah "${PROJECT_DIR}" | sort -hr | head -n 30
}

cmd_prune() {
  echo "This removes unused Docker images/containers/networks/cache."
  read -r -p "Continue? [y/N] " ans
  if [[ "${ans}" =~ ^[Yy]$ ]]; then
    docker system prune -af
    docker volume prune -f
  else
    echo "Cancelled."
  fi
}

main() {
  local cmd="${1:-help}"
  shift || true

  case "${cmd}" in
    help)       cmd_help ;;
    status)     cmd_status ;;
    ps)         cmd_ps ;;
    logs)       cmd_logs "$@" ;;
    health)     cmd_health ;;
    pull)       cmd_pull "$@" ;;
    deploy)     cmd_deploy "$@" ;;
    rebuild)    cmd_rebuild "$@" ;;
    restart)    cmd_restart "$@" ;;
    shell)      cmd_shell "$@" ;;
    db-backup)  cmd_db_backup ;;
    disk)       cmd_disk ;;
    prune)      cmd_prune ;;
    *)          echo "Unknown command: ${cmd}"; cmd_help; exit 1 ;;
  esac
}

main "$@"