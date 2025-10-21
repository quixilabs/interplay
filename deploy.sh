#!/bin/bash
set -e

APP_NAME="interplay"
BUILD_DIR="dist"  # Change to "build" for Create React App
DEPLOY_LOG_DIR="/var/www/deployment-logs"
DEPLOY_LOG_FILE="$DEPLOY_LOG_DIR/index.html"
TEMP_LOG="/tmp/deployment_$(date +%Y%m%d_%H%M%S).log"

# Capture deployment start time
DEPLOY_START=$(date +%s)
DEPLOY_TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S %Z")

echo "🚀 Starting deployment for $APP_NAME at $DEPLOY_TIMESTAMP..."

# Navigate to app directory
cd ~/apps/$APP_NAME

# Capture git info before pulling
PREVIOUS_COMMIT=$(git rev-parse HEAD)
PREVIOUS_BRANCH=$(git branch --show-current)

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull 2>&1 | tee -a "$TEMP_LOG"

# Capture git info after pulling
CURRENT_COMMIT=$(git rev-parse HEAD)
CURRENT_BRANCH=$(git branch --show-current)
COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
COMMIT_AUTHOR=$(git log -1 --pretty=format:"%an")
COMMIT_DATE=$(git log -1 --pretty=format:"%cd" --date=format:"%Y-%m-%d %H:%M:%S")

# Get list of files changed
if [ "$PREVIOUS_COMMIT" != "$CURRENT_COMMIT" ]; then
    FILES_CHANGED=$(git diff --name-only $PREVIOUS_COMMIT $CURRENT_COMMIT | wc -l)
    CHANGED_FILES=$(git diff --name-only $PREVIOUS_COMMIT $CURRENT_COMMIT)
else
    FILES_CHANGED=0
    CHANGED_FILES="No changes"
fi

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install 2>&1 | tee -a "$TEMP_LOG"

# Build application
echo "🔨 Building application..."
npm run build 2>&1 | tee -a "$TEMP_LOG"

# Verify build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build failed - $BUILD_DIR directory not found"
    DEPLOY_STATUS="FAILED"
    DEPLOY_END=$(date +%s)
    DEPLOY_DURATION=$((DEPLOY_END - DEPLOY_START))
    
    # Generate failure log
    bash generate-deployment-log.sh "$DEPLOY_STATUS" "$DEPLOY_TIMESTAMP" "$CURRENT_COMMIT" "$COMMIT_MESSAGE" "$COMMIT_AUTHOR" "$COMMIT_DATE" "$FILES_CHANGED" "$DEPLOY_DURATION" "$TEMP_LOG"
    
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

# Calculate deployment duration
DEPLOY_END=$(date +%s)
DEPLOY_DURATION=$((DEPLOY_END - DEPLOY_START))

# Verify deployment
echo "✅ Deployment complete!"
echo "📁 Files in /var/www/$APP_NAME.app:"
ls -la /var/www/$APP_NAME.app/ | head -10

DEPLOY_STATUS="SUCCESS"

# Generate deployment log HTML
echo "📝 Generating deployment log..."
bash generate-deployment-log.sh "$DEPLOY_STATUS" "$DEPLOY_TIMESTAMP" "$CURRENT_COMMIT" "$COMMIT_MESSAGE" "$COMMIT_AUTHOR" "$COMMIT_DATE" "$FILES_CHANGED" "$DEPLOY_DURATION" "$TEMP_LOG" "$CHANGED_FILES"

echo "🌐 Visit https://interplay.quixilabs.com to see your app!"
echo "📊 View deployment logs at: https://interplay.quixilabs.com/deployment-logs/"