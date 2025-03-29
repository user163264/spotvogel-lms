/**
 * MatchingWordsOptimized Component
 * 
 * An optimized version of the matching words exercise component
 * that follows unidirectional data flow and key-based remounting.
 * 
 * Created by: Alex Ex
 * Date: March 28, 2025
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

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
 * MatchingWordsOptimized Component
 * 
 * @param {Object} props 
 * @param {Array} props.wordBank - Array of items in the left column
 * @param {Array} props.matchOptions - Array of items in the right column
 * @param {Object} props.correctAnswer - Object mapping wordBank items to matchOptions
 * @param {Object} props.studentAnswers - Current student answers
 * @param {Function} props.onAnswerChange - Callback for when answers change
 * @param {boolean} props.readOnly - Whether the exercise is read-only
 * @param {boolean} props.showAnswers - Whether to show correct answers
 * @returns {JSX.Element}
 */
const MatchingWordsOptimized = ({
  wordBank = [],
  matchOptions = [],
  correctAnswer = {},
  studentAnswers = {},
  onAnswerChange = () => {},
  readOnly = false,
  showAnswers = false
}) => {
  // Connection drawing refs
  const containerRef = useRef(null);
  const wordBankRefs = useRef({});
  const optionRefs = useRef({});
  
  // State for connections and selection
  const [connections, setConnections] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Derived state
  const isMobile = windowWidth < 768;
  
  // Log initial props
  useEffect(() => {
    debugLog('MatchingWordsOptimized - Props', {
      wordBank,
      matchOptions,
      correctAnswer,
      studentAnswers,
      readOnly,
      showAnswers
    });
  }, [wordBank, matchOptions, correctAnswer, studentAnswers, readOnly, showAnswers]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update connections when studentAnswers changes or window resizes
  useEffect(() => {
    if (!isMobile) {
      updateConnections();
    }
  }, [studentAnswers, windowWidth, isMobile, updateConnections]);
  
  /**
   * Update visual connections between matched items
   */
  const updateConnections = useCallback(() => {
    if (isMobile) {
      setConnections([]);
      return;
    }
    
    const newConnections = [];
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) {
      return;
    }
    
    Object.entries(studentAnswers).forEach(([source, target]) => {
      const sourceRef = wordBankRefs.current[source];
      const targetRef = optionRefs.current[target];
      
      if (sourceRef && targetRef) {
        const sourceRect = sourceRef.getBoundingClientRect();
        const targetRect = targetRef.getBoundingClientRect();
        
        // Calculate line coordinates relative to container
        const sourceX = sourceRect.right - containerRect.left;
        const sourceY = sourceRect.top + (sourceRect.height / 2) - containerRect.top;
        const targetX = targetRect.left - containerRect.left;
        const targetY = targetRect.top + (targetRect.height / 2) - containerRect.top;
        
        // Calculate line properties
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Determine if this is a correct match
        const isCorrect = showAnswers && correctAnswer[source] === target;
        
        newConnections.push({
          id: `${source}-${target}`,
          sourceX,
          sourceY,
          length,
          angle,
          isCorrect
        });
      }
    });
    
    setConnections(newConnections);
  }, [studentAnswers, showAnswers, correctAnswer, isMobile]);
  
  /**
   * Handle click on a word bank item
   * @param {string} item - The clicked item
   */
  const handleWordBankItemClick = useCallback((item) => {
    if (readOnly) return;
    
    // If already matched, clear the match
    if (studentAnswers[item]) {
      const newAnswers = { ...studentAnswers };
      delete newAnswers[item];
      onAnswerChange(newAnswers);
      setSelectedItem(null);
      return;
    }
    
    // If another item is selected, clear that selection
    setSelectedItem(prev => prev === item ? null : item);
  }, [readOnly, studentAnswers, onAnswerChange]);
  
  /**
   * Handle click on a match option
   * @param {string} option - The clicked option
   */
  const handleMatchOptionClick = useCallback((option) => {
    if (readOnly || !selectedItem) return;
    
    // Check if this option is already matched by another item
    const isOptionMatched = Object.values(studentAnswers).includes(option);
    
    // Skip if already matched
    if (isOptionMatched) return;
    
    // Create the match
    const newAnswers = { ...studentAnswers, [selectedItem]: option };
    onAnswerChange(newAnswers);
    setSelectedItem(null);
  }, [readOnly, selectedItem, studentAnswers, onAnswerChange]);
  
  /**
   * Check if a word bank item has a correct match
   * @param {string} item - The item to check
   * @returns {boolean}
   */
  const isCorrectMatch = useCallback((item) => {
    return showAnswers && 
           studentAnswers[item] && 
           correctAnswer[item] === studentAnswers[item];
  }, [showAnswers, studentAnswers, correctAnswer]);
  
  /**
   * Check if a word bank item has an incorrect match
   * @param {string} item - The item to check
   * @returns {boolean}
   */
  const isIncorrectMatch = useCallback((item) => {
    return showAnswers && 
           studentAnswers[item] && 
           correctAnswer[item] !== studentAnswers[item];
  }, [showAnswers, studentAnswers, correctAnswer]);
  
  /**
   * Get the match option for a word bank item (for mobile view)
   * @param {string} item - The word bank item
   * @returns {string}
   */
  const getMatchOptionForItem = useCallback((item) => {
    return studentAnswers[item] || '';
  }, [studentAnswers]);
  
  /**
   * Check if a match option is selected
   * @param {string} option - The option to check
   * @returns {boolean}
   */
  const isOptionSelected = useCallback((option) => {
    return Object.values(studentAnswers).includes(option);
  }, [studentAnswers]);
  
  /**
   * Get available options for a wordbank item (for mobile view)
   * @param {string} item - The word bank item
   * @returns {Array}
   */
  const getAvailableOptions = useCallback((item) => {
    if (readOnly) {
      const selectedOption = studentAnswers[item];
      return selectedOption ? [selectedOption] : [];
    }
    
    return matchOptions.filter(option => {
      // Include if currently selected for this item
      if (studentAnswers[item] === option) return true;
      
      // Exclude if selected by another item
      return !Object.values(studentAnswers).includes(option);
    });
  }, [matchOptions, studentAnswers, readOnly]);
  
  /**
   * Handle selection change in dropdown (mobile view)
   * @param {string} item - The word bank item
   * @param {Object} event - The change event
   */
  const handleSelectionChange = useCallback((item, event) => {
    const option = event.target.value;
    
    if (option === '') {
      // Remove match
      const newAnswers = { ...studentAnswers };
      delete newAnswers[item];
      onAnswerChange(newAnswers);
    } else {
      // Add match
      onAnswerChange({ ...studentAnswers, [item]: option });
    }
  }, [studentAnswers, onAnswerChange]);
  
  /**
   * Register a ref for a word bank item
   * @param {string} item - The word bank item
   * @param {Object} ref - The ref object
   */
  const registerWordBankRef = useCallback((item, ref) => {
    if (ref) {
      wordBankRefs.current[item] = ref;
    }
  }, []);
  
  /**
   * Register a ref for a match option
   * @param {string} option - The match option
   * @param {Object} ref - The ref object
   */
  const registerOptionRef = useCallback((option, ref) => {
    if (ref) {
      optionRefs.current[option] = ref;
    }
  }, []);
  
  return (
    <div className="matching-words-optimized" ref={containerRef}>
      <div className="matching-content">
        {/* Left column (word bank) */}
        <div className="word-bank-column">
          <h3 className="column-title">Items</h3>
          <ul className="word-bank-list">
            {wordBank.map((item, index) => (
              <li 
                key={`word-${index}`}
                ref={ref => registerWordBankRef(item, ref)}
                className={`
                  word-bank-item 
                  ${selectedItem === item ? 'selected' : ''} 
                  ${studentAnswers[item] ? 'matched' : ''} 
                  ${isCorrectMatch(item) ? 'correct' : ''} 
                  ${isIncorrectMatch(item) ? 'incorrect' : ''}
                `}
                onClick={() => handleWordBankItemClick(item)}
                data-testid={`word-bank-item-${index}`}
              >
                <span className="item-content">{item}</span>
                
                {/* Mobile view dropdown */}
                {isMobile && (
                  <div className="mobile-matching">
                    <select
                      className="mobile-dropdown"
                      value={getMatchOptionForItem(item)}
                      onChange={(event) => handleSelectionChange(item, event)}
                      disabled={readOnly}
                    >
                      <option value="">Select...</option>
                      {getAvailableOptions(item).map((option, optIndex) => (
                        <option key={`mobile-option-${optIndex}`} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Connection area - only for desktop */}
        {!isMobile && (
          <div className="connection-area">
            {connections.map(conn => (
              <div
                key={conn.id}
                className={`connection-line ${conn.isCorrect ? 'correct' : ''}`}
                style={{
                  width: `${conn.length}px`,
                  left: `${conn.sourceX}px`,
                  top: `${conn.sourceY}px`,
                  transform: `rotate(${conn.angle}deg)`,
                  transformOrigin: '0 0'
                }}
              />
            ))}
          </div>
        )}
        
        {/* Right column (match options) */}
        {!isMobile && (
          <div className="match-options-column">
            <h3 className="column-title">Matches</h3>
            <ul className="match-options-list">
              {matchOptions.map((option, index) => (
                <li 
                  key={`option-${index}`}
                  ref={ref => registerOptionRef(option, ref)}
                  className={`
                    match-option-item 
                    ${isOptionSelected(option) ? 'selected' : ''} 
                    ${selectedItem && !isOptionSelected(option) ? 'selectable' : ''}
                  `}
                  onClick={() => handleMatchOptionClick(option)}
                  data-testid={`match-option-item-${index}`}
                >
                  <span className="item-content">{option}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Debug information */}
      {DEBUG && (
        <div className="debug-info">
          <details>
            <summary>Debug Information</summary>
            <div className="debug-section">
              <h4>Selected Item:</h4>
              <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
            </div>
            <div className="debug-section">
              <h4>Student Answers:</h4>
              <pre>{JSON.stringify(studentAnswers, null, 2)}</pre>
            </div>
            <div className="debug-section">
              <h4>Correct Answer:</h4>
              <pre>{JSON.stringify(correctAnswer, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

MatchingWordsOptimized.propTypes = {
  wordBank: PropTypes.arrayOf(PropTypes.string).isRequired,
  matchOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswer: PropTypes.object.isRequired,
  studentAnswers: PropTypes.object,
  onAnswerChange: PropTypes.func,
  readOnly: PropTypes.bool,
  showAnswers: PropTypes.bool
};

export default MatchingWordsOptimized;
