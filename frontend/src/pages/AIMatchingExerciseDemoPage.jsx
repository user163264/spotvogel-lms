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
import { Card, Button } from '../components/ui';
import { TextArea } from '../components/ui/form';
import AIMatchingExerciseAdapter from '../components/exercises/AIMatchingExerciseAdapter';
import { DIFFICULTY_LEVELS, SUPPORTED_LANGUAGES } from '../config/config';
import aiService from '../services/ai/ai-service';

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
    const initialContent = `copy paste your text here`;
    
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
    let topic = '';
    
    // Try to find a title (text at the beginning followed by a line break)
    const titleMatch = content.match(/^([^\n]+)/);
    if (titleMatch && titleMatch[1].trim().length > 0) {
      topic = titleMatch[1].trim();
      // If title is very long, extract just the beginning
      if (topic.length > 50) {
        topic = topic.slice(0, 50);
      }
    } else {
      // Look for the first sentence or use the first 20-30 characters
      const firstSentenceMatch = content.match(/^[^.!?]+[.!?]/); 
      topic = firstSentenceMatch 
        ? firstSentenceMatch[0].trim().slice(0, 50) 
        : content.trim().slice(0, 30);
    }
    
    // Apply additional safety sanitization
    topic = topic.replace(/[\"\{\}\[\]\n\r]/g, ' ').trim();
    
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
  
  // These handlers are no longer needed since we removed the UI controls
  // Values are now automatically used from the initial state
  
  // Handle API key visibility toggle
  const toggleApiKeyVisibility = () => {
    setApiKeyVisible(!apiKeyVisible);
  };

  // Handle API key change
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans w-full box-border">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">AI Matching Exercise Generator</h1>
      </div>
      
      {loading ? (
        <div className="text-center p-8 md:p-12 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Loading Lesson Content...</h2>
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 md:p-8 bg-red-50 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button 
            variant="danger" 
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 max-w-full w-full">
          {/* API Key Input */}
          <Card className="w-full">
            <Card.Header>
              <h2 className="text-xl font-semibold">OpenAI API Key</h2>
            </Card.Header>
            <Card.Body>
              <div className="flex flex-col gap-2">
                <div className="flex w-full">
                  <input
                    type={apiKeyVisible ? "text" : "password"}
                    className="flex-1 p-3 font-mono border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="Enter your OpenAI API key here (sk-...)"
                  />
                  <button 
                    className="px-3 py-3 bg-gray-600 text-white border-none rounded-r-md cursor-pointer transition-colors hover:bg-gray-700"
                    onClick={toggleApiKeyVisibility}
                    title={apiKeyVisible ? "Hide API key" : "Show API key"}
                  >
                    {apiKeyVisible ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-sm text-neutral-500">
                  Your API key is required to generate exercises and is only used for this demo.
                  It is not stored on the server.
                </p>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="w-full">
            <Card.Header>
              <h2 className="text-xl font-semibold">Lesson Content Input</h2>
            </Card.Header>
            <Card.Body>
              <div className="flex flex-col gap-4">
                <TextArea
                  id="lesson-content"
                  rows={10}
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="Paste or type your lesson content here..."
                />
                
                <Button 
                  onClick={handleGenerateExercise}
                  disabled={generatingExercise || !lessonContent.trim() || (!apiKey && !process.env.REACT_APP_OPENAI_API_KEY)}
                  className="self-start"
                >
                  {generatingExercise ? 'Generating...' : 'Generate Exercise'}
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="w-full">
            <Card.Header>
              <h2 className="text-xl font-semibold">Generated Exercise</h2>
            </Card.Header>
            <Card.Body>
              {exercise ? (
                <AIMatchingExerciseAdapter
                  lessonContent={lessonContent}
                  exerciseOptions={exerciseOptions}
                  onExerciseCompleted={handleExerciseCompleted}
                  onError={handleError}
                  initialExercise={exercise} // Pass the generated exercise directly
                />
              ) : (
                <div className="p-8 bg-gray-100 rounded-md text-center text-gray-600 min-h-[180px] flex items-center justify-center">
                  <p>Enter lesson content and your OpenAI API key, then click "Generate Exercise".</p>
                </div>
              )}
            </Card.Body>
          </Card>
          
          {exerciseResult && (
            <Card className="w-full bg-blue-50">
              <Card.Header>
                <h2 className="text-xl font-semibold">Exercise Result</h2>
              </Card.Header>
              <Card.Body>
                <div className="p-4 bg-white rounded-md border border-blue-100">
                  <p className="mb-2"><strong>Score:</strong> {exerciseResult.score} out of {exerciseResult.maxScore}</p>
                  <p className="mb-4"><strong>Percentage:</strong> {((exerciseResult.score / exerciseResult.maxScore) * 100).toFixed(0)}%</p>
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <h3 className="font-medium text-lg mb-2">Summary</h3>
                    <p>You completed the matching exercise with {exerciseResult.feedback.correctMatches.length} correct matches and {exerciseResult.feedback.incorrectMatches.length} incorrect matches.</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          <div className="text-center mt-4 pt-6 border-t border-gray-200 text-gray-600">
            <p className="mb-2">This demo showcases how the LMS system can use AI to automatically generate interactive exercises from lesson content, reducing teacher workload.</p>
            <p>Created by Alex Ex, AI Exercise Generation Specialist</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatchingExerciseDemoPage;