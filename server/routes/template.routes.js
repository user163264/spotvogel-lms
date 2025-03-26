const express = require('express');
const router = express.Router();
const { 
  getAllTemplates, 
  getTemplateById, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  getMyTemplates 
} = require('../controllers/template.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Routes
router.get('/', protect, getAllTemplates);
router.get('/my', protect, getMyTemplates);
router.get('/:id', protect, getTemplateById);
router.post('/', protect, authorize('teacher', 'admin'), createTemplate);
router.put('/:id', protect, updateTemplate);
router.delete('/:id', protect, deleteTemplate);

module.exports = router;
