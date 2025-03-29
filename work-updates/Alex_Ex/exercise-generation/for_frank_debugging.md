# Matching Words Component: Debugging Guide
## For Frank De Poorter

Hi Frank,

I've implemented the new matching words exercise component on our feature branch `feature/matching-words-exercise`. Given your expertise in debugging and overview of the system, I wanted to provide you with specific information about potential issues to watch for and debugging approaches.

## Implementation Overview

The matching words component allows students to match items between two columns. Key files:

- **Main Component**: `client/src/components/exercises/MatchingWords.js`
- **Styles**: Added to `client/src/components/exercises/styles.css`
- **Integration**: Updated `ExerciseGenerator.js` and `ExerciseView.js`
- **Test Harness**: `client/src/components/exercises/__tests__/MatchingWordsTest.js`

## Potential Debugging Areas

### 1. State Management

The component uses React state to track:
- Current matches between items
- Currently selected item
- Validation status

**Debugging Tips**:
- Check the React DevTools component inspector for state values
- Look for incorrect state updates in the click handlers
- Watch for race conditions in the selection logic

### 2. Data Format Conversion

We support two data formats (old and new), which might cause issues:

```javascript
// Legacy format
{
  leftItems: ["Item1", "Item2"],
  rightItems: ["OptionA", "OptionB"],
  matches: [[0,1], [1,0]]  // index-based matches
}

// New format
{
  word_bank: ["Item1", "Item2"],
  match_options: ["OptionA", "OptionB"],
  correct_answer: {
    "Item1": "OptionB",
    "Item2": "OptionA"
  }
}
```

**Debugging Tips**:
- Check the console for format conversion warnings
- Verify the conversion logic in `ExerciseGenerator.js`
- Test with both legacy and new format data

### 3. DOM Manipulation & Refs

The component uses refs for:
- Accessing DOM elements for interactive features
- Managing focus for accessibility

**Debugging Tips**:
- Look for null refs if elements aren't rendering
- Check for timing issues with ref access
- Verify event propagation is working correctly

### 4. CSS/Styling Issues

We've added new styles that might conflict with existing ones:

**Debugging Tips**:
- Use browser dev tools to check for CSS specificity issues
- Look for z-index conflicts in the matching interface
- Test responsive behavior at various breakpoints

### 5. Integration Points

Key integration areas to monitor:

- **Exercise Creation**: Verifying new exercise type option works
- **Exercise Rendering**: Correct instantiation in ExerciseView
- **Data Flow**: Proper data passing from API to component

## Testing Approach

1. **Isolated Testing**:
   Add this temporary route for direct testing:
   ```jsx
   <Route path="/test/matching-words" element={<MatchingWordsTest />} />
   ```

2. **Edge Cases to Test**:
   - Empty data sets
   - Partial or malformed data
   - Very long text in items
   - Many items (performance test)
   - Rapid clicking/selecting

3. **Cross-browser Testing**:
   - Focus particularly on mobile Safari
   - Check touch interactions on mobile devices

## Known Limitations & TODOs

1. We're using click-to-select rather than drag-and-drop (for now)
2. Keyboard navigation has been implemented but needs thorough testing
3. Performance with large datasets (>20 items) might need optimization

## Error States to Monitor

Watch the console for these specific warnings/errors:
- `Cannot read property 'current' of undefined` (ref errors)
- `Cannot read property of null` (DOM access issues)
- React key warnings (if mapping arrays incorrectly)

## Specific Debugging Functions

I've included some debugging helpers in the component:
- All state updates have clear naming for traceability
- The `calculateScore` function can be used to verify scoring logic
- The component logs answer changes to the console when `onAnswerChange` is called

If you encounter any issues that aren't covered here, please let me know and I'll help investigate. I've tried to make the component robust, but your debugging expertise will be invaluable for catching any edge cases I might have missed.

Best regards,
Alex Ex
Exercise Generation Specialist
