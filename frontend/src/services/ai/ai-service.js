/**
 * AI Service for Exercise Generation
 * 
 * This service uses the OpenAI API to generate matching words exercises
 * based on the provided topic, difficulty, and language.
 * 
 * Created by: Alex Ex
 * Date: March 28, 2025
 */

import { generateMatchingWordsPrompt } from './matching-words-prompt-template';

// OpenAI API key from environment
let OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// For temporary API key during a session
let temporaryApiKey = null;

// Check if API key is available and log appropriate message
if (!OPENAI_API_KEY) {
  console.warn("OpenAI API key not found. Set REACT_APP_OPENAI_API_KEY in your .env file or provide a key in the UI.");
}

/**
 * Service for generating exercises using OpenAI
 */
export const aiService = {
  /**
   * Set a temporary API key to use for requests
   * @param {string} apiKey - The OpenAI API key
   */
  setTemporaryApiKey(apiKey) {
    temporaryApiKey = apiKey;
  },

  /**
   * Clear the temporary API key
   */
  clearTemporaryApiKey() {
    temporaryApiKey = null;
  },

  /**
   * Get the current API key (temporary or from env)
   * @returns {string} - The API key
   */
  getCurrentApiKey() {
    return temporaryApiKey || OPENAI_API_KEY;
  },
  /**
   * Generate a matching words exercise using OpenAI
   * @param {string} topic - The topic of the exercise (e.g., 'art', 'geography')
   * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard')
   * @param {string} language - The language code ('en', 'nl', 'fr')
   * @returns {Promise<Object>} - The generated exercise data
   */
  async generateExercise(topic, difficulty = 'medium', language = 'en') {
    try {
      // Determine number of items based on difficulty
      const itemCount = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 6 : 5;
      
      // Generate the prompt using our template system
      const prompt = generateMatchingWordsPrompt(topic, difficulty, itemCount, language);
      
      // Log the prompt in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('AI Prompt:', prompt);
      }
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getCurrentApiKey()}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an educational content creator specializing in creating matching exercises for students.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      
      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || response.statusText;
        throw new Error(`OpenAI API error: ${errorMessage}`);
      }
      
      // Parse the response
      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from OpenAI API');
      }
      
      // Log the raw content for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Raw OpenAI response:', content);
      }
      
      // Extract JSON from the response content
      // This handles both pure JSON responses and responses with surrounding text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        console.error('No valid JSON found in the response:', content);
        throw new Error('The AI response did not contain valid JSON. Please try again.');
      }
      
      // Parse the extracted JSON
      try {
        // Attempt to clean the JSON string if needed
        let jsonString = jsonMatch[0];
        // Replace any invalid escaped characters
        jsonString = jsonString.replace(/\\/g, '\\\\');
        
        // Try to parse the JSON
        const exerciseData = JSON.parse(jsonString);
        
        // Validate the exercise data has the minimum required fields
        if (!exerciseData.word_bank || !exerciseData.match_options || !exerciseData.correct_answer) {
          console.error('Missing required fields in exercise data:', exerciseData);
          throw new Error('The AI response is missing required exercise fields');
        }
        
        // Add metadata
        exerciseData.id = `${topic}-${difficulty}-${Date.now()}`;
        exerciseData.generated_at = new Date().toISOString();
        
        return exerciseData;
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('JSON string that failed to parse:', jsonMatch[0]);
        throw new Error(`Failed to parse AI response as valid JSON. Please try again. (${parseError.message})`);
      }
    } catch (error) {
      console.error('AI service error:', error);
      throw error;
    }
  }
};
