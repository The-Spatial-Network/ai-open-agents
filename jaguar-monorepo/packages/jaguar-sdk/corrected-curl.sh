#!/bin/bash

# Generate UUIDs for testing
CHAT_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
MESSAGE_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

echo "=== Generated Test Data ==="
echo "Chat ID: $CHAT_ID"
echo "Message ID: $MESSAGE_ID"
echo "Timestamp: $TIMESTAMP"
echo ""

echo "=== Testing API Call ==="
curl -X POST "http://localhost:3000/api/chat" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"id\": \"$CHAT_ID\",
    \"message\": {
      \"id\": \"$MESSAGE_ID\",
      \"createdAt\": \"$TIMESTAMP\",
      \"role\": \"user\",
      \"content\": \"Hello, test message\",
      \"parts\": [
        {
          \"type\": \"text\",
          \"text\": \"Hello, test message\"
        }
      ]
    },
    \"selectedChatModel\": \"chat-model\",
    \"selectedVisibilityType\": \"private\"
  }" \
  --silent \
  --show-error \
  --write-out "\n\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n"

echo ""
echo "=== Expected Results ==="
echo "- Without authentication: HTTP 401 with unauthorized:chat error"
echo "- With authentication: HTTP 200 with streaming response"
echo "- Bad request format: HTTP 400 with bad_request:api error"
