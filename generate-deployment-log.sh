#!/bin/bash

# Parameters
DEPLOY_STATUS="$1"
DEPLOY_TIMESTAMP="$2"
CURRENT_COMMIT="$3"
COMMIT_MESSAGE="$4"
COMMIT_AUTHOR="$5"
COMMIT_DATE="$6"
FILES_CHANGED="$7"
DEPLOY_DURATION="$8"
TEMP_LOG="$9"
CHANGED_FILES="${10}"

APP_NAME="interplay"
DEPLOY_LOG_DIR="/var/www/deployment-logs"
DEPLOY_LOG_FILE="$DEPLOY_LOG_DIR/index.html"
DEPLOY_DATA_FILE="$DEPLOY_LOG_DIR/deployments.json"

# Create log directory if it doesn't exist
sudo mkdir -p "$DEPLOY_LOG_DIR"

# Initialize JSON data file if it doesn't exist
if [ ! -f "$DEPLOY_DATA_FILE" ]; then
    echo "[]" | sudo tee "$DEPLOY_DATA_FILE" > /dev/null
fi

# Read build output from temp log
BUILD_OUTPUT=""
if [ -f "$TEMP_LOG" ]; then
    BUILD_OUTPUT=$(cat "$TEMP_LOG" | tail -n 50)
fi

# Format changed files for JSON
CHANGED_FILES_JSON=$(echo "$CHANGED_FILES" | sed 's/$/\\n/' | tr -d '\n' | sed 's/\\n$//')

# Create new deployment entry
NEW_ENTRY=$(cat <<EOF
{
  "timestamp": "$DEPLOY_TIMESTAMP",
  "status": "$DEPLOY_STATUS",
  "commit": "$CURRENT_COMMIT",
  "commitShort": "${CURRENT_COMMIT:0:7}",
  "commitMessage": "$COMMIT_MESSAGE",
  "commitAuthor": "$COMMIT_AUTHOR",
  "commitDate": "$COMMIT_DATE",
  "filesChanged": $FILES_CHANGED,
  "duration": $DEPLOY_DURATION,
  "changedFiles": "$CHANGED_FILES_JSON"
}
EOF
)

# Add new entry to JSON array (prepend to keep newest first)
EXISTING_DATA=$(sudo cat "$DEPLOY_DATA_FILE")
UPDATED_DATA=$(echo "$EXISTING_DATA" | jq --argjson new "$NEW_ENTRY" '. = [$new] + .')
echo "$UPDATED_DATA" | sudo tee "$DEPLOY_DATA_FILE" > /dev/null

