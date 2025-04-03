import React from 'react';
import FillInBlankExerciseSimple from '../../components/exercises/fill-in-blank/FillInBlankExerciseSimple';
import { basicFillInBlankExample, complexFillInBlankExample, languageFillInBlankExample } from '../../components/exercises/fill-in-blank/sampleData';

/**
 * Test page for Fill-in-the-Blank exercise
 */
const FillInBlankTestPage = () => {
  // Hard-coded test case that we know will work
  const simpleTestCase = {
    instructions: "Fill in the blanks with the correct words.",
    passage: "This is a {{blank:1:test}} of the {{blank:2:system}}.",
    blanks: [
      {
        id: "1",
        acceptedAnswers: ["test"],
      },
      {
        id: "2",
        acceptedAnswers: ["system"],
      }
    ],
    caseSensitive: false
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Fill-in-the-Blank Exercise Test</h1>
      
      {/* Simple Test Case */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium">Simple Test Case</h2>
        </div>
        
        <div className="p-6">
          <FillInBlankExerciseSimple exercise={simpleTestCase} />
        </div>
      </div>
      
      {/* Basic Example */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium">Basic Example</h2>
        </div>
        
        <div className="p-6">
          <FillInBlankExerciseSimple exercise={basicFillInBlankExample} />
        </div>
      </div>
      
      {/* Complex Example */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium">Code Example</h2>
        </div>
        
        <div className="p-6">
          <FillInBlankExerciseSimple exercise={complexFillInBlankExample} />
        </div>
      </div>
      
      {/* Language Example */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium">Language Example</h2>
        </div>
        
        <div className="p-6">
          <FillInBlankExerciseSimple exercise={languageFillInBlankExample} />
        </div>
      </div>
    </div>
  );
};

export default FillInBlankTestPage;