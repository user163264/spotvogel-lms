# AI Matching Words Test Implementation

This directory contains the implementation for a test route that integrates OpenAI-generated exercises with Finny's optimized matching words component.

## Setup Instructions

Follow these steps to add the AI-powered matching words test route to the application:

### 1. Import the Test Page in App.js

Open your `App.js` file (or wherever your routes are defined) and add these imports:

```jsx
import AiMatchingWordsTestPage from './work-updates/Alex_Ex/test-implementation/AiMatchingWordsTestPage';
import './work-updates/Alex_Ex/test-implementation/AiMatchingWordsTestPage.css';
```

### 2. Add the Test Route

Add the new route to your router configuration:

```jsx
<Route path="/test/ai-matching-words" element={<AiMatchingWordsTestPage />} />
```

### 3. Set Up the Environment Variable

Ensure the OpenAI API key is available as an environment variable:

- Create or update a `.env` file in your project root:
  ```
  OPENAI_API_KEY=your_api_key_here
  ```

- If you're using Create React App, make sure the variable is prefixed with `REACT_APP_`:
  ```
  REACT_APP_OPENAI_API_KEY=your_api_key_here
  ```

### 4. Update the API Key Reference in aiService.js

If you're using Create React App, update the API key reference in `aiService.js`:

```javascript
// Change this line:
'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'OPENAI_API_KEY'}`

// To this:
'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || 'OPENAI_API_KEY'}`
```

### 5. Run the Application

Start your development server and navigate to:
```
http://localhost:3000/test/ai-matching-words
```

## Files Included

1. `AiMatchingWordsTestPage.jsx` - Test page component
2. `AiMatchingWordsTestPage.css` - Styles for the test page
3. `aiService.js` - OpenAI integration service
4. `README.md` - This file with setup instructions

## Features

- **OpenAI Integration**: Generates custom matching exercises based on topic, difficulty, and language
- **Responsive UI**: Well-designed interface that works on both desktop and mobile
- **Debug Tools**: JSON view for examining the data structure
- **Error Handling**: Validation of AI responses to catch issues before they reach the component
- **Interactive Controls**: Customize exercise parameters and reset answers

## Testing Suggestions

Once set up, try these tests to verify the integration:

1. Generate exercises with different topics (art, geography, science, etc.)
2. Try all three difficulty levels
3. Test multilingual support (English, Dutch, French)
4. Verify the "Reset Answers" functionality
5. Check JSON output for correct structure
6. Test error handling by temporarily introducing invalid API keys

## Next Steps

After testing this implementation, we can:

1. Refine the prompt templates based on observed responses
2. Expand language support
3. Add more advanced exercise customization
4. Integrate with the teacher dashboard
5. Implement saving/sharing of generated exercises

## Notes

This test implementation uses real API calls to OpenAI, so be mindful of usage limits and costs. Each exercise generation makes one API call.
