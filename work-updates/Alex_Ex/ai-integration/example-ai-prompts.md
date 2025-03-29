# Example AI Prompt Templates for Matching Words Exercises

**Date:** March 28, 2025  
**Author:** Alex Ex  
**Subject:** Sample prompts for different subjects and difficulty levels

This document contains example AI prompts for generating matching words exercises across different subjects and difficulty levels. These examples demonstrate how our prompt template system can be used to create effective, well-structured exercises.

## 1. Art History (Medium Difficulty)

```
Create a matching exercise about the provided topic for an educational platform.

The exercise should be about art history and should match related concepts, definitions, or examples.

Create a moderate difficulty exercise that requires good understanding of the topic but uses clear, established relationships.

Return ONLY a JSON object with the following structure:

{
  "exercise_type": "matching_words",
  "question": "Match each art history item with its correct counterpart.",
  "word_bank": [
    "Cubism",
    "Impressionism",
    "Pop Art",
    "Surrealism",
    "Renaissance"
  ],
  "match_options": [
    "Andy Warhol",
    "Salvador Dalí",
    "Claude Monet",
    "Pablo Picasso",
    "Leonardo da Vinci"
  ],
  "correct_answer": {
    "Cubism": "Pablo Picasso",
    "Impressionism": "Claude Monet",
    "Pop Art": "Andy Warhol",
    "Surrealism": "Salvador Dalí",
    "Renaissance": "Leonardo da Vinci"
  },
  "max_score": 5,
  "grading_type": "auto"
}

Requirements:
- Each item in word_bank MUST have exactly one matching item in match_options
- All matches must be factually correct
- Avoid ambiguous matches where multiple answers could be correct
- Ensure all content is educational and appropriate for students

For this art topic, consider the following approach: Match art movements with their characteristics, artists with their famous works, or art techniques with their descriptions.
```

## 2. Geography (Easy Difficulty)

```
Create a matching exercise about the provided topic for an educational platform.

The exercise should be about geography and should match related concepts, definitions, or examples.

Create an easy exercise with simple, direct matches that are obvious to someone with basic knowledge of the topic.

Return ONLY a JSON object with the following structure:

{
  "exercise_type": "matching_words",
  "question": "Match each geography item with its correct counterpart.",
  "word_bank": [
    "France",
    "Japan",
    "Brazil",
    "Egypt",
    "Australia"
  ],
  "match_options": [
    "Tokyo",
    "Cairo",
    "Brasília",
    "Paris",
    "Canberra"
  ],
  "correct_answer": {
    "France": "Paris",
    "Japan": "Tokyo",
    "Brazil": "Brasília",
    "Egypt": "Cairo",
    "Australia": "Canberra"
  },
  "max_score": 5,
  "grading_type": "auto"
}

Requirements:
- Each item in word_bank MUST have exactly one matching item in match_options
- All matches must be factually correct
- Avoid ambiguous matches where multiple answers could be correct
- Ensure all content is educational and appropriate for students

For this geography topic, consider the following approach: Match countries with capitals, geographical features with locations, or climate types with regions.
```

## 3. Programming Concepts (Hard Difficulty)

```
Create a matching exercise about the provided topic for an educational platform.

The exercise should be about programming concepts and should match related concepts, definitions, or examples.

Create a challenging exercise that requires detailed knowledge of the topic, using specific terminology and nuanced relationships.

Return ONLY a JSON object with the following structure:

{
  "exercise_type": "matching_words",
  "question": "Match each programming concepts item with its correct counterpart.",
  "word_bank": [
    "Polymorphism",
    "Recursion",
    "Memoization",
    "Lambda function",
    "Destructuring",
    "Dependency Injection"
  ],
  "match_options": [
    "Unpacking values from arrays or objects into distinct variables",
    "Function calling itself to solve smaller instances of the same problem",
    "Design pattern where components receive their dependencies from external sources",
    "Anonymous function that can be passed as an argument",
    "Storing results of expensive function calls to avoid redundant computation",
    "Objects of different types responding to the same method name"
  ],
  "correct_answer": {
    "Polymorphism": "Objects of different types responding to the same method name",
    "Recursion": "Function calling itself to solve smaller instances of the same problem",
    "Memoization": "Storing results of expensive function calls to avoid redundant computation",
    "Lambda function": "Anonymous function that can be passed as an argument",
    "Destructuring": "Unpacking values from arrays or objects into distinct variables",
    "Dependency Injection": "Design pattern where components receive their dependencies from external sources"
  },
  "max_score": 6,
  "grading_type": "auto"
}

Requirements:
- Each item in word_bank MUST have exactly one matching item in match_options
- All matches must be factually correct
- Avoid ambiguous matches where multiple answers could be correct
- Ensure all content is educational and appropriate for students

Ensure that each item has a clear, unique match that is factually correct and educational.
```

## 4. Music Theory (Medium Difficulty in Dutch)

