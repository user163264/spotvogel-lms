import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TemplateList from './pages/templates/TemplateList';
import TemplateCreate from './pages/templates/TemplateCreate';
import TemplateView from './pages/templates/TemplateView';
import ExerciseList from './pages/exercises/ExerciseList';
import CreateExercise from './pages/exercises/CreateExercise';
import EditExercise from './pages/exercises/EditExercise';
import ExerciseView from './pages/exercises/ExerciseView';
import ExerciseGenerator from './components/exercises/ExerciseGenerator';
import AutoGrader from './components/exercises/AutoGrader';
import SubmissionsList from './pages/submissions/SubmissionsList';
import SubmissionView from './pages/submissions/SubmissionView';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ApiTester from './components/debug/ApiTester';

// Import our new test page
import MatchingWordsTestPage from './pages/test/MatchingWordsTestPage';

// CSS
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const userHasRequiredRole = user && (allowedRoles.length === 0 || allowedRoles.includes(user.role));

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !userHasRequiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Template Routes */}
            <Route path="/templates" element={
              <ProtectedRoute>
                <TemplateList />
              </ProtectedRoute>
            } />
            
            <Route path="/templates/create" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TemplateCreate />
              </ProtectedRoute>
            } />
            
            <Route path="/templates/:id" element={
              <ProtectedRoute>
                <TemplateView />
              </ProtectedRoute>
            } />
            
            {/* Exercise Routes */}
            <Route path="/exercises" element={
              <ProtectedRoute>
                <ExerciseList />
              </ProtectedRoute>
            } />
            
            <Route path="/exercises/create" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <CreateExercise />
              </ProtectedRoute>
            } />
            
            <Route path="/exercises/edit/:id" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <EditExercise />
              </ProtectedRoute>
            } />
            
            <Route path="/exercises/:id" element={
              <ProtectedRoute>
                <ExerciseView />
              </ProtectedRoute>
            } />
            
            {/* Submission Routes */}
            <Route path="/submissions" element={
              <ProtectedRoute>
                <SubmissionsList />
              </ProtectedRoute>
            } />
            
            <Route path="/submissions/:id" element={
              <ProtectedRoute>
                <SubmissionView />
              </ProtectedRoute>
            } />
            
            <Route path="/submissions/:submissionId/grade" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <AutoGrader />
              </ProtectedRoute>
            } />
            
            {/* AI Exercise Generation */}
            <Route path="/exercises/generate" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <ExerciseGenerator />
              </ProtectedRoute>
            } />
            
            {/* Debug Route */}
            <Route path="/debug" element={
              <ApiTester />
            } />
            
            {/* New Test Route for MatchingWords Component */}
            <Route path="/test/matching-words" element={<MatchingWordsTestPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
