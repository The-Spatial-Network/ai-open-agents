# Self-Hosting Guide

## Overview

This comprehensive guide will help you deploy your own Jaguar SDK instance with complete control over your data, AI models, and infrastructure. Self-hosting ensures privacy, customization, and alignment with your organization's values while maintaining the full power of the conscious AI platform.

## 🌱 Why Self-Host?

### Benefits of Self-Hosting

- **🔒 Data Privacy**: Complete control over your data and conversations
- **🎛️ Customization**: Tailor the platform to your specific needs
- **🌍 Environmental Control**: Choose renewable energy providers
- **💰 Cost Efficiency**: Optimize costs for your usage patterns
- **🛡️ Security**: Implement your own security policies
- **🌐 Compliance**: Meet regulatory requirements in your jurisdiction

### Use Cases

- **Enterprise Deployment**: Internal AI platform for organizations
- **Research Institutions**: Academic research and development
- **Privacy-Conscious Organizations**: Maximum data protection
- **Custom AI Solutions**: Specialized industry applications
- **Community Platforms**: Local or regional AI communities

## Architecture Overview

```mermaid
graph TB
    A[Load Balancer] --> B[Jaguar Frontend]
    A --> C[API Gateway]

    B --> D[Next.js Application]
    C --> E[Authentication Service]
    C --> F[AI Orchestration]
    C --> G[Ethics Engine]

    F --> H[OpenWebUI Instance]
    F --> I[Model Providers]

    G --> J[Permaculture Validator]
    G --> K[Sustainability Tracker]

    E --> L[PostgreSQL Database]
    F --> L
    G --> L

    L --> M[Backup Storage]

    N[Redis Cache] --> B
    N --> C

    O[Monitoring] --> A
    O --> B
    O --> C
    O --> L
```

## Deployment Options

### 1. Docker Compose (Recommended for Development)

Quick setup for development and testing environments.

#### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 8GB RAM minimum
- 50GB storage

#### Setup Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/serenelion/jaguar-sdk.git
   cd jaguar-sdk
   ```

2. **Configure Environment**

   ```bash
   cp .env.example .env.production
   # Edit .env.production with your configuration
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

