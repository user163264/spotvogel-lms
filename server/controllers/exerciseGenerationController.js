const aiService = require('../services/aiService');
const Exercise = require('../models/Exercise'); // Assuming you have an Exercise model

/**
 * Controller for exercise generation and management
 */
class ExerciseGenerationController {
  /**
   * Generate exercises using AI
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateExercises(req, res) {
    try {
      const {
        subject,
        gradeLevel,
        topic,
        exerciseType,
        difficulty,
        count = 5,
        language = 'english'
      } = req.body;

      // Validate required fields
      if (!subject || !gradeLevel || !topic || !exerciseType || !difficulty) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }
      
      // Call AI service to generate exercises
      const generatedData = await aiService.generateExercises({
        subject,
        gradeLevel,
        topic,
        exerciseType,
        difficulty: parseInt(difficulty, 10),
        count: parseInt(count, 10),
        language
      });
      
      // If user is logged in, associate the exercise with their account
      if (req.user) {
        // Save exercises to database
        const savedExercises = [];
        
        for (const exercise of generatedData.exercises) {
          // Map the generated exercise to our database model
          const newExercise = new Exercise({
            createdBy: req.user._id,
            title: `${topic} - ${exerciseType}`,
            subject,
            gradeLevel,
            topic,
            type: exerciseType,
            difficulty,
            language,
            content: exercise,
            // Add any other fields your Exercise model requires
          });
          
          const savedExercise = await newExercise.save();
          savedExercises.push(savedExercise);
        }
        
        return res.status(201).json({
          success: true,
          message: 'Exercises generated and saved successfully',
          exercises: savedExercises
        });
      } else {
        // Just return the generated exercises without saving
        return res.status(200).json({
          success: true,
          message: 'Exercises generated successfully',
          exercises: generatedData.exercises
        });
      }
    } catch (error) {
      console.error('====== CONTROLLER ERROR: GENERATE EXERCISES ======');
      console.error('Request body:', JSON.stringify(req.body, null, 2));
      console.error('User:', req.user ? `ID: ${req.user._id}, Role: ${req.user.role}` : 'Not authenticated');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.response) {
        // This might be an error from an API call
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      // Check if this might be an OpenAI API key issue
      if (error.message.includes('API key') || 
          error.message.includes('authentication') || 
          (error.response && error.response.status === 401)) {
        console.error('POSSIBLE API KEY ISSUE - Please check OPENAI_API_KEY in .env file');
      }
      
      console.error('================================================');
      
      return res.status(500).json({
        success: false,
        message: 'Failed to generate exercises',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          response: error.response ? {
            status: error.response.status,
            data: error.response.data
          } : null
        } : undefined
      });
    }
  }

  /**
   * Save an exercise that was previously generated
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async saveGeneratedExercise(req, res) {
    try {
      const { exerciseData, title } = req.body;
      
      if (!exerciseData || !title) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to save exercises'
        });
      }
      
      // Create new exercise
      const newExercise = new Exercise({
        createdBy: req.user._id,
        title,
        subject: exerciseData.subject,
        gradeLevel: exerciseData.gradeLevel,
        topic: exerciseData.topic,
        type: exerciseData.exerciseType,
        difficulty: exerciseData.difficulty,
        language: exerciseData.language,
        content: exerciseData.content,
        // Add any other fields your Exercise model requires
      });
      
      const savedExercise = await newExercise.save();
      
      return res.status(201).json({
        success: true,
        message: 'Exercise saved successfully',
        exercise: savedExercise
      });
    } catch (error) {
      console.error('====== CONTROLLER ERROR: SAVE GENERATED EXERCISE ======');
      console.error('User ID:', req.user ? req.user._id : 'Unknown');
      console.error('Exercise title:', req.body.title);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('==================================================');
      
      return res.status(500).json({
        success: false,
        message: 'Failed to save exercise',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined
      });
    }
  }

  /**
   * Create template from existing exercise
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createTemplateFromExercise(req, res) {
    try {
      const { exerciseId, templateName, templateDescription } = req.body;
      
      if (!exerciseId || !templateName) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to create templates'
        });
      }
      
      // Find the exercise
      const exercise = await Exercise.findById(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
      }
      
      // Make sure the user owns the exercise or is an admin
      if (exercise.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to create template from this exercise'
        });
      }
      
      // Create template
      // Note: You'll need to implement the Template model
      const Template = require('../models/Template');
      
      const newTemplate = new Template({
        createdBy: req.user._id,
        name: templateName,
        description: templateDescription || `Template based on ${exercise.title}`,
        subject: exercise.subject,
        gradeLevel: exercise.gradeLevel,
        exerciseType: exercise.type,
        difficulty: exercise.difficulty,
        language: exercise.language,
        structure: {
          topic: exercise.topic,
          exerciseType: exercise.type,
          parameters: {
            difficulty: exercise.difficulty,
            count: 5  // Default value
          }
        }
      });
      
      const savedTemplate = await newTemplate.save();
      
      return res.status(201).json({
        success: true,
        message: 'Template created successfully',
        template: savedTemplate
      });
    } catch (error) {
      console.error('====== CONTROLLER ERROR: CREATE TEMPLATE FROM EXERCISE ======');
      console.error('User ID:', req.user ? req.user._id : 'Unknown');
      console.error('Exercise ID:', req.body.exerciseId);
      console.error('Template name:', req.body.templateName);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('=========================================================');
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create template',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined
      });
    }
  }

  /**
   * Grade a submission using AI
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async gradeSubmission(req, res) {
    try {
      const { submissionId } = req.params;
      
      if (!submissionId) {
        return res.status(400).json({
          success: false,
          message: 'Missing submission ID'
        });
      }
      
      // Find the submission
      const Submission = require('../models/Submission');
      const submission = await Submission.findById(submissionId).populate('exercise');
      
      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }
      
      // Check if the user has permission to grade this submission
      const exercise = submission.exercise;
      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: 'Associated exercise not found'
        });
      }
      
      if (exercise.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to grade this submission'
        });
      }
      
      // Call AI service to grade the submission
      const gradeResult = await aiService.gradeSubmission(submission, exercise);
      
      // Update the submission with the grade
      submission.grade = gradeResult.score;
      submission.feedback = gradeResult.feedback;
      submission.strengths = gradeResult.strengths;
      submission.improvements = gradeResult.improvements;
      submission.gradedBy = req.user._id;
      submission.gradedAt = Date.now();
      submission.isGraded = true;
      
      const updatedSubmission = await submission.save();
      
      return res.status(200).json({
        success: true,
        message: 'Submission graded successfully',
        submission: updatedSubmission
      });
    } catch (error) {
      console.error('====== CONTROLLER ERROR: GRADE SUBMISSION ======');
      console.error('User ID:', req.user ? req.user._id : 'Unknown');
      console.error('Submission ID:', req.params.submissionId);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.response) {
        // This might be an error from an API call
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      console.error('=============================================');
      
      return res.status(500).json({
        success: false,
        message: 'Failed to grade submission',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          response: error.response ? {
            status: error.response.status,
            data: error.response.data
          } : null
        } : undefined
      });
    }
  }
}

module.exports = new ExerciseGenerationController();
