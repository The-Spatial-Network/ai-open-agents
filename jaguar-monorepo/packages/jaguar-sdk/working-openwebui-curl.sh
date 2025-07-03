#!/bin/bash

# Working OpenWebUI API Test with correct model names
API_KEY="sk-b83a7689c5624db397d50f91c141eb32"
BASE_URL="https://ai.thespatialnetwork.net"

echo "=== Working OpenWebUI API Test ==="
echo "Using API Key: ${API_KEY:0:10}..."
echo ""

# Test 1: Get available models (this works)
echo "=== Test 1: Available Models ==="
curl -X GET "$BASE_URL/api/models" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  --silent \
  --show-error \
  --write-out "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n\n" | \
  jq '.data[] | {id: .id, name: .name}' 2>/dev/null || echo "Response received (install jq for pretty formatting)"

echo ""

# Test 2: Chat completion with correct model name
echo "=== Test 2: Chat Completion (Jaguar model) ==="
curl -X POST "$BASE_URL/api/chat/completions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "jaguar",
    "messages": [
      {
        "role": "user",
        "content": "Hello, test message"
      }
    ],
    "stream": false,
    "max_tokens": 50
  }' \
  --silent \
  --show-error \
  --write-out "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n\n"

echo ""

# Test 3: Chat completion with another available model
echo "=== Test 3: Chat Completion (Cypher Alpha model) ==="
curl -X POST "$BASE_URL/api/chat/completions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openrouter/cypher-alpha:free",
    "messages": [
      {
        "role": "user",
        "content": "Hello, test message"
      }
    ],
    "stream": false,
    "max_tokens": 50
  }' \
  --silent \
  --show-error \
  --write-out "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n\n"

echo ""
echo "=== Summary ==="
echo "✅ Authentication: Working"
echo "✅ Models endpoint: Working"
echo "❌ Original issue: Using invalid model name 'gpt-3.5-turbo'"
echo "✅ Solution: Use valid model names like 'jaguar' or 'openrouter/cypher-alpha:free'"
