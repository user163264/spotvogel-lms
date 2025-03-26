const mongoose = require('mongoose');
require('dotenv').config();

console.log('Checking MongoDB connection...');
console.log(`Connection string: ${process.env.MONGODB_URI || 'Not found in .env'}`);

// Try to connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    console.log('Connection details:');
    const conn = mongoose.connection;
    console.log(`- Host: ${conn.host}`);
    console.log(`- Port: ${conn.port}`);
    console.log(`- Database: ${conn.name}`);
    
    // Close the connection after checking
    mongoose.disconnect()
      .then(() => {
        console.log('Connection closed');
        process.exit(0);
      });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:');
    console.error(err.message);
    
    // Show a more detailed error message based on the error
    if (err.name === 'MongoNetworkError') {
      console.error('This is a network error. Make sure MongoDB is running at the specified URI.');
    } else if (err.name === 'MongoServerSelectionError') {
      console.error('Server selection error. MongoDB might be running but not accepting connections.');
    } else if (err.message.includes('Authentication failed')) {
      console.error('Authentication failed. Check your username and password in the connection string.');
    }
    
    process.exit(1);
  });
