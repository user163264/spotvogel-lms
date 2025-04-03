import React from 'react';
import { QuestionDisplayProps } from './types';

/**
 * Component for displaying a question with optional instructions
 * This is a reusable component that can be used across different exercise types
 * 
 * @component
 */
const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  questionText, 
  instructions 
}) => {
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