#### Docker Compose Configuration

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  jaguar-frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - POSTGRES_URL=${POSTGRES_URL}
      - XAI_API_KEY=${XAI_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  jaguar-api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - POSTGRES_URL=${POSTGRES_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "8080:8080"
    environment:
      - WEBUI_SECRET_KEY=${WEBUI_SECRET_KEY}
      - OPENAI_API_BASE_URL=${OPENAI_API_BASE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - openwebui_data:/app/backend/data
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - jaguar-frontend
      - jaguar-api
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  openwebui_data:
```

### 2. Kubernetes Deployment (Production)

Scalable deployment for production environments.

#### Prerequisites

- Kubernetes cluster 1.24+
- kubectl configured
- Helm 3.0+
- Persistent storage
- Load balancer

#### Helm Chart Deployment

1. **Add Jaguar Helm Repository**

   ```bash
   helm repo add jaguar-sdk https://charts.jaguar-sdk.dev
   helm repo update
   ```

2. **Create Values File**

   ```yaml
   # values.production.yaml
   global:
     environment: production
     domain: your-domain.com

   frontend:
     replicas: 3
     image:
       repository: jaguar-sdk/frontend
       tag: latest
     resources:
       requests:
         memory: "512Mi"
         cpu: "250m"
       limits:
         memory: "1Gi"
         cpu: "500m"

   api:
     replicas: 3
     image:
       repository: jaguar-sdk/api
       tag: latest
     resources:
       requests:
         memory: "1Gi"
         cpu: "500m"
       limits:
         memory: "2Gi"
         cpu: "1000m"

   postgresql:
     enabled: true
     auth:
       database: jaguar_production
       username: jaguar
       password: your-secure-password
     primary:
       persistence:
         size: 100Gi
         storageClass: fast-ssd

   redis:
     enabled: true
     auth:
       enabled: true
       password: your-redis-password

   ingress:
     enabled: true
     className: nginx
     annotations:
       cert-manager.io/cluster-issuer: letsencrypt-prod
     tls:
       - secretName: jaguar-tls
         hosts:
           - your-domain.com

   monitoring:
     enabled: true
     prometheus:
       enabled: true
     grafana:
       enabled: true
   ```

3. **Deploy with Helm**
   ```bash
   helm install jaguar-sdk jaguar-sdk/jaguar-sdk \
     -f values.production.yaml \
     -n jaguar-production \
     --create-namespace
   ```

### 3. Cloud Provider Deployments

#### AWS Deployment

**Using AWS ECS with Fargate:**

```yaml
# aws-ecs-task-definition.json
{
  "family": "jaguar-sdk",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "4096",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions":
    [
      {
        "name": "jaguar-frontend",
        "image": "jaguar-sdk/frontend:latest",
        "portMappings": [{ "containerPort": 3000, "protocol": "tcp" }],
        "environment":
          [
            { "name": "NODE_ENV", "value": "production" },
            {
              "name": "POSTGRES_URL",
              "valueFrom": "arn:aws:ssm:region:account:parameter/jaguar/postgres-url",
            },
          ],
        "logConfiguration":
          {
            "logDriver": "awslogs",
            "options":
              {
                "awslogs-group": "/ecs/jaguar-sdk",
                "awslogs-region": "us-west-2",
                "awslogs-stream-prefix": "ecs",
              },
          },
      },
    ],
}
```

**Terraform Configuration:**

```hcl
# main.tf
provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "jaguar-sdk-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = true

  tags = {
    Environment = "production"
    Project     = "jaguar-sdk"
  }
}

module "rds" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "jaguar-sdk-db"

  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.large"
  allocated_storage = 100

  db_name  = "jaguar_production"
  username = "jaguar"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  subnet_ids            = module.vpc.private_subnets

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  tags = {
    Environment = "production"
    Project     = "jaguar-sdk"
  }
}

module "ecs" {
  source = "terraform-aws-modules/ecs/aws"

  cluster_name = "jaguar-sdk"

  cluster_configuration = {
    execute_command_configuration = {
      logging = "OVERRIDE"
      log_configuration = {
        cloud_watch_log_group_name = "/aws/ecs/jaguar-sdk"
      }
    }
  }

  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        weight = 50
      }
    }
    FARGATE_SPOT = {
      default_capacity_provider_strategy = {
        weight = 50
      }
    }
  }

  tags = {
    Environment = "production"
    Project     = "jaguar-sdk"
  }
}
```

#### Google Cloud Platform

**Using Cloud Run:**

```yaml
# cloudbuild.yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "gcr.io/$PROJECT_ID/jaguar-frontend", "."]
    dir: "frontend"

  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/jaguar-frontend"]

  - name: "gcr.io/cloud-builders/gcloud"
    args:
      - "run"
      - "deploy"
      - "jaguar-frontend"
      - "--image"
      - "gcr.io/$PROJECT_ID/jaguar-frontend"
      - "--region"
      - "us-central1"
      - "--platform"
      - "managed"
      - "--allow-unauthenticated"
      - "--set-env-vars"
      - "NODE_ENV=production,POSTGRES_URL=${_POSTGRES_URL}"

substitutions:
  _POSTGRES_URL: "postgresql://user:pass@host:5432/db"
```

#### Azure Container Instances

```yaml
# azure-container-group.yaml
apiVersion: 2019-12-01
location: eastus
name: jaguar-sdk
properties:
  containers:
    - name: jaguar-frontend
      properties:
        image: jaguar-sdk/frontend:latest
        resources:
          requests:
            cpu: 1
            memoryInGb: 2
        ports:
          - port: 3000
            protocol: TCP
        environmentVariables:
          - name: NODE_ENV
            value: production
          - name: POSTGRES_URL
            secureValue: postgresql://user:pass@host:5432/db

    - name: jaguar-api
      properties:
        image: jaguar-sdk/api:latest
        resources:
          requests:
            cpu: 1
            memoryInGb: 2
        ports:
          - port: 3001
            protocol: TCP

  osType: Linux
  ipAddress:
    type: Public
    ports:
      - protocol: tcp
        port: 80
      - protocol: tcp
        port: 443
    dnsNameLabel: jaguar-sdk-instance

tags:
  Environment: production
  Project: jaguar-sdk
```

## Configuration

### Environment Variables

Create a comprehensive `.env.production` file:

```bash
# Application
NODE_ENV=production
APP_URL=https://your-domain.com
PORT=3000

