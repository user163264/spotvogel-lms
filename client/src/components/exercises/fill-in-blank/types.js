/**
 * Type definitions for Fill-in-the-Blank exercise components
 * These interfaces define the structure of data that will be used
 * for rendering Fill-in-the-Blank exercises
 */

/**
 * Represents a single blank in a fill-in-the-blank exercise
 * @typedef {Object} BlankItem
 * @property {string} id - Unique identifier for the blank
 * @property {string[]} acceptedAnswers - The correct answer(s) for this blank
 * @property {string} [hint] - Optional hint for this blank
 * @property {string} [feedback] - Optional specific feedback for this blank
 */

/**
 * Represents a Fill-in-the-Blank exercise
 * @typedef {Object} FillInBlankExercise
 * @property {string} id - Unique identifier for the exercise
 * @property {string} instructions - Instructions for the exercise
 * @property {string} passage - Text passage with blanks marked using {{blank:id:answer}}
 * @property {BlankItem[]} blanks - Array of blank spaces to fill in
 * @property {string} [explanation] - Optional explanation shown after submission
 * @property {boolean} [caseSensitive] - Whether to show case-sensitive validation (default: false)
 */

/**
 * User answers map - maps blank IDs to user input values
 * @typedef {Object.<string, string>} UserAnswers
 */

// Export type names for documentation purposes
export const types = {
  BlankItem: 'BlankItem',
  FillInBlankExercise: 'FillInBlankExercise',
  UserAnswers: 'UserAnswers'
};
