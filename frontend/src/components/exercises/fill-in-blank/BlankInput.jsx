import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for a single blank input field
 */
const BlankInput = ({ 
  id, 
  value, 
  onChange, 
  showFeedback, 
  isCorrect, 
  disabled, 
  correctAnswer 
}) => {
  return (
    <span className="inline-block">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(id, e.target.value)}
        disabled={disabled || showFeedback}
        className={`px-2 py-1 mx-1 border-b-2 min-w-[80px] text-center focus:outline-none ${
          showFeedback 
            ? isCorrect 
              ? 'border-green-500 bg-green-50' 
              : 'border-red-300 bg-red-50'
            : 'border-blue-500 focus:border-blue-700 bg-blue-50'
        }`}
        placeholder="..."
      />
      {showFeedback && !isCorrect && correctAnswer && (
        <span className="text-xs text-green-600 ml-1">
          ({correctAnswer})
        </span>
      )}
    </span>
  );
};

BlankInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  showFeedback: PropTypes.bool,
  isCorrect: PropTypes.bool,
  disabled: PropTypes.bool,
  correctAnswer: PropTypes.string
};

export default BlankInput;