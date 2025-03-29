/**
 * Exercise Routes
 * API endpoints for exercise management and generation
 */

import express from 'express';
import { body, param, validationResult } from 'express-validator';
import MatchingExerciseGenerator from '../services/MatchingExerciseGenerator.js';
import { authenticateToken, authorizeTeacher, authorizeStudent } from '../middleware/auth.js';
import { dbPool } from '../config/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug mode flag
const DEBUG = process.env.DEBUG_MODE === 'true';

const router = express.Router();

// Initialize the exercise generator with API key from environment variables
const generator = new MatchingExerciseGenerator(process.env.OPENAI_API_KEY);

/**
 * Helper function to log API requests
 */
const logRequest = (req, label) => {
  if (DEBUG) {
    console.log(`\n===== ${label} =====`);
    console.log('TIME:', new Date().toISOString());
    console.log('PATH:', req.path);
    console.log('METHOD:', req.method);
    console.log('USER ID:', req.user?.id || 'Not authenticated');
    console.log('BODY:', JSON.stringify(req.body, null, 2));
    console.log('PARAMS:', JSON.stringify(req.params, null, 2));
    console.log('QUERY:', JSON.stringify(req.query, null, 2));
    console.log('========================\n');
  }
};

/**
 * GET /api/exercises
 * Get all exercises (for admins) or exercises for current teacher
 * Requires authentication
 */
