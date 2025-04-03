Finny Frontend  
April 03, 2025  
Subject: Fill-in-the-Blank Exercise Implementation Plan

# Fill-in-the-Blank Exercise Implementation Plan

## Overview

This document outlines the plan for implementing the Fill-in-the-Blank exercise component for our Exercise Tester. Like our successful Multiple Choice implementation, this will follow our visual-first approach, focusing on UI components with clear integration points for Alex Ex's AI-generated content.

## Component Architecture

I'll build the Fill-in-the-Blank exercise as a modular component system with the following structure:

1. **FillInBlankExercise**: The main container component that orchestrates the exercise flow
2. **PassageDisplay**: Component for rendering text passages with blank spaces
3. **BlankInput**: Component for individual fill-in-the-blank input fields
4. **FeedbackDisplay**: Component for showing results and explanations

## Data Structure

### TypeScript Interface

I'll create the following TypeScript interface (converted to JSDoc for JavaScript compatibility):

```typescript
/**
 * Represents a Fill-in-the-Blank exercise
 * @interface FillInBlankExercise
 */
interface FillInBlankExercise {
  /** Unique identifier for the exercise */
  id: string;
  
  /** Instructions for the exercise */
  instructions: string;
  
  /** 
   * Text passage with blanks marked using {{blank:id:answer}}
   * Example: "The capital of France is {{blank:1:Paris}}."
   */
  passage: string;
  
  /** Array of blank spaces to fill in */
  blanks: BlankItem[];
  
  /** Optional explanation shown after submission */
  explanation?: string;
  
  /** Whether to show case-sensitive validation */
  caseSensitive?: boolean;
}

/**
 * Represents a single blank in a fill-in-the-blank exercise
 * @interface BlankItem
 */
interface BlankItem {
  /** Unique identifier for the blank */
  id: string;
  
  /** The correct answer(s) for this blank */
  acceptedAnswers: string[];
  
  /** Optional hint for this blank */
  hint?: string;
  
  /** Optional specific feedback for this blank */
  feedback?: string;
}
```

### Expected API Response Format

I'll design the component to work with the following API response format from Alex's AI system:

```javascript
{
  exercise_type: "fill_in_blank",
  instructions: "Fill in the blanks with the correct words.",
  passage: "The Declaration of Independence was adopted by the Continental Congress on {{blank:1:July 4, 1776}}. It announced that the {{blank:2:thirteen American colonies}} were now independent states.",
  blanks: [
    {
      id: "1",
      acceptedAnswers: ["July 4, 1776", "July 4 1776", "4 July 1776", "4th of July 1776"],
      hint: "Think about Independence Day.",
      feedback: "July 4, 1776 is celebrated as Independence Day in the United States."
    },
    {
      id: "2",
      acceptedAnswers: ["thirteen American colonies", "13 American colonies", "American colonies"],
      hint: "How many colonies declared independence?",
      feedback: "The thirteen American colonies formed the original United States."
    }
  ],
  explanation: "The Declaration of Independence was adopted on July 4, 1776, and announced that the thirteen American colonies were now independent from Great Britain.",
  case_sensitive: false
}
```

## Implementation Approach

### 1. Passage Parsing

A key challenge will be parsing the passage text to identify and replace blank markers with input fields. I'll create a utility function that:

1. Parses the passage string to identify placeholders in the format `{{blank:id:answer}}`
2. Replaces these placeholders with BlankInput components
3. Maintains the original text formatting and structure

### 2. Input Validation

The component will need to validate user inputs against multiple possible accepted answers:

1. Support for exact matches and partial matches
2. Optional case-sensitive validation
3. Visual feedback for correct/incorrect answers
4. Support for showing hints when requested

### 3. Styling and UX

The component will:

1. Style blank inputs to clearly stand out from the passage text
2. Show appropriate focus states and accessibility features
3. Provide immediate feedback on submission
4. Allow for hints to be revealed without giving away the answer

## Tailwind Implementation

I'll follow these patterns for the Tailwind implementation:

**Passage Container**:
```jsx
<div className="p-6 bg-white rounded-lg shadow-sm">
  {/* Passage content */}
</div>
```

**Blank Input**:
```jsx
<input 
  type="text" 
  className="px-2 py-1 mx-1 border-b-2 border-blue-500 focus:border-blue-700 focus:outline-none text-center min-w-[80px] bg-blue-50"
/>
```

**Correct Answer Highlight**:
```jsx
<span className="px-2 py-1 mx-1 border-b-2 border-green-500 bg-green-50 text-center min-w-[80px]">
  {userAnswer}
</span>
```

**Incorrect Answer Highlight**:
```jsx
<span className="px-2 py-1 mx-1 border-b-2 border-red-300 bg-red-50 text-center min-w-[80px]">
  {userAnswer}
</span>
```

## Implementation Steps

1. Create TypeScript interfaces and type definitions
2. Implement the passage parser utility
3. Create the basic component structure
4. Implement the blank input component with validation
5. Add feedback and hint functionality
6. Apply Tailwind styling according to our design system
7. Add responsive behavior
8. Document all AI integration points for Alex Ex

## AI Integration Points

I'll clearly mark the following integration points for Alex's AI system:

1. **Instructions**: General guidance for the exercise
2. **Passage Text**: The main passage with embedded blank markers
3. **Acceptable Answers**: Multiple variations of the correct answer for each blank
4. **Hints**: Optional hints for each blank
5. **Feedback**: Specific feedback for each blank
6. **Explanation**: Overall explanation shown after completion

## Next Steps

After implementation, I'll:

1. Integrate the component into the Exercise Tester
2. Share the data structure with Alex Ex for AI content generation
3. Work with Sarah Server on backend API integration
4. Begin implementing the next exercise type

This implementation will build on the foundation established with the Multiple Choice component while addressing the unique challenges of Fill-in-the-Blank exercises.
