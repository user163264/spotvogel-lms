import React from 'react';
import { FeedbackDisplayProps } from './types';

/**
 * Component for displaying feedback after a Multiple Choice exercise is submitted
 * 
 * @component
 */
const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  options,
  selectedOptionIds,
  explanation
}) => {
  // Calculate the score
  const correctOptionIds = options
    .filter(option => option.isCorrect)
    .map(option => option.id);
    
  const correctSelections = selectedOptionIds.filter(id => 
    correctOptionIds.includes(id)
  ).length;
  
  const incorrectSelections = selectedOptionIds.filter(id => 
    !correctOptionIds.includes(id)
  ).length;
  
  const missedCorrectAnswers = correctOptionIds.filter(id => 
    !selectedOptionIds.includes(id)
  ).length;
  
  // Perfect score if user selected all correct options and no incorrect ones
  const isPerfectScore = correctSelections === correctOptionIds.length && incorrectSelections === 0;
  
  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      {/* Score summary */}
      <div className={`p-4 mb-4 rounded-md ${
        isPerfectScore 
          ? "bg-green-50 border border-green-200" 
          : "bg-yellow-50 border border-yellow-200"
      }`}>
        <h3 className={`text-lg font-medium ${
          isPerfectScore ? "text-green-800" : "text-yellow-800"
        }`}>
          {isPerfectScore 
            ? "Excellent work!" 
            : "Almost there!"}
        </h3>
        
        <p className="mt-1 text-sm">
          {isPerfectScore 
            ? "You correctly answered all questions!" 
            : `You selected ${correctSelections} out of ${correctOptionIds.length} correct answers.`}
            
          {incorrectSelections > 0 && 
            ` You also selected ${incorrectSelections} incorrect option${incorrectSelections > 1 ? 's' : ''}.`}
            
          {missedCorrectAnswers > 0 && 
            ` You missed ${missedCorrectAnswers} correct option${missedCorrectAnswers > 1 ? 's' : ''}.`}
        </p>
      </div>
      
      {/* 
        AI-INTEGRATION-POINT: explanation
        Overall explanation text provided by Alex's AI system
      */}
      {explanation && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-slate-800 mb-2">Explanation</h3>
          <div className="p-4 bg-slate-50 rounded-md text-slate-700">
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;
