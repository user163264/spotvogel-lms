/**
 * Enhanced OpenAI API Adapter with comprehensive debugging
 * 
 * This service provides a detailed debugging interface for OpenAI API
 * interactions, capturing every step of the request/response cycle.
 * 
 * Created by: Alex Ex (AI Exercise Generation Specialist)
 * Date: April 1, 2025
 */

import { generateMatchingWordsPrompt } from './matching-words-prompt-template';
import { FEATURES } from '../../config/config';

/**
 * OpenAI Adapter for exercise generation with enhanced debugging
 */
class OpenAIAdapter {
  constructor() {
    // Check if in debug mode from feature flags
    this.debugMode = FEATURES.DEBUG_MODE;
    
    // Use the API key from environment or temporary storage
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.temporaryApiKey = null;
  }

  /**
   * Enable or disable debug mode
   * @param {boolean} enabled - Whether debug mode should be enabled
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
  }

  /**
   * Set a temporary API key
   * @param {string} apiKey - The OpenAI API key
   */
  setTemporaryApiKey(apiKey) {
    this.temporaryApiKey = apiKey;
  }

  /**
   * Get the current API key
   * @returns {string} - The API key to use
   */
  getCurrentApiKey() {
    return this.temporaryApiKey || this.apiKey;
  }

