import React from 'react';
import MatchingWords from '../MatchingWords';

/**
 * Test component for manual testing of MatchingWords component
 * 
 * This file is used for development and testing, not for production.
 * It allows us to test the MatchingWords component with various sample data.
 */
const MatchingWordsTest = () => {
  const sampleData = {
    question: "Match each painter with their famous work",
    word_bank: ["Gustav Klimt", "James McNeill Whistler", "Claude Monet"],
    match_options: ["Waterlelies", "De Kus", "Whistler's Mother"],
    correct_answer: {
      "Gustav Klimt": "De Kus",
      "James McNeill Whistler": "Whistler's Mother",
      "Claude Monet": "Waterlelies"
    }
  };

  const handleAnswerChange = (answers) => {
    console.log('Current answers:', answers);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>MatchingWords Component Test</h2>
      
      <h3>Interactive Mode (Student View)</h3>
      <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '30px' }}>
        <MatchingWords 
          exercise={sampleData}
          onAnswerChange={handleAnswerChange}
        />
      </div>
      
      <h3>Read-Only Mode (Review View)</h3>
      <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '30px' }}>
        <MatchingWords 
          exercise={sampleData}
          readOnly={true}
          showCorrectAnswers={true}
          studentAnswers={{
            "Gustav Klimt": "De Kus",
            "James McNeill Whistler": "Waterlelies", // Incorrect match
            "Claude Monet": "Whistler's Mother"  // Incorrect match
          }}
        />
      </div>
      
      <h3>Empty State (No Answers Yet)</h3>
      <div style={{ border: '1px solid #ddd', padding: '20px' }}>
        <MatchingWords 
          exercise={sampleData}
          readOnly={true}
          showCorrectAnswers={true}
        />
      </div>
    </div>
  );
};

export default MatchingWordsTest;