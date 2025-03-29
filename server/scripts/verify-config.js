#!/usr/bin/env node

/**
 * Configuration Verification Script for Teacher LMS
 * 
 * This script verifies that frontend and backend configurations are in sync
 * and all required environment variables are properly set.
 * 
 * Usage: node verify-config.js
 * 
 * Place this script in the server/scripts directory and run from the server directory:
 * node scripts/verify-config.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Paths to check
const SERVER_ENV_PATH = path.join(__dirname, '../.env');
const CLIENT_ENV_PATH = path.join(__dirname, '../../client/.env');
const SERVER_SAMPLE_ENV_PATH = path.join(__dirname, '../.env.example');

// Required variables for server
const REQUIRED_SERVER_VARS = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'OPENAI_API_KEY',
  'NODE_ENV'
];

// Required variables for client
const REQUIRED_CLIENT_VARS = [
  'REACT_APP_API_URL',
  'REACT_APP_SERVER_URL'
];

// Specific checks for OpenAI
function verifyOpenAIConfig(env) {
  console.log(`\n${colors.blue}Verifying OpenAI specific configuration:${colors.reset}`);
  
  const apiKey = env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log(`${colors.red}✗ OPENAI_API_KEY is missing${colors.reset}`);
    return false;
  }
  
  // Check if key has proper format (usually starts with "sk-")
  if (!apiKey.startsWith('sk-')) {
    console.log(`${colors.yellow}⚠ OPENAI_API_KEY should typically start with "sk-", found "${apiKey.substring(0, 4)}..."${colors.reset}`);
  }
  
  // Check key length (typically about 51 characters)
  if (apiKey.length < 40) {
    console.log(`${colors.yellow}⚠ OPENAI_API_KEY appears too short (${apiKey.length} chars), should be about 51 chars${colors.reset}`);
  }
  
  console.log(`${colors.green}✓ OPENAI_API_KEY is defined${colors.reset}`);
  
  return true;
}

// Load environment files
function loadEnvFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const envContent = fs.readFileSync(filePath, 'utf8');
      return dotenv.parse(envContent);
    }
    return null;
  } catch (error) {
    console.log(`${colors.red}Error loading ${filePath}: ${error.message}${colors.reset}`);
    return null;
  }
}

// Create sample .env file from .env.example if needed
function createEnvFromExample(targetPath, examplePath) {
  try {
    if (!fs.existsSync(targetPath) && fs.existsSync(examplePath)) {
      console.log(`${colors.yellow}Creating ${targetPath} from example file${colors.reset}`);
      fs.copyFileSync(examplePath, targetPath);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`${colors.red}Error creating env file: ${error.message}${colors.reset}`);
    return false;
  }
}

// Check if a variable is properly defined
function checkVariable(env, variable) {
  if (!env || env[variable] === undefined || env[variable] === '') {
    return {
      defined: false,
      value: null
    };
  }
  return {
    defined: true,
    value: env[variable]
  };
}

// Verify configuration consistency between frontend and backend
function verifyConsistency(serverEnv, clientEnv) {
  console.log(`\n${colors.blue}Checking configuration consistency between frontend and backend:${colors.reset}`);
  
  let inconsistencyCount = 0;
  
  // Check port consistency
  const serverPort = serverEnv.PORT || '5000';
  const clientApiUrl = clientEnv.REACT_APP_API_URL || '';
  const clientServerUrl = clientEnv.REACT_APP_SERVER_URL || '';
  
  // Extract port from client URL
  const apiUrlPortMatch = clientApiUrl.match(/:(\d+)/);
  const serverUrlPortMatch = clientServerUrl.match(/:(\d+)/);
  
  const apiUrlPort = apiUrlPortMatch ? apiUrlPortMatch[1] : null;
  const serverUrlPort = serverUrlPortMatch ? serverUrlPortMatch[1] : null;
  
  if (apiUrlPort && apiUrlPort !== serverPort) {
    console.log(`${colors.red}✗ Port mismatch: server PORT=${serverPort}, but client REACT_APP_API_URL uses port ${apiUrlPort}${colors.reset}`);
    inconsistencyCount++;
  } else if (apiUrlPort) {
    console.log(`${colors.green}✓ Server PORT and REACT_APP_API_URL port match (${serverPort})${colors.reset}`);
  }
  
  if (serverUrlPort && serverUrlPort !== serverPort) {
    console.log(`${colors.red}✗ Port mismatch: server PORT=${serverPort}, but client REACT_APP_SERVER_URL uses port ${serverUrlPort}${colors.reset}`);
    inconsistencyCount++;
  } else if (serverUrlPort) {
    console.log(`${colors.green}✓ Server PORT and REACT_APP_SERVER_URL port match (${serverPort})${colors.reset}`);
  }
  
  // Check URL consistency
  if (clientApiUrl && !clientApiUrl.endsWith('/api')) {
    console.log(`${colors.yellow}⚠ REACT_APP_API_URL (${clientApiUrl}) should typically end with "/api"${colors.reset}`);
  }
  
  return inconsistencyCount === 0;
}

// Verify all required variables are present
function verifyRequiredVariables(env, requiredVars, envName) {
  console.log(`\n${colors.blue}Checking required variables for ${envName}:${colors.reset}`);
  
  let missingCount = 0;
  let warningCount = 0;
  
  requiredVars.forEach(variable => {
    const result = checkVariable(env, variable);
    
    if (result.defined) {
      // Mask sensitive information
      const isSensitive = variable.includes('KEY') || variable.includes('SECRET');
      let displayValue = result.value;
      
      if (isSensitive && displayValue.length > 10) {
        displayValue = `${displayValue.substring(0, 4)}...${displayValue.substring(displayValue.length - 4)}`;
      }
        
      console.log(`${colors.green}✓ ${variable} = ${displayValue}${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${variable} is missing${colors.reset}`);
      missingCount++;
    }
  });
  
  if (missingCount > 0) {
    console.log(`${colors.red}Found ${missingCount} missing required variables for ${envName}${colors.reset}`);
    return false;
  } else {
    console.log(`${colors.green}All required variables for ${envName} are properly defined${colors.reset}`);
    return true;
  }
}

// Main execution
async function main() {
  console.log(`${colors.cyan}=== Configuration Verification Tool ====${colors.reset}`);
  console.log(`Checking environment configuration for Teacher LMS`);
  
  // Try to create .env files from examples if they don't exist
  createEnvFromExample(SERVER_ENV_PATH, SERVER_SAMPLE_ENV_PATH);
  
  // Load environment files
  const serverEnv = loadEnvFile(SERVER_ENV_PATH);
  const clientEnv = loadEnvFile(CLIENT_ENV_PATH);
  
  if (!serverEnv) {
    console.log(`${colors.red}Could not load server environment file: ${SERVER_ENV_PATH}${colors.reset}`);
    console.log(`Create this file manually or copy from .env.example`);
    return false;
  }
  
  if (!clientEnv) {
    console.log(`${colors.yellow}Could not load client environment file: ${CLIENT_ENV_PATH}${colors.reset}`);
    console.log(`This might be ok if you're only testing the backend, but frontend integration will likely fail`);
  }
  
  // Run verification checks
  const serverVarsOk = verifyRequiredVariables(serverEnv, REQUIRED_SERVER_VARS, 'Server');
  let clientVarsOk = true;
  
  if (clientEnv) {
    clientVarsOk = verifyRequiredVariables(clientEnv, REQUIRED_CLIENT_VARS, 'Client');
    verifyConsistency(serverEnv, clientEnv);
  }
  
  // Perform specific OpenAI checks
  const openaiConfigOk = verifyOpenAIConfig(serverEnv);
  
  // Summary
  console.log(`\n${colors.cyan}=== Configuration Verification Summary ====${colors.reset}`);
  
  if (serverVarsOk && clientVarsOk && openaiConfigOk) {
    console.log(`${colors.green}All configuration checks passed successfully!${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.yellow}Some configuration issues were detected.${colors.reset}`);
    console.log(`Please fix the issues highlighted above and run the verification again.`);
    return false;
  }
}

// Run the script
main()
  .then(success => {
    if (!success) {
      // Exit with error code for CI/CD pipelines
      process.exit(1);
    }
  })
  .catch(error => {
    console.log(`${colors.red}Unexpected error: ${error.message}${colors.reset}`);
    process.exit(1);
  });