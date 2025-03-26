const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    trim: true
  },
  gradeLevel: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    enum: ['en', 'nl', 'fr'],
    default: 'en'
  },
  // The structure of the lesson/template
  components: [{
    type: {
      type: String,
      enum: ['introduction', 'content', 'exercise', 'assessment', 'conclusion'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    duration: {
      type: Number, // in minutes
    },
    exerciseType: {
      type: String,
      enum: ['multiple-choice', 'fill-in-blanks', 'matching', 'short-answer', 'comprehension', 'open-ended', null]
    },
    promptTemplate: {
      type: String // Template for AI to generate content
    },
    content: {
      type: String // Actual content for non-AI components
    },
    order: {
      type: Number,
      required: true
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Template = mongoose.model('Template', TemplateSchema);

module.exports = Template;
