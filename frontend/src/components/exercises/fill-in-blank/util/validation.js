/**
 * Checks if a user answer is correct based on accepted answers
 * 
 * @param {string} userAnswer - The user's answer
 * @param {string[]} acceptedAnswers - Array of acceptable answers
 * @param {boolean} caseSensitive - Whether to consider case
 * @returns {boolean} - True if answer is correct
 */
export const isAnswerCorrect = (userAnswer, acceptedAnswers, caseSensitive = false) => {
  if (!userAnswer || !acceptedAnswers || acceptedAnswers.length === 0) {
    return false;
  }
  
  return acceptedAnswers.some(acceptedAnswer => 
    caseSensitive
      ? userAnswer === acceptedAnswer
      : userAnswer.toLowerCase() === acceptedAnswer.toLowerCase()
  );
};

/**
 * Calculates the score for a fill-in-the-blank exercise
 * 
 * @param {Object} answers - Map of blankId to user answer
 * @param {Array} blanks - Array of blank objects with acceptedAnswers
 * @param {boolean} caseSensitive - Whether to consider case
 * @returns {Object} - Score information
 */
export const calculateScore = (answers, blanks, caseSensitive = false) => {
  if (!answers || !blanks) {
    return { correct: 0, total: 0, percentage: 0 };
  }
  
  let correctCount = 0;
  const total = blanks.length;
  
  blanks.forEach(blank => {
    const userAnswer = answers[blank.id] || '';
    if (isAnswerCorrect(userAnswer, blank.acceptedAnswers, caseSensitive)) {
      correctCount++;
    }
  });
  
  return {
    correct: correctCount,
    total,
    percentage: total > 0 ? (correctCount / total) * 100 : 0
  };
};