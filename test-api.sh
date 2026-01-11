#!/bin/bash

# BJJ Club Management API Test Script
echo "🧪 Testing BJJ Club Management API"
echo "=================================="

API_BASE="http://localhost:3000"

# Test 1: Health check
echo "1. Testing health endpoint..."
curl -s "$API_BASE/health" | jq .

echo -e "\n2. Testing images router..."
curl -s "$API_BASE/api/images/test" | jq .

# Test 3: Download test image and upload
echo -e "\n3. Testing image upload..."
echo "Downloading test image..."
curl -s -o /tmp/api-test-image.jpg "https://picsum.photos/400/400"

echo "Uploading image for member 20..."
UPLOAD_RESULT=$(curl -s -X POST -F "profileImage=@/tmp/api-test-image.jpg" "$API_BASE/api/images/members/20/profile-image")
echo "$UPLOAD_RESULT" | jq .

# Extract image URL from response
IMAGE_URL=$(echo "$UPLOAD_RESULT" | jq -r '.profileImageUrl // empty')

if [ ! -z "$IMAGE_URL" ]; then
    echo -e "\n4. Testing image serving..."
    echo "Testing URL: $IMAGE_URL"
    curl -I "$API_BASE$IMAGE_URL"
else
    echo "❌ Upload failed, skipping image serving test"
fi

echo -e "\n✅ API testing complete!"