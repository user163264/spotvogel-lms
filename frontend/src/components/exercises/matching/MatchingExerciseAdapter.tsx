/**
 * MatchingExerciseAdapter
 * 
 * An adapter component that uses the improved MatchingWordsSimple component
 * but maintains the same interface as the original MatchingExercise component
 * to ensure compatibility with existing code.
 */

import React, { useState, useEffect } from 'react';
import MatchingWordsSimple from '../MatchingWordsSimple';
import './MatchingExercise.css';
import { MatchingExercise } from '../../../types/exercises';

// Debug mode - controlled via environment variable
const DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';

/**
 * Logs debug information if debug mode is enabled
 * @param {string} label - Log label
 * @param {any} data - Data to log
 */
const debugLog = (label: string, data?: any): void => {
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

// Types for component props
interface FeedbackData {
  score: number;
  maxScore: number;
  percentageScore: number;
  correctMatches: Array<{
    item: string;
    match: string;
  }>;
  incorrectMatches: Array<{
    item: string;
    yourAnswer: string;
    correctAnswer: string;
  }>;
}

interface MatchingExerciseAdapterProps {
  exercise: MatchingExercise & { 
    exercise_id?: number | string 
  };
  onSubmit?: (data: {
    exerciseId: number | string;
    answers: Record<string, string>;
    score: number;
    maxScore: number;
  }) => void;
  readOnly?: boolean;
  studentAnswers?: Record<string, string> | null;
  showCorrectAnswers?: boolean;
  feedbackData?: FeedbackData | null;
}

/**
 * MatchingExerciseAdapter Component
 */
const MatchingExerciseAdapter: React.FC<MatchingExerciseAdapterProps> = ({ 
  exercise, 
  onSubmit, 
  readOnly = false,
  studentAnswers = null,
  showCorrectAnswers = false,
  feedbackData = null
}) => {
  // Component key for forcing remount
  const [componentKey, setComponentKey] = useState<number>(0);
  
  // Student answers state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Submission state
  const [submitted, setSubmitted] = useState<boolean>(false);
  
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
  const handleAnswerChange = (newAnswers: Record<string, string>): void => {
    debugLog('Answers changed', newAnswers);
    setAnswers(newAnswers);
  };
  
  // Handle reset
  const handleReset = (): void => {
    debugLog('Exercise reset');
    setAnswers({});
    setSubmitted(false);
    setComponentKey(prevKey => prevKey + 1);
  };
  
  // Handle submit
  const handleSubmit = (): void => {
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
        exerciseId: exercise.exercise_id || exercise.id,
        answers: answers,
        score: 0, // Score will be calculated by the parent component
        maxScore: exercise.max_score
      });
    }
  };
  
  // If there's no exercise data, show a message
  if (!exercise || !exercise.word_bank || !exercise.match_options) {
    return <div className="error-message">No exercise data available.</div>;
  }
  
  return (
    <div className="matching-exercise-container">
      {/* Exercise header */}
      <div className="exercise-header">
        <h3 className="exercise-question">{exercise.question}</h3>
        <div className="exercise-instructions">
          Select the correct match for each item from the dropdown menu.
        </div>
        <div className="exercise-score">{exercise.max_score} points</div>
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
        <div className="exercise-feedback">
          <div className="feedback-message">
            You scored {feedbackData.score} out of {feedbackData.maxScore} ({feedbackData.percentageScore.toFixed(0)}%).
          </div>
          
          {showCorrectAnswers && (
            <div className="feedback-details">
              {feedbackData.correctMatches.length > 0 && (
                <div className="correct-matches">
                  <h4>Correct Matches:</h4>
                  <ul>
                    {feedbackData.correctMatches.map((match, i) => (
                      <li key={`correct-${i}`}>
                        ✓ {match.item} → {match.match}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {feedbackData.incorrectMatches.length > 0 && (
                <div className="incorrect-matches">
                  <h4>Incorrect Matches:</h4>
                  <ul>
                    {feedbackData.incorrectMatches.map((match, i) => (
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
      {!readOnly && !submitted && (
        <div className="exercise-actions">
          <button className="btn btn-reset" onClick={handleReset}>
            Reset
          </button>
          <button 
            className="btn btn-submit" 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < exercise.word_bank.length}
          >
            Submit
          </button>
        </div>
      )}
      
      {!readOnly && submitted && (
        <div className="exercise-actions">
          <button className="btn btn-reset" onClick={handleReset}>
            Try Again
          </button>
        </div>
      )}
      
      {/* Debug information */}
      {DEBUG && (
        <div className="debug-info">
          <h4>Debug Info</h4>
          <details>
            <summary>Answers</summary>
            <pre>{JSON.stringify(answers, null, 2)}</pre>
          </details>
          <details>
            <summary>Correct Answers</summary>
            <pre>{JSON.stringify(exercise.correct_answer, null, 2)}</pre>
          </details>
          <details>
            <summary>Feedback</summary>
            <pre>{JSON.stringify(feedbackData, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default MatchingExerciseAdapter;
