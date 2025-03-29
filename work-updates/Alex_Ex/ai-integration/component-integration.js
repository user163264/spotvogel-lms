/**
 * Matching Words Component Integration
 * 
 * This file demonstrates how to integrate the AI-generated exercises with
 * Finny's optimized MatchingWords component.
 * 
 * Created by: Alex Ex
 * Date: March 28, 2025
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import MatchingWordsOptimized from '../components/exercises/MatchingWordsOptimized';
import { validateMatchingExercise, normalizeExerciseData } from './matching-words-validation';
import { generateMatchingWordsPrompt } from './matching-words-prompt-template';
import { aiService } from '../services/ai-service';

/**
 * ExerciseGenerator component that uses AI to generate matching words exercises
 * and integrates with Finny's optimized component
 */
const ExerciseGenerator = ({ topic, difficulty, language, onExerciseGenerated }) => {
  // State for the generated exercise
  const [exerciseData, setExerciseData] = useState(null);
  
  // State for exercise validation
  const [validationResult, setValidationResult] = useState(null);
  
  // State for tracking the generation process
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  // State for student answers
  const [studentAnswers, setStudentAnswers] = useState({});
  
  // Key for remounting the component when necessary
  const [componentKey, setComponentKey] = useState(0);
  
  // Track the current exercise ID for proper remounting
  const currentExerciseIdRef = useRef(null);
  
  /**
   * Handles generating a new exercise
   */
  const handleGenerateExercise = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Create the AI prompt
      const prompt = generateMatchingWordsPrompt(
        topic,
        difficulty,
        difficulty === 'easy' ? 4 : difficulty === 'hard' ? 6 : 5,
        language
      );
      
      // Call the AI service
      const aiResponse = await aiService.generateExercise(prompt);
      
      // Parse the response
      let exerciseData;
      try {
        // Extract the JSON from the AI response (might be embedded in text)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
        exerciseData = JSON.parse(jsonStr);
      } catch (parseError) {
        throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
      }
      
      // Validate the exercise data
      const validation = validateMatchingExercise(exerciseData);
      setValidationResult(validation);
      
      if (!validation.isValid) {
        throw new Error(`Invalid exercise data: ${validation.errors.join(', ')}`);
      }
      
      // Normalize the data to ensure proper format
      const normalizedData = normalizeExerciseData(exerciseData);
      
      // Generate a unique ID for the exercise
      normalizedData.id = `matching-words-${Date.now()}`;
      
      // Update the ref and trigger remount
      if (currentExerciseIdRef.current !== normalizedData.id) {
        currentExerciseIdRef.current = normalizedData.id;
        setComponentKey(prev => prev + 1);
        setStudentAnswers({});
      }
      
      // Update state with the new exercise
      setExerciseData(normalizedData);
      
      // Notify parent
      if (onExerciseGenerated) {
        onExerciseGenerated(normalizedData);
      }
    } catch (error) {
      console.error('Exercise generation failed:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  }, [topic, difficulty, language, onExerciseGenerated]);
  
  /**
   * Handles when a student changes their answers
   */
  const handleAnswerChange = useCallback((answers) => {
    setStudentAnswers(answers);
  }, []);
  
  /**
   * Resets the current exercise
   */
  const handleReset = useCallback(() => {
    setStudentAnswers({});
    setComponentKey(prev => prev + 1);
  }, []);
  
  /**
   * Regenerates the exercise with the same parameters
   */
  const handleRegenerate = useCallback(() => {
    setStudentAnswers({});
    handleGenerateExercise();
  }, [handleGenerateExercise]);
  
  /**
   * Generate an exercise on initial load
   */
  useEffect(() => {
    if (topic) {
      handleGenerateExercise();
    }
  }, [topic, handleGenerateExercise]);
  
  return (
    <div className="exercise-generator">
      <div className="exercise-controls">
        <h2>Matching Words Exercise Generator</h2>
        
        <div className="control-row">
          <button 
            onClick={handleGenerateExercise} 
            disabled={isGenerating}
            className="primary-button"
          >
            {isGenerating ? 'Generating...' : 'Generate New Exercise'}
          </button>
          
          <button 
            onClick={handleRegenerate} 
            disabled={isGenerating || !exerciseData}
            className="secondary-button"
          >
            Regenerate
          </button>
          
          <button 
            onClick={handleReset} 
            disabled={!exerciseData}
            className="reset-button"
          >
            Reset Answers
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}
        
        {validationResult && validationResult.warnings.length > 0 && (
          <div className="warning-message">
            <p>Warnings:</p>
            <ul>
              {validationResult.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {exerciseData && (
        <div className="exercise-content">
          <h3>{exerciseData.question}</h3>
          
          <div className="matching-exercise-container">
            <MatchingWordsOptimized
              key={`exercise-${exerciseData.id}-${componentKey}`}
              wordBank={exerciseData.word_bank}
              matchOptions={exerciseData.match_options}
              correctAnswer={exerciseData.correct_answer}
              studentAnswers={studentAnswers}
              onAnswerChange={handleAnswerChange}
              readOnly={false}
              showAnswers={false}
            />
          </div>
          
          <div className="exercise-metadata">
            <p>Difficulty: <span className={`difficulty-${difficulty}`}>{difficulty}</span></p>
            <p>Language: {language}</p>
            <p>Items: {exerciseData.word_bank.length}</p>
            <p>Max Score: {exerciseData.max_score}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Integration with ExerciseView - renders a matching words exercise
 * from saved data
 */
export function renderMatchingWordsExercise(exercise, props) {
  // Early return for null exercise data
  if (!exercise) return null;
  
  try {
    // Generate a unique key including the exercise ID to ensure proper remounting
    const exerciseKey = `matching-words-${exercise.id}-${props.mode || 'default'}`;
    
    // Normalize data format
    const normalizedData = normalizeExerciseData(exercise);
    
    // Pass only the required props to prevent unnecessary re-renders
    return (
      <MatchingWordsOptimized
        key={exerciseKey}
        wordBank={normalizedData.word_bank}
        matchOptions={normalizedData.match_options}
        correctAnswer={normalizedData.correct_answer}
        studentAnswers={props.studentAnswers || {}}
        onAnswerChange={props.onAnswerChange}
        readOnly={props.readOnly || false}
        showAnswers={props.showAnswers || false}
      />
    );
  } catch (error) {
    console.error('Error rendering matching words exercise:', error);
    return (
      <div className="exercise-error">
        <p>Error rendering exercise. Please try again later.</p>
        {process.env.NODE_ENV === 'development' && (
          <pre>{error.message}</pre>
        )}
      </div>
    );
  }
}

export default ExerciseGenerator;
