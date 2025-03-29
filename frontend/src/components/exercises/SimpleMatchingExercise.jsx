/**
 * Simple Matching Exercise Component
 * 
 * A straightforward implementation of a matching exercise component
 * that doesn't rely on complex references or state management.
 * 
 * Created by: Alex Ex
 * Date: March 28, 2025
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SimpleMatchingExercise = ({
  wordBank = [],
  matchOptions = [],
  correctAnswer = {},
  onAnswerChange = () => {},
  studentAnswers = {},
  readOnly = false,
  showAnswers = false
}) => {
  // Internal state for selected options
  const [answers, setAnswers] = useState(studentAnswers || {});
  
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
    return showAnswers && answers[item] && correctAnswer[item] === answers[item];
  };
  
  // Check if an answer is incorrect
  const isIncorrect = (item) => {
    return showAnswers && answers[item] && correctAnswer[item] !== answers[item];
  };
  
  // Check if an option is already selected
  const isOptionSelected = (option) => {
    return Object.values(answers).includes(option);
  };
  
  // Get available options for an item
  const getAvailableOptions = (item) => {
    return matchOptions.filter(option => {
      // Include if currently selected for this item
      if (answers[item] === option) return true;
      
      // Exclude if selected by another item
      return !Object.values(answers).includes(option);
    });
  };
  
  return (
    <div className="simple-matching-exercise" style={{
      margin: '20px 0',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        gap: '20px'
      }}>
        {/* Left column (wordBank) */}
        <div style={{ flex: 1 }}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Items</h3>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {wordBank.map((item, index) => (
              <li key={`word-${index}`} style={{ 
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: 'white',
                border: `2px solid ${
                  isCorrect(item) ? '#4caf50' : 
                  isIncorrect(item) ? '#f44336' : 
                  answers[item] ? '#bbdefb' : '#e0e0e0'
                }`,
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ marginBottom: '8px' }}>{item}</div>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                  value={answers[item] || ''}
                  onChange={(e) => handleSelect(item, e.target.value)}
                  disabled={readOnly}
                >
                  <option value="">Select a match...</option>
                  {getAvailableOptions(item).map((option, idx) => (
                    <option key={`option-${idx}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right column (matchOptions) */}
        <div style={{ flex: 1 }}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Matches</h3>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {matchOptions.map((option, index) => (
              <li key={`match-${index}`} style={{ 
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: 'white',
                border: `2px solid ${isOptionSelected(option) ? '#bbdefb' : '#e0e0e0'}`,
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Debugging information */}
      {process.env.REACT_APP_DEBUG_MODE === 'true' && (
        <div style={{ marginTop: '20px', padding: '10px', borderTop: '1px dashed #ccc' }}>
          <details>
            <summary>Debug Information</summary>
            <div>
              <h4>Current Answers:</h4>
              <pre>{JSON.stringify(answers, null, 2)}</pre>
              <h4>Correct Answers:</h4>
              <pre>{JSON.stringify(correctAnswer, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

SimpleMatchingExercise.propTypes = {
  wordBank: PropTypes.arrayOf(PropTypes.string).isRequired,
  matchOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswer: PropTypes.object.isRequired,
  onAnswerChange: PropTypes.func,
  studentAnswers: PropTypes.object,
  readOnly: PropTypes.bool,
  showAnswers: PropTypes.bool
};

export default SimpleMatchingExercise;
