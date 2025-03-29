import React, { useState, useCallback, useEffect } from 'react';
import MatchingWordsOptimized from '../../components/exercises/MatchingWordsOptimized';
import { validateMatchingExercise } from '../ai-integration/matching-words-validation';
import { aiService } from './aiService';

/**
 * Test page for AI-generated matching words exercises
 * 
 * This component demonstrates the integration between our AI generation
 * and Finny's optimized MatchingWords component using the real OpenAI API.
 */
const AiMatchingWordsTestPage = () => {
  // State for the generated exercise
  const [exerciseData, setExerciseData] = useState(null);
  
  // State for component remounting
  const [componentKey, setComponentKey] = useState(0);
  
  // State for student answers
  const [studentAnswers, setStudentAnswers] = useState({});
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [topic, setTopic] = useState('art');
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('en');
  
  // Debug view state
  const [showJson, setShowJson] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  
  /**
   * Handle answer changes from the component
   */
  const handleAnswerChange = useCallback((answers) => {
    console.log('Answers updated:', answers);
    setStudentAnswers(answers);
  }, []);
  
  /**
   * Reset current exercise
   */
  const handleReset = useCallback(() => {
    setStudentAnswers({});
    setComponentKey(prev => prev + 1);
  }, []);
  
  /**
   * Generate a new exercise using OpenAI
   */
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setApiResponse(null);
    
    try {
      // Call OpenAI through our service
      const response = await aiService.generateExercise(topic, difficulty, language);
      setApiResponse(response); // Store raw response for debugging
      
      // Validate the response
      const validation = validateMatchingExercise(response);
      setValidationResult(validation);
      
      if (!validation.isValid) {
        throw new Error(`Invalid exercise data: ${validation.errors.join(', ')}`);
      }
      
      // Update exercise data and reset state
      setExerciseData(response);
      setStudentAnswers({});
      setComponentKey(prev => prev + 1);
    } catch (err) {
      console.error('Error generating exercise:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [topic, difficulty, language]);
  
  // Generate an initial exercise on mount
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);
  
  return (
    <div className="ai-matching-words-test-page">
      <h1>AI-Generated Matching Words Test</h1>
      <p>This test page uses the OpenAI API to generate exercises that are rendered with Finny's optimized component.</p>
      
      <div className="test-controls">
        <div className="control-group">
          <label>
            Topic:
            <input 
              type="text" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              disabled={isGenerating}
            />
          </label>
          
          <label>
            Difficulty:
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={isGenerating}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          
          <label>
            Language:
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isGenerating}
            >
              <option value="en">English</option>
              <option value="nl">Dutch</option>
              <option value="fr">French</option>
            </select>
          </label>
        </div>
        
        <div className="button-group">
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="primary-button"
          >
            {isGenerating ? 'Generating...' : 'Generate New Exercise'}
          </button>
          
          <button 
            onClick={handleReset} 
            disabled={isGenerating || !exerciseData}
            className="secondary-button"
          >
            Reset Answers
          </button>
          
          <button 
            onClick={() => setShowJson(!showJson)}
            disabled={!exerciseData}
            className="debug-button"
          >
            {showJson ? 'Hide JSON' : 'Show JSON'}
          </button>
        </div>
      </div>
      
      {isGenerating && (
        <div className="loading-indicator">
          <p>Generating exercise with OpenAI...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {validationResult && validationResult.warnings.length > 0 && (
        <div className="warning-message">
          <h3>Warnings:</h3>
          <ul>
            {validationResult.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      {exerciseData && (
        <div className="exercise-container">
          <h2>{exerciseData.question}</h2>
          
          <MatchingWordsOptimized
            key={`exercise-${componentKey}`}
            wordBank={exerciseData.word_bank}
            matchOptions={exerciseData.match_options}
            correctAnswer={exerciseData.correct_answer}
            studentAnswers={studentAnswers}
            onAnswerChange={handleAnswerChange}
            readOnly={false}
            showAnswers={false}
          />
          
          {showJson && (
            <div className="json-view">
              <h3>Exercise JSON:</h3>
              <pre>{JSON.stringify(exerciseData, null, 2)}</pre>
              
              <h3>Student Answers:</h3>
              <pre>{JSON.stringify(studentAnswers, null, 2)}</pre>
              
              {apiResponse && (
                <>
                  <h3>Raw API Response:</h3>
                  <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                </>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="notes">
        <h3>Implementation Notes:</h3>
        <ul>
          <li>Uses OpenAI's API to generate exercises based on topic, difficulty, and language</li>
          <li>Validates the API response before passing to the component</li>
          <li>Uses key-based remounting to ensure clean state between exercises</li>
          <li>Shows errors, warnings, and JSON data for debugging</li>
        </ul>
      </div>
    </div>
  );
};

export default AiMatchingWordsTestPage;
