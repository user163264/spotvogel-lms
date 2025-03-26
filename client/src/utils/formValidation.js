/**
 * Form validation utility functions
 */

/**
 * Validates if a string is a valid email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a password meets minimum requirements
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 6)
 * @param {boolean} options.requireUppercase - Require uppercase letter (default: false)
 * @param {boolean} options.requireLowercase - Require lowercase letter (default: false)
 * @param {boolean} options.requireNumber - Require number (default: false)
 * @param {boolean} options.requireSpecialChar - Require special character (default: false)
 * @returns {Object} - { valid: boolean, message: string }
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecialChar = false
  } = options;
  
  // Check minimum length
  if (!password || password.length < minLength) {
    return {
      valid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }
  
  // Check for uppercase letter
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  // Check for lowercase letter
  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  // Check for number
  if (requireNumber && !/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  // Check for special character
  if (requireSpecialChar && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character'
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validates if a field is not empty
 * @param {string} value - Field value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} - { valid: boolean, message: string }
 */
export const isNotEmpty = (value, fieldName = 'Field') => {
  if (!value || value.trim() === '') {
    return {
      valid: false,
      message: `${fieldName} is required`
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validates if a number is within a range
 * @param {number} value - Number to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value (optional)
 * @param {number} options.max - Maximum value (optional)
 * @param {string} options.fieldName - Name of the field for error message
 * @returns {Object} - { valid: boolean, message: string }
 */
export const isInRange = (value, options = {}) => {
  const { min, max, fieldName = 'Value' } = options;
  
  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    return {
      valid: false,
      message: `${fieldName} must be a number`
    };
  }
  
  if (min !== undefined && numValue < min) {
    return {
      valid: false,
      message: `${fieldName} must be at least ${min}`
    };
  }
  
  if (max !== undefined && numValue > max) {
    return {
      valid: false,
      message: `${fieldName} must be at most ${max}`
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validates if a date is valid and within a range
 * @param {string|Date} value - Date to validate
 * @param {Object} options - Validation options
 * @param {Date} options.min - Minimum date (optional)
 * @param {Date} options.max - Maximum date (optional)
 * @param {string} options.fieldName - Name of the field for error message
 * @returns {Object} - { valid: boolean, message: string }
 */
export const isValidDate = (value, options = {}) => {
  const { min, max, fieldName = 'Date' } = options;
  
  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    return {
      valid: false,
      message: `${fieldName} is not a valid date`
    };
  }
  
  if (min && date < new Date(min)) {
    return {
      valid: false,
      message: `${fieldName} must be after ${new Date(min).toLocaleDateString()}`
    };
  }
  
  if (max && date > new Date(max)) {
    return {
      valid: false,
      message: `${fieldName} must be before ${new Date(max).toLocaleDateString()}`
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validates exercise details for the exercise creation form
 * @param {Object} exercise - Exercise object to validate
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateExerciseDetails = (exercise) => {
  const errors = {};
  
  // Validate title
  if (!exercise.title || exercise.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (exercise.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  
  // Validate description
  if (!exercise.description || exercise.description.trim() === '') {
    errors.description = 'Description is required';
  }
  
  // Validate subject
  if (!exercise.subject) {
    errors.subject = 'Subject is required';
  }
  
  // Validate grade
  if (!exercise.grade) {
    errors.grade = 'Grade is required';
  }
  
  // Validate time limit
  if (!exercise.timeLimit) {
    errors.timeLimit = 'Time limit is required';
  } else if (exercise.timeLimit < 1) {
    errors.timeLimit = 'Time limit must be at least 1 minute';
  } else if (exercise.timeLimit > 180) {
    errors.timeLimit = 'Time limit must be less than 3 hours';
  }
  
  // Validate difficulty level
  if (!exercise.difficultyLevel) {
    errors.difficultyLevel = 'Difficulty level is required';
  }
  
  return errors;
};
