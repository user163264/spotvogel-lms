import React, { useState } from 'react';
import MatchingWords from './improved/MatchingWordsOptimized'; // Import our optimized component
import FillInBlankExerciseSimple from './fill-in-blank/FillInBlankExerciseSimple'; // Import our Fill-in-the-Blank component
import { useNavigate } from 'react-router-dom';
import aiService from '../../services/aiService';

/**
 * Exercise Generator Component
 * Provides a form for teachers to generate AI-powered educational exercises
 */
const ExerciseGenerator = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedExercises, setGeneratedExercises] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    gradeLevel: '',
    topic: '',
    exerciseType: 'multiple-choice',
    difficulty: 3,
    count: 5,
    language: 'english'
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await aiService.generateExercises(formData);
      
      if (result && result.success && result.exercises && Array.isArray(result.exercises)) {
        setGeneratedExercises(result.exercises);
        setSuccess('Exercises generated successfully!');
      } else {
        // Handle malformed response
        console.error('Malformed response from server:', result);
        setError('Invalid response format from server');
        setGeneratedExercises(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate exercises');
      console.error('Exercise generation error:', err);
      // Reset the exercises to null to avoid rendering errors
      setGeneratedExercises(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving all exercises to database
  const handleSaveAll = async () => {
    if (!generatedExercises) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const title = `${formData.subject} - ${formData.topic} (${formData.exerciseType})`;
      
      const promises = generatedExercises.map(exercise => 
        aiService.saveGeneratedExercise({
          exerciseData: {
            ...formData,
            content: exercise
          },
          title
        })
      );
      
      await Promise.all(promises);
      setSuccess('All exercises saved successfully!');
      
      // Redirect to exercises list
      setTimeout(() => {
        navigate('/exercises');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save exercises');
    } finally {
      setIsLoading(false);
    }
  };

  // Create template from these exercises
  const handleCreateTemplate = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await aiService.createTemplateFromExercise({
        templateName: `${formData.subject} - ${formData.topic} Template`,
        templateDescription: `Template for ${formData.exerciseType} exercises on ${formData.topic} in ${formData.subject}`,
        exerciseParameters: formData
      });
      
      setSuccess('Template created successfully!');
      
      // Redirect to templates
      setTimeout(() => {
        navigate('/templates');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="exercise-generator">
      <h2>Generate Exercises with AI</h2>
      <p>Use AI to create customized exercises for your students</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            name="subject"
            className="form-control"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="language">Language Arts</option>
            <option value="history">History</option>
            <option value="geography">Geography</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="gradeLevel">Grade Level</label>
          <select
            id="gradeLevel"
            name="gradeLevel"
            className="form-control"
            value={formData.gradeLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select Grade Level</option>
            <option value="elementary">Elementary School</option>
            <option value="middle">Middle School</option>
            <option value="high">High School</option>
            <option value="university">University</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <input
            type="text"
            id="topic"
            name="topic"
            className="form-control"
            value={formData.topic}
            onChange={handleChange}
            placeholder="e.g., Fractions, Photosynthesis, World War II"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="exerciseType">Exercise Type</label>
          <select
            id="exerciseType"
            name="exerciseType"
            className="form-control"
            value={formData.exerciseType}
            onChange={handleChange}
            required
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="open-ended">Open Ended</option>
            <option value="fill-in-the-blank">Fill in the Blank</option>
            <option value="matching">Matching</option>
            <option value="true-false">True/False</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty Level (1-5)</label>
          <input
            type="range"
            id="difficulty"
            name="difficulty"
            min="1"
            max="5"
            className="form-control-range"
            value={formData.difficulty}
            onChange={handleChange}
          />
          <div className="difficulty-labels">
            <span>Easy</span>
            <span>Medium</span>
            <span>Hard</span>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="count">Number of Questions</label>
          <input
            type="number"
            id="count"
            name="count"
            className="form-control"
            min="1"
            max="20"
            value={formData.count}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            className="form-control"
            value={formData.language}
            onChange={handleChange}
          >
            <option value="english">English</option>
            <option value="dutch">Dutch</option>
            <option value="french">French</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading && !generatedExercises ? 'Generating...' : 'Generate Exercises'}
        </button>
      </form>
      
      {generatedExercises && (
        <div className="generated-exercises mt-4">
          <h3>Generated Exercises</h3>
          
          <div className="exercise-actions mb-3">
            <button 
              className="btn btn-success mr-2" 
              onClick={handleSaveAll}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save All Exercises'}
            </button>
            
            <button 
              className="btn btn-outline-primary" 
              onClick={handleCreateTemplate}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Template From These Settings'}
            </button>
          </div>
          
          <div className="exercise-preview">
            {generatedExercises && Array.isArray(generatedExercises) && generatedExercises.map((exercise, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header">
                  <strong>Exercise {index + 1}</strong>
                </div>
                <div className="card-body">
                  {renderExercisePreview(exercise, formData.exerciseType)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Render a preview of an exercise based on its type
 */
const renderExercisePreview = (exercise, exerciseType) => {
  if (!exercise) {
    return <div className="alert alert-warning">Exercise data is missing or invalid</div>;
  }
  
  switch (exerciseType) {
    case 'multiple-choice':
      return (
        <div className="multiple-choice-preview">
          <p><strong>Question:</strong> {exercise.question || 'No question provided'}</p>
          <ol type="A">
            {Array.isArray(exercise.options) ? exercise.options.map((option, idx) => (
              <li key={idx} className={idx === exercise.correctAnswer ? 'text-success font-weight-bold' : ''}>
                {option} {idx === exercise.correctAnswer && '✓'}
              </li>
            )) : <li>No options provided</li>}
          </ol>
        </div>
      );
      
    case 'open-ended':
      return (
        <div className="open-ended-preview">
          <p><strong>Question:</strong> {exercise.question}</p>
          {exercise.context && <p><strong>Context:</strong> {exercise.context}</p>}
          <div className="model-answer card bg-light">
            <div className="card-body">
              <h6>Model Answer:</h6>
              <p>{exercise.modelAnswer || exercise.correctAnswer}</p>
            </div>
          </div>
        </div>
      );
      
    case 'fill-in-the-blank':
      // Transform the exercise data to match our component's expected format if needed
      const transformedExercise = {
        instructions: exercise.instructions || 'Fill in the blanks with the correct answers.',
        passage: exercise.text || exercise.passage || '',
        blanks: []
      };
      
      // Handle different possible data formats
      if (Array.isArray(exercise.answers) && exercise.text) {
        // Create blanks from the answers array
        const blankRegex = /\{\{blank\}\}/g;
        const blankMatches = [...exercise.text.matchAll(blankRegex)];
        
        blankMatches.forEach((match, idx) => {
          if (idx < exercise.answers.length) {
            transformedExercise.blanks.push({
              id: String(idx + 1),
              acceptedAnswers: [exercise.answers[idx]]
            });
          }
        });
        
        // Replace {{blank}} with {{blank:id:answer}} format
        transformedExercise.passage = exercise.text.replace(
          blankRegex,
          (match, offset) => {
            const matchIndex = blankMatches.findIndex(m => m.index === offset);
            if (matchIndex !== -1 && matchIndex < exercise.answers.length) {
              return `{{blank:${matchIndex + 1}:${exercise.answers[matchIndex]}}}`;
            }
            return match;
          }
        );
      } else if (exercise.blanks) {
        // If the exercise already has blanks property, use it
        transformedExercise.blanks = exercise.blanks;
      }
      
      return <FillInBlankExerciseSimple exercise={transformedExercise} />;
      
      
    case 'matching':
      // Convert legacy format to new format if needed
      const matchingExercise = {
        question: exercise.instructions || 'Match the items in the left column with the corresponding items in the right column.',
        word_bank: Array.isArray(exercise.leftItems) ? exercise.leftItems : [],
        match_options: Array.isArray(exercise.rightItems) ? exercise.rightItems : [],
        correct_answer: {}
      };
      
      // Handle legacy matches format
      if (Array.isArray(exercise.matches)) {
        exercise.matches.forEach(match => {
          const leftItem = matchingExercise.word_bank[match[0]];
          const rightItem = matchingExercise.match_options[match[1]];
          if (leftItem && rightItem) {
            matchingExercise.correct_answer[leftItem] = rightItem;
          }
        });
      }
      
      // Handle new matching_words format
      if (exercise.word_bank && exercise.match_options && exercise.correct_answer) {
        // Use data directly from the new format
        return (
          <MatchingWords 
            exercise={exercise} 
            readOnly={true} 
            showCorrectAnswers={true} 
          />
        );
      }
      
      // Use converted data from old format
      return (
        <MatchingWords 
          exercise={matchingExercise} 
          readOnly={true} 
          showCorrectAnswers={true} 
        />
      );
      
    case 'true-false':
      return (
        <div className="true-false-preview">
          <p><strong>Statement:</strong> {exercise.statement || exercise.question}</p>
          <p><strong>Answer:</strong> {exercise.correctAnswer ? 'True' : 'False'}</p>
          {exercise.explanation && (
            <p><strong>Explanation:</strong> {exercise.explanation}</p>
          )}
        </div>
      );
      
    default:
      return (
        <div className="general-preview">
          <p><strong>Question:</strong> {exercise.question}</p>
          {exercise.correctAnswer && (
            <p><strong>Answer:</strong> {exercise.correctAnswer}</p>
          )}
        </div>
      );
  }
};

export default ExerciseGenerator;
