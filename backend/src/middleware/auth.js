/**
 * Authentication Middleware
 * Handles JWT verification and role-based authorization
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug mode flag
const DEBUG = process.env.DEBUG_MODE === 'true';

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-for-development-only';

// Token debugging helper
const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    return {
      header: decoded?.header,
      payload: decoded?.payload,
      signature: decoded?.signature ? '[PRESENT]' : '[MISSING]'
    };
  } catch (error) {
    return {
      error: 'Invalid token format',
      message: error.message
    };
  }
};

/**
 * Authenticate JWT token middleware
 * This middleware verifies the JWT token provided in the Authorization header
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (DEBUG) {
    console.log('\n----- AUTH DEBUG: TOKEN CHECK -----');
    console.log('TIME:', new Date().toISOString());
    console.log('PATH:', req.path);
    console.log('METHOD:', req.method);
    console.log('AUTH HEADER:', authHeader ? 'Present' : 'Missing');
    console.log('TOKEN:', token ? 'Present' : 'Missing');
    
    if (token) {
      console.log('TOKEN INFO:', decodeToken(token));
    }
    
    console.log('----------------------------------\n');
  }
  
  // For testing/development, allow skipping auth if no token is required
  // IMPORTANT: Remove this in production!
  const SKIP_AUTH = process.env.SKIP_AUTH === 'true';
  if (SKIP_AUTH) {
    if (DEBUG) {
      console.log('\n⚠️ WARNING: AUTHENTICATION SKIPPED - DEVELOPMENT MODE ONLY ⚠️');
      console.log('Setting test user: { id: 1, role: "teacher" }');
      console.log('This should NEVER be enabled in production\n');
    }
    
    req.user = { id: 1, role: 'teacher', username: 'test_teacher' };
    return next();
  }
  
  if (!token) {
    if (DEBUG) {
      console.log('\n----- AUTH ERROR: NO TOKEN -----');
      console.log('----------------------------------\n');
    }
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required'
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (DEBUG) {
        console.log('\n----- AUTH ERROR: TOKEN VERIFICATION FAILED -----');
        console.log('ERROR TYPE:', err.name);
        console.log('MESSAGE:', err.message);
        console.log('-----------------------------------------------\n');
      }
      
      let statusCode = 403;
      let message = 'Access forbidden';
      
      // Provide more specific error messages for different JWT errors
      if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
      } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
      }
      
      return res.status(statusCode).json({
        success: false,
        message: message,
        error: err.name
      });
    }
    
    req.user = user;
    
    if (DEBUG) {
      console.log('\n----- AUTH SUCCESS -----');
      console.log('USER ID:', user.id);
      console.log('USERNAME:', user.username);
      console.log('ROLE:', user.role);
      console.log('-----------------------\n');
    }
    
    next();
  });
};

/**
 * Authorize teacher role middleware
 * This middleware ensures the authenticated user has a teacher role
 */
export const authorizeTeacher = (req, res, next) => {
  if (!req.user) {
    if (DEBUG) {
      console.log('\n----- TEACHER AUTH ERROR: NO USER -----');
      console.log('Request is missing user object - did you forget to call authenticateToken first?');
      console.log('----------------------------------------\n');
    }
    
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    if (DEBUG) {
      console.log('\n----- TEACHER AUTH ERROR: INSUFFICIENT ROLE -----');
      console.log('USER ID:', req.user.id);
      console.log('USERNAME:', req.user.username);
      console.log('ROLE:', req.user.role);
      console.log('REQUIRED ROLE: teacher or admin');
      console.log('----------------------------------------------\n');
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. Teacher privileges required'
    });
  }
  
  if (DEBUG) {
    console.log('\n----- TEACHER AUTH SUCCESS -----');
    console.log('USER ID:', req.user.id);
    console.log('USERNAME:', req.user.username);
    console.log('ROLE:', req.user.role);
    console.log('-------------------------------\n');
  }
  
  next();
};

/**
 * Authorize student role middleware
 * This middleware ensures the authenticated user has a student role
 */
export const authorizeStudent = (req, res, next) => {
  if (!req.user) {
    if (DEBUG) {
      console.log('\n----- STUDENT AUTH ERROR: NO USER -----');
      console.log('Request is missing user object - did you forget to call authenticateToken first?');
      console.log('-----------------------------------------\n');
    }
    
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'student') {
    if (DEBUG) {
      console.log('\n----- STUDENT AUTH ERROR: INSUFFICIENT ROLE -----');
      console.log('USER ID:', req.user.id);
      console.log('USERNAME:', req.user.username);
      console.log('ROLE:', req.user.role);
      console.log('REQUIRED ROLE: student');
      console.log('-----------------------------------------------\n');
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. Student privileges required'
    });
  }
  
  if (DEBUG) {
    console.log('\n----- STUDENT AUTH SUCCESS -----');
    console.log('USER ID:', req.user.id);
    console.log('USERNAME:', req.user.username);
    console.log('ROLE:', req.user.role);
    console.log('--------------------------------\n');
  }
  
  next();
};

/**
 * Authorize admin role middleware
 * This middleware ensures the authenticated user has an admin role
 */
export const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    if (DEBUG) {
      console.log('\n----- ADMIN AUTH ERROR: NO USER -----');
      console.log('Request is missing user object - did you forget to call authenticateToken first?');
      console.log('---------------------------------------\n');
    }
    
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'admin') {
    if (DEBUG) {
      console.log('\n----- ADMIN AUTH ERROR: INSUFFICIENT ROLE -----');
      console.log('USER ID:', req.user.id);
      console.log('USERNAME:', req.user.username);
      console.log('ROLE:', req.user.role);
      console.log('REQUIRED ROLE: admin');
      console.log('---------------------------------------------\n');
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required'
    });
  }
  
  if (DEBUG) {
    console.log('\n----- ADMIN AUTH SUCCESS -----');
    console.log('USER ID:', req.user.id);
    console.log('USERNAME:', req.user.username);
    console.log('ROLE:', req.user.role);
    console.log('------------------------------\n');
  }
  
  next();
};

/**
 * Create a JWT token for a user
 * @param {Object} user - User object to create token for
 * @returns {string} JWT token
 */
export const createToken = (user) => {
  // Only include necessary user data in the token
  const tokenData = {
    id: user.id,
    username: user.username,
    role: user.role
  };
  
  // Set token expiration time (24 hours by default)
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  // Create and sign the token
  const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn });
  
  if (DEBUG) {
    console.log('\n----- TOKEN CREATED -----');
    console.log('USER ID:', user.id);
    console.log('USERNAME:', user.username);
    console.log('ROLE:', user.role);
    console.log('EXPIRES IN:', expiresIn);
    console.log('TOKEN INFO:', decodeToken(token));
    console.log('------------------------\n');
  }
  
  return token;
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return null;
    
    // exp is in seconds, Date expects milliseconds
    return new Date(decoded.exp * 1000);
  } catch (error) {
    if (DEBUG) {
      console.error('\n----- TOKEN EXPIRATION ERROR -----');
      console.error('ERROR:', error.message);
      console.error('----------------------------------\n');
    }
    return null;
  }
};
