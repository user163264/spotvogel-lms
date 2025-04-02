/**
 * AI Matching Exercise Adapter
 * 
 * This component adapts the AI-generated matching exercise data to the
 * MatchingExercise component format.
 * 
 * Created by: Alex Ex
 * Date: March 30, 2025
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from '../ui';

const AIMatchingExerciseAdapter = ({
  initialExercise,
  lessonContent,
  exerciseOptions,
  onExerciseCompleted,
  onError
}) => {
  const [exercise] = useState(initialExercise || null);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  // If no exercise is provided, show a loading or error state
  if (!exercise) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-600">No exercise data available.</p>
      </div>
    );
  }

  // Handle answer selection
  const handleAnswerSelect = (wordBankItem, matchOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [wordBankItem]: matchOption
    }));
  };

  // Handle exercise submission
  const handleSubmit = () => {
    try {
      // Calculate score
      const correctAnswers = exercise.correct_answer || {};
      const score = Object.entries(userAnswers).reduce((total, [item, answer]) => {
        return total + (correctAnswers[item] === answer ? 1 : 0);
      }, 0);
      
      // Generate feedback
      const correctMatches = Object.entries(userAnswers)
        .filter(([item, answer]) => correctAnswers[item] === answer)
        .map(([item, answer]) => ({ item, answer }));
      
      const incorrectMatches = Object.entries(userAnswers)
        .filter(([item, answer]) => correctAnswers[item] !== answer)
        .map(([item, answer]) => ({ 
          item, 
          userAnswer: answer, 
          correctAnswer: correctAnswers[item] 
        }));
      
      // Create result object
      const result = {
        score,
        maxScore: exercise.word_bank.length,
        percentage: (score / exercise.word_bank.length) * 100,
        userAnswers,
        correctAnswers,
        feedback: {
          correctMatches,
          incorrectMatches
        }
      };
      
      // Set results and mark as submitted
      setResults(result);
      setIsSubmitted(true);
      
      // Call the callback
      if (onExerciseCompleted) {
        onExerciseCompleted(result);
      }
    } catch (error) {
      console.error('Error submitting exercise:', error);
      if (onError) {
        onError('Failed to process exercise submission');
      }
    }
  };

  // Render the matching exercise
  return (
    <div className="w-full">
      <Card className="mb-6">
        <Card.Header>
          <h3 className="text-xl font-medium">{exercise.question}</h3>
        </Card.Header>
        <Card.Body>
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:space-x-8">
              {/* Word bank column */}
              <div className="flex-1 mb-6 md:mb-0">
                <h4 className="font-medium mb-3 text-neutral-700">Items</h4>
                <div className="space-y-2">
                  {exercise.word_bank.map((item, index) => (
                    <div 
                      key={`word-${index}`}
                      className={`p-3 rounded-md border ${
                        isSubmitted 
                          ? userAnswers[item] === exercise.correct_answer[item]
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                          : 'bg-white border-gray-200 hover:border-primary'
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 text-sm mr-2">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p>{item}</p>
                          {isSubmitted && userAnswers[item] !== exercise.correct_answer[item] && (
                            <p className="text-sm text-red-500 mt-1">
                              Correct match: {exercise.correct_answer[item]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matching options column */}
              <div className="flex-1">
                <h4 className="font-medium mb-3 text-neutral-700">Match With</h4>
                <div className="space-y-2">
                  {exercise.match_options.map((option, index) => (
                    <div 
                      key={`option-${index}`}
                      className="p-3 rounded-md border border-gray-200 bg-white"
                    >
                      <div className="flex items-start">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 text-sm mr-2">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <p>{option}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Matching interface */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium mb-4 text-neutral-700">Your Answers</h4>
              <div className="space-y-3">
                {exercise.word_bank.map((item, index) => (
                  <div key={`answer-${index}`} className="flex items-center space-x-4">
                    <div className="w-1/2 p-2 border border-gray-200 rounded bg-gray-50">
                      {item}
                    </div>
                    <div className="text-neutral-500">→</div>
                    <select
                      value={userAnswers[item] || ''}
                      onChange={(e) => handleAnswerSelect(item, e.target.value)}
                      disabled={isSubmitted}
                      className="w-1/2 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">-- Select match --</option>
                      {exercise.match_options.map((option, optIndex) => (
                        <option key={`sel-${optIndex}`} value={option}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="flex justify-end">
            {!isSubmitted ? (
              <Button 
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length !== exercise.word_bank.length}
              >
                Submit Answers
              </Button>
            ) : (
              <div className="text-right">
                <div className="text-lg font-medium mb-1">
                  Score: {results.score}/{results.maxScore} ({results.percentage.toFixed(0)}%)
                </div>
                <div className="text-sm text-neutral-600">
                  {results.feedback.correctMatches.length} correct, {results.feedback.incorrectMatches.length} incorrect
                </div>
              </div>
            )}
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

AIMatchingExerciseAdapter.propTypes = {
  initialExercise: PropTypes.object,
  lessonContent: PropTypes.string,
  exerciseOptions: PropTypes.object,
  onExerciseCompleted: PropTypes.func,
  onError: PropTypes.func
};

export default AIMatchingExerciseAdapter;