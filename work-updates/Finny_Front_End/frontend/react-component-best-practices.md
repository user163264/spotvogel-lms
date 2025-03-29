# React Component Best Practices: State Management

## Summary

After fixing the infinite loop issues in our matching words component, I've documented some key React best practices that we should follow across our codebase to prevent similar issues and improve performance.

## State Management Best Practices

### 1. Single Source of Truth

- Decide which component truly "owns" a piece of state
- Don't duplicate state between parent and child components
- Either make a component fully controlled or fully uncontrolled

```javascript
// Good: Child component with internal state + parent callbacks
function ChildComponent({ onUpdate }) {
  const [state, setState] = useState(initialState);
  
  const handleChange = (newValue) => {
    setState(newValue);
    onUpdate(newValue);
  };
}

// Bad: Duplicated state in parent and child
function ParentComponent() {
  const [value, setValue] = useState('');
  return <ChildComponent value={value} onChange={setValue} />;
}

function ChildComponent({ value, onChange }) {
  const [internalValue, setInternalValue] = useState(value); // Duplication!
  
  // This creates an infinite loop!
  useEffect(() => {
    onChange(internalValue);
  }, [internalValue, onChange]);
}
```

### 2. Deep Comparison for State Updates

- Always use deep comparison when syncing from props to state
- Use JSON.stringify for simple cases or a library like isEqual for complex ones

```javascript
// Good: Deep comparison before updating
useEffect(() => {
  if (JSON.stringify(prevValue) !== JSON.stringify(newValue)) {
    // Update only when actual changes occur
    setInternalState(newValue);
  }
}, [newValue]);
```

### 3. Memoize Event Handlers

- Use useCallback for event handlers passed to child components
- This prevents unnecessary rerenders due to function identity changes

```javascript
// Good: Memoized callbacks
const handleChange = useCallback((value) => {
  // Handle the change
  setData(value);
}, [/* dependencies */]);
```

### 4. Key-Based Remounting Strategy

- When you need a complete reset, use a key prop
- Change the key when you want the component to start fresh

```javascript
// Good: Key-based remounting
<Component 
  key={`${id}-${version}`} 
  {...props} 
/>
```

### 5. Use Refs for Previous Value Comparison

- Keep track of previous values to compare against new ones
- This helps avoid unnecessary state updates and renders

```javascript
// Good: Tracking previous values with refs
const prevValueRef = useRef(null);

useEffect(() => {
  const prevValue = prevValueRef.current;
  if (JSON.stringify(prevValue) !== JSON.stringify(currentValue)) {
    // Do something only when the value changes meaningfully
    doSomething();
    
    // Update the ref with current value
    prevValueRef.current = { ...currentValue };
  }
}, [currentValue]);
```

### 6. Unidirectional Data Flow

- Data flows down as props
- Events flow up as callbacks
- Never create circular dependencies between them

```javascript
// Good: Clear unidirectional flow
function ParentComponent() {
  const [data, setData] = useState(initialData);
  
  const handleUpdate = useCallback((newData) => {
    setData(newData);
  }, []);
  
  return <ChildComponent data={data} onUpdate={handleUpdate} />;
}

function ChildComponent({ data, onUpdate }) {
  // Local UI state only, not duplicating parent state
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e) => {
    // Notify parent of changes via callback
    onUpdate({ ...data, [e.target.name]: e.target.value });
  };
  
  return (/* render with data and handleChange */);
}
```

## Implementation Examples

These best practices have been applied in our new `MatchingWordsOptimized.js` component and can be used as a reference for future development.

## Benefits

Following these patterns will:
- Prevent infinite render loops
- Improve application performance
- Make component behavior more predictable
- Reduce hard-to-debug state synchronization issues
- Create a more maintainable codebase

I recommend we review our existing components against these guidelines and gradually update them to follow these best practices.
