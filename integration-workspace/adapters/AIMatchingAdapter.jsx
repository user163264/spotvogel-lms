import React, { useState, useCallback, useRef, useEffect } from 'react';

/**
 * AIMatchingAdapter
 * 
 * This adapter component connects AI-generated exercise data with 
 * Finny's MatchingWordsSimple component. It handles data transformation,
 * state management, and proper lifecycle management.
 * 
 * @param {Object} props
 * @param {Object} props.exerciseData - AI-generated exercise data
 * @param {Function} props.MatchingComponent - The component to render (default: MatchingWordsSimple)
 * @param {Function} props.onAnswerSubmit - Callback when answers are submitted
 * @param {Boolean} props.readOnly - Whether the exercise is in read-only mode
 * @param {Boolean} props.showAnswers - Whether to show correct answers
 */
const AIMatchingAdapter = ({
  exerciseData,
  MatchingComponent,
  onAnswerSubmit,
  readOnly = false,
  showAnswers = false
}) => {
  // State management
  const [componentKey, setComponentKey] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const prevExerciseIdRef = useRef(null);
  const prevStudentAnswersRef = useRef({});

  // Reset component when exercise changes
  useEffect(() => {
    if (exerciseData && prevExerciseIdRef.current !== exerciseData.id) {
      prevExerciseIdRef.current = exerciseData.id;
      setComponentKey(prev => prev + 1);
      setStudentAnswers({});
    }
  }, [exerciseData]);

  // Memoized callback for answer changes
  const handleAnswerChange = useCallback((answers) => {
    // Deep comparison before updating state
    if (JSON.stringify(prevStudentAnswersRef.current) !== JSON.stringify(answers)) {
      setStudentAnswers(answers);
      prevStudentAnswersRef.current = {...answers};
    }
  }, []);

  // Handle submission
  const handleSubmit = useCallback(() => {
    if (onAnswerSubmit && exerciseData) {
      onAnswerSubmit({
        exerciseId: exerciseData.id,
        answers: studentAnswers,
        isComplete: isExerciseComplete(studentAnswers, exerciseData.word_bank)
      });
    }
  }, [exerciseData, studentAnswers, onAnswerSubmit]);

  // Check if all words have been matched
  const isExerciseComplete = (answers, wordBank) => {
    return wordBank.every(word => answers[word] !== undefined);
  };

  // If no exercise data or component, return null
  if (!exerciseData || !MatchingComponent) return null;

  return (
    <div className="ai-matching-adapter">
      <MatchingComponent
        key={`exercise-${componentKey}`}
        wordBank={exerciseData.word_bank}
        matchOptions={exerciseData.match_options}
        correctAnswer={exerciseData.correct_answer}
        studentAnswers={studentAnswers}
        onAnswerChange={handleAnswerChange}
        readOnly={readOnly}
        showAnswers={showAnswers}
      />
      
      {!readOnly && (
        <div className="exercise-controls">
          <button 
            onClick={handleSubmit}
            disabled={!isExerciseComplete(studentAnswers, exerciseData.word_bank)}
            className="submit-button"
          >
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default AIMatchingAdapter;
