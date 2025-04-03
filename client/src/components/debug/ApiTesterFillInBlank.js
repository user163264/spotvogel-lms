import React, { useState } from 'react';

/**
 * Simple API tester for the Fill-in-the-Blank exercise
 */
const ApiTesterFillInBlank = () => {
  // State for request and response
  const [sourceText, setSourceText] = useState('');
  const [exerciseData, setExerciseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to handle generating the exercise
  const handleGenerateExercise = async () => {
    setIsLoading(true);
    
    try {
      // Create example request data
      const requestData = {
        exercise_type: 'fill_in_blank',
        source_text: sourceText
      };
      
      // Display results (in a real app, this would be an API call)
      console.log('API Request:', requestData);
      
      // Wait 1 second to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example response (would come from API)
      const mockResponse = {
        exercise_type: 'fill_in_blank',
        instructions: 'Fill in the blanks with the correct words.',
        passage: sourceText.replace(/\b(a|the|is|and|to|of|in)\b/g, '{{blank}}'),
        answers: sourceText.match(/\b(a|the|is|and|to|of|in)\b/g) || []
      };
      
      setExerciseData(mockResponse);
      console.log('API Response:', mockResponse);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left Column - Input */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Teacher Input</h2>
        
        {/* Exercise Type */}
        <div className="mb-4">
          <label htmlFor="exerciseType" className="block text-sm font-medium text-gray-700 mb-1">
            Exercise Type
          </label>
          <select
            id="exerciseType"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value="fill_in_blank"
            disabled
          >
            <option value="fill_in_blank">Fill in the Blank</option>
          </select>
        </div>
        
        {/* Source Text */}
        <div className="mb-4">
          <label htmlFor="sourceText" className="block text-sm font-medium text-gray-700 mb-1">
            Source Text
          </label>
          <textarea
            id="sourceText"
            className="w-full border border-gray-300 rounded px-3 py-2 h-40"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text here..."
          />
        </div>
        
        {/* Generate Button */}
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleGenerateExercise}
          disabled={isLoading || !sourceText.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate Exercise'}
        </button>
        
        {/* Request Data */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Request Data</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto h-40">
            {JSON.stringify(
              {
                exercise_type: 'fill_in_blank',
                source_text: sourceText
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
      
      {/* Right Column - Preview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Exercise Preview</h2>
        
        {exerciseData ? (
          <div className="border rounded p-4">
            <p className="italic text-gray-600 mb-4">{exerciseData.instructions}</p>
            <div className="mb-4">
              {exerciseData.passage.split(/(\{\{blank\}\})/).map((part, index) => {
                if (part === '{{blank}}') {
                  return (
                    <input
                      key={index}
                      type="text"
                      className="border-b border-blue-500 px-2 w-20 focus:outline-none focus:border-blue-700"
                      disabled
                    />
                  );
                }
                return <span key={index}>{part}</span>;
              })}
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Answers:</h4>
              <ol className="list-decimal pl-6">
                {exerciseData.answers.map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded p-8 text-center text-gray-500">
            <h3 className="text-lg mb-2">Placeholder for fill_in_blank exercise</h3>
            <p>Fill in the text on the left and click "Generate Exercise".</p>
          </div>
        )}
        
        {/* Response Data */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Response Data (Debug View)</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto h-40">
            {exerciseData
              ? JSON.stringify(exerciseData, null, 2)
              : JSON.stringify(
                  {
                    exercise_type: 'fill_in_blank',
                    question: 'This is a placeholder for fill_in_blank exercise'
                  },
                  null,
                  2
                )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ApiTesterFillInBlank;