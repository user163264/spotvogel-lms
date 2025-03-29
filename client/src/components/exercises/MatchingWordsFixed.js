import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './styles.css'; // Make sure we have access to common exercise styles

/**
 * MatchingWords Exercise Component (Fixed version)
 * 
 * A component that implements a matching exercise where users connect items 
 * from left column to items in right column. This version fixes the circular 
 * dependency issue with studentAnswers and internal state.
 * 
 * @component
 */
const MatchingWordsFixed = ({ 
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
  
  // State for tracking the current matches made by the user
  const [matches, setMatches] = useState({});
  
  // State for tracking the currently selected item (if using click-to-select)
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Ref to track if this is the initial mount
  const isInitialMount = useRef(true);
  
  // Refs for items that will need direct DOM manipulation for advanced interactions
  const leftItemsRef = useRef([]);
  const rightItemsRef = useRef([]);
  
  // Track previous studentAnswers to avoid unnecessary updates
  const prevStudentAnswersRef = useRef(null);
  
  // Initialize matches based on studentAnswers, but only on mount or when studentAnswers changes significantly
  useEffect(() => {
    // Skip if studentAnswers is null or undefined
    if (!studentAnswers) {
      if (isInitialMount.current) {
        // On initial mount, initialize to empty if no studentAnswers
        setMatches({});
        isInitialMount.current = false;
      }
      return;
    }
    
    // Skip if studentAnswers hasn't changed meaningfully
    if (
      prevStudentAnswersRef.current && 
      JSON.stringify(prevStudentAnswersRef.current) === JSON.stringify(studentAnswers)
    ) {
      return;
    }
    
    // Update matches with studentAnswers
    setMatches(studentAnswers);
    prevStudentAnswersRef.current = {...studentAnswers};
    
    // Mark initial mount as done
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [studentAnswers]);
  
  // Notify parent component when answers change, but avoid the circular dependency
  useEffect(() => {
    // Skip on initial mount to avoid unnecessary callbacks
    if (isInitialMount.current) {
      return;
    }
    
    // Skip if in read-only mode
    if (readOnly) {
      return;
    }
    
    // Skip if matches === studentAnswers (reference equality)
    if (matches === studentAnswers) {
      return;
    }
    
    // Skip if deep equality between matches and studentAnswers
    if (
      studentAnswers && 
      JSON.stringify(matches) === JSON.stringify(studentAnswers)
    ) {
      return; 
    }
    
    // Only now do we call onAnswerChange
    if (onAnswerChange) {
      onAnswerChange(matches);
    }
  }, [matches, onAnswerChange, readOnly, studentAnswers]);
  
  /**
   * Handles selection of an item from the left column (word bank)
   * @param {string} item - The selected word/item
   */
  const handleLeftItemSelect = (item) => {
    if (readOnly) return;
    
    if (selectedItem === null) {
      // No item selected, so select this one
      setSelectedItem(item);
    } else if (selectedItem === item) {
      // Same item selected, so deselect it
      setSelectedItem(null);
    } else {
      // Different item already selected, shouldn't happen for left items
      setSelectedItem(item);
    }
  };
  
  /**
   * Handles selection of an item from the right column (match options)
   * @param {string} item - The selected option
   */
  const handleRightItemSelect = (item) => {
    if (readOnly) return;
    
    if (selectedItem === null) {
      // No item selected from left column, do nothing
      return;
    }
    
    // Create the match between selected left item and this right item
    setMatches(prev => ({
      ...prev,
      [selectedItem]: item
    }));
    
    // Clear the selection
    setSelectedItem(null);
  };
  
  /**
   * Removes a specific match
   * @param {string} leftItem - The left item to unmatch
   */
  const removeMatch = (leftItem) => {
    if (readOnly) return;
    
    setMatches(prev => {
      const newMatches = { ...prev };
      delete newMatches[leftItem];
      return newMatches;
    });
  };
  
  /**
   * Calculates if a specific match is correct
   * @param {string} leftItem - The left item
   * @param {string} rightItem - The right item it's matched to
   * @returns {boolean} Whether the match is correct
   */
  const isMatchCorrect = (leftItem, rightItem) => {
    return correctAnswers[leftItem] === rightItem;
  };
  
  /**
   * Calculates the score based on current matches
   * @returns {number} The score (1 point per correct match)
   */
  const calculateScore = () => {
    let score = 0;
    Object.entries(matches).forEach(([leftItem, rightItem]) => {
      if (isMatchCorrect(leftItem, rightItem)) {
        score += 1;
      }
    });
    return score;
  };
  
  /**
   * Gets a CSS class based on match status
   * @param {string} leftItem - The left item
   * @param {string} rightItem - The right item
   * @returns {string} The CSS class name
   */
  const getMatchStatusClass = (leftItem, rightItem) => {
    if (!showCorrectAnswers) return '';
    
    return isMatchCorrect(leftItem, rightItem) 
      ? 'match-correct' 
      : 'match-incorrect';
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
                ref={el => leftItemsRef.current[index] = el}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMatch(item);
                        }}
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
                ref={el => rightItemsRef.current[index] = el}
                className="matching-item right-item"
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

MatchingWordsFixed.propTypes = {
  /** The exercise object containing question, word_bank, match_options, and correct_answer */
  exercise: PropTypes.shape({
    question: PropTypes.string,
    word_bank: PropTypes.arrayOf(PropTypes.string),
    match_options: PropTypes.arrayOf(PropTypes.string),
    correct_answer: PropTypes.object
  }).isRequired,
  
  /** Callback function when answers change */
  onAnswerChange: PropTypes.func,
  
  /** Whether the exercise is in read-only mode */
  readOnly: PropTypes.bool,
  
  /** Whether to show correct/incorrect answers */
  showCorrectAnswers: PropTypes.bool,
  
  /** Pre-filled student answers (for viewing/editing previous attempts) */
  studentAnswers: PropTypes.object
};

export default MatchingWordsFixed;
