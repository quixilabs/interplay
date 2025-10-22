# Troubleshooting: "Site Cannot Be Reached" for Deployment Logs

## Issue
Getting "site cannot be reached" when accessing `https://interplay.quixilabs.com/deployment-logs/`

## Root Cause
Your Nginx configuration only has HTTP (port 80) configured, but you're trying to access via HTTPS (port 443).

## Solution

### 1. Check if SSL is configured elsewhere

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Check all Nginx config files
sudo nginx -T | grep -A 10 "listen 443"

# Check if there's a separate SSL config
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
```

### 2. Updated Nginx Configuration (with SSL)

Replace your Nginx config with this version that includes SSL:

```nginx
# HTTP server - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name interplay.quixilabs.com;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name interplay.quixilabs.com;

    # SSL Configuration (adjust paths if needed)
    ssl_certificate /etc/letsencrypt/live/interplay.quixilabs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/interplay.quixilabs.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    root /var/www/interplay.app;
    index index.html index.htm;
    
    # Essential for React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Deployment logs
    location /deployment-logs/ {
        alias /var/www/deployment-logs/;
        index index.html;
        autoindex off;
        
        # MIME types for JSON
        types {
            application/json json;
        }
        
        # Cache control for deployment logs
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### 3. Verification Steps

Run these commands on your droplet:

```bash
# 1. Check if SSL certificates exist
ls -la /etc/letsencrypt/live/interplay.quixilabs.com/

# 2. Check if deployment logs directory exists
ls -la /var/www/deployment-logs/

# 3. Test Nginx configuration
sudo nginx -t

# 4. Reload Nginx
sudo systemctl reload nginx

# 5. Check Nginx status
sudo systemctl status nginx

# 6. Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### 4. If SSL Certificates Don't Exist

You need to set up Let's Encrypt SSL certificates:

```bash
# Install certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d interplay.quixilabs.com

# Certbot will automatically configure Nginx
```

### 5. Alternative: Access via HTTP First

If you want to test without SSL first:

```bash
# Access via HTTP (not HTTPS)
http://interplay.quixilabs.com/deployment-logs/
```

But you should set up SSL for production use.

## Quick Diagnostic Commands

```bash
# Check what ports Nginx is listening on
sudo netstat -tlnp | grep nginx
# Should show both :80 and :443

# Check if deployment logs files exist
ls -la /var/www/deployment-logs/
# Should show index.html and deployments.json

# Check file permissions
sudo ls -la /var/www/deployment-logs/
# Should be owned by www-data:www-data with 755 permissions

# View full Nginx config
sudo nginx -T

# Check for Nginx errors
sudo journalctl -u nginx -n 50 --no-pager
```

## Common Issues & Solutions

### Issue 1: SSL Certificate Not Found
**Error**: `nginx: [emerg] cannot load certificate`

**Solution**: 
- Run certbot to get SSL certificate (see step 4 above)
- Or adjust the SSL certificate paths in the config

### Issue 2: Directory Doesn't Exist
**Error**: `404 Not Found`

**Solution**:
```bash
# Create directory
sudo mkdir -p /var/www/deployment-logs

# Run setup script
cd ~/apps/interplay
bash setup-deployment-logs.sh
```

### Issue 3: Permission Denied
**Error**: `403 Forbidden`

**Solution**:
```bash
sudo chown -R www-data:www-data /var/www/deployment-logs
sudo chmod -R 755 /var/www/deployment-logs
```

### Issue 4: Nginx Config Syntax Error
**Error**: `nginx: configuration file /etc/nginx/nginx.conf test failed`

**Solution**:
```bash
# Test config
sudo nginx -t

# Check the error message and fix the syntax
# Then test again
```

## Step-by-Step Resolution

1. **SSH into your droplet**
2. **Check if SSL is configured**: `sudo nginx -T | grep "listen 443"`
3. **If no SSL**: Set up Let's Encrypt (see step 4 above)
4. **Update Nginx config** with the SSL version above
5. **Test config**: `sudo nginx -t`
6. **Reload**: `sudo systemctl reload nginx`
7. **Create deployment logs directory** if needed
8. **Test**: Visit `https://interplay.quixilabs.com/deployment-logs/`

## Expected Behavior After Fix

- `http://interplay.quixilabs.com` → Redirects to `https://`
- `https://interplay.quixilabs.com` → Shows your app
- `https://interplay.quixilabs.com/deployment-logs/` → Shows deployment logs (or "No deployments yet" if none)

## Need More Help?

If still not working, check:
1. DNS is pointing to correct IP: `nslookup interplay.quixilabs.com`
2. Firewall allows ports 80 and 443: `sudo ufw status`
3. Nginx is running: `sudo systemctl status nginx`
4. Review error logs: `sudo tail -100 /var/log/nginx/error.log`


