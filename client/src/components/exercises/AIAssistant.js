import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormField from '../common/FormField';
import LoadingIndicator from '../common/LoadingIndicator';

const AIAssistant = ({ exerciseDetails, onGenerate, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [numQuestions, setNumQuestions] = useState(3);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [error, setError] = useState(null);

  // Handle prompt change
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  // Handle number of questions change
  const handleNumQuestionsChange = (e) => {
    setNumQuestions(parseInt(e.target.value, 10));
  };

  // Generate sample questions for different types (mock implementation)
  const generateMockQuestions = (count) => {
    const questionTypes = ['multiple-choice', 'text', 'true-false', 'numeric'];
    const questions = [];

    for (let i = 0; i < count; i++) {
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      let question = {
        id: uuidv4(),
        type,
        prompt: `Sample question ${i + 1} about ${exerciseDetails.subject} for ${exerciseDetails.grade} grade.`,
        points: 1,
        feedback: {
          correct: 'Great job!',
          incorrect: 'Try again. Review the material.'
        }
      };

      // Add type-specific properties
      if (type === 'multiple-choice') {
        question.options = [
          { id: uuidv4(), text: 'Sample option 1', isCorrect: true },
          { id: uuidv4(), text: 'Sample option 2', isCorrect: false },
          { id: uuidv4(), text: 'Sample option 3', isCorrect: false },
          { id: uuidv4(), text: 'Sample option 4', isCorrect: false }
        ];
      } else if (type === 'true-false') {
        question.options = [
          { id: uuidv4(), text: 'True', isCorrect: Math.random() > 0.5 },
          { id: uuidv4(), text: 'False', isCorrect: Math.random() <= 0.5 }
        ];
      } else if (type === 'text' || type === 'numeric') {
        question.correctAnswer = type === 'numeric' ? '42' : 'Sample answer';
      }

      questions.push(question);
    }

    return questions;
  };

  // Generate questions using OpenAI (or mock for now)
  const handleGenerateQuestions = async () => {
    if (!prompt) {
      setError('Please provide instructions for the AI assistant.');
      return;
    }

    setGeneratingQuestions(true);
    setError(null);

    try {
      // This is a placeholder for the actual OpenAI API call
      // In a real implementation, you would call your backend service
      // that handles the OpenAI integration
      
      // Simulate API call with a timeout
      setTimeout(() => {
        // Generate mock questions
        const generatedQuestions = generateMockQuestions(numQuestions);
        
        // Pass the generated questions back to the parent component
        onGenerate(generatedQuestions);
        
        setGeneratingQuestions(false);
      }, 2000); // Simulate a 2-second API call
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
      setGeneratingQuestions(false);
      console.error('Error generating questions:', err);
    }
  };

  // Auto-generate a suggestion based on exercise details
  const generateSuggestion = () => {
    const subject = exerciseDetails.subject || 'this subject';
    const grade = exerciseDetails.grade || 'this grade level';
    
    return `Generate ${numQuestions} ${exerciseDetails.difficultyLevel || 'mixed'} difficulty questions about ${subject} for ${grade} students. Include a mix of multiple choice and text-based questions.`;
  };

  // Use the generated suggestion
  const handleUseSuggestion = () => {
    setPrompt(generateSuggestion());
  };

  return (
    <div className="ai-assistant-modal">
      <div className="ai-assistant-content">
        <div className="ai-assistant-header">
          <h2>AI Question Generator</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="ai-assistant-body">
          {error && <div className="error-message">{error}</div>}
          
          <div className="ai-instructions">
            <p>
              Describe the questions you want to generate. Be specific about the topic, 
              difficulty level, and question types.
            </p>
            
            <button 
              className="suggestion-button" 
              onClick={handleUseSuggestion}
            >
              Use Suggested Prompt
            </button>
          </div>
          
          <FormField
            label="Instructions for AI"
            name="prompt"
            type="textarea"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="E.g., Generate 3 medium difficulty questions about algebra for 8th grade students. Include word problems."
            rows={5}
            required
          />
          
          <div className="question-count">
            <label>
              Number of Questions:
              <select 
                value={numQuestions} 
                onChange={handleNumQuestionsChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        
        <div className="ai-assistant-footer">
          <button 
            className="cancel-button" 
            onClick={onClose} 
            disabled={generatingQuestions}
          >
            Cancel
          </button>
          <button 
            className="generate-button" 
            onClick={handleGenerateQuestions} 
            disabled={generatingQuestions || !prompt}
          >
            {generatingQuestions ? <LoadingIndicator size="small" /> : 'Generate Questions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;