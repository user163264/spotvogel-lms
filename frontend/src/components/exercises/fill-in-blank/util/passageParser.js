/**
 * Parses a passage containing blank markers in the format {{blank:id:default}}
 * and returns information about each blank
 * 
 * @param {string} passage - Text with blanks in format {{blank:id:default}}
 * @returns {Object} - Object containing the parsed blanks and processable passage
 */
export const parsePassage = (passage) => {
  if (!passage) return { segments: [], blanks: [] };
  
  // Regex to match blanks in the format {{blank:id:default}}
  const blankPattern = /\{\{blank:(\d+):[^}]*\}\}/g;
  
  // Special delimiter for processing
  const DELIMITER = "###BLANK_DELIMITER###";
  
  // Replace blanks with delimiters
  let transformedText = passage.replace(blankPattern, (match, blankId) => {
    return `${DELIMITER}${blankId}${DELIMITER}`;
  });
  
  // Split by delimiter
  const segments = transformedText.split(DELIMITER);
  
  // Extract blanks info
  const blanks = [];
  let match;
  const patternForExtraction = /\{\{blank:(\d+):([^}]*)\}\}/g;
  while ((match = patternForExtraction.exec(passage)) !== null) {
    blanks.push({
      id: match[1],
      default: match[2]
    });
  }
  
  return { segments, blanks };
};

/**
 * Generates a passage with blanks from a text and selected words
 * 
 * @param {string} text - The source text
 * @param {string[]} words - Words to replace with blanks
 * @returns {Object} - Object containing passage with blanks and blank info
 */
export const generatePassageWithBlanks = (text, words) => {
  if (!text || !words || words.length === 0) {
    return { passage: text, blanks: [] };
  }
  
  // Create a copy of the source text
  let passageWithBlanks = text;
  const blanks = [];
  
  // Replace each selected word with a blank marker
  words.forEach((word, index) => {
    const blankId = (index + 1).toString();
    // Escape special regex characters in the word
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'g');
    
    // Replace only the first occurrence to avoid ambiguity
    passageWithBlanks = passageWithBlanks.replace(regex, `{{blank:${blankId}:${word}}}`);
    
    // Add to blanks array
    blanks.push({
      id: blankId,
      acceptedAnswers: [word]
    });
  });
  
  return { passage: passageWithBlanks, blanks };
};