Finny Frontend  
April 03, 2025  
Subject: Fill-in-the-Blank Component Architecture

# Fill-in-the-Blank Component Architecture

## Component Structure Overview

I've designed the Fill-in-the-Blank exercise implementation with a modular component architecture that promotes separation of concerns, reusability, and maintainability.

```
FillInBlankExercise
├── PassageDisplay
│   └── BlankInput (multiple instances)
└── FeedbackDisplay (conditional)
```

## Component Responsibilities

### FillInBlankExercise

**Primary container component** responsible for:
- Managing overall exercise state
- Handling form submission
- Coordinating child components
- Processing exercise data
- Providing feedback after submission

```jsx
<FillInBlankExercise 
  exercise={fillInBlankData}
  onSubmit={handleExerciseSubmit}
/>
```

### PassageDisplay

**Text rendering component** responsible for:
- Parsing passages with blanks
- Converting blanks into interactive input fields
- Maintaining text formatting and structure
- Passing user input to parent component

```jsx
<PassageDisplay
  passage={passage}
  blanks={blanks}
  answers={answers}
  onAnswerChange={handleAnswerChange}
  showFeedback={showFeedback}
  caseSensitive={caseSensitive}
/>
```

### BlankInput

**Interactive input component** responsible for:
- Handling user input for a single blank
- Displaying visual feedback on correctness
- Showing correct answers when needed
- Maintaining consistent styling

```jsx
<BlankInput
  id={blankId}
  value={userAnswer}
  onChange={onAnswerChange}
  showFeedback={showFeedback}
  isCorrect={isCorrect}
  correctAnswer={correctAnswer}
/>
```

### WordSelector

**Teacher interface component** responsible for:
- Displaying source text for teachers
- Capturing text selection events
- Managing selected words list
- Providing a UI for word removal

```jsx
<WordSelector
  sourceText={inputText}
  selectedWords={selectedWords}
  onWordSelect={handleWordSelect}
  onWordRemove={handleWordRemove}
/>
```

## Utility Functions

### passageParser.js

Contains specialized functions for text processing:
- `parsePassage`: Parses text with blanks into usable segments
- `generatePassageWithBlanks`: Creates a passage with blanks from selected words

### validation.js

Contains functions for answer validation:
- `isAnswerCorrect`: Checks user answers against accepted answers
- `calculateScore`: Determines overall exercise score

## Data Flow

1. **Input Flow**:
   - Exercise data flows from ExerciseTester → FillInBlankExercise
   - FillInBlankExercise passes relevant data to PassageDisplay
   - PassageDisplay creates BlankInput components for each blank

2. **User Interaction Flow**:
   - User enters answers in BlankInput components
   - BlankInput onChange → PassageDisplay → FillInBlankExercise
   - FillInBlankExercise maintains user answer state

3. **Submission Flow**:
   - User submits form in FillInBlankExercise
   - FillInBlankExercise validates answers using validation.js
   - FillInBlankExercise updates feedback state
   - BlankInput components display correctness

## State Management

Each component manages appropriate slice of state:

1. **FillInBlankExercise**:
   - `answers`: Map of blankId to user answer
   - `showFeedback`: Boolean for feedback visibility
   
2. **ExerciseTester**:
   - `exerciseType`: Current exercise type
   - `inputText`: Teacher input text
   - `selectedWords`: Words selected for blanks
   - `responseData`: Generated exercise data

## Design Patterns

1. **Composition**: Components are composed from smaller, focused components
2. **Props Drilling**: Data flows down through props
3. **Container/Presentational**: FillInBlankExercise is container, child components are presentational
4. **Utility Functions**: Complex logic extracted to utility functions

This architecture provides a solid foundation for our Fill-in-the-Blank exercise implementation while maintaining consistency with our overall design system and component approach.
