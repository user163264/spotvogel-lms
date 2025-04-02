/**
 * MatchingWordsOptimized Component (Tailwind Version)
 * 
 * An optimized version of the matching words exercise component
 * that follows unidirectional data flow and key-based remounting.
 * Styled with Tailwind CSS.
 * 
 * Original by: Alex Ex
 * Tailwind Migration by: Finny Frontend
 * Date: March 31, 2025
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

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
    <div className="relative w-full my-4 p-4 rounded-lg bg-gray-50 shadow-sm" ref={containerRef}>
      <div className="flex relative min-h-[300px] md:flex-row flex-col">
        {/* Left column (word bank) */}
        <div className="flex-1 relative mx-4">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4 text-center">Items</h3>
          <ul className="list-none p-0 m-0">
            {wordBank.map((item, index) => (
              <li 
                key={`word-${index}`}
                ref={ref => registerWordBankRef(item, ref)}
                className={`
                  relative p-3 mb-3 bg-white rounded-md border-2 
                  cursor-pointer transition-all duration-200 
                  flex items-center justify-between text-base shadow-sm 
                  hover:border-blue-200 hover:bg-blue-50
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${selectedItem === item ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} 
                  ${studentAnswers[item] ? 'border-green-500 bg-green-50' : ''} 
                  ${isCorrectMatch(item) ? 'border-green-500 bg-green-50' : ''} 
                  ${isIncorrectMatch(item) ? 'border-red-500 bg-red-50' : ''}
                  ${isMobile ? 'flex-col items-start' : ''}
                `}
                onClick={() => handleWordBankItemClick(item)}
                data-testid={`word-bank-item-${index}`}
              >
                <span className={`${isMobile ? 'mb-2' : ''}`}>{item}</span>
                
                {/* Mobile view dropdown */}
                {isMobile && (
                  <div className="w-full mt-2">
                    <select
                      className="w-full p-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
            {connections.map(conn => (
              <div
                key={conn.id}
                className={`absolute h-0.5 transform-gpu origin-top-left ${conn.isCorrect ? 'bg-green-500' : 'bg-blue-500'}`}
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
          <div className="flex-1 relative mx-4">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 text-center">Matches</h3>
            <ul className="list-none p-0 m-0">
              {matchOptions.map((option, index) => (
                <li 
                  key={`option-${index}`}
                  ref={ref => registerOptionRef(option, ref)}
                  className={`
                    relative p-3 mb-3 bg-white rounded-md border-2
                    cursor-pointer transition-all duration-200 
                    flex items-center justify-between text-base shadow-sm
                    hover:border-blue-200 hover:bg-blue-50
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${isOptionSelected(option) ? 'border-green-500 bg-green-50' : 'border-gray-200'} 
                    ${selectedItem && !isOptionSelected(option) ? 'border-blue-500 bg-blue-50 animate-pulse' : ''}
                  `}
                  onClick={() => handleMatchOptionClick(option)}
                  data-testid={`match-option-item-${index}`}
                >
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Debug information */}
      {DEBUG && (
        <div className="mt-6 p-4 border-t border-dashed border-gray-300 font-mono text-sm">
          <details>
            <summary className="cursor-pointer">Debug Information</summary>
            <div className="mt-4">
              <h4 className="my-2 text-gray-600">Selected Item:</h4>
              <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
            </div>
            <div className="mt-4">
              <h4 className="my-2 text-gray-600">Student Answers:</h4>
              <pre>{JSON.stringify(studentAnswers, null, 2)}</pre>
            </div>
            <div className="mt-4">
              <h4 className="my-2 text-gray-600">Correct Answer:</h4>
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
