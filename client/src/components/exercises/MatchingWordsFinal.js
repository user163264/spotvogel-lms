import React, { useState, useEffect, useRef, useId } from 'react';
import PropTypes from 'prop-types';
import './styles.css'; // Make sure we have access to common exercise styles

/**
 * MatchingWords Exercise Component (Final version)
 * 
 * A component that implements a matching exercise where users connect items 
 * from left column to items in right column. This version resolves all state 
 * management issues and uses instance IDs to prevent conflicts.
 * 
 * @component
 */
const MatchingWordsFinal = ({ 
  exercise, 
  onAnswerChange,
  readOnly = false,
  showCorrectAnswers = false,
  studentAnswers = null,
}) => {
  // Generate a stable instance ID to prevent state conflicts
  const instanceId = useId();
  
  // Extract exercise data with fallbacks for safety
  const question = exercise?.question || 'Match the items';
  const wordBank = exercise?.word_bank || [];
  const matchOptions = exercise?.match_options || [];
  const correctAnswers = exercise?.correct_answer || {};
  
  // State for tracking the current matches made by the user
  const [matches, setMatches] = useState({});
  
  // State for tracking the currently selected item (if using click-to-select)
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Track exercise ID to detect when exercise changes
  const exerciseIdRef = useRef('');
  
  // Initialize the exercise ID on first render
  if (exerciseIdRef.current === '') {
    exerciseIdRef.current = exercise?.id || JSON.stringify(question);
  }
  
  // Track whether we need to initialize state from props
  const needsInitFromProps = useRef(true);
  
  // Track if this is the first render
  const isFirstRender = useRef(true);
  
  // Refs for items that will need direct DOM manipulation
  const leftItemsRef = useRef([]);
  const rightItemsRef = useRef([]);
  
  // Initialize state when component mounts or exercise changes
  useEffect(() => {
    // Get a unique identifier for the current exercise
    const currentExerciseId = exercise?.id || JSON.stringify(question);
    
    // Check if exercise has changed
    const exerciseChanged = exerciseIdRef.current !== currentExerciseId;
    
    // If exercise changed, reset everything
    if (exerciseChanged) {
      console.log('Exercise changed, resetting state');
      // Update exercise ID ref
      exerciseIdRef.current = currentExerciseId;
      
      // Clear selection
      setSelectedItem(null);
      
      // Clear matches (don't use studentAnswers here to avoid circular updates)
      setMatches({});
    }
    // In first mount or if just the studentAnswers changed, initialize from props
    else if (needsInitFromProps.current) {
      // Initialize matches from studentAnswers if provided
      if (studentAnswers && typeof studentAnswers === 'object') {
        setMatches({...studentAnswers});
      }
      
      // Mark as initialized
      needsInitFromProps.current = false;
    }
  }, [exercise, question, studentAnswers]);
  
  // Handle notifying parent of changes (only when matches actually change)
  useEffect(() => {
    // Skip on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Skip if in read-only mode
    if (readOnly) {
      return;
    }
    
    // Notify parent of changes
    if (onAnswerChange) {
      onAnswerChange(matches);
    }
  }, [matches, onAnswerChange, readOnly]);
  
  // Better handling for studentAnswers changes, including reset
  useEffect(() => {
    // Skip during exercise changes or initial mount
    if (needsInitFromProps.current) {
      return;
    }
    
    // If studentAnswers is provided and different from current matches
    if (studentAnswers !== undefined) {
      // Deep equality check to avoid unnecessary updates
      const currentMatchesJSON = JSON.stringify(matches);
      const studentAnswersJSON = JSON.stringify(studentAnswers);
      
      if (currentMatchesJSON !== studentAnswersJSON) {
        setMatches(studentAnswers || {});
        
        // If we're resetting (empty studentAnswers), also clear selection
        if (Object.keys(studentAnswers || {}).length === 0) {
          setSelectedItem(null);
        }
      }
    }
  }, [studentAnswers, matches]);
  
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
  
  /**
   * Checks if a right item is already matched
   * @param {string} rightItem - The right item to check
   * @returns {boolean} Whether the item is already matched
   */
  const isRightItemMatched = (rightItem) => {
    return Object.values(matches).includes(rightItem);
  };
  
  return (
    <div className="matching-words-exercise" data-instance-id={instanceId}>
      <h3 className="question-text">{question}</h3>
      
      <div className="matching-container">
        {/* Left Column (Word Bank) */}
        <div className="matching-column left-column">
          <h4>Items</h4>
          <ul className="matching-items">
            {wordBank.map((item, index) => (
              <li 
                key={`left-${index}-${exerciseIdRef.current}`}
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
                key={`right-${index}-${exerciseIdRef.current}`}
                ref={el => rightItemsRef.current[index] = el}
                className={`matching-item right-item ${isRightItemMatched(item) ? 'already-matched' : ''}`}
                onClick={() => {
                  // Only allow selection if not already matched
                  if (!isRightItemMatched(item)) {
                    handleRightItemSelect(item);
                  }
                }}
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

MatchingWordsFinal.propTypes = {
  /** The exercise object containing question, word_bank, match_options, and correct_answer */
  exercise: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

export default MatchingWordsFinal;
