# ExerciseCard Component Integration Guide

Finny Frontend  
March 30, 2025

## Introduction

This guide explains how to integrate the new ExerciseCard component into our existing LMS application. The component has been designed with our Tailwind CSS migration in mind and will serve as an example of our new approach to UI development.

## Installation Steps

### 1. Copy the Component Files

First, copy the ExerciseCard component files to your project:

```bash
# From work-updates directory
cp work-updates/Finny_Front_End/frontend/components/ExerciseCard.jsx frontend/src/components/
```

### 2. Usage in Existing Pages

The ExerciseCard can be used in various parts of our application. Here are some examples:

#### Exercise Listings Page

```jsx
// frontend/src/pages/Exercises.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseCard from '../components/ExerciseCard';

// Import your API service
import { getExercises } from '../services/exerciseService';

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleExerciseClick = (id) => {
    navigate(`/exercises/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading exercises...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Exercises</h1>
      
      {exercises.length === 0 ? (
        <p className="text-gray-500">No exercises found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              title={exercise.title}
              description={exercise.description}
              type={exercise.type}
              difficulty={exercise.difficulty}
              completionTime={exercise.estimatedTime}
              author={exercise.author.name}
              createdAt={exercise.createdAt}
              tags={exercise.tags}
              completionStatus={exercise.userStatus}
              onClick={() => handleExerciseClick(exercise.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;
```

#### Dashboard Components

```jsx
// frontend/src/components/dashboard/RecentExercises.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseCard from '../ExerciseCard';

const RecentExercises = ({ exercises = [] }) => {
  const navigate = useNavigate();

  const handleExerciseClick = (id) => {
    navigate(`/exercises/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Exercises</h2>
      
      {exercises.length === 0 ? (
        <p className="text-gray-500">No recent exercises.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {exercises.slice(0, 3).map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              title={exercise.title}
              description={exercise.description}
              type={exercise.type}
              difficulty={exercise.difficulty}
              completionTime={exercise.estimatedTime}
              author={exercise.author.name}
              createdAt={exercise.createdAt}
              tags={exercise.tags}
              completionStatus={exercise.userStatus}
              onClick={() => handleExerciseClick(exercise.id)}
              className="h-full"
            />
          ))}
        </div>
      )}
      
      <button 
        onClick={() => navigate('/exercises')}
        className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        View All Exercises
      </button>
    </div>
  );
};

export default RecentExercises;
```

## Data Mapping

The ExerciseCard component expects specific props that need to be mapped from our API responses. Here's a guide to mapping the data:

| API Response Field | ExerciseCard Prop | Notes |
|--------------------|-------------------|-------|
| `exercise.title` | `title` | Direct mapping |
| `exercise.description` | `description` | Direct mapping |
| `exercise.exerciseType` | `type` | Convert to lowercase (e.g., `MULTIPLE_CHOICE` → `multiple-choice`) |
| `exercise.difficultyLevel` | `difficulty` | Convert to lowercase (e.g., `BEGINNER`) |
| `exercise.estimatedCompletionMinutes` | `completionTime` | Direct mapping |
| `exercise.creator.fullName` | `author` | Direct mapping |
| `exercise.createdAt` | `createdAt` | ISO date string |
| `exercise.tags` | `tags` | Array of tag strings |
| `exercise.userProgress.status` | `completionStatus` | Map from API status to component status |

Example data transformation:

```jsx
// Example transformation function
const transformExerciseData = (apiExercise) => {
  // Map status from API to component status
  const statusMap = {
    'COMPLETED': 'completed',
    'IN_PROGRESS': 'in-progress',
    'NOT_STARTED': 'not-started',
    null: null
  };
  
  // Map exercise type from API to component type
  const typeMap = {
    'MULTIPLE_CHOICE': 'multiple-choice',
    'MATCHING': 'matching',
    'FILL_IN_BLANK': 'fill-in-blank',
    'ESSAY': 'essay',
    'CODING': 'coding',
  };
  
  return {
    id: apiExercise.id,
    title: apiExercise.title,
    description: apiExercise.description,
    type: typeMap[apiExercise.exerciseType] || 'default',
    difficulty: apiExercise.difficultyLevel.toLowerCase(),
    completionTime: apiExercise.estimatedCompletionMinutes,
    author: apiExercise.creator.fullName,
    createdAt: apiExercise.createdAt,
    tags: apiExercise.tags || [],
    completionStatus: statusMap[apiExercise.userProgress?.status],
  };
};
```

## Styling Customizations

The ExerciseCard component is built with Tailwind CSS and can be customized in several ways:

1. **Additional Classes**: Use the `className` prop to add custom classes
2. **Tailwind Theme**: Modify colors in your `tailwind.config.js`
3. **Variants**: Create component variants by wrapping ExerciseCard

Example of creating a compact variant:

```jsx
const CompactExerciseCard = (props) => (
  <ExerciseCard
    {...props}
    className="h-32 overflow-hidden"
  />
);
```

## Accessibility Considerations

The ExerciseCard component includes keyboard accessibility features:

- The card is focusable with tabbing
- Enter or Space key triggers the onClick handler
- Proper ARIA attributes when needed

## Browser Compatibility

The component has been tested and works correctly in:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Planned enhancements for the ExerciseCard component:

1. Add skeleton loading state
2. Add progress indicator for partially completed exercises
3. Support for images/icons for different exercise types
4. Animation for hover and active states

## Troubleshooting

**Q: The card isn't responding to clicks**  
A: Ensure you've provided an `onClick` function prop to the component.

**Q: The status indicator isn't showing**  
A: Check that `completionStatus` is one of: 'completed', 'in-progress', 'not-started'.

**Q: The colors don't match our brand**  
A: Update the Tailwind theme in `tailwind.config.js` to match your brand colors.

## Questions and Support

If you have any questions or need assistance integrating the ExerciseCard component, please contact Finny Frontend.
