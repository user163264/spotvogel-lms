# AI Integration for Matching Words Exercise Component

**Date:** March 28, 2025  
**Author:** Alex Ex (Exercise Generation Specialist)

## Overview

This directory contains the implementation of AI integration for the Matching Words exercise component. The integration enables AI-powered generation of matching exercises that are compatible with Finny's optimized component, ensuring reliable state management and optimal performance.

## Files

1. `ai-integration-strategy-for-matching-words.md` - Comprehensive strategy document outlining the integration approach
2. `matching-words-prompt-template.js` - Template generator for AI prompts with multi-language support
3. `matching-words-validation.js` - Validation and normalization utilities for exercise data
4. `component-integration.js` - React component demonstrating the integration with the UI
5. `example-ai-prompts.md` - Example prompts for different subjects and difficulty levels
6. `implementation-notes.md` - Summary of the implementation work and considerations
7. `README.md` - This overview document

## Key Features

- **Multi-language support**: Generate exercises in English, Dutch, and French
- **Difficulty control**: Customize exercise complexity (easy, medium, hard)
- **Format validation**: Comprehensive validation of AI-generated exercises
- **Auto-correction**: Automatic fixing of common AI response issues
- **Legacy format support**: Conversion from old to new data structure
- **Robust error handling**: Detailed error messages and fallback mechanisms

## Integration with Finny's Component

The implementation was designed to work seamlessly with Finny's optimized Matching Words component by:

1. **Matching data structure**: Generates exercises in the format expected by the component
2. **Supporting unidirectional data flow**: Prevents circular dependency issues
3. **Enabling key-based remounting**: Facilitates clean state resets when switching exercises
4. **Providing validation**: Ensures data integrity before rendering

## Usage

### Generating AI Prompts

```javascript
const { generateMatchingWordsPrompt } = require('./matching-words-prompt-template');

// Generate a prompt for an art history exercise (medium difficulty, 5 items)
const prompt = generateMatchingWordsPrompt('art history', 'medium', 5, 'en');

// Send the prompt to your AI service
const aiResponse = await aiService.generateExercise(prompt);
```

### Validating Exercise Data

```javascript
const { validateMatchingExercise } = require('./matching-words-validation');

// Validate the exercise data
const validation = validateMatchingExercise(exerciseData);

if (validation.isValid) {
  console.log('Exercise is valid!');
} else {
  console.error('Validation errors:', validation.errors);
  console.warn('Warnings:', validation.warnings);
}
```

### Normalizing Data Format

```javascript
const { normalizeExerciseData } = require('./matching-words-validation');

// Convert from legacy format or fix issues
const normalizedData = normalizeExerciseData(exerciseData);

// Now safe to pass to the component
return <MatchingWordsOptimized {...normalizedData} />;
```

### Complete Integration Example

```jsx
import { normalizeExerciseData } from './matching-words-validation';
import MatchingWordsOptimized from '../components/MatchingWordsOptimized';

function renderMatchingWordsExercise(exercise, props) {
  // Generate a unique key including the exercise ID
  const exerciseKey = `matching-words-${exercise.id}-${props.mode || 'default'}`;
  
  // Normalize data format
  const normalizedData = normalizeExerciseData(exercise);
  
  // Pass only the required props to prevent unnecessary re-renders
  return (
    <MatchingWordsOptimized
      key={exerciseKey}
      wordBank={normalizedData.word_bank}
      matchOptions={normalizedData.match_options}
      correctAnswer={normalizedData.correct_answer}
      studentAnswers={props.studentAnswers || {}}
      onAnswerChange={props.onAnswerChange}
      readOnly={props.readOnly || false}
      showAnswers={props.showAnswers || false}
    />
  );
}
```

## Data Structure

The matching words exercises use the following data structure:

```javascript
{
  "exercise_type": "matching_words",
  "question": "Match each item with its correct counterpart.",
  "word_bank": ["Item1", "Item2", "Item3"],      // Left column items
  "match_options": ["Option1", "Option2", "Option3"],  // Right column items
  "correct_answer": {
    "Item1": "Option3",  // Maps left items to right items
    "Item2": "Option1",
    "Item3": "Option2"
  },
  "max_score": 3,
  "grading_type": "auto"
}
```

## Implementation Notes

### Prompt Templates

The prompt template system provides dynamic generation based on:
- Subject/topic of the exercise
- Difficulty level
- Language preference
- Number of matching pairs needed

Templates are designed to guide the AI in generating clear, educational content with precise formatting.

### Validation System

The validation system checks:
- Required fields presence
- Correct data types
- Valid relationships between arrays and mappings
- Absence of duplicates
- Completeness of mappings
- Consistency between max_score and item count

### Auto-correction

The auto-correction system handles:
- Type conversions
- Array normalization
- Duplicate removal
- Missing mappings
- Format standardization

## Phased Implementation

The integration follows a phased approach:

1. **Phase 1** (Current): Basic integration with validation
2. **Phase 2** (Upcoming): Enhanced integration with better error handling
3. **Phase 3** (Future): Advanced features and optimizations

## Testing

The implementation includes thorough validation but should be tested:
- With different AI models
- Across supported languages
- With exercises of varying complexity
- In both teacher and student views

## Collaboration Notes

This implementation was designed based on Finny's work on the MatchingWords component. The integration respects the design decisions and state management patterns established in the optimized component.

When making changes to either the component or the AI integration, please ensure they remain compatible by referring to the validation requirements and data structure expectations.
