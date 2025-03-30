import React, { useState, useCallback } from 'react';
import AIMatchingAdapter from '../adapters/AIMatchingAdapter';
// These imports would be actual paths in the final implementation
// import MatchingWordsSimple from '../../components/exercises/MatchingWordsSimple';
// import { generateExercise } from '../services/IntegratedAIService';

/**
 * TestIntegration
 * 
 * Test harness for the integrated AI exercise generation system.
 * This component allows generating exercises and testing the integration
 * with Finny's MatchingWordsSimple component.
 */
const TestIntegration = ({ MatchingComponent }) => {
  // State
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Mock generateExercise function for testing
  // In the real implementation, this would be imported from IntegratedAIService
  const mockGenerateExercise = async (topic, difficulty, language) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `exercise-${Date.now()}`,
          exercise_type: 'matching_words',
          question: `Match each term with its definition (Topic: ${topic})`,
          word_bank: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
          match_options: [
            'Markup language for web pages', 
            'Styling language for web pages',
            'Programming language for web pages',
            'JavaScript library for building user interfaces',
            'JavaScript runtime environment'
          ],
          correct_answer: {
            'HTML': 'Markup language for web pages',
            'CSS': 'Styling language for web pages',
            'JavaScript': 'Programming language for web pages',
            'React': 'JavaScript library for building user interfaces',
            'Node.js': 'JavaScript runtime environment'
          },
          max_score: 5,
          grading_type: 'auto'
        });
      }, 1500);
    });
  };

  // Handle generate exercise
  const handleGenerate = useCallback(async () => {
    if (!topic) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    setSubmissionResult(null);

    try {
      // In the real implementation, use the actual service
      // const data = await generateExercise(topic, difficulty, language);
      const data = await mockGenerateExercise(topic, difficulty, language);
      setExerciseData(data);
    } catch (err) {
      setError(err.message || 'Failed to generate exercise');
    } finally {
      setLoading(false);
    }
  }, [topic, difficulty, language]);

  // Handle submission
  const handleSubmission = useCallback((result) => {
    setSubmissionResult(result);
    
    // Calculate score
    if (result.answers && exerciseData?.correct_answer) {
      const correctCount = Object.entries(result.answers).reduce((count, [key, value]) => {
        return exerciseData.correct_answer[key] === value ? count + 1 : count;
      }, 0);
      
      const score = (correctCount / exerciseData.word_bank.length) * 100;
      
      setSubmissionResult(prev => ({
        ...prev,
        score,
        correctCount,
        totalCount: exerciseData.word_bank.length
      }));
    }
  }, [exerciseData]);

  return (
    <div className="test-integration">
      <h2>AI Exercise Integration Test</h2>
      
      <div className="generation-controls">
        <div className="form-group">
          <label>Topic:</label>
          <input 
            type="text" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Web Development"
          />
        </div>
        
        <div className="form-group">
          <label>Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Language:</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="fr">French</option>
          </select>
        </div>
        
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="generate-button"
        >
          {loading ? 'Generating...' : 'Generate Exercise'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {exerciseData && (
        <div className="exercise-container">
          <h3>{exerciseData.question}</h3>
          
          <AIMatchingAdapter
            exerciseData={exerciseData}
            MatchingComponent={MatchingComponent}
            onAnswerSubmit={handleSubmission}
            readOnly={false}
            showAnswers={!!submissionResult}
          />
        </div>
      )}
      
      {submissionResult && (
        <div className="submission-result">
          <h3>Submission Result</h3>
          <p>Score: {submissionResult.score}% ({submissionResult.correctCount}/{submissionResult.totalCount})</p>
          <button 
            onClick={() => setSubmissionResult(null)}
            className="reset-button"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TestIntegration;
