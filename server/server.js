const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Teacher-Focused LMS API is running' });
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const templateRoutes = require('./routes/template.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const submissionRoutes = require('./routes/submission.routes');
const healthRoutes = require('./routes/healthRoutes');
const exerciseGenerationRoutes = require('./routes/exerciseGenerationRoutes');
const debugRoutes = require('./routes/debug.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/generate', exerciseGenerationRoutes);

// Debug routes - only in development environment
if (process.env.NODE_ENV === 'development') {
  console.log('Debug routes enabled in development mode');
  app.use('/api/debug', debugRoutes);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
