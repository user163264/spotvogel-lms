import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import aiService from '../../services/aiService';
import * as submissionService from '../../services/submissionService';

/**
 * Auto Grader Component
 * Uses AI to automatically grade student submissions for an exercise
 */
const AutoGrader = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGrading, setIsGrading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [gradingResult, setGradingResult] = useState(null);
  
  // Form state for manual adjustments
  const [adjustedGrade, setAdjustedGrade] = useState({
    score: 0,
    feedback: '',
    teacherNotes: ''
  });
  
  // Fetch submission data
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        
        const response = await submissionService.getSubmissionById(submissionId);
        setSubmission(response.submission);
        setExercise(response.submission.exercise);
        
        // Initialize adjusted grade if submission is already graded
        if (response.submission.isGraded) {
          setAdjustedGrade({
            score: response.submission.grade || 0,
            feedback: response.submission.feedback || '',
            teacherNotes: response.submission.teacherNotes || ''
          });
        }
      } catch (err) {
        setError('Failed to load submission: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);
  
  // Handle auto-grading
  const handleAutoGrade = async () => {
    if (!submission) return;
    
    setIsGrading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await aiService.gradeSubmission(submissionId);
      setGradingResult(result.submission);
      setSuccess('Submission graded successfully!');
      
      // Update local state
      setSubmission(result.submission);
      
      // Initialize adjusted grade with AI results
      setAdjustedGrade({
        score: result.submission.grade || 0,
        feedback: result.submission.feedback || '',
        teacherNotes: result.submission.teacherNotes || ''
      });
    } catch (err) {
      setError('Failed to grade submission: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsGrading(false);
    }
  };
  
  // Handle manual adjustment of the grade
  const handleAdjustGrade = async (e) => {
    e.preventDefault();
    
    setIsGrading(true);
    setError('');
    setSuccess('');
    
    try {
      // Update the submission with adjusted grade
      const result = await submissionService.updateSubmission(submissionId, {
        grade: adjustedGrade.score,
        feedback: adjustedGrade.feedback,
        teacherNotes: adjustedGrade.teacherNotes,
        isGraded: true,
        gradedAt: new Date().toISOString()
      });
      
      setSubmission(result.submission);
      setSuccess('Grade adjusted and saved successfully!');
      
      // Navigate back to submissions list after a short delay
      setTimeout(() => {
        navigate('/submissions');
      }, 2000);
    } catch (err) {
      setError('Failed to save adjusted grade: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsGrading(false);
    }
  };
  
  // Handle form input changes for grade adjustments
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdjustedGrade({
      ...adjustedGrade,
      [name]: name === 'score' ? parseInt(value, 10) : value
    });
  };
  
  if (isLoading) {
    return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  }
  
  if (error && !submission) {
    return <div className="alert alert-danger my-3">{error}</div>;
  }
  
  if (!submission) {
    return <div className="alert alert-warning my-3">Submission not found</div>;
  }
  
  return (
    <div className="auto-grader">
      <h2>AI-Assisted Grading</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Exercise</h4>
            </div>
            <div className="card-body">
              {exercise ? (
                <>
                  <h5>{exercise.title}</h5>
                  <p><strong>Subject:</strong> {exercise.subject}</p>
                  <p><strong>Topic:</strong> {exercise.topic}</p>
                  <p><strong>Type:</strong> {exercise.type}</p>
                  
                  <div className="exercise-content mt-3">
                    <h6>Question:</h6>
                    <p>{exercise.content?.question}</p>
                    
                    {exercise.type === 'multiple-choice' && exercise.content?.options && (
                      <div className="options">
                        <h6>Options:</h6>
                        <ol type="A">
                          {exercise.content.options.map((option, idx) => (
                            <li key={idx} className={idx === exercise.content.correctAnswer ? 'text-success' : ''}>
                              {option} {idx === exercise.content.correctAnswer && '✓'}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    
                    {exercise.content?.correctAnswer && !exercise.content?.options && (
                      <div className="correct-answer">
                        <h6>Correct Answer:</h6>
                        <p>{exercise.content.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-muted">Exercise details not available</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Student Submission</h4>
            </div>
            <div className="card-body">
              <p><strong>Student:</strong> {submission.student?.name || 'Unknown'}</p>
              <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
              
              <div className="submission-content mt-3">
                <h6>Student's Answer:</h6>
                <div className="answer-box p-3 border rounded">
                  {submission.answer}
                </div>
                
                {submission.attachments && submission.attachments.length > 0 && (
                  <div className="attachments mt-3">
                    <h6>Attachments:</h6>
                    <ul className="list-group">
                      {submission.attachments.map((attachment, idx) => (
                        <li key={idx} className="list-group-item">
                          <a href={attachment.url} target="_blank" rel="noreferrer">
                            {attachment.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {!submission.isGraded && (
        <div className="auto-grade-section text-center my-4">
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleAutoGrade}
            disabled={isGrading}
          >
            {isGrading ? 'Grading...' : 'Auto-Grade with AI'}
          </button>
          <p className="text-muted mt-2">
            Let AI evaluate the student's submission based on the exercise criteria
          </p>
        </div>
      )}
      
      {submission.isGraded && (
        <div className="grading-result card my-4">
          <div className="card-header bg-success text-white">
            <h4>Grading Results</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 text-center">
                <h1 className="display-4">{submission.grade}/100</h1>
                <p className="text-muted">Score</p>
              </div>
              <div className="col-md-9">
                <h5>Feedback:</h5>
                <p>{submission.feedback}</p>
                
                {submission.strengths && submission.strengths.length > 0 && (
                  <div className="strengths">
                    <h6 className="text-success">Strengths:</h6>
                    <ul>
                      {submission.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {submission.improvements && submission.improvements.length > 0 && (
                  <div className="improvements">
                    <h6 className="text-warning">Areas for Improvement:</h6>
                    <ul>
                      {submission.improvements.map((improvement, idx) => (
                        <li key={idx}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {submission.teacherNotes && (
                  <div className="teacher-notes mt-3">
                    <h6>Teacher Notes:</h6>
                    <p className="font-italic">{submission.teacherNotes}</p>
                  </div>
                )}
                
                <p className="text-muted mt-3">
                  Graded on {new Date(submission.gradedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="adjust-grade-section card my-4">
        <div className="card-header">
          <h4>{submission.isGraded ? 'Adjust Grade' : 'Manual Grading'}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleAdjustGrade}>
            <div className="form-group">
              <label htmlFor="score">Score (0-100)</label>
              <input
                type="number"
                id="score"
                name="score"
                min="0"
                max="100"
                className="form-control"
                value={adjustedGrade.score}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="feedback">Feedback for Student</label>
              <textarea
                id="feedback"
                name="feedback"
                rows="4"
                className="form-control"
                value={adjustedGrade.feedback}
                onChange={handleChange}
                placeholder="Provide constructive feedback for the student..."
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="teacherNotes">Private Teacher Notes</label>
              <textarea
                id="teacherNotes"
                name="teacherNotes"
                rows="2"
                className="form-control"
                value={adjustedGrade.teacherNotes}
                onChange={handleChange}
                placeholder="Notes visible only to teachers..."
              ></textarea>
            </div>
            
            <div className="form-group text-center">
              <button
                type="submit"
                className="btn btn-success mr-2"
                disabled={isGrading}
              >
                {isGrading ? 'Saving...' : 'Save Grade'}
              </button>
              
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/submissions')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AutoGrader;
