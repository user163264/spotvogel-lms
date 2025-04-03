import React from 'react';
import { getScore } from './passageParser';

/**
 * Component for displaying feedback after a Fill-in-the-Blank exercise is submitted
 * 
 * @param {Object} props - The component props
 * @param {Array} props.blanks - The blanks with their feedback
 * @param {Object} props.userAnswers - The user's answers
 * @param {boolean} [props.caseSensitive=false] - Whether validation should be case-sensitive
 * @param {string} [props.explanation] - Overall explanation text
 * @returns {JSX.Element} The rendered component
 */
const FeedbackDisplay = ({
  blanks,
  userAnswers,
  caseSensitive = false,
  explanation
}) => {
  // Calculate the score
  const { correct, total } = getScore(blanks, userAnswers, caseSensitive);
  
  // Calculate the percentage
  const percentage = Math.round((correct / total) * 100);
  
  // Determine feedback message and style based on score
  let feedbackMessage;
  let feedbackStyle;
  
  if (percentage === 100) {
    feedbackMessage = "Perfect! You correctly filled in all the blanks.";
    feedbackStyle = "bg-green-50 border-green-200 text-green-800";
  } else if (percentage >= 75) {
    feedbackMessage = "Good job! You're mostly correct.";
    feedbackStyle = "bg-blue-50 border-blue-200 text-blue-800";
  } else if (percentage >= 50) {
    feedbackMessage = "You're on the right track!";
    feedbackStyle = "bg-yellow-50 border-yellow-200 text-yellow-800";
  } else {
    feedbackMessage = "Let's review this topic a bit more.";
    feedbackStyle = "bg-red-50 border-red-200 text-red-800";
  }
  
  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      {/* Score summary */}
      <div className={`p-4 mb-4 rounded-md border ${feedbackStyle}`}>
        <h3 className="text-lg font-medium">
          {feedbackMessage}
        </h3>
        
        <p className="mt-1 text-sm">
          You correctly answered {correct} out of {total} blanks ({percentage}%).
        </p>
      </div>
      
      {/* Individual blank feedback - implemented in the BlankInput component */}
      
      {/* Overall explanation */}
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