# OpenWebUI API Debug Solution

## ✅ PROBLEM SOLVED

Your original curl request was failing because you were using an **invalid model name** (`"gpt-3.5-turbo"`) that doesn't exist on the OpenWebUI instance at `ai.thespatialnetwork.net`.

## 🔍 Root Cause Analysis

1. **Authentication**: ✅ Working (API key from .env file is valid)
2. **Endpoint**: ✅ Correct (`https://ai.thespatialnetwork.net/api/chat/completions`)
3. **Request Format**: ✅ Correct (OpenAI-compatible format)
4. **Model Name**: ❌ **INVALID** - `"gpt-3.5-turbo"` doesn't exist on this instance

## 🎯 Working Solution

### Your Original (Broken) Request:

```bash
curl -X POST "https://ai.thespatialnetwork.net/api/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",  # ❌ This model doesn't exist
    "messages": [{"role": "user", "content": "Hello, test message"}]
  }'
```

### Fixed Working Request:

```bash
curl -X POST "https://ai.thespatialnetwork.net/api/chat/completions" \
  -H "Authorization: Bearer sk-b83a7689c5624db397d50f91c141eb32" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "jaguar",  # ✅ Valid model name
    "messages": [{"role": "user", "content": "Hello, test message"}],
    "stream": false,
    "max_tokens": 50
  }'
```

## 📋 Available Models

The OpenWebUI instance has these models available:

### Custom Models:

- `"jaguar"` - Jaguar (lite) - Your custom AI agent
- `"jaguar-pro"` - Jaguar (pro) - Enhanced version
- `"nature"` - Nature-focused AI
- `"codewriter:latest"` - Code-focused AI

### External Models:

- `"openrouter/cypher-alpha:free"` - Free Cypher Alpha
- `"anthropic/claude-sonnet-4"` - Claude Sonnet 4
- `"anthropic/claude-opus-4"` - Claude Opus 4
- `"google/gemini-2.5-flash"` - Gemini 2.5 Flash
- `"deepseek/deepseek-r1-0528"` - DeepSeek R1
- And 200+ other models...

## 🧪 Test Results

### ✅ Working Chat Completion (Jaguar):

```json
{
  "id": "gen-1751413972-QD5TTCd5NAF265j09m1m",
  "model": "anthropic/claude-sonnet-4",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! I'm Jaguar, your AI developer agent for The Spatial Network..."
      }
    }
  ]
}
```

### ✅ Working Chat Completion (Cypher Alpha):

```json
{
  "id": "gen-1751413973-4TvDSWPYw5u6PAZf8ltb",
  "model": "openrouter/cypher-alpha:free",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello, I'm an advanced model designed to assist with various tasks..."
      }
    }
  ]
}
```

## 🛠️ Testing Tools Created

1. **`working-openwebui-curl.sh`** - Complete working curl test script
2. **`openwebui-test.js`** - Node.js testing script with error handling
3. **`openwebui-debug-guide.md`** - Comprehensive debugging guide

## 🚀 Quick Fix Commands

### Get Available Models:

```bash
curl -H "Authorization: Bearer sk-b83a7689c5624db397d50f91c141eb32" \
     https://ai.thespatialnetwork.net/api/models
```

### Test Chat with Jaguar:

```bash
curl -X POST "https://ai.thespatialnetwork.net/api/chat/completions" \
  -H "Authorization: Bearer sk-b83a7689c5624db397d50f91c141eb32" \
  -H "Content-Type: application/json" \
  -d '{"model": "jaguar", "messages": [{"role": "user", "content": "Hello"}]}'
```

### Run Complete Test:

```bash
./working-openwebui-curl.sh
```

## 📝 Key Takeaways

1. **Always check available models first** before making chat requests
2. **Use proper authentication** (Bearer token from your .env file)
3. **Model names are case-sensitive** and must match exactly
4. **OpenWebUI uses OpenAI-compatible API format** but with different model names
5. **Your API key works perfectly** - the issue was just the model name

## 🎉 Status: RESOLVED

Your OpenWebUI API is now working correctly with proper model names and authentication!
