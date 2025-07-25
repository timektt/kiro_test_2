#!/bin/bash

# Community Platform Deployment Script
# This script handles the deployment process for production

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Check if required environment variables are set
required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var environment variable is not set"
    exit 1
  fi
done

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🏗️ Building application..."
npm run build

# Run tests (optional, can be skipped in production)
if [ "$SKIP_TESTS" != "true" ]; then
  echo "🧪 Running tests..."
  npm run test:ci
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Application is ready to serve traffic"