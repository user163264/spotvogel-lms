import React, { useState } from 'react';
import { MultipleChoiceExercise } from './index';
import { 
  multipleChoiceMultipleAnswers, 
  multipleChoiceSingleAnswer, 
  multipleChoiceWithRichText 
} from './sampleData';

/**
 * Demo component for the Exercise Tester
 * This component demonstrates how to use the Multiple Choice Exercise component
 * in the Exercise Tester environment
 * 
 * @component
 */
const ExerciseTesterDemo: React.FC = () => {
  // State to track which example is currently being displayed
  const [currentExample, setCurrentExample] = useState<string>('multiple');
  
  // Get the current example data based on the selected example
  const getCurrentExampleData = () => {
    switch (currentExample) {
      case 'single':
        return multipleChoiceSingleAnswer;
      case 'richText':
        return multipleChoiceWithRichText;
      case 'multiple':
      default:
        return multipleChoiceMultipleAnswers;
    }
  };
  
  // Handler for when an exercise is submitted
  const handleSubmit = (selectedOptionIds: string[]) => {
    console.log('Selected options:', selectedOptionIds);
    // In a real implementation, this would send the selection to the backend
  };
  
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-lg font-medium mb-3">Exercise Tester Controls</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentExample('multiple')}
              className={`px-3 py-1 rounded ${
                currentExample === 'multiple'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Multiple Answers
            </button>
            <button
              onClick={() => setCurrentExample('single')}
              className={`px-3 py-1 rounded ${
                currentExample === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Single Answer
            </button>
            <button
              onClick={() => setCurrentExample('richText')}
              className={`px-3 py-1 rounded ${
                currentExample === 'richText'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Rich Text
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h1 className="text-lg font-medium text-gray-800">Multiple Choice Exercise</h1>
          </div>
          
          <MultipleChoiceExercise
            exercise={getCurrentExampleData()}
            onSubmit={handleSubmit}
          />
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-3">Integration Notes for Alex Ex</h2>
          <p className="text-gray-700 mb-2">
            This Multiple Choice exercise component expects data in a specific format as defined in the <code>MultipleChoiceExercise</code> interface.
          </p>
          <p className="text-gray-700 mb-4">
            Key integration points for AI-generated content are marked with <code>AI-INTEGRATION-POINT</code> comments throughout the code.
          </p>
          
          <h3 className="text-md font-medium mb-2">Required Data Structure:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
{`{
  id: string,
  questionText: string,
  instructions?: string,
  options: [
    {
      id: string,
      text: string,
      isCorrect: boolean,
      feedback?: string
    },
    // more options...
  ],
  allowMultipleSelections: boolean,
  explanation?: string
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTesterDemo;
