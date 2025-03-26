import React from 'react';

const ExerciseSaveModal = ({ exercise, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Publish Exercise</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <div className="modal-body">
          <p>
            You are about to publish the exercise "<strong>{exercise.title}</strong>" 
            which will make it available to students.
          </p>
          
          <div className="exercise-summary">
            <div className="summary-item">
              <span className="label">Subject:</span>
              <span className="value">{exercise.subject}</span>
            </div>
            <div className="summary-item">
              <span className="label">Grade Level:</span>
              <span className="value">{exercise.grade}</span>
            </div>
            <div className="summary-item">
              <span className="label">Questions:</span>
              <span className="value">{exercise.questions.length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Time Limit:</span>
              <span className="value">{exercise.timeLimit} minutes</span>
            </div>
          </div>
          
          <p className="confirmation-text">
            Are you sure you want to publish this exercise?
          </p>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Publish Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSaveModal;