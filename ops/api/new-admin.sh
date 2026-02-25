#!/usr/bin/env bash
# ops/api/new-admin.sh
# Usage: ./ops.sh api new-admin <username> <password> <email> <full_name>

API_URL="${API_URL:-http://localhost/api/auth/register}"

username="${1:-}"
password="${2:-}"
email="${3:-}"
full_name="${4:-}"

if [[ -z "$username" || -z "$password" || -z "$email" || -z "$full_name" ]]; then
  echo "Usage: ./ops.sh api new-admin <username> <password> <email> <full_name>"
  exit 1
fi

curl -fsSL -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$username\",\"password\":\"$password\",\"email\":\"$email\",\"full_name\":\"$full_name\"}" | json .


