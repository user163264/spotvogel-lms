/**
 * Application configuration
 */

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

// Auth Configuration
export const TOKEN_STORAGE_KEY = 'token';
export const AUTH_HEADER_PREFIX = 'Bearer';

// i18n Configuration - Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'nl', name: 'Dutch' },
  { code: 'fr', name: 'French' }
];

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;

// Exercise types
export const EXERCISE_TYPES = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'fill-in-blanks', label: 'Fill in the Blanks' },
  { value: 'matching', label: 'Matching' },
  { value: 'short-answer', label: 'Short Answer' },
  { value: 'comprehension', label: 'Comprehension' },
  { value: 'open-ended', label: 'Open Ended' }
];

// Common grade levels
export const GRADE_LEVELS = [
  { value: 'primary-lower', label: 'Primary (Lower)' },
  { value: 'primary-upper', label: 'Primary (Upper)' },
  { value: 'secondary-lower', label: 'Secondary (Lower)' },
  { value: 'secondary-upper', label: 'Secondary (Upper)' },
  { value: 'higher-education', label: 'Higher Education' }
];

// Common subject areas
export const SUBJECTS = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'sciences', label: 'Sciences' },
  { value: 'languages', label: 'Languages' },
  { value: 'social-studies', label: 'Social Studies' },
  { value: 'arts', label: 'Arts' },
  { value: 'physical-education', label: 'Physical Education' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' }
];
