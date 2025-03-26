import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    templates: 0,
    exercises: 0,
    submissions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // This would be replaced with actual API calls when available
        // For now, we're using placeholder data
        
        // Simulating API calls with setTimeout
        setTimeout(() => {
          // Different stats for different user roles
          if (user.role === 'teacher') {
            setStats({
              templates: 5,
              exercises: 12,
              submissions: 48
            });
          } else if (user.role === 'student') {
            setStats({
              exercises: 8,
              submissions: 6,
              completionRate: '75%'
            });
          } else if (user.role === 'admin') {
            setStats({
              users: 150,
              templates: 24,
              exercises: 87,
              submissions: 342
            });
          }
          
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  // Determine what cards to show based on user role
  const renderDashboardCards = () => {
    if (user.role === 'teacher' || user.role === 'admin') {
      return (
        <div className="dashboard-grid">
          <div className="card dashboard-card">
            <div className="card-body dashboard-card-body">
              <div className="dashboard-card-icon">📝</div>
              <h3 className="dashboard-card-title">Lesson Templates</h3>
              <p className="dashboard-card-count">{stats.templates}</p>
              <p>Create and manage your lesson templates</p>
              <Link to="/templates" className="btn btn-primary dashboard-card-link">
                View Templates
              </Link>
            </div>
          </div>

          <div className="card dashboard-card">
            <div className="card-body dashboard-card-body">
              <div className="dashboard-card-icon">✏️</div>
              <h3 className="dashboard-card-title">Exercises</h3>
              <p className="dashboard-card-count">{stats.exercises}</p>
              <p>Create or generate exercises for your students</p>
              <Link to="/exercises" className="btn btn-primary dashboard-card-link">
                View Exercises
              </Link>
            </div>
          </div>

          <div className="card dashboard-card">
            <div className="card-body dashboard-card-body">
              <div className="dashboard-card-icon">📊</div>
              <h3 className="dashboard-card-title">Submissions</h3>
              <p className="dashboard-card-count">{stats.submissions}</p>
              <p>View and grade student submissions</p>
              <Link to="/submissions" className="btn btn-primary dashboard-card-link">
                View Submissions
              </Link>
            </div>
          </div>

          {user.role === 'admin' && (
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="dashboard-card-icon">👥</div>
                <h3 className="dashboard-card-title">Users</h3>
                <p className="dashboard-card-count">{stats.users}</p>
                <p>Manage teachers and students</p>
                <Link to="/admin/users" className="btn btn-primary dashboard-card-link">
                  Manage Users
                </Link>
              </div>
            </div>
          )}
        </div>
      );
    } else if (user.role === 'student') {
      return (
        <div className="dashboard-grid">
          <div className="card dashboard-card">
            <div className="card-body dashboard-card-body">
              <div className="dashboard-card-icon">✏️</div>
              <h3 className="dashboard-card-title">Available Exercises</h3>
              <p className="dashboard-card-count">{stats.exercises}</p>
              <p>Complete exercises assigned to you</p>
              <Link to="/exercises" className="btn btn-primary dashboard-card-link">
                View Exercises
              </Link>
            </div>
          </div>

          <div className="card dashboard-card">
            <div className="card-body dashboard-card-body">
              <div className="dashboard-card-icon">📊</div>
              <h3 className="dashboard-card-title">My Submissions</h3>
              <p className="dashboard-card-count">{stats.submissions}</p>
              <p>View your submitted work and feedback</p>
              <Link to="/submissions" className="btn btn-primary dashboard-card-link">
                View Submissions
              </Link>
            </div>
          </div>

          <div className="card dashboard-card">
            <div className="card-body dashboard-card-body">
              <div className="dashboard-card-icon">🎯</div>
              <h3 className="dashboard-card-title">Completion Rate</h3>
              <p className="dashboard-card-count">{stats.completionRate}</p>
              <p>Your progress on assigned exercises</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1>Welcome, {user?.name}</h1>
        <p>Your dashboard for the Teacher-Focused Learning Management System</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {renderDashboardCards()}

          {/* Quick actions section */}
          <div className="mt-5">
            <h2 className="mb-3">Quick Actions</h2>
            <div className="d-flex gap-3">
              {user.role === 'teacher' && (
                <>
                  <Link to="/templates/create" className="btn btn-primary">
                    Create New Template
                  </Link>
                  <Link to="/exercises/generate" className="btn btn-success">
                    Generate Exercise with AI
                  </Link>
                </>
              )}
              
              {user.role === 'student' && (
                <Link to="/exercises" className="btn btn-primary">
                  Start New Exercise
                </Link>
              )}
              
              <Link to="/profile" className="btn btn-secondary">
                Update Profile
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
