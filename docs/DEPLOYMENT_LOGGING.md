# Deployment Logging System

This system automatically tracks and logs all deployments to your Digital Ocean droplet, creating a beautiful HTML dashboard for your internal team to view deployment history.

## Features

- **Automatic Logging**: Every deployment is automatically logged with detailed information
- **Git Integration**: Captures commit hash, message, author, and changed files
- **Deployment Metrics**: Tracks deployment duration, success/failure status, and statistics
- **Beautiful UI**: Modern, responsive HTML dashboard with real-time data
- **Team Accessible**: Accessible via web browser at `https://interplay.quixilabs.com/deployment-logs/`

## Setup Instructions

### 1. Upload Scripts to Your Digital Ocean Droplet

First, copy both scripts to your droplet:

```bash
# From your local machine, upload the files
scp deploy.sh root@your-droplet-ip:~/apps/interplay/
scp generate-deployment-log.sh root@your-droplet-ip:~/apps/interplay/
```

### 2. Make Scripts Executable

SSH into your droplet and make the scripts executable:

```bash
ssh root@your-droplet-ip
cd ~/apps/interplay
chmod +x deploy.sh
chmod +x generate-deployment-log.sh
```

### 3. Install jq (JSON Processor)

The logging system uses `jq` to manage JSON data. Install it if not already present:

```bash
# On Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y jq

# Verify installation
jq --version
```

### 4. Configure Nginx (if needed)

If you haven't already, ensure your Nginx configuration serves the deployment logs directory. Add this location block to your Nginx config:

```nginx
server {
    listen 443 ssl;
    server_name interplay.quixilabs.com;
    
    # ... your existing SSL configuration ...
    
    # Existing app location
    location / {
        root /var/www/interplay.app;
        try_files $uri $uri/ /index.html;
    }
    
    # Add this new location for deployment logs
    location /deployment-logs/ {
        alias /var/www/deployment-logs/;
        autoindex off;
        
        # Optional: Add basic auth for security
        # auth_basic "Deployment Logs";
        # auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

Reload Nginx after making changes:

```bash
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### 5. (Optional) Add Basic Authentication

To secure the deployment logs so only your team can access them:

```bash
# Install apache2-utils for htpasswd
sudo apt-get install -y apache2-utils

# Create password file (replace 'teamuser' with your desired username)
sudo htpasswd -c /etc/nginx/.htpasswd teamuser

# Uncomment the auth_basic lines in your Nginx config (see step 4)
sudo nginx -t
sudo systemctl reload nginx
```

## Usage

### Running Deployments

Simply run the deploy script as usual:

```bash
cd ~/apps/interplay
bash deploy.sh
```

The script will:
1. Pull latest changes from git
2. Install dependencies
3. Build the application
4. Deploy to `/var/www/interplay.app`
5. **Automatically generate and update the deployment log**

### Viewing Deployment Logs

Visit `https://interplay.quixilabs.com/deployment-logs/` in your web browser.

The dashboard displays:
- **Statistics**: Total deployments, success/fail counts, average duration
- **Deployment History**: Chronological list of all deployments
- **Details for Each Deployment**:
  - Status (Success/Failed)
  - Duration
  - Git commit information
  - Author and commit date
  - Commit message
  - List of changed files (expandable)

### Auto-Refresh

The deployment logs page automatically refreshes every 30 seconds, so you can monitor deployments in real-time.

## File Structure

```
/var/www/deployment-logs/
├── index.html          # Main HTML dashboard
└── deployments.json    # JSON data file with all deployment records
```

## What Gets Logged

Each deployment captures:

| Field | Description |
|-------|-------------|
| Timestamp | Date and time of deployment |
| Status | SUCCESS or FAILED |
| Duration | Time taken to complete deployment (in seconds) |
| Commit Hash | Full and short git commit hash |
| Commit Message | Git commit message |
| Author | Who made the commit |
| Commit Date | When the commit was made |
| Files Changed | Number of files changed |
| Changed Files List | Detailed list of modified files |

## Troubleshooting

### Deployment logs not showing up

1. Check if the scripts are executable:
   ```bash
   ls -la ~/apps/interplay/*.sh
   ```

2. Verify jq is installed:
   ```bash
   jq --version
   ```

3. Check directory permissions:
   ```bash
   ls -la /var/www/deployment-logs/
   ```

4. Review the deployment script output for errors

### 404 Error when accessing logs

1. Verify Nginx configuration:
   ```bash
   sudo nginx -t
   sudo cat /etc/nginx/sites-enabled/interplay.quixilabs.com
   ```

2. Ensure the deployment logs directory exists:
   ```bash
   sudo ls -la /var/www/deployment-logs/
   ```

3. Check Nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

### Permissions issues

If you encounter permission errors:

```bash
# Fix deployment logs directory permissions
sudo chown -R www-data:www-data /var/www/deployment-logs
sudo chmod -R 755 /var/www/deployment-logs
```

## Security Considerations

1. **Access Control**: Consider adding basic authentication (see setup step 5)
2. **HTTPS Only**: Ensure logs are only accessible via HTTPS
3. **Sensitive Data**: Deployment logs contain git history and file names - ensure this is acceptable for your team
4. **Network Access**: Consider restricting access by IP if needed

## Customization

### Changing the Log Location

Edit both scripts and update these variables:

```bash
# In deploy.sh and generate-deployment-log.sh
DEPLOY_LOG_DIR="/var/www/deployment-logs"  # Change this path
```

Also update your Nginx configuration to match.

### Limiting Log History

To prevent the logs from growing indefinitely, you can add a limit in `generate-deployment-log.sh`. Modify the jq command:

```bash
# Keep only the last 50 deployments
UPDATED_DATA=$(echo "$EXISTING_DATA" | jq --argjson new "$NEW_ENTRY" '. = ([$new] + .)[:50]')
```

### Custom Styling

The HTML dashboard styles are embedded in `generate-deployment-log.sh`. You can modify the `<style>` section to match your brand guidelines.

## Support

For issues or questions, contact your DevOps team or refer to the project documentation.

## Version History

- **v1.0** (2025-10-21): Initial deployment logging system
  - Automatic deployment tracking
  - HTML dashboard with statistics
  - Git integration for commit details

