import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const AnswerOptionsBuilder = ({ options, type, onChange }) => {
  // Add a new option
  const addOption = () => {
    const newOption = {
      id: uuidv4(),
      text: '',
      isCorrect: false
    };
    
    onChange([...options, newOption]);
  };
  
  // Update an option
  const updateOption = (id, field, value) => {
    const updatedOptions = options.map(option => {
      if (option.id === id) {
        return { ...option, [field]: value };
      }
      return option;
    });
    
    // If it's a radio button behavior (multiple-choice or true-false), 
    // ensure only one option is marked correct
    if (field === 'isCorrect' && value === true && type === 'multiple-choice') {
      const finalOptions = updatedOptions.map(option => {
        if (option.id !== id) {
          return { ...option, isCorrect: false };
        }
        return option;
      });
      onChange(finalOptions);
    } else {
      onChange(updatedOptions);
    }
  };
  
  // Remove an option
  const removeOption = (id) => {
    const updatedOptions = options.filter(option => option.id !== id);
    onChange(updatedOptions);
  };
  
  // Check if we can remove options (minimum 2 options)
  const canRemoveOption = options.length > 2;
  
  return (
    <div className="answer-options-builder">
      <div className="options-header">
        <h4>Answer Options</h4>
        <button 
          type="button" 
          className="add-option-button"
          onClick={addOption}
        >
          Add Option
        </button>
      </div>
      
      <div className="options-list">
        {options.map((option, index) => (
          <div key={option.id} className="option-item">
            <div className="option-input">
              <label className="visually-hidden">Option {index + 1}</label>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => updateOption(option.id, 'text', e.target.value)}
              />
            </div>
            
            <div className="option-correct">
              <label className="checkbox-label">
                <input
                  type={type === 'checkbox' ? 'checkbox' : 'radio'}
                  name={`correct-option-${type}`}
                  checked={option.isCorrect}
                  onChange={(e) => updateOption(option.id, 'isCorrect', e.target.checked)}
                />
                Correct
              </label>
            </div>
            
            {canRemoveOption && (
              <button 
                type="button" 
                className="remove-option-button"
                onClick={() => removeOption(option.id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      
      {type === 'multiple-choice' && (
        <div className="options-help-text">
          Select one option as the correct answer.
        </div>
      )}
      
      {type === 'checkbox' && (
        <div className="options-help-text">
          Select one or more options as correct answers.
        </div>
      )}
      
      {type === 'true-false' && (
        <div className="options-help-text">
          Select either True or False as the correct answer.
        </div>
      )}
    </div>
  );
};

export default AnswerOptionsBuilder;