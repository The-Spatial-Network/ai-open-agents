# 🐳 Docker Testing Guide

**Complete guide to test the Jaguar Monorepo with Docker locally**

## 🚀 Quick Start

### 1. Start Docker Desktop
Make sure Docker Desktop is running on your machine.

### 2. Test the Complete Setup
```bash
cd jaguar-monorepo

# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 3. Access Services
- **Jaguar SDK**: http://localhost:3000
- **OpenWebUI**: http://localhost:3002  
- **Tool Server API**: http://localhost:8000/docs
- **Redis**: localhost:6379

## 🏗️ Architecture

### **Local Docker Setup:**
```
localhost:3000 → Jaguar SDK (Docker)
localhost:3002 → OpenWebUI (Docker)
localhost:8000 → Tool Server (Docker)
localhost:6379 → Redis (Docker)
```

### **Service Communication:**
```
Jaguar SDK → OpenWebUI (internal: open-web-ui:8080)
OpenWebUI → Tool Server (internal: tool-server:8000)
Tool Server → GitHub API (external)
```

## 🧪 Testing Commands

### **Start Services:**
```bash
# Start all services with build
docker-compose up --build

# Start in background
docker-compose up --build -d

# Start specific service
docker-compose up jaguar-sdk
```

### **Check Status:**
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs jaguar-sdk
docker-compose logs open-web-ui
docker-compose logs tool-server
```

### **Stop Services:**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove images
docker-compose down --rmi all
```

## 🔧 Troubleshooting

### **Common Issues:**

**"Cannot connect to Docker daemon"**
- Start Docker Desktop
- Check Docker is running: `docker --version`

**"Port already in use"**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3002
lsof -i :8000

# Kill processes if needed
kill -9 <PID>
```

**"Build failed"**
```bash
# Clean build
docker-compose build --no-cache

# Remove old images
docker system prune -a
```

**"Service not responding"**
```bash
# Check container logs
docker-compose logs <service-name>

# Restart specific service
docker-compose restart <service-name>
```

## 🧪 Integration Testing

### **1. Test Jaguar SDK**
```bash
curl http://localhost:3000
```
Should return the Jaguar SDK homepage.

### **2. Test OpenWebUI**
```bash
curl http://localhost:3002
```
Should return the OpenWebUI interface.

### **3. Test Tool Server**
```bash
curl http://localhost:8000/health
```
Should return health status JSON.

### **4. Test Complete Flow**
```bash
# Run the integration test
python3 test-local-integration.py
```

## 🔄 Development Workflow

### **Code Changes:**
```bash
# Rebuild after code changes
docker-compose up --build

# Rebuild specific service
docker-compose build jaguar-sdk
docker-compose up jaguar-sdk
```

### **Environment Changes:**
```bash
# Edit .env file
nano .env

# Restart services to pick up changes
docker-compose down
docker-compose up -d
```

### **Database Changes:**
```bash
# Access Jaguar SDK container
docker-compose exec jaguar-sdk sh

# Run database migrations
npm run db:migrate
```

## 📊 Monitoring

### **View Real-time Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f jaguar-sdk
```

### **Resource Usage:**
```bash
# View container stats
docker stats

# View disk usage
docker system df
```

## 🚀 Production Simulation

### **Test Production Build:**
```bash
# Use production docker-compose
docker-compose -f docker-compose-production.yml up --build
```

### **Environment Variables:**
```bash
# Copy production environment
cp .env.production .env

# Edit with local values
nano .env

# Test with production config
docker-compose up --build
```

## ✅ Success Checklist

- [ ] Docker Desktop is running
- [ ] All services start without errors
- [ ] Jaguar SDK accessible at localhost:3000
- [ ] OpenWebUI accessible at localhost:3002
- [ ] Tool Server API docs at localhost:8000/docs
- [ ] Integration test passes
- [ ] Services can communicate internally
- [ ] GitHub integration works (with token)

## 🎯 Expected Results

When everything is working:

1. **Jaguar SDK** loads with authentication
2. **OpenWebUI** provides AI chat interface
3. **Tool Server** exposes GitHub integration APIs
4. **Services communicate** through Docker network
5. **AI workflow** functions end-to-end

## 🔗 Next Steps

Once local testing works:

1. **Push to GitHub** to trigger deployment
2. **Monitor GitHub Actions** for build status
3. **Verify production deployment** on Digital Ocean
4. **Test production domains**:
   - https://jaguar-sdk.thespatialnetwork.net
   - https://ai.thespatialnetwork.net

---

**Ready to test the complete dockerized Jaguar Monorepo!** 🐆

Start Docker Desktop and run `docker-compose up --build` to begin testing.
