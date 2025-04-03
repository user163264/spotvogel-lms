import React, { useState } from 'react';
import { FillInBlankExercise } from './index';
import { 
  basicFillInBlankExample, 
  complexFillInBlankExample, 
  languageFillInBlankExample 
} from './sampleData';

/**
 * Demo component for the Fill-in-the-Blank Exercise in the Exercise Tester
 * This component demonstrates how to use the Fill-in-the-Blank Exercise component
 * in the Exercise Tester environment
 * 
 * @component
 */
const FillInBlankExerciseTesterDemo: React.FC = () => {
  // State to track which example is currently being displayed
  const [currentExample, setCurrentExample] = useState<string>('basic');
  
  // Get the current example data based on the selected example
  const getCurrentExampleData = () => {
    switch (currentExample) {
      case 'complex':
        return complexFillInBlankExample;
      case 'language':
        return languageFillInBlankExample;
      case 'basic':
      default:
        return basicFillInBlankExample;
    }
  };
  
  // Handler for when an exercise is submitted
  const handleSubmit = (answers: Record<string, string>) => {
    console.log('Submitted answers:', answers);
    // In a real implementation, this would send the answers to the backend
  };
  
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-lg font-medium mb-3">Exercise Tester Controls</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentExample('basic')}
              className={`px-3 py-1 rounded ${
                currentExample === 'basic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Basic Example
            </button>
            <button
              onClick={() => setCurrentExample('complex')}
              className={`px-3 py-1 rounded ${
                currentExample === 'complex'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Code Example
            </button>
            <button
              onClick={() => setCurrentExample('language')}
              className={`px-3 py-1 rounded ${
                currentExample === 'language'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Language Example
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h1 className="text-lg font-medium text-gray-800">Fill-in-the-Blank Exercise</h1>
          </div>
          
          <FillInBlankExercise
            exercise={getCurrentExampleData()}
            onSubmit={handleSubmit}
          />
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-3">Integration Notes for Alex Ex</h2>
          <p className="text-gray-700 mb-2">
            This Fill-in-the-Blank exercise component expects data in a specific format as defined in the <code>FillInBlankExercise</code> interface.
          </p>
          <p className="text-gray-700 mb-4">
            Key integration points for AI-generated content are marked with <code>AI-INTEGRATION-POINT</code> comments throughout the code.
          </p>
          
          <h3 className="text-md font-medium mb-2">Required Data Structure:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
{`{
  id: string,
  instructions: string,
  passage: string, // Text with blanks in format {{blank:id:answer}}
  blanks: [
    {
      id: string,
      acceptedAnswers: string[],
      hint?: string,
      feedback?: string
    },
    // more blanks...
  ],
  explanation?: string,
  caseSensitive?: boolean
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FillInBlankExerciseTesterDemo;
