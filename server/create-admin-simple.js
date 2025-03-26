/**
 * Simple Admin Creation Script
 * 
 * This script creates an admin user in the LMS system.
 * It uses your existing models and configuration.
 * 
 * Save this file to the server directory and run:
 *   node create-admin-simple.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Admin User Details - CHANGE THESE BEFORE RUNNING
const adminData = {
  name: 'System Administrator',
  email: 'admin@example.com',
  password: 'Admin123!',  // You should change this to a secure password
  role: 'admin',
  preferredLanguage: 'en',
  institution: 'LMS System',
  active: true
};

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
}

// Create Admin User
async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }
    
    // Create new admin user
    const admin = await User.create(adminData);
    
    console.log('Admin user created successfully:');
    console.log('-------------------------------');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('-------------------------------');
    console.log('Please remember the password you set for this account.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
}

// Run the script
async function run() {
  await connectDB();
  await createAdmin();
}

run();
