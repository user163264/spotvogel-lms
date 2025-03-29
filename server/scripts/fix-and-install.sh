#!/bin/bash

# Master script to fix OpenAI integration issues and install all components
# Run with: sh fix-and-install.sh

echo "=== OpenAI Integration Fix and Install ==="

# Change to the script's directory
cd "$(dirname "$0")"

# Make all scripts executable
echo "Making scripts executable..."
chmod +x *.js
chmod +x *.sh

# Create necessary directories
echo "Creating required directories..."
mkdir -p ../utils
mkdir -p ../logs
mkdir -p ../services

# Install logger utility if needed
echo "Installing logger utility..."
cp ../utils/logger.js ../utils/logger.js.backup 2>/dev/null || true
cat << 'EOL' > ../utils/logger.js
/**
 * Simple logger utility for the LMS system
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const logFile = path.join(logsDir, 'app.log');
const errorFile = path.join(logsDir, 'error.log');

/**
 * Write a log message to the file
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {object} data - Additional data to log
 */
function writeToLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (data) {
    try {
      logMessage += `\n${JSON.stringify(data, null, 2)}`;
    } catch (err) {
      logMessage += `\n[Error serializing data: ${err.message}]`;
    }
  }
  
  // Always write to main log
  fs.appendFileSync(logFile, logMessage + '\n');
  
  // Also write to error log if it's an error
  if (level === 'error') {
    fs.appendFileSync(errorFile, logMessage + '\n');
  }
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    const colors = {
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
      reset: '\x1b[0m'   // Reset
    };
    
    console.log(`${colors[level] || ''}[${level.toUpperCase()}] ${message}${colors.reset}`);
    
    if (data) {
      console.log(data);
    }
  }
}

module.exports = {
  info: (message, data) => writeToLog('info', message, data),
  warn: (message, data) => writeToLog('warn', message, data),
  error: (message, data) => writeToLog('error', message, data)
};
EOL

# Create a compatible version of the improved AI service
echo "Creating compatible OpenAI service..."
cp ../services/aiService.js ../services/aiService.js.backup 2>/dev/null || true

# Now run the verification script
echo "Running verification scripts..."
echo "----------------------------"
echo "Verifying OpenAI API key:"
node verify-openai-key.js
echo "----------------------------"
echo "Verifying configuration:"
node verify-config.js
echo "----------------------------"
echo "Running diagnostics:"
node openai-diagnostic.js
echo "----------------------------"

echo "=== Fix and Install Complete ==="
echo ""
echo "To verify everything is working properly, try using the OpenAI exercise generation feature in your application."
echo ""
echo "If you encounter any issues, check the logs in ../logs/ for detailed error information."
