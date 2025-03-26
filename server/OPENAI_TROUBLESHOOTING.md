# OpenAI Integration Troubleshooting Guide

This guide helps resolve common issues with the OpenAI API integration in the Teacher-Focused LMS system.

## Quick Verification

Run the verification script to test your OpenAI API configuration:

```bash
# From the server directory
node scripts/verify-openai-key.js
```

## Common Issues and Solutions

### 1. API Key Issues

**Error: "Invalid API key"**

- Make sure your OpenAI API key is correctly set in the `.env` file
- API keys should start with `sk-`
- Check for any accidental whitespace or line breaks in the key
- Verify the API key is active in your OpenAI account

```
# In the .env file
OPENAI_API_KEY=sk-your-actual-key-here
```

### 2. Rate Limiting and Quota Issues

**Error: "Rate limit exceeded" or "You exceeded your current quota"**

- Check your usage on the [OpenAI usage dashboard](https://platform.openai.com/account/usage)
- Verify your billing information is up-to-date
- If you're using a free tier account, it may have limited credits
- Consider upgrading your OpenAI account for more capacity

### 3. Network and Connectivity

**Error: "Connection timeout" or no response**

- Verify your server has internet access
- Check if a firewall is blocking outbound connections to OpenAI
- Test basic connectivity with: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

### 4. Model Availability

**Error: "Model not found" or "The model does not exist"**

- Check if the model specified in your `.env` file is available to your account
- Some models (like GPT-4) require special access
- Try using a widely available model like 'gpt-3.5-turbo'

```
# In the .env file
OPENAI_MODEL=gpt-3.5-turbo
```

### 5. Configuration Issues

**Error: "Cannot read properties of undefined"**

- Check that your server is properly loading the `.env` file
- Verify `dotenv` is configured correctly in your application
- Add logging to verify environment variables are loaded correctly

### 6. JSON Parsing Errors

**Error: "Failed to parse AI-generated exercises"**

- The OpenAI response might not match the expected JSON format
- Check the AI service prompts and ensure they request proper JSON format
- Review the enhanced error logs for the exact response that couldn't be parsed

### 7. Timeout Issues

**Error: "Request timed out" or "ETIMEDOUT"**

- The OpenAI API can sometimes take longer to respond, especially for complex prompts
- Consider increasing your axios timeout in the AI service:

```javascript
// In services/aiService.js
this.client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds instead of default
});
```

## Fixing the Server Configuration

If you've confirmed your API key is valid but still having issues, check these common configuration problems:

### Update the OpenAI API Base URL

Make sure you're using the correct API endpoint:

```javascript
// In services/aiService.js
this.client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  // other configuration...
});
```

### Check API Version

If you're getting version-related errors, you might need to specify the API version:

```javascript
// In services/aiService.js
this.client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'OpenAI-Version': '2023-05-15' // Add API version if needed
  }
});
```

### Implement Retries for Reliability

For improved reliability, add a retry mechanism:

```javascript
// Install axios-retry: npm install axios-retry
const axiosRetry = require('axios-retry');

// In services/aiService.js
this.client = axios.create({
  // existing configuration...
});

// Configure retries
axiosRetry(this.client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           (error.response && error.response.status === 429);
  }
});
```

## Debugging with Enhanced Logging

With the enhanced error logging we've implemented, you can find detailed error information in your server console. Look for log entries that start with:

```
====== ERROR GENERATING EXERCISES ======
```

Or for controller errors:

```
====== CONTROLLER ERROR: GENERATE EXERCISES ======
```

These log sections will contain detailed information about the error, including:
- Request parameters
- OpenAI API response details
- Error stack traces
- Possible API key issues

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. Check the server logs for the specific error messages with our enhanced logging
2. Use the Node debugger to step through the AI service code
3. Try a simplified test request using the test script
4. Consult the [OpenAI API documentation](https://platform.openai.com/docs/api-reference) for updates or changes
5. Check the OpenAI status page for service disruptions: [status.openai.com](https://status.openai.com)
