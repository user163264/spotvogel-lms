# Environment Variables Guide

This guide explains how to properly set up and use environment variables in the Teacher-Focused LMS project.

## Why Use Environment Variables?

Environment variables allow us to:
- Keep sensitive information (like API keys) out of the codebase
- Configure the application differently in various environments (development, testing, production)
- Maintain security best practices
- Avoid committing secrets to version control

## Setup Process

### Server-Side (.env file in server directory)

1. Copy the example file:
   ```bash
   cp server/.env.example server/.env
   ```

2. Edit the `.env` file with your actual values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/teacher-lms
   JWT_SECRET=your_secure_random_string
   OPENAI_API_KEY=your_actual_openai_api_key
   NODE_ENV=development
   ```

### Client-Side (.env file in client directory)

1. Copy the example file:
   ```bash
   cp client/.env.example client/.env
   ```

2. Edit the `.env` file with your actual values:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SERVER_URL=http://localhost:5000
   ```

## Accessing Environment Variables

### In Server Code

Environment variables are accessible through the config object:

```javascript
const config = require('./config/config');

// Example usage
mongoose.connect(config.mongodbUri);
app.listen(config.port);
const openaiClient = new OpenAI({ apiKey: config.openaiApiKey });
```

### In Client Code

Environment variables in React must be prefixed with `REACT_APP_`:

```javascript
import config from './config/config';

// Example usage
axios.get(`${config.apiUrl}/exercises`);
```

## Security Best Practices

1. **Never commit `.env` files to Git**
   - The `.gitignore` file is already configured to exclude `.env` files
   - Only commit `.env.example` files with placeholder values

2. **Use strong, unique values for secrets**
   - Generate a strong random string for JWT_SECRET
   - Use separate API keys for development and production

3. **Restrict environment variable access**
   - Only expose variables that are actually needed
   - Validate required variables on application startup

4. **Rotate secrets periodically**
   - Change API keys and secrets regularly, especially after team member changes

## Deployment Considerations

When deploying to production:

1. Set environment variables through your hosting platform's interface
2. Ensure `NODE_ENV=production` is set
3. Use a secrets management service if available
4. Validate that all required environment variables are present

## Troubleshooting

If you encounter issues with environment variables:

1. Check that the `.env` file exists in the correct location
2. Verify that the variable names match exactly (they are case-sensitive)
3. Restart the server after changing environment variables
4. For client-side variables, rebuild the React app after changes
