import React, { useState } from 'react';

/**
 * Component for a Multiple Choice exercise
 * This is a simplified version just to make the ExerciseTester work
 * 
 * @param {Object} props - The component props
 * @param {Object} props.exercise - The exercise data
 * @param {Function} [props.onSubmit] - Optional callback for when the exercise is submitted
 * @returns {JSX.Element} The rendered component
 */
const MultipleChoiceExercise = ({ exercise, onSubmit }) => {
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // State for showing feedback
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Handle option selection
  const handleOptionSelect = (optionId) => {
    if (exercise.allowMultipleSelections) {
      // For multiple selection, toggle the selection
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // For single selection, replace the selection
      setSelectedOptions([optionId]);
    }
  };
  
  // Handle exercise submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show feedback
    setShowFeedback(true);
    
    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(selectedOptions);
    }
  };
  
  // Reset the exercise
  const handleReset = () => {
    setSelectedOptions([]);
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
      
      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">
          {exercise.questionText}
        </h3>
        
        <form onSubmit={handleSubmit}>
          {/* Options */}
          <div className="space-y-3 mb-6">
            {exercise.options.map(option => {
              const isSelected = selectedOptions.includes(option.id);
              const isCorrect = option.isCorrect;
              const isDisabled = showFeedback;
              
              // Calculate styling based on state
              const baseClasses = "flex items-start p-3 border rounded-md transition-colors";
              let stateClasses = isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300";
              
              if (showFeedback) {
                if (isSelected && isCorrect) {
                  stateClasses = "border-green-500 bg-green-50";
                } else if (isSelected && !isCorrect) {
                  stateClasses = "border-red-400 bg-red-50";
                } else if (!isSelected && isCorrect) {
                  stateClasses = "border-green-400 bg-green-50 opacity-70";
                }
              }
              
              return (
                <div 
                  key={option.id}
                  className={`${baseClasses} ${stateClasses}`}
                  onClick={() => !isDisabled && handleOptionSelect(option.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className={`w-5 h-5 border rounded-md flex items-center justify-center ${
                          isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                        }`}>
                          {isSelected && (
                            <span className="text-white">✓</span>
                          )}
                        </div>
                      </div>
                      <div>{option.text}</div>
                    </div>
                    
                    {/* Show feedback if available */}
                    {showFeedback && option.feedback && (
                      <div className={`mt-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {option.feedback}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Submit and Reset buttons */}
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
              Check Answer
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
      </div>
      
      {/* Explanation */}
      {showFeedback && exercise.explanation && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-slate-800 mb-2">Explanation</h3>
          <div className="p-4 bg-slate-50 rounded-md text-slate-700">
            {exercise.explanation}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceExercise;