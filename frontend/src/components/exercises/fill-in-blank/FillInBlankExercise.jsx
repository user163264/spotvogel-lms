import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PassageDisplay from './PassageDisplay';
import { calculateScore } from './util/validation';

/**
 * Main component for Fill-in-the-Blank exercises
 */
const FillInBlankExercise = ({ exercise, onSubmit }) => {
  // State for user answers
  const [answers, setAnswers] = useState({});
  
  // State for feedback display
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Check if exercise data is valid
  if (!exercise) {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200 mb-4">
        <h3 className="font-medium text-lg mb-3">
          Fill in the Blank Exercise
        </h3>
        <p className="text-slate-600">
          No exercise data provided
        </p>
      </div>
    );
  }
  
  // Destructure exercise data
  const { instructions, passage, blanks, explanation, caseSensitive = false } = exercise;
  
  // Validate required data
  if (!passage || !blanks || blanks.length === 0) {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200 mb-4">
        <h3 className="font-medium text-lg mb-3">
          Fill in the Blank Exercise
        </h3>
        <p className="text-red-500">
          Invalid exercise data: {!passage ? 'Missing passage. ' : ''}
          {!blanks || blanks.length === 0 ? 'Missing blanks.' : ''}
        </p>
      </div>
    );
  }
  
  // Handle answer change
  const handleAnswerChange = (blankId, value) => {
    setAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate score
    const scoreData = calculateScore(answers, blanks, caseSensitive);
    
    // Show feedback
    setShowFeedback(true);
    
    // Call submit callback if provided
    if (onSubmit) {
      onSubmit({
        answers,
        score: scoreData
      });
    }
  };
  
  // Handle reset
  const handleReset = () => {
    setAnswers({});
    setShowFeedback(false);
  };
  
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200 mb-4">
      <h3 className="font-medium text-lg mb-3">
        Fill in the Blank Exercise
      </h3>
      
      {instructions && (
        <div className="mb-4 italic text-slate-600">
          {instructions}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <PassageDisplay
            passage={passage}
            blanks={blanks}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            showFeedback={showFeedback}
            caseSensitive={caseSensitive}
          />
        </div>
        
        {showFeedback && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="font-medium mb-1">Results</h4>
            <p>
              {calculateScore(answers, blanks, caseSensitive).correct} out of {blanks.length} correct
              ({Math.round(calculateScore(answers, blanks, caseSensitive).percentage)}%)
            </p>
          </div>
        )}
        
        <div className="flex space-x-4">
          {!showFeedback ? (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Check Answers
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="bg-slate-200 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          )}
        </div>
      </form>
      
      {showFeedback && explanation && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h4 className="font-medium mb-2">Explanation</h4>
          <p className="text-slate-700">{explanation}</p>
        </div>
      )}
    </div>
  );
};

FillInBlankExercise.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string,
    instructions: PropTypes.string,
    passage: PropTypes.string.isRequired,
    blanks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        acceptedAnswers: PropTypes.arrayOf(PropTypes.string).isRequired
      })
    ).isRequired,
    explanation: PropTypes.string,
    caseSensitive: PropTypes.bool
  }),
  onSubmit: PropTypes.func
};

export default FillInBlankExercise;