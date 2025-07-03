#!/bin/bash

# OpenWebUI API Test Script
# Testing against ai.thespatialnetwork.net

echo "=== OpenWebUI API Test ==="
echo "Target: https://ai.thespatialnetwork.net"
echo ""

# Test 1: Simple chat completion
echo "=== Test 1: Basic Chat Completion ==="
curl -X POST "https://ai.thespatialnetwork.net/api/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "Hello, test message"
      }
    ],
    "stream": false
  }' \
  --silent \
  --show-error \
  --write-out "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n\n"

echo ""

# Test 2: Check available models
echo "=== Test 2: Available Models ==="
curl -X GET "https://ai.thespatialnetwork.net/api/models" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  --silent \
  --show-error \
  --write-out "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n\n"

echo ""

# Test 3: Health check
echo "=== Test 3: Health Check ==="
curl -X GET "https://ai.thespatialnetwork.net/api/health" \
  --silent \
  --show-error \
  --write-out "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n\n"

echo ""
echo "=== Notes ==="
echo "- Replace YOUR_API_KEY_HERE with your actual API key"
echo "- OpenWebUI typically uses OpenAI-compatible API format"
echo "- Check the documentation at ai.thespatialnetwork.net for specific endpoints"
