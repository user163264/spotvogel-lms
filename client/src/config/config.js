// Client-side configuration

// Load environment variables from .env file
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  serverUrl: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000',
  env: process.env.NODE_ENV || 'development',
};

// Add the missing exports that are referenced in various files
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const TOKEN_STORAGE_KEY = 'lms_auth_token';

export default config;
