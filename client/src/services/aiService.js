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
      // Get authentication token if available
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const headers = token 
        ? { Authorization: `Bearer ${token}` } 
        : {};
      
      const response = await axios.post(
        `${API_BASE_URL}/generate/exercises`,
        data,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error generating exercises:', error);
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
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (!token) {
        throw new Error('Authentication required to save exercises');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/generate/save`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error saving generated exercise:', error);
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
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (!token) {
        throw new Error('Authentication required to create templates');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/generate/create-template`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating template from exercise:', error);
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
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (!token) {
        throw new Error('Authentication required to grade submissions');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/generate/grade/${submissionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error grading submission:', error);
      throw error;
    }
  }
};

export default aiService;
