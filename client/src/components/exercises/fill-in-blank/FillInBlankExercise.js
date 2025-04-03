import React, { useState, useCallback } from 'react';
import PassageDisplay from './PassageDisplay';
import BlankInput from './BlankInput';
import FeedbackDisplay from './FeedbackDisplay';
import { parsePassage } from './passageParser';

/**
 * Component for a Fill-in-the-Blank exercise
 * 
 * @param {Object} props - The component props
 * @param {Object} props.exercise - The exercise data
 * @param {Function} [props.onSubmit] - Optional callback for when the exercise is submitted
 * @returns {JSX.Element} The rendered component
 */
const FillInBlankExercise = ({
  exercise,
  onSubmit
}) => {
  // State for user's answers
  const [userAnswers, setUserAnswers] = useState({});
  
  // State for showing feedback
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Update a specific answer
  const handleAnswerChange = useCallback((blankId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
  }, []);
  
  // Handle exercise submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show feedback
    setShowFeedback(true);
    
    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(userAnswers);
    }
  };
  
  // Process the passage to replace blanks with input fields
  const processedPassage = parsePassage(
    exercise.passage,
    (blankId) => {
      const blank = exercise.blanks.find(b => b.id === blankId);
      if (!blank) return null;
      
      return (
        <BlankInput
          key={blankId}
          blank={blank}
          value={userAnswers[blankId] || ''}
          onChange={handleAnswerChange}
          showFeedback={showFeedback}
          caseSensitive={exercise.caseSensitive}
        />
      );
    }
  );
  
  // Reset the exercise
  const handleReset = () => {
    setUserAnswers({});
    setShowFeedback(false);
  };
  
  return (
    <div className="p-6">
      {/* Instructions */}
      {exercise.instructions && (
        <div className="mb-4 text-slate-600 italic">
          {exercise.instructions}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Passage with blanks */}
        <div className="mb-6">
          <PassageDisplay processedPassage={processedPassage} />
        </div>
        
        {/* Submit button */}
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={showFeedback}
            className={`px-4 py-2 rounded-md ${
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
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Try Again
            </button>
          )}
        </div>
      </form>
      
      {/* Feedback section */}
      {showFeedback && (
        <FeedbackDisplay
          blanks={exercise.blanks}
          userAnswers={userAnswers}
          caseSensitive={exercise.caseSensitive}
          explanation={exercise.explanation}
        />
      )}
    </div>
  );
};

export default FillInBlankExercise;