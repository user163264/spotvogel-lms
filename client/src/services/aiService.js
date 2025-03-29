import axios from 'axios';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '../config/config';
import * as authService from './authService';

/**
 * Service for AI-related functionality in the frontend
 */
const aiService = {
  /**
   * Generate exercises using AI
   * 
   * @param {Object} data - Exercise generation parameters
   * @returns {Promise<Object>} Generated exercises
   */
  async generateExercises(data) {
    try {
      // Validate required fields before making the API call
      if (!data) {
        throw new Error('No data provided for exercise generation');
      }

      const requiredFields = ['subject', 'gradeLevel', 'topic', 'exerciseType'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Apply defaults for optional fields
      data.count = data.count || 5;
      data.difficulty = data.difficulty || 3;
      data.language = data.language || 'english';

      // Get authentication token if available
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const headers = token 
        ? { Authorization: `Bearer ${token}` } 
        : {};
      
      // Add timeout to prevent hanging requests
      const response = await axios.post(
        `${API_BASE_URL}/generate/exercises`,
        data,
        { 
          headers,
          timeout: 30000 // 30 second timeout for AI generation
        }
      );
      
      // Ensure the response contains the expected structure
      if (!response.data) {
        console.error('Empty response from server');
        throw new Error('Server returned an empty response');
      }
      
      if (response.data && !response.data.success) {
        console.warn('Server indicated operation was not successful', response.data);
        throw new Error(response.data.message || 'Failed to generate exercises');
      }

      // Ensure exercises is always a valid array
      if (!response.data.exercises) {
        console.warn('Response missing exercises array, creating empty array');
        response.data.exercises = [];
      } else if (!Array.isArray(response.data.exercises)) {
        console.warn('Exercises is not an array, converting to array', response.data.exercises);
        // If exercises is an object but not an array, try to convert it
        if (typeof response.data.exercises === 'object') {
          response.data.exercises = [response.data.exercises];
        } else {
          response.data.exercises = [];
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error generating exercises:', error);
      
      // Provide more specific error messages based on error type
      if (error.code === 'ECONNABORTED') {
        throw new Error('The request took too long to complete. The AI service might be busy. Please try again later.');
      }
      
      if (error.response) {
        // Server responded with an error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message || '';
        
        if (status === 400) {
          throw new Error(`Invalid parameters: ${serverMessage || 'Please check your inputs and try again.'}`);
        } else if (status === 401) {
          throw new Error('Authentication required. Please log in and try again.');
        } else if (status === 403) {
          throw new Error('You do not have permission to perform this action.');
        } else if (status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (status >= 500) {
          throw new Error(`Server error: ${serverMessage || 'The AI service is currently unavailable. Please try again later.'}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check your internet connection and try again.');
      }
      
      // For other errors, just pass through the error message
      throw error;
    }
  },
  
  /**
   * Save a generated exercise to the database
   * 
   * @param {Object} data - Exercise data to save
   * @returns {Promise<Object>} Saved exercise
   */
  async saveGeneratedExercise(data) {
    try {
      // Validate input data
      if (!data || !data.exerciseData) {
        throw new Error('Invalid exercise data provided');
      }

      // Ensure title exists
      if (!data.title) {
        console.warn('Exercise title missing, using default title');
        data.title = `Exercise ${new Date().toLocaleDateString()}`;
      }

      // Get authentication token if available
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (!token) {
        throw new Error('Authentication required to save exercises');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/generate/save`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Validate response data
      if (!response.data || !response.data.success) {
        console.warn('Server responded with unexpected format', response.data);
        throw new Error('Server responded with an unexpected format');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error saving generated exercise:', error);
      // Transform error messages to be more user-friendly
      if (error.response?.status === 401) {
        throw new Error('Your session has expired. Please login again to save exercises.');
      } else if (error.response?.status === 400) {
        throw new Error('The exercise data format is invalid. Please try again.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error while saving exercise. Please try again later.');
      }
      throw error;
    }
  },
  
  /**
   * Create a template from an existing exercise
   * 
   * @param {Object} data - Template creation data
   * @returns {Promise<Object>} Created template
   */
  async createTemplateFromExercise(data) {
    try {
      // Validate input data
      if (!data) {
        throw new Error('No data provided for template creation');
      }

      if (!data.templateName) {
        console.warn('Template name missing, using default name');
        data.templateName = `Template ${new Date().toLocaleDateString()}`;
      }

      if (!data.exerciseParameters && !data.exerciseId) {
        throw new Error('Either exercise parameters or exercise ID must be provided');
      }

      // Get authentication token
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (!token) {
        throw new Error('Authentication required to create templates');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/generate/create-template`,
        data,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 // 10 second timeout
        }
      );
      
      // Validate response
      if (!response.data) {
        throw new Error('Empty response received from server');
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create template');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating template from exercise:', error);
      
      // Provide helpful error messages
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || '';

        if (status === 400) {
          throw new Error(`Invalid template data: ${message || 'Please check your inputs.'}`);
        } else if (status === 401) {
          throw new Error('Your session has expired. Please login again to create templates.');
        } else if (status === 403) {
          throw new Error('You do not have permission to create templates.');
        } else if (status === 404) {
          throw new Error('The exercise you are trying to use as a template was not found.');
        } else if (status >= 500) {
          throw new Error(`Server error: ${message || 'The server encountered an error. Please try again later.'}`);
        }
      } else if (error.request) {
        throw new Error('No response received from server. Please check your connection and try again.');
      }
      
      throw error;
    }
  },
  
  /**
   * Grade a submission using AI
   * 
   * @param {string} submissionId - ID of the submission to grade
   * @returns {Promise<Object>} Grading result
   */
  async gradeSubmission(submissionId) {
    try {
      // Validate submission ID
      if (!submissionId) {
        throw new Error('Submission ID is required for grading');
      }

      // Ensure submission ID is a string
      const id = String(submissionId).trim();
      if (id.length === 0) {
        throw new Error('Invalid submission ID');
      }

      // Get authentication token
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (!token) {
        throw new Error('Authentication required to grade submissions');
      }
      
      // AI grading may take time, so set a longer timeout
      const response = await axios.post(
        `${API_BASE_URL}/generate/grade/${id}`,
        {},
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 45000 // 45 second timeout for AI grading
        }
      );
      
      // Validate response
      if (!response.data) {
        throw new Error('Empty response received from server');
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to grade submission');
      }
      
      // Make sure submission data is present
      if (!response.data.submission) {
        console.warn('Response missing submission data');
        throw new Error('Grading completed but submission data is missing');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error grading submission:', error);
      
      // Provide helpful error messages
      if (error.code === 'ECONNABORTED') {
        throw new Error('The grading process took too long to complete. AI grading may be experiencing delays.');
      }
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || '';

        if (status === 400) {
          throw new Error(`Invalid submission data: ${message || 'Please check the submission.'}`);
        } else if (status === 401) {
          throw new Error('Your session has expired. Please login again to grade submissions.');
        } else if (status === 403) {
          throw new Error('You do not have permission to grade this submission.');
        } else if (status === 404) {
          throw new Error('The submission you are trying to grade was not found.');
        } else if (status === 429) {
          throw new Error('Too many grading requests. Please wait a moment and try again.');
        } else if (status >= 500) {
          throw new Error(`Server error: ${message || 'The AI grading service is currently unavailable. Please try again later.'}`);
        }
      } else if (error.request) {
        throw new Error('No response received from server. Please check your connection and try again.');
      }
      
      throw error;
    }
  }
};

export default aiService;
