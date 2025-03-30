/**
 * AI Matching Exercise Demo Page
 * 
 * This page demonstrates the AIMatchingExerciseAdapter component with user input
 * and OpenAI API integration for dynamic exercise generation.
 * 
 * Created by: Alex Ex (AI Exercise Generation Specialist)
 * Date: March 30, 2025
 * Updated: Now using interactive lesson content input with OpenAI API integration
 */

import React, { useState, useEffect } from 'react';
import './AIMatchingExerciseDemoPage.css';
import AIMatchingExerciseAdapter from '../components/exercises/AIMatchingExerciseAdapter';
import { DIFFICULTY_LEVELS, SUPPORTED_LANGUAGES } from '../config/config';
import { aiService } from '../services/ai/ai-service';

const AIMatchingExerciseDemoPage = () => {
  const [lessonContent, setLessonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exerciseResult, setExerciseResult] = useState(null);
  const [generatingExercise, setGeneratingExercise] = useState(false);
  const [exercise, setExercise] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [exerciseOptions, setExerciseOptions] = useState({
    numberOfPairs: 5,
    difficulty: 'medium', // Default to medium
    language: 'nl' // Default to Dutch
  });

  // Initial content for demonstration purposes
  useEffect(() => {
    const initialContent = `Beroemde Schilderijen: 14 Kunstwerken die Gen Z Moet Kennen
Sommige schilderijen zijn wereldberoemd. Denk aan de glimlach van de Mona Lisa, de angst in De Schreeuw en de sterrenhemel van Sterrennacht. Je hebt deze beelden vast al eens gezien in memes, films of op sociale media. Maar wist je dat elk van deze schilderijen een bijzonder verhaal heeft? Kunst is niet alleen voor musea of geschiedenisboeken. Deze meesterwerken hebben invloed gehad op mode, emoji's en zelfs TikTok!`;
    
    setLessonContent(initialContent);
  }, []);

  // Handle exercise generation from user-provided content
  const handleGenerateExercise = async () => {
    if (!lessonContent.trim()) {
      setError('Please enter some lesson content');
      return;
    }

    if (!apiKey && !process.env.REACT_APP_OPENAI_API_KEY) {
      setError('Please enter an OpenAI API key');
      return;
    }

    try {
      setGeneratingExercise(true);
      setError(null);
      
      // Set the API key for this request if provided
      if (apiKey) {
        aiService.setTemporaryApiKey(apiKey);
      }
      
      // Call our AI service directly to generate the exercise
      const generatedExercise = await generateMatchingExerciseFromContent(
        lessonContent,
        exerciseOptions
      );
      
      setExercise(generatedExercise);
    } catch (err) {
      console.error('Error generating exercise:', err);
      setError(err.message || 'Failed to generate exercise');
    } finally {
      setGeneratingExercise(false);
      // Clear temporary API key after use
      if (apiKey) {
        aiService.clearTemporaryApiKey();
      }
    }
  };

  // Function to generate a matching exercise from user content
  const generateMatchingExerciseFromContent = async (content, options) => {
    // Extract a more meaningful topic from the content
    // Look for the first sentence or use the first 20-30 characters
    const firstSentenceMatch = content.match(/^[^.!?]+[.!?]/); 
    const topic = firstSentenceMatch 
      ? firstSentenceMatch[0].trim() 
      : content.split('\n')[0].trim().slice(0, 30);
    
    try {
      // Call the AI service to generate the exercise
      const result = await aiService.generateExercise(
        topic,
        options.difficulty,
        options.language
      );
      
      // Log the result for debugging
      console.log('OpenAI response structure:', JSON.stringify(result, null, 2));
      
      // Validate the response structure
      if (!result.word_bank || !Array.isArray(result.word_bank) || result.word_bank.length === 0) {
        console.error('Invalid or missing word_bank in API response');
        throw new Error('The AI generated an invalid exercise format. Please try again.');
      }
      
      if (!result.match_options || !Array.isArray(result.match_options) || result.match_options.length === 0) {
        console.error('Invalid or missing match_options in API response');
        throw new Error('The AI generated an invalid exercise format. Please try again.');
      }
      
      if (!result.correct_answer || typeof result.correct_answer !== 'object') {
        console.error('Invalid or missing correct_answer in API response');
        throw new Error('The AI generated an invalid exercise format. Please try again.');
      }
      
      // Ensure the correct_answer keys match items in word_bank
      const allKeysValid = Object.keys(result.correct_answer).every(key => 
        result.word_bank.includes(key)
      );
      
      if (!allKeysValid) {
        console.error('correct_answer keys do not match word_bank items');
        console.log('word_bank:', result.word_bank);
        console.log('correct_answer keys:', Object.keys(result.correct_answer));
        // Try to fix the issue by reconstructing correct_answer if possible
        if (result.word_bank.length === Object.keys(result.correct_answer).length) {
          const fixedCorrectAnswer = {};
          result.word_bank.forEach((item, index) => {
            const values = Object.values(result.correct_answer);
            if (index < values.length) {
              fixedCorrectAnswer[item] = values[index];
            }
          });
          result.correct_answer = fixedCorrectAnswer;
          console.log('Reconstructed correct_answer:', fixedCorrectAnswer);
        } else {
          throw new Error('The AI generated an invalid matching structure. Please try again.');
        }
      }
      
      // Transform the result into the expected format for AIMatchingExerciseAdapter
      return {
        exercise_type: 'matching_words',
        question: result.question || 'Match the items on the left with the items on the right.',
        word_bank: result.word_bank || [],
        match_options: result.match_options || [],
        correct_answer: result.correct_answer || {},
        max_score: result.word_bank?.length || 5,
        grading_type: 'auto'
      };
    } catch (error) {
      console.error('Error in generateMatchingExerciseFromContent:', error);
      throw new Error('Failed to generate exercise from content: ' + error.message);
    }
  };
  
  // Handle exercise completion
  const handleExerciseCompleted = (result) => {
    console.log('Exercise completed:', result);
    setExerciseResult(result);
  };
  
  // Handle exercise generation error
  const handleError = (errorMessage) => {
    console.error('Exercise generation error:', errorMessage);
    setError(errorMessage);
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    setExerciseOptions({
      ...exerciseOptions,
      difficulty: e.target.value
    });
  };
  
  // Handle language change
  const handleLanguageChange = (e) => {
    setExerciseOptions({
      ...exerciseOptions,
      language: e.target.value
    });
  };
  
  // Handle number of pairs change
  const handlePairsChange = (e) => {
    setExerciseOptions({
      ...exerciseOptions,
      numberOfPairs: parseInt(e.target.value, 10)
    });
  };
  
  // Handle API key visibility toggle
  const toggleApiKeyVisibility = () => {
    setApiKeyVisible(!apiKeyVisible);
  };

  // Handle API key change
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };
  
  return (
    <div className="ai-matching-exercise-demo-page">
      <div className="demo-header">
        <h1>AI Matching Exercise Generator</h1>
        <p>This demo shows how AI can automatically generate matching exercises from lesson content.</p>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <h2>Loading Lesson Content...</h2>
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      ) : (
        <div className="demo-content">
          {/* API Key Input */}
          <div className="api-key-container">
            <h2>OpenAI API Key</h2>
            <div className="api-key-input-container">
              <div className="api-key-input-group">
                <input
                  type={apiKeyVisible ? "text" : "password"}
                  className="api-key-input"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your OpenAI API key here (sk-...)"
                />
                <button 
                  className="api-key-toggle"
                  onClick={toggleApiKeyVisibility}
                  title={apiKeyVisible ? "Hide API key" : "Show API key"}
                >
                  {apiKeyVisible ? "Hide" : "Show"}
                </button>
              </div>
              <p className="api-key-info">
                Your API key is required to generate exercises and is only used for this demo.
                It is not stored on the server.
              </p>
            </div>
          </div>
          
          <div className="lesson-content-input">
            <h2>Lesson Content Input</h2>
            <div className="content-input-container">
              <textarea
                className="lesson-content-textarea"
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                placeholder="Paste or type your lesson content here..."
                rows={10}
              />
              
              <div className="exercise-options">
                <div className="option-group">
                  <label htmlFor="difficulty">Difficulty:</label>
                  <select 
                    id="difficulty" 
                    value={exerciseOptions.difficulty}
                    onChange={handleDifficultyChange}
                  >
                    {DIFFICULTY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="option-group">
                  <label htmlFor="language">Language:</label>
                  <select 
                    id="language" 
                    value={exerciseOptions.language}
                    onChange={handleLanguageChange}
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="option-group">
                  <label htmlFor="pairs">Number of pairs:</label>
                  <select 
                    id="pairs" 
                    value={exerciseOptions.numberOfPairs}
                    onChange={handlePairsChange}
                  >
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                </div>
              </div>
              
              <button 
                className="generate-button"
                onClick={handleGenerateExercise}
                disabled={generatingExercise || !lessonContent.trim() || (!apiKey && !process.env.REACT_APP_OPENAI_API_KEY)}
              >
                {generatingExercise ? 'Generating...' : 'Generate Exercise'}
              </button>
            </div>
          </div>
          
          <div className="exercise-container">
            <h2>Generated Exercise</h2>
            {exercise ? (
              <AIMatchingExerciseAdapter
                lessonContent={lessonContent}
                exerciseOptions={exerciseOptions}
                onExerciseCompleted={handleExerciseCompleted}
                onError={handleError}
                initialExercise={exercise} // Pass the generated exercise directly
              />
            ) : (
              <div className="no-exercise">
                <p>Enter lesson content and your OpenAI API key, then click "Generate Exercise" to create a matching exercise.</p>
              </div>
            )}
          </div>
          
          {exerciseResult && (
            <div className="exercise-result">
              <h2>Exercise Result</h2>
              <div className="result-data">
                <p><strong>Score:</strong> {exerciseResult.score} out of {exerciseResult.maxScore}</p>
                <p><strong>Percentage:</strong> {((exerciseResult.score / exerciseResult.maxScore) * 100).toFixed(0)}%</p>
                <div className="result-summary">
                  <h3>Summary</h3>
                  <p>You completed the matching exercise with {exerciseResult.feedback.correctMatches.length} correct matches and {exerciseResult.feedback.incorrectMatches.length} incorrect matches.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="demo-footer">
        <p>This demo showcases how the LMS system can use AI to automatically generate interactive exercises from lesson content, reducing teacher workload.</p>
        <p>Created by Alex Ex, AI Exercise Generation Specialist</p>
      </div>
    </div>
  );
};

export default AIMatchingExerciseDemoPage;