# API Testing Summary

## The Problem with Your Original Curl Request

Your curl request failed with `{"code":"bad_request:api","message":"The request couldn't be processed. Please check your input and try again."}` because it was missing required fields and had invalid data format.

## Key Issues Identified

### 1. Missing Required Fields

- `message.createdAt` - Required ISO date string
- `message.content` - Required string field (1-2000 chars)

### 2. Invalid UUID Format

- Used `"test-chat-id"` instead of proper UUID
- Used `"test-msg-id"` instead of proper UUID

### 3. Schema Validation

The API uses Zod schema validation that requires:

```typescript
{
  id: string (UUID),
  message: {
    id: string (UUID),
    createdAt: Date,
    role: "user",
    content: string (1-2000 chars),
    parts: Array<{type: "text", text: string}>
  },
  selectedChatModel: "chat-model" | "chat-model-reasoning",
  selectedVisibilityType: "public" | "private"
}
```

## Testing Tools Created

### 1. Node.js Test Script (`test-api.js`)

- Generates proper UUIDs and timestamps
- Formats request correctly
- Provides clean output without terminal spam
- Usage: `node test-api.js test`

### 2. Corrected Curl Script (`corrected-curl.sh`)

- Bash script with proper UUID generation
- Includes all required fields
- Clean output with status codes
- Usage: `./corrected-curl.sh`

### 3. Debug Analysis (`api-debug-analysis.md`)

- Complete breakdown of issues
- Schema requirements
- Expected responses

## Next Steps for Testing

1. **Start your development server:**

   ```bash
   npm run dev
   ```

2. **Test with the corrected format:**

   ```bash
   ./corrected-curl.sh
   ```

3. **Expected responses:**
   - **Without auth:** `HTTP 401` with `{"code":"unauthorized:chat"}`
   - **With auth:** `HTTP 200` with streaming response
   - **Bad format:** `HTTP 400` with `{"code":"bad_request:api"}`

## Authentication Requirements

The API requires a valid session. To test with authentication:

1. Log in through the web interface
2. Extract session cookies from browser dev tools
3. Add cookies to your curl request:
   ```bash
   curl -X POST "http://localhost:3000/api/chat" \
     -H "Content-Type: application/json" \
     -H "Cookie: your-session-cookies-here" \
     -d "$(cat corrected-request.json)"
   ```

## Summary

Your original request failed due to schema validation errors. The corrected format includes all required fields with proper data types. Use the provided testing tools to debug API calls without overwhelming your terminal with responses.
