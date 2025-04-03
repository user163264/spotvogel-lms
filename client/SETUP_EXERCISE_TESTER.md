# Setting Up the Exercise Tester

This document provides instructions for setting up and troubleshooting the Exercise Tester component.

## Installation Instructions

1. Install the required dependencies:

```bash
cd /Users/admin/Documents/lms-system/client
npm install slate slate-react uuid jwt-decode formik yup
```

2. If you encounter errors related to Tailwind CSS:

```bash
npm install tailwindcss postcss autoprefixer
```

3. Create a PostCSS configuration file if needed:

```bash
touch postcss.config.js
```

4. Add the following content to postcss.config.js:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Configuration Updates

If you encounter errors related to missing exports in the config file, ensure that `/Users/admin/Documents/lms-system/client/src/config/config.js` contains the following exports:

```javascript
// Client-side configuration

// Load environment variables from .env file
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  serverUrl: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000',
  env: process.env.NODE_ENV || 'development',
};

// Add these exports to fix the missing exports error
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const TOKEN_STORAGE_KEY = 'lms_auth_token';

export default config;
```

## Starting the Development Server

After completing the installation and configuration:

1. Start the development server:

```bash
npm start
```

2. If you encounter issues, try:

```bash
npx react-scripts start
```

## Accessing the Exercise Tester

Once the development server is running, access the Exercise Tester at:

```
http://localhost:3000/test/exercise-tester
```

## Features

The Exercise Tester currently supports:

1. Multiple Choice exercises
   - Multiple answer options
   - Single answer options
   - Rich text questions

2. Fill-in-the-Blank exercises
   - Basic text passages
   - Code examples
   - Language learning examples

## Coming Soon

- Matching exercises
- Sequencing exercises
- Short answer exercises

## Troubleshooting Common Issues

1. **Module not found errors**: Make sure all required dependencies are installed.

2. **React-scripts not found**: Try reinstalling react-scripts:
   ```bash
   npm install react-scripts
   ```

3. **Tailwind CSS not working**: Ensure your CSS file includes the Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Configuration errors**: Double-check that your config files have all the required exports.

5. **TypeScript errors**: The project is configured to use JavaScript, but many components are written with TypeScript-like JSDoc comments for better code completion and type checking.