# OpenAI Integration Troubleshooting Guide

This guide provides comprehensive troubleshooting steps for the OpenAI integration in the Teacher-Focused LMS system.

## Common Issues and Solutions

### 500 Internal Server Error During Exercise Generation

**Symptoms:**
- Backend returns 500 error when trying to generate exercises
- Frontend displays "Failed to generate exercise" error message
- Console shows network error with status code 500

**Possible Causes and Solutions:**

1. **Invalid or Expired OpenAI API Key**
   - **Check:** Run the diagnostic script to verify API key validity
   - **Solution:** Update the API key in the `.env` file with a valid key
   - **Command:** `./scripts/verify-openai-key.js`

2. **OpenAI API Rate Limiting**
   - **Check:** Look for 429 status codes in the server logs
   - **Solution:** Implement rate limiting in your application or upgrade your OpenAI plan
   - **Note:** Free tier has strict rate limits that can be hit quickly

3. **Content Filtering/Moderation Issues**
   - **Check:** Certain topics (like "World War II") might trigger content filters
   - **Solution:** Try with more neutral topics or implement retry logic with alternative prompts
   - **Example:** "Basic mathematics" instead of potentially sensitive historical topics

4. **Malformed Response Parsing**
   - **Check:** Look for JSON parsing errors in the server logs
   - **Solution:** Implement more robust parsing with error handling (see improved aiService.js)

5. **Timeout Issues**
   - **Check:** Look for ECONNABORTED errors in logs
   - **Solution:** Increase timeout settings in axios or OpenAI client configuration

6. **Server Configuration Mismatch**
   - **Check:** Verify the correct ports are configured between frontend and backend
   - **Solution:** Ensure REACT_APP_API_URL in client/.env matches the actual server port

### Authentication Issues

**Symptoms:**
- "Unauthorized" errors when trying to generate exercises
- 401 errors in the network tab

**Solutions:**
1. Check that JWT tokens are being properly passed in the Authorization header
2. Verify token expiration times
3. Ensure the user has appropriate permissions for exercise generation

### CORS Issues

**Symptoms:**
- Browser console shows CORS errors
- Requests fail in the frontend but work when tested directly with Postman

**Solutions:**
1. **Check CORS configuration in server.js:**
   ```javascript
   // Ensure proper CORS setup
   app.use(cors({
     origin: process.env.CLIENT_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```

2. **Verify that OPTIONS requests are handled correctly for preflight checks**

## Diagnostic Steps

### Step 1: Run the Diagnostic Script

```bash
# In the server directory
./scripts/openai-diagnostic.js
```

This will:
- Check environment variables
- Test OpenAI API connectivity
- Test exercise generation with simple and complex topics
- Check server configuration
- Test backend endpoints directly

### Step 2: Check Server Logs

Look for error patterns in the logs:

```bash
# Display last 100 lines of logs with errors highlighted
grep -i "error\|exception\|fail" logs/error.log | tail -n 100
```

### Step 3: Test API Endpoints Directly

Use curl or Postman to test the exercise generation endpoint:

```bash
curl -X POST \
  http://localhost:8080/api/exercises/generate \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -d '{
    "topic": "Basic Math",
    "difficulty": "beginner",
    "type": "multiple-choice",
    "language": "english"
  }'
```

### Step 4: Check for Network/Firewall Issues

Ensure your server can connect to the OpenAI API:

```bash
# Test connectivity to OpenAI API
curl -I https://api.openai.com
```

## Implementation Fixes

### 1. Implement Improved Error Handling

Replace the existing aiService.js with the enhanced version that includes:
- Better error handling
- Retry mechanism
- Improved response parsing
- Detailed logging

```bash
# Backup existing service
cp ./services/aiService.js ./services/aiService.js.backup

# Copy improved version
cp ./scripts/improved-aiService.js ./services/aiService.js
```

### 2. Add Request Validation

Ensure all input parameters are validated before sending to OpenAI:

```javascript
// In your controller
if (!req.body.topic) {
  return res.status(400).json({ message: 'Topic is required' });
}
```

### 3. Configure Proper Timeouts

Add timeouts to all API requests:

```javascript
axios.post(url, data, { timeout: 30000 }) // 30 seconds
```

### 4. Implement Circuit Breaker Pattern

Consider adding a circuit breaker for OpenAI calls to prevent cascading failures:

```javascript
// Using opossum library
const CircuitBreaker = require('opossum');

const options = {
  timeout: 30000, // If our function takes longer than 30 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again
};

const breaker = new CircuitBreaker(generateExercise, options);
breaker.fire(params)
  .then(console.log)
  .catch(console.error);
```

## Port Configuration Fix

If your diagnostic reveals a port mismatch:

1. Check the server port in server/.env:
```
PORT=8080
```

2. Make sure client/.env has matching configuration:
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_SERVER_URL=http://localhost:8080
```

3. Or update the server to use the expected port:
```javascript
// In server.js
const PORT = process.env.PORT || 8080;
```

**Note:** Avoid using port 5000 on macOS as it conflicts with AirPlay Receiver.

## Testing Approach

When testing OpenAI integration:

1. Start with simple, neutral topics
2. Use the smallest possible token count
3. Implement detailed logging
4. Test with direct API calls before testing through the frontend
5. Check for specific error codes that indicate rate limiting or content moderation issues

## Monitoring and Logging

Add structured logging to help diagnose issues:

```javascript
// Add this to your error handling
logger.error('OpenAI API error', {
  endpoint: '/api/exercises/generate',
  params: req.body,
  error: {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data
  },
  user: req.user.id,
  timestamp: new Date().toISOString()
});
```

This structured data will make it easier to identify patterns in errors.

## Next Steps After Fixing

1. Document the working configuration
2. Add automated tests for the OpenAI integration
3. Implement fallback mechanisms for when OpenAI is unavailable
4. Consider caching common exercise types to reduce API usage
