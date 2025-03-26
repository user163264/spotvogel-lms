import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/config';
import { Alert, LoadingIndicator } from '../common';
import axios from 'axios';

// Import all services
import * as authService from '../../services/authService';
import * as exerciseService from '../../services/exerciseService';
import * as templateService from '../../services/templateService';
import * as submissionService from '../../services/submissionService';

const ApiTester = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTest, setActiveTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [requestHeaders, setRequestHeaders] = useState(null);

  // Debug API Tests
  const testEchoEndpoint = async () => {
    setActiveTest('Echo API');
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/debug/echo?param1=test&param2=value`);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error calling echo endpoint');
    } finally {
      setLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setActiveTest('Auth Test API');
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/debug/auth-test`);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error calling auth test endpoint');
    } finally {
      setLoading(false);
    }
  };

  const testErrorEndpoint = async () => {
    const errorCode = prompt('Enter an HTTP error code to test (e.g., 400, 401, 403, 404, 500):', '404');
    if (!errorCode) return;

    setActiveTest(`Error ${errorCode} Test`);
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/debug/error/${errorCode}`);
      setResults(response.data);
    } catch (err) {
      // For error endpoints, we want to show the error response as the result
      if (err.response && err.response.data) {
        setResults({
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        });
      } else {
        setError(err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  const testDelayEndpoint = async () => {
    const seconds = prompt('Enter delay in seconds (1-10):', '3');
    if (!seconds) return;

    setActiveTest(`Delayed Response (${seconds}s)`);
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/debug/delay/${seconds}`);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error calling delay endpoint');
    } finally {
      setLoading(false);
    }
  };

  // Function to display request headers
  useEffect(() => {
    if (isAuthenticated) {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      setRequestHeaders(headers);
    } else {
      setRequestHeaders({
        'Content-Type': 'application/json'
      });
    }
  }, [isAuthenticated]);

  // Generic test runner function
  const runTest = async (testName, testFunction, params = []) => {
    setActiveTest(testName);
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      console.log(`Running test: ${testName}`);
      console.log('Params:', params);

      const result = await testFunction(...params);
      
      console.log('Test result:', result);
      setResults(result);
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Authentication Tests
  const testGetProfile = () => runTest('Get Profile', authService.getProfile);

  // Exercise Tests
  const testFetchExercises = () => {
    const filters = { isPublic: true };
    return runTest('Fetch Exercises', exerciseService.fetchExercises, [filters]);
  };

  const testGetExerciseById = () => {
    // You'll need a valid exercise ID here
    const exerciseId = prompt('Enter a valid exercise ID:');
    if (!exerciseId) return;
    return runTest('Get Exercise by ID', exerciseService.getExerciseById, [exerciseId]);
  };
  
  // Template Tests
  const testFetchTemplates = () => {
    const filters = { isPublic: true };
    return runTest('Fetch Templates', templateService.fetchTemplates, [filters]);
  };
  
  const testGetTemplateById = () => {
    // You'll need a valid template ID here
    const templateId = prompt('Enter a valid template ID:');
    if (!templateId) return;
    return runTest('Get Template by ID', templateService.getTemplateById, [templateId]);
  };
  
  // Submission Tests
  const testFetchSubmissions = () => {
    const filters = {};
    if (user?.role === 'student') {
      filters.student = user._id;
    }
    return runTest('Fetch Submissions', submissionService.fetchSubmissions, [filters]);
  };

  return (
    <div className="container my-4">
      <h2>API Service Tester</h2>
      
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">API Configuration</h3>
        </div>
        <div className="card-body">
          <p><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
          <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
          <p><strong>Version:</strong> {process.env.REACT_APP_VERSION || '1.0.0'}</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Auth Status</h3>
        </div>
        <div className="card-body">
          <p>
            <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </p>
          {user && (
            <div>
              <p><strong>User:</strong> {user.name} ({user.email})</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          )}
          <h5 className="mt-3">Request Headers</h5>
          <pre className="bg-light p-2">
            {JSON.stringify(requestHeaders, null, 2)}
          </pre>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Debug API Tests</h3>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testEchoEndpoint}
                disabled={loading}
              >
                Echo Test
              </button>
              
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testAuthEndpoint}
                disabled={!isAuthenticated || loading}
              >
                Auth Test
              </button>
              
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testErrorEndpoint}
                disabled={loading}
              >
                Error Test
              </button>
              
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testDelayEndpoint}
                disabled={loading}
              >
                Delay Test
              </button>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Authentication Tests</h3>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testGetProfile}
                disabled={!isAuthenticated || loading}
              >
                Get Profile
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Exercise Tests</h3>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testFetchExercises}
                disabled={loading}
              >
                Fetch Exercises
              </button>
              
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testGetExerciseById}
                disabled={loading}
              >
                Get Exercise by ID
              </button>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Template Tests</h3>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testFetchTemplates}
                disabled={loading}
              >
                Fetch Templates
              </button>
              
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testGetTemplateById}
                disabled={loading}
              >
                Get Template by ID
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Submission Tests</h3>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-primary mb-2 w-100" 
                onClick={testFetchSubmissions}
                disabled={!isAuthenticated || loading}
              >
                Fetch Submissions
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Test Results</h3>
              {activeTest && <div className="text-muted">Test: {activeTest}</div>}
            </div>
            <div className="card-body">
              {loading && <LoadingIndicator message="Running test..." />}
              
              {error && !loading && (
                <Alert
                  type="danger"
                  title="Error"
                  message={error}
                />
              )}
              
              {results && !loading && (
                <div>
                  <h5>Response:</h5>
                  <pre className="bg-light p-2" style={{ maxHeight: '400px', overflow: 'auto' }}>
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              )}
              
              {!loading && !error && !results && (
                <div className="text-center text-muted">
                  <p>Run a test to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
