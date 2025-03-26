import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SubmissionsList = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For now, let's use mock data - replace with actual API call later
        setTimeout(() => {
          const mockSubmissions = [
            {
              _id: '1',
              student: { _id: user?._id, name: 'Current User' },
              exercise: { 
                _id: '1', 
                title: 'Basic Vocabulary Quiz',
                type: 'multiple-choice',
                creator: { name: 'Teacher Name' }
              },
              score: 80,
              maxScore: 100,
              percentage: 80,
              completedAt: '2023-01-25T13:30:00Z',
              timeSpent: 420, // in seconds
              feedback: 'Good work! Pay attention to the nuances in meaning.',
              autoGraded: true
            },
            {
              _id: '2',
              student: { _id: user?._id, name: 'Current User' },
              exercise: { 
                _id: '2', 
                title: 'Math Word Problems',
                type: 'short-answer',
                creator: { name: 'Another Teacher' }
              },
              score: 70,
              maxScore: 100,
              percentage: 70,
              completedAt: '2023-02-28T10:15:00Z',
              timeSpent: 600, // in seconds
              feedback: 'Good effort, but remember to show your work in detail.',
              autoGraded: false
            },
            {
              _id: '3',
              student: { _id: '456', name: 'Student Name' },
              exercise: { 
                _id: '3', 
                title: 'Reading Comprehension: The Raven',
                type: 'comprehension',
                creator: { name: 'Current User' }
              },
              score: 90,
              maxScore: 100,
              percentage: 90,
              completedAt: '2023-03-15T14:45:00Z',
              timeSpent: 540, // in seconds
              feedback: 'Excellent understanding of the text and themes!',
              autoGraded: true
            }
          ];
          
          // Filter submissions based on user role
          const filteredSubmissions = user?.role === 'student'
            ? mockSubmissions.filter(sub => sub.student._id === user?._id)
            : mockSubmissions.filter(sub => {
                // For teachers, show submissions for their exercises
                if (user?.role === 'teacher') {
                  return sub.exercise.creator.name === 'Current User';
                }
                // Admins can see all submissions
                return true;
              });
          
          setSubmissions(filteredSubmissions);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError('Failed to fetch submissions');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user?._id, user?.role]);

  // Format time spent in minutes and seconds
  const formatTimeSpent = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get status badge color
  const getStatusColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-info';
    if (percentage >= 40) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="container">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h1>{user?.role === 'student' ? 'My Submissions' : 'Student Submissions'}</h1>
          <p>
            {user?.role === 'student'
              ? 'View your submitted exercises and results'
              : 'View and manage student submissions'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : submissions.length === 0 ? (
        <div className="text-center p-5 bg-light">
          <h3>No submissions found</h3>
          <p>
            {user?.role === 'student'
              ? "You haven't submitted any exercises yet."
              : "There are no submissions to review."}
          </p>
          {user?.role === 'student' && (
            <Link to="/exercises" className="btn btn-primary mt-3">
              Browse Exercises
            </Link>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Exercise</th>
                  {user?.role !== 'student' && <th>Student</th>}
                  <th>Score</th>
                  <th>Completed On</th>
                  <th>Time Spent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(submission => (
                  <tr key={submission._id}>
                    <td>
                      <Link to={`/exercises/${submission.exercise._id}`}>
                        {submission.exercise.title}
                      </Link>
                      <div>
                        <small className="text-secondary">
                          {submission.exercise.type.replace('-', ' ')}
                        </small>
                      </div>
                    </td>
                    {user?.role !== 'student' && (
                      <td>{submission.student.name}</td>
                    )}
                    <td>
                      {submission.score !== null
                        ? `${submission.score}/${submission.maxScore} (${submission.percentage}%)`
                        : 'Not graded'}
                    </td>
                    <td>{new Date(submission.completedAt).toLocaleString()}</td>
                    <td>{formatTimeSpent(submission.timeSpent)}</td>
                    <td>
                      {submission.score !== null ? (
                        <span className={`badge ${getStatusColor(submission.percentage)}`}>
                          {submission.percentage >= 80
                            ? 'Excellent'
                            : submission.percentage >= 60
                            ? 'Good'
                            : submission.percentage >= 40
                            ? 'Fair'
                            : 'Needs Improvement'}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Pending</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/submissions/${submission._id}`} className="btn btn-sm btn-outline-primary">
                        {user?.role === 'student' ? 'View Results' : 'Review'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsList;
