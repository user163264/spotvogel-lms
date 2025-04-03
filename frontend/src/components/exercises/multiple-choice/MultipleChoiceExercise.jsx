import React, { useState } from 'react';
import QuestionDisplay from './QuestionDisplay';
import OptionsList from './OptionsList';
import FeedbackDisplay from './FeedbackDisplay';

/**
 * Main component for Multiple Choice exercises
 * This component orchestrates the various subcomponents and manages state
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.exercise - The exercise data
 * @param {Function} [props.onSubmit] - Optional callback for when the exercise is submitted
 * @param {boolean} [props.showFeedback] - Whether to show the correct answers and feedback
 */
const MultipleChoiceExercise = ({
  exercise,
  onSubmit,
  showFeedback: initialShowFeedback = false
}) => {
  // State for tracking selected options
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);
  
  // State for tracking whether to show feedback
  const [showFeedback, setShowFeedback] = useState(initialShowFeedback);
  
  // Handler for when an option is selected
  const handleOptionSelect = (optionId) => {
    if (exercise.allowMultipleSelections) {
      // For multiple selection (checkboxes)
      setSelectedOptionIds(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId) // Remove if already selected
          : [...prev, optionId] // Add if not already selected
      );
    } else {
      // For single selection (radio buttons)
      setSelectedOptionIds([optionId]);
    }
  };
  
  // Handler for submitting the exercise
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedOptionIds);
    }
    setShowFeedback(true);
  };
  
  // Handler for resetting the exercise
  const handleReset = () => {
    setSelectedOptionIds([]);
    setShowFeedback(false);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* 
        Display the question and instructions
        AI-INTEGRATION-POINT: questionText and instructions
      */}
      <QuestionDisplay
        questionText={exercise.questionText}
        instructions={exercise.instructions}
      />
      
      {/* 
        Display the options list
        AI-INTEGRATION-POINT: options array
      */}
      <OptionsList
        options={exercise.options}
        allowMultipleSelections={exercise.allowMultipleSelections}
        selectedOptionIds={selectedOptionIds}
        onOptionSelect={handleOptionSelect}
        showFeedback={showFeedback}
      />
      
      {/* Action buttons */}
      <div className="flex justify-between mt-6">
        {!showFeedback ? (
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              disabled={selectedOptionIds.length === 0}
              className={`px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                selectedOptionIds.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Submit Answer
            </button>
            
            {selectedOptionIds.length > 0 && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Selection
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        )}
      </div>
      
      {/* 
        Display feedback if exercise has been submitted
        AI-INTEGRATION-POINT: explanation and option-specific feedback
      */}
      {showFeedback && (
        <FeedbackDisplay
          options={exercise.options}
          selectedOptionIds={selectedOptionIds}
          explanation={exercise.explanation}
        />
      )}
    </div>
  );
};

export default MultipleChoiceExercise;
