#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');

/**
 * Script to verify OpenAI API key and configuration
 * Run with: node scripts/verify-openai-key.js
 */

async function verifyOpenAIKey() {
  console.log('🔍 Verifying OpenAI API key and configuration...');
  console.log('---------------------------------------------');
  
  // Check if API key is configured
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  
  if (!apiKey) {
    console.error('❌ ERROR: OPENAI_API_KEY not found in environment variables');
    console.log('• Please add your OpenAI API key to the .env file:');
    console.log('  OPENAI_API_KEY=your_openai_api_key');
    process.exit(1);
  }
  
  if (apiKey.startsWith('sk-') === false) {
    console.error('❌ ERROR: OPENAI_API_KEY does not appear to be valid (should start with "sk-")');
    console.log('• Please check your OpenAI API key in the .env file');
    process.exit(1);
  }
  
  console.log('✓ OPENAI_API_KEY is set');
  console.log(`✓ Using model: ${model}`);
  
  try {
    console.log('\n📡 Testing connection to OpenAI API...');
    
    // Make a simple call to the OpenAI API
    const startTime = Date.now();
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant for a teacher-focused LMS system.' },
          { role: 'user', content: 'Generate a simple math problem for grade 3 students.' }
        ],
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Check if we got a valid response
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      console.log('✅ SUCCESS: OpenAI API connection working!');
      console.log(`• Response time: ${duration} seconds`);
      console.log(`• Model used: ${response.data.model}`);
      console.log(`• Tokens used: ${response.data.usage.total_tokens}`);
      
      console.log('\n📝 Sample response:');
      console.log('------------------');
      console.log(response.data.choices[0].message.content);
      console.log('------------------');
      
      console.log('\n💯 Your OpenAI integration is properly configured!');
      
      // Provide model recommendations if needed
      if (model === 'gpt-3.5-turbo') {
        console.log('\n💡 TIP: For generating educational content, you can also try:');
        console.log('  - gpt-4 (higher quality but more expensive)');
        console.log('  - gpt-3.5-turbo-16k (longer context window for complex exercises)');
        console.log('\n  Set in .env file as: OPENAI_MODEL=model_name');
      }
    } else {
      console.error('❌ ERROR: Received unexpected response format from OpenAI');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('❌ ERROR: Failed to connect to OpenAI API');
    
    if (error.response) {
      // The API responded with an error
      console.error(`Status code: ${error.response.status}`);
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
      
      // Provide specific guidance based on error codes
      if (error.response.status === 401) {
        console.log('\n⚠️ Your API key appears to be invalid or expired.');
        console.log('• Get a new key from: https://platform.openai.com/account/api-keys');
        console.log('• Make sure to copy the full key correctly into your .env file');
      } else if (error.response.status === 429) {
        console.log('\n⚠️ Rate limit exceeded or insufficient quota.');
        console.log('• Check your OpenAI account billing status');
        console.log('• Verify you have payment methods set up if you\'re beyond the free tier');
        console.log('• View your usage at: https://platform.openai.com/account/usage');
      } else if (error.response.status === 404) {
        console.log('\n⚠️ Model not found or API endpoint incorrect.');
        console.log(`• Check if the model "${model}" is available to your account`);
        console.log('• Try using "gpt-3.5-turbo" as a fallback');
      }
    } else if (error.request) {
      // No response received
      console.error('No response received from OpenAI API');
      console.log('\n⚠️ Network connectivity issues:');
      console.log('• Check your internet connection');
      console.log('• Verify that OpenAI services are not down');
      console.log('• Check if a firewall is blocking the connection');
    } else {
      // Request setup error
      console.error('Error setting up the request:', error.message);
    }
    
    process.exit(1);
  }
}

// Run the verification
verifyOpenAIKey();
