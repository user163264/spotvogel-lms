const Exercise = require('../models/Exercise');
const asyncHandler = require('express-async-handler');
const openai = require('../config/openai');

/**
 * @desc    Get all exercises
 * @route   GET /api/exercises
 * @access  Private
 */
const getAllExercises = asyncHandler(async (req, res) => {
  const { subject, grade, difficulty, search } = req.query;
  
  // Build query
  const query = {};
  
  // Filter by subject
  if (subject) {
    query.subject = subject;
  }
  
  // Filter by grade
  if (grade) {
    query.grade = grade;
  }
  
  // Filter by difficulty
  if (difficulty) {
    query.difficultyLevel = difficulty;
  }
  
  // Filter by search term in title or description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Add filter for published exercises (students can only see published exercises)
  if (req.user.role === 'student') {
    query.isPublished = true;
  }
  
  const exercises = await Exercise.find(query).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: exercises.length,
    data: exercises
  });
});

/**
 * @desc    Get exercises created by the current user
 * @route   GET /api/exercises/my
 * @access  Private (Teachers)
 */
const getMyExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({ creator: req.user.id }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: exercises.length,
    data: exercises
  });
});

/**
 * @desc    Get single exercise by ID
 * @route   GET /api/exercises/:id
 * @access  Private
 */
const getExerciseById = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }
  
  // Check if exercise is published or user is creator/admin
  if (!exercise.isPublished && 
      req.user.role === 'student' && 
      exercise.creator.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this exercise');
  }
  
  res.status(200).json({
    success: true,
    data: exercise
  });
});

/**
 * @desc    Create new exercise
 * @route   POST /api/exercises
 * @access  Private (Teachers)
 */
const createExercise = asyncHandler(async (req, res) => {
  // Add creator to request body
  req.body.creator = req.user.id;
  
  // Create exercise
  const exercise = await Exercise.create(req.body);
  
  res.status(201).json({
    success: true,
    data: exercise
  });
});

/**
 * @desc    Save exercise as draft
 * @route   POST /api/exercises/drafts
 * @access  Private (Teachers)
 */
const saveExerciseDraft = asyncHandler(async (req, res) => {
  // Add creator to request body and set isPublished to false
  req.body.creator = req.user.id;
  req.body.isPublished = false;
  
  // Create exercise draft
  const exercise = await Exercise.create(req.body);
  
  res.status(201).json({
    success: true,
    data: exercise
  });
});

/**
 * @desc    Update exercise
 * @route   PUT /api/exercises/:id
 * @access  Private (Owner or Admin)
 */
const updateExercise = asyncHandler(async (req, res) => {
  let exercise = await Exercise.findById(req.params.id);
  
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }
  
  // Check ownership
  if (exercise.creator.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this exercise');
  }
  
  // Update exercise
  exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: exercise
  });
});

/**
 * @desc    Delete exercise
 * @route   DELETE /api/exercises/:id
 * @access  Private (Owner or Admin)
 */
const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }
  
  // Check ownership
  if (exercise.creator.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this exercise');
  }
  
  await Exercise.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Generate exercise with AI
 * @route   POST /api/exercises/generate
 * @access  Private (Teachers)
 */
const generateExerciseWithAI = asyncHandler(async (req, res) => {
  const { subject, grade, difficultyLevel, numQuestions, instructions } = req.body;
  
  if (!subject || !grade || !difficultyLevel || !numQuestions || !instructions) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  try {
    const prompt = `Create ${numQuestions} ${difficultyLevel} level ${subject} questions for ${grade} grade students. ${instructions}`;
    
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful educational content creator specializing in creating learning exercises." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    
    // Process the AI response
    const generatedQuestions = response.data.choices[0].message.content.trim();
    
    res.status(200).json({
      success: true,
      data: {
        generatedQuestions
      }
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500);
    throw new Error('Error generating questions with AI');
  }
});

module.exports = {
  getAllExercises,
  getMyExercises,
  getExerciseById,
  createExercise,
  saveExerciseDraft,
  updateExercise,
  deleteExercise,
  generateExerciseWithAI
};