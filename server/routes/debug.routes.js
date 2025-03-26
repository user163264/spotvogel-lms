const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// Echo route for testing basic connectivity
router.get('/echo', (req, res) => {
  res.json({
    message: 'API is responding correctly',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    query: req.query
  });
});

// Basic test without MongoDB dependency
router.get('/basic-test', (req, res) => {
  res.json({
    message: 'Basic test route is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version
  });
});

// Test MongoDB connection
router.get('/db-status', async (req, res) => {
  try {
    // Check if we're connected to MongoDB
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Count users to verify database access
    const userCount = await User.countDocuments();
    
    res.json({
      dbState: states[dbState],
      connected: dbState === 1,
      userCount,
      mongodbUri: process.env.MONGODB_URI ? 'Configured (hidden for security)' : 'Not configured'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection test failed',
      error: error.message
    });
  }
});

// Test specific authentication for the admin user
router.post('/test-auth', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        userExists: false
      });
    }
    
    // Test password
    const isMatch = await user.matchPassword(password);
    
    res.json({
      userExists: true,
      passwordMatch: isMatch,
      userData: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Authentication test failed',
      error: error.message
    });
  }
});

// Create admin user if it doesn't exist
router.post('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      return res.json({
        message: 'Admin user already exists',
        user: {
          id: adminExists._id,
          name: adminExists.name,
          email: adminExists.email,
          role: adminExists.role
        }
      });
    }
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'admin',
      preferredLanguage: 'en',
      institution: 'System'
    });
    
    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create admin user',
      error: error.message
    });
  }
});

module.exports = router;