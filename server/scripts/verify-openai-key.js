#!/usr/bin/env node

/**
 * OpenAI API Key Verification Script
 * 
 * This script tests if your OpenAI API key is valid and can connect successfully.
 * 
 * Usage: node verify-openai-key.js
 */

require('dotenv').config();
const OpenAI = require('openai');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

async function verifyOpenAIKey() {
  console.log(`${colors.blue}OpenAI API Key Verification${colors.reset}\n`);
  
  // Check if the API key is defined
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log(`${colors.red}ERROR: OPENAI_API_KEY is not defined in your environment${colors.reset}`);
    console.log('Make sure you have an .env file with your OpenAI API key');
    return false;
  }
  
  // Check format of the API key
  if (!apiKey.startsWith('sk-')) {
    console.log(`${colors.yellow}WARNING: Your API key doesn't start with 'sk-', which is unusual${colors.reset}`);
    console.log('Standard OpenAI API keys start with "sk-". Double-check your key.');
  }
  
  console.log(`${colors.blue}API key found. Testing connection to OpenAI...${colors.reset}`);
  
  try {
    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Make a simple API call
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: "Say 'OpenAI connection successful'",
      max_tokens: 10
    });
    
    if (completion) {
      const response = completion.choices[0].text.trim();
      console.log(`${colors.green}SUCCESS: Connected to OpenAI API${colors.reset}`);
      console.log(`Response: "${response}"`);
      
      // Get available models
      const models = await openai.models.list();
      console.log(`\n${colors.green}Available models: ${models.data.length}${colors.reset}`);
      
      // List a few models
      const sampleModels = models.data.slice(0, 5);
      console.log(`Sample models:`);
      sampleModels.forEach(model => {
        console.log(`- ${model.id}`);
      });
      
      return true;
    } else {
      console.log(`${colors.red}ERROR: Received unexpected status code: ${completion.status}${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}ERROR: Could not connect to OpenAI API${colors.reset}`);
    
    if (error.response) {
      console.log(`Status code: ${error.response.status}`);
      console.log(`Error message: ${JSON.stringify(error.response.data, null, 2)}`);
      
      // Handle common error codes
      if (error.response.status === 401) {
        console.log(`\n${colors.yellow}This is an authentication error. Your API key is invalid or expired.${colors.reset}`);
        console.log('Get a new API key at: https://platform.openai.com/account/api-keys');
      } else if (error.response.status === 429) {
        console.log(`\n${colors.yellow}This is a rate limit error. You have exceeded your quota or rate limit.${colors.reset}`);
        console.log('Check your usage at: https://platform.openai.com/account/usage');
      }
    } else {
      console.log(`Error: ${error.message}`);
    }
    
    return false;
  }
}

// Run the verification
verifyOpenAIKey()
  .then(success => {
    if (success) {
      console.log(`\n${colors.green}Verification completed successfully!${colors.reset}`);
      console.log('Your OpenAI API key is valid and working correctly.');
    } else {
      console.log(`\n${colors.red}Verification failed!${colors.reset}`);
      console.log('Please check the errors above and fix your API key configuration.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.log(`\n${colors.red}An unexpected error occurred:${colors.reset}`);
    console.log(error);
    process.exit(1);
  });