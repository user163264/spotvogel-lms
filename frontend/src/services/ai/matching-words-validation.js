/**
 * Matching Words Exercise Validation
 * 
 * This file contains utilities for validating matching words exercises
 * to ensure they are correctly formatted for the optimized MatchingWords component.
 * 
 * Created by: Alex Ex
 * Date: March 28, 2025
 */

/**
 * Validates a matching words exercise structure
 * @param {Object} exerciseData - The exercise data to validate
 * @returns {Object} Validation result with success flag and any errors
 */
export function validateMatchingExercise(exerciseData) {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  try {
    // Check if exerciseData is an object
    if (!exerciseData || typeof exerciseData !== 'object' || Array.isArray(exerciseData)) {
      result.isValid = false;
      result.errors.push('Exercise data must be an object');
      return result;
    }
    
    // Schema validation - required fields
    const requiredFields = ['word_bank', 'match_options', 'correct_answer'];
    const missingFields = requiredFields.filter(field => !exerciseData.hasOwnProperty(field));
    
    if (missingFields.length > 0) {
      result.isValid = false;
      result.errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Type checking
    if (exerciseData.word_bank && !Array.isArray(exerciseData.word_bank)) {
      result.isValid = false;
      result.errors.push('word_bank must be an array');
    }
    
    if (exerciseData.match_options && !Array.isArray(exerciseData.match_options)) {
      result.isValid = false;
      result.errors.push('match_options must be an array');
    }
    
    if (exerciseData.correct_answer && (typeof exerciseData.correct_answer !== 'object' || 
        exerciseData.correct_answer === null || 
        Array.isArray(exerciseData.correct_answer))) {
      result.isValid = false;
      result.errors.push('correct_answer must be an object');
    }
    
    // If critical types are invalid, return early
    if (!result.isValid) {
      return result;
    }
    
    // Check if arrays are empty
    if (exerciseData.word_bank.length === 0) {
      result.isValid = false;
      result.errors.push('word_bank cannot be empty');
    }
    
    if (exerciseData.match_options.length === 0) {
      result.isValid = false;
      result.errors.push('match_options cannot be empty');
    }
    
    // Check array lengths match
    if (exerciseData.word_bank.length !== exerciseData.match_options.length) {
      result.warnings.push(`word_bank (${exerciseData.word_bank.length} items) and match_options (${exerciseData.match_options.length} items) should have the same length`);
    }
    
    // Check for empty or non-string items in arrays
    const nonStringWordBank = exerciseData.word_bank.some(item => typeof item !== 'string' || item.trim() === '');
    if (nonStringWordBank) {
      result.isValid = false;
      result.errors.push('All items in word_bank must be non-empty strings');
    }
    
    const nonStringMatchOptions = exerciseData.match_options.some(item => typeof item !== 'string' || item.trim() === '');
    if (nonStringMatchOptions) {
      result.isValid = false;
      result.errors.push('All items in match_options must be non-empty strings');
    }
    
    // Check for duplicates in arrays
    const wordBankSet = new Set(exerciseData.word_bank);
    if (wordBankSet.size !== exerciseData.word_bank.length) {
      result.isValid = false;
      result.errors.push('word_bank contains duplicate items');
    }
    
    const matchOptionsSet = new Set(exerciseData.match_options);
    if (matchOptionsSet.size !== exerciseData.match_options.length) {
      result.isValid = false;
      result.errors.push('match_options contains duplicate items');
    }
    
    // Relationship validation
    const correctAnswer = exerciseData.correct_answer;
    const correctAnswerItems = Object.keys(correctAnswer);
    
    // Check if all items in word_bank have entries in correct_answer
    const missingMappings = exerciseData.word_bank.filter(item => !correctAnswer.hasOwnProperty(item));
    if (missingMappings.length > 0) {
      result.isValid = false;
      result.errors.push(`The following items in word_bank do not have matches in correct_answer: ${missingMappings.join(', ')}`);
    }
    
    // Check if all keys in correct_answer exist in word_bank
    const invalidKeys = correctAnswerItems.filter(item => !exerciseData.word_bank.includes(item));
    if (invalidKeys.length > 0) {
      result.isValid = false;
      result.errors.push(`The following keys in correct_answer do not exist in word_bank: ${invalidKeys.join(', ')}`);
    }
    
    // Check if all values in correct_answer exist in match_options
    const invalidValues = Object.values(correctAnswer).filter(item => !exerciseData.match_options.includes(item));
    if (invalidValues.length > 0) {
      result.isValid = false;
      result.errors.push(`The following values in correct_answer do not exist in match_options: ${invalidValues.join(', ')}`);
    }
    
    // Check for multi-mapping (multiple word_bank items mapping to the same match_option)
    const valueOccurrences = {};
    for (const value of Object.values(correctAnswer)) {
      valueOccurrences[value] = (valueOccurrences[value] || 0) + 1;
    }
    
    const duplicateMappings = Object.entries(valueOccurrences)
      .filter(([_, count]) => count > 1)
      .map(([value]) => value);
    
    if (duplicateMappings.length > 0) {
      result.warnings.push(`The following items in match_options are used multiple times in correct_answer: ${duplicateMappings.join(', ')}`);
    }
    
    // Check max_score if present
    if (exerciseData.hasOwnProperty('max_score')) {
      if (typeof exerciseData.max_score !== 'number' || exerciseData.max_score <= 0) {
        result.warnings.push('max_score should be a positive number');
      } else if (exerciseData.max_score !== exerciseData.word_bank.length) {
        result.warnings.push(`max_score (${exerciseData.max_score}) should match the number of items in word_bank (${exerciseData.word_bank.length})`);
      }
    } else {
      result.warnings.push('max_score is missing, will default to number of items');
    }
    
    return result;
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Validation error: ${error.message}`);
    return result;
  }
}

/**
 * Attempts to automatically correct common issues in matching exercises
 * @param {Object} exerciseData - The exercise data to correct
 * @returns {Object|null} Corrected exercise data or null if correction failed
 */
export function attemptAutoCorrection(exerciseData) {
  try {
    // Handle missing exercise data object
    if (!exerciseData || typeof exerciseData !== 'object' || Array.isArray(exerciseData)) {
      return null;
    }
    
    // Create a deep copy to avoid mutating the original
    const corrected = JSON.parse(JSON.stringify(exerciseData));
    
    // Initialize missing required properties
    if (!corrected.hasOwnProperty('word_bank')) {
      corrected.word_bank = [];
    } else if (!Array.isArray(corrected.word_bank)) {
      if (typeof corrected.word_bank === 'string') {
        // Try to convert string to array (might be a JSON string)
        try {
          const parsed = JSON.parse(corrected.word_bank);
          corrected.word_bank = Array.isArray(parsed) ? parsed : [corrected.word_bank];
        } catch {
          corrected.word_bank = [corrected.word_bank];
        }
      } else {
        // Convert to array with the original value as the only element
        corrected.word_bank = [String(corrected.word_bank)];
      }
    }
    
    if (!corrected.hasOwnProperty('match_options')) {
      corrected.match_options = [];
    } else if (!Array.isArray(corrected.match_options)) {
      if (typeof corrected.match_options === 'string') {
        // Try to convert string to array (might be a JSON string)
        try {
          const parsed = JSON.parse(corrected.match_options);
          corrected.match_options = Array.isArray(parsed) ? parsed : [corrected.match_options];
        } catch {
          corrected.match_options = [corrected.match_options];
        }
      } else {
        // Convert to array with the original value as the only element
        corrected.match_options = [String(corrected.match_options)];
      }
    }
    
    if (!corrected.hasOwnProperty('correct_answer')) {
      corrected.correct_answer = {};
    } else if (typeof corrected.correct_answer !== 'object' || corrected.correct_answer === null || Array.isArray(corrected.correct_answer)) {
      // Try to convert to an object if possible
      if (Array.isArray(corrected.correct_answer) && corrected.correct_answer.length > 0 && Array.isArray(corrected.correct_answer[0])) {
        // Might be an array of pairs like [[leftItem, rightItem], ...]
        const tempObj = {};
        corrected.correct_answer.forEach(pair => {
          if (Array.isArray(pair) && pair.length >= 2) {
            tempObj[String(pair[0])] = String(pair[1]);
          }
        });
        corrected.correct_answer = tempObj;
      } else {
        // Can't auto-correct this format
        corrected.correct_answer = {};
      }
    }
    
    // Filter out non-string items and empty strings
    corrected.word_bank = corrected.word_bank
      .map(item => String(item).trim())
      .filter(item => item !== '');
    
    corrected.match_options = corrected.match_options
      .map(item => String(item).trim())
      .filter(item => item !== '');
    
    // Remove duplicates
    corrected.word_bank = [...new Set(corrected.word_bank)];
    corrected.match_options = [...new Set(corrected.match_options)];
    
    // Ensure correct_answer only contains valid items
    const validCorrectAnswer = {};
    for (const [key, value] of Object.entries(corrected.correct_answer)) {
      if (corrected.word_bank.includes(key) && corrected.match_options.includes(value)) {
        validCorrectAnswer[key] = value;
      }
    }
    corrected.correct_answer = validCorrectAnswer;
    
    // Generate missing correct_answer mappings if possible
    const unmappedWordBank = corrected.word_bank.filter(item => !validCorrectAnswer.hasOwnProperty(item));
    const usedMatchOptions = Object.values(validCorrectAnswer);
    const availableMatchOptions = corrected.match_options.filter(item => !usedMatchOptions.includes(item));
    
    // Create mappings for unmapped items if possible
    for (let i = 0; i < Math.min(unmappedWordBank.length, availableMatchOptions.length); i++) {
      corrected.correct_answer[unmappedWordBank[i]] = availableMatchOptions[i];
    }
    
    // If there are still unmapped items and no available match options, add new match options
    if (unmappedWordBank.length > availableMatchOptions.length) {
      for (let i = availableMatchOptions.length; i < unmappedWordBank.length; i++) {
        const placeholder = `Match for ${unmappedWordBank[i]}`;
        corrected.match_options.push(placeholder);
        corrected.correct_answer[unmappedWordBank[i]] = placeholder;
      }
    }
    
    // Update max_score if present
    if (corrected.hasOwnProperty('max_score') && 
        (typeof corrected.max_score !== 'number' || corrected.max_score <= 0 || 
         corrected.max_score !== corrected.word_bank.length)) {
      corrected.max_score = corrected.word_bank.length;
    }
    
    // Verify the exercise after correction
    const validation = validateMatchingExercise(corrected);
    return validation.isValid ? corrected : null;
  } catch (error) {
    console.error('Auto-correction failed:', error);
    return null;
  }
}

/**
 * Normalizes exercise data format, converting from legacy format if necessary
 * @param {Object} exerciseData - The exercise data to normalize
 * @returns {Object} Normalized exercise data in the correct format
 */
export function normalizeExerciseData(exerciseData) {
  // Return if already in the correct format
  if (exerciseData.word_bank && exerciseData.match_options && exerciseData.correct_answer) {
    return exerciseData;
  }
  
  // Check if it's in legacy format
  if (exerciseData.leftItems && exerciseData.rightItems) {
    return convertLegacyFormat(exerciseData);
  }
  
  // Try to auto-correct the data
  const corrected = attemptAutoCorrection(exerciseData);
  
  // If auto-correction failed, return a minimal valid structure
  if (!corrected) {
    return {
      exercise_type: "matching_words",
      question: exerciseData.question || "Match the items from the left column to the right column.",
      word_bank: ["Item 1", "Item 2", "Item 3"],
      match_options: ["Option A", "Option B", "Option C"],
      correct_answer: {
        "Item 1": "Option A",
        "Item 2": "Option B",
        "Item 3": "Option C"
      },
      max_score: 3,
      grading_type: "auto"
    };
  }
  
  return corrected;
}

/**
 * Converts from legacy format to new format
 * @param {Object} legacyData - The legacy format exercise data
 * @returns {Object} Exercise data in the new format
 */
export function convertLegacyFormat(legacyData) {
  // Extract data from legacy format
  const wordBank = legacyData.leftItems || [];
  const matchOptions = legacyData.rightItems || [];
  const correctAnswer = {};
  
  // Convert index-based matches to key-value pairs
  if (Array.isArray(legacyData.matches)) {
    for (const [leftIndex, rightIndex] of legacyData.matches) {
      if (wordBank[leftIndex] && matchOptions[rightIndex]) {
        correctAnswer[wordBank[leftIndex]] = matchOptions[rightIndex];
      }
    }
  }
  
  // If no valid matches were found, create default mappings
  if (Object.keys(correctAnswer).length === 0) {
    for (let i = 0; i < Math.min(wordBank.length, matchOptions.length); i++) {
      correctAnswer[wordBank[i]] = matchOptions[i];
    }
  }
  
  return {
    exercise_type: "matching_words",
    question: legacyData.question || "Match the items from the left column to the right column.",
    word_bank: wordBank,
    match_options: matchOptions,
    correct_answer: correctAnswer,
    max_score: wordBank.length,
    grading_type: "auto"
  };
}
