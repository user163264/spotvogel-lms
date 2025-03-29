#!/bin/bash

# Installation script for OpenAI integration tools
# This script makes all the diagnostic and verification tools executable,
# and installs any required dependencies.

# Change to the script's directory
cd "$(dirname "$0")"

echo "===== OpenAI Integration Tools Installation ====="
echo "Making scripts executable..."

# Make scripts executable
chmod +x openai-diagnostic.js
chmod +x verify-config.js
chmod +x verify-openai-key.js
chmod +x improved-aiService.js
chmod +x make-scripts-executable.sh

echo "Checking required npm packages..."

# Check if required packages are installed
cd ..
CHECK_DOTENV=$(npm list dotenv | grep -c dotenv)
CHECK_OPENAI=$(npm list openai | grep -c openai)
CHECK_AXIOS=$(npm list axios | grep -c axios)

# Install required packages if missing
PACKAGES_TO_INSTALL=""

if [ "$CHECK_DOTENV" -eq 0 ]; then
  PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL dotenv"
fi

if [ "$CHECK_OPENAI" -eq 0 ]; then
  PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL openai"
fi

if [ "$CHECK_AXIOS" -eq 0 ]; then
  PACKAGES_TO_INSTALL="$PACKAGES_TO_INSTALL axios"
fi

if [ ! -z "$PACKAGES_TO_INSTALL" ]; then
  echo "Installing required packages: $PACKAGES_TO_INSTALL"
  npm install $PACKAGES_TO_INSTALL
else
  echo "All required packages are already installed."
fi

# Create logger utility if not exists
if [ ! -d "./utils" ]; then
  echo "Creating utils directory..."
  mkdir utils
fi

if [ ! -f "./utils/logger.js" ]; then
  echo "Creating simple logger utility..."
  cat > ./utils/logger.js << 'EOL'
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
fi

echo "===== Installation Complete ====="
echo ""
echo "You can now run the following commands:"
echo ""
echo "  1. Verify OpenAI API key:"
echo "     ./scripts/verify-openai-key.js"
echo ""
echo "  2. Run configuration verification:"
echo "     ./scripts/verify-config.js"
echo ""
echo "  3. Run comprehensive OpenAI diagnostics:"
echo "     ./scripts/openai-diagnostic.js"
echo ""
echo "To install the improved AI service:"
echo "  cp ./scripts/improved-aiService.js ./services/aiService.js"
echo ""
echo "Make sure you have the required environment variables in your .env file."