router.get('/', authenticateToken, async (req, res) => {
  logRequest(req, 'GET ALL EXERCISES');
  
  let connection;
  try {
    connection = await dbPool.getConnection();
    
    // Different queries based on role
    let query;
    let params = [];
    
    if (req.user.role === 'admin') {
      // Admins can see all exercises
      query = `
        SELECT e.*, l.title as lesson_title, u.username as creator_name
        FROM exercises e
        JOIN lessons l ON e.lesson_id = l.lesson_id
        JOIN users u ON l.creator_id = u.user_id
        ORDER BY e.created_at DESC
      `;
    } else if (req.user.role === 'teacher') {
      // Teachers can see only their own exercises
      query = `
        SELECT e.*, l.title as lesson_title, u.username as creator_name
        FROM exercises e
        JOIN lessons l ON e.lesson_id = l.lesson_id
        JOIN users u ON l.creator_id = u.user_id
        WHERE l.creator_id = ?
        ORDER BY e.created_at DESC
      `;
      params.push(req.user.id);
    } else {
      // Students can see only published exercises
      query = `
        SELECT e.*, l.title as lesson_title
        FROM exercises e
        JOIN lessons l ON e.lesson_id = l.lesson_id
        WHERE l.is_published = true
        ORDER BY e.created_at DESC
      `;
    }
    
    if (DEBUG) {
      console.log('\n----- EXERCISES QUERY -----');
      console.log('SQL:', query);
      console.log('PARAMS:', params);
      console.log('---------------------------\n');
    }
    
    const [exercises] = await connection.query(query, params);
    
    if (DEBUG) {
      console.log('\n----- EXERCISES RESULT -----');
      console.log('COUNT:', exercises.length);
      console.log('----------------------------\n');
    }
    
    res.status(200).json({
      success: true,
      exercises: exercises,
      count: exercises.length
    });
  } catch (error) {
    console.error('\n===== ERROR GETTING EXERCISES =====');
    console.error('ERROR TYPE:', error.name);
    console.error('MESSAGE:', error.message);
    console.error('STACK:', error.stack);
    console.error('===================================\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve exercises',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/**
 * GET /api/exercises/matching/:id
 * Get details of a specific matching exercise
 * Requires authentication
 */
router.get(
  '/matching/:id',
  authenticateToken,
  [
    param('id').isInt().withMessage('Exercise ID must be an integer')
  ],
  async (req, res) => {
    logRequest(req, 'GET MATCHING EXERCISE');
    
    // Validate request parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (DEBUG) {
        console.log('\n----- VALIDATION ERRORS -----');
        console.log(JSON.stringify(errors.array(), null, 2));
        console.log('-----------------------------\n');
      }
      
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const exerciseId = req.params.id;
    let connection;
    
    try {
      connection = await dbPool.getConnection();
      
      // 1. Get basic exercise data
      const [exerciseRows] = await connection.query(
        `SELECT e.exercise_id, e.lesson_id, e.exercise_type, e.question, 
                e.max_score, e.grading_type, e.order_index, l.title as lesson_title,
                l.creator_id
         FROM exercises e
         JOIN lessons l ON e.lesson_id = l.lesson_id
         WHERE e.exercise_id = ? AND e.exercise_type = 'matching_words'`,
        [exerciseId]
      );
      
      if (DEBUG) {
        console.log('\n----- EXERCISE BASIC DATA -----');
        console.log('ROWS FOUND:', exerciseRows.length);
        if (exerciseRows.length > 0) {
          console.log('DATA:', JSON.stringify(exerciseRows[0], null, 2));
        }
        console.log('------------------------------\n');
      }
      
      if (exerciseRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Matching exercise not found'
        });
      }
      
      const exercise = exerciseRows[0];
      
      // Check access permissions (admins can access all, teachers only their own)
      if (req.user.role === 'teacher' && 
          exercise.creator_id !== req.user.id && 
          req.user.role !== 'admin') {
        if (DEBUG) {
          console.log('\n----- ACCESS DENIED -----');
          console.log('USER ID:', req.user.id);
          console.log('USER ROLE:', req.user.role);
          console.log('CREATOR ID:', exercise.creator_id);
          console.log('-------------------------\n');
        }
        
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own exercises'
        });
      }
      
      // 2. Get matching exercise ID
      const [matchingExerciseRows] = await connection.query(
        'SELECT matching_exercise_id FROM matching_words_exercises WHERE exercise_id = ?',
        [exerciseId]
      );
      
      if (matchingExerciseRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Matching exercise details not found'
        });
      }
      
      const matchingExerciseId = matchingExerciseRows[0].matching_exercise_id;
      
      if (DEBUG) {
        console.log('\n----- MATCHING EXERCISE ID -----');
        console.log('ID:', matchingExerciseId);
        console.log('-------------------------------\n');
      }
      
      // 3. Get word bank items
      const [wordBankItems] = await connection.query(
        'SELECT item_id, content, display_order FROM word_bank_items WHERE matching_exercise_id = ? ORDER BY display_order',
        [matchingExerciseId]
      );
      
      if (DEBUG) {
        console.log('\n----- WORD BANK ITEMS -----');
        console.log('COUNT:', wordBankItems.length);
        console.log('ITEMS:', JSON.stringify(wordBankItems, null, 2));
        console.log('---------------------------\n');
      }
      
      // 4. Get match options
      const [matchOptions] = await connection.query(
        'SELECT option_id, content, display_order FROM match_options WHERE matching_exercise_id = ? ORDER BY display_order',
        [matchingExerciseId]
      );
      
      if (DEBUG) {
        console.log('\n----- MATCH OPTIONS -----');
        console.log('COUNT:', matchOptions.length);
        console.log('OPTIONS:', JSON.stringify(matchOptions, null, 2));
        console.log('------------------------\n');
      }
      
      // 5. Get correct answers mapping
      const [correctAnswers] = await connection.query(
        `SELECT ca.word_bank_item_id, ca.match_option_id, 
                wbi.content AS word_bank_content, mo.content AS match_option_content
         FROM correct_answers ca
         JOIN word_bank_items wbi ON ca.word_bank_item_id = wbi.item_id
         JOIN match_options mo ON ca.match_option_id = mo.option_id
         WHERE ca.matching_exercise_id = ?`,
        [matchingExerciseId]
      );
      
      if (DEBUG) {
        console.log('\n----- CORRECT ANSWERS -----');
        console.log('COUNT:', correctAnswers.length);
        console.log('MAPPINGS:', JSON.stringify(correctAnswers, null, 2));
        console.log('---------------------------\n');
      }
      
      // 6. Build correct answer mapping
      const correctAnswerMap = {};
      for (const answer of correctAnswers) {
        correctAnswerMap[answer.word_bank_content] = answer.match_option_content;
      }
      
      // 7. Format the response
      const formattedExercise = {
        ...exercise,
        word_bank: wordBankItems.map(item => item.content),
        match_options: matchOptions.map(option => option.content),
        correct_answer: correctAnswerMap
      };
      
      if (DEBUG) {
        console.log('\n----- FORMATTED EXERCISE RESPONSE -----');
        console.log(JSON.stringify(formattedExercise, null, 2));
        console.log('--------------------------------------\n');
      }
      
      res.status(200).json({
        success: true,
        exercise: formattedExercise
      });
    } catch (error) {
      console.error('\n===== ERROR RETRIEVING MATCHING EXERCISE =====');
      console.error('ERROR TYPE:', error.name);
      console.error('MESSAGE:', error.message);
      console.error('STACK:', error.stack);
      console.error('===========================================\n');
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve exercise',
        error: error.message
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

/**
 * POST /api/exercises/generate/matching
 * Generates a matching exercise from lesson content
 * Requires authentication and teacher role
 */
router.post(
  '/generate/matching',
  authenticateToken,
  authorizeTeacher,
  [
    body('lessonId').isInt().withMessage('Lesson ID must be an integer'),
    body('lessonContent').isString().notEmpty().withMessage('Lesson content is required'),
    body('options').optional().isObject().withMessage('Options must be an object'),
    body('options.numberOfPairs').optional().isInt({ min: 2, max: 10 }).withMessage('Number of pairs must be between 2 and 10'),
    body('options.difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
    body('options.language').optional().isString().withMessage('Language must be a string'),
  ],
  async (req, res) => {
    logRequest(req, 'GENERATE MATCHING EXERCISE');
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (DEBUG) {
        console.log('\n----- VALIDATION ERRORS -----');
        console.log(JSON.stringify(errors.array(), null, 2));
        console.log('-----------------------------\n');
      }
      
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { lessonId, lessonContent, options = {} } = req.body;
    
    let connection;
    try {
      // Verify the lesson exists and belongs to the teacher
      connection = await dbPool.getConnection();
      
      const [lessons] = await connection.query(
        'SELECT * FROM lessons WHERE lesson_id = ? AND creator_id = ?',
        [lessonId, req.user.id]
      );
      
      if (lessons.length === 0) {
        if (DEBUG) {
          console.log('\n----- LESSON ACCESS ERROR -----');
          console.log('LESSON ID:', lessonId);
          console.log('USER ID:', req.user.id);
          console.log('------------------------------\n');
        }
        
        return res.status(404).json({
          success: false,
          message: 'Lesson not found or you do not have access to it'
        });
      }
      
      // Generate the exercise using the AI service
      const startTime = Date.now();
      const exerciseData = await generator.generateMatchingExercise(lessonContent, options);
      const generationTime = Date.now() - startTime;
      
      if (DEBUG) {
        console.log('\n----- EXERCISE GENERATION COMPLETED -----');
        console.log('GENERATION TIME:', `${generationTime}ms`);
        console.log('----------------------------------------\n');
      }
      
      // Return the generated exercise without saving it yet
      res.status(200).json({
        success: true,
        exercise: exerciseData,
        message: 'Exercise generated successfully'
      });
    } catch (error) {
      console.error('\n===== ERROR GENERATING MATCHING EXERCISE =====');
      console.error('ERROR TYPE:', error.name);
      console.error('MESSAGE:', error.message);
      console.error('STACK:', error.stack);
      console.error('===========================================\n');
      
      res.status(500).json({
        success: false,
        message: 'Failed to generate exercise',
        error: error.message
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

/**
 * POST /api/exercises/save/matching
 * Saves a generated or manually created matching exercise
 * Requires authentication and teacher role
 */
router.post(
  '/save/matching',
  authenticateToken,
  authorizeTeacher,
  [
    body('lessonId').isInt().withMessage('Lesson ID must be an integer'),
    body('exercise').isObject().withMessage('Exercise data is required'),
    body('exercise.exercise_type').equals('matching_words').withMessage('Exercise type must be matching_words'),
    body('exercise.question').isString().notEmpty().withMessage('Question is required'),
    body('exercise.word_bank').isArray({ min: 2 }).withMessage('Word bank must have at least 2 items'),
    body('exercise.match_options').isArray({ min: 2 }).withMessage('Match options must have at least 2 items'),
    body('exercise.correct_answer').isObject().withMessage('Correct answer mapping is required'),
    body('exercise.max_score').isInt({ min: 1 }).withMessage('Max score must be a positive integer'),
    body('exercise.grading_type').equals('auto').withMessage('Grading type must be auto for matching exercises'),
    body('orderIndex').optional().isInt({ min: 0 }).withMessage('Order index must be a non-negative integer')
  ],
  async (req, res) => {
    logRequest(req, 'SAVE MATCHING EXERCISE');
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (DEBUG) {
        console.log('\n----- VALIDATION ERRORS -----');
        console.log(JSON.stringify(errors.array(), null, 2));
        console.log('-----------------------------\n');
      }
      
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { lessonId, exercise, orderIndex = 0 } = req.body;
    
    let connection;
    try {
      // Get database connection
      connection = await dbPool.getConnection();
      
      // Verify the lesson exists and belongs to the teacher
      const [lessons] = await connection.query(
        'SELECT * FROM lessons WHERE lesson_id = ? AND creator_id = ?',
        [lessonId, req.user.id]
      );
      
      if (lessons.length === 0) {
        if (DEBUG) {
          console.log('\n----- LESSON ACCESS ERROR -----');
          console.log('LESSON ID:', lessonId);
          console.log('USER ID:', req.user.id);
          console.log('------------------------------\n');
        }
        
        return res.status(404).json({
          success: false,
          message: 'Lesson not found or you do not have access to it'
        });
      }
      
      // Start transaction
      await connection.beginTransaction();
      
      if (DEBUG) {
        console.log('\n----- TRANSACTION STARTED -----');
        console.log('TIME:', new Date().toISOString());
        console.log('-----------------------------\n');
      }
      
      // Save the exercise using the generator service
      const exerciseId = await generator.saveExerciseToDatabase(exercise, lessonId, connection);
      
      // Commit the transaction
      await connection.commit();
      
      if (DEBUG) {
        console.log('\n----- TRANSACTION COMMITTED -----');
        console.log('TIME:', new Date().toISOString());
        console.log('-------------------------------\n');
      }
      
      res.status(201).json({
        success: true,
        exerciseId,
        message: 'Exercise saved successfully'
      });
    } catch (error) {
      // Rollback transaction on error
      if (connection) {
        await connection.rollback();
        
        if (DEBUG) {
          console.log('\n----- TRANSACTION ROLLED BACK -----');
          console.log('TIME:', new Date().toISOString());
          console.log('---------------------------------\n');
        }
      }
      
      console.error('\n===== ERROR SAVING MATCHING EXERCISE =====');
      console.error('ERROR TYPE:', error.name);
      console.error('MESSAGE:', error.message);
      console.error('STACK:', error.stack);
      console.error('========================================\n');
      
      res.status(500).json({
        success: false,
        message: 'Failed to save exercise',
        error: error.message
      });
    } finally {
      // Release connection back to pool
      if (connection) {
        connection.release();
      }
    }
  }
);

/**
 * POST /api/exercises/submit/matching
 * Handles student submission of a matching exercise
 * Requires authentication
 */
router.post(
  '/submit/matching',
  authenticateToken,
  [
    body('exerciseId').isInt().withMessage('Exercise ID must be an integer'),
    body('answers').isObject().withMessage('Answers must be an object mapping')
  ],
  async (req, res) => {
    logRequest(req, 'SUBMIT MATCHING EXERCISE');
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (DEBUG) {
        console.log('\n----- VALIDATION ERRORS -----');
        console.log(JSON.stringify(errors.array(), null, 2));
        console.log('-----------------------------\n');
      }
      
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { exerciseId, answers } = req.body;
    const studentId = req.user.id; // From auth middleware
    
    let connection;
    try {
      // Get database connection
      connection = await dbPool.getConnection();
      
      // Start transaction
      await connection.beginTransaction();
      
      if (DEBUG) {
        console.log('\n----- TRANSACTION STARTED -----');
        console.log('TIME:', new Date().toISOString());
        console.log('-----------------------------\n');
      }
      
      // Get exercise data to verify it exists and for scoring
      const [exerciseRows] = await connection.query(
        `SELECT e.exercise_id, e.max_score, m.matching_exercise_id
         FROM exercises e
         JOIN matching_words_exercises m ON e.exercise_id = m.exercise_id
         WHERE e.exercise_id = ?`,
        [exerciseId]
      );
      
      if (exerciseRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
      }
      
      const exercise = exerciseRows[0];
      const matchingExerciseId = exercise.matching_exercise_id;
      
      if (DEBUG) {
        console.log('\n----- EXERCISE FOUND -----');
        console.log('EXERCISE ID:', exercise.exercise_id);
        console.log('MATCHING EXERCISE ID:', matchingExerciseId);
        console.log('MAX SCORE:', exercise.max_score);
        console.log('-------------------------\n');
      }
      
      // Get correct answers for this exercise
      const [correctAnswers] = await connection.query(
        `SELECT wbi.content AS word_bank_content, mo.content AS match_option_content,
                wbi.item_id AS word_bank_item_id, mo.option_id AS match_option_id
         FROM correct_answers ca
         JOIN word_bank_items wbi ON ca.word_bank_item_id = wbi.item_id
         JOIN match_options mo ON ca.match_option_id = mo.option_id
         WHERE ca.matching_exercise_id = ?`,
        [matchingExerciseId]
      );
      
      if (DEBUG) {
        console.log('\n----- CORRECT ANSWERS FOUND -----');
        console.log('COUNT:', correctAnswers.length);
        console.log('CORRECT ANSWERS:', JSON.stringify(correctAnswers, null, 2));
        console.log('-------------------------------\n');
      }
      
      // Create a map of word bank content to correct match option content
      const correctAnswerMap = {};
      const wordBankItemMap = {}; // Maps content to item_id
      const matchOptionMap = {}; // Maps content to option_id
      
      for (const answer of correctAnswers) {
        correctAnswerMap[answer.word_bank_content] = answer.match_option_content;
        wordBankItemMap[answer.word_bank_content] = answer.word_bank_item_id;
        matchOptionMap[answer.match_option_content] = answer.match_option_id;
      }
      
      if (DEBUG) {
        console.log('\n----- STUDENT ANSWERS -----');
        console.log('SUBMITTED ANSWERS:', JSON.stringify(answers, null, 2));
        console.log('--------------------------\n');
      }
      
      // Grade the submission
      let score = 0;
      const correctMatches = [];
      const incorrectMatches = [];
      
      Object.keys(answers).forEach(wordBankContent => {
        const studentAnswer = answers[wordBankContent];
        const correctAnswer = correctAnswerMap[wordBankContent];
        
        if (studentAnswer === correctAnswer) {
          score++;
          correctMatches.push(wordBankContent);
          
          if (DEBUG) {
            console.log(`CORRECT MATCH: "${wordBankContent}" -> "${studentAnswer}"`);
          }
        } else {
          incorrectMatches.push({
            wordBankContent,
            studentAnswer,
            correctAnswer
          });
          
          if (DEBUG) {
            console.log(`INCORRECT MATCH: "${wordBankContent}" -> "${studentAnswer}" (should be "${correctAnswer}")`);
          }
        }
      });
      
      if (DEBUG) {
        console.log('\n----- GRADING RESULT -----');
        console.log('SCORE:', score);
        console.log('MAX SCORE:', exercise.max_score);
        console.log('PERCENTAGE:', `${(score / exercise.max_score) * 100}%`);
        console.log('CORRECT MATCHES:', correctMatches.length);
        console.log('INCORRECT MATCHES:', incorrectMatches.length);
        console.log('--------------------------\n');
      }
      
      // Check for existing attempts
      const [existingAttempts] = await connection.query(
        'SELECT attempt_id FROM student_attempts WHERE student_id = ? AND exercise_id = ?',
        [studentId, exerciseId]
      );
      
      let attemptId;
      
      if (existingAttempts.length > 0) {
        // Update existing attempt
        attemptId = existingAttempts[0].attempt_id;
        await connection.query(
          'UPDATE student_attempts SET score = ?, is_completed = TRUE, completion_time = NOW() WHERE attempt_id = ?',
          [score, attemptId]
        );
        
        if (DEBUG) {
          console.log('\n----- UPDATING EXISTING ATTEMPT -----');
          console.log('ATTEMPT ID:', attemptId);
          console.log('------------------------------------\n');
        }
        
        // Delete previous answers
        await connection.query(
          'DELETE FROM student_matching_answers WHERE attempt_id = ?',
          [attemptId]
        );
        
        if (DEBUG) {
          console.log('\n----- DELETED PREVIOUS ANSWERS -----');
          console.log('ATTEMPT ID:', attemptId);
          console.log('-----------------------------------\n');
        }
      } else {
        // Create new attempt
        const [attemptResult] = await connection.query(
          `INSERT INTO student_attempts 
           (student_id, exercise_id, score, max_score, is_completed, completion_time)
           VALUES (?, ?, ?, ?, TRUE, NOW())`,
          [studentId, exerciseId, score, exercise.max_score]
        );
        
        attemptId = attemptResult.insertId;
        
        if (DEBUG) {
          console.log('\n----- CREATED NEW ATTEMPT -----');
          console.log('ATTEMPT ID:', attemptId);
          console.log('------------------------------\n');
        }
      }
      
      // Save student answers
      for (const wordBankContent of Object.keys(answers)) {
        const studentAnswer = answers[wordBankContent];
        const wordBankItemId = wordBankItemMap[wordBankContent];
        const selectedMatchOptionId = matchOptionMap[studentAnswer];
        const isCorrect = studentAnswer === correctAnswerMap[wordBankContent];
        
        if (!wordBankItemId) {
          if (DEBUG) {
            console.error(`ERROR: Word bank item ID not found for content: ${wordBankContent}`);
          }
          continue;
        }
        
        if (!selectedMatchOptionId) {
          if (DEBUG) {
            console.error(`ERROR: Match option ID not found for content: ${studentAnswer}`);
          }
          continue;
        }
        
        await connection.query(
          `INSERT INTO student_matching_answers 
           (attempt_id, word_bank_item_id, selected_match_option_id, is_correct)
           VALUES (?, ?, ?, ?)`,
          [attemptId, wordBankItemId, selectedMatchOptionId, isCorrect]
        );
        
        if (DEBUG) {
          console.log('\n----- SAVED STUDENT ANSWER -----');
          console.log('WORD BANK ITEM:', wordBankContent);
          console.log('SELECTED MATCH:', studentAnswer);
          console.log('IS CORRECT:', isCorrect);
          console.log('-------------------------------\n');
        }
      }
      
      // Generate feedback
      const feedbackText = `You scored ${score} out of ${exercise.max_score}. You correctly matched ${correctMatches.length} items.`;
      
      await connection.query(
        `INSERT INTO exercise_feedback
         (attempt_id, feedback_text, is_auto_generated)
         VALUES (?, ?, TRUE)`,
        [attemptId, feedbackText]
      );
      
      if (DEBUG) {
        console.log('\n----- SAVED FEEDBACK -----');
        console.log('FEEDBACK TEXT:', feedbackText);
        console.log('--------------------------\n');
      }
      
      // Commit the transaction
      await connection.commit();
      
      if (DEBUG) {
        console.log('\n----- TRANSACTION COMMITTED -----');
        console.log('TIME:', new Date().toISOString());
        console.log('-------------------------------\n');
      }
      
      // Format the response
      const response = {
        success: true,
        score,
        maxScore: exercise.max_score,
        percentageScore: (score / exercise.max_score) * 100,
        correctMatches: correctMatches.map(item => ({
          item,
          match: correctAnswerMap[item]
        })),
        incorrectMatches: incorrectMatches.map(item => ({
          item: item.wordBankContent,
          yourAnswer: item.studentAnswer,
          correctAnswer: item.correctAnswer
        })),
        feedback: feedbackText
      };
      
      if (DEBUG) {
        console.log('\n----- RESPONSE -----');
        console.log(JSON.stringify(response, null, 2));
        console.log('--------------------\n');
      }
      
      res.status(200).json(response);
    } catch (error) {
      // Rollback transaction on error
      if (connection) {
        await connection.rollback();
        
        if (DEBUG) {
          console.log('\n----- TRANSACTION ROLLED BACK -----');
          console.log('TIME:', new Date().toISOString());
          console.log('---------------------------------\n');
        }
      }
      
      console.error('\n===== ERROR SUBMITTING MATCHING EXERCISE =====');
      console.error('ERROR TYPE:', error.name);
      console.error('MESSAGE:', error.message);
      console.error('STACK:', error.stack);
      console.error('============================================\n');
      
      res.status(500).json({
        success: false,
        message: 'Failed to submit exercise',
        error: error.message
      });
    } finally {
      // Release connection back to pool
      if (connection) {
        connection.release();
      }
    }
  }
);

export default router;
