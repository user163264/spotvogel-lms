/**
 * Matching Exercise Component
 * Renders a matching exercise where students connect items from two lists
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './MatchingExercise.css';

// Debug mode - controlled via environment variable
const DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';

/**
 * Logs debug information if debug mode is enabled
 * @param {string} label - Log label
 * @param {any} data - Data to log
 */
const debugLog = (label, data) => {
  if (DEBUG) {
    console.group(`🔍 ${label}`);
    if (data !== undefined) {
      if (typeof data === 'object') {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(data);
      }
    }
    console.groupEnd();
  }
};

/**
 * MatchingExercise Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const MatchingExercise = ({ 
  exercise, 
  onSubmit, 
  readOnly = false,
  studentAnswers = null,
  showCorrectAnswers = false,
  feedbackData = null
}) => {
  // Component mount reference for cleanup
  const isMounted = useRef(true);
  const connectionArea = useRef(null);
  
  // Exercise data destructuring with defaults
  const {
    exercise_id = 0,
    question = 'Match the items on the left with their corresponding items on the right.',
    word_bank = [],
    match_options = [],
    correct_answer = {},
    max_score = word_bank.length
  } = exercise || {};
  
  // State for student selections
  const [selections, setSelections] = useState({});
  const [connectionLines, setConnectionLines] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Track dimensions for connection lines
  const [wordBankRects, setWordBankRects] = useState({});
  const [optionRects, setOptionRects] = useState({});
  
  // Debug log props and state on mount
  useEffect(() => {
    debugLog('MatchingExercise - Props', { 
      exercise_id, 
      question, 
      word_bank, 
      match_options,
      readOnly,
      studentAnswers,
      showCorrectAnswers
    });
    
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Initialize student answers if provided
  useEffect(() => {
    if (studentAnswers && Object.keys(studentAnswers).length > 0) {
      debugLog('Initializing with student answers', studentAnswers);
      setSelections(studentAnswers);
      setSubmitted(true);
    }
  }, [studentAnswers]);
  
  // Initialize feedback if provided
  useEffect(() => {
    if (feedbackData) {
      debugLog('Initializing with feedback', feedbackData);
      setFeedback(feedbackData);
    }
  }, [feedbackData]);
  
  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < 768;
      setIsSmallScreen(smallScreen);
      
      // Redraw connections on resize, but not for small screens
      if (!smallScreen) {
        updateAllConnectionRects();
        drawConnectionLines();
      } else {
        setConnectionLines([]);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update connection lines when selections change
  useEffect(() => {
    if (!isSmallScreen) {
      updateAllConnectionRects();
      drawConnectionLines();
    }
  }, [selections, isSmallScreen]);
  
  /**
   * Update the DOM rect information for all elements
   */
  const updateAllConnectionRects = () => {
    if (isSmallScreen) return;
    
    const wordBankElements = document.querySelectorAll('.word-bank-item');
    const optionElements = document.querySelectorAll('.match-option-item');
    const containerRect = connectionArea.current?.getBoundingClientRect() || { left: 0, top: 0 };
    
    const newWordBankRects = {};
    const newOptionRects = {};
    
    wordBankElements.forEach(element => {
      const content = element.getAttribute('data-content');
      const rect = element.getBoundingClientRect();
      newWordBankRects[content] = {
        left: rect.right - containerRect.left,
        top: rect.top - containerRect.top + rect.height / 2
      };
    });
    
    optionElements.forEach(element => {
      const content = element.getAttribute('data-content');
      const rect = element.getBoundingClientRect();
      newOptionRects[content] = {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top + rect.height / 2
      };
    });
    
    debugLog('Updated element rects', { wordBankRects: newWordBankRects, optionRects: newOptionRects });
    
    setWordBankRects(newWordBankRects);
    setOptionRects(newOptionRects);
  };
  
  /**
   * Draw connection lines between matched items
   */
  const drawConnectionLines = () => {
    if (isSmallScreen) return;
    
    const newConnectionLines = [];
    
    Object.keys(selections).forEach(source => {
      const target = selections[source];
      
      if (target && wordBankRects[source] && optionRects[target]) {
        const sourcePoint = wordBankRects[source];
        const targetPoint = optionRects[target];
        
        // Calculate line dimensions
        const dx = targetPoint.left - sourcePoint.left;
        const dy = targetPoint.top - sourcePoint.top;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Determine if this is a correct match
        const isCorrect = showCorrectAnswers && 
                           correct_answer && 
                           correct_answer[source] === target;
        
        newConnectionLines.push({
          id: `${source}-${target}`,
          left: sourcePoint.left,
          top: sourcePoint.top,
          length,
          angle,
          isCorrect
        });
      }
    });
    
    debugLog('Connection lines', newConnectionLines);
    setConnectionLines(newConnectionLines);
  };
  
  /**
   * Handle dropdown selection change
   * @param {string} source - The source item
   * @param {Event} event - The change event
   */
  const handleSelectionChange = (source, event) => {
    const target = event.target.value;
    
    debugLog('Selection changed', { source, target });
    
    // Update selections
    setSelections(prev => {
      const newSelections = { ...prev };
      
      // Remove previous selection for this source
      if (target === '') {
        delete newSelections[source];
      } else {
        newSelections[source] = target;
      }
      
      return newSelections;
    });
  };
  
  /**
   * Handle exercise submission
   */
  const handleSubmit = () => {
    debugLog('Exercise submitted', selections);
    
    // Validate all items are matched
    if (Object.keys(selections).length < word_bank.length) {
      alert('Please match all items before submitting.');
      return;
    }
    
    setSubmitted(true);
    
    // Calculate score based on correct answers
    const correctItems = [];
    const incorrectItems = [];
    
    word_bank.forEach(item => {
      const selectedMatch = selections[item];
      const correctMatch = correct_answer[item];
      
      if (selectedMatch === correctMatch) {
        correctItems.push(item);
      } else {
        incorrectItems.push({
          item,
          selectedMatch,
          correctMatch
        });
      }
    });
    
    const score = correctItems.length;
    const feedbackData = {
      score,
      maxScore: max_score,
      percentageScore: (score / max_score) * 100,
      correctMatches: correctItems.map(item => ({
        item,
        match: correct_answer[item]
      })),
      incorrectMatches: incorrectItems.map(item => ({
        item: item.item,
        yourAnswer: item.selectedMatch,
        correctAnswer: item.correctMatch
      }))
    };
    
    debugLog('Calculated feedback', feedbackData);
    
    setFeedback(feedbackData);
    
    // Call onSubmit callback if provided
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit({
        exerciseId: exercise_id,
        answers: selections,
        score,
        maxScore: max_score
      });
    }
  };
  
  /**
   * Reset the exercise
   */
  const handleReset = () => {
    debugLog('Exercise reset');
    setSelections({});
    setSubmitted(false);
    setFeedback(null);
  };
  
  /**
   * Determine if an item is correctly matched
   * @param {string} item - The item to check
   * @returns {boolean} True if correctly matched
   */
  const isCorrectMatch = (item) => {
    if (!showCorrectAnswers || !submitted) return false;
    return selections[item] === correct_answer[item];
  };
  
  /**
   * Check if any selection uses this option
   * @param {string} option - The option to check
   * @returns {boolean} True if this option is selected
   */
  const isOptionSelected = (option) => {
    return Object.values(selections).includes(option);
  };
  
  /**
   * Filter available options for a dropdown
   * @param {string} source - The source item
   * @returns {string[]} - The available options
   */
  const getAvailableOptions = (source) => {
    // In read-only or submitted state, only include the selected option
    if (readOnly || submitted) {
      const selectedOption = selections[source];
      return selectedOption ? [selectedOption] : [];
    }
    
    // Otherwise, include all options that aren't already selected, except by this source
    return match_options.filter(option => {
      // If this option is already selected by this source, include it
      if (selections[source] === option) return true;
      
      // Otherwise, only include it if it's not selected by any other source
      return !Object.values(selections).includes(option);
    });
  };
  
  // If there's no exercise data, show a message
  if (!exercise || !word_bank.length || !match_options.length) {
    return <div className="error-message">No exercise data available.</div>;
  }
  
  return (
    <div className="matching-exercise-container">
      {/* Exercise header */}
      <div className="exercise-header">
        <h3 className="exercise-question">{question}</h3>
        <div className="exercise-instructions">
          Match the items from the left column with their corresponding items in the right column.
        </div>
        <div className="exercise-score">{max_score} points</div>
      </div>
      
      {/* Matching interface */}
      <div className="matching-container">
        {/* Left column (word bank) */}
        <ul className="word-bank-list">
          {word_bank.map((item, index) => (
            <li 
              key={`word-${index}`} 
              className={`word-bank-item ${isCorrectMatch(item) ? 'correct' : ''} 
                         ${submitted && !isCorrectMatch(item) ? 'incorrect' : ''}`}
              data-content={item}
            >
              <span className="item-text">{item}</span>
              <div className="matching-selection">
                <select 
                  className="match-dropdown"
                  value={selections[item] || ''}
                  onChange={(e) => handleSelectionChange(item, e)}
                  disabled={readOnly || submitted}
                >
                  <option value="">Select a match...</option>
                  {getAvailableOptions(item).map((option, optIndex) => (
                    <option key={`option-${optIndex}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
        
        {/* Visual connection area */}
        <div className="connection-area" ref={connectionArea}>
          {/* Connection lines are drawn here */}
          {connectionLines.map(line => (
            <div
              key={line.id}
              className={`connection-line ${line.isCorrect ? 'correct' : ''}`}
              style={{
                width: `${line.length}px`,
                left: `${line.left}px`,
                top: `${line.top}px`,
                transform: `rotate(${line.angle}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Right column (match options) */}
        <ul className="match-options-list">
          {match_options.map((option, index) => (
            <li 
              key={`match-${index}`} 
              className={`match-option-item ${isOptionSelected(option) ? 'selected' : ''}`}
              data-content={option}
            >
              <span className="item-text">{option}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Feedback area (shown after submission) */}
      {feedback && (
        <div className="exercise-feedback">
          <div className="feedback-message">
            You scored {feedback.score} out of {feedback.maxScore} ({feedback.percentageScore.toFixed(0)}%).
          </div>
          
          {showCorrectAnswers && (
            <div className="feedback-details">
              {feedback.correctMatches.length > 0 && (
                <div className="correct-matches">
                  <h4>Correct Matches:</h4>
                  <ul>
                    {feedback.correctMatches.map((match, i) => (
                      <li key={`correct-${i}`}>
                        ✓ {match.item} → {match.match}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {feedback.incorrectMatches.length > 0 && (
                <div className="incorrect-matches">
                  <h4>Incorrect Matches:</h4>
                  <ul>
                    {feedback.incorrectMatches.map((match, i) => (
                      <li key={`incorrect-${i}`}>
                        ✗ {match.item} → {match.yourAnswer} (should be {match.correctAnswer})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Action buttons */}
      {!readOnly && (
        <div className="exercise-actions">
          {!submitted ? (
            <>
              <button className="btn btn-reset" onClick={handleReset}>
                Reset
              </button>
              <button 
                className="btn btn-submit" 
                onClick={handleSubmit}
                disabled={Object.keys(selections).length < word_bank.length}
              >
                Submit
              </button>
            </>
          ) : (
            <button className="btn btn-reset" onClick={handleReset}>
              Try Again
            </button>
          )}
        </div>
      )}
      
      {/* Debug information */}
      {DEBUG && (
        <div className="debug-info">
          <h4>Debug Info</h4>
          <details>
            <summary>Selections</summary>
            <pre>{JSON.stringify(selections, null, 2)}</pre>
          </details>
          <details>
            <summary>Correct Answers</summary>
            <pre>{JSON.stringify(correct_answer, null, 2)}</pre>
          </details>
          <details>
            <summary>Feedback</summary>
            <pre>{JSON.stringify(feedback, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

MatchingExercise.propTypes = {
  exercise: PropTypes.shape({
    exercise_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    question: PropTypes.string,
    word_bank: PropTypes.arrayOf(PropTypes.string).isRequired,
    match_options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correct_answer: PropTypes.object,
    max_score: PropTypes.number
  }).isRequired,
  onSubmit: PropTypes.func,
  readOnly: PropTypes.bool,
  studentAnswers: PropTypes.object,
  showCorrectAnswers: PropTypes.bool,
  feedbackData: PropTypes.object
};

export default MatchingExercise;
