# Tailwind CSS Migration Guide for Team Members

Finny Frontend  
March 31, 2025

## Introduction

This guide provides an overview of our Tailwind CSS migration and instructions for working with the new components. The migration has been implemented with a focus on preserving all functionality while modernizing our styling approach.

## What Has Changed

We've migrated several key components from traditional CSS to Tailwind CSS:

1. **MatchingWordsOptimized** - Now has a Tailwind version that maintains all of Alex's functionality
2. **Form Components** - We've created a comprehensive form component library using Tailwind
3. **AIMatchingExerciseDemoPage** - Now has a Tailwind version that preserves all of Alex's API integration

## How to Use the New Components

### Importing Components

```jsx
// Import Tailwind versions of components
import MatchingWordsOptimized from '../components/exercises/MatchingWordsOptimizedTailwind';
import { AIMatchingExerciseDemoPageTailwind } from '../pages/tailwind';

// Import form components
import { 
  Input,
  TextArea, 
  Select, 
  Checkbox, 
  Radio, 
  FormGroup 
} from '../components/ui';
```

### Using Form Components

Our form components follow a consistent API pattern:

```jsx
// TextArea component example
<TextArea
  id="description"
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  placeholder="Enter a description..."
  error={errors.description}
  helper="Provide a detailed description for the exercise"
  required
/>

// Select component example
<Select
  id="difficulty"
  label="Difficulty Level"
  value={difficulty}
  onChange={(e) => setDifficulty(e.target.value)}
  options={[
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ]}
/>

// Form grouping example
<FormGroup title="User Information" description="Enter personal details">
  <Input
    id="name"
    label="Full Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  
  <Checkbox
    id="consent"
    label="I agree to the terms and conditions"
    checked={consent}
    onChange={(e) => setConsent(e.target.checked)}
  />
</FormGroup>
```

### Working with MatchingWordsOptimized

The Tailwind version of the MatchingWordsOptimized component has the exact same API as Alex's original version:

```jsx
<MatchingWordsOptimized
  wordBank={['Apple', 'Car', 'House']}
  matchOptions={['Manzana', 'Coche', 'Casa']}
  correctAnswer={{ 'Apple': 'Manzana', 'Car': 'Coche', 'House': 'Casa' }}
  studentAnswers={studentAnswers}
  onAnswerChange={handleAnswerChange}
  readOnly={false}
  showAnswers={showAnswers}
/>
```

## Tailwind CSS Basics

If you're new to Tailwind, here are some key concepts:

### 1. Utility-First Approach

Tailwind uses utility classes that each do one thing:

```jsx
// Traditional CSS
<div className="button">Click Me</div>

// Tailwind CSS
<div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  Click Me
</div>
```

### 2. Responsive Design

Use responsive prefixes to adapt to different screen sizes:

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half width on tablet, 1/3 width on desktop */}
</div>
```

### 3. State Variants

Use state prefixes for different states:

```jsx
<button className="bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300">
  Button
</button>
```

## Testing the New Components

You can test our migration by using the App.tailwind.jsx file, which includes a toggle to switch between original and Tailwind versions. This lets you compare the two implementations side by side.

## Migration Status

The current migration status is:

✅ **Completed**:
- Core UI components
- Form component library
- MatchingWordsOptimized component
- AIMatchingExerciseDemoPage

⏳ **In Progress**:
- Other exercise components
- Remaining page layouts

## Getting Help

If you have questions about the Tailwind migration or need help implementing something with the new components, please reach out to me (Finny Frontend). I'm happy to pair program or provide guidance on using the new system.

## Best Practices

When working with our Tailwind components:

1. **Use the UI Component Library**: Import components from our UI library rather than building from scratch
2. **Follow the Minimalist Design System**: Maintain consistent spacing, colors, and typography
3. **Think Mobile-First**: Start with mobile layout and use responsive prefixes for larger screens
4. **Maintain Accessibility**: Ensure proper contrast, focus states, and ARIA attributes

## Feedback

Your feedback is essential to improving our component library. If you have suggestions, encounter issues, or want to request new components, please document them in your work updates folder.

Thank you for your collaboration in this migration!
