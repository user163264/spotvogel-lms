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

// Get the API key from environment variables
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Check if API key is available and log appropriate message
if (!OPENAI_API_KEY) {
  console.warn("OpenAI API key not found. Set REACT_APP_OPENAI_API_KEY in your .env file.");
}

/**
 * Service for generating exercises using OpenAI
 */
export const aiService = {
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
          'Authorization': `Bearer ${OPENAI_API_KEY}`
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
      
      // Extract JSON from the response content
      // This handles both pure JSON responses and responses with surrounding text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No JSON found in the response');
      }
      
      // Parse the extracted JSON
      try {
        const exerciseData = JSON.parse(jsonMatch[0]);
        
        // Add metadata
        exerciseData.id = `${topic}-${difficulty}-${Date.now()}`;
        exerciseData.generated_at = new Date().toISOString();
        
        return exerciseData;
      } catch (parseError) {
        throw new Error(`Failed to parse response as JSON: ${parseError.message}`);
      }
    } catch (error) {
      console.error('AI service error:', error);
      throw error;
    }
  }
};
