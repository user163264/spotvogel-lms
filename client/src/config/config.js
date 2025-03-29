// Client-side configuration

// Load environment variables from .env file
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  serverUrl: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000',
  env: process.env.NODE_ENV || 'development',
};

export default config;
