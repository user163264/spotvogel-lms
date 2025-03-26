import React, { useState } from 'react';
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
      setGeneratedExercises(result.exercises);
      setSuccess('Exercises generated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate exercises');
      console.error('Exercise generation error:', err);
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
            {generatedExercises.map((exercise, index) => (
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
  switch (exerciseType) {
    case 'multiple-choice':
      return (
        <div className="multiple-choice-preview">
          <p><strong>Question:</strong> {exercise.question}</p>
          <ol type="A">
            {exercise.options.map((option, idx) => (
              <li key={idx} className={idx === exercise.correctAnswer ? 'text-success font-weight-bold' : ''}>
                {option} {idx === exercise.correctAnswer && '✓'}
              </li>
            ))}
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
      return (
        <div className="fill-in-blank-preview">
          <p><strong>Instructions:</strong> Fill in the blanks with the correct answers.</p>
          <p>{exercise.text}</p>
          <div className="answers">
            <p><strong>Answers:</strong></p>
            <ol>
              {exercise.answers.map((answer, idx) => (
                <li key={idx}>{answer}</li>
              ))}
            </ol>
          </div>
        </div>
      );
      
    case 'matching':
      return (
        <div className="matching-preview">
          <p><strong>Instructions:</strong> Match the items in the left column with the corresponding items in the right column.</p>
          <div className="row">
            <div className="col-5">
              <h6>Left Items:</h6>
              <ol>
                {exercise.leftItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="col-5">
              <h6>Right Items:</h6>
              <ol type="A">
                {exercise.rightItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="matches">
            <p><strong>Correct Matches:</strong></p>
            <ul>
              {exercise.matches.map((match, idx) => (
                <li key={idx}>
                  {match[0] + 1} → {String.fromCharCode(65 + match[1])}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
