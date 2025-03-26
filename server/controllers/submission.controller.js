const Submission = require('../models/Submission');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Teacher or Admin
exports.getAllSubmissions = async (req, res) => {
  try {
    // Filter options
    let query = {};
    
    if (req.query.exercise) {
      query.exercise = req.query.exercise;
    }
    
    if (req.query.student) {
      query.student = req.query.student;
    }
    
    // If teacher, only show submissions for exercises they created
    if (req.user.role === 'teacher') {
      const exercises = await Exercise.find({ creator: req.user._id }).select('_id');
      const exerciseIds = exercises.map(ex => ex._id);
      query.exercise = { $in: exerciseIds };
    }

    const submissions = await Submission.find(query)
      .populate('student', 'name email')
      .populate({
        path: 'exercise',
        select: 'title type subject',
        populate: {
          path: 'creator',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get submissions by the logged-in student
// @route   GET /api/submissions/my
// @access  Private
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate({
        path: 'exercise',
        select: 'title type subject',
        populate: {
          path: 'creator',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get submissions for a specific exercise
// @route   GET /api/submissions/exercise/:exerciseId
// @access  Private
exports.getSubmissionsByExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.exerciseId);
    
    if (!exercise) {
      return res.status(404).json({
        message: 'Exercise not found'
      });
    }
    
    // Check authorization
    if (exercise.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      if (req.user.role !== 'student') {
        return res.status(403).json({
          message: 'Not authorized to view these submissions'
        });
      } else {
        // Students can only see their own submissions
        const submissions = await Submission.find({
          exercise: req.params.exerciseId,
          student: req.user._id
        })
          .populate('student', 'name email')
          .sort({ createdAt: -1 });
        
        return res.json(submissions);
      }
    }
    
    // For teachers/admins, show all submissions for this exercise
    const submissions = await Submission.find({ exercise: req.params.exerciseId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'name email')
      .populate({
        path: 'exercise',
        populate: {
          path: 'creator',
          select: 'name email'
        }
      });
    
    if (!submission) {
      return res.status(404).json({
        message: 'Submission not found'
      });
    }
    
    // Check authorization
    if (
      submission.student._id.toString() !== req.user._id.toString() && // Not the student who submitted
      submission.exercise.creator._id.toString() !== req.user._id.toString() && // Not the exercise creator
      req.user.role !== 'admin' // Not an admin
    ) {
      return res.status(403).json({
        message: 'Not authorized to view this submission'
      });
    }
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Private
exports.createSubmission = async (req, res) => {
  try {
    const { exerciseId, answers, timeSpent } = req.body;
    
    // Validate exercise exists
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({
        message: 'Exercise not found'
      });
    }
    
    // Check if user already submitted this exercise (to prevent duplicates)
    const existingSubmission = await Submission.findOne({
      student: req.user._id,
      exercise: exerciseId
    });
    
    if (existingSubmission) {
      return res.status(400).json({
        message: 'You have already submitted this exercise',
        submission: existingSubmission
      });
    }
    
    // Calculate score if possible (for auto-gradable exercise types)
    let score = 0;
    let maxScore = 0;
    let percentage = 0;
    let autoGraded = false;
    
    if (['multiple-choice', 'matching', 'fill-in-blanks'].includes(exercise.type)) {
      autoGraded = true;
      
      // Process answers and calculate score
      const processedAnswers = answers.map(answer => {
        const question = exercise.questions[answer.questionIndex];
        const isCorrect = 
          question && 
          ((Array.isArray(question.correctAnswer) && 
            Array.isArray(answer.answer) && 
            question.correctAnswer.length === answer.answer.length && 
            question.correctAnswer.every((val, idx) => val === answer.answer[idx])) || 
           (!Array.isArray(question.correctAnswer) && 
            question.correctAnswer === answer.answer));
        
        if (isCorrect) {
          score += (question.points || 1);
        }
        
        maxScore += (question.points || 1);
        
        return {
          ...answer,
          isCorrect,
          feedback: isCorrect ? 'Correct!' : 'Incorrect'
        };
      });
      
      // Calculate percentage
      percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      
      // Create the submission
      const submission = await Submission.create({
        student: req.user._id,
        exercise: exerciseId,
        answers: processedAnswers,
        score,
        maxScore,
        percentage,
        timeSpent,
        autoGraded
      });
      
      res.status(201).json(submission);
    } else {
      // For non-auto-gradable exercises
      // Create the submission without scoring
      const submission = await Submission.create({
        student: req.user._id,
        exercise: exerciseId,
        answers: answers.map(answer => ({
          ...answer,
          isCorrect: null,
          feedback: ''
        })),
        timeSpent,
        autoGraded: false
      });
      
      res.status(201).json(submission);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update a submission (for teacher grading/feedback)
// @route   PUT /api/submissions/:id
// @access  Private
exports.updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        message: 'Submission not found'
      });
    }
    
    const exercise = await Exercise.findById(submission.exercise);
    
    // Check authorization - only the exercise creator or admin can update submissions
    if (exercise.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to update this submission'
      });
    }
    
    const { answers, score, maxScore, percentage, feedback } = req.body;
    
    // Update fields if provided
    if (answers) {
      submission.answers = answers;
    }
    
    if (score !== undefined) {
      submission.score = score;
    }
    
    if (maxScore !== undefined) {
      submission.maxScore = maxScore;
    }
    
    if (percentage !== undefined) {
      submission.percentage = percentage;
    }
    
    if (feedback) {
      submission.feedback = feedback;
    }
    
    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
