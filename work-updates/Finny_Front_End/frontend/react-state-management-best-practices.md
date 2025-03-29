# React State Management Best Practices

## Avoiding Common Pitfalls in Interactive Components

This guide covers best practices for React state management, focusing on preventing the issues we encountered with the MatchingWords component. These patterns will help you build stable, performant components that avoid common pitfalls like infinite re-render loops and state synchronization issues.

## Common Issues and How to Avoid Them

### 1. The Circular Dependency Loop

**The Problem:**
A circular dependency occurs when:
- Component internal state updates
- Parent component receives notification of this update
- Parent updates a prop based on this notification
- Component updates its internal state based on this prop
- The cycle repeats endlessly

**Solution Patterns:**

#### Pattern 1: One-Way Data Flow
```jsx
// ❌ AVOID THIS
const MyComponent = ({ value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value);
  
  // Bad: Creates a circular dependency
  useEffect(() => {
    setInternalValue(value);
  }, [value]);
  
  useEffect(() => {
    onChange(internalValue);
  }, [internalValue, onChange]);
  
  // ...
};

// ✅ DO THIS INSTEAD
const MyComponent = ({ value, onChange }) => {
  // Decide whether this is a controlled or uncontrolled component
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value || initialValue);
  
  // Only update internal state from props on first render or controlled mode
  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [isControlled, value]);
  
  const handleChange = (newValue) => {
    // For uncontrolled components, just update internal state
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    // Always notify parent, but don't depend on it updating our props
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // ...
};
```

#### Pattern 2: Derived State
```jsx
// ❌ AVOID THIS
const MyComponent = ({ data, onChange }) => {
  const [processedData, setProcessedData] = useState(processData(data));
  
  useEffect(() => {
    setProcessedData(processData(data));
  }, [data]);
  
  // ...
};

// ✅ DO THIS INSTEAD
const MyComponent = ({ data, onChange }) => {
  // Derive state directly during render without useState
  const processedData = useMemo(() => processData(data), [data]);
  
  // ...
};
```

### 2. The Exercise Switching Bug

**The Problem:**
When a component is used for different data sets (like different exercises), it can fail to properly reset or initialize its state.

**Solution Patterns:**

#### Pattern 1: Use Keys for Complete Resets
```jsx
// ❌ AVOID THIS
<MyComponent exercise={currentExercise} />

// ✅ DO THIS INSTEAD - Force full remount when exercise changes
<MyComponent 
  key={currentExercise.id} 
  exercise={currentExercise} 
/>
```

#### Pattern 2: Track Identity with Refs
```jsx
const MyComponent = ({ exercise, ...props }) => {
  // Store exercise ID in a ref to detect changes
  const exerciseIdRef = useRef(exercise?.id);
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    const currentId = exercise?.id;
    // Check if exercise has changed
    if (exerciseIdRef.current !== currentId) {
      // Reset state when exercise changes
      setState(initialState);
      // Update ref
      exerciseIdRef.current = currentId;
    }
  }, [exercise]);
  
  // ...
};
```

#### Pattern 3: Instance IDs
```jsx
const MyComponent = ({ exercise, ...props }) => {
  // Generate a stable instance ID to isolate component instances
  const instanceId = useId();
  
  // ...
  
  return (
    <div data-instance-id={instanceId}>
      {/* Component content */}
    </div>
  );
};
```

### 3. Unnecessary Re-renders

**The Problem:**
Components re-render too frequently, causing performance issues or unexpected behavior.

**Solution Patterns:**

#### Pattern 1: Proper Dependency Arrays
```jsx
// ❌ AVOID THIS
useEffect(() => {
  // Effect code
}); // Missing dependency array - runs after every render

// ❌ AVOID THIS TOO
useEffect(() => {
  // Effect uses someValue but doesn't list it
}, [otherValue]); // Incomplete dependency array

// ✅ DO THIS INSTEAD
useEffect(() => {
  // Effect code
}, [dep1, dep2]); // Complete dependency array
```

#### Pattern 2: Object and Function Memoization
```jsx
// ❌ AVOID THIS
const MyComponent = ({ data }) => {
  // New object created on every render
  const config = { 
    threshold: data.length > 10 ? 5 : 3,
    labels: data.map(d => d.label)
  };
  
  // ...
};

// ✅ DO THIS INSTEAD
const MyComponent = ({ data }) => {
  // Memoized object only recreated when data changes
  const config = useMemo(() => ({ 
    threshold: data.length > 10 ? 5 : 3,
    labels: data.map(d => d.label)
  }), [data]);
  
  // Memoized callback only recreated when dependencies change
  const handleClick = useCallback(() => {
    // Handle click logic
  }, [relevantDependency]);
  
  // ...
};
```

