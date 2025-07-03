# 🐳 Docker Setup Testing Guide

**Complete guide to test the Jaguar Monorepo Docker deployment locally**

## 🚀 Prerequisites

### 1. Install Docker Desktop
- **macOS**: Download from [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Windows**: Download from [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- **Linux**: Follow [Docker Engine installation](https://docs.docker.com/engine/install/)

### 2. Verify Docker Installation
```bash
# Check Docker is running
docker --version
docker-compose --version

# Test Docker daemon
docker run hello-world
```

## 🔧 Environment Setup

### 1. Configure Environment Variables
```bash
cd jaguar-monorepo

# Copy environment template
cp .env.example .env

# Edit with your values (minimum required):
# OPEN_ROUTER_API_KEY=your-api-key-here
# TOOL_SERVER_API_KEY=keepthissecret
# GITHUB_TOKEN=your-github-token-here
```

### 2. Required Environment Variables
```bash
# Essential for testing:
OPEN_ROUTER_API_KEY=your-open-router-api-key-here
TOOL_SERVER_API_KEY=keepthissecret
GITHUB_TOKEN=ghp_your_github_personal_access_token_here

# Auto-configured for Docker:
JAGUAR_BASE_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=jaguar-local-dev-secret-32-chars-minimum-length-required
```

## 🧪 Docker Testing Steps

### Step 1: Build All Services
```bash
cd jaguar-monorepo

# Clean build (simulates Dokploy deployment)
docker-compose build --no-cache

# Expected output:
# ✅ Building tool-server
# ✅ Building jaguar-sdk
# ✅ Pulling open-web-ui
# ✅ Pulling redis
```

### Step 2: Start Services
```bash
# Start all services in background
docker-compose up -d

# Check service status
docker-compose ps

# Expected services:
# open-web-ui     (port 3002)
# jaguar-sdk-app  (port 3000)
# ai-tool-server  (port 8000)
# jaguar-redis    (port 6379)
```

### Step 3: Verify Service Health
```bash
# Test each service endpoint
curl -f http://localhost:3000 || echo "❌ Jaguar SDK not responding"
curl -f http://localhost:3002 || echo "❌ OpenWebUI not responding"
curl -f http://localhost:8000/health || echo "❌ Tool Server not responding"

# Check Redis
redis-cli -p 6379 ping || echo "❌ Redis not responding"
```

### Step 4: View Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs jaguar-sdk
docker-compose logs open-web-ui
docker-compose logs tool-server

# Follow logs in real-time
docker-compose logs -f
```

## 🌐 Service Testing

### Jaguar SDK (Port 3000)
```bash
# Test homepage
curl http://localhost:3000

# Test API health
curl http://localhost:3000/api/health

# Expected: HTML response or JSON health status
```

### OpenWebUI (Port 3002)
```bash
# Test interface
curl http://localhost:3002

# Test API
curl http://localhost:3002/api/v1/models

# Expected: OpenWebUI interface or API response
```

### Tool Server (Port 8000)
```bash
# Test API documentation
curl http://localhost:8000/docs

# Test health endpoint
curl http://localhost:8000/health

# Test GitHub integration
curl http://localhost:8000/github/repos

# Expected: FastAPI docs or JSON responses
```

## 🔍 Troubleshooting

### Common Issues

#### "Cannot connect to Docker daemon"
```bash
# Start Docker Desktop
open -a Docker

# Or restart Docker service (Linux)
sudo systemctl restart docker
```

#### "Port already in use"
```bash
# Find processes using ports
lsof -i :3000
lsof -i :3002
lsof -i :8000

# Kill processes if needed
kill -9 <PID>
```

#### "Build failed"
```bash
# Clean Docker cache
docker system prune -a

# Rebuild specific service
docker-compose build --no-cache jaguar-sdk
```

#### "Service not starting"
```bash
# Check specific service logs
docker-compose logs jaguar-sdk

# Restart specific service
docker-compose restart jaguar-sdk

# Check container status
docker ps -a
```

### Debug Commands
```bash
# Enter running container
docker-compose exec jaguar-sdk sh
docker-compose exec tool-server bash

# Check container resources
docker stats

# View container details
docker inspect jaguar-sdk-app
```

## 📊 Validation Checklist

### ✅ Build Validation
- [ ] All Docker images build successfully
- [ ] No build errors in logs
- [ ] Images created with correct tags

### ✅ Service Validation
- [ ] All containers start successfully
- [ ] All ports accessible from host
- [ ] Services respond to health checks

### ✅ Network Validation
- [ ] Services can communicate internally
- [ ] External API calls work (GitHub, OpenRouter)
- [ ] Database connections established

### ✅ Integration Validation
- [ ] Jaguar SDK loads authentication page
- [ ] OpenWebUI interface accessible
- [ ] Tool Server API documentation loads
- [ ] GitHub integration endpoints respond

## 🚀 Production Simulation

### Test Production Build
```bash
# Use production docker-compose
docker-compose -f docker-compose-production.yml build

# Start production services
docker-compose -f docker-compose-production.yml up -d

# Test with production environment
cp .env.production .env
# Edit with production values
docker-compose up -d
```

### Performance Testing
```bash
# Monitor resource usage
docker stats

# Test concurrent requests
ab -n 100 -c 10 http://localhost:3000/

# Check memory usage
docker-compose exec jaguar-sdk cat /proc/meminfo
```

## 🎯 Expected Results

### Successful Deployment:
1. **All services start** without errors
2. **Ports accessible**: 3000 (Jaguar), 3002 (OpenWebUI), 8000 (Tools)
3. **Health checks pass** for all services
4. **Logs show** successful initialization
5. **Services communicate** internally via Docker network

### Service Architecture:
```
localhost:3000 → Jaguar SDK (Docker)
    ↓ (internal network)
localhost:3002 → OpenWebUI (Docker)
    ↓ (internal network)  
localhost:8000 → Tool Server (Docker)
    ↓ (external API)
GitHub API
```

## 🔄 Development Workflow

### Code Changes
```bash
# Rebuild after changes
docker-compose build jaguar-sdk
docker-compose up -d jaguar-sdk

# Or rebuild all
docker-compose up --build
```

### Environment Changes
```bash
# Update .env file
nano .env

# Restart services to pick up changes
docker-compose down
docker-compose up -d
```

### Database Changes
```bash
# Access database container
docker-compose exec jaguar-sdk sh

# Run migrations
npm run db:migrate
```

## 📝 Next Steps

### After Successful Local Testing:
1. **Push to GitHub** to trigger CI/CD
2. **Monitor GitHub Actions** for automated deployment
3. **Verify production domains**:
   - https://jaguar-sdk.thespatialnetwork.net
   - https://ai.thespatialnetwork.net

### Continuous Testing:
1. **Regular builds** to catch issues early
2. **Integration tests** for new features
3. **Performance monitoring** for optimization

---

**Ready to test the complete Jaguar Monorepo Docker deployment!** 🐆

Start Docker Desktop and run through these steps to validate your local environment.
