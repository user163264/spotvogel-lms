/**
 * AI Matching Exercise Adapter
 * 
 * This component connects the OpenAI exercise generation service with
 * Finny's MatchingExercise UI component. It handles the generation of
 * matching exercises from lesson content and the transformation of data
 * between the AI service and UI component.
 * 
 * Created by: Alex Ex (AI Exercise Generation Specialist)
 * Date: March 29, 2025
 */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import MatchingExerciseAdapter from './matching/MatchingExerciseAdapter';
import { EXERCISE_TYPES, DIFFICULTY_LEVELS, SUPPORTED_LANGUAGES, FEATURES } from '../../config/config';

// Debug mode from feature flags
const DEBUG = FEATURES.DEBUG_MODE;

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

// Import the AI service for exercise generation
// This would be a real import in the actual implementation
const generateMatchingExercise = async (lessonContent, options) => {
  // In a production environment, this would make an API call to our backend
  try {
    debugLog('Generating matching exercise', { contentLength: lessonContent.length, options });
    
    // This would be a real API call in production
    // const response = await fetch('/api/exercise/generate/matching', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ lessonContent, options }),
    // });
    // const data = await response.json();
    
    // For demo purposes, we'll simulate a response with art content from exercise.html
    const simulatedExercise = {
      exercise_type: EXERCISE_TYPES.MATCHING_WORDS,
      question: "Koppel de schilder aan zijn beroemde werk.",
      word_bank: ["Gustav Klimt", "James McNeill Whistler", "Claude Monet", "Salvador Dalí", "Vincent van Gogh"],
      match_options: ["Waterlelies", "De Kus", "Whistler's Mother", "De Volharding der Herinnering", "Sterrennacht"],
      correct_answer: {
        "Gustav Klimt": "De Kus",
        "James McNeill Whistler": "Whistler's Mother",
        "Claude Monet": "Waterlelies",
        "Salvador Dalí": "De Volharding der Herinnering",
        "Vincent van Gogh": "Sterrennacht"
      },
      max_score: 5,
      grading_type: "auto"
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    debugLog('Exercise generated successfully', simulatedExercise);
    
    return {
      success: true,
      exercise: simulatedExercise
    };
  } catch (error) {
    console.error('Error generating exercise:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * AI Matching Exercise Adapter
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const AIMatchingExerciseAdapter = ({
  lessonContent,
  exerciseOptions = {},
  onExerciseCompleted,
  onError,
  initialExercise
}) => {
  // State for the generated exercise
  const [exercise, setExercise] = useState(null);
  
  // State for loading status
  const [loading, setLoading] = useState(false);
  
  // State for errors
  const [error, setError] = useState(null);
  
  // State for student answers
  const [studentAnswers, setStudentAnswers] = useState({});
  
  // State for feedback
  const [feedback, setFeedback] = useState(null);
  
  // State for submission status
  const [submitted, setSubmitted] = useState(false);
  
  // State for showing correct answers
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  
  // Generate the exercise when the component mounts or when lessonContent changes
  useEffect(() => {
    if (initialExercise) {
      // If an initialExercise is provided, use it
      setExercise(initialExercise);
      setLoading(false);
    } else if (lessonContent) {
      // Otherwise generate one from the content
      generateExercise();
    }
  }, [lessonContent, initialExercise]);
  
  // Function to generate the exercise
  const generateExercise = useCallback(async () => {
    if (!lessonContent) {
      setError('Lesson content is required to generate an exercise');
      if (onError) onError('Lesson content is required to generate an exercise');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const defaultOptions = {
        numberOfPairs: 5,
        difficulty: 'medium',
        language: 'nl'
      };
      
      const result = await generateMatchingExercise(
        lessonContent,
        { ...defaultOptions, ...exerciseOptions }
      );
      
      if (result.success) {
        setExercise(result.exercise);
      } else {
        throw new Error(result.error || 'Failed to generate exercise');
      }
    } catch (err) {
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lessonContent, exerciseOptions, onError, initialExercise]);
  
  // Handle exercise submission
  const handleSubmit = (submissionData) => {
    debugLog('Exercise submitted', submissionData);
    
    setStudentAnswers(submissionData.answers);
    setSubmitted(true);
    
    // Calculate the score
    const totalPairs = Object.keys(exercise.correct_answer).length;
    let correctCount = 0;
    
    for (const [item, selectedOption] of Object.entries(submissionData.answers)) {
      if (exercise.correct_answer[item] === selectedOption) {
        correctCount++;
      }
    }
    
    const score = correctCount;
    const percentageScore = (correctCount / totalPairs) * 100;
    
    // Prepare feedback data
    const correctMatches = [];
    const incorrectMatches = [];
    
    for (const [item, selectedOption] of Object.entries(submissionData.answers)) {
      const correctOption = exercise.correct_answer[item];
      
      if (selectedOption === correctOption) {
        correctMatches.push({
          item,
          match: selectedOption
        });
      } else {
        incorrectMatches.push({
          item,
          yourAnswer: selectedOption,
          correctAnswer: correctOption
        });
      }
    }
    
    const feedbackData = {
      score,
      maxScore: totalPairs,
      percentageScore,
      correctMatches,
      incorrectMatches
    };
    
    setFeedback(feedbackData);
    
    // Notify parent component
    if (onExerciseCompleted) {
      onExerciseCompleted({
        exerciseId: exercise.exercise_id || 0,
        score,
        maxScore: totalPairs,
        answers: submissionData.answers,
        feedback: feedbackData
      });
    }
  };
  
  // Handle showing correct answers
  const handleShowCorrectAnswers = () => {
    setShowCorrectAnswers(true);
  };
  
  // Handle resetting the exercise
  const handleReset = () => {
    setStudentAnswers({});
    setFeedback(null);
    setSubmitted(false);
    setShowCorrectAnswers(false);
  };
  
  // If there's an error, show it
  if (error) {
    return (
      <div className="error-container">
        <h3>Error Generating Exercise</h3>
        <p>{error}</p>
        <button onClick={generateExercise}>Retry</button>
      </div>
    );
  }
  
  // If loading, show a loading indicator
  if (loading) {
    return (
      <div className="loading-container">
        <h3>Generating Exercise...</h3>
        <p>Using AI to create a matching exercise from the lesson content...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // If no exercise has been generated yet, show a message
  if (!exercise) {
    return (
      <div className="no-exercise-container">
        <h3>No Exercise Available</h3>
        <p>Please provide lesson content to generate an exercise.</p>
      </div>
    );
  }
  
  // Otherwise, render the exercise
  return (
    <div className="ai-matching-exercise-container">
      <div className="exercise-info">
        <p className="ai-generated-label">AI Generated Exercise</p>
      </div>
      
      <MatchingExerciseAdapter
        exercise={exercise}
        onSubmit={handleSubmit}
        readOnly={false}
        studentAnswers={studentAnswers}
        showCorrectAnswers={showCorrectAnswers}
        feedbackData={feedback}
      />
      
      {submitted && !showCorrectAnswers && (
        <div className="post-submission-actions">
          <button 
            className="btn btn-show-answers" 
            onClick={handleShowCorrectAnswers}
          >
            Show Correct Answers
          </button>
          <button 
            className="btn btn-try-again" 
            onClick={handleReset}
          >
            Try Again
          </button>
        </div>
      )}
      
      {DEBUG && (
        <div className="debug-info">
          <h4>AI Adapter Debug Info</h4>
          <details>
            <summary>Exercise Data</summary>
            <pre>{JSON.stringify(exercise, null, 2)}</pre>
          </details>
          <details>
            <summary>Student Answers</summary>
            <pre>{JSON.stringify(studentAnswers, null, 2)}</pre>
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

AIMatchingExerciseAdapter.propTypes = {
  lessonContent: PropTypes.string.isRequired,
  exerciseOptions: PropTypes.shape({
    numberOfPairs: PropTypes.number,
    difficulty: PropTypes.oneOf(DIFFICULTY_LEVELS.map(level => level.value)),
    language: PropTypes.oneOf(SUPPORTED_LANGUAGES.map(lang => lang.value))
  }),
  onExerciseCompleted: PropTypes.func,
  onError: PropTypes.func,
  initialExercise: PropTypes.object // Add support for directly passing an exercise
};

export default AIMatchingExerciseAdapter;
