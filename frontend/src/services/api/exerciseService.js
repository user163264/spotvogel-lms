/**
 * Exercise API Service
 * Handles all API interactions related to exercises
 */

import axios from 'axios';

// Debug mode - controlled via environment variable
const DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';

// API base URL from environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Debug logger for API requests/responses
 */
const debugLog = (label, data) => {
  if (DEBUG) {
    console.group(`🔌 ${label}`);
    if (data) {
      if (typeof data === 'object') {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(data);
      }
    }
    console.groupEnd();
  }
};

// Add request interceptor for debug logging
apiClient.interceptors.request.use(
  (config) => {
    if (DEBUG) {
      debugLog(`API Request: ${config.method.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params,
      });
    }
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    if (DEBUG) {
      debugLog('API Request Error', error);
    }
    return Promise.reject(error);
  }
);

// Add response interceptor for debug logging
apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      debugLog(`API Response: ${response.status}`, {
        data: response.data,
        headers: response.headers,
      });
    }
    return response;
  },
  (error) => {
    if (DEBUG) {
      debugLog('API Response Error', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : 'No response',
      });
    }
    
    // Handle auth errors
    if (error.response && error.response.status === 401) {
      // Clear auth token for unauthorized errors
      localStorage.removeItem('authToken');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Exercise API Service
 */
const exerciseService = {
  /**
   * Get all exercises
   * 
   * @returns {Promise} Promise with exercises data
   */
  getAllExercises: async () => {
    try {
      debugLog('Getting all exercises');
      const response = await apiClient.get('/exercises');
      return response.data;
    } catch (error) {
      debugLog('Error getting exercises', error);
      throw error;
    }
  },
  
  /**
   * Get a specific matching exercise by ID
   * 
   * @param {number|string} id - Exercise ID
   * @returns {Promise} Promise with exercise data
   */
  getMatchingExercise: async (id) => {
    try {
      debugLog(`Getting matching exercise: ${id}`);
      const response = await apiClient.get(`/exercises/matching/${id}`);
      return response.data;
    } catch (error) {
      debugLog(`Error getting matching exercise: ${id}`, error);
      throw error;
    }
  },
  
  /**
   * Generate a matching exercise from lesson content
   * 
   * @param {Object} data - Generation data
   * @param {number|string} data.lessonId - Lesson ID
   * @param {string} data.lessonContent - Lesson content text
   * @param {Object} data.options - Generation options
   * @returns {Promise} Promise with generated exercise
   */
  generateMatchingExercise: async (data) => {
    try {
      debugLog('Generating matching exercise', data);
      const response = await apiClient.post('/exercises/generate/matching', data);
      return response.data;
    } catch (error) {
      debugLog('Error generating matching exercise', error);
      throw error;
    }
  },
  
  /**
   * Save a matching exercise
   * 
   * @param {Object} data - Exercise data to save
   * @param {number|string} data.lessonId - Lesson ID
   * @param {Object} data.exercise - Exercise object
   * @param {number} data.orderIndex - Display order in lesson
   * @returns {Promise} Promise with saved exercise ID
   */
  saveMatchingExercise: async (data) => {
    try {
      debugLog('Saving matching exercise', data);
      const response = await apiClient.post('/exercises/save/matching', data);
      return response.data;
    } catch (error) {
      debugLog('Error saving matching exercise', error);
      throw error;
    }
  },
  
  /**
   * Submit student answers for a matching exercise
   * 
   * @param {Object} data - Submission data
   * @param {number|string} data.exerciseId - Exercise ID
   * @param {Object} data.answers - Student answers object
   * @returns {Promise} Promise with submission results
   */
  submitMatchingExercise: async (data) => {
    try {
      debugLog('Submitting matching exercise', data);
      const response = await apiClient.post('/exercises/submit/matching', data);
      return response.data;
    } catch (error) {
      debugLog('Error submitting matching exercise', error);
      throw error;
    }
  },
  
  /**
   * Create a mock matching exercise (for testing/development)
   * 
   * @returns {Object} Mock exercise data
   */
  createMockMatchingExercise: () => {
    debugLog('Creating mock matching exercise');
    
    return {
      exercise_id: 'mock-1',
      question: 'Match the painter to their famous work.',
      word_bank: [
        'Leonardo da Vinci',
        'Vincent van Gogh',
        'Salvador Dalí',
        'Claude Monet',
        'Pablo Picasso'
      ],
      match_options: [
        'Mona Lisa',
        'Starry Night',
        'The Persistence of Memory',
        'Water Lilies',
        'Guernica'
      ],
      correct_answer: {
        'Leonardo da Vinci': 'Mona Lisa',
        'Vincent van Gogh': 'Starry Night',
        'Salvador Dalí': 'The Persistence of Memory',
        'Claude Monet': 'Water Lilies',
        'Pablo Picasso': 'Guernica'
      },
      max_score: 5,
      grading_type: 'auto'
    };
  }
};

export default exerciseService;
