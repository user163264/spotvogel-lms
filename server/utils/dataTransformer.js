/**
 * Utility functions to transform data between database and client formats
 */

/**
 * Normalize MongoDB document by adding id field that matches _id
 * This makes frontend code more consistent when working with IDs
 * 
 * @param {Object} doc - MongoDB document or plain object with _id
 * @returns {Object} - Same object with id added
 */
const normalizeId = (doc) => {
  // If null/undefined, return as is
  if (!doc) return doc;
  
  // Handle plain objects (standard JSON responses)
  if (doc && typeof doc === 'object' && doc._id) {
    // Add id property that matches _id, if it doesn't already exist
    if (!doc.id) {
      doc.id = doc._id.toString();
    }
  }
  
  return doc;
};

/**
 * Normalize an array of MongoDB documents by adding id to each document
 * 
 * @param {Array} docs - Array of MongoDB documents or objects with _id
 * @returns {Array} - Same array with id added to each object
 */
const normalizeIds = (docs) => {
  if (!Array.isArray(docs)) return docs;
  
  return docs.map(doc => normalizeId(doc));
};

/**
 * Process API response data to normalize all _id fields to id
 * Can handle various response formats including arrays and nested objects
 * 
 * @param {*} data - Response data to normalize
 * @returns {*} - Normalized data
 */
const normalizeResponse = (data) => {
  // If data is null/undefined, return as is
  if (!data) return data;
  
  // If data is an array, normalize each item
  if (Array.isArray(data)) {
    return normalizeIds(data);
  }
  
  // If data is an object, normalize it
  if (typeof data === 'object') {
    // First normalize the top-level object
    data = normalizeId(data);
    
    // Then check for arrays or objects in properties that might need normalization
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        data[key] = normalizeIds(data[key]);
      } else if (data[key] && typeof data[key] === 'object' && data[key]._id) {
        data[key] = normalizeId(data[key]);
      }
    });
  }
  
  return data;
};

/**
 * Express middleware to normalize MongoDB _id to id in API responses
 * Adds id field to all objects with _id in the response
 */
const normalizeResponseMiddleware = (req, res, next) => {
  // Store the original res.json function
  const originalJson = res.json;
  
  // Override res.json to normalize data before sending
  res.json = function(body) {
    // If body has success and data properties (our API format)
    if (body && body.success !== undefined && body.data !== undefined) {
      body.data = normalizeResponse(body.data);
    } else {
      // Otherwise normalize the whole body
      body = normalizeResponse(body);
    }
    
    // Call the original json method with normalized data
    return originalJson.call(this, body);
  };
  
  next();
};

module.exports = {
  normalizeId,
  normalizeIds,
  normalizeResponse,
  normalizeResponseMiddleware
};
