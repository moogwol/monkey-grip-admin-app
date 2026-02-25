#!/usr/bin/env bash
# ops/docker/prune.sh

echo "This removes unused Docker images/containers/networks/cache."
read -r -p "Continue? [y/N] " ans
if [[ "${ans}" =~ ^[Yy]$ ]]; then
  docker system prune -af
  docker volume prune -f
else
  echo "Cancelled."
fi
