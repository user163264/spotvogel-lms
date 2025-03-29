/**
 * Matching Words Exercise AI Prompt Template
 * 
 * This file contains the updated prompt template for generating matching words exercises
 * that are compatible with the optimized MatchingWords component.
 * 
 * Created by: Alex Ex
 * Date: March 28, 2025
 */

/**
 * Generates an AI prompt for creating a matching words exercise
 * @param {string} topic - The topic of the exercise
 * @param {string} difficulty - The difficulty level (easy, medium, hard)
 * @param {number} itemCount - Number of matching pairs to generate
 * @param {string} language - Language for the exercise (en, nl, fr)
 * @returns {string} The formatted prompt for the AI service
 */
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

{
  "exercise_type": "matching_words",
  "question": "${templates.questionTemplate.replace('{topic}', topic)}",
  "word_bank": [
    ${generatePlaceholders(actualItemCount, templates.leftItemExample)}
  ],
  "match_options": [
    ${generatePlaceholders(actualItemCount, templates.rightItemExample)}
  ],
  "correct_answer": {
    ${generateCorrectAnswerPlaceholders(actualItemCount)}
  },
  "max_score": ${actualItemCount},
  "grading_type": "auto"
}

${templates.requirements}

${getTopicSpecificGuidance(topic)}
`;
}

/**
 * Generate placeholder examples for array items
 * @param {number} count - Number of items
 * @param {string} example - Example text
 * @returns {string} Formatted placeholders
 */
function generatePlaceholders(count, example) {
  return Array(count).fill(`"${example}"`).join(',\n    ');
}

/**
 * Generate placeholder examples for correct answer object
 * @param {number} count - Number of items
 * @returns {string} Formatted placeholders
 */
function generateCorrectAnswerPlaceholders(count) {
  return Array(count).fill(`    "Left Item": "Right Item"`).join(',\n    ');
}

/**
 * Adjust item count based on difficulty level
 * @param {string} difficulty - Difficulty level
 * @param {number} baseCount - Base item count
 * @returns {number} Adjusted item count
 */
function adjustItemCountByDifficulty(difficulty, baseCount) {
  const multipliers = {
    'easy': 0.8,
    'medium': 1.0,
    'hard': 1.5
  };
  
  const multiplier = multipliers[difficulty] || 1.0;
  const adjustedCount = Math.round(baseCount * multiplier);
  
  // Enforce minimum and maximum limits
  return Math.min(Math.max(adjustedCount, 3), 15);
}

/**
 * Get difficulty-specific guidance for the AI
 * @param {string} difficulty - Difficulty level
 * @param {Object} templates - Language templates
 * @returns {string} Guidance text
 */
function getDifficultyGuidance(difficulty, templates) {
  const guidanceMap = {
    'easy': templates.easyGuidance,
    'medium': templates.mediumGuidance,
    'hard': templates.hardGuidance
  };
  
  return guidanceMap[difficulty] || templates.mediumGuidance;
}

/**
 * Get topic-specific guidance for the AI
 * @param {string} topic - The topic of the exercise
 * @returns {string} Topic-specific guidance
 */
function getTopicSpecificGuidance(topic) {
  // Map of topics to specific guidance
  const topicGuidance = {
    'art': 'Match artists with their famous works, art movements with their characteristics, or art techniques with their descriptions.',
    'geography': 'Match countries with capitals, geographical features with locations, or climate types with regions.',
    'science': 'Match scientific concepts with definitions, scientists with discoveries, or elements with properties.',
    'languages': 'Match words with translations, grammar terms with examples, or phrases with their meanings.',
    'history': 'Match historical figures with achievements, events with dates, or historical periods with key developments.',
    'music': 'Match composers with compositions, instruments with families, or music terms with definitions.',
    'literature': 'Match authors with works, characters with books, or literary terms with examples.',
    'math': 'Match mathematical concepts with definitions, formulas with their applications, or mathematicians with their contributions.'
  };
  
  // Convert topic to lowercase for case-insensitive matching
  const lowerTopic = topic.toLowerCase();
  
  // Find the first matching topic key
  for (const [key, guidance] of Object.entries(topicGuidance)) {
    if (lowerTopic.includes(key)) {
      return `For this ${key} topic, consider the following approach: ${guidance}`;
    }
  }
  
  // Default guidance if no specific topic is matched
  return 'Ensure that each item has a clear, unique match that is factually correct and educational.';
}

/**
 * Language-specific templates for prompts
 */
const languageTemplates = {
  // English templates
  en: {
    instructions: 'Create a matching exercise about the provided topic for an educational platform.',
    context: 'The exercise should be about {topic} and should match related concepts, definitions, or examples.',
    questionTemplate: 'Match each {topic} item with its correct counterpart.',
    leftItemExample: 'Example left item',
    rightItemExample: 'Example right item',
    easyGuidance: 'Create an easy exercise with simple, direct matches that are obvious to someone with basic knowledge of the topic.',
    mediumGuidance: 'Create a moderate difficulty exercise that requires good understanding of the topic but uses clear, established relationships.',
    hardGuidance: 'Create a challenging exercise that requires detailed knowledge of the topic, using specific terminology and nuanced relationships.',
    format: 'Return ONLY a JSON object with the following structure:',
    requirements: 'Requirements:\n- Each item in word_bank MUST have exactly one matching item in match_options\n- All matches must be factually correct\n- Avoid ambiguous matches where multiple answers could be correct\n- Ensure all content is educational and appropriate for students'
  },
  
  // Dutch templates
  nl: {
    instructions: 'Maak een koppeloefeningsopdracht over het opgegeven onderwerp voor een educatief platform.',
    context: 'De oefening moet gaan over {topic} en moet gerelateerde concepten, definities of voorbeelden koppelen.',
    questionTemplate: 'Koppel elk {topic} item aan de juiste tegenhanger.',
    leftItemExample: 'Voorbeeld links item',
    rightItemExample: 'Voorbeeld rechts item',
    easyGuidance: 'Maak een eenvoudige oefening met simpele, directe koppelingen die duidelijk zijn voor iemand met basiskennis van het onderwerp.',
    mediumGuidance: 'Maak een oefening van gemiddelde moeilijkheidsgraad die een goed begrip van het onderwerp vereist, maar duidelijke, gevestigde relaties gebruikt.',
    hardGuidance: 'Maak een uitdagende oefening die gedetailleerde kennis van het onderwerp vereist, met specifieke terminologie en genuanceerde relaties.',
    format: 'Geef ALLEEN een JSON object terug met de volgende structuur:',
    requirements: 'Vereisten:\n- Elk item in word_bank MOET precies één overeenkomend item hebben in match_options\n- Alle koppelingen moeten feitelijk correct zijn\n- Vermijd dubbelzinnige koppelingen waarbij meerdere antwoorden correct kunnen zijn\n- Zorg ervoor dat alle inhoud educatief en geschikt is voor studenten'
  },
  
  // French templates
  fr: {
    instructions: 'Créez un exercice d\'association sur le sujet fourni pour une plateforme éducative.',
    context: 'L\'exercice doit porter sur {topic} et doit associer des concepts, définitions ou exemples liés.',
    questionTemplate: 'Associez chaque élément de {topic} à son homologue correct.',
    leftItemExample: 'Exemple d\'élément gauche',
    rightItemExample: 'Exemple d\'élément droit',
    easyGuidance: 'Créez un exercice facile avec des associations simples et directes, évidentes pour quelqu\'un ayant une connaissance de base du sujet.',
    mediumGuidance: 'Créez un exercice de difficulté modérée qui nécessite une bonne compréhension du sujet mais utilise des relations claires et établies.',
    hardGuidance: 'Créez un exercice stimulant qui nécessite une connaissance détaillée du sujet, en utilisant une terminologie spécifique et des relations nuancées.',
    format: 'Retournez UNIQUEMENT un objet JSON avec la structure suivante:',
    requirements: 'Exigences:\n- Chaque élément dans word_bank DOIT avoir exactement un élément correspondant dans match_options\n- Toutes les associations doivent être factuellement correctes\n- Évitez les associations ambiguës où plusieurs réponses pourraient être correctes\n- Assurez-vous que tout le contenu est éducatif et approprié pour les étudiants'
  }
};

module.exports = {
  generateMatchingWordsPrompt,
  adjustItemCountByDifficulty,
  generatePlaceholders,
  getDifficultyGuidance,
  getTopicSpecificGuidance
};