```
Maak een koppeloefeningsopdracht over het opgegeven onderwerp voor een educatief platform.

De oefening moet gaan over muziektheorie en moet gerelateerde concepten, definities of voorbeelden koppelen.

Maak een oefening van gemiddelde moeilijkheidsgraad die een goed begrip van het onderwerp vereist, maar duidelijke, gevestigde relaties gebruikt.

Geef ALLEEN een JSON object terug met de volgende structuur:

{
  "exercise_type": "matching_words",
  "question": "Koppel elk muziektheorie item aan de juiste tegenhanger.",
  "word_bank": [
    "Toonladder",
    "Akkoord",
    "Interval",
    "Ritme",
    "Timbre"
  ],
  "match_options": [
    "De klankkleur of toonkwaliteit van een instrument",
    "Het patroon van sterke en zwakke pulsen in de tijd",
    "De afstand tussen twee tonen",
    "Een combinatie van drie of meer tonen tegelijk gespeeld",
    "Een reeks tonen in oplopende of dalende volgorde"
  ],
  "correct_answer": {
    "Toonladder": "Een reeks tonen in oplopende of dalende volgorde",
    "Akkoord": "Een combinatie van drie of meer tonen tegelijk gespeeld",
    "Interval": "De afstand tussen twee tonen",
    "Ritme": "Het patroon van sterke en zwakke pulsen in de tijd",
    "Timbre": "De klankkleur of toonkwaliteit van een instrument"
  },
  "max_score": 5,
  "grading_type": "auto"
}

Vereisten:
- Elk item in word_bank MOET precies één overeenkomend item hebben in match_options
- Alle koppelingen moeten feitelijk correct zijn
- Vermijd dubbelzinnige koppelingen waarbij meerdere antwoorden correct kunnen zijn
- Zorg ervoor dat alle inhoud educatief en geschikt is voor studenten

Zorg ervoor dat elk item een duidelijke, unieke match heeft die feitelijk correct en educatief is.
```

## 5. Biology (Hard Difficulty in French)

```
Créez un exercice d'association sur le sujet fourni pour une plateforme éducative.

L'exercice doit porter sur la biologie et doit associer des concepts, définitions ou exemples liés.

Créez un exercice stimulant qui nécessite une connaissance détaillée du sujet, en utilisant une terminologie spécifique et des relations nuancées.

Retournez UNIQUEMENT un objet JSON avec la structure suivante:

{
  "exercise_type": "matching_words",
  "question": "Associez chaque élément de biologie à son homologue correct.",
  "word_bank": [
    "Mitochondrie",
    "Ribosome",
    "Lysosome",
    "Appareil de Golgi",
    "Réticulum endoplasmique",
    "Membrane plasmique"
  ],
  "match_options": [
    "Organite qui synthétise des protéines à partir d'ARNm",
    "Structure qui filtre les substances entrant et sortant de la cellule",
    "Réseau de tubes membraneux impliqués dans la synthèse et le transport des lipides",
    "Organite qui trie et modifie les protéines avant leur expédition",
    "Organelle spécialisée dans la production d'ATP par respiration cellulaire",
    "Vésicule contenant des enzymes digestives pour décomposer les macromolécules"
  ],
  "correct_answer": {
    "Mitochondrie": "Organelle spécialisée dans la production d'ATP par respiration cellulaire",
    "Ribosome": "Organite qui synthétise des protéines à partir d'ARNm",
    "Lysosome": "Vésicule contenant des enzymes digestives pour décomposer les macromolécules",
    "Appareil de Golgi": "Organite qui trie et modifie les protéines avant leur expédition",
    "Réticulum endoplasmique": "Réseau de tubes membraneux impliqués dans la synthèse et le transport des lipides",
    "Membrane plasmique": "Structure qui filtre les substances entrant et sortant de la cellule"
  },
  "max_score": 6,
  "grading_type": "auto"
}

Exigences:
- Chaque élément dans word_bank DOIT avoir exactement un élément correspondant dans match_options
- Toutes les associations doivent être factuellement correctes
- Évitez les associations ambiguës où plusieurs réponses pourraient être correctes
- Assurez-vous que tout le contenu est éducatif et approprié pour les étudiants

Assurez-vous que chaque élément a une correspondance claire et unique qui est factuellement correcte et éducative.
```

## Generating Prompts Programmatically

Using our prompt template system, these examples can be generated programmatically:

```javascript
const { generateMatchingWordsPrompt } = require('./matching-words-prompt-template');

// Generate art history prompt (medium difficulty)
const artPrompt = generateMatchingWordsPrompt('art history', 'medium', 5, 'en');

// Generate geography prompt (easy difficulty)
const geoPrompt = generateMatchingWordsPrompt('geography', 'easy', 5, 'en');

// Generate programming concepts prompt (hard difficulty)
const progPrompt = generateMatchingWordsPrompt('programming concepts', 'hard', 6, 'en');

// Generate music theory prompt in Dutch (medium difficulty)
const musicPrompt = generateMatchingWordsPrompt('muziektheorie', 'medium', 5, 'nl');

// Generate biology prompt in French (hard difficulty)
const bioPrompt = generateMatchingWordsPrompt('biologie', 'hard', 6, 'fr');
```

## Testing the Generated Prompts

These prompts have been tested with OpenAI's models and produce well-structured, valid exercises that require minimal validation and correction. The difficulty levels successfully adjust the complexity of the content, and the language-specific templates produce grammatically correct prompts.

Continued refinement of the prompt templates based on AI response analysis will further improve the quality and consistency of generated exercises.
