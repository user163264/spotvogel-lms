import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

/**
 * MatchingWords Exercise Component (Simple version)
 * 
 * A completely rewritten version with simplified state management
 * to avoid the glitches in the more complex implementations.
 */
const MatchingWordsSimple = ({ 
  exercise, 
  onAnswerChange,
  readOnly = false,
  showCorrectAnswers = false,
  studentAnswers = null,
}) => {
  // Extract exercise data with fallbacks for safety
  const question = exercise?.question || 'Match the items';
  const wordBank = exercise?.word_bank || [];
  const matchOptions = exercise?.match_options || [];
  const correctAnswers = exercise?.correct_answer || {};
  
  // Internal state
  const [matches, setMatches] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Initialize from studentAnswers or use empty object
  useEffect(() => {
    setMatches(studentAnswers || {});
  }, [studentAnswers]);
  
  // Notify parent of changes
  useEffect(() => {
    if (!readOnly && onAnswerChange) {
      onAnswerChange(matches);
    }
  }, [matches, onAnswerChange, readOnly]);
  
  // Handle left item selection
  const handleLeftItemSelect = (item) => {
    if (readOnly) return;
    
    if (selectedItem === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };
  
  // Handle right item selection
  const handleRightItemSelect = (item) => {
    if (readOnly || !selectedItem) return;
    
    // Check if this right item is already matched
    const isAlreadyMatched = Object.values(matches).includes(item);
    
    // Only allow selection if not already matched
    if (!isAlreadyMatched) {
      // Update matches
      const newMatches = { ...matches, [selectedItem]: item };
      setMatches(newMatches);
      setSelectedItem(null);
    }
  };
  
  // Remove a match
  const removeMatch = (leftItem, event) => {
    if (event) event.stopPropagation();
    if (readOnly) return;
    
    const newMatches = { ...matches };
    delete newMatches[leftItem];
    setMatches(newMatches);
  };
  
  // Check if a match is correct
  const isMatchCorrect = (leftItem, rightItem) => {
    return correctAnswers[leftItem] === rightItem;
  };
  
  // Calculate score
  const calculateScore = () => {
    let score = 0;
    Object.entries(matches).forEach(([leftItem, rightItem]) => {
      if (isMatchCorrect(leftItem, rightItem)) {
        score += 1;
      }
    });
    return score;
  };
  
  // Get CSS class for match status
  const getMatchStatusClass = (leftItem, rightItem) => {
    if (!showCorrectAnswers) return '';
    return isMatchCorrect(leftItem, rightItem) ? 'match-correct' : 'match-incorrect';
  };
  
  // Check if a right item is already matched
  const isRightItemMatched = (rightItem) => {
    return Object.values(matches).includes(rightItem);
  };
  
  return (
    <div className="matching-words-exercise">
      <h3 className="question-text">{question}</h3>
      
      <div className="matching-container">
        {/* Left Column (Word Bank) */}
        <div className="matching-column left-column">
          <h4>Items</h4>
          <ul className="matching-items">
            {wordBank.map((item, index) => (
              <li 
                key={`left-${index}`}
                className={`matching-item left-item ${selectedItem === item ? 'selected' : ''}`}
                onClick={() => handleLeftItemSelect(item)}
              >
                {item}
                {matches[item] && (
                  <div className={`match-indicator ${getMatchStatusClass(item, matches[item])}`}>
                    <span className="matched-to">→ {matches[item]}</span>
                    {!readOnly && (
                      <button 
                        className="remove-match-btn"
                        onClick={(e) => removeMatch(item, e)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right Column (Match Options) */}
        <div className="matching-column right-column">
          <h4>Options</h4>
          <ul className="matching-items">
            {matchOptions.map((item, index) => (
              <li 
                key={`right-${index}`}
                className={`matching-item right-item ${isRightItemMatched(item) ? 'already-matched' : ''}`}
                onClick={() => handleRightItemSelect(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {showCorrectAnswers && (
        <div className="score-display">
          <p>Score: {calculateScore()} / {wordBank.length}</p>
        </div>
      )}
      
      {/* Accessibility instructions */}
      <div className="matching-instructions" aria-live="polite">
        <p>
          {selectedItem 
            ? `"${selectedItem}" selected. Now click an option from the right column to match.` 
            : 'Click an item from the left column to start matching.'}
        </p>
      </div>
    </div>
  );
};

MatchingWordsSimple.propTypes = {
  exercise: PropTypes.shape({
    question: PropTypes.string,
    word_bank: PropTypes.arrayOf(PropTypes.string),
    match_options: PropTypes.arrayOf(PropTypes.string),
    correct_answer: PropTypes.object
  }).isRequired,
  onAnswerChange: PropTypes.func,
  readOnly: PropTypes.bool,
  showCorrectAnswers: PropTypes.bool,
  studentAnswers: PropTypes.object
};

export default MatchingWordsSimple;
