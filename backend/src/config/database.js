/**
 * Database Configuration
 * Sets up the database connection pool and exports it for use throughout the application.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug mode flag
const DEBUG = process.env.DEBUG_MODE === 'true';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lms_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const dbPool = mysql.createPool(dbConfig);

// Debug logging function
const logQuery = (query, params) => {
  if (DEBUG) {
    console.log('\n----- DATABASE QUERY -----');
    console.log('SQL:', query);
    console.log('PARAMS:', JSON.stringify(params, null, 2));
    console.log('--------------------------\n');
  }
};

// Debug logging for connections
const logConnection = (action) => {
  if (DEBUG) {
    console.log(`\n----- DATABASE CONNECTION ${action.toUpperCase()} -----`);
    console.log('TIME:', new Date().toISOString());
    console.log('CONFIG:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      connectionLimit: dbConfig.connectionLimit
    });
    console.log('---------------------------------\n');
  }
};

// Test database connection on startup
const testConnection = async () => {
  let connection;
  try {
    logConnection('acquiring');
    connection = await dbPool.getConnection();
    logConnection('acquired');
    
    const [result] = await connection.query('SELECT 1 + 1 AS solution');
    
    if (DEBUG) {
      console.log('\n----- DATABASE CONNECTION TEST -----');
      console.log('RESULT:', result[0].solution);
      console.log('STATUS: Connection successful');
      console.log('------------------------------------\n');
    }
    
    return true;
  } catch (error) {
    console.error('\n----- DATABASE CONNECTION ERROR -----');
    console.error('ERROR:', error.message);
    console.error('CODE:', error.code);
    console.error('--------------------------------------\n');
    return false;
  } finally {
    if (connection) {
      connection.release();
      logConnection('released');
    }
  }
};

// Enhanced query function with debugging
const executeQuery = async (sql, params = []) => {
  let connection;
  try {
    logQuery(sql, params);
    
    const startTime = Date.now();
    connection = await dbPool.getConnection();
    
    const [results] = await connection.query(sql, params);
    const duration = Date.now() - startTime;
    
    if (DEBUG) {
      console.log('\n----- QUERY RESULTS -----');
      console.log('TIME:', `${duration}ms`);
      console.log('ROWS:', results.length || (results.affectedRows || 0));
      if (results.insertId) {
        console.log('INSERT ID:', results.insertId);
      }
      console.log('------------------------\n');
    }
    
    return results;
  } catch (error) {
    console.error('\n----- QUERY ERROR -----');
    console.error('SQL:', sql);
    console.error('PARAMS:', JSON.stringify(params, null, 2));
    console.error('ERROR:', error.message);
    console.error('CODE:', error.code);
    console.error('-----------------------\n');
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Run connection test on module load
testConnection()
  .then(success => {
    if (!success) {
      console.error('WARNING: Database connection test failed');
    }
  })
  .catch(err => {
    console.error('CRITICAL: Error during database connection test:', err);
  });

export { dbPool, executeQuery };
