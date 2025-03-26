import axios from 'axios';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '../config/config';

// API base URL
const API_URL = `${API_BASE_URL}/auth`;

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with user data and token
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data and token
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Logout user
 */
export const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  // Remove auth header
  delete axios.defaults.headers.common['Authorization'];
};

/**
 * Get current user profile
 * @returns {Promise} - Promise with user data
 */
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise} - Promise with updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData);
    
    // Update token if returned (e.g., after password change)
    if (response.data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY) !== null;
};

/**
 * Initialize auth headers from stored token
 */
export const initializeAuth = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};
