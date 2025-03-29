// Server-side configuration
require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-lms',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_dev_only',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate required environment variables in production
if (config.nodeEnv === 'production') {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'OPENAI_API_KEY'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Error: Environment variable ${envVar} is required in production mode.`);
      process.exit(1);
    }
  }
}

module.exports = config;
