import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './styles.css';

// Import components
import ExerciseForm from './ExerciseForm';
import QuestionBuilder from './QuestionBuilder';
import ExercisePreview from './ExercisePreview';
import AIAssistant from './AIAssistant';
import ExerciseSaveModal from './ExerciseSaveModal';

// Import services
import { 
  createExercise, 
  saveExerciseDraft, 
  getExerciseById 
} from '../../services/exerciseService';

// Import UI components
import LoadingIndicator from '../common/LoadingIndicator';
import Alert from '../common/Alert';

const ExerciseCreator = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing exercise
  
  // States
  const [exercise, setExercise] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    difficultyLevel: 'medium',
    subject: '',
    grade: '',
    questions: [],
    isPublished: false,
    templateId: null
  });
  
  const [currentStep, setCurrentStep] = useState('details'); // ['details', 'questions', 'preview']
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Load existing exercise if editing
  useEffect(() => {
    const loadExercise = async () => {
      if (id) {
        setLoading(true);
        try {
          const loadedExercise = await getExerciseById(id);
          setExercise(loadedExercise);
        } catch (err) {
          setError('Failed to load exercise. Please try again.');
          console.error('Error loading exercise:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadExercise();
  }, [id]);
  
  // Add a new question
  const addQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      type: 'multiple-choice',
      prompt: '',
      options: [
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false }
      ],
      points: 1,
      feedback: {
        correct: '',
        incorrect: ''
      }
    };
    
    setExercise(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };
  
  // Update a question
  const updateQuestion = (questionId, updatedQuestion) => {
    setExercise(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? updatedQuestion : q
      )
    }));
  };
  
  // Remove a question
  const removeQuestion = (questionId) => {
    setExercise(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };
  
  // Update exercise details
  const handleExerciseDetailsChange = (updatedDetails) => {
    setExercise(prev => ({
      ...prev,
      ...updatedDetails
    }));
  };
  
  // Navigate between steps
  const goToStep = (step) => {
    setCurrentStep(step);
  };
  
  // Save exercise (publish or draft)
  const saveExercise = async (publish = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const exerciseToSave = {
        ...exercise,
        isPublished: publish
      };
      
      let savedExercise;
      
      if (publish) {
        savedExercise = await createExercise(exerciseToSave);
      } else {
        savedExercise = await saveExerciseDraft(exerciseToSave);
      }
      
      setShowSaveModal(false);
      navigate(`/exercises/${savedExercise.id}`);
    } catch (err) {
      setError('Failed to save exercise. Please try again.');
      console.error('Error saving exercise:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // AI-assisted question generation
  const generateQuestionsWithAI = (generatedQuestions) => {
    setExercise(prev => ({
      ...prev,
      questions: [...prev.questions, ...generatedQuestions]
    }));
    setShowAIAssistant(false);
  };
  
  if (loading && !exercise.title) {
    return <LoadingIndicator />;
  }
  
  return (
    <div className="exercise-creator">
      {error && <Alert type="error" message={error} />}
      
      <div className="exercise-creator__header">
        <h1>{id ? 'Edit Exercise' : 'Create New Exercise'}</h1>
        
        {/* Step navigation */}
        <div className="exercise-creator__steps">
          <button 
            className={`step-button ${currentStep === 'details' ? 'active' : ''}`}
            onClick={() => goToStep('details')}
          >
            1. Exercise Details
          </button>
          <button 
            className={`step-button ${currentStep === 'questions' ? 'active' : ''}`}
            onClick={() => goToStep('questions')}
            disabled={!exercise.title}
          >
            2. Questions
          </button>
          <button 
            className={`step-button ${currentStep === 'preview' ? 'active' : ''}`}
            onClick={() => goToStep('preview')}
            disabled={exercise.questions.length === 0}
          >
            3. Preview
          </button>
        </div>
      </div>
      
      <div className="exercise-creator__content">
        {currentStep === 'details' && (
          <ExerciseForm 
            exercise={exercise} 
            onChange={handleExerciseDetailsChange}
            onNext={() => goToStep('questions')}
          />
        )}
        
        {currentStep === 'questions' && (
          <div className="question-builder-container">
            <div className="question-builder-header">
              <h2>Create Questions</h2>
              <button 
                className="ai-button"
                onClick={() => setShowAIAssistant(true)}
              >
                Use AI Assistant
              </button>
              <button 
                className="add-question-button"
                onClick={addQuestion}
              >
                Add Question
              </button>
            </div>
            
            {exercise.questions.length === 0 ? (
              <div className="empty-questions">
                <p>No questions yet. Add a question or use the AI assistant to get started.</p>
              </div>
            ) : (
              exercise.questions.map((question, index) => (
                <QuestionBuilder
                  key={question.id}
                  question={question}
                  questionNumber={index + 1}
                  onChange={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
                  onRemove={() => removeQuestion(question.id)}
                />
              ))
            )}
            
            <div className="navigation-buttons">
              <button onClick={() => goToStep('details')}>Back</button>
              <button 
                onClick={() => goToStep('preview')}
                disabled={exercise.questions.length === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 'preview' && (
          <div className="preview-container">
            <ExercisePreview exercise={exercise} />
            
            <div className="navigation-buttons">
              <button onClick={() => goToStep('questions')}>Back</button>
              <button 
                className="save-draft-button"
                onClick={() => saveExercise(false)}
              >
                Save as Draft
              </button>
              <button 
                className="publish-button"
                onClick={() => setShowSaveModal(true)}
              >
                Publish Exercise
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showAIAssistant && (
        <AIAssistant
          exerciseDetails={exercise}
          onGenerate={generateQuestionsWithAI}
          onClose={() => setShowAIAssistant(false)}
        />
      )}
      
      {showSaveModal && (
        <ExerciseSaveModal
          onConfirm={() => saveExercise(true)}
          onCancel={() => setShowSaveModal(false)}
          exercise={exercise}
        />
      )}
    </div>
  );
};

export default ExerciseCreator;