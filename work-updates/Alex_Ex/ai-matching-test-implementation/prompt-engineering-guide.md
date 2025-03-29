# Prompt Engineering Guide for AI-Generated Matching Exercises

**Date:** March 28, 2025  
**Engineer:** Alex Ex  
**Project:** LMS System - AI-Powered Exercise Generation  
**Focus:** Matching Words Exercise Prompts  

## Introduction

This guide outlines the prompt engineering techniques used to generate high-quality matching exercises using OpenAI's language models. Effective prompt design is crucial for producing exercises that are educationally valuable, correctly formatted, and suitable for different difficulty levels and languages.

## Prompt Structure

Our prompts follow a consistent structure with the following components:

### 1. Context Setting

```
Create a matching exercise about [TOPIC] for an educational platform.
The exercise should match related concepts, definitions, or examples.
```

This establishes the purpose and type of content we're requesting, providing context for the AI model.

### 2. Specific Instructions

```
Create a [DIFFICULTY] difficulty exercise that [DIFFICULTY-SPECIFIC GUIDANCE].
```

Where difficulty-specific guidance varies:
- **Easy**: "uses simple, direct matches that are obvious to someone with basic knowledge of the topic"
- **Medium**: "requires good understanding of the topic but uses clear, established relationships"
- **Hard**: "requires detailed knowledge of the topic, using specific terminology and nuanced relationships"

### 3. Output Format Specification

```
Return ONLY a JSON object with the following structure:

{
  "exercise_type": "matching_words",
  "question": "Match each [TOPIC] item with its correct counterpart.",
  "word_bank": [...],
  "match_options": [...],
  "correct_answer": {...},
  "max_score": [NUMBER],
  "grading_type": "auto"
}
```

This explicitly defines the expected output format, preventing free-form text responses.

### 4. Requirements and Constraints

```
Requirements:
- Each item in word_bank MUST have exactly one matching item in match_options
- All matches must be factually correct
- Avoid ambiguous matches where multiple answers could be correct
- Ensure all content is educational and appropriate for students
```

These additional requirements help ensure the quality and validity of the generated exercise.

### 5. Topic-Specific Guidance

```
For this [TOPIC] topic, consider the following approach: [SPECIFIC SUGGESTIONS]
```

Example for art:
```
For this art topic, consider the following approach: Match artists with their famous works, art movements with their characteristics, or art techniques with their descriptions.
```

This helps guide the model toward appropriate content for the specific topic.

## Multi-Language Support

Our prompt system supports multiple languages through language-specific templates:

### English Example

```
Create a matching exercise about the provided topic for an educational platform.
The exercise should be about {topic} and should match related concepts, definitions, or examples.
```

### Dutch Example

```
Maak een koppeloefeningsopdracht over het opgegeven onderwerp voor een educatief platform.
De oefening moet gaan over {topic} en moet gerelateerde concepten, definities of voorbeelden koppelen.
```

### French Example

```
Créez un exercice d'association sur le sujet fourni pour une plateforme éducative.
L'exercice doit porter sur {topic} et doit associer des concepts, définitions ou exemples liés.
```

## Example Complete Prompt (Art, Medium, English)

```
Create a matching exercise about art for an educational platform.

The exercise should be about art and should match related concepts, definitions, or examples.

Create a moderate difficulty exercise that requires good understanding of the topic but uses clear, established relationships.

Return ONLY a JSON object with the following structure:

{
  "exercise_type": "matching_words",
  "question": "Match each art item with its correct counterpart.",
  "word_bank": [
    "Example left item",
    "Example left item",
    "Example left item",
    "Example left item",
    "Example left item"
  ],
  "match_options": [
    "Example right item",
    "Example right item",
    "Example right item",
    "Example right item",
    "Example right item"
  ],
  "correct_answer": {
    "Left Item": "Right Item",
    "Left Item": "Right Item",
    "Left Item": "Right Item",
    "Left Item": "Right Item",
    "Left Item": "Right Item"
  },
  "max_score": 5,
  "grading_type": "auto"
}

Requirements:
- Each item in word_bank MUST have exactly one matching item in match_options
- All matches must be factually correct
- Avoid ambiguous matches where multiple answers could be correct
- Ensure all content is educational and appropriate for students

For this art topic, consider the following approach: Match artists with their famous works, art movements with their characteristics, or art techniques with their descriptions.
```

## Common Response Issues and Solutions

### Issue 1: Extra Text Outside JSON

**Problem**: AI includes explanatory text outside the JSON structure.

**Solution**: 
- Use extractive regex: `content.match(/\{[\s\S]*\}/)`
- Reinforce "Return ONLY a JSON object" in the prompt

### Issue 2: Incorrect Key Names

**Problem**: AI sometimes uses different key names than requested.

**Solution**:
- Include a complete example JSON structure
- Implement key normalization in the validation system

### Issue 3: Inconsistent Matching

**Problem**: Generated matches occasionally don't follow a consistent pattern.

**Solution**:
- Specify the relationship type in the prompt (e.g., "Match countries with their capitals")
- Validate that each word_bank item has exactly one match

## Prompt Template System

We've implemented a programmatic prompt generation system to ensure consistency:

```javascript
function generateMatchingWordsPrompt(topic, difficulty = 'medium', itemCount = 5, language = 'en') {
  // Adjust item count based on difficulty
  const actualItemCount = adjustItemCountByDifficulty(difficulty, itemCount);
  
  // Select appropriate language templates
  const templates = languageTemplates[language] || languageTemplates.en;
  
  // Construct the main prompt
  return `
    ${templates.instructions}
    ${templates.context.replace('{topic}', topic)}
    ${getDifficultyGuidance(difficulty, templates)}
    ${templates.format}
    {...JSON template with placeholders...}
    ${templates.requirements}
    ${getTopicSpecificGuidance(topic)}
  `;
}
```

## Conclusion

Effective prompt engineering is critical for generating high-quality matching exercises. Our structured approach ensures consistent, correctly formatted responses while allowing for customization based on topic, difficulty, and language preferences.

By combining explicit format instructions, specific requirements, and topic-specific guidance, we've created a robust system that reliably produces educational matching exercises tailored to different learning contexts.

---

Prepared by: Alex Ex  
Exercise Generation Specialist
