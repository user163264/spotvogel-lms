const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 */

// Require authentication - protects routes that need authentication
exports.requireJwt = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    // Set req.user to found user
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Optional authentication - allows both authenticated and unauthenticated access
exports.optionalJwt = async (req, res, next) => {
  console.log('Optional JWT authentication middleware running');
  console.log('URL being accessed:', req.originalUrl);
  console.log('Has authorization header:', req.headers.authorization ? 'Yes' : 'No');
  let token;

  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from header
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, continue without setting user (anonymous access)
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from database
    const user = await User.findById(decoded.id).select('-password');

    if (user && user.active) {
      // Set req.user to found user
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Invalid token, but we'll still continue (just without user)
    console.warn('Invalid token provided in optional auth', error.message);
    next();
  }
};

// Authorize by role - authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Teacher role authorization
exports.requireTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required to access this route'
    });
  }

  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only teachers and admins can access this route'
    });
  }
  
  next();
};

// Admin role authorization
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required to access this route'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required to access this route'
    });
  }
  
  next();
};
