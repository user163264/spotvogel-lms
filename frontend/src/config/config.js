/**
 * Configuration settings for the LMS application
 * 
 * This file contains all the configuration variables used across the application.
 * By centralizing these values, we make it easier to adjust them for different
 * environments (development, testing, production).
 * 
 * Created by: Alex Ex (AI Exercise Generation Specialist)
 * Date: March 29, 2025
 */

// Base URL for API requests - adjust based on environment
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Storage key for the authentication token
export const TOKEN_STORAGE_KEY = 'lms_auth_token';

// Default timeout for API requests (in milliseconds)
export const API_TIMEOUT = 30000;

// Feature flags
export const FEATURES = {
  AI_EXERCISE_GENERATION: true,
  AUTO_GRADING: true,
  DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === 'true'
};

// Exercise types
export const EXERCISE_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  MATCHING_WORDS: 'matching_words',
  FILL_IN_BLANK: 'fill_in_blank',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer'
};

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'nl', label: 'Dutch' },
  { value: 'fr', label: 'French' }
];

// Default configuration object (for backward compatibility)
const config = {
  API_BASE_URL,
  TOKEN_STORAGE_KEY,
  API_TIMEOUT,
  FEATURES,
  EXERCISE_TYPES,
  DIFFICULTY_LEVELS,
  SUPPORTED_LANGUAGES
};

export default config;
