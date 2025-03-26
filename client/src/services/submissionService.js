import axios from 'axios';
import { API_BASE_URL } from '../config/config';

// API base URL
const API_URL = `${API_BASE_URL}/submissions`;

/**
 * Fetch submissions with optional filtering
 * @param {Object} filters - Filter parameters
 * @returns {Promise} - Promise with submissions data
 */
export const fetchSubmissions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.student) params.append('student', filters.student);
    if (filters.exercise) params.append('exercise', filters.exercise);
    if (filters.autoGraded !== undefined) params.append('autoGraded', filters.autoGraded);
    
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Fetch a single submission by ID
 * @param {string} id - Submission ID
 * @returns {Promise} - Promise with submission data
 */
export const getSubmissionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Create a new submission
 * @param {Object} submissionData - Submission data including exercise ID and answers
 * @returns {Promise} - Promise with created submission
 */
export const createSubmission = async (submissionData) => {
  try {
    const response = await axios.post(API_URL, submissionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Update an existing submission (for grading/feedback)
 * @param {string} id - Submission ID to update
 * @param {Object} submissionData - Updated submission data
 * @returns {Promise} - Promise with updated submission
 */
export const updateSubmission = async (id, submissionData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, submissionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Delete a submission
 * @param {string} id - Submission ID to delete
 * @returns {Promise} - Promise with deletion confirmation
 */
export const deleteSubmission = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Get submission statistics for a specific exercise
 * @param {string} exerciseId - Exercise ID
 * @returns {Promise} - Promise with statistics data
 */
export const getExerciseStats = async (exerciseId) => {
  try {
    const response = await axios.get(`${API_URL}/stats/exercise/${exerciseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Get submission statistics for a specific student
 * @param {string} studentId - Student ID
 * @returns {Promise} - Promise with statistics data
 */
export const getStudentStats = async (studentId) => {
  try {
    const response = await axios.get(`${API_URL}/stats/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
