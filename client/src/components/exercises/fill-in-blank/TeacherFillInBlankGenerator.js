import React, { useState, useEffect } from 'react';
import FillInBlankExerciseSimple from './FillInBlankExerciseSimple';

/**
 * Component for generating Fill-in-the-Blank exercises with teacher input
 * This component shows a two-column layout with teacher input on the left
 * and a live preview on the right
 */
const TeacherFillInBlankGenerator = () => {
  // State for teacher input
  const [sourceText, setSourceText] = useState('');
  const [selectedWords, setSelectedWords] = useState([]);
  const [exerciseData, setExerciseData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Process source text to detect potential words to blank out
  useEffect(() => {
    if (sourceText.trim()) {
      // Reset selected words when source text changes significantly
      setSelectedWords([]);
    }
  }, [sourceText]);
  
  // Generate exercise data for preview
  const generateExerciseData = () => {
    if (!sourceText || selectedWords.length === 0) {
      return null;
    }
    
    setIsGenerating(true);
    
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
        id: `fib-${Date.now()}`,
        instructions: 'Fill in the blanks with the correct words.',
        passage: passageWithBlanks,
        blanks,
        caseSensitive: false
      };
      
      setExerciseData(exercise);
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      setIsGenerating(false);
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
  
  // Handle generating the exercise
  const handleGenerateExercise = () => {
    generateExerciseData();
  };
  
  // Remove a word from the selected words list
  const removeSelectedWord = (index) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Left Column - Teacher Input */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Teacher Input</h2>
        
        {/* Exercise Type */}
        <div className="mb-4">
          <label htmlFor="exerciseType" className="block text-sm font-medium text-gray-700 mb-1">
            Exercise Type
          </label>
          <select
            id="exerciseType"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value="fill-in-blank"
            disabled
          >
            <option value="fill-in-blank">Fill in the Blank</option>
          </select>
        </div>
        
        {/* Source Text */}
        <div className="mb-4">
          <label htmlFor="sourceText" className="block text-sm font-medium text-gray-700 mb-1">
            Source Text
          </label>
          <textarea
            id="sourceText"
            rows={8}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            onMouseUp={handleWordSelect}
            placeholder="Enter or paste the text here. Select words to turn them into blanks."
          />
          <p className="text-sm text-gray-500 mt-1">
            Select words in the text to create blanks. Click on a word and it will be added to the list below.
          </p>
        </div>
        
        {/* Selected Words */}
        {selectedWords.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Words to Replace with Blanks
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <div 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
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
              ))}
            </div>
          </div>
        )}
        
        {/* Generate Button */}
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          onClick={handleGenerateExercise}
          disabled={isGenerating || selectedWords.length === 0 || !sourceText.trim()}
        >
          {isGenerating ? 'Generating...' : 'Generate Exercise'}
        </button>
        
        {/* Request Data Preview (for debugging) */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Request Data</h3>
          <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto h-32">
            {JSON.stringify(
              {
                exercise_type: "fill_in_blank",
                source_text: sourceText,
                words_to_blank: selectedWords
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
      
      {/* Right Column - Exercise Preview */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold">Exercise Preview</h2>
        </div>
        
        <div className="p-6">
          {exerciseData ? (
            <FillInBlankExerciseSimple exercise={exerciseData} />
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Placeholder for fill_in_blank exercise</h3>
              <p className="text-gray-500">This exercise type hasn't been implemented yet.</p>
            </div>
          )}
        </div>
        
        {/* Response Data (for debugging) */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Response Data (Debug View)</h3>
          <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto h-32">
            {exerciseData ? (
              JSON.stringify(exerciseData, null, 2)
            ) : (
              JSON.stringify(
                {
                  exercise_type: "fill_in_blank",
                  question: "This is a placeholder for fill_in_blank exercise"
                },
                null,
                2
              )
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TeacherFillInBlankGenerator;