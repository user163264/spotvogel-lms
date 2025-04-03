import React, { useState } from 'react';
import { BlankInputProps } from './types';
import { validateAnswer } from './passageParser';

/**
 * Component for a single blank input in a Fill-in-the-Blank exercise
 * 
 * @component
 */
const BlankInput: React.FC<BlankInputProps> = ({
  blank,
  value,
  onChange,
  showFeedback,
  caseSensitive = false,
  showHint = false
}) => {
  // State for tracking whether to show the hint
  const [isHintVisible, setIsHintVisible] = useState<boolean>(showHint);
  
  // Check if the answer is correct
  const isCorrect = validateAnswer(value, blank, caseSensitive);
  
  // Get the first accepted answer (for showing the correct answer)
  const correctAnswer = blank.acceptedAnswers[0] || '';
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(blank.id, e.target.value);
  };
  
  // Handle showing/hiding the hint
  const toggleHint = () => {
    setIsHintVisible(prev => !prev);
  };
  
  // Determine the appropriate styling based on the state
  const getInputClasses = (): string => {
    const baseClasses = "px-2 py-1 mx-1 border-b-2 text-center min-w-[80px] focus:outline-none";
    
    if (showFeedback) {
      return isCorrect
        ? `${baseClasses} border-green-500 bg-green-50 text-green-800`
        : `${baseClasses} border-red-300 bg-red-50 text-red-800`;
    }
    
    return `${baseClasses} border-blue-500 focus:border-blue-700 bg-blue-50`;
  };
  
  return (
    <span className="inline-flex flex-col items-center">
      {showFeedback ? (
        <span className={getInputClasses()}>
          {value || '—'}
          {!isCorrect && (
            <span className="ml-1 text-xs text-green-600">
              ({correctAnswer})
            </span>
          )}
        </span>
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={getInputClasses()}
          placeholder="..."
          aria-label={`Fill in blank ${blank.id}`}
        />
      )}
      
      {/* Hint button and display */}
      {blank.hint && !showFeedback && (
        <div className="relative">
          <button 
            type="button"
            onClick={toggleHint}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1 focus:outline-none focus:underline"
          >
            {isHintVisible ? 'Hide hint' : 'Show hint'}
          </button>
          
          {isHintVisible && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs text-gray-700 w-48 z-10">
              {blank.hint}
            </div>
          )}
        </div>
      )}
      
      {/* Feedback display */}
      {showFeedback && blank.feedback && (
        <div className={`text-xs mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {blank.feedback}
        </div>
      )}
    </span>
  );
};

export default BlankInput;