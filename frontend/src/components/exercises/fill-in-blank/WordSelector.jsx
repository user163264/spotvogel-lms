import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for selecting words from text to create blanks
 */
const WordSelector = ({ 
  sourceText, 
  selectedWords, 
  onWordSelect, 
  onWordRemove 
}) => {
  // Handle text selection
  const handleSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && !selectedWords.includes(selectedText)) {
      onWordSelect(selectedText);
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Source Text
        </label>
        <textarea
          value={sourceText}
          onChange={(e) => onWordSelect(null, e.target.value)}
          onMouseUp={handleSelection}
          placeholder="Enter the text from which to generate exercises..."
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-64"
        />
        <p className="text-xs text-slate-500 mt-1">
          Select words by highlighting them with your mouse to add them as blanks
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Words to Replace with Blanks
        </label>
        <div className="flex flex-wrap gap-2">
          {selectedWords.length > 0 ? (
            selectedWords.map((word, index) => (
              <div 
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
              >
                <span>{word}</span>
                <button
                  type="button"
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  onClick={() => onWordRemove(index)}
                >
                  &times;
                </button>
              </div>
            ))
          ) : (
            <div className="text-slate-400 text-sm">No words selected yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

WordSelector.propTypes = {
  sourceText: PropTypes.string.isRequired,
  selectedWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  onWordSelect: PropTypes.func.isRequired,
  onWordRemove: PropTypes.func.isRequired
};

export default WordSelector;