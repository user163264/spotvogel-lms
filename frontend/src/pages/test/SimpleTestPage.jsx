import React, { useState } from 'react';

/**
 * A simple test page for verifying routing
 */
const SimpleTestPage = () => {
  const [mockExercise] = useState({
    question: "Match the animals with their habitats",
    word_bank: ["Lion", "Shark", "Eagle", "Frog", "Penguin"],
    match_options: ["Savanna", "Ocean", "Mountains", "Pond", "Antarctica"],
    correct_answer: {
      "Lion": "Savanna",
      "Shark": "Ocean",
      "Eagle": "Mountains",
      "Frog": "Pond",
      "Penguin": "Antarctica"
    }
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Animal Habitat Matching Exercise</h1>
      <p>Verify that routing is working by viewing this static mock exercise.</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>{mockExercise.question}</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          {/* Left Column */}
          <div style={{ flex: 1 }}>
            <h3>Animals</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {mockExercise.word_bank.map((animal, index) => (
                <li key={index} style={{ 
                  padding: '0.75rem', 
                  margin: '0.5rem 0', 
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px'
                }}>
                  {animal}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right Column */}
          <div style={{ flex: 1 }}>
            <h3>Habitats</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {mockExercise.match_options.map((habitat, index) => (
                <li key={index} style={{ 
                  padding: '0.75rem', 
                  margin: '0.5rem 0', 
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px'
                }}>
                  {habitat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestPage;
