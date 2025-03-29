# Matching Words Exercise Analysis

## Overview
The matching_words exercise is one of the most complex interactive exercise types in our system. This document provides a detailed analysis of implementation challenges and proposed solutions.

## JSON Structure Analysis
```json
{
  "exercise_type": "matching_words",
  "question": "Koppel de schilder aan zijn beroemde werk.",
  "word_bank": ["Gustav Klimt", "James McNeill Whistler", "Claude Monet"],
  "match_options": ["Waterlelies", "De Kus", "Whistler's Mother"],
  "correct_answer": {
    "Gustav Klimt": "De Kus",
    "James McNeill Whistler": "Whistler's Mother",
    "Claude Monet": "Waterlelies"
  },
  "max_score": 3,
  "grading_type": "auto"
}
```

## Implementation Challenges

### 1. Complex UI Requirements
- Need intuitive interface for connecting items across two columns
- Must visually represent connections clearly
- Should allow for breaking connections and remaking them

### 2. Data Structure Complexity
- Uses object mapping rather than simple array for correct answers
- Need to track current state of all possible connections
- Must handle validation across multiple paired items

### 3. Interaction Models (Options)
- **Drag and Drop:** Most intuitive but challenging for accessibility
- **Click-to-Select:** More accessible but may be less intuitive
- **Line Drawing:** Visual but technically complex
- **Dropdown Selection:** Simple but less engaging

### 4. Validation Considerations
- Partial credit possibilities (some correct matches, some incorrect)
- Handling submission when not all items are matched
- Providing meaningful feedback on incorrect matches

### 5. Accessibility Requirements
- Keyboard navigation between all matching elements
- Screen reader announcements for matches/mismatches
- Focus management during the matching process
- Color-independent feedback indicators

### 6. Mobile Considerations
- Touch interactions differ from mouse interactions
- Screen space limitations affect layout
- Need to ensure targets are large enough for touch

## Proposed Solutions

### UI Design Approach
- Two-column layout with clear visual distinction
- Connection indicators that highlight on hover/focus
- Clear visual feedback for matched and unmatched items
- Consistent color coding and iconography

### Technical Implementation
- Use React state to maintain current matches
- Implement both mouse/touch and keyboard interaction methods
- Store matches in a format that mirrors the correct_answer structure
- Calculate partial scores based on correct matches

### Validation Logic
- Compare student answer object with correct_answer object
- Award points for each correct pairing (max_score / number of pairs)
- Provide specific feedback on which pairs are correct/incorrect

## Next Steps
1. Create wireframes for desktop and mobile views
2. Develop prototype of interaction model
3. Validate with accessibility testing
4. Implement core component
5. Add validation logic
6. Integrate with exercise container

## Questions for Team Discussion
- Should we allow reuse of match options (one-to-many)?
- How should we visually represent connections?
- Should we allow submission with incomplete matches?

Document created by: Alex Ex (Exercise Generation Specialist)
Date: March 28, 2025