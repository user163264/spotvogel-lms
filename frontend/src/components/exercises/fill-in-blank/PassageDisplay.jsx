import React from 'react';
import PropTypes from 'prop-types';
import BlankInput from './BlankInput';
import { isAnswerCorrect } from './util/validation';
import { parsePassage } from './util/passageParser';

/**
 * Component for displaying a passage with blanks
 */
const PassageDisplay = ({ 
  passage, 
  blanks, 
  answers, 
  onAnswerChange, 
  showFeedback, 
  caseSensitive 
}) => {
  // If there's no passage, show a message
  if (!passage) {
    return <p className="text-slate-500">No passage text available</p>;
  }
  
  // Parse the passage
  const { segments } = parsePassage(passage);
  
  // Build the components array
  const parts = [];
  let isBlankId = false;
  
  segments.forEach((part, index) => {
    if (part === "") {
      return; // Skip empty parts
    }
    
    if (isBlankId) {
      // This part is a blank ID
      const blankId = part;
      const blank = blanks.find(b => b.id === blankId);
      
      if (!blank) {
        // If blank not found, just render the part
        parts.push(<span key={`error-${index}`}>[Error: Blank {blankId} not found]</span>);
      } else {
        const userAnswer = answers[blankId] || '';
        const isCorrect = isAnswerCorrect(
          userAnswer, 
          blank.acceptedAnswers, 
          caseSensitive
        );
        
        parts.push(
          <BlankInput
            key={`blank-${index}`}
            id={blankId}
            value={userAnswer}
            onChange={onAnswerChange}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            correctAnswer={blank.acceptedAnswers[0]}
          />
        );
      }
    } else {
      // This part is regular text
      parts.push(
        <span key={`text-${index}`}>{part}</span>
      );
    }
    
    // Toggle for next part
    isBlankId = !isBlankId;
  });
  
  return <div className="text-lg leading-relaxed">{parts}</div>;
};

PassageDisplay.propTypes = {
  passage: PropTypes.string.isRequired,
  blanks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      acceptedAnswers: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired,
  answers: PropTypes.object.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  showFeedback: PropTypes.bool,
  caseSensitive: PropTypes.bool
};

export default PassageDisplay;