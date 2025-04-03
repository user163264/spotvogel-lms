Finny Frontend  
April 03, 2025  
Subject: Multiple Choice Exercise Data Structure for AI Generation

# Multiple Choice Exercise Data Structure for AI Generation

Hi Alex,

I've implemented the UI component for Multiple Choice exercises, and I wanted to share the data structure requirements to ensure our integration works smoothly. This document outlines the expected format for the AI-generated exercise data that our frontend components will consume.

## API Response Format

The Multiple Choice exercise UI component expects data in the following format:

```javascript
{
  // Required fields
  exercise_type: "multiple_choice",
  question: "The main question text here",
  options: [
    "Option 1 text",
    "Option 2 text",
    "Option 3 text",
    "Option 4 text"
  ],
  correct_answer: ["Option 2 text"], // Array for multiple answers or string for single

  // Optional but recommended fields
  instructions: "Optional instructions for the user",
  explanation: "Explanation text shown after submission",
  
  // Additional metadata fields
  max_score: 1,
  grading_type: "auto",
  difficulty: "medium", // optional: "easy", "medium", "hard"
  tags: ["tag1", "tag2"] // optional: for categorization
}
```

## Field Descriptions

### Required Fields:

1. **exercise_type** (string):
   - Must be "multiple_choice" to properly route to our component

2. **question** (string):
   - The main question text displayed to the user
   - Can include HTML formatting for rich text (e.g., `<p>`, `<b>`, `<i>`, `<blockquote>`)
   - Examples:
     - Simple: "What is the capital of France?"
     - Rich text: "<p>Read the following passage:</p><blockquote>The Renaissance was a period...</blockquote><p>Which of the following best describes the Renaissance?</p>"

3. **options** (array of strings):
   - List of possible answers
   - Typically 3-5 options (minimum 2, maximum 8)
   - Each option should be a string
   - Options should be distinct and clearly worded
   - Example: `["Paris", "London", "Berlin", "Madrid"]`

4. **correct_answer** (string or array of strings):
   - For single-answer questions: a string matching exactly one of the options
   - For multiple-answer questions: an array of strings, each matching exactly one of the options
   - Must exactly match the text in the options array
   - Examples:
     - Single: `"Paris"`
     - Multiple: `["Solar power", "Wind power"]`

### Optional but Recommended Fields:

5. **instructions** (string):
   - Additional guidance for the user
   - Examples:
     - "Select the best answer."
     - "Select all that apply."
     - "Choose the option that best completes the sentence."

6. **explanation** (string):
   - Explanation shown after the user submits their answer
   - Should explain why the correct answer is correct and why incorrect answers are incorrect
   - Can include HTML formatting for rich text
   - Example: "Paris is the capital of France, with a population of over 2 million people."

### Additional Metadata Fields:

7. **max_score** (number):
   - Maximum points awarded for a correct answer (typically 1)

8. **grading_type** (string):
   - How the exercise should be graded (typically "auto" for multiple choice)

9. **difficulty** (string, optional):
   - "easy", "medium", or "hard"
   - Used for filtering and categorization

10. **tags** (array of strings, optional):
    - Keywords for categorization and searching
    - Example: `["geography", "europe", "capitals"]`

## Special Considerations

### Multiple Selection vs Single Selection

The UI will automatically determine whether to display radio buttons (single selection) or checkboxes (multiple selection) based on the format of the `correct_answer` field:

- If `correct_answer` is a string, single selection (radio buttons) will be used
- If `correct_answer` is an array with multiple items, multiple selection (checkboxes) will be used

### Rich Text Support

- The `question` and `explanation` fields support HTML formatting
- Common HTML tags like `<p>`, `<h3>`, `<b>`, `<i>`, `<blockquote>`, `<ul>`, `<li>` are supported
- Avoid complex HTML structures or styles that might break the layout

### Option Feedback

While our component supports option-specific feedback, the current API format doesn't include this. If you want to add option-specific feedback in the future, we can update the transformer to support a format like:

```javascript
{
  // ... other fields
  options: [
    { text: "Option 1", feedback: "Feedback for option 1" },
    { text: "Option 2", feedback: "Feedback for option 2" }
  ]
}
```

Let me know if this is something you'd like to implement in the future.

## Example API Responses

### Single Answer Example

```javascript
{
  "exercise_type": "multiple_choice",
  "question": "What is the capital of France?",
  "instructions": "Select the correct answer.",
  "options": [
    "London",
    "Berlin",
    "Paris",
    "Madrid"
  ],
  "correct_answer": "Paris",
  "explanation": "Paris is the capital and most populous city of France.",
  "max_score": 1,
  "grading_type": "auto"
}
```

### Multiple Answer Example

```javascript
{
  "exercise_type": "multiple_choice",
  "question": "Which of the following are examples of renewable energy sources?",
  "instructions": "Select all that apply.",
  "options": [
    "Solar power",
    "Coal",
    "Wind power",
    "Natural gas"
  ],
  "correct_answer": ["Solar power", "Wind power"],
  "explanation": "Renewable energy sources are those that can be naturally replenished on a human timescale. Solar and wind power are renewable because they rely on virtually inexhaustible sources, while fossil fuels like coal and natural gas take millions of years to form.",
  "max_score": 1,
  "grading_type": "auto"
}
```

### Rich Text Example

```javascript
{
  "exercise_type": "multiple_choice",
  "question": "<p>Read the following passage:</p><blockquote>The Renaissance was a period in European history marking the transition from the Middle Ages to modernity and covering the 15th and 16th centuries. It began in Italy and spread to the rest of Europe. The Renaissance was characterized by an emphasis on the individual, a revival of classical learning, and a spirit of innovation and exploration.</blockquote><p>Which of the following best describes the Renaissance?</p>",
  "options": [
    "A period of religious uniformity and conservatism",
    "A transitional period emphasizing individuality and classical revival",
    "A time of significant technological regression",
    "A period limited exclusively to Italian art history"
  ],
  "correct_answer": "A transitional period emphasizing individuality and classical revival",
  "explanation": "The Renaissance was a critical transitional period in European history that emphasized individuality, revived classical learning, and fostered innovation and exploration. It began in Italy but spread throughout Europe, influencing art, literature, philosophy, science, religion, and politics.",
  "max_score": 1,
  "grading_type": "auto",
  "difficulty": "medium",
  "tags": ["history", "renaissance", "europe"]
}
```

## Testing Your AI-Generated Content

You can test your AI-generated content by:

1. Using the Exercise Tester at http://localhost:3000/test/exercise-tester
2. Selecting "Multiple Choice" from the exercise type dropdown
3. Entering your test input text
4. Clicking "Generate Exercise"

This will simulate the API response and render the Multiple Choice component with your data.

Let me know if you need any clarification or have any questions about this data structure!

Best,
Finny
