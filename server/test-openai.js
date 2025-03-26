require('dotenv').config();
const axios = require('axios');

/**
 * Simple script to test OpenAI API connectivity
 * Run with: node test-openai.js
 */

async function testOpenAI() {
  console.log('Testing OpenAI API connectivity...');
  
  // Check if API key is configured
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey === 'sk-your-actual-openai-key-goes-here') {
    console.error('\n❌ ERROR: OpenAI API key not properly configured');
    console.log('Please update your .env file with a valid OpenAI API key');
    process.exit(1);
  }
  
  try {
    // Make a simple call to the OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Generate a simple math question for elementary students.' }
        ],
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Check if the response contains expected data
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      console.log('\n✅ SUCCESS: Connected to OpenAI API successfully');
      console.log('\nSample response:');
      console.log(response.data.choices[0].message.content);
      
      console.log('\nAPI Details:');
      console.log(`- Model: ${response.data.model}`);
      console.log(`- Prompt Tokens: ${response.data.usage.prompt_tokens}`);
      console.log(`- Completion Tokens: ${response.data.usage.completion_tokens}`);
      console.log(`- Total Tokens: ${response.data.usage.total_tokens}`);
      
      console.log('\nYour OpenAI integration is working correctly.');
    } else {
      console.error('\n❌ ERROR: Unexpected response format from OpenAI API');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('\n❌ ERROR: Failed to connect to OpenAI API');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error(`Status: ${error.response.status}`);
      console.error('Error details:', error.response.data);
      
      // Common error handling
      if (error.response.status === 401) {
        console.log('\nTIP: Your API key appears to be invalid or expired.');
        console.log('Get a new key from: https://platform.openai.com/account/api-keys');
      } else if (error.response.status === 429) {
        console.log('\nTIP: You\'ve hit rate limits or your account needs payment.');
        console.log('Check your usage at: https://platform.openai.com/account/usage');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Check your internet connection.');
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testOpenAI();
