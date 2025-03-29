import React from 'react';

const questionTypes = [
  {
    id: 'multiple-choice',
    label: 'Multiple Choice',
    description: 'Students select one correct answer from multiple options',
    icon: '🔘'
  },
  {
    id: 'checkbox',
    label: 'Multiple Select',
    description: 'Students select multiple correct answers',
    icon: '☑️'
  },
  {
    id: 'true-false',
    label: 'True/False',
    description: 'Students select whether a statement is true or false',
    icon: '✓✗'
  },
  {
    id: 'text',
    label: 'Text Response',
    description: 'Students enter a text answer',
    icon: '📝'
  },
  {
    id: 'numeric',
    label: 'Numeric Response',
    description: 'Students enter a numeric answer',
    icon: '🔢'
  },
  {
    id: 'matching-words',
    label: 'Matching Words',
    description: 'Students match items from two columns',
    icon: '🔀'
  }
];

const QuestionTypeSelector = ({ selectedType, onChange }) => {
  return (
    <div className="question-type-selector">
      <label className="field-label">Question Type</label>
      <div className="question-type-options">
        {questionTypes.map(type => (
          <div
            key={type.id}
            className={`question-type-option ${selectedType === type.id ? 'selected' : ''}`}
            onClick={() => onChange(type.id)}
          >
            <div className="question-type-icon">{type.icon}</div>
            <div className="question-type-details">
              <div className="question-type-label">{type.label}</div>
              <div className="question-type-description">{type.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionTypeSelector;