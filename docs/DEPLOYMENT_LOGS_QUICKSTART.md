# Deployment Logs - Quick Start Guide

## 🚀 One-Time Setup (on Digital Ocean Droplet)

### Step 1: Upload Files
```bash
# From your local machine
cd "interplay 2"
scp deploy.sh generate-deployment-log.sh setup-deployment-logs.sh root@your-droplet-ip:~/apps/interplay/
```

### Step 2: Run Setup Script
```bash
# SSH into droplet
ssh root@your-droplet-ip
cd ~/apps/interplay

# Run setup
bash setup-deployment-logs.sh
```

### Step 3: Configure Nginx
```bash
# Edit your Nginx config
sudo nano /etc/nginx/sites-available/interplay.quixilabs.com

# Add the deployment-logs location block (see nginx-deployment-logs.conf)
# Then test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 Daily Usage

### Deploy Your App
```bash
cd ~/apps/interplay
bash deploy.sh
```

### View Logs
Open in browser: **https://interplay.quixilabs.com/deployment-logs/**

## 🔐 Optional: Add Password Protection

```bash
# Install htpasswd tool
sudo apt-get install apache2-utils

# Create password for team access
sudo htpasswd -c /etc/nginx/.htpasswd teamuser

# Uncomment the auth_basic lines in your Nginx config
sudo nano /etc/nginx/sites-available/interplay.quixilabs.com

# Reload Nginx
sudo systemctl reload nginx
```

## 📋 What You'll See in the Logs

- ✅ Total deployments count
- ⏱️ Deployment duration
- 📝 Git commit messages
- 👤 Who made the change
- 📁 List of files changed
- ✓/✗ Success/failure status

## 🔧 Troubleshooting

### Logs not updating?
```bash
# Check permissions
sudo ls -la /var/www/deployment-logs/

# Should show:
# - Owner: www-data
# - Permissions: 755
```

### 404 Error?
```bash
# Verify Nginx config
sudo nginx -t
sudo systemctl status nginx

# Check if directory exists
ls -la /var/www/deployment-logs/
```

### jq not found?
```bash
sudo apt-get update
sudo apt-get install -y jq
```

## 📚 Full Documentation

See `DEPLOYMENT_LOGGING.md` for complete details and advanced configuration.

## 🎯 Quick Commands

```bash
# View latest deployments
sudo cat /var/www/deployment-logs/deployments.json | jq '.[0:5]'

# Check log file size
ls -lh /var/www/deployment-logs/

# Manually backup logs
sudo cp /var/www/deployment-logs/deployments.json ~/deployment-logs-backup-$(date +%Y%m%d).json
```

