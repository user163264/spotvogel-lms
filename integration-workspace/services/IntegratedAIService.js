/**
 * IntegratedAIService
 * 
 * This service integrates the AI exercise generation capabilities
 * with the frontend components. It wraps the existing AI service and
 * adds compatibility layers for the frontend components.
 */

// Import original AI service
// In the real implementation, this would be the actual path
// import aiService from '../../services/ai/ai-service';
// import { validateMatchingExercise } from '../../services/ai/matching-words-validation';

/**
 * Generate a matching exercise based on the given parameters
 * 
 * @param {string} topic - The topic for the exercise
 * @param {string} difficulty - The difficulty level (easy, medium, hard)
 * @param {string} language - The language code (en, nl, fr)
 * @returns {Promise<Object>} - The generated exercise data
 */
export const generateExercise = async (topic, difficulty = 'medium', language = 'en') => {
  if (!topic) {
    throw new Error('Topic is required');
  }
  
  try {
    // In the real implementation, this would call the actual service
    // const response = await aiService.generateExercise(topic, difficulty, language);
    
    // For now, we'll use a mock implementation
    const mockResponse = await mockGenerateExercise(topic, difficulty, language);
    
    // Validate the response
    // In the real implementation, this would use the actual validation
    // const validationResult = validateMatchingExercise(mockResponse);
    // if (!validationResult.isValid) {
    //   throw new Error(`Invalid exercise data: ${validationResult.errors.join(', ')}`);
    // }
    
    // Add unique ID if not present
    if (!mockResponse.id) {
      mockResponse.id = `exercise-${Date.now()}`;
    }
    
    return mockResponse;
  } catch (error) {
    console.error('Error generating exercise:', error);
    throw new Error(`Failed to generate exercise: ${error.message}`);
  }
};

/**
 * Mock implementation of the exercise generation for testing
 * In the real implementation, this would be replaced by the actual API call
 */
const mockGenerateExercise = async (topic, difficulty, language) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock data based on topic
  let wordBank, matchOptions, correctAnswer;
  
  // Different examples based on topics
  if (topic.toLowerCase().includes('art') || topic.toLowerCase().includes('painting')) {
    wordBank = ['Mona Lisa', 'Starry Night', 'The Scream', 'Guernica', 'The Persistence of Memory'];
    matchOptions = [
      'Leonardo da Vinci', 
      'Vincent van Gogh',
      'Edvard Munch',
      'Pablo Picasso',
      'Salvador Dalí'
    ];
    correctAnswer = {
      'Mona Lisa': 'Leonardo da Vinci',
      'Starry Night': 'Vincent van Gogh',
      'The Scream': 'Edvard Munch',
      'Guernica': 'Pablo Picasso',
      'The Persistence of Memory': 'Salvador Dalí'
    };
  } else if (topic.toLowerCase().includes('geography') || topic.toLowerCase().includes('capital')) {
    wordBank = ['France', 'Germany', 'Italy', 'Spain', 'Netherlands'];
    matchOptions = ['Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam'];
    correctAnswer = {
      'France': 'Paris',
      'Germany': 'Berlin',
      'Italy': 'Rome',
      'Spain': 'Madrid',
      'Netherlands': 'Amsterdam'
    };
  } else {
    // Default to tech-related content
    wordBank = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'];
    matchOptions = [
      'Markup language for web pages', 
      'Styling language for web pages',
      'Programming language for web pages',
      'JavaScript library for building user interfaces',
      'JavaScript runtime environment'
    ];
    correctAnswer = {
      'HTML': 'Markup language for web pages',
      'CSS': 'Styling language for web pages',
      'JavaScript': 'Programming language for web pages',
      'React': 'JavaScript library for building user interfaces',
      'Node.js': 'JavaScript runtime environment'
    };
  }
  
  // Adjust difficulty
  if (difficulty === 'hard') {
    // Add more items for hard difficulty
    if (topic.toLowerCase().includes('art')) {
      wordBank.push('The Night Watch', 'The Kiss');
      matchOptions.push('Rembrandt', 'Gustav Klimt');
      correctAnswer['The Night Watch'] = 'Rembrandt';
      correctAnswer['The Kiss'] = 'Gustav Klimt';
    } else if (topic.toLowerCase().includes('geography')) {
      wordBank.push('Belgium', 'Portugal');
      matchOptions.push('Brussels', 'Lisbon');
      correctAnswer['Belgium'] = 'Brussels';
      correctAnswer['Portugal'] = 'Lisbon';
    } else {
      wordBank.push('TypeScript', 'GraphQL');
      matchOptions.push('Typed superset of JavaScript', 'Query language for APIs');
      correctAnswer['TypeScript'] = 'Typed superset of JavaScript';
      correctAnswer['GraphQL'] = 'Query language for APIs';
    }
  } else if (difficulty === 'easy') {
    // Reduce items for easy difficulty
    wordBank = wordBank.slice(0, 3);
    matchOptions = matchOptions.slice(0, 3);
    correctAnswer = {
      [wordBank[0]]: matchOptions[0],
      [wordBank[1]]: matchOptions[1],
      [wordBank[2]]: matchOptions[2]
    };
  }
  
  // Create question based on language
  let question;
  if (language === 'nl') {
    question = `Koppel elk item aan zijn juiste omschrijving (Onderwerp: ${topic})`;
  } else if (language === 'fr') {
    question = `Associez chaque élément à sa description correcte (Sujet: ${topic})`;
  } else {
    question = `Match each item with its correct description (Topic: ${topic})`;
  }
  
  return {
    id: `exercise-${Date.now()}`,
    exercise_type: 'matching_words',
    question,
    word_bank: wordBank,
    match_options: matchOptions,
    correct_answer: correctAnswer,
    max_score: wordBank.length,
    grading_type: 'auto'
  };
};

/**
 * Submit a completed exercise for grading
 * 
 * @param {Object} submission - The submission data
 * @param {string} submission.exerciseId - The exercise ID
 * @param {Object} submission.answers - The student answers
 * @param {Object} submission.exerciseData - The original exercise data
 * @returns {Promise<Object>} - The grading result
 */
export const submitExercise = async (submission) => {
  try {
    // In the real implementation, this might call a backend API
    // For now, we'll grade locally
    const { answers, exerciseData } = submission;
    
    // Calculate score
    const correctCount = Object.entries(answers).reduce((count, [key, value]) => {
      return exerciseData.correct_answer[key] === value ? count + 1 : count;
    }, 0);
    
    const score = (correctCount / exerciseData.word_bank.length) * 100;
    
    return {
      exerciseId: submission.exerciseId,
      score,
      correctCount,
      totalCount: exerciseData.word_bank.length,
      feedback: generateFeedback(score)
    };
  } catch (error) {
    console.error('Error submitting exercise:', error);
    throw new Error(`Failed to submit exercise: ${error.message}`);
  }
};

/**
 * Generate feedback based on score
 */
const generateFeedback = (score) => {
  if (score >= 90) {
    return 'Excellent work! You have a strong understanding of this topic.';
  } else if (score >= 70) {
    return 'Good job! You understand most of this topic.';
  } else if (score >= 50) {
    return 'You\'re making progress. Keep studying this topic.';
  } else {
    return 'This topic needs more review. Don\'t worry, keep practicing!';
  }
};

export default {
  generateExercise,
  submitExercise
};
