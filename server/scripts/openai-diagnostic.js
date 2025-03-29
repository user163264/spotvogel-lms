#!/usr/bin/env node

/**
 * OpenAI Integration Diagnostic Script for Teacher LMS
 * 
 * This script performs a comprehensive check of the OpenAI integration:
 * 1. Validates environment variables
 * 2. Tests OpenAI API connectivity
 * 3. Tests exercise generation with simple and complex topics
 * 4. Logs detailed diagnostic information
 * 
 * Usage: node openai-diagnostic.js
 */

require('dotenv').config();
const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log diagnostics to file and console
const logFile = './openai-diagnostic-results.log';
fs.writeFileSync(logFile, `OpenAI Diagnostic Run - ${new Date().toISOString()}\n\n`);

function log(message, color = colors.reset) {
  console.log(color, message, colors.reset);
  fs.appendFileSync(logFile, message + '\n');
}

async function runDiagnostics() {
  log('=== OpenAI Integration Diagnostic Tool ===', colors.cyan);
  log('Running comprehensive diagnostics...\n');

  // 1. Check environment variables
  log('--- Environment Variables Check ---', colors.blue);
  const requiredVars = ['OPENAI_API_KEY', 'MONGODB_URI', 'JWT_SECRET'];
  let envErrors = 0;

  requiredVars.forEach(variable => {
    if (!process.env[variable]) {
      log(`❌ ${variable} is missing`, colors.red);
      envErrors++;
    } else {
      log(`✅ ${variable} is present`, colors.green);
      // Check if API key follows expected format (for OpenAI key)
      if (variable === 'OPENAI_API_KEY') {
        const key = process.env[variable];
        if (!key.startsWith('sk-') || key.length < 20) {
          log(`❌ ${variable} appears to be malformed (should start with 'sk-')`, colors.red);
          envErrors++;
        }
      }
    }
  });

  if (envErrors > 0) {
    log(`Found ${envErrors} issues with environment variables. Please fix before continuing.`, colors.red);
  } else {
    log('All required environment variables are present.', colors.green);
  }
  log('');

  // 2. Test OpenAI API connectivity
  log('--- OpenAI API Connectivity Test ---', colors.blue);
  
  try {
    // Test with official OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    log('Attempting to connect to OpenAI API...', colors.yellow);
    const modelResponse = await openai.models.list();

    if (modelResponse.data) {
      log(`✅ Successfully connected to OpenAI API (${modelResponse.data.length} models available)`, colors.green);
    } else {
      log(`❌ Received unexpected status code: ${modelResponse.status}`, colors.red);
    }
  } catch (error) {
    log('❌ Error connecting to OpenAI API', colors.red);
    log(`Error Details: ${error.message}`);
    
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
  log('');

  // 3. Test exercise generation with simple topic
  log('--- Exercise Generation Test (Simple Topic) ---', colors.blue);
  await testExerciseGeneration('Basic Addition in Mathematics');
  log('');

  // 4. Test exercise generation with complex topic
  log('--- Exercise Generation Test (Complex Topic) ---', colors.blue);
  await testExerciseGeneration('World War II');
  log('');

  // 5. Check server configuration
  log('--- Server Configuration Check ---', colors.blue);
  checkServerConfig();
  log('');

  // 6. Test direct API endpoint
  log('--- Backend API Endpoint Test ---', colors.blue);
  await testBackendEndpoint();
  log('');

  // 7. Summary
  log('=== Diagnostic Summary ===', colors.magenta);
  log('See detailed results in: ' + logFile);
  log('Based on these results, check the following:');
  log('1. Ensure OPENAI_API_KEY is valid and has sufficient credits');
  log('2. Check that the server port configurations match between frontend and backend');
  log('3. Verify proper error handling in aiService.js and controllers');
  log('4. Check for CORS issues if API tests pass but frontend integration fails');
}

async function testExerciseGeneration(topic) {
  try {
    log(`Testing exercise generation for topic: "${topic}"...`, colors.yellow);
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const prompt = `Create a multiple-choice exercise about ${topic} suitable for high school students. Include 4 options and mark the correct answer.`;
    
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    if (completion) {
      log(`✅ Successfully generated exercise for "${topic}"`, colors.green);
      log('Response preview: ' + completion.choices[0].text.substring(0, 100) + '...');
    } else {
      log(`❌ Received unexpected response format`, colors.red);
    }
  } catch (error) {
    log(`❌ Error generating exercise for "${topic}"`, colors.red);
    log(`Error Details: ${error.message}`);
    
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

function checkServerConfig() {
  // Check if server port configurations match between client and server
  try {
    let clientEnv = {};
    if (fs.existsSync('../client/.env')) {
      const clientEnvContent = fs.readFileSync('../client/.env', 'utf8');
      clientEnvContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          clientEnv[key.trim()] = value.trim();
        }
      });
    }

    log('Frontend API URL configuration:', colors.yellow);
    if (clientEnv.REACT_APP_API_URL) {
      log(`REACT_APP_API_URL = ${clientEnv.REACT_APP_API_URL}`);
      const urlPort = clientEnv.REACT_APP_API_URL.match(/:(\d+)/);
      
      if (urlPort && urlPort[1] !== process.env.PORT) {
        log(`❌ Mismatch detected: Frontend expects port ${urlPort[1]} but backend is configured for port ${process.env.PORT}`, colors.red);
      } else {
        log('✅ Port configuration appears to be consistent', colors.green);
      }
    } else {
      log('❌ REACT_APP_API_URL is not defined in client .env file', colors.red);
    }
  } catch (error) {
    log(`Error checking server configuration: ${error.message}`, colors.red);
  }
}

async function testBackendEndpoint() {
  try {
    const serverBaseUrl = process.env.SERVER_URL || 'http://localhost:' + (process.env.PORT || '8080');
    log(`Testing backend API at ${serverBaseUrl}/api/exercises/generate...`, colors.yellow);
    
    // Create a sample payload for testing
    const payload = {
      topic: "Basic Algebra",
      difficulty: "beginner",
      type: "multiple-choice",
      language: "english"
    };
    
    // Get a test JWT token if needed
    let token = process.env.TEST_JWT_TOKEN;
    if (!token) {
      log('No TEST_JWT_TOKEN found in environment. Will attempt request without authentication.', colors.yellow);
    }
    
    const response = await axios.post(
      `${serverBaseUrl}/api/exercises/generate`, 
      payload,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 10000 // 10 second timeout
      }
    );
    
    if (response.status === 200) {
      log('✅ Successfully called backend API endpoint', colors.green);
      log(`Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
    } else {
      log(`❌ Received unexpected status code: ${response.status}`, colors.red);
    }
  } catch (error) {
    log('❌ Error testing backend endpoint', colors.red);
    log(`Error Details: ${error.message}`);
    
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.code === 'ECONNREFUSED') {
      log('Connection refused. Is the backend server running?', colors.red);
    }
  }
}

// Run the diagnostics
runDiagnostics()
  .then(() => {
    log('\nDiagnostics completed. Check the log file for complete results.', colors.cyan);
  })
  .catch(error => {
    log(`\nAn unexpected error occurred during diagnostics: ${error.message}`, colors.red);
  });