import React from 'react';
import { BlankItem, UserAnswers } from './types';

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
 * @param passage - The passage text with blanks in the format {{blank:id:answer}}
 * @param renderBlank - Function to render a blank input component
 * @returns Array of text nodes and blank components
 */
export const parsePassage = (
  passage: string,
  renderBlank: (blankId: string) => React.ReactNode
): React.ReactNode[] => {
  const result: React.ReactNode[] = [];
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
 * @param passage - The passage text with blanks in the format {{blank:id:answer}}
 * @returns Object mapping blank IDs to default answers
 */
export const extractBlanksFromPassage = (passage: string): Record<string, string> => {
  const blanks: Record<string, string> = {};
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
 * @param userAnswer - The user's answer
 * @param blank - The blank item with accepted answers
 * @param caseSensitive - Whether validation should be case-sensitive
 * @returns Whether the answer is correct
 */
export const validateAnswer = (
  userAnswer: string,
  blank: BlankItem,
  caseSensitive: boolean = false
): boolean => {
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
 * @param blanks - The array of blank items
 * @param userAnswers - Object mapping blank IDs to user answers
 * @param caseSensitive - Whether validation should be case-sensitive
 * @returns Object with the number of correct answers and total blanks
 */
export const getScore = (
  blanks: BlankItem[],
  userAnswers: UserAnswers,
  caseSensitive: boolean = false
): { correct: number; total: number } => {
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
