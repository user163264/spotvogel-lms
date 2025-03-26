import React from 'react';

/**
 * Loading indicator component
 * @param {Object} props - Component props
 * @param {string} props.message - Optional loading message
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 * @param {boolean} props.fullScreen - Whether to display full screen overlay
 */
const LoadingIndicator = ({ message = 'Loading...', size = 'md', fullScreen = false }) => {
  // Determine spinner size class
  const sizeClass = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg'
  }[size] || 'spinner-md';
  
  // Basic spinner in container
  const spinner = (
    <div className="loading-container">
      <div className={`spinner ${sizeClass}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
  
  // For full screen overlay
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};

export default LoadingIndicator;
