# Jaguar SDK Dockerfile - Fixed for Dokploy deployment
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat curl python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && \
    pnpm i --no-frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# Copy source code
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Create database directory
RUN mkdir -p /app/data && chmod 755 /app/data

# Build the application
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && \
    ./node_modules/.bin/next build; \
  elif [ -f package-lock.json ]; then \
    ./node_modules/.bin/next build; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# Create system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set ownership of app directory
RUN chown -R nextjs:nodejs /app

# Create startup script
RUN echo '#!/bin/sh\n\
set -e\n\
\n\
echo "Starting Jaguar SDK..."\n\
\n\
# Run database migration if needed\n\
if [ ! -f /app/data/local.db ]; then\n\
  echo "Initializing database..."\n\
  if [ -f node_modules/.bin/tsx ]; then\n\
    node_modules/.bin/tsx lib/db/migrate.ts\n\
  else\n\
    echo "Warning: tsx not found, skipping migration"\n\
  fi\n\
fi\n\
\n\
# Start the application\n\
echo "Starting Next.js server..."\n\
if [ -f server.js ]; then\n\
  exec node server.js\n\
else\n\
  exec node_modules/.bin/next start\n\
fi' > /app/start.sh

RUN chmod +x /app/start.sh

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV POSTGRES_URL="file:/app/data/local.db"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["/app/start.sh"]
