#!/usr/bin/env bash
# ops/api/get-members.sh
# Usage: ./ops.sh api get-members

API_URL="${API_URL:-http://localhost/api/members}"

curl -fsSL "$API_URL" | json data | json -a first_name last_name latest_payment_status


