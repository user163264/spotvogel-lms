/**
 * Matching Exercise Generator Service
 * Handles generating matching exercises using OpenAI's API.
 */

import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug mode flag
const DEBUG = process.env.DEBUG_MODE === 'true';

class MatchingExerciseGenerator {
  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this.apiKey = apiKey;
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    
    if (DEBUG) {
      this.logInitialization();
    }
  }

  /**
   * Debug logging for initialization
   */
  logInitialization() {
    console.log('\n===== MATCHING EXERCISE GENERATOR INITIALIZED =====');
    console.log('TIME:', new Date().toISOString());
    console.log('API ENDPOINT:', this.apiEndpoint);
    console.log('API KEY PRESENT:', !!this.apiKey);
    console.log('=====================================================\n');
  }

  /**
   * Generates a matching exercise from lesson content
   * @param {string} lessonContent - The lesson text content
   * @param {Object} options - Configuration options for the exercise
   * @returns {Promise<Object>} Generated exercise data
   */
  async generateMatchingExercise(lessonContent, options = {}) {
    if (DEBUG) {
      this.logGenerationStart(lessonContent, options);
    }
    
    try {
      // Set default options
      const defaultOptions = {
        numberOfPairs: 5,
        difficulty: 'medium', // easy, medium, hard
        language: 'nl', // Default to Dutch as in our example
        topic: 'auto-detect' // Auto-detect from content or specify
      };

      // Merge provided options with defaults
      const config = { ...defaultOptions, ...options };
      
      if (DEBUG) {
        console.log('\n----- EXERCISE GENERATION CONFIG -----');
        console.log(JSON.stringify(config, null, 2));
        console.log('--------------------------------------\n');
      }

      // Truncate content if too long
      const truncatedContent = this.truncateContent(lessonContent, 4000);
      
      if (DEBUG && truncatedContent !== lessonContent) {
        console.log('\n----- CONTENT TRUNCATED -----');
        console.log(`Original length: ${lessonContent.length}`);
        console.log(`Truncated length: ${truncatedContent.length}`);
        console.log('-----------------------------\n');
      }

      // Construct the prompt for OpenAI
      const prompt = this.constructPrompt(truncatedContent, config);
      
      if (DEBUG) {
        console.log('\n----- OPENAI PROMPT -----');
        console.log(JSON.stringify(prompt, null, 2));
        console.log('-------------------------\n');
      }

      // Make API request to OpenAI
      const startTime = Date.now();
      const response = await this.callOpenAI(prompt);
      const duration = Date.now() - startTime;
      
      if (DEBUG) {
        console.log('\n----- OPENAI RESPONSE TIME -----');
        console.log(`Duration: ${duration}ms`);
        console.log('-------------------------------\n');
      }

      // Parse and validate the response
      const exerciseData = this.parseResponse(response);
      
      if (DEBUG) {
        console.log('\n----- PARSED EXERCISE DATA -----');
        console.log(JSON.stringify(exerciseData, null, 2));
        console.log('-------------------------------\n');
      }

      return exerciseData;
    } catch (error) {
      console.error('\n===== ERROR GENERATING MATCHING EXERCISE =====');
      console.error('ERROR TYPE:', error.name);
      console.error('MESSAGE:', error.message);
      console.error('STACK:', error.stack);
      console.error('==============================================\n');
      
      throw new Error(`Failed to generate matching exercise: ${error.message}`);
    }
  }

  /**
   * Logs the start of exercise generation
   * @param {string} content - The lesson content
   * @param {Object} options - The generation options
   */
  logGenerationStart(content, options) {
    console.log('\n===== STARTING EXERCISE GENERATION =====');
    console.log('TIME:', new Date().toISOString());
    console.log('CONTENT LENGTH:', content.length);
    console.log('CONTENT PREVIEW:', content.substring(0, 100) + '...');
    console.log('OPTIONS:', JSON.stringify(options, null, 2));
    console.log('=========================================\n');
  }

  /**
   * Truncates content to a specified length to ensure it fits in API limits
   * @param {string} content - The content to truncate
   * @param {number} maxLength - Maximum character length
   * @returns {string} Truncated content
   */
  truncateContent(content, maxLength) {
    if (content.length <= maxLength) return content;
    
    // Truncate to maxLength characters, but try to end at a sentence
    let truncated = content.substring(0, maxLength);
    
    // Find the last sentence end
    const lastPeriod = truncated.lastIndexOf('.');
    const lastQuestion = truncated.lastIndexOf('?');
    const lastExclamation = truncated.lastIndexOf('!');
    
    // Find the last sentence end (period, question mark, or exclamation point)
    const sentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);
    
    // If we found a sentence end, truncate there
    if (sentenceEnd > maxLength * 0.8) { // Only use if it's reasonably far into the text
      truncated = truncated.substring(0, sentenceEnd + 1);
      
      if (DEBUG) {
        console.log('\n----- SMART TRUNCATION -----');
        console.log(`Found sentence end at position: ${sentenceEnd}`);
        console.log(`Final truncated length: ${truncated.length}`);
        console.log('---------------------------\n');
      }
    }
    
    return truncated + " [content truncated for length]";
  }

  /**
   * Constructs the prompt for OpenAI
   * @param {string} content - The content to analyze
   * @param {Object} config - Configuration options
   * @returns {Array} Formatted prompt messages
   */
  constructPrompt(content, config) {
    return [
      {
        role: 'system',
        content: `You are an educational exercise generator specializing in creating matching exercises.
You will be provided with lesson content about a particular topic.
Your task is to create a matching exercise with ${config.numberOfPairs} pairs of related items.
The exercise should be at a ${config.difficulty} difficulty level and in ${config.language} language.
Your response should be a valid JSON object that follows this exact structure:
{
  "exercise_type": "matching_words",
  "question": "The main question instruction for students",
  "word_bank": ["Item 1 to match", "Item 2 to match", ...],
  "match_options": ["Option A", "Option B", ...],
  "correct_answer": {
    "Item 1 to match": "Option corresponding to Item 1",
    "Item 2 to match": "Option corresponding to Item 2",
    ...
  },
  "max_score": ${config.numberOfPairs},
  "grading_type": "auto"
}
Ensure:
1. The pairs have a clear 1:1 relationship
2. Word_bank and match_options arrays have the same length
3. There is one entry in correct_answer for each word_bank item
4. All match_options are used exactly once in correct_answer
5. Items are closely related to the lesson content
6. The question is clear and appropriate for the content`
      },
      {
        role: 'user',
        content: `Here is the lesson content to create a matching exercise from:\n\n${content}\n\nPlease generate a matching exercise based on this content.`
      }
    ];
  }

  /**
   * Makes API call to OpenAI
   * @param {Array} messages - The prompt messages to send
   * @returns {Promise<Object>} The raw API response
   */
  async callOpenAI(messages) {
    try {
      if (DEBUG) {
        console.log('\n----- CALLING OPENAI API -----');
        console.log('TIME:', new Date().toISOString());
        console.log('ENDPOINT:', this.apiEndpoint);
        console.log('REQUEST PAYLOAD SIZE:', JSON.stringify(messages).length);
        console.log('-----------------------------\n');
      }
      
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: 'gpt-4', // You can use a different model as needed
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (DEBUG) {
        console.log('\n----- OPENAI API RESPONSE -----');
        console.log('STATUS:', response.status);
        console.log('HEADERS:', JSON.stringify(response.headers, null, 2));
        console.log('MODEL:', response.data.model);
        console.log('TOKENS USED:', {
          prompt_tokens: response.data.usage.prompt_tokens,
          completion_tokens: response.data.usage.completion_tokens,
          total_tokens: response.data.usage.total_tokens
        });
        console.log('------------------------------\n');
      }

      return response.data;
    } catch (error) {
      console.error('\n===== OPENAI API ERROR =====');
      console.error('STATUS:', error.response?.status);
      console.error('ERROR DATA:', JSON.stringify(error.response?.data, null, 2));
      console.error('ERROR MESSAGE:', error.message);
      console.error('============================\n');
      
      throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Parses and validates the API response
   * @param {Object} response - The API response
   * @returns {Object} Structured exercise data
   */
  parseResponse(response) {
    try {
      // Extract content from the response
      const content = response.choices[0].message.content;
      
      if (DEBUG) {
        console.log('\n----- RAW RESPONSE CONTENT -----');
        console.log(content);
        console.log('------------------------------\n');
      }
      
      // Find JSON object in the response (it might be surrounded by markdown code blocks)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/) || [null, content];
      const jsonContent = jsonMatch[1].trim();
      
      if (DEBUG) {
        console.log('\n----- EXTRACTED JSON CONTENT -----');
        console.log(jsonContent);
        console.log('---------------------------------\n');
      }
      
      // Parse the JSON
      const exerciseData = JSON.parse(jsonContent);
      
      // Validate the response structure
      this.validateExerciseData(exerciseData);
      
      return exerciseData;
    } catch (error) {
      console.error('\n===== ERROR PARSING OPENAI RESPONSE =====');
      console.error('ERROR TYPE:', error.name);
      console.error('MESSAGE:', error.message);
      console.error('STACK:', error.stack);
      console.error('========================================\n');
      
      throw new Error(`Failed to parse exercise data: ${error.message}`);
    }
  }

  /**
   * Validates the structure of generated exercise data
   * @param {Object} data - The exercise data to validate
   */
  validateExerciseData(data) {
    if (DEBUG) {
      console.log('\n----- VALIDATING EXERCISE DATA -----');
    }
    
    // Check required fields
    const requiredFields = ['exercise_type', 'question', 'word_bank', 'match_options', 'correct_answer', 'max_score', 'grading_type'];
    for (const field of requiredFields) {
      if (!data[field]) {
        const error = `Missing required field: ${field}`;
        if (DEBUG) console.log('VALIDATION ERROR:', error);
        throw new Error(error);
      }
      
      if (DEBUG) console.log(`FIELD CHECK: ${field} ✓`);
    }
    
    // Validate exercise type
    if (data.exercise_type !== 'matching_words') {
      const error = `Invalid exercise type: ${data.exercise_type}`;
      if (DEBUG) console.log('VALIDATION ERROR:', error);
      throw new Error(error);
    }
    
    if (DEBUG) console.log('TYPE CHECK: exercise_type ✓');
    
    // Validate arrays
    if (!Array.isArray(data.word_bank) || !Array.isArray(data.match_options)) {
      const error = 'word_bank and match_options must be arrays';
      if (DEBUG) console.log('VALIDATION ERROR:', error);
      throw new Error(error);
    }
    
    if (DEBUG) console.log('ARRAY CHECK: word_bank and match_options are arrays ✓');
    
    // Check that arrays have the same length
    if (data.word_bank.length !== data.match_options.length) {
      const error = 'word_bank and match_options must have the same length';
      if (DEBUG) console.log('VALIDATION ERROR:', error);
      throw new Error(error);
    }
    
    if (DEBUG) console.log(`ARRAY LENGTH CHECK: both arrays have length ${data.word_bank.length} ✓`);
    
    // Validate correct_answer mapping
    if (typeof data.correct_answer !== 'object') {
      const error = 'correct_answer must be an object';
      if (DEBUG) console.log('VALIDATION ERROR:', error);
      throw new Error(error);
    }
    
    if (DEBUG) console.log('OBJECT CHECK: correct_answer is an object ✓');
    
    // Check that each word_bank item has a corresponding correct_answer
    for (const item of data.word_bank) {
      if (!data.correct_answer[item]) {
        const error = `Missing correct answer for word_bank item: ${item}`;
        if (DEBUG) console.log('VALIDATION ERROR:', error);
        throw new Error(error);
      }
      
      if (DEBUG) console.log(`CORRECT ANSWER CHECK: ${item} has a matching answer ✓`);
    }
    
    // Check that all match_options are used exactly once in correct_answer
    const usedOptions = Object.values(data.correct_answer);
    const uniqueUsedOptions = new Set(usedOptions);
    
    if (uniqueUsedOptions.size !== data.match_options.length) {
      const error = 'Each match_option must be used exactly once in correct_answer';
      if (DEBUG) console.log('VALIDATION ERROR:', error);
      throw new Error(error);
    }
    
    if (DEBUG) console.log('OPTION USAGE CHECK: all options used exactly once ✓');
    
    // Check that all used options exist in match_options
    for (const option of usedOptions) {
      if (!data.match_options.includes(option)) {
        const error = `Option used in correct_answer does not exist in match_options: ${option}`;
        if (DEBUG) console.log('VALIDATION ERROR:', error);
        throw new Error(error);
      }
      
      if (DEBUG) console.log(`OPTION EXISTENCE CHECK: ${option} exists in match_options ✓`);
    }
    
    if (DEBUG) {
      console.log('VALIDATION SUCCESSFUL ✅');
      console.log('--------------------------------\n');
    }
  }

  /**
   * Saves the generated exercise to the database
   * @param {Object} exerciseData - The generated exercise data
   * @param {number} lessonId - The ID of the lesson
   * @param {Object} dbConnection - Database connection to use
   * @returns {Promise<number>} The ID of the created exercise
   */
  async saveExerciseToDatabase(exerciseData, lessonId, dbConnection) {
    const startTime = Date.now();
    
    if (DEBUG) {
      console.log('\n===== SAVING EXERCISE TO DATABASE =====');
      console.log('TIME:', new Date().toISOString());
      console.log('LESSON ID:', lessonId);
      console.log('EXERCISE TYPE:', exerciseData.exercise_type);
      console.log('=======================================\n');
    }
    
    try {
      // Validate parameters
      if (!exerciseData) throw new Error('Exercise data is required');
      if (!lessonId) throw new Error('Lesson ID is required');
      if (!dbConnection) throw new Error('Database connection is required');
      
      // Step 1: Insert into exercises table
      const [exerciseResult] = await dbConnection.query(
        `INSERT INTO exercises 
         (lesson_id, exercise_type, question, max_score, grading_type, order_index) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          lessonId,
          exerciseData.exercise_type,
          exerciseData.question,
          exerciseData.max_score,
          exerciseData.grading_type,
          0 // Default order_index, can be updated later
        ]
      );
      
      if (DEBUG) {
        console.log('\n----- EXERCISE INSERT RESULT -----');
        console.log('INSERT ID:', exerciseResult.insertId);
        console.log('---------------------------------\n');
      }
      
      const exerciseId = exerciseResult.insertId;
      
      // Step 2: Insert into matching_words_exercises table
      const [matchingExerciseResult] = await dbConnection.query(
        'INSERT INTO matching_words_exercises (exercise_id) VALUES (?)',
        [exerciseId]
      );
      
      if (DEBUG) {
        console.log('\n----- MATCHING EXERCISE INSERT RESULT -----');
        console.log('INSERT ID:', matchingExerciseResult.insertId);
        console.log('------------------------------------------\n');
      }
      
      // Step 3: Get the matching exercise ID
      const [matchingExerciseRows] = await dbConnection.query(
        'SELECT matching_exercise_id FROM matching_words_exercises WHERE exercise_id = ?',
        [exerciseId]
      );
      
      const matchingExerciseId = matchingExerciseRows[0].matching_exercise_id;
      
      if (DEBUG) {
        console.log('\n----- MATCHING EXERCISE ID -----');
        console.log('ID:', matchingExerciseId);
        console.log('-------------------------------\n');
      }
      
      // Step 4: Insert word bank items
      const wordBankItems = [];
      for (let i = 0; i < exerciseData.word_bank.length; i++) {
        const content = exerciseData.word_bank[i];
        const [result] = await dbConnection.query(
          'INSERT INTO word_bank_items (matching_exercise_id, content, display_order) VALUES (?, ?, ?)',
          [matchingExerciseId, content, i + 1]
        );
        
        wordBankItems.push({
          id: result.insertId,
          content: content
        });
        
        if (DEBUG) {
          console.log(`\n----- WORD BANK ITEM INSERT: ${i + 1}/${exerciseData.word_bank.length} -----`);
          console.log('CONTENT:', content);
          console.log('INSERT ID:', result.insertId);
          console.log('--------------------------------------------------\n');
        }
      }
      
      // Step 5: Insert match options
      const matchOptions = [];
      for (let i = 0; i < exerciseData.match_options.length; i++) {
        const content = exerciseData.match_options[i];
        const [result] = await dbConnection.query(
          'INSERT INTO match_options (matching_exercise_id, content, display_order) VALUES (?, ?, ?)',
          [matchingExerciseId, content, i + 1]
        );
        
        matchOptions.push({
          id: result.insertId,
          content: content
        });
        
        if (DEBUG) {
          console.log(`\n----- MATCH OPTION INSERT: ${i + 1}/${exerciseData.match_options.length} -----`);
          console.log('CONTENT:', content);
          console.log('INSERT ID:', result.insertId);
          console.log('--------------------------------------------------\n');
        }
      }
      
      // Step 6: Insert correct answers mappings
      for (const wordBankItem of wordBankItems) {
        const correctOptionContent = exerciseData.correct_answer[wordBankItem.content];
        const matchOption = matchOptions.find(option => option.content === correctOptionContent);
        
        if (!matchOption) {
          throw new Error(`Match option not found for content: ${correctOptionContent}`);
        }
        
        await dbConnection.query(
          'INSERT INTO correct_answers (matching_exercise_id, word_bank_item_id, match_option_id) VALUES (?, ?, ?)',
          [matchingExerciseId, wordBankItem.id, matchOption.id]
        );
        
        if (DEBUG) {
          console.log('\n----- CORRECT ANSWER INSERT -----');
          console.log('WORD BANK ITEM:', wordBankItem.content);
          console.log('MATCH OPTION:', correctOptionContent);
          console.log('--------------------------------\n');
        }
      }
      
      const duration = Date.now() - startTime;
      
      if (DEBUG) {
        console.log('\n===== EXERCISE SAVED SUCCESSFULLY =====');
        console.log('EXERCISE ID:', exerciseId);
        console.log('DURATION:', `${duration}ms`);
        console.log('=======================================\n');
      }
      
      return exerciseId;
    } catch (error) {
      console.error('\n===== ERROR SAVING EXERCISE TO DATABASE =====');
      console.error('ERROR TYPE:', error.name);
      console.error('MESSAGE:', error.message);
      console.error('STACK:', error.stack);
      console.error('===========================================\n');
      
      throw new Error(`Failed to save exercise to database: ${error.message}`);
    }
  }
}

export default MatchingExerciseGenerator;
