import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles.css';

/**
 * MatchingWordsOptimized Exercise Component
 * 
 * An optimized implementation with proper state management
 * following React best practices to avoid infinite render loops.
 */
const MatchingWordsOptimized = ({ 
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
  
  // Internal state - the "single source of truth" for this component
  const [internalMatches, setInternalMatches] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Ref to track the previous studentAnswers for comparison
  const prevStudentAnswersRef = useRef(null);
  
  // Initialize from studentAnswers on mount or when studentAnswers changes significantly
  useEffect(() => {
    // Only update internal state if the external state is significantly different
    // using a deep comparison to prevent update loops
    if (JSON.stringify(prevStudentAnswersRef.current) !== JSON.stringify(studentAnswers || {})) {
      setInternalMatches(studentAnswers || {});
      prevStudentAnswersRef.current = studentAnswers || {};
    }
  }, [studentAnswers]);
  
  // Memoized callback to notify parent of changes
  const notifyParent = useCallback((newMatches) => {
    if (!readOnly && onAnswerChange) {
      onAnswerChange(newMatches);
    }
  }, [onAnswerChange, readOnly]);
  
  // Handle left item selection with proper state management
  const handleLeftItemSelect = useCallback((item) => {
    if (readOnly) return;
    
    setSelectedItem(prevSelected => 
      prevSelected === item ? null : item
    );
  }, [readOnly]);
  
  // Handle right item selection with unidirectional data flow
  const handleRightItemSelect = useCallback((item) => {
    if (readOnly || !selectedItem) return;
    
    // Check if this right item is already matched
    const isAlreadyMatched = Object.values(internalMatches).includes(item);
    
    // Only allow selection if not already matched
    if (!isAlreadyMatched) {
      // Update internal matches
      const newMatches = { ...internalMatches, [selectedItem]: item };
      setInternalMatches(newMatches);
      setSelectedItem(null);
      
      // Notify parent of the change (unidirectional data flow)
      notifyParent(newMatches);
    }
  }, [readOnly, selectedItem, internalMatches, notifyParent]);
  
  // Remove a match with proper state management
  const removeMatch = useCallback((leftItem, event) => {
    if (event) event.stopPropagation();
    if (readOnly) return;
    
    const newMatches = { ...internalMatches };
    delete newMatches[leftItem];
    
    setInternalMatches(newMatches);
    // Notify parent of the change (unidirectional data flow)
    notifyParent(newMatches);
  }, [internalMatches, notifyParent, readOnly]);
  
  // Check if a match is correct
  const isMatchCorrect = useCallback((leftItem, rightItem) => {
    return correctAnswers[leftItem] === rightItem;
  }, [correctAnswers]);
  
  // Calculate score
  const calculateScore = useCallback(() => {
    let score = 0;
    Object.entries(internalMatches).forEach(([leftItem, rightItem]) => {
      if (isMatchCorrect(leftItem, rightItem)) {
        score += 1;
      }
    });
    return score;
  }, [internalMatches, isMatchCorrect]);
  
  // Get CSS class for match status
  const getMatchStatusClass = useCallback((leftItem, rightItem) => {
    if (!showCorrectAnswers) return '';
    return isMatchCorrect(leftItem, rightItem) ? 'match-correct' : 'match-incorrect';
  }, [showCorrectAnswers, isMatchCorrect]);
  
  // Check if a right item is already matched
  const isRightItemMatched = useCallback((rightItem) => {
    return Object.values(internalMatches).includes(rightItem);
  }, [internalMatches]);
  
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
                {internalMatches[item] && (
                  <div className={`match-indicator ${getMatchStatusClass(item, internalMatches[item])}`}>
                    <span className="matched-to">→ {internalMatches[item]}</span>
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

MatchingWordsOptimized.propTypes = {
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

export default MatchingWordsOptimized;
