#!/bin/bash

# Setup script for deployment logging system
# Run this on your Digital Ocean droplet after uploading the deployment scripts

set -e

echo "🔧 Setting up deployment logging system..."

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then 
    SUDO=""
else 
    SUDO="sudo"
fi

# Install jq if not present
echo "📦 Checking for jq..."
if ! command -v jq &> /dev/null; then
    echo "Installing jq..."
    $SUDO apt-get update
    $SUDO apt-get install -y jq
    echo "✅ jq installed"
else
    echo "✅ jq already installed"
fi

# Create deployment logs directory
echo "📁 Creating deployment logs directory..."
$SUDO mkdir -p /var/www/deployment-logs

# Initialize empty deployments.json if it doesn't exist
if [ ! -f /var/www/deployment-logs/deployments.json ]; then
    echo "[]" | $SUDO tee /var/www/deployment-logs/deployments.json > /dev/null
    echo "✅ Created deployments.json"
else
    echo "✅ deployments.json already exists"
fi

# Set permissions
echo "🔐 Setting permissions..."
$SUDO chown -R www-data:www-data /var/www/deployment-logs
$SUDO chmod -R 755 /var/www/deployment-logs

# Make scripts executable
echo "🔨 Making scripts executable..."
chmod +x deploy.sh generate-deployment-log.sh

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure Nginx to serve /deployment-logs/ (see DEPLOYMENT_LOGGING.md)"
echo "2. Reload Nginx: sudo systemctl reload nginx"
echo "3. Run your first deployment: bash deploy.sh"
echo "4. View logs at: https://interplay.quixilabs.com/deployment-logs/"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_LOGGING.md"

