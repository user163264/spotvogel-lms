# Testing the MatchingWords Component

## Overview
We've created a new MatchingWords component for our interactive exercise system. This document provides instructions on how to test the implementation.

## Files Created/Modified

1. **New Files:**
   - `client/src/components/exercises/MatchingWords.js` - The main component
   - `client/src/components/exercises/__tests__/MatchingWordsTest.js` - Test harness

2. **Modified Files:**
   - `client/src/components/exercises/styles.css` - Added styles for the component
   - `client/src/components/exercises/ExerciseGenerator.js` - Updated to use our new component
   - `client/src/pages/exercises/ExerciseView.js` - Updated to display matching exercises
   - `client/src/components/exercises/QuestionTypeSelector.js` - Added matching-words as an option

## Testing Steps

### 1. Manual Component Testing

To test the MatchingWords component in isolation:

1. Create a temporary route to the test component in your router.
   
   In `client/src/App.js` or your router configuration:
   ```jsx
   import MatchingWordsTest from './components/exercises/__tests__/MatchingWordsTest';
   
   // Add to your routes
   <Route path="/test/matching-words" element={<MatchingWordsTest />} />
   ```

2. Navigate to `/test/matching-words` in your browser
3. Test the following functionality:
   - Selecting items from the left column
   - Matching them with items from the right column
   - Removing matches
   - Verify that the correct/incorrect indicators appear in review mode

### 2. Integration Testing

To test the integration with the exercise system:

1. Create a new exercise using the UI:
   - Go to the exercise creation page
   - Select "Matching Words" as the exercise type
   - Create a matching exercise with at least 3 pairs

2. Test the exercise preview functionality:
   - Verify that pairs are displayed correctly
   - Check that the interface shows matches and correct answers properly

3. Test with student view:
   - Try completing the exercise as a student
   - Ensure answers are saved correctly
   - Verify feedback is displayed correctly

### 3. Keyboard Accessibility Testing

Verify that the component can be used with keyboard navigation:
- Tab navigation between items
- Ability to select and match using keyboard
- Focus indicators are visible and clear

### 4. Mobile Testing

Test on mobile devices or using responsive design tools:
- Ensure the layout adapts properly to smaller screens
- Verify touch interactions work correctly
- Check that the matching process is usable on mobile

## Known Issues and Limitations

1. The current implementation uses a simple click-to-select model rather than drag-and-drop, which will be added in a future iteration.

2. Multi-language support is present but needs more testing with non-Latin character sets.

3. Performance with very large lists (>20 items) has not been fully tested.

## Next Steps

Once testing is complete:
1. Address any issues found during testing
2. Create unit tests for the component
3. Prepare pull request for code review
4. Update documentation for teachers

## Feedback Reporting

Please report any issues found during testing by creating an issue in our tracker with the format:

**Title:** [MatchingWords] Brief description of the issue

**Body:**
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (browser, device, etc.)

---

Document created by: Alex Ex (Exercise Generation Specialist)  
Date: March 28, 2025