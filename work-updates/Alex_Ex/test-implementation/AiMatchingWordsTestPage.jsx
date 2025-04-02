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
    <div className="max-w-7xl mx-auto p-5 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">AI-Generated Matching Words Test</h1>
      <p className="text-gray-600 mb-5">This test page uses the OpenAI API to generate exercises that are rendered with Finny's optimized component.</p>
      
      <div className="bg-gray-50 rounded-lg p-5 mb-5 flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <label className="flex flex-col gap-1 font-medium text-gray-700">
            Topic:
            <input 
              type="text" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              disabled={isGenerating}
              className="px-3 py-2 border border-gray-300 rounded-md min-w-[200px] text-sm"
            />
          </label>
          
          <label className="flex flex-col gap-1 font-medium text-gray-700">
            Difficulty:
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={isGenerating}
              className="px-3 py-2 border border-gray-300 rounded-md min-w-[200px] text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          
          <label className="flex flex-col gap-1 font-medium text-gray-700">
            Language:
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isGenerating}
              className="px-3 py-2 border border-gray-300 rounded-md min-w-[200px] text-sm"
            >
              <option value="en">English</option>
              <option value="nl">Dutch</option>
              <option value="fr">French</option>
            </select>
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate New Exercise'}
          </button>
          
          <button 
            onClick={handleReset} 
            disabled={isGenerating || !exerciseData}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Answers
          </button>
          
          <button 
            onClick={() => setShowJson(!showJson)}
            disabled={!exerciseData}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showJson ? 'Hide JSON' : 'Show JSON'}
          </button>
        </div>
      </div>
      
      {isGenerating && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-5 rounded">
          <p className="text-blue-700">Generating exercise with OpenAI...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-5 rounded">
          <h3 className="font-bold text-gray-800 mb-2">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {validationResult && validationResult.warnings.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-5 rounded">
          <h3 className="font-bold text-gray-800 mb-2">Warnings:</h3>
          <ul className="list-disc pl-5">
            {validationResult.warnings.map((warning, index) => (
              <li key={index} className="text-yellow-700">{warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      {exerciseData && (
        <div className="bg-white rounded-lg p-5 shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">{exerciseData.question}</h2>
          
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
            <div className="mt-8 pt-5 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Exercise JSON:</h3>
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm max-h-[300px] overflow-y-auto">{JSON.stringify(exerciseData, null, 2)}</pre>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Student Answers:</h3>
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm max-h-[300px] overflow-y-auto">{JSON.stringify(studentAnswers, null, 2)}</pre>
              
              {apiResponse && (
                <>
                  <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Raw API Response:</h3>
                  <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm max-h-[300px] overflow-y-auto">{JSON.stringify(apiResponse, null, 2)}</pre>
                </>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="bg-gray-50 rounded-lg p-5">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Implementation Notes:</h3>
        <ul className="list-disc pl-5 text-gray-600">
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