#### Pattern 3: Equality Checks
```jsx
// Prevent unnecessary updates by comparing old and new values
useEffect(() => {
  // Skip if deep equality between oldState and newState
  if (JSON.stringify(oldState) === JSON.stringify(newState)) {
    return;
  }
  
  // Perform effect
}, [oldState, newState]);
```

## Best Practices for Interactive Educational Components

### 1. Use a Controlled vs. Uncontrolled Pattern

```jsx
const EducationalComponent = ({ 
  initialAnswers = {}, // For uncontrolled mode
  answers, // For controlled mode
  onAnswerChange,
  ...otherProps
}) => {
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = answers !== undefined;
  
  // Internal state only used in uncontrolled mode
  const [internalAnswers, setInternalAnswers] = useState(initialAnswers);
  
  // The actual answers to use in the component
  const effectiveAnswers = isControlled ? answers : internalAnswers;
  
  const handleAnswerChange = (newAnswers) => {
    // Update internal state only in uncontrolled mode
    if (!isControlled) {
      setInternalAnswers(newAnswers);
    }
    
    // Always notify parent
    if (onAnswerChange) {
      onAnswerChange(newAnswers);
    }
  };
  
  // ...
};
```

### 2. Create Pure Render Functions

Split your components into smaller, pure functions that handle specific rendering tasks:

```jsx
// Main component manages state and composition
const QuizComponent = ({ quiz, ...props }) => {
  const [userAnswers, setUserAnswers] = useState({});
  
  // Logic for handling changes
  
  return (
    <div className="quiz-container">
      <QuizHeader quiz={quiz} />
      <QuizQuestions 
        questions={quiz.questions} 
        userAnswers={userAnswers}
        onAnswerChange={handleAnswerChange}
      />
      <QuizFooter 
        userAnswers={userAnswers}
        questions={quiz.questions}
      />
    </div>
  );
};

// Pure components focus only on rendering
const QuizHeader = memo(({ quiz }) => (
  <header>
    <h1>{quiz.title}</h1>
    <p>{quiz.description}</p>
  </header>
));

const QuizQuestions = memo(({ questions, userAnswers, onAnswerChange }) => (
  <div className="questions">
    {questions.map(question => (
      <QuestionItem
        key={question.id}
        question={question}
        userAnswer={userAnswers[question.id]}
        onAnswerChange={(answer) => onAnswerChange(question.id, answer)}
      />
    ))}
  </div>
));
```

### 3. Use Stable Identity for Props

```jsx
const ParentComponent = () => {
  const [data, setData] = useState(initialData);
  
  // Memoize handlers to maintain stable identity
  const handleAnswerChange = useCallback((newAnswers) => {
    setData(prevData => ({
      ...prevData,
      answers: newAnswers
    }));
  }, []); // Empty dependency array if handler doesn't use external values
  
  // Memoize complex objects
  const config = useMemo(() => ({
    showHints: data.userPreferences.hints,
    timeLimit: data.settings.timeLimit,
    mode: data.settings.difficulty
  }), [data.userPreferences.hints, data.settings.timeLimit, data.settings.difficulty]);
  
  return (
    <ChildComponent
      data={data}
      config={config}
      onAnswerChange={handleAnswerChange}
    />
  );
};
```

### 4. Track Exercise Identity

For components used across multiple exercises:

```jsx
const ExerciseComponent = ({ exercise, ...props }) => {
  // Generate a stable ID based on exercise identity
  const exerciseId = useMemo(() => 
    exercise.id || `${exercise.type}-${JSON.stringify(exercise.question)}`,
    [exercise.id, exercise.type, exercise.question]
  );
  
  // Track if exercise changes
  const previousExerciseIdRef = useRef(exerciseId);
  
  // State
  const [state, setState] = useState(initialState);
  
  // Reset state when exercise changes
  useEffect(() => {
    if (previousExerciseIdRef.current !== exerciseId) {
      // Exercise changed, reset state
      setState(initialState);
      previousExerciseIdRef.current = exerciseId;
    }
  }, [exerciseId]);
  
  // ...
};
```

### 5. Implement State Logging for Debugging

During development, add temporary logging to debug state changes:

```jsx
// Temporary debug logger
useEffect(() => {
  console.log('[Component] State updated:', {
    instanceId,
    exercise: exercise?.id,
    matches,
    selectedItem
  });
}, [instanceId, exercise?.id, matches, selectedItem]);
```

## Conclusion

When building interactive educational components:

1. **Choose the right state pattern**: Controlled vs uncontrolled, derived state, etc.
2. **Isolate state between exercises**: Use keys, instance IDs, or track exercise identity
3. **Prevent circular dependencies**: Implement one-way data flow
4. **Optimize rendering**: Use memoization, proper dependency arrays, and equality checks
5. **Break into pure components**: Split logic and UI into focused, reusable pieces

Following these patterns will help you create stable, performant React components that avoid common state management pitfalls.