# Database
POSTGRES_URL=postgresql://user:password@host:5432/database
POSTGRES_SSL=true

# AI Providers
XAI_API_KEY=your-xai-api-key
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# OpenWebUI
OPENWEBUI_URL=http://openwebui:8080
WEBUI_SECRET_KEY=your-secret-key

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# Caching
REDIS_URL=redis://redis:6379

# Monitoring
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id

# Sustainability
CARBON_TRACKING_ENABLED=true
SUSTAINABILITY_REPORTING=true

# Security
RATE_LIMIT_ENABLED=true
CORS_ORIGINS=https://your-domain.com

# Backup
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"
BACKUP_RETENTION_DAYS=30
```

### SSL/TLS Configuration

#### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server jaguar-frontend:3000;
    }

    upstream api {
        server jaguar-api:3001;
    }

    upstream openwebui {
        server openwebui:8080;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=frontend:10m rate=30r/s;

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Frontend
        location / {
            limit_req zone=frontend burst=20 nodelay;
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API
        location /api/ {
            limit_req zone=api burst=10 nodelay;
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # OpenWebUI
        location /openwebui/ {
            proxy_pass http://openwebui/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

## Database Setup

### PostgreSQL Configuration

#### Production Database Setup

```sql
-- Create database and user
CREATE DATABASE jaguar_production;
CREATE USER jaguar WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE jaguar_production TO jaguar;

-- Connect to the database
\c jaguar_production;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO jaguar;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO jaguar;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO jaguar;
```

#### Database Migration

```bash
# Run migrations
npm run db:migrate

# Seed production data
npm run db:seed:production

# Create indexes for performance
npm run db:index:create
```

#### Backup Strategy

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="jaguar_production"
DB_USER="jaguar"
DB_HOST="localhost"

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -f "$BACKUP_DIR/jaguar_backup_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/jaguar_backup_$DATE.sql"

# Upload to cloud storage (optional)
aws s3 cp "$BACKUP_DIR/jaguar_backup_$DATE.sql.gz" s3://your-backup-bucket/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "jaguar_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: jaguar_backup_$DATE.sql.gz"
```

## Monitoring & Observability

### Prometheus & Grafana Setup

```yaml
# monitoring/docker-compose.yml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--web.console.libraries=/etc/prometheus/console_libraries"
      - "--web.console.templates=/etc/prometheus/consoles"
      - "--storage.tsdb.retention.time=200h"
      - "--web.enable-lifecycle"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - "--path.procfs=/host/proc"
      - "--path.rootfs=/rootfs"
      - "--path.sysfs=/host/sys"
      - "--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)"

volumes:
  prometheus_data:
  grafana_data:
```

### Application Metrics

```typescript
// lib/monitoring/metrics.ts
import { register, Counter, Histogram, Gauge } from "prom-client";

// HTTP request metrics
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// AI inference metrics
export const aiInferenceCounter = new Counter({
  name: "ai_inference_total",
  help: "Total number of AI inferences",
  labelNames: ["model", "provider", "status"],
});

export const aiInferenceDuration = new Histogram({
  name: "ai_inference_duration_seconds",
  help: "Duration of AI inferences in seconds",
  labelNames: ["model", "provider"],
  buckets: [0.5, 1, 2, 5, 10, 30],
});

// Sustainability metrics
export const carbonFootprint = new Gauge({
  name: "carbon_footprint_kg_co2",
  help: "Carbon footprint in kg CO2",
  labelNames: ["component", "timeframe"],
});

export const energyUsage = new Gauge({
  name: "energy_usage_kwh",
  help: "Energy usage in kWh",
  labelNames: ["component", "timeframe"],
});

// Ethics metrics
export const ethicsScore = new Histogram({
  name: "ethics_score",
  help: "Ethics validation scores",
  labelNames: ["principle", "component"],
  buckets: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(aiInferenceCounter);
register.registerMetric(aiInferenceDuration);
register.registerMetric(carbonFootprint);
register.registerMetric(energyUsage);
register.registerMetric(ethicsScore);
```

### Health Checks

