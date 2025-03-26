const express = require('express');

// Create a minimal Express app
const app = express();
const PORT = 5000;

// No middleware at all
app.get('/', (req, res) => {
  res.json({ message: 'Minimal server is working!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Minimal server running on http://localhost:${PORT}`);
});
