const axios = require('axios');

/**
 * Service for interacting with OpenAI API to generate educational content
 */
class AIService {
  constructor() {
    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('Warning: OPENAI_API_KEY not set in environment variables');
    }
    
    this.client = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout for longer requests
    });
    
    // Log OpenAI configuration status
    console.log(`OpenAI API client initialized with model: ${process.env.OPENAI_MODEL || 'gpt-3.5-turbo'}`);
    if (!apiKey) {
      console.error('WARNING: OPENAI_API_KEY is not set. API calls will fail.');
    }
  }

  /**
   * Generate exercises based on subject, grade level, and parameters
   * 
   * @param {Object} params - Exercise generation parameters
   * @param {string} params.subject - Subject area (e.g., "math", "language", "science")
   * @param {string} params.gradeLevel - Education level (e.g., "elementary", "middle", "high")
   * @param {string} params.topic - Specific topic within the subject
   * @param {string} params.exerciseType - Type of exercise (e.g., "multiple-choice", "open-ended", "fill-in-the-blank")
   * @param {number} params.difficulty - Difficulty level (1-5)
   * @param {number} params.count - Number of questions to generate
   * @param {string} params.language - Language for the exercises (e.g., "english", "dutch", "french")
   * @returns {Promise<Object>} Generated exercises
   */
  async generateExercises(params) {
    try {
      const { subject, gradeLevel, topic, exerciseType, difficulty, count, language } = params;
      
      // Build a structured prompt for the AI
      const prompt = this.buildExercisePrompt(params);
      
      // Call OpenAI API
      const response = await this.client.post('/chat/completions', {
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an experienced education specialist who creates high-quality exercises for students."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });
      
      // Parse the response to extract structured exercise data
      return this.parseExerciseResponse(response.data.choices[0].message.content, exerciseType);
    } catch (error) {
      console.error('====== ERROR GENERATING EXERCISES ======');
      console.error('Request parameters:', JSON.stringify(params, null, 2));
      
      if (error.response) {
        // OpenAI API responded with an error
        console.error('OpenAI API Error Status:', error.response.status);
        console.error('OpenAI API Error Data:', JSON.stringify(error.response.data, null, 2));
        console.error('OpenAI API Error Headers:', JSON.stringify(error.response.headers, null, 2));
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received from OpenAI API');
        console.error('Request:', error.request);
      } else {
        // Error in setting up the request
        console.error('Error setting up the request:', error.message);
      }
      
      // Log the full error with stack trace
      console.error('Full error:', error);
      console.error('Stack trace:', error.stack);
      console.error('========================================');
      
      throw new Error(`Failed to generate exercises: ${error.message}`);
    }
  }

  /**
   * Build a detailed prompt for exercise generation
   */
  buildExercisePrompt(params) {
    const { subject, gradeLevel, topic, exerciseType, difficulty, count, language } = params;
    
    const difficultyLabels = ['very easy', 'easy', 'moderate', 'challenging', 'very challenging'];
    const difficultyLabel = difficultyLabels[difficulty - 1] || 'moderate';
    
    let prompt = `Create ${count} ${difficultyLabel} ${exerciseType} exercises on the topic of "${topic}" in ${subject} for ${gradeLevel} level students. The exercises should be in ${language} language.\n\n`;
    
    // Add specific instructions based on exercise type
    switch (exerciseType) {
      case 'multiple-choice':
        prompt += `For each question, provide 4 options with exactly one correct answer. Format as JSON with question, options array, and correctAnswer fields.\n`;
        break;
      case 'open-ended':
        prompt += `For each question, provide the question, any necessary context information, and a model answer or grading rubric. Format as JSON.\n`;
        break;
      case 'fill-in-the-blank':
        prompt += `For each question, provide a sentence or paragraph with blanks marked as [BLANK], and the correct answers. Format as JSON with text and answers fields.\n`;
        break;
      case 'matching':
        prompt += `Provide two columns of items to be matched. Format as JSON with leftItems and rightItems arrays, and a matches array showing the correct pairs.\n`;
        break;
      default:
        prompt += `Provide clear, well-structured questions and corresponding answers. Format as JSON.\n`;
    }
    
    prompt += `\nReturn the exercises in a JSON format ONLY, with no additional text, formatted as:
{
  "exercises": [
    {
      "id": 1,
      "question": "Question text here",
      // other fields as appropriate for the exercise type
    },
    // more exercises
  ]
}`;
    
    return prompt;
  }

  /**
   * Parse the AI response into structured exercise data
   */
  parseExerciseResponse(content, exerciseType) {
    try {
      // Extract JSON from the response (in case there's any surrounding text)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                       content.match(/```\n([\s\S]*?)\n```/) || 
                       [null, content];
      
      const jsonContent = jsonMatch[1] || content;
      const data = JSON.parse(jsonContent);
      
      // Validate the exercise structure based on type
      this.validateExercises(data.exercises, exerciseType);
      
      return data;
    } catch (error) {
      console.error('====== ERROR PARSING EXERCISE RESPONSE ======');
      console.error('Original content from OpenAI:');
      console.error(content);
      console.error('Error details:', error.message);
      console.error('Exercise type:', exerciseType);
      console.error('Stack trace:', error.stack);
      console.error('==========================================');
      
      // Try to salvage what we can from the response
      try {
        // Look for any JSON-like structures in the content
        const possibleJson = content.match(/\{[\s\S]*\}/g);
        if (possibleJson && possibleJson.length > 0) {
          console.log('Attempting to parse possible JSON fragment:', possibleJson[0]);
          const data = JSON.parse(possibleJson[0]);
          console.log('Successfully parsed partial JSON');
          return data;
        }
      } catch (secondaryError) {
        console.error('Failed to salvage partial JSON:', secondaryError.message);
      }
      
      throw new Error('Failed to parse AI-generated exercises. Raw response format was invalid.');
    }
  }

  /**
   * Validate the structure of generated exercises
   */
  validateExercises(exercises, exerciseType) {
    if (!Array.isArray(exercises)) {
      throw new Error('Generated data is not a valid array of exercises');
    }
    
    // Validate each exercise based on type
    exercises.forEach((exercise, index) => {
      if (!exercise.question) {
        throw new Error(`Exercise ${index + 1} is missing a question`);
      }
      
      switch (exerciseType) {
        case 'multiple-choice':
          if (!Array.isArray(exercise.options) || exercise.options.length < 2) {
            throw new Error(`Exercise ${index + 1} has invalid options`);
          }
          if (!exercise.correctAnswer && exercise.correctAnswer !== 0) {
            throw new Error(`Exercise ${index + 1} is missing a correct answer`);
          }
          break;
        case 'fill-in-the-blank':
          if (!exercise.text || !Array.isArray(exercise.answers)) {
            throw new Error(`Exercise ${index + 1} has an invalid format for fill-in-the-blank`);
          }
          break;
        case 'matching':
          if (!Array.isArray(exercise.leftItems) || !Array.isArray(exercise.rightItems) || !Array.isArray(exercise.matches)) {
            throw new Error(`Exercise ${index + 1} has an invalid format for matching exercise`);
          }
          break;
      }
    });
  }

  /**
   * Grade a student's submission against an AI-generated model answer
   */
  async gradeSubmission(submission, exercise) {
    try {
      // Build a prompt that compares the student's answer with the model answer
      const prompt = `
        You are an educational assistant grading a student's work.
        
        Exercise question: "${exercise.question}"
        ${exercise.correctAnswer ? `Model answer: "${exercise.correctAnswer}"` : ''}
        Student's answer: "${submission.answer}"
        
        Evaluate the student's answer and provide:
        1. A score from 0-100
        2. Specific feedback on what was correct
        3. Specific feedback on what could be improved
        4. A corrected version of the answer if needed
        
        Format your response as JSON only:
        {
          "score": number,
          "feedback": "detailed feedback",
          "strengths": ["point 1", "point 2"],
          "improvements": ["point 1", "point 2"],
          "correctedAnswer": "corrected version if needed"
        }
      `;
      
      const response = await this.client.post('/chat/completions', {
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an experienced teacher who grades student work fairly and provides constructive feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });
      
      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                       content.match(/```\n([\s\S]*?)\n```/) || 
                       [null, content];
      
      return JSON.parse(jsonMatch[1] || content);
    } catch (error) {
      console.error('====== ERROR GRADING SUBMISSION ======');
      console.error('Submission ID:', submission._id);
      console.error('Exercise ID:', exercise._id);
      
      if (error.response) {
        // OpenAI API responded with an error
        console.error('OpenAI API Error Status:', error.response.status);
        console.error('OpenAI API Error Data:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received from OpenAI API');
      } else {
        // Error in setting up the request
        console.error('Error setting up the request:', error.message);
      }
      
      // Log the full error with stack trace
      console.error('Full error:', error);
      console.error('Stack trace:', error.stack);
      console.error('====================================');
      
      throw new Error(`Failed to grade submission: ${error.message}`);
    }
  }
}

module.exports = new AIService();
