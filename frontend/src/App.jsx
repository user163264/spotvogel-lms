/**
 * Main App Component
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MatchingExerciseDemoPage from './pages/MatchingExerciseDemoPage';
import AIMatchingExerciseDemoPage from './pages/AIMatchingExerciseDemoPage';
import AiMatchingWordsTestPage from './pages/test/AiMatchingWordsTestPage';
import SimpleTestPage from './pages/test/SimpleTestPage';
import './App.css';

// Debug mode flag
const DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';

/**
 * App component - the main entry point of the application
 */
const App = () => {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="app-logo">LMS System</div>
          <nav className="app-nav">
            <Link to="/">Home</Link>
            <Link to="/exercises/matching-demo">Matching Exercise Demo</Link>
            <Link to="/exercises/ai-matching-demo">AI Matching Exercise Demo</Link>
            <Link to="/test/ai-matching">AI Matching Words Test</Link>
            <Link to="/test/simple">Simple Test</Link>
          </nav>
          {DEBUG && <div className="debug-badge">DEBUG MODE</div>}
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/exercises/matching-demo" element={<MatchingExerciseDemoPage />} />
            <Route path="/exercises/ai-matching-demo" element={<AIMatchingExerciseDemoPage />} />
            <Route path="/test/ai-matching" element={<AiMatchingWordsTestPage />} />
            <Route path="/test/simple" element={<SimpleTestPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} LMS System Demo</p>
            {DEBUG && <p className="debug-info">Running in debug mode</p>}
          </div>
        </footer>
      </div>
    </Router>
  );
};

/**
 * Home Page Component
 */
const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Learning Management System</h1>
      <p>Welcome to the LMS System demo. Use the navigation to explore the features.</p>
      
      <div className="feature-links">
        <h2>Demo Features</h2>
        <ul>
          <li>
            <Link to="/exercises/matching-demo" className="feature-link">
              <span className="feature-title">Matching Exercise</span>
              <span className="feature-desc">Interactive matching exercise component demonstration</span>
            </Link>
          </li>
          <li>
            <Link to="/exercises/ai-matching-demo" className="feature-link">
              <span className="feature-title">AI Matching Exercise Demo</span>
              <span className="feature-desc">Automatically generate matching exercises from lesson content using AI</span>
            </Link>
          </li>
          <li>
            <Link to="/test/ai-matching" className="feature-link">
              <span className="feature-title">AI Matching Words Test</span>
              <span className="feature-desc">Test AI-generated matching exercises using OpenAI</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

/**
 * 404 Not Found Page
 */
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="return-home">Return to Home</Link>
    </div>
  );
};

export default App;
