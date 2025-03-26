const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Basic CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Basic parsing middleware
app.use(express.json());

// Public test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test route is working' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Main server root is working' });
});

// Authentication route - very simplified
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Hard-coded admin check
  if (email === 'admin@example.com' && password === 'Admin123!') {
    res.json({
      _id: '123456789',
      name: 'Admin User',
      email: email,
      role: 'admin',
      token: 'dummy-token-for-testing'
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Simplified main server running on http://localhost:${PORT}`);
});
