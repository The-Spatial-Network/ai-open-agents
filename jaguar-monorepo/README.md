# 🐆 Jaguar Monorepo

**The world's first self-evolving AI development platform with GitHub integration**

A unified monorepo combining the Jaguar SDK (Next.js AI platform) with AI Open Agents (OpenWebUI + Tool Server) for complete AI agent collaboration, self-development capabilities, and GitHub integration.

_OpenSourceEverything_

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** - [Install Docker](https://docs.docker.com/get-docker/)
- **Git** - For cloning the repository
- **API Keys** - OpenRouter API key for AI models
- **GitHub Token** - For GitHub integration and self-development features

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd jaguar-monorepo

# Configure environment
cp .env.example .env
# Edit .env with your API keys (see Configuration section)
```

### 2. Start All Services
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 3. Access Services
- **Jaguar SDK**: http://localhost:3000 (AI Agent Platform)
- **OpenWebUI**: http://localhost:3002 (AI Chat Interface)
- **Tool Server**: http://localhost:8000/docs (GitHub Integration API)

## 🏗️ Architecture

### Local Development
```
localhost:3000 → Jaguar SDK (Next.js AI Platform)
localhost:3002 → OpenWebUI (AI Chat Interface)
localhost:8000 → Tool Server (GitHub Integration)
localhost:6379 → Redis (Caching)
```

### Production Deployment
```
jaguar-sdk.thespatialnetwork.net → Jaguar SDK
ai.thespatialnetwork.net → OpenWebUI
Internal: Tool Server + Redis + GitHub Integration
```

## 🧩 Components

### [Jaguar SDK](packages/jaguar-sdk/)
The Next.js-based AI agent collaboration platform that provides:
- **Multi-agent chat interface**
- **Authentication and user management**
- **Integration with OpenWebUI for AI processing**
- **Real-time collaboration features**

### [Open Web UI](https://github.com/open-webui/open-webui)
[Open Web UI](https://github.com/open-webui/open-webui) is the core of this project. It provides an OpenSource platform for building on top of AI. It's a user-friendly interface for interacting with various AI models and integrating custom tools.

Key features:
- Web-based chat interface for AI interactions
- Support for multiple AI models
- Integration with custom tools via OpenAPI
- User management and conversation history

### Custom Tool Server
Open Web UI supports integrating OpenAPI servers as tools that you can use to give your AI assistants agentic behavior. These tools allow the AI to perform actions in the real world, such as accessing databases, interacting with file systems, or calling external APIs.

We build a custom docker image in the `/packages/ai-open-agents/tools` directory and deploy it in our docker-compose file. This server exposes a set of OpenAPI endpoints that the AI can use to perform specific tasks related to environmental regeneration and GitHub integration.

The tool server is built using:
- FastAPI for the API framework
- Python for the backend logic
- Docker for containerization and deployment

#### Tool Utilities
`packages/ai-open-agents/tools/python/utils/*`

Our tool server includes various utility modules to interact with external services:

* **GitHub Integration**: 
  * Located at: `tools/python/utils/github.py`
  * Configuration: Requires `GITHUB_TOKEN` environment variable
  * Purpose: Create issues, analyze repositories, trigger workflows, and enable self-development capabilities

* **Supabase Integration**: 
  * Located at: `tools/python/utils/supabase.py`
  * Configuration: Requires `SUPABASE_API_URL` and `SUPABASE_API_KEY` environment variables
  * Purpose: Store and retrieve data from our Supabase database, including project information and business plans

* **NextCloud Integration**: (Coming Soon)
  * Will provide file storage and sharing capabilities
  * Will allow AI agents to access and manipulate documents, images, and other files
  * Planned location: `tools/utils/nextcloud.py`

* **WordPress Integration**: (Under Consideration)
  * Would enable AI agents to publish content to WordPress sites
  * Could be used for automated reporting, blog posts about environmental initiatives, and public updates
  * Potential location: `tools/utils/wordpress.py`

## ⚙️ Configuration

### Required Environment Variables
```bash
# Essential for AI functionality
OPEN_ROUTER_API_KEY=your-open-router-api-key-here
TOOL_SERVER_API_KEY=keepthissecret

# GitHub integration (for self-development)
GITHUB_TOKEN=ghp_your_github_personal_access_token_here
GITHUB_DEFAULT_OWNER=your_default_github_username
GITHUB_DEFAULT_REPO=your_default_repository_name

# Auto-configured for Docker (don't change)
JAGUAR_BASE_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=jaguar-local-dev-secret-32-chars-minimum-length-required
```

### Getting API Keys

#### OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up and get your API key
3. Add to `.env`: `OPEN_ROUTER_API_KEY=your-key-here`

#### GitHub Token (Required for self-development features)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate token with `repo`, `workflow`, and `issues` permissions
3. Add to `.env`: `GITHUB_TOKEN=ghp_your-token-here`

## 🎯 Features

### Jaguar SDK (Port 3000)
- **AI Agent Collaboration Platform**
- **Multi-agent chat interface**
- **Authentication and user management**
- **Integration with OpenWebUI for AI processing**

### OpenWebUI (Port 3002)
- **Local AI model access**
- **Chat interface for AI interactions**
- **Tool integration for GitHub operations**
- **Support for multiple AI models**

### Tool Server (Port 8000)
- **GitHub API integration**
- **Repository analysis endpoints**
- **Issue creation automation**
- **Self-development capabilities**

### Self-Development Capabilities
1. **AI agents can read their own codebase**
2. **AI agents can create GitHub issues for improvements**
3. **AI agents can trigger automated workflows**
4. **Continuous learning and improvement**
5. **GitHub Copilot integration for automated issue resolution**

## 🧪 Testing & Validation

### Validate Setup
```bash
# Run validation script
python3 validate-docker-setup.py

# Expected output: ✅ All validations passed!
```

### Test GitHub Integration
```bash
# Test GitHub integration
python3 test-github-integration.py

# Expected output: ✅ GitHub integration working!
```

### Test Services
```bash
# Test each service endpoint
curl http://localhost:3000      # Jaguar SDK
curl http://localhost:3002      # OpenWebUI
curl http://localhost:8000/docs # Tool Server API

# Check service status
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs jaguar-sdk
docker-compose logs open-web-ui
docker-compose logs tool-server
```

## 🔧 Development

### Making Changes
```bash
# Rebuild after code changes
docker-compose up --build

# Rebuild specific service
docker-compose build jaguar-sdk
docker-compose up -d jaguar-sdk
```

### Environment Updates
```bash
# Edit environment variables
nano .env

# Restart services to apply changes
docker-compose down
docker-compose up -d
```

### Database Operations
```bash
# Access Jaguar SDK container
docker-compose exec jaguar-sdk sh

# Run database migrations
npm run db:migrate
```

## 🚀 Production Deployment

The entire platform is deployed using Docker Compose, which orchestrates the following containers:
- Jaguar SDK (Next.js AI Platform)
- Open Web UI frontend
- Custom Tool Server with GitHub integration
- Redis for caching
- Database (if needed)
- Any additional services

### GitHub Actions (Automated)
1. **Configure GitHub secrets** (see [GitHub Actions Setup](GITHUB-ACTIONS-SETUP.md))
2. **Push to main branch** to trigger deployment
3. **Monitor deployment** in GitHub Actions tab

### Manual Deployment
```bash
# Use production configuration
docker-compose -f docker-compose-production.yml up --build -d
```

See the `docker-compose.yml` file for the complete deployment configuration.

## 📚 Documentation

- **[Docker Setup Testing](DOCKER-SETUP-TESTING.md)** - Complete Docker testing guide
- **[GitHub Actions Setup](GITHUB-ACTIONS-SETUP.md)** - Automated deployment configuration
- **[Complete Setup Summary](COMPLETE-SETUP-SUMMARY.md)** - Full project overview
- **[GitHub Integration Guide](tools/README_GITHUB.md)** - GitHub tools documentation

## 🔍 Troubleshooting

### Common Issues

#### "Cannot connect to Docker daemon"
```bash
# Start Docker Desktop
open -a Docker  # macOS
# Or start Docker Desktop from Applications
```

#### "Port already in use"
```bash
# Find and kill processes using ports
lsof -i :3000 && kill -9 <PID>
lsof -i :3002 && kill -9 <PID>
lsof -i :8000 && kill -9 <PID>
```

#### "Service not responding"
```bash
# Check service logs
docker-compose logs <service-name>

# Restart specific service
docker-compose restart <service-name>
```

#### "Build failed"
```bash
# Clean Docker cache and rebuild
docker system prune -a
docker-compose build --no-cache
```

#### "GitHub integration not working"
```bash
# Check GitHub token permissions
# Ensure token has repo, workflow, and issues permissions
# Verify GITHUB_TOKEN is set in .env
```

### Getting Help
- Check service logs: `docker-compose logs`
- Validate setup: `python3 validate-docker-setup.py`
- Test GitHub integration: `python3 test-github-integration.py`
- Review documentation in the `/docs` folder

## 🎉 Success Metrics

When everything is working correctly:

- ✅ **All services start** without errors
- ✅ **Jaguar SDK** loads at http://localhost:3000
- ✅ **OpenWebUI** accessible at http://localhost:3002
- ✅ **Tool Server API** docs at http://localhost:8000/docs
- ✅ **Services communicate** internally via Docker network
- ✅ **AI workflow** functions end-to-end
- ✅ **GitHub integration** creates issues successfully
- ✅ **Self-development** capabilities active

## 🌟 What Makes This Special

### Revolutionary Capabilities:
1. **Self-Evolving AI Platform** - AI agents improve their own code
2. **GitHub Integration** - Direct code analysis and improvement
3. **Complete Local Development** - Everything runs in Docker
4. **Production-Ready Deployment** - Automated CI/CD pipeline
5. **Multi-Agent Collaboration** - Agents work together on complex tasks
6. **Environmental Regeneration Focus** - AI solutions for Earth's regeneration

### Technical Excellence:
- **Monorepo Architecture** with pnpm workspaces
- **Docker Containerization** for consistency
- **Traefik Routing** for production domains
- **GitHub Actions** for automated deployment
- **TypeScript/Python** integration
- **FastAPI** for robust tool server
- **Next.js** for modern web platform

## 🤝 Contributing

We welcome contributions to this project! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `docker-compose up --build`
5. Submit a pull request

## 📄 License

This project is licensed under the terms of the LICENSE file included in this repository.

---

**Ready to revolutionize AI development with GitHub integration!** 🐆

Start Docker Desktop and run `docker-compose up --build` to begin your journey with the world's first self-evolving AI platform that can improve its own code through GitHub integration.
