import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchExercises, getMyExercises } from '../../services/exerciseService';
import { LoadingIndicator, Alert, EmptyState } from '../../components/common';

const ExerciseList = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'public'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'multiple-choice', etc.

  useEffect(() => {
    const getExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build filter object based on current filter state
        const filterParams = {};
        
        if (filter === 'my' && user?.id) {
          // Use a separate endpoint for my exercises
          const result = await getMyExercises();
          setExercises(result);
          setLoading(false);
          return;
        }
        
        // For public exercises
        if (filter === 'public') {
          filterParams.isPublished = true;
        }
        
        if (typeFilter !== 'all') {
          filterParams.type = typeFilter;
        }
        
        // Call the API service
        const result = await fetchExercises(filterParams);
        setExercises(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch exercises');
      } finally {
        setLoading(false);
      }
    };

    getExercises();
  }, [user?._id, user?.id, filter, typeFilter]);

  // No need for client-side filtering anymore since we're filtering on the server
  const filteredExercises = exercises;

  // Exercise type options
  const exerciseTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Multiple Select' },
    { value: 'true-false', label: 'True/False' },
    { value: 'text', label: 'Text Response' },
    { value: 'numeric', label: 'Numeric Response' }
  ];

  // Get type label for display
  const getTypeLabel = (type) => {
    const foundType = exerciseTypes.find(t => t.value === type);
    return foundType ? foundType.label : type;
  };

  return (
    <div className="container">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h1>Exercises</h1>
          <p>Browse and manage learning exercises</p>
        </div>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <div className="d-flex gap-2">
            <Link to="/exercises/create" className="btn btn-primary">
              Create Exercise
            </Link>
            <Link to="/exercises/generate" className="btn btn-success">
              AI Generate Exercises
            </Link>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="d-flex gap-3 mb-3">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All Exercises
          </button>
          <button
            className={`btn ${filter === 'my' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('my')}
          >
            My Exercises
          </button>
          <button
            className={`btn ${filter === 'public' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('public')}
          >
            Public Exercises
          </button>
        </div>
        
        <div>
          <label htmlFor="typeFilter" className="form-label">Filter by type:</label>
          <select
            id="typeFilter"
            className="form-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            {exerciseTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingIndicator message="Loading exercises..." />
      ) : error ? (
        <Alert 
          type="danger"
          message={error} 
          title="Error Loading Exercises"
          dismissible={false}
        />
      ) : filteredExercises.length === 0 ? (
        <EmptyState
          title="No exercises found"
          message={
            filter === 'my'
              ? "You haven't created any exercises yet."
              : filter === 'public'
              ? "There are no public exercises available."
              : "No exercises match your criteria."
          }
          action={
            (user?.role === 'teacher' || user?.role === 'admin') ? (
              <div className="d-flex justify-center gap-3 mt-3">
                <Link to="/exercises/create" className="btn btn-primary">
                  Create Exercise
                </Link>
                <Link to="/exercises/generate" className="btn btn-success">
                  AI Generate Exercises
                </Link>
              </div>
            ) : null
          }
        />
      ) : (
        <div className="exercise-grid">
          {filteredExercises.map((exercise, index) => (
            <div key={exercise?._id || exercise?.id || `exercise-fixed-${index}`} className="card exercise-card">
              <div className="card-body exercise-card-body">
                <h3 className="card-title">{exercise?.title || 'Untitled Exercise'}</h3>
                <p className="mb-3">{exercise?.description || 'No description available'}</p>
                <div className="mb-3">
                  {exercise?.subject && (
                    <span className="badge bg-primary mr-2">{exercise.subject}</span>
                  )}
                  {exercise?.grade && (
                    <span className="badge bg-secondary mr-2">{exercise.grade}</span>
                  )}
                  {exercise?.difficultyLevel && (
                    <span className="badge bg-info">{exercise.difficultyLevel}</span>
                  )}
                  {exercise?.isPublished ? (
                    <span className="badge bg-success ml-2">Published</span>
                  ) : (
                    <span className="badge bg-secondary ml-2">Draft</span>
                  )}
                  {exercise?.aiGenerated && (
                    <span className="badge bg-warning ml-2">AI Generated</span>
                  )}
                </div>
                <p className="mb-2">
                  <strong>Type:</strong> {getTypeLabel(exercise?.type || 'unknown')}
                </p>
                <p className="text-secondary mb-3">
                  {exercise?.questions?.length || 0} questions
                </p>
              </div>
              <div className="card-footer exercise-card-footer">
                <small className="text-secondary">
                  By {exercise?.creator?.name || 'Unknown'} on{' '}
                  {exercise?.createdAt ? new Date(exercise.createdAt).toLocaleDateString() : 'Unknown date'}
                </small>
                
                {/* Different buttons based on user role */}
                {user?.role === 'student' ? (
                  <Link to={`/exercises/${exercise?._id || exercise?.id || '#'}`} className="btn btn-sm btn-primary">
                    Start Exercise
                  </Link>
                ) : (
                  <Link to={`/exercises/${exercise?._id || exercise?.id || '#'}`} className="btn btn-sm btn-outline-primary">
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
