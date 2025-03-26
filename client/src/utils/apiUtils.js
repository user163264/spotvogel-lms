import React, { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for handling API requests with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {any} initialData - Initial data state
 * @returns {Object} - { data, loading, error, execute, setData }
 */
export const useApi = (apiFunction, dependencies = [], initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, execute, setData };
};

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
  </div>
);

/**
 * Error Alert Component
 * @param {string} message - Error message to display
 * @param {Function} onRetry - Optional retry function
 */
export const ErrorAlert = ({ message, onRetry }) => (
  <div className="alert alert-danger">
    <p>{message || 'An error occurred'}</p>
    {onRetry && (
      <button 
        onClick={onRetry} 
        className="btn btn-sm btn-outline-danger mt-2"
      >
        Try Again
      </button>
    )}
  </div>
);

/**
 * Empty State Component
 * @param {string} message - Message to display
 * @param {React.ReactNode} children - Optional child elements (like action buttons)
 */
export const EmptyState = ({ message, children }) => (
  <div className="text-center p-5 bg-light">
    <h3>Nothing to display</h3>
    <p>{message}</p>
    {children}
  </div>
);

/**
 * Format error message from API response
 * @param {Object|string} error - Error object or message
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.error) return error.error;
  
  return 'An error occurred';
};
