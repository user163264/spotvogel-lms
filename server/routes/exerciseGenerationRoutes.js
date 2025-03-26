const express = require('express');
const router = express.Router();
const exerciseGenerationController = require('../controllers/exerciseGenerationController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Routes for AI-based exercise generation
 */

// Generate exercises using AI
// POST /api/generate/exercises
router.post('/exercises', authMiddleware.optionalJwt, exerciseGenerationController.generateExercises);

// Save a generated exercise
// POST /api/generate/save
router.post('/save', authMiddleware.requireJwt, exerciseGenerationController.saveGeneratedExercise);

// Create a template from an existing exercise
// POST /api/generate/create-template
router.post('/create-template', authMiddleware.requireJwt, exerciseGenerationController.createTemplateFromExercise);

// Grade a submission using AI
// POST /api/generate/grade/:submissionId
router.post('/grade/:submissionId', authMiddleware.requireJwt, exerciseGenerationController.gradeSubmission);

module.exports = router;
