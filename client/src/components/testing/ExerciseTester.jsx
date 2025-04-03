import React, { useState, useEffect } from 'react';
import { basicFillInBlankExample, complexFillInBlankExample, languageFillInBlankExample } from '../exercises/fill-in-blank/sampleData';

// Import the simplified component for testing
import FillInBlankExerciseSimple from '../exercises/fill-in-blank/FillInBlankExerciseSimple';

// Import MultipleChoiceExercise component directly
import { MultipleChoiceExercise } from '../exercises/multiple-choice';
import { multipleChoiceMultipleAnswers, multipleChoiceSingleAnswer, multipleChoiceWithRichText } from '../exercises/multiple-choice/sampleData';

// Define the exercise types
const EXERCISE_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  FILL_IN_BLANK: 'fill_in_blank',
  MATCHING: 'matching',
  SEQUENCING: 'sequencing',
  SHORT_ANSWER: 'short_answer'
};

// Define the exercise subtypes for more specific examples
const SUBTYPES = {
  // Multiple choice subtypes
  MULTIPLE: 'multiple',
  SINGLE: 'single',
  RICH_TEXT: 'richText',
  // Fill in blank subtypes
  BASIC: 'basic',
  COMPLEX: 'complex',
  LANGUAGE: 'language',
  CUSTOM: 'custom'
};

/**
 * Exercise Tester component that provides a UI for testing different exercise types
 * 
 * @component
 */
