import React from 'react';

/**
 * Component for displaying a question with optional instructions
 * This is a reusable component that can be used across different exercise types
 * 
 * @component
 * @param {Object} props
 * @param {string} props.questionText - The main question text
 * @param {string} [props.instructions] - Optional instruction text
 */
const QuestionDisplay = ({ questionText, instructions }) => {
  return (
    <div className="mb-6">
      {/* 
        AI-INTEGRATION-POINT: questionText 
        This div renders the main question text.
        It supports HTML/rich text formatting.
      */}
      <div 
        className="text-lg font-medium text-slate-800 mb-2"
        // Using dangerouslySetInnerHTML to support HTML formatting
        // This will be properly sanitized in the actual implementation
        dangerouslySetInnerHTML={{ __html: questionText }}
      />
      
      {/* 
        AI-INTEGRATION-POINT: instructions
        Optional instructions text that provides additional context or guidance
      */}
      {instructions && (
        <div className="text-sm text-slate-600 italic">
          {instructions}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
