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