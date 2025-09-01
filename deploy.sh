#!/bin/bash
set -e

APP_NAME="interplay"
BUILD_DIR="dist"  # Change to "build" for Create React App

echo "🚀 Starting deployment for $APP_NAME..."

# Navigate to app directory
cd ~/apps/$APP_NAME

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Verify build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build failed - $BUILD_DIR directory not found"
    exit 1
fi

# Backup existing deployment
echo "💾 Creating backup..."
sudo mv /var/www/$APP_NAME.app /var/www/$APP_NAME.app.bak.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Deploy new build
echo "🚚 Deploying new build..."
sudo cp -r $BUILD_DIR/ /var/www/$APP_NAME.app

# Set permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data /var/www/$APP_NAME.app
sudo chmod -R 755 /var/www/$APP_NAME.app

# Verify deployment
echo "✅ Deployment complete!"
echo "📁 Files in /var/www/$APP_NAME.app:"
ls -la /var/www/$APP_NAME.app/ | head -10

echo "🌐 Visit https://interplay.quixilabs.com to see your app!"