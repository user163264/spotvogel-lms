import React, { useState } from 'react';
import '../common/SlateEditor.css';
import { v4 as uuidv4 } from 'uuid';
import FormField from '../common/FormField';
import SlateEditor from '../common/SlateEditor';
import QuestionTypeSelector from './QuestionTypeSelector';
import AnswerOptionsBuilder from './AnswerOptionsBuilder';

const QuestionBuilder = ({ question, questionNumber, onChange, onRemove }) => {
  const [expanded, setExpanded] = useState(true);
  const [errors] = useState({});

  // Handle changes to the question fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...question,
      [name]: value
    });
  };

  // Handle changes to the feedback fields
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    const feedbackType = name.split('.')[1]; // Extract 'correct' or 'incorrect'
    
    onChange({
      ...question,
      feedback: {
        ...question.feedback,
        [feedbackType]: value
      }
    });
  };

  // Handle changing the question type
  const handleTypeChange = (type) => {
    let updatedQuestion = {
      ...question,
      type
    };
    
    // Reset options based on the new type
    if (type === 'multiple-choice' || type === 'checkbox') {
      updatedQuestion.options = [
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false }
      ];
    } else if (type === 'true-false') {
      updatedQuestion.options = [
        { id: uuidv4(), text: 'True', isCorrect: false },
        { id: uuidv4(), text: 'False', isCorrect: false }
      ];
    } else {
      // For text, numeric, etc.
      updatedQuestion.options = [];
      updatedQuestion.correctAnswer = '';
    }
    
    onChange(updatedQuestion);
  };

  // Handle changes to the options (for multiple choice, checkbox)
  const handleOptionsChange = (updatedOptions) => {
    onChange({
      ...question,
      options: updatedOptions
    });
  };

  // Handle setting the correct answer for text/numeric questions
  const handleCorrectAnswerChange = (e) => {
    onChange({
      ...question,
      correctAnswer: e.target.value
    });
  };

  return (
    <div className={`question-builder ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="question-builder__header" onClick={() => setExpanded(!expanded)}>
        <h3>Question {questionNumber}</h3>
        <div className="question-actions">
          <button 
            type="button" 
            className="icon-button" 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? '▼' : '►'}
          </button>
          <button 
            type="button" 
            className="icon-button delete" 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            🗑️
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="question-builder__content">
          <div className="question-type-selector">
            <QuestionTypeSelector 
              selectedType={question.type} 
              onChange={handleTypeChange} 
            />
          </div>
          
          <div className="question-prompt">
            <SlateEditor
              label="Question Prompt"
              value={question.prompt}
              onChange={handleChange}
              error={errors.prompt}
              required
            />
          </div>
          
          {(question.type === 'multiple-choice' || question.type === 'checkbox' || question.type === 'true-false') && (
            <AnswerOptionsBuilder 
              options={question.options}
              type={question.type}
              onChange={handleOptionsChange}
            />
          )}
          
          {(question.type === 'text' || question.type === 'numeric') && (
            <div className="correct-answer">
              <FormField
                label="Correct Answer"
                name="correctAnswer"
                type={question.type === 'numeric' ? 'number' : 'text'}
                value={question.correctAnswer || ''}
                onChange={handleCorrectAnswerChange}
                error={errors.correctAnswer}
                required
              />
            </div>
          )}
          
          <div className="question-points">
            <FormField
              label="Points"
              name="points"
              type="number"
              value={question.points}
              onChange={handleChange}
              min={1}
              max={100}
            />
          </div>
          
          <div className="question-feedback">
            <h4>Feedback</h4>
            <div className="feedback-fields">
              <FormField
                label="Feedback for Correct Answer"
                name="feedback.correct"
                type="textarea"
                value={question.feedback.correct}
                onChange={handleFeedbackChange}
              />
              
              <FormField
                label="Feedback for Incorrect Answer"
                name="feedback.incorrect"
                type="textarea"
                value={question.feedback.incorrect}
                onChange={handleFeedbackChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBuilder;