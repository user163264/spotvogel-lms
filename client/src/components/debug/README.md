# LMS Debugging Tools

This directory contains tools for debugging the LMS application, particularly focusing on API integration between the frontend and backend.

## ApiTester Component

The `ApiTester` component provides a comprehensive UI for testing various API endpoints and services.

### Usage

1. Navigate to `/debug` in the application to access the API Tester.
2. The tester is organized into different sections:
   - **API Configuration**: Shows the environment and base URLs
   - **Auth Status**: Shows current authentication status and request headers
   - **Debug API Tests**: Simple endpoints for testing connectivity and behavior
   - **Service Tests**: API service function tests organized by feature

### Debug API Tests

These endpoints are specifically designed for debugging and testing:

- **Echo Test**: Returns information about the request, useful for verifying headers and request format
- **Auth Test**: Tests authentication by attempting to access a protected endpoint
- **Error Test**: Lets you test error handling for different HTTP status codes
- **Delay Test**: Tests handling of slow API responses

### Service Tests

Tests organized by domain:

- **Authentication**: Login, register, profile management
- **Exercises**: Fetching, creating, and managing exercises
- **Templates**: Template management
- **Submissions**: Student submission handling

## Console Debugging

The application has enhanced logging for API calls:

1. All API requests are logged to the console with green styling
2. All API responses are logged to the console with blue styling
3. All API errors are logged to the console with red styling

To see these logs:
- Open your browser's developer tools (F12 or right-click → Inspect)
- Go to the Console tab
- Filter by "API" to see only API-related logs

## Backend Debugging Endpoints

The backend provides special debugging endpoints at `/api/debug/*`:

- `GET /api/debug/echo` - Returns details about the incoming request
- `GET /api/debug/auth-test` - Tests authentication (requires auth token)
- `GET /api/debug/error/:code` - Returns specified HTTP error code
- `GET /api/debug/delay/:seconds` - Responds after specified delay (1-10 seconds)

These endpoints are only available in development mode and are automatically disabled in production.

## Common Issues and Solutions

### 401 Unauthorized

- Check that your token is valid and not expired
- Verify that the Authorization header is correctly formatted
- Make sure you're logged in before attempting protected operations

### CORS Issues

- Ensure the backend CORS configuration includes your frontend origin
- Check for HTTP vs HTTPS mismatches

### Network Errors

- Verify that both frontend and backend servers are running
- Check network connectivity
- Ensure API URLs are correctly configured

## Adding New Tests

To add new tests to the API Tester:

1. Create a test function in the component
2. Add a button that calls the function
3. Make sure to handle loading states and errors

## Troubleshooting Tips

1. Use the browser network tab to inspect actual HTTP requests and responses
2. Enable verbose logging in the console
3. Try simplified requests to isolate issues
4. Check for environment-specific problems
5. Verify that data formats match between frontend and backend

Remember to disable or remove debugging tools before deploying to production.
