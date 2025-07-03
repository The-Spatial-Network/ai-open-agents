# OpenWebUI API Debug Guide

## Test Results from ai.thespatialnetwork.net

### Current Status

- **Health Check**: ✅ Returns HTML (web interface)
- **Models Endpoint**: ❌ 401 Unauthorized (requires auth)
- **Chat Completions**: ❌ 401 Unauthorized (requires auth)
- **Alternative Endpoints**: ✅ Returns HTML (web interface)

## Authentication Required

The OpenWebUI API requires authentication for most endpoints. Your original curl request failed because:

1. **Missing Authentication**: No API key or session token provided
2. **Wrong Endpoint**: May need different endpoint path
3. **Wrong Format**: OpenWebUI might use different request format than OpenAI

## How to Get Authentication

### Option 1: API Key Authentication

1. Log into https://ai.thespatialnetwork.net
2. Go to Settings → API Keys
3. Generate a new API key
4. Use in requests:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://ai.thespatialnetwork.net/api/models
   ```

### Option 2: Session-based Authentication

1. Log into the web interface
2. Extract session cookies from browser dev tools
3. Use cookies in requests:
   ```bash
   curl -H "Cookie: session=your_session_cookie" \
        https://ai.thespatialnetwork.net/api/models
   ```

## Corrected Curl Commands

### 1. Get Available Models

```bash
curl -X GET "https://ai.thespatialnetwork.net/api/models" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. Chat Completion (OpenAI Format)

```bash
curl -X POST "https://ai.thespatialnetwork.net/api/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "Hello, test message"
      }
    ],
    "stream": false
  }'
```

### 3. Alternative OpenWebUI Format

```bash
curl -X POST "https://ai.thespatialnetwork.net/api/chat" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "default-model",
    "messages": [
      {
        "role": "user",
        "content": "Hello, test message"
      }
    ]
  }'
```

## Testing Scripts

### Node.js Test (with API key)

```bash
OPENWEBUI_API_KEY=your_key_here node openwebui-test.js
```

### Bash Test (with API key)

Edit `openwebui-test.sh` and replace `YOUR_API_KEY_HERE` with your actual key, then:

```bash
./openwebui-test.sh
```

## Common OpenWebUI Endpoints

- `/api/models` - List available models (requires auth)
- `/api/chat/completions` - OpenAI-compatible chat (requires auth)
- `/api/chat` - OpenWebUI native chat (requires auth)
- `/api/health` - Health check (public)
- `/api/auth/signin` - Authentication
- `/api/users/me` - Current user info (requires auth)

## Debugging Steps

1. **Get Authentication**: Obtain API key or session cookies
2. **Test Models Endpoint**: Verify auth works with simple GET request
3. **Test Chat**: Use correct model name from models endpoint
4. **Check Response Format**: OpenWebUI might return different format than OpenAI

## Expected Response Formats

### Models Response

```json
{
  "data": [
    {
      "id": "model-name",
      "object": "model",
      "created": 1234567890,
      "owned_by": "openwebui"
    }
  ]
}
```

### Chat Response

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "model-name",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you?"
      },
      "finish_reason": "stop"
    }
  ]
}
```

## Next Steps

1. Obtain API key from ai.thespatialnetwork.net
2. Test authentication with models endpoint
3. Use correct model names from the models response
4. Test chat completions with proper authentication
