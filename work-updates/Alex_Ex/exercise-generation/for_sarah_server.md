# Matching Words Component: Backend Integration Notes
## For Sarah Server

Hi Sarah,

I've implemented the new matching words exercise component on our feature branch `feature/matching-words-exercise`. Since this affects the data structure and API expectations, I wanted to share the relevant details for the backend integration.

## Data Structure

Our new matching words component expects data in this format:

```json
{
  "exercise_type": "matching_words",
  "question": "Match the items in the left column with the items in the right column.",
  "word_bank": ["Item 1", "Item 2", "Item 3"],
  "match_options": ["Option A", "Option B", "Option C"],
  "correct_answer": {
    "Item 1": "Option B",
    "Item 2": "Option C",
    "Item 3": "Option A"
  },
  "max_score": 3,
  "grading_type": "auto"
}
```

Key differences from the previous matching format:
- Uses `word_bank` instead of `leftItems`
- Uses `match_options` instead of `rightItems`
- Uses an object mapping for `correct_answer` instead of index-based `matches` array

## Backwards Compatibility

I've implemented conversion logic to support the legacy format. The component will:
1. Check for the new format properties first
2. Fall back to the old format if needed
3. Convert the data structure on the fly

This ensures existing exercises continue to work while we transition to the new format.

## API Considerations

### For Exercise Creation
When saving a new matching words exercise, the API should expect:
- `exercise_type`: "matching_words"
- All the fields listed in the data structure above

### For Exercise Retrieval
- No changes needed if you maintain the structure above
- If needed, I can add more conversion logic on the frontend

### For Auto-Grading
The auto-grading algorithm should:
- Compare the student's answer object with the correct_answer object
- Award points for each correct mapping
- Calculate a total score based on matching pairs

## Database Updates

We might need to update the Exercise model schema to formalize the new structure. I'd suggest:

```javascript
// In Exercise.js model
const matchingWordsSchema = new Schema({
  question: { type: String, required: true },
  word_bank: { type: [String], required: true },
  match_options: { type: [String], required: true },
  correct_answer: { type: Map, of: String, required: true },
  // other common fields...
});
```

## Testing API Integration

I've created a test harness that could help verify the API integration:
- Component file: `client/src/components/exercises/__tests__/MatchingWordsTest.js`
- This can be used to validate data flowing between frontend and backend

## Questions for You

1. Do we need to update the database schema to support this new format?
2. Are there any performance considerations we should address for auto-grading?
3. Should we implement a data migration for existing matching exercises?
4. Any concerns about the backward compatibility approach?

## Next Steps

1. Review the data structure and confirm it meets backend requirements
2. Discuss any needed model/schema updates
3. Plan for API endpoint adjustments if necessary
4. Consider a migration strategy for existing data

Let me know your thoughts, and I'm happy to collaborate on any backend changes needed to support this new component.

Best regards,
Alex Ex
Exercise Generation Specialist
