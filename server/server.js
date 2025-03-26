const express = require('express');
const healthRoutes = require('./routes/healthRoutes');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware

// CORS configuration - use the cors middleware package
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Additional middleware to log all requests (helps with debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Standard middleware
app.use(express.json());
app.use(morgan('dev'));

// Security middleware - disabled in development for easier debugging
if (process.env.NODE_ENV === 'production') {
  // Use Helmet for security headers
  app.use(helmet());
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  });
  
  app.use(limiter);
}

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/templates', require('./routes/template.routes'));
app.use('/api/exercises', require('./routes/exercise.routes'));
app.use('/api/submissions', require('./routes/submission.routes'));
app.use('/api/generate', require('./routes/exerciseGenerationRoutes'));

// Debug routes - disable in production
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/debug', require('./routes/debug.routes'));
}

// Public test endpoint
app.get('/api/publictest', (req, res) => {
  res.json({
    message: 'Public endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Teacher-Focused LMS API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Verify critical environment variables
const verifyEnvironment = () => {
  const criticalVars = [
    { name: 'MONGODB_URI', message: 'Database connection string required' },
    { name: 'JWT_SECRET', message: 'Secret key for JWT tokens required' },
    { name: 'OPENAI_API_KEY', message: 'OpenAI API key required for AI features' }
  ];
  
  let missingVars = false;
  
  criticalVars.forEach(v => {
    if (!process.env[v.name]) {
      console.error(`❌ ERROR: ${v.message}. '${v.name}' is not set in environment.`);
      missingVars = true;
    }
  });
  
  // Specific check for OpenAI API key format
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    console.error('❌ ERROR: OPENAI_API_KEY does not appear to be valid (should start with "sk-")');
    missingVars = true;
  }
  
  if (missingVars) {
    console.error('\nPlease update your .env file with the required values.');
    console.error('See README.md for setup instructions.\n');
    // Don't exit process here to allow running without some features
    console.warn('⚠️ Server will start but some features may not work correctly.\n');
  }
};

// Connect to MongoDB and start server
const startServer = async () => {
  // Verify environment variables first
  verifyEnvironment();
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();
