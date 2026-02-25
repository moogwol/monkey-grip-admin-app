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

cd "${PROJECT_DIR}"

cmd_api() {
  local script="${1:-}"
  shift || true
  if [[ -z "$script" ]]; then
    echo "Usage: ./ops.sh api <script> [args...]"
    echo "Available scripts:"
    ls ops/api/*.sh | xargs -n1 basename | sed 's/\\.sh$//'
    exit 1
  fi
  local script_path="ops/api/${script}.sh"
  if [[ ! -x "$script_path" ]]; then
    echo "API script not found: $script_path"
    exit 1
  fi
  "$script_path" "$@"
}

main() {
  local cmd="${1:-help}"
  shift || true
  case "${cmd}" in
    help)
      sed -n '1,60p' "$0"
      ;;
    status|ps|logs|health|pull|deploy|rebuild|restart|shell)
      script_path="ops/commands/${cmd}.sh"
      if [[ ! -x "$script_path" ]]; then
        echo "Command script not found: $script_path"
        exit 1
      fi
      "$script_path" "$@"
      ;;
    db-backup)
      script_path="ops/db/backup.sh"
      if [[ ! -x "$script_path" ]]; then
        echo "DB script not found: $script_path"
        exit 1
      fi
      "$script_path" "$@"
      ;;
    disk)
      script_path="ops/docker/disk.sh"
      if [[ ! -x "$script_path" ]]; then
        echo "Docker script not found: $script_path"
        exit 1
      fi
      "$script_path" "$@"
      ;;
    prune)
      script_path="ops/docker/prune.sh"
      if [[ ! -x "$script_path" ]]; then
        echo "Docker script not found: $script_path"
        exit 1
      fi
      "$script_path" "$@"
      ;;
    api)
      cmd_api "$@"
      ;;
    *)
      echo "Unknown command: ${cmd}"
      sed -n '1,60p' "$0"
      exit 1
      ;;
  esac
}

main "$@"