# Generate HTML file directly
sudo tee "$DEPLOY_LOG_FILE" > /dev/null <<'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interplay Deployment Logs</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }
        
        .header h1 {
            color: #2d3748;
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            color: #718096;
            font-size: 1rem;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .stat-card h3 {
            color: #718096;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .stat-card p {
            color: #2d3748;
            font-size: 2rem;
            font-weight: bold;
        }
        
        .deployments {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .deployments-header {
            padding: 1.5rem 2rem;
            border-bottom: 2px solid #e2e8f0;
            background: #f7fafc;
        }
        
        .deployments-header h2 {
            color: #2d3748;
            font-size: 1.5rem;
        }
        
        .deployment-entry {
            padding: 2rem;
            border-bottom: 1px solid #e2e8f0;
            transition: background-color 0.2s;
        }
        
        .deployment-entry:hover {
            background-color: #f7fafc;
        }
        
        .deployment-entry:last-child {
            border-bottom: none;
        }
        
        .deployment-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .deployment-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-success {
            background-color: #c6f6d5;
            color: #22543d;
        }
        
        .status-failed {
            background-color: #fed7d7;
            color: #742a2a;
        }
        
        .deployment-time {
            color: #718096;
            font-size: 0.875rem;
        }
        
        .deployment-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
        }
        
        .info-label {
            color: #718096;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
        }
        
        .info-value {
            color: #2d3748;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .commit-message {
            background: #f7fafc;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            margin-top: 1rem;
        }
        
        .commit-message-label {
            color: #718096;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }
        
        .commit-message-text {
            color: #2d3748;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        
        .files-changed {
            margin-top: 1rem;
        }
        
        .files-toggle {
            background: none;
            border: none;
            color: #667eea;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            padding: 0.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .files-toggle:hover {
            color: #5a67d8;
        }
        
        .files-list {
            background: #f7fafc;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 0.5rem;
            display: none;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .files-list.active {
            display: block;
        }
        
        .files-list pre {
            color: #2d3748;
            font-size: 0.75rem;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .no-deployments {
            padding: 4rem 2rem;
            text-align: center;
            color: #718096;
        }
        
        .duration-badge {
            background: #edf2f7;
            color: #2d3748;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 1.5rem;
            }
            
            .stat-card p {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Interplay Deployment Logs</h1>
            <p>Internal deployment tracking for the team</p>
        </div>
        
        <div class="stats" id="stats">
            <div class="stat-card">
                <h3>Total Deployments</h3>
                <p id="total-deployments">0</p>
            </div>
            <div class="stat-card">
                <h3>Successful</h3>
                <p id="successful-deployments">0</p>
            </div>
            <div class="stat-card">
                <h3>Failed</h3>
                <p id="failed-deployments">0</p>
            </div>
            <div class="stat-card">
                <h3>Avg Duration</h3>
                <p id="avg-duration">0s</p>
            </div>
        </div>
        
        <div class="deployments">
            <div class="deployments-header">
                <h2>Deployment History</h2>
            </div>
            <div id="deployments-list"></div>
        </div>
    </div>
    
    <script>
        async function loadDeployments() {
            try {
                const response = await fetch('deployments.json');
                const deployments = await response.json();
                
                // Update statistics
                const total = deployments.length;
                const successful = deployments.filter(d => d.status === 'SUCCESS').length;
                const failed = deployments.filter(d => d.status === 'FAILED').length;
                const avgDuration = total > 0 
                    ? Math.round(deployments.reduce((sum, d) => sum + d.duration, 0) / total)
                    : 0;
                
                document.getElementById('total-deployments').textContent = total;
                document.getElementById('successful-deployments').textContent = successful;
                document.getElementById('failed-deployments').textContent = failed;
                document.getElementById('avg-duration').textContent = `${avgDuration}s`;
                
                // Render deployments
                const deploymentsList = document.getElementById('deployments-list');
                
                if (deployments.length === 0) {
                    deploymentsList.innerHTML = '<div class="no-deployments">No deployments yet</div>';
                    return;
                }
                
                deploymentsList.innerHTML = deployments.map((deployment, index) => `
                    <div class="deployment-entry">
                        <div class="deployment-header">
                            <div class="deployment-status">
                                <span class="status-badge status-${deployment.status.toLowerCase()}">
                                    ${deployment.status === 'SUCCESS' ? '✓' : '✗'} ${deployment.status}
                                </span>
                                <span class="duration-badge">⏱ ${deployment.duration}s</span>
                            </div>
                            <div class="deployment-time">${deployment.timestamp}</div>
                        </div>
                        
                        <div class="deployment-info">
                            <div class="info-item">
                                <span class="info-label">Commit</span>
                                <span class="info-value">${deployment.commitShort}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Author</span>
                                <span class="info-value">${deployment.commitAuthor}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Commit Date</span>
                                <span class="info-value">${deployment.commitDate}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Files Changed</span>
                                <span class="info-value">${deployment.filesChanged} file${deployment.filesChanged !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        
                        <div class="commit-message">
                            <div class="commit-message-label">Commit Message</div>
                            <div class="commit-message-text">${deployment.commitMessage}</div>
                        </div>
                        
                        ${deployment.filesChanged > 0 ? `
                            <div class="files-changed">
                                <button class="files-toggle" onclick="toggleFiles(${index})">
                                    <span id="toggle-icon-${index}">▶</span> View changed files
                                </button>
                                <div class="files-list" id="files-${index}">
                                    <pre>${deployment.changedFiles.replace(/\\n/g, '\n')}</pre>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `).join('');
                
            } catch (error) {
                console.error('Error loading deployments:', error);
                document.getElementById('deployments-list').innerHTML = 
                    '<div class="no-deployments">Error loading deployment logs</div>';
            }
        }
        
        function toggleFiles(index) {
            const filesList = document.getElementById(`files-${index}`);
            const icon = document.getElementById(`toggle-icon-${index}`);
            
            if (filesList.classList.contains('active')) {
                filesList.classList.remove('active');
                icon.textContent = '▶';
            } else {
                filesList.classList.add('active');
                icon.textContent = '▼';
            }
        }
        
        // Load deployments on page load
        loadDeployments();
        
        // Auto-refresh every 30 seconds
        setInterval(loadDeployments, 30000);
    </script>
</body>
</html>
HTMLEOF

# Set permissions
sudo chown -R www-data:www-data "$DEPLOY_LOG_DIR"
sudo chmod -R 755 "$DEPLOY_LOG_DIR"

# Clean up temp log
rm -f "$TEMP_LOG"

echo "✅ Deployment log updated successfully!"
echo "📊 View at: https://interplay.quixilabs.com/deployment-logs/"

