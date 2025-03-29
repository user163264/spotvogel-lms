const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  content: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'fill-in-the-blank', 'essay', 'matching', 'custom'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'nl', 'fr'],
    required: true
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  generationPrompt: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
ExerciseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
