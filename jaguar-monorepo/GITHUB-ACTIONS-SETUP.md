# 🚀 GitHub Actions Deployment Setup

**Complete guide to set up automated deployment to Digital Ocean**

## 🔧 Required GitHub Secrets

To enable automated deployment, you need to configure these secrets in your GitHub repository:

### **Digital Ocean Secrets:**
- `DO_HOST` - Your Digital Ocean droplet IP address
- `DO_USERNAME` - SSH username (usually `root` or `ubuntu`)
- `DO_SSH_KEY` - Private SSH key for server access
- `DO_PORT` - SSH port (optional, defaults to 22)

### **How to Add Secrets:**
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact names above

## 🔑 Setting Up SSH Access

### **1. Generate SSH Key Pair (if needed):**
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com"

# This creates:
# ~/.ssh/id_rsa (private key - add to DO_SSH_KEY secret)
# ~/.ssh/id_rsa.pub (public key - add to server)
```

### **2. Add Public Key to Digital Ocean:**
```bash
# Copy public key to server
ssh-copy-id -i ~/.ssh/id_rsa.pub root@your-server-ip

# Or manually add to ~/.ssh/authorized_keys on server
```

### **3. Test SSH Connection:**
```bash
ssh -i ~/.ssh/id_rsa root@your-server-ip
```

## 🏗️ Deployment Workflow

### **Trigger Events:**
- **Push to main/master** - Triggers full deployment
- **Pull Request** - Runs tests only
- **Manual trigger** - Can be run from GitHub Actions tab

### **Workflow Steps:**

#### **1. Test Phase:**
- ✅ Checkout code
- ✅ Build all Docker images
- ✅ Start services locally
- ✅ Test service endpoints
- ✅ Cleanup

#### **2. Build & Push Phase:**
- ✅ Build production Docker images
- ✅ Push to GitHub Container Registry
- ✅ Tag with branch and commit SHA
- ✅ Cache layers for faster builds

#### **3. Deploy Phase:**
- ✅ SSH into Digital Ocean server
- ✅ Pull latest code
- ✅ Download new Docker images
- ✅ Update production services
- ✅ Cleanup old images

## 📦 Container Registry

### **Images Built:**
- `ghcr.io/your-username/repo-name/jaguar-sdk:latest`
- `ghcr.io/your-username/repo-name/tool-server:latest`

### **Image Tags:**
- `latest` - Latest main branch
- `main-abc123` - Specific commit SHA
- `pr-123` - Pull request builds

## 🌐 Production Domains

After successful deployment:
- **Jaguar SDK**: https://jaguar-sdk.thespatialnetwork.net
- **OpenWebUI**: https://ai.thespatialnetwork.net

## 🔧 Server Requirements

### **Digital Ocean Droplet:**
- **Minimum**: 2 GB RAM, 1 vCPU, 50 GB SSD
- **Recommended**: 4 GB RAM, 2 vCPU, 80 GB SSD
- **OS**: Ubuntu 20.04+ or Debian 11+

### **Required Software:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt update && sudo apt install -y git

# Create deployment directory
sudo mkdir -p /opt/jaguar-monorepo
sudo chown $USER:$USER /opt/jaguar-monorepo
```

### **Traefik Setup (if not already configured):**
```bash
# Traefik should be running with proper labels
# for SSL certificates and domain routing
```

## 🧪 Testing the Workflow

### **1. Test Locally First:**
```bash
# Ensure Docker setup works locally
cd jaguar-monorepo
docker-compose up --build

# Test all endpoints
curl http://localhost:3000  # Jaguar SDK
curl http://localhost:3002  # OpenWebUI
curl http://localhost:8000/health  # Tool Server
```

### **2. Push to GitHub:**
```bash
git add .
git commit -m "feat: add GitHub Actions deployment"
git push origin main
```

### **3. Monitor Deployment:**
- Go to **Actions** tab in GitHub
- Watch the workflow progress
- Check logs for any errors

## 🔍 Troubleshooting

### **Common Issues:**

#### **SSH Connection Failed:**
```bash
# Test SSH manually
ssh -i ~/.ssh/id_rsa root@your-server-ip

# Check SSH key format (should be OpenSSH format)
ssh-keygen -p -m OpenSSH -f ~/.ssh/id_rsa
```

#### **Docker Build Failed:**
- Check Dockerfile syntax
- Ensure all dependencies are available
- Review build logs in Actions tab

#### **Service Not Starting:**
```bash
# SSH into server and check
ssh root@your-server-ip
cd /opt/jaguar-monorepo
docker-compose -f docker-compose-production.yml logs
```

#### **Domain Not Accessible:**
- Check Traefik configuration
- Verify DNS settings
- Check SSL certificate status

### **Debug Commands:**
```bash
# On the server
docker ps  # Check running containers
docker logs container-name  # Check specific logs
docker-compose -f docker-compose-production.yml ps  # Check services
```

## 📊 Monitoring

### **GitHub Actions:**
- Build status badges
- Deployment notifications
- Error alerts

### **Server Monitoring:**
```bash
# Check resource usage
docker stats

# Check disk space
df -h

# Check system resources
htop
```

## 🔄 Rollback Process

### **If Deployment Fails:**
```bash
# SSH into server
ssh root@your-server-ip

# Rollback to previous version
cd /opt/jaguar-monorepo
git checkout HEAD~1
docker-compose -f docker-compose-production.yml up -d
```

### **Emergency Rollback:**
```bash
# Use previous Docker images
docker-compose -f docker-compose-production.yml down
docker run -d --name jaguar-sdk-backup previous-image-tag
```

## ✅ Success Checklist

- [ ] GitHub secrets configured
- [ ] SSH access working
- [ ] Server has required software
- [ ] Local Docker build works
- [ ] GitHub Actions workflow runs
- [ ] Images pushed to registry
- [ ] Services deployed successfully
- [ ] Domains accessible
- [ ] SSL certificates working

## 🎯 Next Steps

1. **Set up monitoring** - Add health checks and alerts
2. **Configure backups** - Database and volume backups
3. **Add staging environment** - Test deployments before production
4. **Set up logging** - Centralized log collection
5. **Performance monitoring** - APM and metrics collection

---

**Ready for automated deployment!** 🚀

Configure the GitHub secrets and push to main to trigger your first automated deployment.
