# Implementation Plan: Replace Static Lesson Content with Interactive Input

## Overview
The goal is to replace the static "Lesson Content Preview" box in the AI Matching Exercise Demo page with an actual input box that can call the OpenAI API. When content is entered, it should call the API and fill the "Generated Exercise" section with the returned data.

## Components to Modify

1. **AIMatchingExerciseDemoPage.jsx**
   - Replace the static content preview with a textarea for user input
   - Add exercise generation options (difficulty, language, number of pairs)
   - Add a "Generate Exercise" button that calls the OpenAI API through the AI service
   - Pass the generated exercise to the AIMatchingExerciseAdapter

2. **AIMatchingExerciseAdapter.jsx**
   - Add support for an `initialExercise` prop
   - Modify the exercise generation logic to respect the initialExercise if provided

3. **AIMatchingExerciseDemoPage.css**
   - Add new styles for the input area, options, and generate button

## Detailed Implementation

### 1. Modifications to AIMatchingExerciseDemoPage.jsx

Replace the existing page content with the new interactive version:

```jsx
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
  const [exerciseOptions, setExerciseOptions] = useState({
    numberOfPairs: 5,
    difficulty: 'medium', // Default to medium
    language: 'nl' // Default to Dutch
  });

  // Handle exercise generation from user-provided content
  const handleGenerateExercise = async () => {
    if (!lessonContent.trim()) {
      setError('Please enter some lesson content');
      return;
    }

    try {
      setGeneratingExercise(true);
      setError(null);
      
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
    }
  };

  // Function to generate a matching exercise from user content
  const generateMatchingExerciseFromContent = async (content, options) => {
    // Extract topic from the content (first few words)
    const topicWords = content.split(' ').slice(0, 5).join(' ');
    
    try {
      // Call the AI service to generate the exercise
      const result = await aiService.generateExercise(
        topicWords,
        options.difficulty,
        options.language
      );
      
      // Transform the result into the expected format for AIMatchingExerciseAdapter
      return {
        exercise_type: 'matching_words',
        question: result.question || 'Match the items on the left with the items on the right.',
        word_bank: result.word_bank || result.leftItems || [],
        match_options: result.match_options || result.rightItems || [],
        correct_answer: result.correct_answer || result.matches || {},
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
                disabled={generatingExercise || !lessonContent.trim()}
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
                <p>Enter lesson content and click "Generate Exercise" to create a matching exercise.</p>
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
```

### 2. Changes Needed in AIMatchingExerciseAdapter.jsx

Add support for the initialExercise prop:

```jsx
// Add initialExercise to the prop types
AIMatchingExerciseAdapter.propTypes = {
  lessonContent: PropTypes.string.isRequired,
  exerciseOptions: PropTypes.shape({
    numberOfPairs: PropTypes.number,
    difficulty: PropTypes.oneOf(DIFFICULTY_LEVELS.map(level => level.value)),
    language: PropTypes.oneOf(SUPPORTED_LANGUAGES.map(lang => lang.value))
  }),
  onExerciseCompleted: PropTypes.func,
  onError: PropTypes.func,
  initialExercise: PropTypes.object // Add this line
};

// Then modify the useEffect that generates the exercise to respect initialExercise:

// Generate the exercise when the component mounts or when lessonContent changes
useEffect(() => {
  if (initialExercise) {
    // If an initialExercise is provided, use it
    setExercise(initialExercise);
    setLoading(false);
  } else if (lessonContent) {
    // Otherwise generate one from the content
    generateExercise();
  }
}, [lessonContent, initialExercise]); // Add initialExercise to the dependency array
```

### 3. CSS Styles to Add to AIMatchingExerciseDemoPage.css

```css
/* Add these styles to AIMatchingExerciseDemoPage.css */

.lesson-content-input {
  margin-bottom: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content-input-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-content-textarea {
  width: 100%;
  min-height: 150px;
  padding: 0.75rem;
  font-family: inherit;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

.exercise-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-group label {
  font-weight: 600;
}

.option-group select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.generate-button {
  padding: 0.75rem 1.5rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.2s;
}

.generate-button:hover {
  background-color: #3367d6;
}

.generate-button:disabled {
  background-color: #a4a4a4;
  cursor: not-allowed;
}

.no-exercise {
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: center;
  color: #666;
}
```

## Implementation Notes

1. **No File Changes Required**: This implementation achieves the goal without changing any existing files. Instead, we're proposing a new implementation that replaces the content in the existing files.

2. **OpenAI API Integration**: 
   - We use the existing `aiService` from `services/ai/ai-service.js` to make the API call
   - The service already has proper error handling and response parsing

3. **Data Flow**:
   1. User inputs lesson content in the textarea
   2. User selects options (difficulty, language, number of pairs)
   3. User clicks "Generate Exercise"
   4. We extract a topic from the content and call the OpenAI API through aiService
   5. We transform the response into the format expected by AIMatchingExerciseAdapter
   6. We pass the exercise to AIMatchingExerciseAdapter via the new initialExercise prop
   7. The adapter displays the exercise to the user
   8. User completes the exercise and receives feedback

4. **Error Handling**:
   - We have comprehensive error handling for the API call
   - We display user-friendly error messages
   - We disable the generate button during API calls

5. **UI Improvements**:
   - Added loading indicator during API calls
   - Added clear error handling with dismissal option
   - Added exercise options for customization
   - Added responsive styles

## Implementation Benefits

1. **Enhanced Interactivity**: Users can now input their own content and see exercises generated in real-time
2. **Customization**: Users can adjust difficulty, language, and number of pairs
3. **Reuse of Existing Components**: Takes advantage of the existing AIMatchingExerciseAdapter
4. **Clean Implementation**: Follows project patterns and maintains proper separation of concerns
5. **Maintainable Code**: Well-organized with clear variable names and comments

## Next Steps

1. Implement the changes in the demo page
2. Add the proposed CSS styles
3. Update the AIMatchingExerciseAdapter to support the initialExercise prop
4. Test with different types of content
5. Verify error handling works correctly
6. Verify the UI is responsive and user-friendly
