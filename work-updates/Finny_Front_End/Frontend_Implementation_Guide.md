Finny Frontend  
April 03, 2025  
Subject: Frontend Implementation Guide for Spotvogel LMS

# Frontend Implementation Guide: Spotvogel LMS Platform

## Introduction for Newcomers

Welcome to the Spotvogel Learning Management System frontend team! This comprehensive guide will walk you through our frontend architecture, design principles, and coding practices. Whether you're new to frontend development or an experienced developer joining our team, this document will help you understand how we approach UI/UX design and implementation in our educational platform.

Our LMS seamlessly integrates with OpenAI to provide intelligent exercise generation while maintaining a clean, intuitive interface for both educators and learners. As a frontend developer on this team, your role is crucial in creating the visual and interactive elements that make complex educational content accessible and engaging.

## The Big Picture: What We're Building

The Spotvogel LMS is a modern learning platform that leverages AI to help educators create customized learning exercises. Our frontend is built with React and follows a component-based architecture that prioritizes:

- **Clean, intuitive user interfaces** that make learning accessible
- **Responsive design** that works across all devices
- **Accessibility** for all users
- **Performance optimization** for smooth user experiences
- **Seamless integration** with our backend services and OpenAI

Before diving into code, understand that our philosophy emphasizes creating interfaces that are both beautiful and functional. We follow a "modern minimalist" design approach that reduces visual clutter while maintaining clear visual hierarchies and intuitive interactions.

## Getting Started

### Setting Up Your Development Environment

1. **Prerequisites**:
   - Node.js (v16 or higher)
   - npm or yarn
   - Git
   - A code editor (we recommend VS Code with ESLint and Prettier extensions)

2. **Repository Access**:
   - Request access to our Git repository from Frank De Poorter
   - Clone the repository: `git clone [repository-url]`

3. **Installation**:
   ```bash
   cd spotvogel-frontend
   npm install
   ```

4. **Starting the Development Server**:
   ```bash
   npm start
   ```

5. **Available Scripts**:
   - `npm start`: Run development server
   - `npm test`: Run test suite
   - `npm run build`: Create production build
   - `npm run lint`: Run linting checks

## Frontend Architecture Overview

### Core Technologies

- **React (v18.2.0)**: Our primary UI library
- **React Router DOM (v6.16.0)**: For declarative routing
- **Axios**: For HTTP requests to our backend
- **React Context API**: For state management
- **Tailwind CSS**: For styling with our design system

### Project Structure

Our codebase follows a feature-based organization:

```
/src
  /assets          # Static files (images, icons)
  /components      # Reusable UI components
    /common        # General purpose components
    /layout        # Page layout components
    /features      # Feature-specific components
    /exercises     # Exercise-related components
  /context         # React Context providers
  /hooks           # Custom React hooks
  /pages           # Page components for routes
  /services        # API service integrations
  /utils           # Utility functions
  /styles          # Global styles and Tailwind config
```

## Design System

We use a "modern minimalist" design system implemented with Tailwind CSS. This ensures consistency across the application while maintaining a clean, professional appearance.

### Key Design Principles

1. **Clarity**: Interfaces should be immediately understandable
2. **Consistency**: Similar elements should look and behave similarly
3. **Feedback**: Users should always know what's happening
4. **Efficiency**: Minimize the steps needed to accomplish tasks
5. **Accessibility**: Interfaces should be usable by everyone

### Color Palette

