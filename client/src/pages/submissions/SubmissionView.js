import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Alert from '../../components/common/Alert';

const SubmissionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true);
      try {
        // This would be an actual API call in a complete implementation
        // Simulate API response
        setTimeout(() => {
          const mockSubmission = {
            id,
            exerciseId: 'exercise123',
            exerciseTitle: 'Sample Exercise',
            studentId: 'student456',
            studentName: 'John Doe',
            score: 85,
            maxScore: 100,
            submittedAt: new Date().toISOString(),
            answers: [
              {
                questionId: 'q1',
                questionText: 'What is 2 + 2?',
                studentAnswer: '4',
                isCorrect: true,
                pointsEarned: 5,
                pointsPossible: 5
              },
              {
                questionId: 'q2',
                questionText: 'Who wrote Romeo and Juliet?',
                studentAnswer: 'William Shakespeare',
                isCorrect: true,
                pointsEarned: 5,
                pointsPossible: 5
              }
            ]
          };
          
          setSubmission(mockSubmission);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load submission. Please try again.');
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !submission) {
    return <Alert type="error" message={error || 'Submission not found'} />;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Submission Details</h1>
        <div>
          {auth.user?.role === 'teacher' || auth.user?.role === 'admin' ? (
            <Link to={`/submissions/${id}/grade`} className="btn btn-success me-2">
              Grade with AI
            </Link>
          ) : null}
          <button className="btn btn-secondary" onClick={() => navigate('/submissions')}>
            Back to Submissions
          </button>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title h5 mb-0">
            Exercise: {submission.exerciseTitle}
          </h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Student:</strong> {submission.studentName}</p>
              <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Score:</strong> {submission.score} / {submission.maxScore}
                <span className="ms-2 badge bg-primary">
                  {Math.round((submission.score / submission.maxScore) * 100)}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <h3>Answers</h3>
      {submission.answers.map((answer, index) => (
        <div 
          key={answer.questionId} 
          className={`card mb-3 ${answer.isCorrect ? 'border-success' : 'border-danger'}`}
        >
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="h6 mb-0">Question {index + 1}</h4>
              <span className={`badge ${answer.isCorrect ? 'bg-success' : 'bg-danger'}`}>
                {answer.pointsEarned} / {answer.pointsPossible} points
              </span>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text"><strong>Question:</strong> {answer.questionText}</p>
            <p className="card-text"><strong>Student's Answer:</strong> {answer.studentAnswer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionView;
