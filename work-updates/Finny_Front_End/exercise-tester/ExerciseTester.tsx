import React, { useState } from 'react';
import { FillInBlankExercise } from '../fill-in-blank-implementation';
import { MultipleChoiceExercise } from '../multiple-choice-implementation';
import { 
  basicFillInBlankExample,
  complexFillInBlankExample, 
  languageFillInBlankExample 
} from '../fill-in-blank-implementation/sampleData';
import {
  multipleChoiceMultipleAnswers,
  multipleChoiceSingleAnswer,
  multipleChoiceWithRichText
} from '../multiple-choice-implementation/sampleData';

// Define the exercise types
type ExerciseType = 'multiple_choice' | 'fill_in_blank' | 'matching' | 'sequencing' | 'short_answer';

// Exercise subtype for more specific examples
type ExerciseSubtype = 'basic' | 'complex' | 'language' | 'single' | 'multiple' | 'richText';

/**
 * Exercise Tester component that provides a UI for testing different exercise types
 * 
 * @component
 */
const ExerciseTester: React.FC = () => {
  // State for the currently selected exercise type and subtype
  const [exerciseType, setExerciseType] = useState<ExerciseType>('multiple_choice');
  const [exerciseSubtype, setExerciseSubtype] = useState<ExerciseSubtype>('multiple');
  
  // Mock data for exercise types not yet implemented
  const placeholderMessage = (type: ExerciseType) => (
    <div className="p-6 border border-dashed border-gray-300 rounded-md text-gray-500 text-center">
      <p className="text-lg mb-2">This exercise type is not yet implemented</p>
      <p>Exercise Type: {type}</p>
    </div>
  );
  
  // Get the appropriate subtypes for the selected exercise type
  const getSubtypeOptions = () => {
    switch (exerciseType) {
      case 'multiple_choice':
        return [
          { value: 'multiple', label: 'Multiple Answers' },
          { value: 'single', label: 'Single Answer' },
          { value: 'richText', label: 'Rich Text' }
        ];
      case 'fill_in_blank':
        return [
          { value: 'basic', label: 'Basic Example' },
          { value: 'complex', label: 'Code Example' },
          { value: 'language', label: 'Language Example' }
        ];
      default:
        return [{ value: 'basic', label: 'Basic Example' }];
    }
  };
  
  // Handle changing the exercise type
  const handleExerciseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ExerciseType;
    setExerciseType(newType);
    
    // Reset subtype to the first option for the new type
    const defaultSubtype = getSubtypeOptions()[0].value as ExerciseSubtype;
    setExerciseSubtype(defaultSubtype);
  };
  
  // Handle changing the exercise subtype
  const handleExerciseSubtypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExerciseSubtype(e.target.value as ExerciseSubtype);
  };
  
  // Get the current exercise data based on the selected type and subtype
  const getCurrentExerciseData = () => {
    switch (exerciseType) {
      case 'multiple_choice':
        switch (exerciseSubtype) {
          case 'single':
            return multipleChoiceSingleAnswer;
          case 'richText':
            return multipleChoiceWithRichText;
          case 'multiple':
          default:
            return multipleChoiceMultipleAnswers;
        }
      case 'fill_in_blank':
        switch (exerciseSubtype) {
          case 'complex':
            return complexFillInBlankExample;
          case 'language':
            return languageFillInBlankExample;
          case 'basic':
          default:
            return basicFillInBlankExample;
        }
      default:
        return null;
    }
  };
  
  // Render the appropriate exercise component based on the selected type
  const renderExerciseComponent = () => {
    switch (exerciseType) {
      case 'multiple_choice':
        return (
          <MultipleChoiceExercise
            exercise={getCurrentExerciseData()}
            onSubmit={(selectedOptionIds) => {
              console.log('Selected options:', selectedOptionIds);
            }}
          />
        );
      case 'fill_in_blank':
        return (
          <FillInBlankExercise
            exercise={getCurrentExerciseData()}
            onSubmit={(answers) => {
              console.log('Submitted answers:', answers);
            }}
          />
        );
      case 'matching':
      case 'sequencing':
      case 'short_answer':
      default:
        return placeholderMessage(exerciseType);
    }
  };
  
  // Get JSON representation of the current exercise data for debugging
  const getCurrentExerciseJSON = () => {
    const data = getCurrentExerciseData();
    return data ? JSON.stringify(data, null, 2) : '';
  };
  
  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Left Panel - Control Panel */}
      <div className="lg:w-1/3 p-4 border-r border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium mb-4">Exercise Tester Controls</h2>
        
        {/* Exercise Type Selector */}
        <div className="mb-4">
          <label htmlFor="exerciseType" className="block text-sm font-medium text-gray-700 mb-1">
            Exercise Type
          </label>
          <select
            id="exerciseType"
            value={exerciseType}
            onChange={handleExerciseTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="fill_in_blank">Fill in the Blank</option>
            <option value="matching">Matching</option>
            <option value="sequencing">Sequencing</option>
            <option value="short_answer">Short Answer</option>
          </select>
        </div>
        
        {/* Exercise Subtype Selector */}
        <div className="mb-4">
          <label htmlFor="exerciseSubtype" className="block text-sm font-medium text-gray-700 mb-1">
            Example Type
          </label>
          <select
            id="exerciseSubtype"
            value={exerciseSubtype}
            onChange={handleExerciseSubtypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {getSubtypeOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Debug Information */}
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Exercise Data (Debug)</h3>
          <div className="bg-gray-800 text-green-400 p-3 rounded-md overflow-auto h-80 text-xs font-mono">
            <pre>{getCurrentExerciseJSON()}</pre>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Exercise Preview */}
      <div className="lg:w-2/3 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h2 className="text-lg font-medium text-gray-800">
            Exercise Preview: {exerciseType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h2>
        </div>
        
        {renderExerciseComponent()}
      </div>
    </div>
  );
};

export default ExerciseTester;
