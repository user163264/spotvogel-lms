/**
 * Main App Component with Tailwind Toggle
 * 
 * This version includes the ability to toggle between original and Tailwind-styled components
 * 
 * @author Finny Frontend
 * @date April 1, 2025
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Original Components
import MatchingExerciseDemoPage from './pages/MatchingExerciseDemoPage';
import AIMatchingExerciseDemoPage from './pages/AIMatchingExerciseDemoPage';
import AiMatchingWordsTestPage from './pages/test/AiMatchingWordsTestPage';
import SimpleTestPage from './pages/test/SimpleTestPage';
import TailwindComponentsDemo from './pages/demo/TailwindComponentsDemo';
import ExerciseCardDemo from './pages/demo/ExerciseCardDemo';
import FormComponentsDemo from './pages/demo/FormComponentsDemo';

// Tailwind Versions
import { AIMatchingExerciseDemoPageTailwind } from './pages/tailwind';

// Debug Components
import TailwindTestComponent from './components/debug/TailwindTestComponent';
import CssDiagnosticTool from './components/debug/CssDiagnosticTool';

// UI Components
import { Button, Badge } from './components/ui';

// CSS Utilities
import { cssVars, isTailwindLoaded } from './utils/cssUtils';

// Debug mode flag
const DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';

/**
 * App component - the main entry point of the application
 */
