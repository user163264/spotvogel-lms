/**
 * Application Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tailwind.jsx';
import './index.css';

// Debug mode - controlled via environment variable
const DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';

// Log debug information if in debug mode
if (DEBUG) {
  console.log('🔍 Starting application in DEBUG mode');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('React version:', React.version);
  
  // Add CSS debugging check
  window.addEventListener('DOMContentLoaded', () => {
    const styles = document.querySelectorAll('style');
    console.log('CSS loaded: ', styles.length > 0);
    console.log('Tailwind CSS loaded: ', Array.from(styles).some(style => 
      style.textContent.includes('@tailwind') || style.textContent.includes('tailwind')
    ));
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
