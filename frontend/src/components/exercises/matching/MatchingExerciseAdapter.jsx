/**
 * MatchingExerciseAdapter
 * 
 * An adapter component that uses the improved MatchingWordsSimple component
 * but maintains the same interface as the original MatchingExercise component
 * to ensure compatibility with existing code.
 * 
 * Migrated from CSS to Tailwind CSS
 * By Finny Frontend
 * April 1, 2025
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MatchingWordsSimple from '../MatchingWordsSimple';
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
 * MatchingExerciseAdapter Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const MatchingExerciseAdapter = ({ 
  exercise, 
  onSubmit, 
  readOnly = false,
  studentAnswers = null,
  showCorrectAnswers = false,
  feedbackData = null
}) => {
  // Component key for forcing remount
  const [componentKey, setComponentKey] = useState(0);
  
  // Student answers state
  const [answers, setAnswers] = useState({});
  
  // Submission state
  const [submitted, setSubmitted] = useState(false);
  
  // Reset the component when the exercise changes
  useEffect(() => {
    setComponentKey(prevKey => prevKey + 1);
    setAnswers({});
    setSubmitted(false);
  }, [exercise]);
  
  // Initialize student answers if provided
  useEffect(() => {
    if (studentAnswers && Object.keys(studentAnswers).length > 0) {
      debugLog('Initializing with student answers', studentAnswers);
      setAnswers(studentAnswers);
    }
  }, [studentAnswers]);
  
  // Handle answer change from the MatchingWordsSimple component
  const handleAnswerChange = (newAnswers) => {
    debugLog('Answers changed', newAnswers);
    setAnswers(newAnswers);
  };
  
  // Handle reset
  const handleReset = () => {
    debugLog('Exercise reset');
    setAnswers({});
    setSubmitted(false);
    setComponentKey(prevKey => prevKey + 1);
  };
  
  // Handle submit
  const handleSubmit = () => {
    debugLog('Exercise submitted', answers);
    
    // Validate all items are matched
    if (Object.keys(answers).length < exercise.word_bank.length) {
      alert('Please match all items before submitting.');
      return;
    }
    
    setSubmitted(true);
    
    // Call onSubmit callback if provided
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit({
        exerciseId: exercise.exercise_id,
        answers: answers,
        score: 0, // Score will be calculated by the parent component
        maxScore: exercise.max_score
      });
    }
  };
  
  // Validate exercise data
  if (!exercise || !exercise.word_bank || !exercise.match_options) {
    return <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">No exercise data available.</div>;
  }
  
  // FINAL SAFETY CHECK - override question field completely
  // This is the last line of defense against text injection
  exercise.question = 'Match each item with its correct counterpart.';
  
  // Safety check for any items that might contain injected content
  if (Array.isArray(exercise.word_bank)) {
    for (let i = 0; i < exercise.word_bank.length; i++) {
      const item = exercise.word_bank[i];
      
      // Check for suspicious patterns that indicate text injection
      const isSuspicious = (
        (item.includes('Koppel elk') && item.includes('tegenhanger')) ||
        item.includes('[TOPIC]') ||
        item.includes('Match each') ||
        (item.startsWith('Verbind') && item.includes('item'))
      );
      
      if (isSuspicious) {
        // Replace suspicious content
        console.warn('Detected suspicious content in word_bank item:', item);
        exercise.word_bank[i] = `Item ${i+1}`;
      }
    }
  }
  
  return (
    <div className="w-full my-6 bg-white rounded-lg shadow-sm">
      {/* Exercise header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{exercise.question}</h3>
        <div className="text-sm text-gray-600 mb-2">
          Select the correct match for each item from the dropdown menu.
        </div>
        <div className="text-sm font-medium text-gray-700">{exercise.max_score} points</div>
      </div>
      
      {/* MatchingWordsSimple component */}
      <MatchingWordsSimple
        key={`matching-words-${componentKey}`}
        exercise={exercise}
        onAnswerChange={handleAnswerChange}
        readOnly={readOnly || submitted}
        showCorrectAnswers={showCorrectAnswers}
        studentAnswers={answers}
      />
      
      {/* Feedback area (shown after submission) */}
      {feedbackData && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-lg font-medium text-center mb-3">
            You scored {feedbackData.score} out of {feedbackData.maxScore} ({feedbackData.percentageScore.toFixed(0)}%).
          </div>
          
          {showCorrectAnswers && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {feedbackData.correctMatches.length > 0 && (
                <div className="p-3 bg-green-50 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">Correct Matches:</h4>
                  <ul className="list-disc pl-5">
                    {feedbackData.correctMatches.map((match, i) => (
                      <li key={`correct-${i}`} className="text-green-700">
                        {match.item} → {match.match}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {feedbackData.incorrectMatches.length > 0 && (
                <div className="p-3 bg-red-50 rounded-md">
                  <h4 className="font-medium text-red-800 mb-2">Incorrect Matches:</h4>
                  <ul className="list-disc pl-5">
                    {feedbackData.incorrectMatches.map((match, i) => (
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
      {!readOnly && !submitted && (
        <div className="p-4 border-t border-gray-200 flex justify-center gap-4">
          <button 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
            onClick={handleReset}
          >
            Reset
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < exercise.word_bank.length}
          >
            Submit
          </button>
        </div>
      )}
      
      {!readOnly && submitted && (
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
            onClick={handleReset}
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Debug information */}
      {DEBUG && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-2">Debug Info</h4>
          <details className="text-sm">
            <summary className="cursor-pointer p-2 bg-gray-100 rounded">Answers</summary>
            <pre className="p-2 mt-2 bg-gray-800 text-white rounded overflow-x-auto">{JSON.stringify(answers, null, 2)}</pre>
          </details>
          <details className="text-sm mt-2">
            <summary className="cursor-pointer p-2 bg-gray-100 rounded">Correct Answers</summary>
            <pre className="p-2 mt-2 bg-gray-800 text-white rounded overflow-x-auto">{JSON.stringify(exercise.correct_answer, null, 2)}</pre>
          </details>
          <details className="text-sm mt-2">
            <summary className="cursor-pointer p-2 bg-gray-100 rounded">Feedback</summary>
            <pre className="p-2 mt-2 bg-gray-800 text-white rounded overflow-x-auto">{JSON.stringify(feedbackData, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

MatchingExerciseAdapter.propTypes = {
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

export default MatchingExerciseAdapter;