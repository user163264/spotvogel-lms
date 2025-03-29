/**
 * Enhanced AI Service with improved error handling and resilience
 * For Teacher-Focused LMS OpenAI Integration
 */

const OpenAI = require('openai');
const logger = require('../utils/logger'); // Assuming you have a logger utility

// Maintain reference to OpenAI instance to avoid recreation
let openaiInstance = null;

// Configure timeout (ms) and retry settings
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

/**
 * Initialize and cache OpenAI API instance
 */
function getOpenAIInstance() {
  if (!openaiInstance) {
    // Validate API key before attempting to create instance
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }
    
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      logger.warn('OPENAI_API_KEY does not start with "sk-", which is unusual for OpenAI keys');
    }
    
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    logger.info('OpenAI API instance created successfully');
  }
  
  return openaiInstance;
}

/**
 * Generate an exercise using OpenAI based on provided parameters
 * @param {Object} params - Exercise generation parameters
 * @param {string} params.topic - The topic for the exercise
 * @param {string} params.difficulty - Difficulty level (beginner, intermediate, advanced)
 * @param {string} params.type - Exercise type (multiple-choice, open-ended, etc)
 * @param {string} params.language - Language for the exercise
 * @returns {Promise<Object>} Generated exercise content
 */
async function generateExercise(params) {
  const { topic, difficulty, type, language } = params;
  
  // Input validation
  if (!topic) {
    throw new Error('Topic is required for exercise generation');
  }
  
  logger.info(`Generating ${difficulty} ${type} exercise about "${topic}" in ${language}`);
  
  try {
    const openai = getOpenAIInstance();
    
    // Construct a well-structured prompt based on parameters
    const prompt = constructExercisePrompt(params);
    
    // Track timing for performance monitoring
    const startTime = Date.now();
    
    // Call OpenAI API with retry mechanism
    const response = await callWithRetry(async () => {
      return openai.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo-instruct", // Specify model explicitly
        prompt,
        max_tokens: 800,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
    }, MAX_RETRIES, RETRY_DELAY);
    
    const elapsedTime = Date.now() - startTime;
    logger.info(`Exercise generated in ${elapsedTime}ms`);
    
    // Process and validate the response
    if (!response.choices || response.choices.length === 0) {
      logger.error('Invalid response from OpenAI API', { response });
      throw new Error('Received invalid response from OpenAI API');
    }
    
    const exerciseText = response.choices[0].text.trim();
    
    // Parse the exercise from the generated text
    return parseExerciseFromText(exerciseText, type);
    
  } catch (error) {
    // Enhanced error handling
    logger.error('Error generating exercise with OpenAI', {
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      },
      params
    });
    
    // Provide more specific error messages based on error type
    if (error.response) {
      // OpenAI API error with response
      const status = error.response.status;
      
      if (status === 401) {
        throw new Error('Authentication error: Invalid OpenAI API key');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded: Too many requests to OpenAI API');
      } else if (status === 500) {
        throw new Error('OpenAI service error: Please try again later');
      } else {
        throw new Error(`OpenAI API error: ${error.response.data.error.message || 'Unknown error'}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('OpenAI API request timed out. Please try again or use a simpler topic.');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Network error: Unable to connect to OpenAI API');
    } else {
      // Re-throw the original error with context
      throw new Error(`Failed to generate exercise: ${error.message}`);
    }
  }
}

/**
 * Construct a detailed prompt for exercise generation
 */
function constructExercisePrompt(params) {
  const { topic, difficulty, type, language } = params;
  
  // Default values
  const difficultyLevel = difficulty || 'intermediate';
  const exerciseType = type || 'multiple-choice';
  const exerciseLanguage = language || 'english';
  
  // Base prompts by exercise type
  const promptTemplates = {
    'multiple-choice': `Create a multiple-choice exercise about ${topic} for ${difficultyLevel} level students. 
      Include a clear question, 4 options (labeled A, B, C, D), and indicate the correct answer.
      Make sure the question is challenging but appropriate for the ${difficultyLevel} level.`,
      
    'open-ended': `Create an open-ended question about ${topic} for ${difficultyLevel} level students.
      Include a clear question that requires a thoughtful response, and provide a sample answer
      that would be considered excellent.`,
      
    'fill-in-blank': `Create a fill-in-the-blank exercise about ${topic} for ${difficultyLevel} level students.
      Include a paragraph or sentence with 3-5 blanks, and provide the correct answers for each blank.`,
      
    'matching': `Create a matching exercise about ${topic} for ${difficultyLevel} level students.
      Include 5-7 items in column A and their matching pairs in column B, with clear instructions.`
  };
  
  // Get the right template or use multiple-choice as default
  let prompt = promptTemplates[exerciseType] || promptTemplates['multiple-choice'];
  
  // Add language instruction
  if (exerciseLanguage && exerciseLanguage !== 'english') {
    prompt += `\nWrite the entire exercise in ${exerciseLanguage}.`;
  }
  
  // Add formatting instructions
  prompt += `\nFormat your answer as follows:
    1. Exercise title
    2. Instructions
    3. Question content
    4. Options/answer expectation
    5. Correct answer`;
    
  return prompt;
}

/**
 * Parse exercise text into structured format
 */
function parseExerciseFromText(text, type) {
  // Different parsing strategies based on exercise type
  if (type === 'multiple-choice') {
    // Attempt to parse multiple choice format
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Match option pattern (A, B, C, D followed by text)
    const optionPattern = /^([A-D])[.):\s]+(.+)$/;
    
    // Find title (usually the first line)
    const title = lines[0];
    
    // Find instructions (if present, usually second line)
    let instructions = '';
    let startIndex = 1;
    if (lines.length > 1 && !optionPattern.test(lines[1]) && !lines[1].includes('?')) {
      instructions = lines[1];
      startIndex = 2;
    }
    
    // Find question (first line with a question mark, or next line after instructions)
    let question = '';
    for (let i = startIndex; i < lines.length; i++) {
      if (lines[i].includes('?')) {
        question = lines[i];
        startIndex = i + 1;
        break;
      }
    }
    
    if (!question) {
      // If no question mark found, assume the line after instructions is the question
      question = lines[startIndex];
      startIndex++;
    }
    
    // Extract options
    const options = {};
    for (let i = startIndex; i < lines.length; i++) {
      const match = lines[i].match(optionPattern);
      if (match) {
        const [, option, text] = match;
        options[option] = text.trim();
      }
    }
    
    // Find correct answer
    let correctAnswer = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('correct answer') || line.includes('answer:')) {
        // Extract letter from formats like "Correct answer: A" or "Answer: C"
        const match = line.match(/([A-Da-d])\s*$/);
        if (match) {
          correctAnswer = match[1].toUpperCase();
        }
      }
    }
    
    // If options are empty or correctAnswer is empty, return the raw text
    if (Object.keys(options).length === 0 || !correctAnswer) {
      return {
        rawText: text,
        type: 'multiple-choice'
      };
    }
    
    return {
      title,
      instructions,
      question,
      options,
      correctAnswer,
      type: 'multiple-choice'
    };
  } else {
    // For other types, return the raw text for now
    return {
      rawText: text,
      type
    };
  }
}

/**
 * Call a function with retry mechanism
 */
async function callWithRetry(fn, maxRetries, delay) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication errors
      if (error.response && error.response.status === 401) {
        throw error;
      }
      
      // Log retry attempt
      if (attempt < maxRetries) {
        const nextAttempt = attempt + 1;
        logger.warn(`Attempt ${nextAttempt}/${maxRetries + 1} failed, retrying in ${delay}ms`, {
          error: error.message,
          attempt: nextAttempt
        });
        
        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError;
}

/**
 * Test the OpenAI connection with a simple prompt
 */
async function testConnection() {
  try {
    const openai = getOpenAIInstance();
    
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: "Say 'OpenAI connection successful'",
      max_tokens: 10
    });
    
    return {
      success: true,
      message: response.choices[0].text.trim()
    };
  } catch (error) {
    logger.error('OpenAI connection test failed', { error: error.message });
    
    return {
      success: false,
      message: `Connection test failed: ${error.message}`,
      error
    };
  }
}

module.exports = {
  generateExercise,
  testConnection
};