Our color system consists of:
- Primary colors: Blues (#2563EB as primary, with lighter and darker shades)
- Light beige: Used for navigation elements including our top bar (#FEFCE8 / bg-amber-50)
- Neutral colors: Slate grays for text and backgrounds
- Accent colors: For specific states and actions
- Semantic colors: For success, warning, and error states

### Typography

We use a system font stack for optimal performance:
- Headings: Semi-bold weight, with sizes following a clear hierarchy
- Body text: Regular weight, with appropriate line height for readability
- Interactive elements: Medium weight to indicate actionability

### Component Guidelines

Components should:
- Be focused on a single responsibility
- Be reusable whenever possible
- Include proper documentation
- Have consistent prop patterns
- Include appropriate accessibility attributes

## Best Practices

### Code Style and Standards

1. **Follow ESLint Rules**: Our ESLint configuration enforces consistent code style
2. **Component Organization**:
   - One component per file
   - Component name matches file name
   - Use functional components with hooks
   - Export as default

3. **Naming Conventions**:
   - Components: PascalCase (e.g., `ButtonPrimary.jsx`)
   - Files and folders: kebab-case (e.g., `button-primary.css`)
   - Constants: UPPER_SNAKE_CASE
   - Variables and functions: camelCase

4. **CSS Practices**:
   - Use Tailwind utility classes as primary styling method
   - Custom CSS only when needed for complex interactions
   - Follow mobile-first responsive approach

### Performance Optimization

1. **Component Optimization**:
   - Use React.memo() for expensive renders
   - Implement virtualization for long lists
   - Optimize images (use WebP format, lazy loading)

2. **Code Splitting**:
   - Use dynamic imports for route-based code splitting
   - Lazy load components not needed on initial render

3. **State Management**:
   - Keep state as local as possible
   - Use Context API for global state
   - Avoid unnecessary re-renders

### Accessibility Standards

We aim for WCAG 2.1 AA compliance by ensuring:
- Proper semantic HTML elements
- Keyboard navigation support
- Sufficient color contrast
- Alternative text for images
- ARIA attributes where appropriate
- Focus management for interactive elements

## Component Library Deep Dive

Now let's examine our component structure in detail:

### Common Components

These are the building blocks of our UI:

#### Button Component

```jsx
// Example Button Component
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick, 
  type = 'button', 
  className = '' 
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${disabledClasses} 
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string
};

export default Button;
```

### Layout Components

These define the overall structure of pages:

#### AppLayout Component

```jsx
// Example AppLayout Component
import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header className="bg-amber-50" /> {/* Light beige header */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppLayout;
```

### Form Components

We have a comprehensive set of form components that handle validation and UI states:

#### FormInput Component

```jsx
// Example FormInput Component
import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm 
          focus:outline-none focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default FormInput;
```

## Exercise Components

Our core product feature - exercises - have specialized components:

### Exercise Type Components

We support multiple exercise types, each with its own component structure:

```jsx
// Example MultipleChoiceExercise Component
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Button from '../common/Button';

const MultipleChoiceExercise = ({ 
  question, 
  options, 
  correctIndex, 
  explanation,
  onSubmit 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleSubmit = () => {
    if (selectedIndex === null) return;
    
    const correct = selectedIndex === correctIndex;
    setIsCorrect(correct);
    setSubmitted(true);
    
    if (onSubmit) {
      onSubmit({ 
        selected: selectedIndex, 
        correct,
        question,
        options
      });
    }
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">{question}</h3>
      
      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <div 
            key={index}
            onClick={() => !submitted && setSelectedIndex(index)}
            className={`
              p-3 border rounded-md cursor-pointer transition-all
              ${selectedIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              ${submitted && index === correctIndex ? 'border-green-500 bg-green-50' : ''}
              ${submitted && index === selectedIndex && index !== correctIndex ? 'border-red-500 bg-red-50' : ''}
            `}
          >
            {option}
          </div>
        ))}
      </div>
      
      {submitted ? (
        <>
          <div className={`p-4 rounded-md mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect. Try again.'}
            {explanation && <p className="mt-2">{explanation}</p>}
          </div>
          <Button 
            onClick={() => {
              setSelectedIndex(null);
              setSubmitted(false);
            }}
          >
            Try Another Question
          </Button>
        </>
      ) : (
        <Button 
          onClick={handleSubmit} 
          disabled={selectedIndex === null}
        >
          Submit Answer
        </Button>
      )}
    </Card>
  );
};

MultipleChoiceExercise.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctIndex: PropTypes.number.isRequired,
  explanation: PropTypes.string,
  onSubmit: PropTypes.func
};

export default MultipleChoiceExercise;
```

## API Integration

We use a service-based approach to interact with our backend:

```javascript
// Example API service for exercises
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const exerciseService = {
  // Get all exercises
  getExercises: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },
  
  // Get exercise by ID
  getExerciseById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exercises/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create new exercise
  createExercise: async (exerciseData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/exercises`, exerciseData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  },
  
  // Generate exercise with AI
  generateExercise: async (templateId, parameters) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate/exercise`, {
        templateId,
        parameters
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating exercise:', error);
      throw error;
    }
  }
};

export default exerciseService;
```

## State Management

We use React Context for global state management:

```jsx
// Example AuthContext
import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { token, user: userData } = await authService.login(email, password);
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => useContext(AuthContext);
```

## Routing Structure

We use React Router with a configuration-based approach:

```jsx
// Example Routes configuration
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuth } from './context/AuthContext';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const ExerciseDetail = lazy(() => import('./pages/ExerciseDetail'));
const ExerciseCreator = lazy(() => import('./pages/ExerciseCreator'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/exercises" element={
          <ProtectedRoute>
            <AppLayout>
              <ExerciseLibrary />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/exercises/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <ExerciseDetail />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/create" element={
          <ProtectedRoute>
            <AppLayout>
              <ExerciseCreator />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
```

## Testing Practices

We use Jest and React Testing Library for testing:

```jsx
// Example Button component test
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/common/Button';

describe('Button Component', () => {
  test('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('applies different variants', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-blue-600');
    
    rerender(<Button variant="secondary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-gray-100');
    
    rerender(<Button variant="danger">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-red-600');
  });
  
  test('disables the button when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

## Deployment and Build Process

Our build process creates optimized production assets:

1. **Development**: `npm start` for local development
2. **Testing**: `npm test` to run unit tests
3. **Building**: `npm run build` creates optimized production files
4. **Deployment**: Production files are deployed to our hosting platform

## Collaboration Workflow

As a frontend developer on the Spotvogel team, you'll need to:

1. **Pull the latest changes** from the main branch before starting work
2. **Create a feature branch** for your task
3. **Implement your changes** following our code standards
4. **Write tests** for your components
5. **Document any new components** in our component library
6. **Submit a pull request** for review
7. **Address feedback** from the team
8. **Merge** once approved

## Common Pitfalls and How to Avoid Them

1. **Inconsistent styling**: Always use Tailwind classes following our design system
2. **Prop drilling**: Use Context for deeply nested state
3. **Poor performance**: Use memoization and lazy loading
4. **Accessibility issues**: Follow WCAG guidelines and test with screen readers
5. **API integration issues**: Use error handling and loading states

## Conclusion

This guide should provide you with a solid understanding of our frontend architecture, design principles, and coding practices. Remember that our goal is to create intuitive, accessible, and performant interfaces that make learning engaging and effective.

If you have questions or need clarification on any part of this guide, please reach out to me (Finny Frontend) or any other team member. We're here to help you succeed!

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

Welcome to the team! I'm excited to collaborate with you on creating amazing learning experiences for our users.