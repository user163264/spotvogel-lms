import React from 'react';

/**
 * Regular expression to match blank placeholders in the format {{blank:id:answer}}
 * This captures:
 * - The blank ID in capture group 1
 * - The default answer in capture group 2
 */
const BLANK_REGEX = /\{\{blank:([^:]+):([^}]+)\}\}/g;

/**
 * Parses a passage with blank placeholders and returns an array of text nodes and blank components
 * 
 * @param {string} passage - The passage text with blanks in the format {{blank:id:answer}}
 * @param {function(string): React.ReactNode} renderBlank - Function to render a blank input component
 * @returns {React.ReactNode[]} Array of text nodes and blank components
 */
export const parsePassage = (passage, renderBlank) => {
  const result = [];
  let lastIndex = 0;
  let match;
  
  // Reset the regex state
  BLANK_REGEX.lastIndex = 0;
  
  // Find all matches of the blank pattern
  while ((match = BLANK_REGEX.exec(passage)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push(passage.substring(lastIndex, match.index));
    }
    
    // Extract blank ID and add the blank component
    const blankId = match[1];
    result.push(renderBlank(blankId));
    
    // Update the last index
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text after the last match
  if (lastIndex < passage.length) {
    result.push(passage.substring(lastIndex));
  }
  
  return result;
};

/**
 * Extracts blank IDs and default answers from a passage
 * 
 * @param {string} passage - The passage text with blanks in the format {{blank:id:answer}}
 * @returns {Object.<string, string>} Object mapping blank IDs to default answers
 */
export const extractBlanksFromPassage = (passage) => {
  const blanks = {};
  let match;
  
  // Reset the regex state
  BLANK_REGEX.lastIndex = 0;
  
  // Find all matches of the blank pattern
  while ((match = BLANK_REGEX.exec(passage)) !== null) {
    const blankId = match[1];
    const defaultAnswer = match[2];
    blanks[blankId] = defaultAnswer;
  }
  
  return blanks;
};

/**
 * Validates a user answer against the accepted answers for a blank
 * 
 * @param {string} userAnswer - The user's answer
 * @param {Object} blank - The blank item with accepted answers
 * @param {boolean} [caseSensitive=false] - Whether validation should be case-sensitive
 * @returns {boolean} Whether the answer is correct
 */
export const validateAnswer = (userAnswer, blank, caseSensitive = false) => {
  if (!userAnswer) return false;
  
  return blank.acceptedAnswers.some(acceptedAnswer => {
    if (caseSensitive) {
      return userAnswer === acceptedAnswer;
    } else {
      return userAnswer.toLowerCase() === acceptedAnswer.toLowerCase();
    }
  });
};

/**
 * Gets the overall score for a fill-in-the-blank exercise
 * 
 * @param {Array} blanks - The array of blank items
 * @param {Object} userAnswers - Object mapping blank IDs to user answers
 * @param {boolean} [caseSensitive=false] - Whether validation should be case-sensitive
 * @returns {Object} Object with the number of correct answers and total blanks
 */
export const getScore = (blanks, userAnswers, caseSensitive = false) => {
  const total = blanks.length;
  let correct = 0;
  
  blanks.forEach(blank => {
    const userAnswer = userAnswers[blank.id] || '';
    if (validateAnswer(userAnswer, blank, caseSensitive)) {
      correct++;
    }
  });
  
  return { correct, total };
};