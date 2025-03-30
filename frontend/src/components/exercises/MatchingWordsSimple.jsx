/**
 * Simple Matching Exercise Component
 * 
 * A straightforward implementation of a matching exercise component
 * that doesn't rely on complex references or state management.
 * 
 * Created by: Alex Ex
 * Date: March 29, 2025
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Import configuration
import { FEATURES } from '../../config/config';

// Debug mode from feature flags
const DEBUG = FEATURES.DEBUG_MODE;

const MatchingWordsSimple = ({
  exercise = {},
  onAnswerChange = () => {},
  studentAnswers = {},
  readOnly = false,
  showCorrectAnswers = false
}) => {
  // Destructure the exercise data
  const {
    word_bank = [],
    match_options = [],
    correct_answer = {}
  } = exercise;
  
  // Internal state for selected options
  const [answers, setAnswers] = useState(studentAnswers || {});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update answers when studentAnswers changes
  useEffect(() => {
    if (studentAnswers && Object.keys(studentAnswers).length > 0) {
      setAnswers(studentAnswers);
    }
  }, [studentAnswers]);
  
  // Handle selection change
  const handleSelect = (item, option) => {
    const newAnswers = {
      ...answers,
      [item]: option === '' ? undefined : option
    };
    
    // Remove empty entries
    if (option === '') {
      delete newAnswers[item];
    }
    
    setAnswers(newAnswers);
    onAnswerChange(newAnswers);
  };
  
  // Check if an answer is correct
  const isCorrect = (item) => {
    return showCorrectAnswers && answers[item] && correct_answer[item] === answers[item];
  };
  
  // Check if an answer is incorrect
  const isIncorrect = (item) => {
    return showCorrectAnswers && answers[item] && correct_answer[item] !== answers[item];
  };
  
  // Check if an option is already selected
  const isOptionSelected = (option) => {
    return Object.values(answers).includes(option);
  };
  
  // Check if an option is available for selection
  const isOptionAvailable = (item, option) => {
    if (readOnly) {
      // In read-only mode, only the selected option is available
      return answers[item] === option;
    }
    
    // An option is available if it's either:
    // 1. Currently selected for this item, or
    // 2. Not selected by any other item
    return answers[item] === option || !Object.values(answers).includes(option);
  };
  
  return (
    <div className="matching-words-simple" style={{
      margin: '20px 0',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Select the matching translation for each phrase
      </h3>
      <div style={{ 
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {word_bank.map((item, index) => (
            <li key={`word-${index}`} style={{ 
              padding: '12px',
              marginBottom: '15px',
              backgroundColor: 'white',
              border: `2px solid ${
                isCorrect(item) ? '#4caf50' : 
                isIncorrect(item) ? '#f44336' : 
                answers[item] ? '#bbdefb' : '#e0e0e0'
              }`,
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                marginBottom: '8px', 
                fontWeight: '500'
              }}>{item}</div>
              <select 
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white'
                }}
                value={answers[item] || ''}
                onChange={(e) => handleSelect(item, e.target.value)}
                disabled={readOnly}
              >
                <option value="">Select a match...</option>
                {match_options.map((option, idx) => {
                  // Include if it's the current selection or not selected by any other item
                  const isCurrentSelection = answers[item] === option;
                  const isSelectedByOther = !isCurrentSelection && Object.values(answers).includes(option);
                  return (
                    <option 
                      key={`option-${idx}`} 
                      value={option}
                      disabled={!isCurrentSelection && isSelectedByOther}
                    >
                      {option}
                    </option>
                  );
                })}
              </select>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Debugging information */}
      {DEBUG && (
        <div style={{ marginTop: '20px', padding: '10px', borderTop: '1px dashed #ccc' }}>
          <details>
            <summary>Debug Information</summary>
            <div>
              <h4>Current Answers:</h4>
              <pre>{JSON.stringify(answers, null, 2)}</pre>
              <h4>Correct Answers:</h4>
              <pre>{JSON.stringify(correct_answer, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

MatchingWordsSimple.propTypes = {
  exercise: PropTypes.shape({
    word_bank: PropTypes.arrayOf(PropTypes.string),
    match_options: PropTypes.arrayOf(PropTypes.string),
    correct_answer: PropTypes.object
  }),
  onAnswerChange: PropTypes.func,
  studentAnswers: PropTypes.object,
  readOnly: PropTypes.bool,
  showCorrectAnswers: PropTypes.bool
};

export default MatchingWordsSimple;
