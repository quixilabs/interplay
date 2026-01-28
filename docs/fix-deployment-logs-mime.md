# Fix: Browser Downloading index.html Instead of Rendering

## Issue
When accessing `http://interplay.quixilabs.com/deployment-logs/`, the browser downloads the index.html file instead of displaying it.

## Root Cause
This is likely because:
1. The deployment logs directory/files don't exist yet (most likely)
2. The HTML is being served with wrong Content-Type header
3. Missing MIME type configuration

## Solution

### Step 1: Check if deployment logs exist

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Check if directory exists
ls -la /var/www/deployment-logs/

# Check if files exist
ls -la /var/www/deployment-logs/*.{html,json}
```

**Expected output:**
```
-rwxr-xr-x 1 www-data www-data 14336 Oct 21 14:35 index.html
-rwxr-xr-x 1 www-data www-data    2 Oct 21 14:35 deployments.json
```

**If files DON'T exist**, you need to create them first.

### Step 2: Run Setup Script

```bash
cd ~/apps/interplay
bash setup-deployment-logs.sh
```

This will:
- Create `/var/www/deployment-logs/` directory
- Create an empty `deployments.json` file
- Set proper permissions

### Step 3: Generate Initial HTML

Since you haven't run a deployment yet, the HTML file doesn't exist. Let's create it manually:

```bash
# Create a basic HTML with empty data
sudo bash generate-deployment-log.sh \
  "PENDING" \
  "$(date '+%Y-%m-%d %H:%M:%S %Z')" \
  "$(cd ~/apps/interplay && git rev-parse HEAD)" \
  "Initial setup - no deployments yet" \
  "System" \
  "$(date '+%Y-%m-%d %H:%M:%S')" \
  0 \
  0 \
  "/tmp/empty.log" \
  "No files"
```

Or create a minimal index.html manually:

```bash
sudo tee /var/www/deployment-logs/index.html > /dev/null << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deployment Logs - Interplay</title>
</head>
<body>
    <h1>Deployment Logs</h1>
    <p>No deployments yet. Run a deployment to see logs here.</p>
</body>
</html>
EOF

# Set permissions
sudo chown www-data:www-data /var/www/deployment-logs/index.html
sudo chmod 644 /var/www/deployment-logs/index.html
```

### Step 4: Fix Nginx Configuration for MIME Types

Update your Nginx config to explicitly handle HTML files:

```nginx
location /deployment-logs/ {
    alias /var/www/deployment-logs/;
    index index.html;
    autoindex off;
    
    # Explicit MIME types - ADD THIS
    default_type text/html;
    types {
        text/html html htm;
        application/json json;
        text/css css;
        application/javascript js;
    }
    
    # Ensure HTML is served correctly
    location ~ \.html$ {
        add_header Content-Type "text/html; charset=UTF-8";
    }
    
    # Cache control for deployment logs
    add_header Cache-Control "no-cache, must-revalidate";
}
```

Then reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Verify File Contents

Check what's actually in the file:

```bash
# View first 50 lines
sudo head -50 /var/www/deployment-logs/index.html

# Check file type
file /var/www/deployment-logs/index.html
# Should output: "HTML document, ASCII text"

# Check file size
ls -lh /var/www/deployment-logs/index.html
```

### Step 6: Test with curl

```bash
# Test what the server sends
curl -I http://interplay.quixilabs.com/deployment-logs/

# Should show:
# Content-Type: text/html
# HTTP/1.1 200 OK
```

## Complete Working Nginx Config

Here's the full location block that should work:

```nginx
server {
    listen 80;
    server_name interplay.quixilabs.com;
    
    root /var/www/interplay.app;
    index index.html index.htm;
    
    # Main app
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Deployment logs - FIXED VERSION
    location /deployment-logs/ {
        alias /var/www/deployment-logs/;
        index index.html;
        autoindex off;
        
        # Set default MIME type
        default_type text/html;
        
        # Explicit MIME types
        types {
            text/html                             html htm shtml;
            application/json                      json;
            text/css                              css;
            application/javascript                js;
        }
        
        # Ensure proper charset
        charset utf-8;
        
        # Cache control
        add_header Cache-Control "no-cache, must-revalidate" always;
        add_header X-Content-Type-Options "nosniff" always;
    }

    # Rest of config...
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
}
```

## Diagnostic Commands

Run these to find the exact issue:

```bash
# 1. Does directory exist?
sudo ls -la /var/www/deployment-logs/

# 2. Does index.html exist and what's in it?
sudo ls -lh /var/www/deployment-logs/index.html
sudo head -10 /var/www/deployment-logs/index.html

# 3. What Content-Type is being sent?
curl -I http://interplay.quixilabs.com/deployment-logs/

# 4. What's the actual response?
curl http://interplay.quixilabs.com/deployment-logs/ | head -20

# 5. Check Nginx error logs
sudo tail -20 /var/log/nginx/error.log

# 6. Check Nginx access logs
sudo tail -20 /var/log/nginx/access.log
```

## Quick Fix Commands

Run all of these in order:

```bash
# 1. Create directory if missing
sudo mkdir -p /var/www/deployment-logs

# 2. Create empty deployments.json
echo '[]' | sudo tee /var/www/deployment-logs/deployments.json

# 3. Create basic HTML
sudo tee /var/www/deployment-logs/index.html > /dev/null << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interplay Deployment Logs</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
        }
        h1 { color: #2d3748; margin-bottom: 20px; }
        p { color: #718096; font-size: 18px; line-height: 1.6; }
        .emoji { font-size: 48px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🚀</div>
        <h1>Deployment Logs</h1>
        <p>No deployments yet. Run your first deployment to see logs here.</p>
        <p style="font-size: 14px; margin-top: 30px; color: #a0aec0;">
            Run: <code style="background: #edf2f7; padding: 4px 8px; border-radius: 4px;">bash deploy.sh</code>
        </p>
    </div>
</body>
</html>
HTMLEOF

# 4. Set permissions
sudo chown -R www-data:www-data /var/www/deployment-logs
sudo chmod -R 755 /var/www/deployment-logs
sudo chmod 644 /var/www/deployment-logs/index.html
sudo chmod 644 /var/www/deployment-logs/deployments.json

# 5. Test Nginx config
sudo nginx -t

# 6. Reload Nginx
sudo systemctl reload nginx

# 7. Test
curl -I http://interplay.quixilabs.com/deployment-logs/
```

After running these commands, try accessing the URL again in your browser.

## Expected Result

You should see a page that says:
```
🚀
Deployment Logs
No deployments yet. Run your first deployment to see logs here.
```

Then when you run an actual deployment with `bash deploy.sh`, it will replace this placeholder with the full dashboard.

