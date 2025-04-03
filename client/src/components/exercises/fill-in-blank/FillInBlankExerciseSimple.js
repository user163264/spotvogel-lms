import React, { useState } from 'react';

/**
 * A simplified Fill-in-the-Blank exercise component for testing
 * 
 * @param {Object} props
 * @param {Object} props.exercise - The exercise data
 * @returns {JSX.Element}
 */
const FillInBlankExerciseSimple = ({ exercise }) => {
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  
  if (!exercise) {
    return <div>No exercise data provided</div>;
  }
  
  console.log("Fill-in-Blank Exercise data:", exercise);
  
  // Log the regex match attempts for debugging
  if (exercise.passage) {
    const testRegex = /\{\{blank:([^:]+):([^}]+)\}\}/g;
    const testMatches = [...exercise.passage.matchAll(testRegex)];
    console.log("Regex matches found:", testMatches.length, testMatches);
  }
  
  // If there's no passage or blanks, show a helpful message
  if (!exercise.passage || !exercise.blanks || exercise.blanks.length === 0) {
    return (
      <div className="p-6 border rounded-md shadow-sm bg-white">
        <h3 className="text-lg font-medium mb-4">Fill in the Blank Exercise</h3>
        <div className="text-red-500">Missing required data: {!exercise.passage ? 'passage, ' : ''}{!exercise.blanks || exercise.blanks.length === 0 ? 'blanks' : ''}</div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify(exercise, null, 2)}
        </pre>
      </div>
    );
  }
  
  // Simple function to process the passage
  const processPassage = () => {
    const passageText = exercise.passage;
    
    if (!passageText) {
      return <p>No passage text available</p>;
    }
    
    // More robust approach: Split the text by a unique delimiter and replace blanks
    // with input elements
    
    // First, replace all blanks with a special delimiter
    const DELIMITER = "###BLANK_DELIMITER###";
    const blankPattern = /\{\{blank:(\d+):[^}]*\}\}/g;
    
    // Transform the passage replacing {{blank:id:default}} with delimiters
    let transformedText = passageText.replace(blankPattern, (match, blankId) => {
      return `${DELIMITER}${blankId}${DELIMITER}`;
    });
    
    // Split by delimiter
    const textParts = transformedText.split(DELIMITER);
    
    // Build the components array
    const parts = [];
    let isBlankId = false;
    
    textParts.forEach((part, index) => {
      if (part === "") {
        return; // Skip empty parts
      }
      
      if (isBlankId) {
        // This part is a blank ID
        const blankId = part;
        const isCorrect = showFeedback && isAnswerCorrect(blankId, answers[blankId] || '');
        
        parts.push(
          <span key={`blank-${index}`} className="inline-block">
            <input
              type="text"
              value={answers[blankId] || ''}
              onChange={(e) => handleAnswerChange(blankId, e.target.value)}
              disabled={showFeedback}
              className={`mx-1 px-2 py-1 border-b-2 ${
                showFeedback 
                  ? isCorrect 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-blue-400 focus:outline-none focus:border-blue-600 bg-blue-50'
              }`}
            />
            {showFeedback && !isCorrect && (
              <span className="text-xs text-green-600 ml-1">
                ({getCorrectAnswer(blankId)})
              </span>
            )}
          </span>
        );
      } else {
        // This part is regular text
        parts.push(
          <span key={`text-${index}`}>{part}</span>
        );
      }
      
      // Toggle for next part
      isBlankId = !isBlankId;
    });
    
    return parts;
  };
  
  const handleAnswerChange = (blankId, value) => {
    setAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
  };
  
  const isAnswerCorrect = (blankId, answer) => {
    const blank = exercise.blanks.find(b => b.id === blankId);
    if (!blank) return false;
    
    return blank.acceptedAnswers.some(acceptedAnswer => 
      exercise.caseSensitive
        ? answer === acceptedAnswer
        : answer.toLowerCase() === acceptedAnswer.toLowerCase()
    );
  };
  
  const getCorrectAnswer = (blankId) => {
    const blank = exercise.blanks.find(b => b.id === blankId);
    return blank?.acceptedAnswers[0] || '';
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowFeedback(true);
  };
  
  const handleReset = () => {
    setAnswers({});
    setShowFeedback(false);
  };
  
  return (
    <div className="p-6 border rounded-md shadow-sm bg-white">
      <h3 className="text-lg font-medium mb-4">Fill in the Blank Exercise</h3>
      
      {exercise.instructions && (
        <div className="mb-4 italic text-slate-600">
          {exercise.instructions}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 text-lg">
          {processPassage()}
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={showFeedback}
            className={`px-4 py-2 rounded ${
              showFeedback
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Check Answers
          </button>
          
          {showFeedback && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Try Again
            </button>
          )}
        </div>
      </form>
      
      {showFeedback && exercise.explanation && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="font-medium mb-2">Explanation</h4>
          <p className="text-gray-700">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default FillInBlankExerciseSimple;