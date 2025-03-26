import axios from 'axios';
import { API_BASE_URL } from '../config/config';

// API base URL
const API_URL = `${API_BASE_URL}/templates`;

/**
 * Fetch templates with optional filtering
 * @param {Object} filters - Filter parameters
 * @returns {Promise} - Promise with templates data
 */
export const fetchTemplates = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic);
    if (filters.creator) params.append('creator', filters.creator);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.language) params.append('language', filters.language);
    
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Fetch a single template by ID
 * @param {string} id - Template ID
 * @returns {Promise} - Promise with template data
 */
export const getTemplateById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Create a new template
 * @param {Object} templateData - Template data to create
 * @returns {Promise} - Promise with created template
 */
export const createTemplate = async (templateData) => {
  try {
    const response = await axios.post(API_URL, templateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Update an existing template
 * @param {string} id - Template ID to update
 * @param {Object} templateData - Updated template data
 * @returns {Promise} - Promise with updated template
 */
export const updateTemplate = async (id, templateData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, templateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Delete a template
 * @param {string} id - Template ID to delete
 * @returns {Promise} - Promise with deletion confirmation
 */
export const deleteTemplate = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Create an exercise from a template
 * @param {string} id - Template ID
 * @param {Object} exerciseData - Additional exercise data
 * @returns {Promise} - Promise with created exercise
 */
export const createExerciseFromTemplate = async (id, exerciseData) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/exercises`, exerciseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Get available template categories (subjects and grades)
 * @returns {Promise} - Promise with template categories
 */
export const getTemplateCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data.data || {
      subjects: ['Math', 'Science', 'English', 'History', 'Geography'],
      grades: ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade']
    };
  } catch (error) {
    // Return default categories if API fails
    return {
      subjects: ['Math', 'Science', 'English', 'History', 'Geography'],
      grades: ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade']
    };
  }
};
