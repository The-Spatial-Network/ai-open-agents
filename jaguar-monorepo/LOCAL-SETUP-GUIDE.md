# 🚀 Local Development Setup Guide

**Complete guide to set up the Jaguar Monorepo for local development with OpenWebUI integration**

## ✅ Current Status

Based on our testing, here's what's working:

- ✅ **Monorepo Structure**: Properly configured with pnpm workspaces
- ✅ **Jaguar SDK**: Running on port 3001 and configured to use local OpenWebUI
- ✅ **Tool Server**: Running on port 8000 with GitHub integration endpoints
- ✅ **API Documentation**: Available at http://localhost:8000/docs
- ⚠️ **OpenWebUI**: Needs to be started (will run on port 3000)
- ⚠️ **GitHub Integration**: Needs GitHub token for full functionality

## 🔧 Step-by-Step Setup

### 1. Environment Configuration

The environment files are already created. You just need to add your credentials:

```bash
# Edit the main environment file
nano jaguar-monorepo/.env

# Edit the Jaguar SDK environment file  
nano jaguar-monorepo/packages/jaguar-sdk/.env
```

**Required credentials:**
- `GITHUB_TOKEN`: Get from https://github.com/settings/tokens
- `OPEN_ROUTER_API_KEY`: Get from https://openrouter.ai/
- `POSTGRES_URL`: Your Supabase database URL

### 2. Start All Services

```bash
cd jaguar-monorepo

# Option A: Start everything with Docker (recommended)
pnpm docker:up

# Option B: Start services individually
# Terminal 1: Tool Server
cd packages/ai-open-agents/tools && python3 main.py

# Terminal 2: Jaguar SDK  
cd packages/jaguar-sdk && npm run dev

# Terminal 3: OpenWebUI (via Docker)
docker-compose up open-web-ui
```

### 3. Verify Setup

```bash
# Run the integration test
python3 test-local-integration.py
```

## 🌐 Service URLs

| Service | URL | Status | Purpose |
|---------|-----|--------|---------|
| **OpenWebUI** | http://localhost:3000 | ⚠️ Needs start | AI chat interface |
| **Jaguar SDK** | http://localhost:3001 | ✅ Running | AI agent platform |
| **Tool Server** | http://localhost:8000 | ✅ Running | GitHub integration |
| **API Docs** | http://localhost:8000/docs | ✅ Available | Tool documentation |

## 🔄 Local AI Flow

The local development setup creates this flow:

```
User → Jaguar SDK (3001) → OpenWebUI (3000) → Tool Server (8000) → GitHub API
```

1. **User** interacts with Jaguar SDK web interface
2. **Jaguar SDK** sends AI requests to local OpenWebUI instance
3. **OpenWebUI** processes requests and can call tool server for GitHub operations
4. **Tool Server** provides GitHub integration (read code, create issues, etc.)
5. **Results** flow back through the chain to the user

## 🧪 Testing the Integration

### 1. Basic Connectivity Test

```bash
# Test tool server
curl http://localhost:8000/health

# Test Jaguar SDK
curl http://localhost:3001

# Test OpenWebUI (once started)
curl http://localhost:3000/health
```

### 2. GitHub Integration Test

```bash
# Set your GitHub token
export GITHUB_TOKEN=ghp_your_token_here

# Test repository analysis
curl -X GET "http://localhost:8000/github/analyze/octocat/Hello-World"

# Test file reading
curl -X GET "http://localhost:8000/github/repo/octocat/Hello-World/files/README"
```

### 3. Self-Development Test

```bash
# Create a self-development task
curl -X POST "http://localhost:8000/github/self-development/task" \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "your-username",
    "repo": "test-repo",
    "task_type": "improvement",
    "title": "Test self-development",
    "description": "Testing the AI self-development workflow",
    "priority": "medium"
  }'
```

## 🎯 End-to-End Workflow Test

Once everything is running, test the complete workflow:

### 1. Open Jaguar SDK
Visit http://localhost:3001 and interact with the AI interface

### 2. Open OpenWebUI  
Visit http://localhost:3000 and start a chat

### 3. Test AI Self-Development
Ask the AI: *"Analyze this monorepo and create improvement issues"*

The AI should:
1. Use the tool server to read the repository structure
2. Analyze the code for improvements
3. Create structured GitHub issues
4. Report back with issue numbers and links

## 🔧 Configuration Details

### Jaguar SDK Configuration

The Jaguar SDK is configured to use the local OpenWebUI instance:

```typescript
// In packages/jaguar-sdk/lib/ai/providers.ts
const jaguarProvider = createOpenAI({
  baseURL: `${process.env.JAGUAR_BASE_URL}/api`, // http://localhost:3000/api
  apiKey: process.env.JAGUAR_API_KEY,
});
```

### Environment Variables

**Local Development (.env):**
```bash
# Jaguar SDK connects to local OpenWebUI
JAGUAR_BASE_URL=http://localhost:3000
JAGUAR_API_KEY=your-openwebui-api-key-here
```

**Production (.env):**
```bash
# Jaguar SDK connects to hosted service
JAGUAR_BASE_URL=https://ai.thespatialnetwork.net
JAGUAR_API_KEY=sk-your-jaguar-api-key-here
```

## 🐛 Troubleshooting

### Common Issues

**"Tool server not responding"**
```bash
# Check if it's running
ps aux | grep python3

# Restart it
cd jaguar-monorepo/packages/ai-open-agents/tools
python3 main.py
```

**"OpenWebUI not accessible"**
```bash
# Start with Docker
cd jaguar-monorepo
docker-compose up open-web-ui

# Check logs
docker-compose logs open-web-ui
```

**"Jaguar SDK can't connect to OpenWebUI"**
- Ensure `JAGUAR_BASE_URL=http://localhost:3000` in `.env`
- Verify OpenWebUI is running on port 3000
- Check that API key is correct

**"GitHub integration failing"**
- Set `GITHUB_TOKEN` in environment
- Verify token has repo access permissions
- Check rate limits: `curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit`

### Port Conflicts

If you have port conflicts:

```bash
# Check what's using the ports
lsof -i :3000  # OpenWebUI
lsof -i :3001  # Jaguar SDK  
lsof -i :8000  # Tool Server

# Kill processes if needed
kill -9 <PID>
```

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ All services respond to health checks
2. ✅ Jaguar SDK loads at http://localhost:3001
3. ✅ OpenWebUI loads at http://localhost:3000
4. ✅ Tool server API docs load at http://localhost:8000/docs
5. ✅ AI can analyze repositories and create GitHub issues
6. ✅ Integration test passes: `python3 test-local-integration.py`

## 🚀 Next Steps

Once the local setup is working:

1. **Test Self-Development**: Ask AI to analyze and improve the codebase
2. **Create GitHub Issues**: Watch AI create structured improvement tasks
3. **Monitor Workflows**: See GitHub Actions triggered by AI
4. **Iterate and Improve**: The AI will learn and improve its development process

---

**You now have a fully functional local development environment for the world's first self-evolving AI development platform!** 🐆

The AI agents can read their own code, create GitHub issues, and continuously improve themselves - all running locally on your machine.
