/**
 * Matching Exercise Demo Page
 * A test page to demonstrate the MatchingExercise component
 */

import React, { useState, useEffect } from 'react';
import MatchingExercise from '../components/exercises/matching/MatchingExerciseAdapter';
import exerciseService from '../services/api/exerciseService';
import './MatchingExerciseDemoPage.css';

// Debug mode - controlled via environment variable
const DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';

// Demo modes
const DEMO_MODES = {
  MOCK: 'mock',
  API: 'api',
  GENERATOR: 'generator'
};

const MatchingExerciseDemoPage = () => {
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(DEMO_MODES.MOCK);
  const [generatorInput, setGeneratorInput] = useState('');
  const [generatorOptions, setGeneratorOptions] = useState({
    numberOfPairs: 5,
    difficulty: 'medium',
    language: 'nl'
  });
  const [submissionResult, setSubmissionResult] = useState(null);
  
  // Log debug information
  const debugLog = (label, data) => {
    if (DEBUG) {
      console.group(`🔍 ${label}`);
      if (data) {
        if (typeof data === 'object') {
          console.log(JSON.stringify(data, null, 2));
        } else {
          console.log(data);
        }
      }
      console.groupEnd();
    }
  };
  
  // Load exercise based on the selected demo mode
  useEffect(() => {
    const loadExercise = async () => {
      try {
        setLoading(true);
        setError(null);
        setSubmissionResult(null);
        
        debugLog(`Loading exercise in ${demoMode} mode`);
        
        let exerciseData;
        
        switch (demoMode) {
          case DEMO_MODES.API:
            // In a real app, you would fetch from API using exerciseService.getMatchingExercise(id)
            // For demo, we're just using mock data
            exerciseData = await Promise.resolve(exerciseService.createMockMatchingExercise());
            break;
          
          case DEMO_MODES.GENERATOR:
            // This would connect to the real API in a production environment
            if (generatorInput) {
              // Mock generating an exercise
              exerciseData = exerciseService.createMockMatchingExercise();
              // Add a fake delay to simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              exerciseData = null;
            }
            break;
          
          case DEMO_MODES.MOCK:
          default:
            exerciseData = exerciseService.createMockMatchingExercise();
            break;
        }
        
        setExercise(exerciseData);
        debugLog('Exercise loaded', exerciseData);
      } catch (err) {
        debugLog('Error loading exercise', err);
        setError(`Error loading exercise: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadExercise();
  }, [demoMode]);
  
  // Handle submission of the exercise
  const handleSubmit = async (submissionData) => {
    try {
      debugLog('Exercise submitted', submissionData);
      
      // In a real app, this would call exerciseService.submitMatchingExercise()
      // For demo, we'll simulate a response
      
      // Calculate the score based on the correct answers
      const correctAnswers = exercise.correct_answer;
      const studentAnswers = submissionData.answers;
      
      const correctCount = Object.keys(studentAnswers).filter(
        key => studentAnswers[key] === correctAnswers[key]
      ).length;
      
      const result = {
        success: true,
        score: correctCount,
        maxScore: exercise.max_score,
        percentageScore: (correctCount / exercise.max_score) * 100,
        correctMatches: Object.keys(studentAnswers)
          .filter(key => studentAnswers[key] === correctAnswers[key])
          .map(key => ({
            item: key,
            match: studentAnswers[key]
          })),
        incorrectMatches: Object.keys(studentAnswers)
          .filter(key => studentAnswers[key] !== correctAnswers[key])
          .map(key => ({
            item: key,
            yourAnswer: studentAnswers[key],
            correctAnswer: correctAnswers[key]
          })),
        feedback: `You scored ${correctCount} out of ${exercise.max_score}. You correctly matched ${correctCount} items.`
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSubmissionResult(result);
      debugLog('Submission result', result);
      
      return result;
    } catch (err) {
      debugLog('Error submitting exercise', err);
      setError(`Error submitting exercise: ${err.message}`);
      return null;
    }
  };
  
  // Handle generator input change
  const handleGeneratorInputChange = (e) => {
    setGeneratorInput(e.target.value);
  };
  
  // Handle generator options change
  const handleGeneratorOptionChange = (option, value) => {
    setGeneratorOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  // Handle generate button click
  const handleGenerateClick = async () => {
    try {
      setLoading(true);
      setError(null);
      setSubmissionResult(null);
      
      debugLog('Generating exercise', {
        content: generatorInput,
        options: generatorOptions
      });
      
      // In a real app, this would call exerciseService.generateMatchingExercise()
      // For demo, we'll just use mock data with a delay
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use mock data
      const exerciseData = exerciseService.createMockMatchingExercise();
      
      setExercise(exerciseData);
      debugLog('Generated exercise', exerciseData);
    } catch (err) {
      debugLog('Error generating exercise', err);
      setError(`Error generating exercise: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="matching-exercise-demo-page">
      <header className="demo-header">
        <h1>Matching Exercise Demo</h1>
        <p>This page demonstrates the MatchingExercise component in different modes.</p>
      </header>
      
      <div className="demo-controls">
        <div className="demo-mode-selector">
          <h2>Demo Mode</h2>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="demoMode"
                value={DEMO_MODES.MOCK}
                checked={demoMode === DEMO_MODES.MOCK}
                onChange={() => setDemoMode(DEMO_MODES.MOCK)}
              />
              Mock Data
            </label>
            
            <label>
              <input
                type="radio"
                name="demoMode"
                value={DEMO_MODES.API}
                checked={demoMode === DEMO_MODES.API}
                onChange={() => setDemoMode(DEMO_MODES.API)}
              />
              API (Simulated)
            </label>
            
            <label>
              <input
                type="radio"
                name="demoMode"
                value={DEMO_MODES.GENERATOR}
                checked={demoMode === DEMO_MODES.GENERATOR}
                onChange={() => setDemoMode(DEMO_MODES.GENERATOR)}
              />
              Generator
            </label>
          </div>
        </div>
        
        {demoMode === DEMO_MODES.GENERATOR && (
          <div className="generator-controls">
            <h2>Exercise Generator</h2>
            <div className="generator-form">
              <div className="form-group">
                <label htmlFor="generator-input">Lesson Content:</label>
                <textarea
                  id="generator-input"
                  value={generatorInput}
                  onChange={handleGeneratorInputChange}
                  rows="6"
                  placeholder="Paste lesson content here..."
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pairs">Number of Pairs:</label>
                  <select
                    id="pairs"
                    value={generatorOptions.numberOfPairs}
                    onChange={(e) => handleGeneratorOptionChange('numberOfPairs', parseInt(e.target.value))}
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty:</label>
                  <select
                    id="difficulty"
                    value={generatorOptions.difficulty}
                    onChange={(e) => handleGeneratorOptionChange('difficulty', e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="language">Language:</label>
                  <select
                    id="language"
                    value={generatorOptions.language}
                    onChange={(e) => handleGeneratorOptionChange('language', e.target.value)}
                  >
                    <option value="nl">Dutch</option>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
              
              <button
                className="generate-btn"
                onClick={handleGenerateClick}
                disabled={!generatorInput.trim() || loading}
              >
                {loading ? 'Generating...' : 'Generate Exercise'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="exercise-container">
        <h2>Exercise Preview</h2>
        
        {loading && (
          <div className="loading-message">Loading exercise...</div>
        )}
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        {!loading && !error && exercise && (
          <MatchingExercise
            key={`exercise-${demoMode}-${exercise.exercise_id || Date.now()}`}
            exercise={exercise}
            onSubmit={handleSubmit}
            feedbackData={submissionResult}
            showCorrectAnswers={!!submissionResult}
          />
        )}
        
        {!loading && !error && !exercise && demoMode === DEMO_MODES.GENERATOR && (
          <div className="placeholder-message">
            Enter lesson content and click "Generate Exercise" to create a matching exercise.
          </div>
        )}
      </div>
      
      {DEBUG && (
        <div className="debug-panel">
          <h3>Debug Panel</h3>
          <details>
            <summary>Current Exercise Data</summary>
            <pre>{JSON.stringify(exercise, null, 2)}</pre>
          </details>
          
          <details>
            <summary>Submission Result</summary>
            <pre>{JSON.stringify(submissionResult, null, 2)}</pre>
          </details>
          
          <details>
            <summary>Generator Options</summary>
            <pre>{JSON.stringify(generatorOptions, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default MatchingExerciseDemoPage;
