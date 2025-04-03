import React from 'react';
import TeacherFillInBlankGenerator from '../../components/exercises/fill-in-blank/TeacherFillInBlankGenerator';

/**
 * Page component for the Fill-in-the-Blank Generator
 */
const FillInBlankGeneratorPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Fill-in-the-Blank Exercise Generator</h1>
        <p className="text-gray-600">
          Create fill-in-the-blank exercises by entering a text and selecting words to replace with blanks.
        </p>
      </div>
      
      <TeacherFillInBlankGenerator />
    </div>
  );
};

export default FillInBlankGeneratorPage;