/**
 * Matching Exercise Component
 * Renders a matching exercise where students connect items from two lists
 * Migrated to Tailwind CSS
 * 
 * By Finny Frontend
 * April 1, 2025
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// CSS import removed during Tailwind migration

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
    return <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">No exercise data available.</div>;
  }
  
  return (
    <div className="w-full my-6 bg-white rounded-lg shadow-sm">
      {/* Exercise header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{question}</h3>
        <div className="text-sm text-gray-600 mb-2">
          Match the items from the left column with their corresponding items in the right column.
        </div>
        <div className="text-sm font-medium text-gray-700">{max_score} points</div>
      </div>
      
      {/* Matching interface */}
      <div className="p-4">
        {/* Left column (word bank) */}
        <ul className="list-none p-0 w-full max-w-md mx-auto">
          {word_bank.map((item, index) => (
            <li 
              key={`word-${index}`} 
              className={`mb-3 p-3 rounded-md border-2 ${
                isCorrectMatch(item) ? 'border-green-500 bg-green-50' : 
                (submitted && !isCorrectMatch(item)) ? 'border-red-500 bg-red-50' : 
                'border-gray-200 bg-white'
              }`}
              data-content={item}
            >
              <span className="block mb-2 text-gray-800">{item}</span>
              <div className="w-full">
                <select 
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="relative w-full h-0" ref={connectionArea}>
          {/* Connection lines are drawn here */}
          {connectionLines.map(line => (
            <div
              key={line.id}
              className={`absolute h-0.5 transform origin-left ${line.isCorrect ? 'bg-green-500' : 'bg-blue-500'}`}
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
        <ul className="list-none p-0 w-full max-w-md mx-auto mt-4">
          {match_options.map((option, index) => (
            <li 
              key={`match-${index}`} 
              className={`mb-3 p-3 rounded-md border-2 ${isOptionSelected(option) ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}
              data-content={option}
            >
              <span className="block text-gray-800">{option}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Feedback area (shown after submission) */}
      {feedback && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-lg font-medium text-center mb-3">
            You scored {feedback.score} out of {feedback.maxScore} ({feedback.percentageScore.toFixed(0)}%).
          </div>
          
          {showCorrectAnswers && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {feedback.correctMatches.length > 0 && (
                <div className="p-3 bg-green-50 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">Correct Matches:</h4>
                  <ul className="list-disc pl-5">
                    {feedback.correctMatches.map((match, i) => (
                      <li key={`correct-${i}`} className="text-green-700">
                        {match.item} → {match.match}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {feedback.incorrectMatches.length > 0 && (
                <div className="p-3 bg-red-50 rounded-md">
                  <h4 className="font-medium text-red-800 mb-2">Incorrect Matches:</h4>
                  <ul className="list-disc pl-5">
                    {feedback.incorrectMatches.map((match, i) => (
                      <li key={`incorrect-${i}`} className="text-red-700">
                        {match.item} → {match.yourAnswer} (should be {match.correctAnswer})
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
        <div className="p-4 border-t border-gray-200 flex justify-center gap-4">
          {!submitted ? (
            <>
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
                onClick={handleReset}
              >
                Reset
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={Object.keys(selections).length < word_bank.length}
              >
                Submit
              </button>
            </>
          ) : (
            <button 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
              onClick={handleReset}
            >
              Try Again
            </button>
          )}
        </div>
      )}
      
      {/* Debug information */}
      {DEBUG && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-2">Debug Info</h4>
          <details className="text-sm">
            <summary className="cursor-pointer p-2 bg-gray-100 rounded">Selections</summary>
            <pre className="p-2 mt-2 bg-gray-800 text-white rounded overflow-x-auto">{JSON.stringify(selections, null, 2)}</pre>
          </details>
          <details className="text-sm mt-2">
            <summary className="cursor-pointer p-2 bg-gray-100 rounded">Correct Answers</summary>
            <pre className="p-2 mt-2 bg-gray-800 text-white rounded overflow-x-auto">{JSON.stringify(correct_answer, null, 2)}</pre>
          </details>
          <details className="text-sm mt-2">
            <summary className="cursor-pointer p-2 bg-gray-100 rounded">Feedback</summary>
            <pre className="p-2 mt-2 bg-gray-800 text-white rounded overflow-x-auto">{JSON.stringify(feedback, null, 2)}</pre>
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