const App = () => {
  // Always use Tailwind version
  const [useTailwind, setUseTailwind] = useState(true);
  
  const toggleTailwind = () => {
    setUseTailwind(prev => !prev);
  };

  // Basic styles as fallback if Tailwind doesn't load
  const headerStyle = {
    backgroundColor: cssVars.colors.primary,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  };
  
  const navLinkStyle = {
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    transition: 'color 0.2s ease-in-out',
  };
  
  const navLinkHoverStyle = {
    ...navLinkStyle,
    color: '#bfdbfe', // light blue
  };
  
  const footerStyle = {
    backgroundColor: '#f3f4f6', // neutral-100
    borderTop: '1px solid #e5e7eb', // neutral-200
    marginTop: 'auto',
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-neutral-50" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <header className="bg-primary shadow-sm" style={headerStyle}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center" style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="text-xl font-bold text-white" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>LMS System</div>
            <nav className="flex space-x-6 overflow-x-auto pb-1" style={{ display: 'flex', columnGap: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              <Link to="/" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200" style={navLinkStyle}>
                Home
              </Link>
              <Link to="/exercises/matching-demo" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200" style={navLinkStyle}>
                Matching Exercise
              </Link>
              <Link to="/exercises/ai-matching-demo" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200" style={navLinkStyle}>
                AI Matching
              </Link>
              <Link to="/test/ai-matching" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200" style={navLinkStyle}>
                AI Test
              </Link>
              <Link to="/test/simple" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200" style={navLinkStyle}>
                Simple Test
              </Link>
              <Link to="/demo/tailwind-components" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200" style={navLinkStyle}>
                Tailwind UI
              </Link>
              <Link to="/demo/exercise-card" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200" style={navLinkStyle}>
                Exercise Cards
              </Link>
              <Link to="/demo/form-components" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200" style={navLinkStyle}>
                Form Components
              </Link>
              {DEBUG && (
                <>
                  <Link to="/debug/css-test" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200 bg-error" style={{...navLinkStyle, backgroundColor: cssVars.colors.error}}>
                    CSS Test
                  </Link>
                  <Link to="/debug/css-diagnostic" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200 bg-warning" style={{...navLinkStyle, backgroundColor: cssVars.colors.warning}}>
                    CSS Diagnostic
                  </Link>
                </>
              )}
            </nav>
            
            <div className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', columnGap: '0.75rem' }}>
              {DEBUG && <Badge variant="error">DEBUG</Badge>}
            </div>
          </div>
        </header>
        
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ flexGrow: 1, maxWidth: '80rem', width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
          {/* Debug CSS banner when in DEBUG mode */}
          {DEBUG && (
            <div className="mb-6 p-3 bg-blue-100 border border-blue-300 rounded-md text-blue-800 text-sm" style={{ marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '0.375rem', color: '#1e40af', fontSize: '0.875rem' }}>
              <strong>CSS Debugging Mode:</strong> Using simplified PostCSS configuration.
              <button 
                onClick={() => alert('Current CSS classes in body: ' + document.body.className)}
                className="ml-3 px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded text-xs"
                style={{ marginLeft: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#bfdbfe', borderRadius: '0.25rem', fontSize: '0.75rem' }}
              >
                Check CSS Classes
              </button>
            </div>
          )}
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/exercises/matching-demo" element={<MatchingExerciseDemoPage />} />
            <Route 
              path="/exercises/ai-matching-demo" 
              element={<AIMatchingExerciseDemoPageTailwind />}
            />
            <Route path="/test/ai-matching" element={<AiMatchingWordsTestPage />} />
            <Route path="/test/simple" element={<SimpleTestPage />} />
            <Route path="/demo/tailwind-components" element={<TailwindComponentsDemo />} />
            <Route path="/demo/exercise-card" element={<ExerciseCardDemo />} />
            <Route path="/demo/form-components" element={<FormComponentsDemo />} />
            {DEBUG && (
              <>
                <Route path="/debug/css-test" element={<TailwindTestComponent />} />
                <Route path="/debug/css-diagnostic" element={<CssDiagnosticTool />} />
              </>
            )}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <footer className="bg-neutral-100 border-t border-neutral-200 py-6 mt-auto" style={footerStyle}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-600" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', color: '#4b5563' }}>
            <p>&copy; {new Date().getFullYear()} LMS System Demo</p>
            {DEBUG && <p className="text-xs text-neutral-500 mt-1" style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Running in debug mode</p>}
          </div>
        </footer>
      </div>
    </Router>
  );
};

/**
 * Home Page Component - Redesigned with Tailwind CSS
 */
const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto" style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <h1 className="text-3xl font-bold text-neutral-900 mb-4" style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Learning Management System</h1>
      <p className="text-neutral-700 mb-8" style={{ color: '#374151', marginBottom: '2rem' }}>
        Welcome to the LMS System demo. Use the navigation to explore the features.
      </p>
      
      <div className="mt-8" style={{ marginTop: '2rem' }}>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>Demo Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1.5rem' }}>
          <Link to="/exercises/matching-demo" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ display: 'block', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors" style={{ fontSize: '1.125rem', fontWeight: '500', color: cssVars.colors.primary, marginBottom: '0.5rem' }}>
              Matching Exercise
            </h3>
            <p className="text-neutral-600 text-sm" style={{ color: '#4b5563', fontSize: '0.875rem' }}>
              Interactive matching exercise component demonstration
            </p>
          </Link>
          
          <Link to="/exercises/ai-matching-demo" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ display: 'block', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors" style={{ fontSize: '1.125rem', fontWeight: '500', color: cssVars.colors.primary, marginBottom: '0.5rem' }}>
              AI Matching Exercise Demo
            </h3>
            <p className="text-neutral-600 text-sm" style={{ color: '#4b5563', fontSize: '0.875rem' }}>
              Automatically generate matching exercises from lesson content using AI
            </p>
            <Badge variant="secondary" className="mt-2">Tailwind Toggle Available</Badge>
          </Link>
          
          <Link to="/test/ai-matching" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ display: 'block', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors" style={{ fontSize: '1.125rem', fontWeight: '500', color: cssVars.colors.primary, marginBottom: '0.5rem' }}>
              AI Matching Words Test
            </h3>
            <p className="text-neutral-600 text-sm" style={{ color: '#4b5563', fontSize: '0.875rem' }}>
              Test AI-generated matching exercises using OpenAI
            </p>
          </Link>
          
          <Link to="/demo/tailwind-components" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ display: 'block', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors" style={{ fontSize: '1.125rem', fontWeight: '500', color: cssVars.colors.primary, marginBottom: '0.5rem' }}>
              Tailwind UI Components
            </h3>
            <p className="text-neutral-600 text-sm" style={{ color: '#4b5563', fontSize: '0.875rem' }}>
              Modern minimalist UI components built with Tailwind CSS
            </p>
          </Link>
          
          <Link to="/demo/exercise-card" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ display: 'block', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors" style={{ fontSize: '1.125rem', fontWeight: '500', color: cssVars.colors.primary, marginBottom: '0.5rem' }}>
              Exercise Cards
            </h3>
            <p className="text-neutral-600 text-sm" style={{ color: '#4b5563', fontSize: '0.875rem' }}>
              Showcase of our new exercise card components with minimalist design
            </p>
          </Link>
          
          <Link to="/demo/form-components" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ display: 'block', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors" style={{ fontSize: '1.125rem', fontWeight: '500', color: cssVars.colors.primary, marginBottom: '0.5rem' }}>
              Form Components
            </h3>
            <p className="text-neutral-600 text-sm" style={{ color: '#4b5563', fontSize: '0.875rem' }}>
              Interactive demo of our new form components with Tailwind styling
            </p>
            <Badge variant="primary" className="mt-2">New</Badge>
          </Link>
          
          {DEBUG && (
            <>
              <Link to="/debug/css-test" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ display: 'block', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <h3 className="text-lg font-medium text-error mb-2" style={{ fontSize: '1.125rem', fontWeight: '500', color: cssVars.colors.error, marginBottom: '0.5rem' }}>
                  CSS Test Component
                </h3>
                <p className="text-neutral-600 text-sm" style={{ color: '#4b5563', fontSize: '0.875rem' }}>
                  Test component to verify Tailwind CSS styling is working correctly
                </p>
                <Badge variant="error" className="mt-2">Debug</Badge>
              </Link>
              
              <Link to="/debug/css-diagnostic" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1" style={{ display: 'block', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <h3 className="text-lg font-medium text-warning mb-2" style={{ fontSize: '1.125rem', fontWeight: '500', color: cssVars.colors.warning, marginBottom: '0.5rem' }}>
                  CSS Diagnostic Tool
                </h3>
                <p className="text-neutral-600 text-sm" style={{ color: '#4b5563', fontSize: '0.875rem' }}>
                  Comprehensive tool for diagnosing CSS loading and application issues
                </p>
                <Badge variant="warning" className="mt-2">Debug</Badge>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 404 Not Found Page - Redesigned with Tailwind CSS
 */
const NotFoundPage = () => {
  return (
    <div className="max-w-lg mx-auto text-center py-12" style={{ maxWidth: '32rem', margin: '0 auto', textAlign: 'center', padding: '3rem 0' }}>
      <h1 className="text-4xl font-bold text-neutral-900 mb-4" style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p className="text-lg text-neutral-600 mb-8" style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '2rem' }}>
        The page you are looking for does not exist.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors duration-200"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.625rem 1.25rem', backgroundColor: cssVars.colors.primary, color: 'white', fontWeight: '500', borderRadius: '0.375rem' }}
      >
        Return to Home
      </Link>
    </div>
  );
};

export default App;