  /**
   * Generate a matching words exercise using OpenAI with detailed debugging
   * @param {string} userInput - Content to use for exercise generation
   * @param {string} exerciseType - Type of exercise to generate
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Generated exercise with debug info
   */
  async generateExercise(userInput, exerciseType, options = {}) {
    // Create the debug info object to track the entire process
    const debugInfo = {
      request: {
        timestamp: new Date().toISOString(),
        input: userInput,
        exerciseType: exerciseType,
        prompt: null,
        fullPrompt: null,
        parameters: {
          model: options.model || "gpt-3.5-turbo",
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 800,
          presence_penalty: options.presence_penalty || 0,
          frequency_penalty: options.frequency_penalty || 0,
        }
      },
      response: {
        timestamp: null,
        rawResponse: null,
        processedResponse: null,
      },
      performance: {
        startTime: Date.now(),
        endTime: null,
        totalTime: null
      },
      errors: [],
      processingSteps: []
    };

    try {
      // 1. Sanitize user input to prevent prompt injection
      const sanitizedInput = this.sanitizeInput(userInput);
      debugInfo.processingSteps.push({
        step: "input_sanitization",
        timestamp: new Date().toISOString(),
        details: `Sanitized input (${userInput.length} chars -> ${sanitizedInput.length} chars)`
      });

      // 2. Get the appropriate prompt template for the exercise type
      let promptTemplate;
      switch(exerciseType) {
        case 'matching_words':
          promptTemplate = generateMatchingWordsPrompt(
            sanitizedInput, 
            options.difficulty || 'medium',
            options.numberOfPairs || 5,
            options.language || 'en'
          );
          break;
        case 'multiple_choice':
          // Add other exercise type templates when implemented
          promptTemplate = this.getMultipleChoicePrompt(sanitizedInput, options);
          break;
        case 'fill_blank':
          promptTemplate = this.getFillInTheBlankPrompt(sanitizedInput, options);
          break;
        case 'true_false':
          promptTemplate = this.getTrueFalsePrompt(sanitizedInput, options);
          break;
        default:
          promptTemplate = generateMatchingWordsPrompt(sanitizedInput); // Default to matching words
      }
      
      debugInfo.request.prompt = promptTemplate;
      
      // 3. Log prompt preparation step
      debugInfo.processingSteps.push({
        step: "prompt_preparation",
        timestamp: new Date().toISOString(),
        details: `Selected ${exerciseType} template and configured with options`
      });

      // 4. Create the API request payload
      const requestPayload = {
        model: debugInfo.request.parameters.model,
        messages: [
          { 
            role: "system", 
            content: "You are an educational content generator specializing in creating exercises for students."
          },
          { 
            role: "user", 
            content: promptTemplate
          }
        ],
        temperature: debugInfo.request.parameters.temperature,
        max_tokens: debugInfo.request.parameters.max_tokens,
        presence_penalty: debugInfo.request.parameters.presence_penalty,
        frequency_penalty: debugInfo.request.parameters.frequency_penalty,
      };
      
      // 5. Log API request preparation
      debugInfo.request.fullPrompt = promptTemplate;
      // Store the complete API request payload for debugging
      debugInfo.request.completeApiRequest = requestPayload;
      debugInfo.processingSteps.push({
        step: "request_preparation",
        timestamp: new Date().toISOString(),
        details: `Prepared API request with ${requestPayload.messages.length} messages`
      });

      // 6. Make the API request
      debugInfo.processingSteps.push({
        step: "api_request_start",
        timestamp: new Date().toISOString(),
        details: `Making request to OpenAI API (${debugInfo.request.parameters.model})`
      });
      
      const requestStartTime = Date.now();
      
      const apiKey = this.getCurrentApiKey();
      if (!apiKey) {
        throw new Error("OpenAI API key not found. Set REACT_APP_OPENAI_API_KEY in .env or provide a temporary key.");
      }
      
      // Capture the exact body being sent to OpenAI for debugging
      const requestBody = JSON.stringify(requestPayload);
      debugInfo.request.rawRequestBody = requestBody;
      
      // Create and store headers (with API key masked for security)
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`
      };
      
      // Store headers for debug info (with masked API key)
      debugInfo.request.headers = headers;
      debugInfo.request.url = 'https://api.openai.com/v1/chat/completions';
      debugInfo.request.method = 'POST';
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: requestBody
      });
      
      const requestEndTime = Date.now();
      
      // 7. Record API response time
      debugInfo.processingSteps.push({
        step: "api_request_end",
        timestamp: new Date().toISOString(),
        details: `Received response from OpenAI API in ${requestEndTime - requestStartTime}ms`
      });
      
      // 8. Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || response.statusText;
        
        debugInfo.errors.push({
          stage: "api_response",
          error: `OpenAI API error: ${errorMessage}`,
          timestamp: new Date().toISOString()
        });
        
        throw new Error(`OpenAI API error: ${errorMessage}`);
      }
      
      // 9. Parse the response
      const data = await response.json();
      debugInfo.response.timestamp = new Date().toISOString();
      debugInfo.response.rawResponse = data;
      
      debugInfo.processingSteps.push({
        step: "response_parsing",
        timestamp: new Date().toISOString(),
        details: "Successfully parsed JSON response from API"
      });
      
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        debugInfo.errors.push({
          stage: "content_extraction",
          error: "Empty content received from OpenAI API",
          timestamp: new Date().toISOString()
        });
        
        throw new Error('Empty response from OpenAI API');
      }
      
      // 10. Extract JSON from the response content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        debugInfo.errors.push({
          stage: "json_extraction",
          error: "No valid JSON found in response content",
          timestamp: new Date().toISOString()
        });
        
        console.error('No valid JSON found in response:', content);
        throw new Error('The AI response did not contain valid JSON. Please try again.');
      }
      
      // 11. Parse the extracted JSON
      let exercise;
      try {
        // Attempt to clean the JSON string if needed
        let jsonString = jsonMatch[0];
        
        // Try to parse the JSON
        exercise = JSON.parse(jsonString);
        
        debugInfo.processingSteps.push({
          step: "json_parsing",
          timestamp: new Date().toISOString(),
          details: "Successfully parsed exercise data from JSON"
        });
      } catch (parseError) {
        debugInfo.errors.push({
          stage: "json_parsing",
          error: `JSON parsing error: ${parseError.message}`,
          timestamp: new Date().toISOString()
        });
        
        console.error('JSON parsing error:', parseError);
        throw new Error(`Failed to parse AI response as valid JSON. Please try again. (${parseError.message})`);
      }
      
      // 12. Sanitize and standardize the exercise data
      const sanitizedExercise = this.sanitizeExerciseData(exercise, userInput, exerciseType, options.language);
      
      debugInfo.processingSteps.push({
        step: "sanitization",
        timestamp: new Date().toISOString(),
        details: "Sanitized exercise data for security"
      });
      
      // 13. Validate the exercise structure
      const validationResult = this.validateExerciseStructure(sanitizedExercise, exerciseType);
      
      if (!validationResult.valid) {
        debugInfo.errors.push({
          stage: "validation",
          error: validationResult.message,
          timestamp: new Date().toISOString()
        });
        
        // Try to continue with a partially valid exercise rather than fail completely
        debugInfo.processingSteps.push({
          step: "validation_warning",
          timestamp: new Date().toISOString(),
          details: `Validation issues detected: ${validationResult.message}`
        });
      } else {
        debugInfo.processingSteps.push({
          step: "validation",
          timestamp: new Date().toISOString(),
          details: "Exercise data structure validated successfully"
        });
      }
      
      // 14. Store the processed response
      debugInfo.response.processedResponse = sanitizedExercise;
      
      // 15. Complete performance metrics
      debugInfo.performance.endTime = Date.now();
      debugInfo.performance.totalTime = debugInfo.performance.endTime - debugInfo.performance.startTime;
      
      // 16. Return the exercise and debug info
      return {
        exercise: sanitizedExercise,
        debugInfo: this.debugMode ? debugInfo : null
      };
      
    } catch (error) {
      // Record the error and complete debug info
      debugInfo.errors.push({
        stage: "general",
        error: error.message || "Unknown error",
        timestamp: new Date().toISOString()
      });
      
      // Complete performance metrics
      debugInfo.performance.endTime = Date.now();
      debugInfo.performance.totalTime = debugInfo.performance.endTime - debugInfo.performance.startTime;
      
      // Return error state with debug info
      return {
        exercise: null,
        error: error.message || "Failed to generate exercise",
        debugInfo: this.debugMode ? debugInfo : null
      };
    }
  }

  /**
   * Sanitize user input to prevent prompt injection
   * @param {string} input - The input to sanitize
   * @returns {string} - The sanitized input
   */
  sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
      return 'general topic';
    }
    
    // Extract a more concise topic (first 100 chars max)
    let sanitized = input.trim().slice(0, 100);
    
    // Remove any special characters that could lead to prompt injection
    sanitized = sanitized.replace(/[\n\r]/g, ' ');
    
    // Replace any instructions or commands that might look like directives
    sanitized = sanitized.replace(/^(create|make|generate|list|write|show|tell|give)/i, 'about');
    
    // Replace suspicious keywords that might try to change the prompt's intention
    const suspiciousTerms = [
      'prompt', 'instruction', 'forget', 'ignore', 'instead', 'system', 
      'user input', 'original prompt', 'disregard', 'template'
    ];
    
    for (const term of suspiciousTerms) {
      sanitized = sanitized.replace(new RegExp(term, 'gi'), 'topic');
    }
    
    // Ensure we still have something meaningful
    if (sanitized.length < 3) {
      return 'general topic';
    }
    
    return sanitized;
  }

  /**
   * Sanitize and standardize exercise data for security
   * @param {Object} exerciseData - Raw exercise data from API
   * @param {string} userInput - Original user input
   * @param {string} exerciseType - Type of exercise
   * @param {string} language - Language code
   * @returns {Object} - Sanitized exercise data
   */
  sanitizeExerciseData(exerciseData, userInput, exerciseType, language = 'en') {
    // Create a deep copy to avoid mutating the original
    const sanitized = JSON.parse(JSON.stringify(exerciseData));
    
    // MAXIMUM SECURITY: Completely override the question with standard format
    // This is the most reliable way to prevent any form of text injection
    const standardizedQuestions = {
      'en': {
        'matching_words': 'Match each item with its correct counterpart.',
        'multiple_choice': 'Select the correct answer for each question.',
        'fill_blank': 'Fill in the blank with the correct answer.',
        'true_false': 'Determine whether each statement is true or false.'
      },
      'nl': {
        'matching_words': 'Verbind elk item met zijn juiste tegenhanger.',
        'multiple_choice': 'Selecteer het juiste antwoord voor elke vraag.',
        'fill_blank': 'Vul de ontbrekende woorden in.',
        'true_false': 'Bepaal of elke uitspraak waar of niet waar is.'
      },
      'fr': {
        'matching_words': 'Associez chaque élément à son homologue correct.',
        'multiple_choice': 'Sélectionnez la réponse correcte pour chaque question.',
        'fill_blank': 'Complétez avec la réponse correcte.',
        'true_false': 'Déterminez si chaque déclaration est vraie ou fausse.'
      }
    };
    
    // Use standardized question or fallback to English if language not supported
    const langQuestions = standardizedQuestions[language] || standardizedQuestions.en;
    sanitized.question = langQuestions[exerciseType] || langQuestions.matching_words;
    
    // For 'matching_words' exercises, validate word_bank items don't contain raw user input
    if (exerciseType === 'matching_words' && sanitized.word_bank && Array.isArray(sanitized.word_bank)) {
      // Check for any item that contains a substantial chunk of user input
      const userInputChunks = userInput.split(/[.,;\n]/).map(s => s.trim()).filter(s => s.length > 10);
      
      sanitized.word_bank = sanitized.word_bank.map(item => {
        // Check if this item contains direct user input
        const containsUserInput = userInputChunks.some(chunk => 
          item.includes(chunk) && chunk.length > 10
        );
        
        // Log and sanitize if needed
        if (containsUserInput) {
          console.warn('Detected potential input injection in word_bank item:', item);
          // Replace with generic text + original
          return `Term: ${item}`;
        }
        return item;
      });
    }
    
    // Add metadata
    sanitized.id = sanitized.id || `${exerciseType}-${Date.now()}`;
    sanitized.generated_at = new Date().toISOString();
    
    return sanitized;
  }

  /**
   * Validate the structure of the generated exercise
   * @param {Object} exercise - The exercise to validate
   * @param {string} expectedType - The expected exercise type
   * @returns {Object} - Validation result with valid flag and error message
   */
  validateExerciseStructure(exercise, expectedType) {
    // Check if exercise exists
    if (!exercise) {
      return { valid: false, message: "No exercise data returned" };
    }
    
    // Check exercise type
    if (exercise.exercise_type !== expectedType) {
      return { 
        valid: false, 
        message: `Exercise type mismatch. Expected: ${expectedType}, Got: ${exercise.exercise_type || 'undefined'}` 
      };
    }
    
    // Check for required fields based on exercise type
    const requiredFields = this.getRequiredFieldsForExerciseType(expectedType);
    const missingFields = requiredFields.filter(field => !exercise[field]);
    
    if (missingFields.length > 0) {
      return { 
        valid: false, 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      };
    }
    
    // Additional validation for specific exercise types
    switch (expectedType) {
      case 'multiple_choice':
        if (!Array.isArray(exercise.options) || exercise.options.length < 2) {
          return { valid: false, message: "Multiple choice exercise must have at least 2 options" };
        }
        if (!exercise.correct_answer) {
          return { valid: false, message: "Multiple choice exercise must have a correct_answer" };
        }
        break;
        
      case 'matching_words':
        if (!Array.isArray(exercise.word_bank) || exercise.word_bank.length < 2) {
          return { valid: false, message: "Matching exercise must have at least 2 items in word_bank" };
        }
        if (!exercise.match_options || !Array.isArray(exercise.match_options)) {
          return { valid: false, message: "Matching exercise must have match_options array" };
        }
        if (!exercise.correct_answer || typeof exercise.correct_answer !== 'object') {
          return { valid: false, message: "Matching exercise must have correct_answer object" };
        }
        break;
        
      case 'fill_blank':
        if (typeof exercise.question !== 'string' || !exercise.question.includes('_')) {
          return { valid: false, message: "Fill in the blank exercise must have a blank in the question" };
        }
        if (!exercise.correct_answer) {
          return { valid: false, message: "Fill in the blank exercise must have a correct_answer" };
        }
        break;
        
      case 'true_false':
        if (typeof exercise.question !== 'string') {
          return { valid: false, message: "True/false exercise must have a question statement" };
        }
        if (exercise.correct_answer !== true && exercise.correct_answer !== false && 
            exercise.correct_answer !== 'true' && exercise.correct_answer !== 'false') {
          return { valid: false, message: "True/false exercise must have a boolean correct_answer" };
        }
        break;
    }
    
    // All validations passed
    return { valid: true };
  }

  /**
   * Get the required fields for a specific exercise type
   * @param {string} exerciseType - The type of exercise
   * @returns {Array<string>} - Array of required field names
   */
  getRequiredFieldsForExerciseType(exerciseType) {
    const requiredFieldsMap = {
      'multiple_choice': ['exercise_type', 'question', 'options', 'correct_answer'],
      'true_false': ['exercise_type', 'question', 'correct_answer'],
      'fill_blank': ['exercise_type', 'question', 'correct_answer'],
      'matching_words': ['exercise_type', 'question', 'word_bank', 'match_options', 'correct_answer'],
    };
    
    return requiredFieldsMap[exerciseType] || ['exercise_type', 'question'];
  }
  
  /**
   * Get prompt template for multiple choice exercises
   * @param {string} content - Content to generate questions from
   * @param {Object} options - Exercise options
   * @returns {string} - Formatted prompt
   */
  getMultipleChoicePrompt(content, options = {}) {
    const numQuestions = options.numQuestions || 3;
    const difficulty = options.difficulty || 'medium';
    const language = options.language || 'en';
    
    const languagePrompts = {
      'en': 'Create a multiple-choice exercise',
      'nl': 'Maak een meerkeuzeoefening',
      'fr': 'Créez un exercice à choix multiple'
    };
    
    const basePrompt = languagePrompts[language] || languagePrompts.en;
    
    return `${basePrompt} based on the following content:

${content}

Requirements:
- Create ${numQuestions} multiple-choice questions with 4 options each
- Difficulty level: ${difficulty}
- Make sure only one answer is correct
- Do not repeat questions or answers
- Each question should test understanding of the content

Format your response as a JSON object with the following structure:
{
  "exercise_type": "multiple_choice",
  "question": "Your question here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "The correct option"
}

Make sure the questions are factually correct based on the provided content.`;
  }
  
  /**
   * Get prompt template for fill in the blank exercises
   * @param {string} content - Content to generate questions from
   * @param {Object} options - Exercise options
   * @returns {string} - Formatted prompt
   */
  getFillInTheBlankPrompt(content, options = {}) {
    const difficulty = options.difficulty || 'medium';
    const language = options.language || 'en';
    
    const languagePrompts = {
      'en': 'Create a fill-in-the-blank exercise',
      'nl': 'Maak een invuloefening',
      'fr': 'Créez un exercice à trous'
    };
    
    const basePrompt = languagePrompts[language] || languagePrompts.en;
    
    return `${basePrompt} based on the following content:

${content}

Requirements:
- Create a sentence with one blank (use underscore "_____" to indicate the blank)
- Difficulty level: ${difficulty}
- The blank should replace an important concept or term
- Make sure the answer is clear from the context

Format your response as a JSON object with the following structure:
{
  "exercise_type": "fill_blank",
  "question": "Sentence with _____ for the blank.",
  "correct_answer": "The word that goes in the blank"
}

Make sure the exercise is factually correct based on the provided content.`;
  }
  
  /**
   * Get prompt template for true/false exercises
   * @param {string} content - Content to generate questions from
   * @param {Object} options - Exercise options
   * @returns {string} - Formatted prompt
   */
  getTrueFalsePrompt(content, options = {}) {
    const difficulty = options.difficulty || 'medium';
    const language = options.language || 'en';
    
    const languagePrompts = {
      'en': 'Create a true/false exercise',
      'nl': 'Maak een waar/niet waar oefening',
      'fr': 'Créez un exercice vrai/faux'
    };
    
    const basePrompt = languagePrompts[language] || languagePrompts.en;
    
    return `${basePrompt} based on the following content:

${content}

Requirements:
- Create a statement that is clearly true or false based on the content
- Difficulty level: ${difficulty}
- The statement should be factually verifiable from the content
- Do not make it ambiguous

Format your response as a JSON object with the following structure:
{
  "exercise_type": "true_false",
  "question": "Your true or false statement here.",
  "correct_answer": true or false (boolean value)
}

Make sure the statement is clearly true or false based on the provided content.`;
  }
}

export default OpenAIAdapter;
