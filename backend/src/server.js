/**
 * Main Server Application
 * Entry point for the LMS backend API
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import exerciseRoutes from './routes/exerciseRoutes.js';
import { dbPool } from './config/database.js';

// Load environment variables
dotenv.config();

// Debug mode flag
const DEBUG = process.env.DEBUG_MODE === 'true';

// Get current directory (ESM compatible way)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Enable detailed server logs if in debug mode
if (DEBUG) {
  // Custom Morgan format with more details
  app.use(morgan((tokens, req, res) => {
    const now = new Date();
    return [
      '\n===== HTTP REQUEST =====',
      `TIME: ${now.toISOString()}`,
      `METHOD: ${tokens.method(req, res)}`,
      `URL: ${tokens.url(req, res)}`,
      `STATUS: ${tokens.status(req, res)}`,
      `CONTENT-LENGTH: ${tokens.res(req, res, 'content-length') || 0}`,
      `RESPONSE-TIME: ${tokens['response-time'](req, res)} ms`,
      `USER-AGENT: ${req.headers['user-agent']}`,
      `IP: ${tokens['remote-addr'](req, res)}`,
      '========================\n'
    ].join('\n');
  }));
} else {
  // Simpler logs for production
  app.use(morgan('combined'));
}

// Middleware
app.use(helmet()); // Enhanced security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded request bodies

// Middleware for logging request bodies in debug mode
if (DEBUG) {
  app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
      console.log('\n----- REQUEST BODY -----');
      console.log(JSON.stringify(req.body, null, 2));
      console.log('------------------------\n');
    }
    next();
  });
}

// Error handling for JSON parse errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('\n===== JSON PARSE ERROR =====');
    console.error('ERROR TYPE:', err.name);
    console.error('MESSAGE:', err.message);
    console.error('PATH:', req.path);
    console.error('============================\n');
    
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      error: err.message
    });
  }
  next(err);
});

// API Routes
app.use('/api/exercises', exerciseRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'LMS API Server',
    status: 'running',
    version: '1.0.0',
    debug: DEBUG ? 'enabled' : 'disabled',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoints (only available in debug mode)
if (DEBUG) {
  app.get('/debug/db-test', async (req, res) => {
    let connection;
    try {
      console.log('\n===== DEBUG: DATABASE TEST =====');
      connection = await dbPool.getConnection();
      const [result] = await connection.query('SELECT 1+1 AS solution');
      console.log('DB TEST RESULT:', result[0].solution);
      console.log('===============================\n');
      
      res.status(200).json({
        success: true,
        message: 'Database connection successful',
        result: result[0].solution
      });
    } catch (error) {
      console.error('\n===== DEBUG: DATABASE ERROR =====');
      console.error('ERROR TYPE:', error.name);
      console.error('MESSAGE:', error.message);
      console.error('================================\n');
      
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message
      });
    } finally {
      if (connection) connection.release();
    }
  });
  
  app.get('/debug/env', (req, res) => {
    // Only show safe environment variables
    const safeEnv = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DEBUG_MODE: process.env.DEBUG_MODE,
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      DB_HOST: process.env.DB_HOST,
      // Don't include sensitive info like DB_PASSWORD or JWT_SECRET
    };
    
    res.status(200).json({
      success: true,
      environment: safeEnv
    });
  });
}

// 404 Handler
app.use((req, res) => {
  if (DEBUG) {
    console.log('\n===== 404 NOT FOUND =====');
    console.log('PATH:', req.path);
    console.log('METHOD:', req.method);
    console.log('========================\n');
  }
  
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('\n===== SERVER ERROR =====');
  console.error('ERROR TYPE:', err.name);
  console.error('MESSAGE:', err.message);
  console.error('STACK:', err.stack);
  console.error('=======================\n');
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: DEBUG ? err.stack : undefined
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n===== SERVER STARTED =====`);
  console.log(`TIME: ${new Date().toISOString()}`);
  console.log(`PORT: ${PORT}`);
  console.log(`DEBUG: ${DEBUG ? 'enabled' : 'disabled'}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('\n===== UNHANDLED PROMISE REJECTION =====');
  console.error('REASON:', reason);
  console.error('PROMISE:', promise);
  console.error('======================================\n');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('\n===== UNCAUGHT EXCEPTION =====');
  console.error('ERROR TYPE:', error.name);
  console.error('MESSAGE:', error.message);
  console.error('STACK:', error.stack);
  console.error('=============================\n');
  
  // Exit the process in production to let the process manager restart it
  if (process.env.NODE_ENV === 'production') {
    console.error('Exiting process due to uncaught exception in production mode');
    process.exit(1);
  }
});

export default app;
