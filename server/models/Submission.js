const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    answer: {
      type: mongoose.Schema.Types.Mixed, // Could be String, Number, or Array depending on exercise type
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: null // null means not yet evaluated
    },
    feedback: {
      type: String
    }
  }],
  score: {
    type: Number
  },
  maxScore: {
    type: Number
  },
  percentage: {
    type: Number
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number // in seconds
  },
  feedback: {
    type: String
  },
  autoGraded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = Submission;
