/**
 * Type definitions for Multiple Choice exercise components
 * These interfaces define the structure of data that will be used
 * for rendering Multiple Choice exercises
 * 
 * Note: This is a JavaScript version of our TypeScript definitions
 * for compatibility with the current project.
 */

/**
 * @typedef {Object} MultipleChoiceOption
 * @property {string} id - Unique identifier for the option
 * @property {string} text - Display text for this option
 * @property {boolean} isCorrect - Whether this option is part of the correct answer
 * @property {string} [feedback] - Optional feedback specific to this option
 */

/**
 * @typedef {Object} MultipleChoiceExercise
 * @property {string} id - Unique identifier for the exercise
 * @property {string} questionText - The main question text displayed to the user
 * @property {string} [instructions] - Optional supplementary instruction text
 * @property {MultipleChoiceOption[]} options - Array of possible answers
 * @property {boolean} allowMultipleSelections - Whether multiple selections are allowed (checkbox vs radio)
 * @property {string} [explanation] - Optional explanation shown after submission
 */

// Export these types as an empty object since we're in JavaScript
// This lets us reference the file for documentation but doesn't
// actually provide type checking since we're not using TypeScript
export default {};
