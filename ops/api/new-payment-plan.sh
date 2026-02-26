#!/usr/bin/env bash
# ops/api/new-payment-plan.sh
# Usage: ./ops.sh api new-payment-plan <name> <price> <description> <active>

API_URL="${API_URL:-http://localhost/api/payment-plans}"

name="${1:-}"
price="${2:-}"
description="${3:-}"
active="${4:-}"
is_coupon_plan="${5:-}"

# Convert is_coupon_plan to boolean for JSON
if [[ "$is_coupon_plan" == "true" ]]; then
  is_coupon_plan_json=true
else
  is_coupon_plan_json=false
fi

# ...existing code...

if [[ -z "$name" || -z "$price" || -z "$description" || -z "$active" || -z "$is_coupon_plan" ]]; then
  echo "Usage: ./ops.sh api new-payment-plan <name> <price> <description> <active> <is_coupon_plan>"
  exit 1
fi

curl -fsSL -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$name\",\"price\":\"$price\",\"description\":\"$description\",\"active\":\"$active\",\"is_coupon_plan\":$is_coupon_plan_json}" | json .


