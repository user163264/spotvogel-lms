const express = require('express');

// Create a minimal Express app
const app = express();
const PORT = 5001; // Use a different port to avoid conflicts

// Basic middleware
app.use(express.json());

// Add CORS headers manually for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the test server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Try accessing http://localhost:5001/ in your browser');
});