```typescript
// lib/health/checks.ts
export interface HealthCheck {
  name: string;
  status: "healthy" | "unhealthy" | "degraded";
  message?: string;
  timestamp: Date;
}

export async function performHealthChecks(): Promise<HealthCheck[]> {
  const checks: HealthCheck[] = [];

  // Database health
  try {
    await db.raw("SELECT 1");
    checks.push({
      name: "database",
      status: "healthy",
      timestamp: new Date(),
    });
  } catch (error) {
    checks.push({
      name: "database",
      status: "unhealthy",
      message: error.message,
      timestamp: new Date(),
    });
  }

  // Redis health
  try {
    await redis.ping();
    checks.push({
      name: "redis",
      status: "healthy",
      timestamp: new Date(),
    });
  } catch (error) {
    checks.push({
      name: "redis",
      status: "unhealthy",
      message: error.message,
      timestamp: new Date(),
    });
  }

  // AI provider health
  try {
    const response = await fetch(`${process.env.OPENWEBUI_URL}/api/health`);
    if (response.ok) {
      checks.push({
        name: "ai_provider",
        status: "healthy",
        timestamp: new Date(),
      });
    } else {
      checks.push({
        name: "ai_provider",
        status: "degraded",
        message: `HTTP ${response.status}`,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    checks.push({
      name: "ai_provider",
      status: "unhealthy",
      message: error.message,
      timestamp: new Date(),
    });
  }

  return checks;
}
```

## Security

### Security Hardening

#### Application Security

```typescript
// lib/security/middleware.ts
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Rate limiting
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: "Too many authentication attempts",
  skipSuccessfulRequests: true,
});

// Input validation
export const validateInput = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
```

#### Infrastructure Security

```bash
#!/bin/bash
# security-hardening.sh

# Update system
apt-get update && apt-get upgrade -y

# Install fail2ban
apt-get install fail2ban -y

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable

# Secure SSH
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# Install and configure ClamAV
apt-get install clamav clamav-daemon -y
freshclam
systemctl enable clamav-daemon

# Set up log monitoring
apt-get install logwatch -y
echo "logwatch --output mail --mailto admin@your-domain.com --detail high" > /etc/cron.daily/logwatch

echo "Security hardening completed"
```

## Maintenance

### Automated Backups

```bash
#!/bin/bash
# automated-backup.sh

set -e

# Configuration
BACKUP_DIR="/backups"
S3_BUCKET="your-backup-bucket"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "Starting database backup..."
docker exec postgres pg_dump -U jaguar jaguar_production > "$BACKUP_DIR/db_backup_$DATE.sql"
gzip "$BACKUP_DIR/db_backup_$DATE.sql"

# Application data backup
echo "Starting application data backup..."
tar -czf "$BACKUP_DIR/app_data_$DATE.tar.gz" /app/data

# Upload to S3
echo "Uploading to S3..."
aws s3 cp "$BACKUP_DIR/db_backup_$DATE.sql.gz" "s3://$S3_BUCKET/database/"
aws s3 cp "$BACKUP_DIR/app_data_$DATE.tar.gz" "s3://$S3_BUCKET/application/"

# Clean old local backups
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

# Verify backup integrity
echo "Verifying backup integrity..."
gunzip -t "$BACKUP_DIR/db_backup_$DATE.sql.gz"
tar -tzf "$BACKUP_DIR/app_data_$DATE.tar.gz" > /dev/null

echo "Backup completed successfully: $DATE"

# Send notification
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Jaguar SDK backup completed successfully"}' \
  $SLACK_WEBHOOK_URL
```

### Update Strategy

```bash
#!/bin/bash
# update-deployment.sh

set -e

# Configuration
DOCKER_REGISTRY="your-registry.com"
IMAGE_TAG=${1:-latest}
BACKUP_BEFORE_UPDATE=true

echo "Starting deployment update to tag: $IMAGE_TAG"

# Create backup before update
if [ "$BACKUP_BEFORE_UPDATE" = true ]; then
  echo "Creating pre-update backup..."
  ./automated-backup.sh
fi

# Pull new images
echo "Pulling new images..."
docker pull "$DOCKER_REGISTRY/jaguar-frontend:$IMAGE_TAG"
docker pull "$DOCKER_REGISTRY/jaguar-api:$IMAGE_TAG"

# Update docker-compose with new image tags
sed -i "s/image: jaguar-frontend:.*/image: $DOCKER_REGISTRY\/jaguar-frontend:$IMAGE_TAG/" docker-compose.prod.yml
sed -i "s/image: jaguar-api:.*/image: $DOCKER_REGISTRY\/jaguar-api:$
```
