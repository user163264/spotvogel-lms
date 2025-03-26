const express = require('express');
const router = express.Router();
const { 
  getAllExercises, 
  getExerciseById, 
  createExercise, 
  updateExercise, 
  deleteExercise,
  generateExerciseWithAI,
  getMyExercises,
  saveExerciseDraft
} = require('../controllers/exercise.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Routes
router.get('/', protect, getAllExercises);
router.get('/my', protect, getMyExercises);
router.get('/:id', protect, getExerciseById);
router.post('/', protect, authorize('teacher', 'admin'), createExercise);
router.post('/drafts', protect, authorize('teacher', 'admin'), saveExerciseDraft);
router.post('/generate', protect, authorize('teacher', 'admin'), generateExerciseWithAI);
router.put('/:id', protect, updateExercise);
router.delete('/:id', protect, deleteExercise);

module.exports = router;
