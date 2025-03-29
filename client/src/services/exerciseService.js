import axios from 'axios';
import { API_BASE_URL } from '../config/config';

// API base URL
const API_URL = `${API_BASE_URL}/exercises`;

/**
 * Fetch exercises with optional filtering
 * @param {Object} filters - Filter parameters
 * @returns {Promise} - Promise with exercises data
 */
export const fetchExercises = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.grade) params.append('grade', filters.grade);
    if (filters.difficultyLevel) params.append('difficulty', filters.difficultyLevel);
    if (filters.search) params.append('search', filters.search);
    
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Fetch a single exercise by ID
 * @param {string} id - Exercise ID
 * @returns {Promise} - Promise with exercise data
 */
export const getExerciseById = async (id) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error('Exercise ID is required');
    }

    const response = await axios.get(`${API_URL}/${id}`);
    
    // Validate response
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    
    // Ensure response has exercise data
    if (!response.data.data) {
      console.warn('Response missing exercise data structure', response.data);
      throw new Error('Exercise data not found');
    }
    
    return response.data.data;
  } catch (error) {
    // Check for specific API error responses
    if (error.response) {
      const status = error.response.status;
      
      if (status === 404) {
        throw new Error('Exercise not found');
      } else if (status === 401) {
        throw new Error('Authentication required to view this exercise');
      } else if (status === 403) {
        throw new Error('You do not have permission to view this exercise');
      } else {
        throw error.response?.data || { message: `Server error: ${error.message}` };
      }
    }
    
    // For network errors
    if (error.request && !error.response) {
      throw new Error('No response from server. Please check your connection and try again.');
    }
    
    // For other errors
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Create a new exercise
 * @param {Object} exerciseData - Exercise data to create
 * @returns {Promise} - Promise with created exercise
 */
export const createExercise = async (exerciseData) => {
  try {
    const response = await axios.post(API_URL, exerciseData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Save exercise as draft
 * @param {Object} exerciseData - Exercise data to save as draft
 * @returns {Promise} - Promise with saved draft exercise
 */
export const saveExerciseDraft = async (exerciseData) => {
  try {
    const response = await axios.post(`${API_URL}/drafts`, exerciseData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Update an existing exercise
 * @param {string} id - Exercise ID to update
 * @param {Object} exerciseData - Updated exercise data
 * @returns {Promise} - Promise with updated exercise
 */
export const updateExercise = async (id, exerciseData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, exerciseData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Delete an exercise
 * @param {string} id - Exercise ID to delete
 * @returns {Promise} - Promise with deletion confirmation
 */
export const deleteExercise = async (id) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error('Exercise ID is required for deletion');
    }

    const response = await axios.delete(`${API_URL}/${id}`);
    
    // Validate response
    if (!response.data) {
      throw new Error('Invalid response format');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error deleting exercise:', error);
    
    // Check for specific API error responses
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || '';
      
      if (status === 404) {
        throw new Error('Exercise not found. It may have already been deleted.');
      } else if (status === 401) {
        throw new Error('Authentication required to delete this exercise.');
      } else if (status === 403) {
        throw new Error('You do not have permission to delete this exercise.');
      } else if (status >= 500) {
        throw new Error(`Server error: ${message || 'An unexpected error occurred during deletion.'}`);
      }
    }
    
    // For network errors
    if (error.request && !error.response) {
      throw new Error('No response from server. Please check your connection and try again.');
    }
    
    // For other errors
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Generate an exercise using AI
 * @param {Object} promptData - Data to generate the prompt from
 * @returns {Promise} - Promise with generated exercise
 */
export const generateExercise = async (promptData) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, promptData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Get exercises created by the current user
 * @returns {Promise} - Promise with user's exercises
 */
export const getMyExercises = async () => {
  try {
    const response = await axios.get(`${API_URL}/my`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
