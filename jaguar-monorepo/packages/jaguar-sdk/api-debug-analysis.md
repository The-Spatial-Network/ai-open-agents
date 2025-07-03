# API Debug Analysis

## Problems with Your Original Curl Request

Your original curl request:

```bash
curl -X POST "http://localhost:3000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-chat-id",
    "message": {
      "id": "test-msg-id",
      "role": "user",
      "parts": [{"type": "text", "text": "Hello, test message"}]
    },
    "selectedChatModel": "chat-model",
    "selectedVisibilityType": "private"
  }'
```

### Issues Found:

1. **Missing Required Fields in Message Object:**

   - `createdAt` - Required date field
   - `content` - Required string field (1-2000 chars)

2. **Invalid ID Format:**

   - `"test-chat-id"` and `"test-msg-id"` are not valid UUIDs
   - Schema requires proper UUID format

3. **Missing Authentication:**
   - The API requires authentication (session/user)
   - Your request has no auth headers or cookies

## Correct Request Format

Based on the schema analysis, here's the correct format:

```json
{
  "id": "2e94d3df-cc9c-4cb3-8aef-d235ce55441d",
  "message": {
    "id": "8e76d7c7-db68-4c8f-a143-1a92de015284",
    "createdAt": "2025-07-01T23:48:31.396Z",
    "role": "user",
    "content": "Hello, test message",
    "parts": [
      {
        "type": "text",
        "text": "Hello, test message"
      }
    ]
  },
  "selectedChatModel": "chat-model",
  "selectedVisibilityType": "private"
}
```

## Schema Requirements

From `app/(chat)/api/chat/schema.ts`:

- `id`: Must be a valid UUID
- `message.id`: Must be a valid UUID
- `message.createdAt`: Must be a valid date
- `message.role`: Must be "user"
- `message.content`: String, 1-2000 characters
- `message.parts`: Array of text parts
- `selectedChatModel`: "chat-model" or "chat-model-reasoning"
- `selectedVisibilityType`: "public" or "private"

## Testing Steps

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Test with proper authentication (if you have a session):

   ```bash
   node test-api.js test
   ```

3. Expected responses:
   - Without auth: `{"code":"unauthorized:chat","message":"..."}`
   - With auth: Stream response or success
   - Bad format: `{"code":"bad_request:api","message":"..."}`

## Authentication Notes

The API requires a valid session. You'll need to:

1. Log in through the web interface first
2. Extract session cookies
3. Include them in your curl request

Or use the test script which handles the request format correctly.
