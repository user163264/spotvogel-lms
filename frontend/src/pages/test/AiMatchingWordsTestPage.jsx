/**
 * AI Matching Words Test Page
 * 
 * This page demonstrates the integration between our AI generation system and
 * the optimized MatchingWords component. It allows for real-time generation
 * of exercises using the OpenAI API.
 * 
 * Created by: Alex Ex
 * Date: March 28, 2025
 */

import React, { useState, useCallback, useEffect } from 'react';
import SimpleMatchingExercise from '../../components/exercises/SimpleMatchingExercise';
import { validateMatchingExercise, attemptAutoCorrection } from '../../services/ai/matching-words-validation';
import { aiService } from '../../services/ai/ai-service';
import './AiMatchingWordsTestPage.css';

/**
 * Test page for AI-generated matching words exercises
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
        // Try to auto-correct the exercise
        const correctedExercise = attemptAutoCorrection(response);
        
        if (correctedExercise) {
          setExerciseData(correctedExercise);
          setValidationResult({
            ...validation,
            warnings: [...validation.warnings, 'Exercise was auto-corrected due to validation issues.']
          });
        } else {
          throw new Error(`Invalid exercise data: ${validation.errors.join(', ')}`);
        }
      } else {
        // Update exercise data if valid
        setExerciseData(response);
      }
      
      // Reset student answers and component key
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
      <p className="test-description">This test page uses the OpenAI API to generate matching exercises in real-time.</p>
      
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
      
      {/* Loading indicator */}
      {isGenerating && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Generating exercise with OpenAI...</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {/* Validation warnings */}
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
      
      {/* Exercise component */}
      {exerciseData && (
        <div className="exercise-container">
          <h2>{exerciseData.question}</h2>
          
          <SimpleMatchingExercise
            key={`exercise-${componentKey}`}
            wordBank={exerciseData.word_bank}
            matchOptions={exerciseData.match_options}
            correctAnswer={exerciseData.correct_answer}
            studentAnswers={studentAnswers}
            onAnswerChange={handleAnswerChange}
            readOnly={false}
            showAnswers={false}
          />
          
          {/* JSON view for debugging */}
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
      
      {/* Implementation notes */}
      <div className="notes">
        <h3>Implementation Notes:</h3>
        <ul>
          <li>Uses OpenAI's API to generate exercises based on topic, difficulty, and language</li>
          <li>Validates the API response before passing to the component</li>
          <li>Uses key-based remounting to ensure clean state between exercises</li>
          <li>Shows errors, warnings, and JSON data for debugging</li>
          <li>Try different topics like "art", "geography", "science", "history", etc.</li>
        </ul>
      </div>
    </div>
  );
};

export default AiMatchingWordsTestPage;
