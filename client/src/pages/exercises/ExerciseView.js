import React, { useState, useEffect } from 'react';
import MatchingWords from '../../components/exercises/MatchingWords';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getExerciseById, deleteExercise } from '../../services/exerciseService';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Alert from '../../components/common/Alert';

const ExerciseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const data = await getExerciseById(id);
        setExercise(data);
      } catch (err) {
        console.error('Error fetching exercise:', err);
        setError('Failed to load exercise details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercise();
  }, [id]);
  
  const handleDeleteExercise = async () => {
    setLoading(true);
    try {
      await deleteExercise(id);
      navigate('/exercises');
    } catch (err) {
      console.error('Error deleting exercise:', err);
      setError('Failed to delete exercise');
      setLoading(false);
    }
  };
  
  const goToNextQuestion = () => {
    if (!exercise?.questions || !Array.isArray(exercise.questions)) {
      return; // No questions to navigate to
    }
    
    if (activeQuestionIndex < exercise.questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };
  
  if (loading) {
    return <LoadingIndicator />;
  }
  
  if (error) {
    return <Alert type="error" message={error} />;
  }
  
  if (!exercise) {
    return <Alert type="info" message="Exercise not found" />;
  }
  
  const isOwner = user && exercise?.creator && user.id === exercise.creator;
  
  // Safely get the current question with fallbacks
  const safeQuestions = Array.isArray(exercise?.questions) ? exercise.questions : [];
  const currentQuestion = safeQuestions[activeQuestionIndex] || {};
  
  return (
    <div className="exercise-view-page">
      <div className="page-header">
        <div className="header-content">
          <h1>{exercise?.title || 'Untitled Exercise'}</h1>
          
          <div className="exercise-meta">
            <span className="meta-item">
              <span className="meta-label">Subject:</span> {exercise?.subject || 'Not specified'}
            </span>
            <span className="meta-item">
              <span className="meta-label">Grade:</span> {exercise?.grade || 'Not specified'}
            </span>
            <span className="meta-item">
              <span className="meta-label">Difficulty:</span> {exercise?.difficultyLevel || 'Not specified'}
            </span>
            <span className="meta-item">
              <span className="meta-label">Time Limit:</span> {exercise?.timeLimit || '0'} minutes
            </span>
            {exercise?.tags && Array.isArray(exercise.tags) && exercise.tags.length > 0 && (
              <span className="meta-item">
                <span className="meta-label">Tags:</span> {exercise.tags.join(', ')}
              </span>
            )}
          </div>
          
          <p className="exercise-description">{exercise?.description || 'No description available'}</p>
        </div>
        
        {isOwner && (
          <div className="header-actions">
            <Link to={`/exercises/edit/${exercise?._id || exercise?.id || id}`} className="btn btn-edit">
              Edit Exercise
            </Link>
            <button 
              className="btn btn-delete" 
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Exercise
            </button>
          </div>
        )}
      </div>
      
      <div className="exercise-content">
        <div className="question-navigation">
          <div className="question-numbers">
            {safeQuestions.map((_, index) => (
              <button
                key={index}
                className={`question-number ${index === activeQuestionIndex ? 'active' : ''}`}
                onClick={() => setActiveQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        
        <div className="question-container">
          <div className="question-header">
            <span className="question-counter">
              Question {activeQuestionIndex + 1} of {safeQuestions.length}
            </span>
            <span className="question-points">
              {currentQuestion?.points || 0} point{(currentQuestion?.points || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="question-content">
            <p className="question-text">{currentQuestion?.prompt || 'No question text available'}</p>
            
            {(currentQuestion?.type === 'multiple-choice' || currentQuestion?.type === 'checkbox' || currentQuestion?.type === 'true-false') && (
              <div className="question-options">
                {Array.isArray(currentQuestion?.options) ? currentQuestion.options.map((option) => (
                  <div key={option?.id || Math.random()} className="option">
                    <label className="option-label">
                      <input 
                        type={currentQuestion?.type === 'checkbox' ? 'checkbox' : 'radio'} 
                        name={`question-${currentQuestion?.id || activeQuestionIndex}`}
                        disabled
                        defaultChecked={option?.isCorrect}
                      />
                      <span className="option-text">{option?.text || 'No option text'}</span>
                      {option?.isCorrect && <span className="correct-indicator">✓</span>}
                    </label>
                  </div>
                )) : <p>No options available</p>}
              </div>
            )}
            
            {(currentQuestion?.type === 'text' || currentQuestion?.type === 'numeric') && (
              <div className="free-text-answer">
                <div className="answer-field">
                  <p><strong>Answer:</strong> {currentQuestion?.correctAnswer || 'No answer provided'}</p>
                </div>
              </div>
            )}
            
            {(currentQuestion?.type === 'matching-words' || currentQuestion?.exercise_type === 'matching_words') && (
              <div className="matching-words-container">
                <MatchingWords
                  exercise={{
                    question: currentQuestion?.prompt || currentQuestion?.question || 'Match the items',
                    word_bank: currentQuestion?.word_bank || currentQuestion?.leftItems || [],
                    match_options: currentQuestion?.match_options || currentQuestion?.rightItems || [],
                    correct_answer: currentQuestion?.correct_answer || {}
                  }}
                  readOnly={true}
                  showCorrectAnswers={true}
                />
              </div>
            )}
            
            {(currentQuestion?.feedback?.correct || currentQuestion?.feedback?.incorrect) && (
              <div className="question-feedback">
                {currentQuestion?.feedback?.correct && (
                  <div className="feedback correct">
                    <h4>Feedback for correct answer:</h4>
                    <p>{currentQuestion.feedback.correct}</p>
                  </div>
                )}
                
                {currentQuestion?.feedback?.incorrect && (
                  <div className="feedback incorrect">
                    <h4>Feedback for incorrect answer:</h4>
                    <p>{currentQuestion.feedback.incorrect}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="question-navigation-buttons">
            <button
              className="prev-button"
              onClick={goToPreviousQuestion}
              disabled={activeQuestionIndex === 0}
            >
              Previous Question
            </button>
            <button
              className="next-button"
              onClick={goToNextQuestion}
              disabled={activeQuestionIndex >= safeQuestions.length - 1}
            >
              Next Question
            </button>
          </div>
        </div>
      </div>
      
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete Exercise</h2>
            <p>Are you sure you want to delete this exercise? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteExercise}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseView;