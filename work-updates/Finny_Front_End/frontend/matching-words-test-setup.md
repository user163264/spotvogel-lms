# MatchingWords Component Test Setup

This document describes how to set up a separate test environment for the new MatchingWords component without modifying the production code. 

## Files Created

1. **Test Page**
   - Path: `/client/src/pages/test/MatchingWordsTestPage.js`
   - Purpose: A standalone page to test the MatchingWords component with various exercises and display modes

2. **Test App File**
   - Path: `/client/src/App.test.js`
   - Purpose: A modified copy of App.js that includes the route to the test page

## How to Test the Component

### Method 1: Temporary Swap (Quick Test)

1. Backup the current App.js:
   ```bash
   cp /Users/admin/Documents/lms-system/client/src/App.js /Users/admin/Documents/lms-system/client/src/App.backup.js
   ```

2. Use the test App.js:
   ```bash
   cp /Users/admin/Documents/lms-system/client/src/App.test.js /Users/admin/Documents/lms-system/client/src/App.js
   ```

3. Start the application and navigate to:
   ```
   http://localhost:3000/test/matching-words
   ```

4. When finished testing, restore the original App.js:
   ```bash
   cp /Users/admin/Documents/lms-system/client/src/App.backup.js /Users/admin/Documents/lms-system/client/src/App.js
   ```

### Method 2: Direct Route Addition (Minimal Change)

If you prefer to make a small direct change to the existing App.js:

1. Open `/client/src/App.js`

2. Add the import at the top with other imports:
   ```jsx
   import MatchingWordsTestPage from './pages/test/MatchingWordsTestPage';
   ```

3. Add the route before the 404 route:
   ```jsx
   {/* New Test Route for MatchingWords Component */}
   <Route path="/test/matching-words" element={<MatchingWordsTestPage />} />
   ```

4. Start the application and navigate to:
   ```
   http://localhost:3000/test/matching-words
   ```

## Features of the Test Page

The test page includes:

- Three different sample exercises to test with (Programming Languages, Capitals, Art)
- Controls to toggle between student and teacher views
- Option to show/hide correct answers
- Reset button to clear all matches
- JSON display of current answers for debugging
- Responsive design that works on mobile and desktop

## Next Steps After Testing

After reviewing the component, you can provide feedback on:

1. UI alignment with the design system
2. Intuitiveness of the click-to-select interaction
3. Ideas for improving the matching animation
4. Suggestions for better mobile optimization

Your feedback can be added to `/work-updates/frontend/matching-words-feedback.md`
