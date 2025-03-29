import React, { useState } from 'react';
import MatchingWords from '../../components/exercises/MatchingWordsSimple';

const MatchingWordsTestPage = () => {
  // Sample data sets for different testing scenarios
  const sampleExercises = [
    {
      id: 'languages',
      question: "Match each programming language with its primary use case",
      word_bank: ["JavaScript", "Python", "SQL", "Swift", "Rust"],
      match_options: ["Web Development", "Data Science", "Database Management", "iOS Development", "Systems Programming"],
      correct_answer: {
        "JavaScript": "Web Development",
        "Python": "Data Science",
        "SQL": "Database Management",
        "Swift": "iOS Development",
        "Rust": "Systems Programming"
      }
    },
    {
      id: 'capitals',
      question: "Match each country with its capital city",
      word_bank: ["France", "Japan", "Egypt", "Brazil", "Australia"],
      match_options: ["Paris", "Tokyo", "Cairo", "Brasília", "Canberra"],
      correct_answer: {
        "France": "Paris",
        "Japan": "Tokyo",
        "Egypt": "Cairo",
        "Brazil": "Brasília",
        "Australia": "Canberra"
      }
    },
    {
      id: 'art',
      question: "Match each painter with their famous work",
      word_bank: ["Gustav Klimt", "James McNeill Whistler", "Claude Monet", "Vincent van Gogh", "Leonardo da Vinci"],
      match_options: ["Water Lilies", "The Kiss", "Whistler's Mother", "Starry Night", "Mona Lisa"],
      correct_answer: {
        "Gustav Klimt": "The Kiss",
        "James McNeill Whistler": "Whistler's Mother",
        "Claude Monet": "Water Lilies",
        "Vincent van Gogh": "Starry Night",
        "Leonardo da Vinci": "Mona Lisa"
      }
    }
  ];

  // State for tracking current exercise and user answers
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(true);
  const [readOnly, setReadOnly] = useState(false);

  const currentExercise = sampleExercises[currentExerciseIndex];

  const handleAnswerChange = (answers) => {
    console.log('Current answers:', answers);
    setStudentAnswers(answers);
  };

  // For forcing remount when needed
  const [componentKey, setComponentKey] = useState(0);

  const handleReset = () => {
    // Clear student answers
    setStudentAnswers({});
    // Force remount by changing key
    setComponentKey(prev => prev + 1);
  };

  const handleExerciseChange = (index) => {
    // Update the current exercise index
    setCurrentExerciseIndex(index);
    
    // Clear answers for the new exercise
    setStudentAnswers({});
    
    // Ensure correct answers are shown
    setShowAnswers(true);
    
    // Make sure we're not in read-only mode
    setReadOnly(false);
    
    // Force component remount
    setComponentKey(prev => prev + 1);
  };

  return (
    <div className="matching-words-test-page">
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <h1>MatchingWords Component Testing</h1>
        <p className="description">
          This page allows testing the MatchingWords component with various exercises and display modes.
        </p>
        
        {/* Exercise Selector */}
        <div className="exercise-selector" style={{ marginBottom: '20px' }}>
          <h3>Select an Exercise:</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {sampleExercises.map((exercise, index) => (
              <button
                key={exercise.id}
                onClick={() => handleExerciseChange(index)}
                style={{
                  padding: '10px 15px',
                  background: currentExerciseIndex === index ? '#4a90e2' : '#f5f5f5',
                  color: currentExerciseIndex === index ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {exercise.question.split(' ').slice(0, 3).join(' ')}...
              </button>
            ))}
          </div>
        </div>
        
        {/* Display Mode Controls */}
        <div className="display-controls" style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '30px',
          padding: '15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <div>
            <label>
              <input
                type="checkbox"
                checked={readOnly}
                onChange={() => setReadOnly(!readOnly)}
              />
              Read-Only Mode
            </label>
          </div>
          
          <div>
            <label>
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={() => setShowAnswers(!showAnswers)}
              />
              Show Correct Answers
            </label>
          </div>
          
          <button
            onClick={handleReset}
            style={{
              marginLeft: 'auto',
              padding: '8px 15px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset Answers
          </button>
        </div>
        
        {/* Information Display */}
        <div className="info-display" style={{ 
          marginBottom: '30px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          display: studentAnswers && Object.keys(studentAnswers).length > 0 ? 'block' : 'none'
        }}>
          <h3>Current Answers:</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflowX: 'auto'
          }}>
            {JSON.stringify(studentAnswers, null, 2)}
          </pre>
        </div>
        
        {/* Component Display */}
        <div className="component-container" style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <MatchingWords
            key={`exercise-${currentExercise.id}-${componentKey}`}
            exercise={currentExercise}
            onAnswerChange={handleAnswerChange}
            readOnly={readOnly}
            showCorrectAnswers={showAnswers}
            studentAnswers={studentAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchingWordsTestPage;
