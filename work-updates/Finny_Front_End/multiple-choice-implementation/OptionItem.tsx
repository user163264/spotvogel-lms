import React from 'react';
import { OptionItemProps } from './types';

/**
 * Component for displaying a single option in a Multiple Choice exercise
 * 
 * @component
 */
const OptionItem: React.FC<OptionItemProps> = ({
  option,
  isSelected,
  isMultipleSelect,
  onSelect,
  showFeedback
}) => {
  // Determine the appropriate styling based on the state
  const getContainerClasses = (): string => {
    const baseClasses = "flex items-start p-4 mb-3 rounded-md border transition-colors";
    
    // If showing feedback, determine styling based on correctness
    if (showFeedback) {
      if (option.isCorrect) {
        return `${baseClasses} border-green-500 bg-green-50`;
      } else if (isSelected && !option.isCorrect) {
        return `${baseClasses} border-red-300 bg-red-50`;
      }
      return `${baseClasses} border-gray-200 bg-white`;
    }
    
    // If not showing feedback, style based on selection state
    if (isSelected) {
      return `${baseClasses} border-blue-500 bg-blue-50`;
    }
    
    // Default state
    return `${baseClasses} border-gray-200 hover:border-blue-300 bg-white`;
  };

  return (
    <div 
      className={getContainerClasses()}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-checked={isSelected}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect();
        }
      }}
    >
      {/* Radio button or checkbox */}
      <div className="mt-0.5 mr-3">
        <input
          type={isMultipleSelect ? "checkbox" : "radio"}
          checked={isSelected}
          onChange={onSelect}
          className={isMultipleSelect ? "h-5 w-5 text-blue-600" : "h-4 w-4 text-blue-600"}
          readOnly={showFeedback}
          disabled={showFeedback}
        />
      </div>
      
      <div className="flex-1">
        {/* 
          AI-INTEGRATION-POINT: option.text
          The main text content for this option
        */}
        <div className="text-base text-slate-800">{option.text}</div>
        
        {/* 
          AI-INTEGRATION-POINT: option.feedback
          Display feedback if we're showing feedback state and this option has feedback
        */}
        {showFeedback && option.feedback && (
          <div className="mt-1 text-sm text-slate-600">
            {option.feedback}
          </div>
        )}
      </div>
      
      {/* Show correct/incorrect icon when in feedback state */}
      {showFeedback && (
        <div className="ml-2">
          {option.isCorrect ? (
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            isSelected && (
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default OptionItem;
