/**
 * Standalone minimal server for debugging
 * This server has no dependencies on other files in the project
 */

const express = require('express');
const app = express();
const PORT = 8080;

// Basic middleware
app.use(express.json());

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Standalone server is working',
    timestamp: new Date().toISOString()
  });
});

// Test API route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API test endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Mock login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password: '***' });
  
  // Basic authentication check
  if (email === 'admin@example.com' && password === 'Admin123!') {
    // Return mock user data and token
    return res.json({
      _id: '1234567890',
      name: 'Admin User',
      email: email,
      role: 'admin',
      token: 'sample-jwt-token-for-testing'
    });
  }
  
  return res.status(401).json({
    message: 'Invalid email or password'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint - shows request details
app.all('/api/debug', (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Standalone server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  / - Root endpoint');
  console.log('  GET  /api/test - Test API endpoint');
  console.log('  POST /api/auth/login - Login endpoint (admin@example.com/Admin123!)');
  console.log('  GET  /api/health - Health check endpoint');
  console.log('  ALL  /api/debug - Debug endpoint showing request details');
});
