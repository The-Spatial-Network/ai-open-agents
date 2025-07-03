# GitHub Integration for AI Open Agents Tool Server

This document describes the GitHub integration that has been added to the AI Open Agents Tool Server.

## Overview

The GitHub integration allows your AI platform to create issues in GitHub repositories through a REST API. This enables automated issue creation, bug reporting, and task management workflows.

## Features

- **Create GitHub Issues**: Full-featured issue creation with support for labels, assignees, and milestones
- **Simple Issue Creation**: Streamlined endpoint for basic issue creation
- **Health Monitoring**: GitHub API connection status in health checks
- **Error Handling**: Comprehensive error handling with meaningful error messages
- **Token Validation**: Automatic GitHub token validation on startup

## Setup

### 1. Install Dependencies

The required dependencies have been added to `requirements.txt`:
```
PyGithub>=1.59.1
```

Install with:
```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Add the following variables to your `.env` file:

```bash
# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_DEFAULT_OWNER=your_default_github_username
GITHUB_DEFAULT_REPO=your_default_repository_name
```

### 3. GitHub Personal Access Token

Create a GitHub Personal Access Token with the following permissions:
- `repo` (Full control of private repositories) - for creating issues
- `public_repo` (Access public repositories) - if only working with public repos

To create a token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Select the required scopes
4. Copy the token to your `.env` file

## API Endpoints

### 1. Create GitHub Issue (Full Featured)

**POST** `/github/issues`

Creates a new issue with full GitHub features support.

**Request Body:**
```json
{
  "owner": "username",
  "repo": "repository-name",
  "title": "Issue title",
  "body": "Issue description",
  "labels": ["bug", "enhancement"],
  "assignees": ["username1", "username2"],
  "milestone": 1
}
```

**Response:**
```json
{
  "id": 123456789,
  "number": 42,
  "title": "Issue title",
  "body": "Issue description",
  "state": "open",
  "url": "https://github.com/username/repo/issues/42",
  "api_url": "https://api.github.com/repos/username/repo/issues/42",
  "labels": ["bug", "enhancement"],
  "assignees": ["username1"],
  "milestone": "v1.0",
  "created_at": "2025-01-02T21:35:00Z",
  "updated_at": "2025-01-02T21:35:00Z",
  "author": "token_owner",
  "repository": {
    "owner": "username",
    "name": "repository-name",
    "full_name": "username/repository-name"
  }
}
```

### 2. Create Simple GitHub Issue

**POST** `/github/issues/simple`

Creates a basic issue with minimal parameters using a request body to avoid URL length constraints.

**Request Body:**
```json
{
  "owner": "username",
  "repo": "repository-name",
  "title": "Issue title",
  "body": "Issue description (optional)"
}
```

**Response:** Same as the full-featured endpoint above.

### 3. Health Check

**GET** `/health`

The health check endpoint now includes GitHub status:

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "supabase": "connected",
    "github": {
      "status": "connected",
      "user": "your_username",
      "rate_limit": {
        "remaining": 4999,
        "limit": 5000,
        "reset": "2025-01-02T22:35:00Z"
      }
    }
  }
}
```

## Error Handling

The API provides detailed error messages for common scenarios:

- **503 Service Unavailable**: GitHub not configured (missing token)
- **400 Bad Request**: Invalid request data (missing repo, invalid labels, etc.)
- **404 Not Found**: Repository not found or access denied
- **403 Forbidden**: Insufficient permissions
- **422 Unprocessable Entity**: Invalid issue data
- **500 Internal Server Error**: Unexpected errors

## Usage Examples

### Using curl

```bash
# Create a simple issue
curl -X POST "http://localhost:8000/github/issues/simple" \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "myuser",
    "repo": "myrepo",
    "title": "API Integration Issue",
    "body": "Testing the new GitHub integration"
  }'

# Create a full-featured issue
curl -X POST "http://localhost:8000/github/issues" \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "myuser",
    "repo": "myrepo",
    "title": "Bug Report",
    "body": "Detailed bug description",
    "labels": ["bug", "priority-high"],
    "assignees": ["developer1"]
  }'
```

### Using Python requests

```python
import requests

# Create an issue
response = requests.post(
    "http://localhost:8000/github/issues",
    json={
        "owner": "myuser",
        "repo": "myrepo",
        "title": "Automated Issue",
        "body": "This issue was created via API",
        "labels": ["automation"]
    }
)

if response.status_code == 200:
    issue = response.json()
    print(f"Created issue #{issue['number']}: {issue['url']}")
else:
    print(f"Error: {response.status_code} - {response.text}")
```

## Security Considerations

1. **Token Security**: Keep your GitHub token secure and never commit it to version control
2. **Rate Limiting**: GitHub API has rate limits (5000 requests/hour for authenticated requests)
3. **Permissions**: Use tokens with minimal required permissions
4. **CORS**: Configure CORS appropriately for production use
5. **Input Validation**: All inputs are validated before sending to GitHub API

## Troubleshooting

### Common Issues

1. **"GitHub integration not configured"**
   - Ensure `GITHUB_TOKEN` is set in your `.env` file
   - Verify the token is valid and has required permissions

2. **"Repository not found or access denied"**
   - Check repository owner and name spelling
   - Verify your token has access to the repository
   - Ensure the repository exists

3. **"Invalid labels"**
   - Labels must exist in the target repository
   - Create labels in GitHub before using them via API

4. **"Insufficient permissions"**
   - Your token needs `repo` or `public_repo` scope
   - You need write access to the repository

### Testing the Integration

1. Check health endpoint: `GET /health`
2. Try creating a simple issue in a repository you own
3. Verify the issue appears in GitHub
4. Test error scenarios (invalid repo, missing permissions)

## File Structure

```
tools/
├── python/utils/
│   ├── github.py          # GitHub client implementation
│   └── ...
├── main.py                # FastAPI app with GitHub endpoints
├── requirements.txt       # Updated with PyGithub
└── .env.example          # Updated with GitHub variables
```

## Next Steps

This integration provides the foundation for GitHub issue creation. You can extend it by adding:

- Issue updating and closing
- Comment management
- Pull request creation
- Repository management
- Webhook handling
- Advanced search and filtering

The modular design makes it easy to add these features as needed.