const ExerciseTester = () => {
  // State for the currently selected exercise type and subtype
  const [exerciseType, setExerciseType] = useState(EXERCISE_TYPES.FILL_IN_BLANK);
  const [exerciseSubtype, setExerciseSubtype] = useState(SUBTYPES.BASIC);
  
  // State for custom Fill-in-the-Blank exercise
  const [sourceText, setSourceText] = useState('');
  const [selectedWords, setSelectedWords] = useState([]);
  const [customExerciseData, setCustomExerciseData] = useState(null);
  
  console.log("Current exercise type:", exerciseType);
  console.log("Current exercise subtype:", exerciseSubtype);
  
  // Generate custom exercise data when source text or selected words change
  useEffect(() => {
    if (exerciseType === EXERCISE_TYPES.FILL_IN_BLANK && 
        exerciseSubtype === SUBTYPES.CUSTOM &&
        sourceText && 
        selectedWords.length > 0) {
      generateCustomExerciseData();
    }
  }, [sourceText, selectedWords]);
  
  // Mock data for exercise types not yet implemented
  const placeholderMessage = (type) => (
    <div className="p-6 border border-dashed border-gray-300 rounded-md text-gray-500 text-center">
      <p className="text-lg mb-2">This exercise type is not yet implemented</p>
      <p>Exercise Type: {type}</p>
    </div>
  );
  
  // Get the appropriate subtypes for the selected exercise type
  const getSubtypeOptions = () => {
    switch (exerciseType) {
      case EXERCISE_TYPES.MULTIPLE_CHOICE:
        return [
          { value: SUBTYPES.MULTIPLE, label: 'Multiple Answers' },
          { value: SUBTYPES.SINGLE, label: 'Single Answer' },
          { value: SUBTYPES.RICH_TEXT, label: 'Rich Text' }
        ];
      case EXERCISE_TYPES.FILL_IN_BLANK:
        return [
          { value: SUBTYPES.BASIC, label: 'Basic Example' },
          { value: SUBTYPES.COMPLEX, label: 'Code Example' },
          { value: SUBTYPES.LANGUAGE, label: 'Language Example' },
          { value: SUBTYPES.CUSTOM, label: 'Create Custom' }
        ];
      default:
        return [{ value: SUBTYPES.BASIC, label: 'Basic Example' }];
    }
  };
  
  // Handle changing the exercise type
  const handleExerciseTypeChange = (e) => {
    const newType = e.target.value;
    console.log("Changing exercise type to:", newType);
    setExerciseType(newType);
    
    // Reset subtype to the first option for the new type
    const subtypes = getSubtypeOptions();
    if (subtypes.length > 0) {
      setExerciseSubtype(subtypes[0].value);
    }
  };
  
  // Handle changing the exercise subtype
  const handleExerciseSubtypeChange = (e) => {
    setExerciseSubtype(e.target.value);
  };
  
  // Generate custom exercise data from source text and selected words
  const generateCustomExerciseData = () => {
    if (!sourceText.trim() || selectedWords.length === 0) {
      setCustomExerciseData(null);
      return;
    }
    
    try {
      // Create a copy of the source text
      let passageWithBlanks = sourceText;
      const blanks = [];
      
      // Replace each selected word with a blank marker
      selectedWords.forEach((word, index) => {
        const blankId = (index + 1).toString();
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        
        // Replace only the first occurrence to avoid ambiguity
        passageWithBlanks = passageWithBlanks.replace(regex, `{{blank:${blankId}:${word}}}`);
        
        // Add to blanks array
        blanks.push({
          id: blankId,
          acceptedAnswers: [word]
        });
      });
      
      // Create exercise data
      const exercise = {
        id: `fib-custom-${Date.now()}`,
        instructions: 'Fill in the blanks with the correct words.',
        passage: passageWithBlanks,
        blanks,
        caseSensitive: false
      };
      
      setCustomExerciseData(exercise);
    } catch (error) {
      console.error('Error generating custom exercise:', error);
      setCustomExerciseData(null);
    }
  };
  
  // Handle word selection from the source text
  const handleWordSelect = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && !selectedWords.includes(selectedText)) {
      setSelectedWords([...selectedWords, selectedText]);
    }
  };
  
  // Remove a word from the selected words list
  const removeSelectedWord = (index) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
  };
  
  // Get the current exercise data based on the selected type and subtype
  const getCurrentExerciseData = () => {
    console.log("Getting data for:", exerciseType, exerciseSubtype);
    
    if (exerciseType === EXERCISE_TYPES.MULTIPLE_CHOICE) {
      switch (exerciseSubtype) {
        case SUBTYPES.SINGLE:
          return multipleChoiceSingleAnswer;
        case SUBTYPES.RICH_TEXT:
          return multipleChoiceWithRichText;
        case SUBTYPES.MULTIPLE:
        default:
          return multipleChoiceMultipleAnswers;
      }
    } 
    else if (exerciseType === EXERCISE_TYPES.FILL_IN_BLANK) {
      if (exerciseSubtype === SUBTYPES.CUSTOM) {
        return customExerciseData;
      }
      
      console.log("Getting Fill in Blank data for subtype:", exerciseSubtype);
      switch (exerciseSubtype) {
        case SUBTYPES.COMPLEX:
          return complexFillInBlankExample;
        case SUBTYPES.LANGUAGE:
          return languageFillInBlankExample;
        case SUBTYPES.BASIC:
        default:
          console.log("Returning basic example:", basicFillInBlankExample);
          return basicFillInBlankExample;
      }
    }
    
    return null;
  };
  
  // Render the appropriate exercise component based on the selected type
  const renderExerciseComponent = () => {
    console.log("Rendering component for:", exerciseType);
    const exerciseData = getCurrentExerciseData();
    
    if (exerciseType === EXERCISE_TYPES.FILL_IN_BLANK && exerciseSubtype === SUBTYPES.CUSTOM) {
      if (!customExerciseData) {
        return (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Placeholder for fill_in_blank exercise</h3>
            <p className="text-gray-500">Enter text and select words to create a fill-in-blank exercise.</p>
          </div>
        );
      }
    }
    
    if (!exerciseData) {
      return placeholderMessage("No data available");
    }
    
    if (exerciseType === EXERCISE_TYPES.MULTIPLE_CHOICE) {
      try {
        return (
          <MultipleChoiceExercise
            exercise={exerciseData}
            onSubmit={(selectedOptionIds) => {
              console.log('Selected options:', selectedOptionIds);
            }}
          />
        );
      } catch (error) {
        console.error("Error rendering Multiple Choice component:", error);
        return placeholderMessage("Error rendering Multiple Choice component");
      }
    } 
    else if (exerciseType === EXERCISE_TYPES.FILL_IN_BLANK) {
      try {
        console.log("Fill in Blank exercise data:", exerciseData);
        
        // Use the simplified component for now
        return <FillInBlankExerciseSimple exercise={exerciseData} />;
      } catch (error) {
        console.error("Error rendering Fill in Blank component:", error);
        return placeholderMessage("Error rendering Fill in Blank component");
      }
    }
    
    // For other exercise types, show placeholder
    return placeholderMessage(exerciseType);
  };
  
  // Get JSON representation of the current exercise data for debugging
  const getCurrentExerciseJSON = () => {
    const data = getCurrentExerciseData();
    return data ? JSON.stringify(data, null, 2) : 'No data available';
  };

  // Render the text input form for custom Fill-in-the-Blank
  const renderCustomFillInBlankForm = () => {
    if (exerciseType !== EXERCISE_TYPES.FILL_IN_BLANK || exerciseSubtype !== SUBTYPES.CUSTOM) {
      return null;
    }

    return (
      <div className="border-t border-gray-200 mt-4 pt-4">
        <h3 className="text-md font-medium mb-2">Teacher Input</h3>
        
        {/* Source Text */}
        <div className="mb-4">
          <label htmlFor="sourceText" className="block text-sm font-medium text-gray-700 mb-1">
            Source Text
          </label>
          <textarea
            id="sourceText"
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            onMouseUp={handleWordSelect}
            placeholder="Enter or paste the text here. Select words to turn them into blanks."
          />
          <p className="text-xs text-gray-500 mt-1">
            Select words in the text to create blanks. Click and drag to select a word.
          </p>
        </div>
        
        {/* Selected Words */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Words to Replace with Blanks
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedWords.length > 0 ? (
              selectedWords.map((word, index) => (
                <div 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center text-sm"
                >
                  <span>{word}</span>
                  <button
                    type="button"
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    onClick={() => removeSelectedWord(index)}
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">No words selected yet.</div>
            )}
          </div>
        </div>
        
        {/* Generate Button */}
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          onClick={generateCustomExerciseData}
          disabled={!sourceText.trim() || selectedWords.length === 0}
        >
          Generate Exercise
        </button>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Left Panel - Control Panel */}
      <div className="lg:w-1/3 p-4 border-r border-gray-200 bg-gray-50 overflow-auto">
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
            <option value={EXERCISE_TYPES.MULTIPLE_CHOICE}>Multiple Choice</option>
            <option value={EXERCISE_TYPES.FILL_IN_BLANK}>Fill in the Blank</option>
            <option value={EXERCISE_TYPES.MATCHING}>Matching</option>
            <option value={EXERCISE_TYPES.SEQUENCING}>Sequencing</option>
            <option value={EXERCISE_TYPES.SHORT_ANSWER}>Short Answer</option>
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
        
        {/* Custom Fill-in-the-Blank Form */}
        {renderCustomFillInBlankForm()}
        
        {/* Debug Information */}
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Exercise Data (Debug)</h3>
          <div className="bg-gray-800 text-green-400 p-3 rounded-md overflow-auto h-40 text-xs font-mono">
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
        
        <div className="p-4">
          {renderExerciseComponent()}
        </div>
      </div>
    </div>
  );
};

export default ExerciseTester;