/**
 * Application Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Debug mode - controlled via environment variable
const DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';

// Log debug information if in debug mode
if (DEBUG) {
  console.log('🔍 Starting application in DEBUG mode');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('React version:', React.version);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
