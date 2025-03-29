#!/bin/bash

# Master script to fix OpenAI integration issues
# Run with: sh fix-openai.sh

echo "===== OpenAI Integration Fix Script ====="
echo "This script will fix OpenAI integration issues in your LMS system"
echo ""

# Change to the script's directory
cd "$(dirname "$0")"

# Make all scripts executable
echo "Making scripts executable..."
chmod +x *.js
chmod +x *.sh

# Create required directories
mkdir -p ../logs

# 1. Set up logger utility
echo ""
echo "Setting up logger utility..."
mkdir -p ../utils

if [ ! -f "../utils/logger.js" ]; then
  echo "Creating new logger.js"
  cat > ../utils/logger.js << 'EOL'
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
else
  echo "Logger utility already exists"
fi

# 2. Run the OpenAI adapter to fix compatibility issues
echo ""
echo "Running OpenAI adapter to fix compatibility issues..."
node openai-adapter.js

# 3. Create a custom services directory if needed
mkdir -p ../services
if [ ! -d "../services" ]; then
  echo "Creating services directory..."
  mkdir -p ../services
fi

# 4. Run tests to verify the fix
echo ""
echo "Running verification tests..."
echo "-----------------------------"
echo "Testing OpenAI API key:"
node verify-openai-key.js
if [ $? -ne 0 ]; then
  echo "⚠️  OpenAI API key verification failed. Check your .env file."
fi

echo ""
echo "-----------------------------"
echo "Running configuration verification:"
node verify-config.js
if [ $? -ne 0 ]; then
  echo "⚠️  Configuration verification failed. Check your settings."
fi

# 5. Ask if user wants to install the improved AI service
echo ""
echo "-----------------------------"
echo "Would you like to install the improved AI service? (y/n)"
read -r answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
  echo "Backing up current aiService.js..."
  cp ../services/aiService.js ../services/aiService.js.backup 2>/dev/null || true
  
  echo "Installing improved aiService.js..."
  if [ -f "improved-aiService.js" ]; then
    cp improved-aiService.js ../services/aiService.js
    echo "✅ Improved AI service installed successfully!"
  else
    echo "❌ Error: improved-aiService.js not found!"
  fi
else
  echo "Skipping installation of improved AI service."
fi

echo ""
echo "===== Fix Complete ====="
echo ""
echo "The OpenAI integration should now be working properly."
echo "If you still encounter issues, check the logs in ../logs/ for details."
echo ""
echo "To test the OpenAI integration in your application:"
echo "1. Restart your server: npm run dev"
echo "2. Try generating exercises with the OpenAI integration feature"
echo ""
