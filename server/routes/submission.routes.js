const express = require('express');
const router = express.Router();
const { 
  getAllSubmissions, 
  getSubmissionById, 
  createSubmission, 
  updateSubmission, 
  getMySubmissions,
  getSubmissionsByExercise
} = require('../controllers/submission.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Routes
router.get('/', protect, authorize('teacher', 'admin'), getAllSubmissions);
router.get('/my', protect, getMySubmissions);
router.get('/exercise/:exerciseId', protect, getSubmissionsByExercise);
router.get('/:id', protect, getSubmissionById);
router.post('/', protect, createSubmission);
router.put('/:id', protect, updateSubmission);

module.exports = router;
