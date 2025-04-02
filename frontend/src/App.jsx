/**
 * Main App Component
 * 
 * Redesigned with Tailwind CSS following modern minimalist principles
 * 
 * @author Finny Frontend
 * @date March 31, 2025
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MatchingExerciseDemoPage from './pages/MatchingExerciseDemoPage';
import AIMatchingExerciseDemoPage from './pages/AIMatchingExerciseDemoPage';
import AiMatchingWordsTestPage from './pages/test/AiMatchingWordsTestPage';
import SimpleTestPage from './pages/test/SimpleTestPage';
import TailwindComponentsDemo from './pages/demo/TailwindComponentsDemo';
import ExerciseCardDemo from './pages/demo/ExerciseCardDemo';
import FormComponentsDemo from './pages/demo/FormComponentsDemo';

// Debug Components
import TailwindTestComponent from './components/debug/TailwindTestComponent';
import CssDiagnosticTool from './components/debug/CssDiagnosticTool';

// Debug mode flag
const DEBUG = process.env.REACT_APP_DEBUG_MODE === 'true';

/**
 * App component - the main entry point of the application
 */
const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-neutral-50">
        <header className="bg-primary shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="text-xl font-bold text-white">LMS System</div>
            <nav className="flex space-x-6 overflow-x-auto pb-1">
              <Link to="/" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200">
                Home
              </Link>
              <Link to="/exercises/matching-demo" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200">
                Matching Exercise
              </Link>
              <Link to="/exercises/ai-matching-demo" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200">
                AI Matching
              </Link>
              <Link to="/test/ai-matching" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200">
                AI Test
              </Link>
              <Link to="/test/simple" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200">
                Simple Test
              </Link>
              <Link to="/demo/tailwind-components" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200">
                Tailwind UI
              </Link>
              <Link to="/demo/exercise-card" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200">
                Exercise Cards
              </Link>
              <Link to="/demo/form-components" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200">
                Form Components
              </Link>
              {DEBUG && (
                <>
                  <Link to="/debug/css-test" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200 bg-error">
                    CSS Test
                  </Link>
                  <Link to="/debug/css-diagnostic" className="text-white hover:text-blue-100 px-2 py-1 rounded transition-colors duration-200 bg-warning">
                    CSS Diagnostic
                  </Link>
                </>
              )}
            </nav>
            {DEBUG && <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded ml-2">DEBUG</div>}
          </div>
        </header>
        
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/exercises/matching-demo" element={<MatchingExerciseDemoPage />} />
            <Route path="/exercises/ai-matching-demo" element={<AIMatchingExerciseDemoPage />} />
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
        
        <footer className="bg-neutral-100 border-t border-neutral-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-600">
            <p>&copy; {new Date().getFullYear()} LMS System Demo</p>
            {DEBUG && <p className="text-xs text-neutral-500 mt-1">Running in debug mode</p>}
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">Learning Management System</h1>
      <p className="text-neutral-700 mb-8">
        Welcome to the LMS System demo. Use the navigation to explore the features.
      </p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Demo Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/exercises/matching-demo" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors">
              Matching Exercise
            </h3>
            <p className="text-neutral-600 text-sm">
              Interactive matching exercise component demonstration
            </p>
          </Link>
          
          <Link to="/exercises/ai-matching-demo" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors">
              AI Matching Exercise Demo
            </h3>
            <p className="text-neutral-600 text-sm">
              Automatically generate matching exercises from lesson content using AI
            </p>
          </Link>
          
          <Link to="/test/ai-matching" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors">
              AI Matching Words Test
            </h3>
            <p className="text-neutral-600 text-sm">
              Test AI-generated matching exercises using OpenAI
            </p>
          </Link>
          
          <Link to="/demo/tailwind-components" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors">
              Tailwind UI Components
            </h3>
            <p className="text-neutral-600 text-sm">
              Modern minimalist UI components built with Tailwind CSS
            </p>
          </Link>
          
          <Link to="/demo/exercise-card" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors">
              Exercise Cards
            </h3>
            <p className="text-neutral-600 text-sm">
              Showcase of our new exercise card components with minimalist design
            </p>
          </Link>
          
          <Link to="/demo/form-components" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-primary-dark transition-colors">
              Form Components
            </h3>
            <p className="text-neutral-600 text-sm">
              Interactive demo of our new form components with Tailwind styling
            </p>
          </Link>
          
          {DEBUG && (
            <>
              <Link to="/debug/css-test" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-medium text-error mb-2 group-hover:text-error transition-colors">
                  CSS Test Component
                </h3>
                <p className="text-neutral-600 text-sm">
                  Test component to verify Tailwind CSS styling is working correctly
                </p>
              </Link>
              
              <Link to="/debug/css-diagnostic" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-medium text-warning mb-2 group-hover:text-warning transition-colors">
                  CSS Diagnostic Tool
                </h3>
                <p className="text-neutral-600 text-sm">
                  Comprehensive tool for diagnosing CSS loading and application issues
                </p>
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
    <div className="max-w-lg mx-auto text-center py-12">
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-neutral-600 mb-8">
        The page you are looking for does not exist.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors duration-200"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default App;