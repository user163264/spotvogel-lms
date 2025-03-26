import axios from 'axios';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '../config/config';

/**
 * Configure global axios defaults and interceptors
 */
export const setupApi = () => {
  // Set base URL for all requests
  axios.defaults.baseURL = API_BASE_URL;
  
  // Set default headers
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  
  // Add request interceptor for authentication and logging
  axios.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      // If token exists, add it to the request header
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Log all requests in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('%c API Request:', 'background: #4CAF50; color: white; padding: 2px 4px; border-radius: 2px', {
          url: config.url,
          method: config.method.toUpperCase(),
          headers: config.headers,
          data: config.data,
          params: config.params
        });
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor for handling common errors and logging
  axios.interceptors.response.use(
    (response) => {
      // Log all responses in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('%c API Response:', 'background: #2196F3; color: white; padding: 2px 4px; border-radius: 2px', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
          config: {
            url: response.config.url,
            method: response.config.method.toUpperCase()
          }
        });
      }
      
      return response;
    },
    (error) => {
      // Log errors in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('%c API Error:', 'background: #F44336; color: white; padding: 2px 4px; border-radius: 2px', {
          message: error.message,
          response: error.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          } : 'No response',
          config: error.config ? {
            url: error.config.url,
            method: error.config.method.toUpperCase()
          } : 'No config'
        });
      }
      
      // Handle 401 Unauthorized errors (token expired or invalid)
      if (error.response && error.response.status === 401) {
        // Clear token and redirect to login page
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        
        // Only redirect if not already on login page to prevent loops
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden errors (insufficient permissions)
      if (error.response && error.response.status === 403) {
        console.error('Insufficient permissions to access this resource');
      }
      
      // Handle 500 Internal Server Error
      if (error.response && error.response.status === 500) {
        console.error('Server error occurred');
      }
      
      return Promise.reject(error);
    }
  );
};

/**
 * Format error message from API response
 * @param {Object} error - Axios error object
 * @returns {string} - Formatted error message
 */
export const formatApiError = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // Handle axios error response
  if (error.response && error.response.data) {
    const { data } = error.response;
    
    // Handle different error response formats
    if (data.message) {
      return data.message;
    }
    
    if (data.error) {
      return data.error;
    }
    
    if (typeof data === 'string') {
      return data;
    }
  }
  
  // Handle network errors
  if (error.request && !error.response) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Handle other errors
  if (error.message) {
    return error.message;
  }
  
  return 'An error occurred';
};

// Initialize API setup
setupApi();
