import React, { useState } from 'react';

const ExercisePreview = ({ exercise }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Handle navigation between questions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < exercise.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Current question
  const currentQuestion = exercise.questions[currentQuestionIndex] || {};

  return (
    <div className="exercise-preview">
      <div className="exercise-preview__header">
        <h2>{exercise.title}</h2>
        <div className="exercise-meta">
          <span className="exercise-subject">{exercise.subject}</span>
          <span className="exercise-grade">{exercise.grade}</span>
          <span className="exercise-difficulty">{exercise.difficultyLevel}</span>
          <span className="exercise-time">{exercise.timeLimit} min</span>
        </div>
        <p className="exercise-description">{exercise.description}</p>
      </div>

      <div className="exercise-preview__navigation">
        <div className="question-numbers">
          {exercise.questions.map((_, index) => (
            <button
              key={index}
              className={`question-number ${index === currentQuestionIndex ? 'active' : ''}`}
              onClick={() => goToQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="exercise-preview__question">
        <div className="question-header">
          <h3>Question {currentQuestionIndex + 1} of {exercise.questions.length}</h3>
          <span className="question-points">{currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}</span>
        </div>

        <div className="question-content">
          <p className="question-prompt">{currentQuestion.prompt}</p>

          {currentQuestion.type === 'multiple-choice' && (
            <div className="question-options">
              {currentQuestion.options?.map((option, index) => (
                <div key={option.id} className="option">
                  <label className="option-label">
                    <input type="radio" name="preview-option" disabled />
                    <span className="option-text">{option.text}</span>
                    {option.isCorrect && <span className="option-correct">(Correct Answer)</span>}
                  </label>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'checkbox' && (
            <div className="question-options">
              {currentQuestion.options?.map((option, index) => (
                <div key={option.id} className="option">
                  <label className="option-label">
                    <input type="checkbox" disabled />
                    <span className="option-text">{option.text}</span>
                    {option.isCorrect && <span className="option-correct">(Correct Answer)</span>}
                  </label>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'true-false' && (
            <div className="question-options">
              {currentQuestion.options?.map((option, index) => (
                <div key={option.id} className="option">
                  <label className="option-label">
                    <input type="radio" name="preview-option" disabled />
                    <span className="option-text">{option.text}</span>
                    {option.isCorrect && <span className="option-correct">(Correct Answer)</span>}
                  </label>
                </div>
              ))}
            </div>
          )}

          {(currentQuestion.type === 'text' || currentQuestion.type === 'numeric') && (
            <div className="question-text-answer">
              <div className="answer-field">
                <input
                  type={currentQuestion.type === 'numeric' ? 'number' : 'text'}
                  placeholder="Student answer will go here"
                  disabled
                  className="preview-input"
                />
              </div>
              <div className="correct-answer-display">
                <strong>Correct Answer:</strong> {currentQuestion.correctAnswer}
              </div>
            </div>
          )}

          <div className="question-feedback">
            <div className="feedback-section">
              <h4>Feedback for Correct Answer</h4>
              <p>{currentQuestion.feedback?.correct || "No feedback provided for correct answers."}</p>
            </div>
            <div className="feedback-section">
              <h4>Feedback for Incorrect Answer</h4>
              <p>{currentQuestion.feedback?.incorrect || "No feedback provided for incorrect answers."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="exercise-preview__navigation-buttons">
        <button
          className="prev-button"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous Question
        </button>
        <button
          className="next-button"
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === exercise.questions.length - 1}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default ExercisePreview;