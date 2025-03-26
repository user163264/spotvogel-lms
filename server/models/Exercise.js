const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: false
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade level is required'],
    trim: true
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: {
    type: Number, // in minutes
    required: [true, 'Time limit is required'],
    min: [1, 'Time limit must be at least 1 minute'],
    max: [180, 'Time limit cannot be more than 3 hours']
  },
  questions: [{
    type: {
      type: String,
      enum: ['multiple-choice', 'checkbox', 'true-false', 'text', 'numeric'],
      required: true
    },
    prompt: {
      type: String,
      required: true
    },
    options: [{
      id: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    correctAnswer: {
      type: String // For text and numeric questions
    },
    points: {
      type: Number,
      default: 1,
      min: 1,
      max: 100
    },
    feedback: {
      correct: {
        type: String
      },
      incorrect: {
        type: String
      }
    }
  }],
  tags: {
    type: [String],
    default: []
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  aiGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;