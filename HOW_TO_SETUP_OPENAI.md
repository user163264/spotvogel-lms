# Setting Up OpenAI API for Your LMS System

This guide will walk you through setting up the OpenAI API integration for the Teacher-Focused LMS system.

## 1. Get an OpenAI API Key

If you don't already have an OpenAI API key:

1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Create an account or sign in
3. Navigate to [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
4. Click "Create new secret key"
5. Copy the key (it starts with "sk-")
   - **Important**: This key will only be shown once, so make sure to copy it immediately!

## 2. Configure Your Environment

1. Open your backend `.env` file:

```bash
cd server
nano .env  # or use any text editor
```

2. Add or update these environment variables:

```
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
```

3. Save the file

## 3. Verify Your Setup

Run the verification script to make sure your OpenAI integration works:

```bash
cd server
node scripts/verify-openai-key.js
```

You should see a successful test response. If not, check the troubleshooting section below.

## 4. Restart Your Server

Restart your Node.js server to apply the changes:

```bash
npm run dev
```

## 5. Test the Integration in Your Application

1. Log in to your LMS as a teacher
2. Navigate to the "Exercises" section
3. Click on "Generate with AI" 
4. Fill out the form with:
   - Subject: Mathematics
   - Grade Level: Elementary
   - Topic: Addition and Subtraction
   - Exercise Type: Multiple Choice
   - Difficulty: 2
   - Count: 3
   - Language: English
5. Click "Generate Exercises" and wait for the response

## Troubleshooting

If you encounter issues:

### Invalid API Key

If you see "Invalid API key" or authentication errors:
- Double-check that you copied the entire API key correctly
- Make sure there are no extra spaces or line breaks
- Verify the key is active in your OpenAI dashboard

### Rate Limits or Quota Exceeded

If you see rate limit or quota errors:
- Check your usage at [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage)
- Ensure you have a payment method set up if you've exceeded the free tier
- Consider using a different API key or waiting if you've hit temporary rate limits

### Timeout Errors

If the requests are timing out:
- Try generating fewer exercises at once
- Use a simpler exercise type
- Check your internet connection

### Model Not Available

If you see "model not found" errors:
- Try using `gpt-3.5-turbo` which is widely available
- Check if you have access to the specified model in your OpenAI account

## Advanced Configuration

### Using Different Models

You can change the model by updating your `.env` file:

```
OPENAI_MODEL=gpt-4
```

Available options include:
- `gpt-3.5-turbo` - Good balance of quality and cost
- `gpt-3.5-turbo-16k` - Larger context window
- `gpt-4` - Higher quality but more expensive
- `gpt-4-turbo` - Latest GPT-4 model

### Model Parameter Tuning

You can adjust how the AI generates content by modifying the parameters in `services/aiService.js`:

```javascript
// More creative responses (higher temperature)
temperature: 0.8,

// More focused responses (lower temperature)
temperature: 0.3,
```

## For More Help

If you're still experiencing issues, please:

1. Check the detailed `OPENAI_TROUBLESHOOTING.md` guide in the server directory
2. Look at the server logs for specific error messages
3. Visit the [OpenAI API Documentation](https://platform.openai.com/docs/api-reference) for more information
