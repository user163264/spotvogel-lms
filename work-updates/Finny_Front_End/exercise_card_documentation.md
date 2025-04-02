# Exercise Card Component Documentation

Finny Frontend  
March 30, 2025

## Overview

The `ExerciseCard` component is a reusable UI element designed for displaying exercise information in our Learning Management System. This component has been built using Tailwind CSS following our migration plan and design system guidelines.

## Features

- **Clean, consistent design** that aligns with our LMS visual style
- **Visual indicators** for exercise type, difficulty level, and completion status
- **Responsive layout** that works across all device sizes
- **Accessibility support** with keyboard navigation
- **Truncated descriptions** to maintain consistent card heights
- **Interactive hover states** for better user feedback

## Component Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| title | string | Yes | - | The title of the exercise |
| description | string | Yes | - | A brief description of the exercise |
| type | string | Yes | - | Type of exercise (e.g., 'matching', 'multiple-choice') |
| difficulty | enum | Yes | - | Difficulty level ('beginner', 'intermediate', 'advanced', 'expert') |
| completionTime | number | Yes | - | Estimated completion time in minutes |
| author | string | Yes | - | Name of the exercise creator |
| createdAt | string | Yes | - | ISO date string of when the exercise was created |
| tags | string[] | No | [] | Array of tags related to the exercise |
| completionStatus | enum | No | null | Completion status ('completed', 'in-progress', 'not-started', null) |
| onClick | function | Yes | - | Function to handle click events on the card |
| className | string | No | '' | Additional CSS classes to apply to the component |

## Usage Example

```jsx
import ExerciseCard from '../components/ExerciseCard';

function ExercisesPage() {
  const handleExerciseClick = (exerciseId) => {
    // Navigate to the exercise or perform other actions
    console.log(`Exercise ${exerciseId} clicked`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ExerciseCard
        title="Matching Parts of Speech"
        description="Match the words with their correct parts of speech in this interactive exercise."
        type="matching"
        difficulty="intermediate"
        completionTime={10}
        author="Alex Ex"
        createdAt="2025-03-20T12:00:00Z"
        tags={["grammar", "parts of speech", "english"]}
        completionStatus="in-progress"
        onClick={() => handleExerciseClick("exercise-123")}
      />
      
      {/* More exercise cards */}
    </div>
  );
}
```

## Tailwind CSS Implementation

This component demonstrates several key Tailwind CSS practices:

1. **Responsive design** using the `grid` and `md:grid-cols-2` pattern
2. **Color coding with semantic meaning** using Tailwind's color palette for different types and difficulty levels
3. **Interactive states** with `hover:shadow-md` and `transition-shadow`
4. **Typography hierarchy** using text sizing and font weights
5. **Content truncation** with `line-clamp-2` for consistent card heights
6. **Spacing consistency** with Tailwind's spacing scale

## Design Decisions

1. **Corner triangle indicator** for completion status - This provides a subtle visual cue without overwhelming the card design.
2. **Color-coded badges** - Using appropriate colors for different types and difficulty levels improves visual scanning and recognition.
3. **Metadata in footer** - Placing author, date, and completion time in a separated footer creates a clear visual hierarchy.
4. **Hover state transitions** - The subtle shadow increase on hover provides feedback that the card is interactive.

## Accessibility Considerations

- The component includes proper keyboard support with tab focus and Enter/Space key handling
- Color contrast ratios meet WCAG AA standards
- Semantic HTML structure with appropriate heading levels

## Future Enhancements

1. Add support for an image/icon to represent different exercise types
2. Implement skeleton loading state for the card
3. Add progress indication for partially completed exercises
4. Consider adding custom animations for hover and active states

## Related Components

- `ExerciseGrid` - A container component for displaying multiple ExerciseCards in a responsive grid
- `ExerciseDashboard` - A page component that uses ExerciseCards to display all available exercises
