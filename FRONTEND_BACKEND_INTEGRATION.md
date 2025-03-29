# Frontend-Backend Integration Guide

This guide explains how to test and verify the integration between the frontend React application and the backend Express API for the Teacher-Focused LMS system.

## Setup for Debugging

### 1. Environment Configuration

Make sure your environment is properly set up:

```bash
# In the backend directory (server)
cd server
cp .env.example .env
# Edit .env to set proper variables:
# - PORT=8080
# - MONGODB_URI=<your_mongodb_connection_string>
# - JWT_SECRET=<your_jwt_secret>
# - OPENAI_API_KEY=<your_openai_api_key>

# Install dependencies
npm install

# In the frontend directory (client)
cd ../client
# Create .env file if not exists
touch .env
# Add these variables:
# REACT_APP_API_URL=http://localhost:8080/api
# REACT_APP_SERVER_URL=http://localhost:8080
npm install
```

### 2. Start Both Servers

Run both servers in development mode:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### 3. Access the Debug Interface

1. Open your browser and navigate to: `http://localhost:3000/debug`
2. You should see the API Tester interface

## Testing the Integration

Follow these steps to verify the integration is working correctly:

### 1. Basic Connectivity

1. On the API Tester page, click "Echo Test"
2. You should see a successful response with request details
   - If this fails, check that your backend server is running and accessible

### 2. Authentication

1. Register a new user or log in with an existing user
2. Verify that the Auth Status section shows you as authenticated
3. Click "Auth Test" which should succeed with your user details
4. Click "Get Profile" which should retrieve your user profile

### 3. Exercise Management

1. Click "Fetch Exercises" to see if you can retrieve existing exercises
   - If no exercises exist, you may see an empty array
2. To test with real data, you need to create some exercises first

### 4. Error Handling

1. Click "Error Test" and enter different error codes (e.g., 400, 401, 404, 500)
2. Verify that errors are handled appropriately and displayed correctly

### 5. Network Conditions

1. Click "Delay Test" with various seconds (1-10)
2. Observe how the UI handles loading states during delays

## Common Issues

### CORS Errors

If you see CORS errors in the console:

```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header...
```

**Solution**: Check that your backend server has CORS properly configured:

```javascript
// server.js
const cors = require('cors');
app.use(cors());
```

### Authentication Issues

If you get 401 Unauthorized errors:

1. Check that your token is being stored correctly in localStorage
2. Verify that the Authorization header is being set properly
3. Make sure the token hasn't expired

You can check this in:
- Browser DevTools → Application → Storage → Local Storage
- Network tab → Headers for the "Authorization" header

### MongoDB Connection

If you see errors connecting to MongoDB:

1. Verify your connection string in the `.env` file
2. Check that MongoDB is running
3. Ensure network connectivity to your MongoDB instance

## Next Steps for Complete Integration

After verifying basic functionality, continue with:

1. Testing form submissions for creating new entities
2. Implementing and testing the AI exercise generation
3. Adding proper error handling throughout the application
4. Implementing loading states consistently
5. Adding user feedback for operations

## API Conventions

For consistency, all API endpoints follow these conventions:

- Base URL: `/api`
- Authentication: JWT token in Authorization header
- Error responses: `{ message: "Error description" }`
- Success responses: Either the requested resource or `{ message: "Success message" }`
- List endpoints support query parameters for filtering
- MongoDB documents include both `_id` and `id` fields for compatibility (see [MONGODB_ID_HANDLING.md](MONGODB_ID_HANDLING.md))

## Service Abstraction

The React application uses service abstraction for API calls:

- `authService.js` - Authentication operations
- `exerciseService.js` - Exercise management
- `templateService.js` - Template management
- `submissionService.js` - Student submission handling

Always use these service functions instead of direct axios calls to maintain consistency and make future API changes easier.
