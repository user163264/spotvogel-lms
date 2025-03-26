/**
 * Debug controller for API testing
 */

// @desc    Test endpoint that returns request info
// @route   GET /api/debug/echo
// @access  Public
exports.echo = async (req, res) => {
  try {
    // Return request information
    res.json({
      message: 'Echo successful',
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: {
        // Only include relevant headers
        authorization: req.headers.authorization ? 'Bearer [TOKEN]' : undefined,
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent']
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error in echo endpoint',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Test endpoint that requires authentication
// @route   GET /api/debug/auth-test
// @access  Private
exports.authTest = async (req, res) => {
  try {
    // If middleware allowed access, user is authenticated
    res.json({
      message: 'Authentication successful',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error in auth test endpoint',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Test endpoint that returns a specified error code
// @route   GET /api/debug/error/:code
// @access  Public
exports.testError = async (req, res) => {
  const { code } = req.params;
  const statusCode = parseInt(code) || 500;
  
  // List of standard error messages by code
  const errorMessages = {
    400: 'Bad Request - The request could not be understood by the server',
    401: 'Unauthorized - Authentication is required and has failed or has not been provided',
    403: 'Forbidden - The server understood the request but refuses to authorize it',
    404: 'Not Found - The requested resource could not be found',
    500: 'Internal Server Error - The server encountered an unexpected condition',
    503: 'Service Unavailable - The server is currently unable to handle the request'
  };
  
  res.status(statusCode).json({
    error: true,
    code: statusCode,
    message: errorMessages[statusCode] || `Test error with code ${statusCode}`,
    timestamp: new Date().toISOString()
  });
};

// @desc    Test endpoint with delayed response
// @route   GET /api/debug/delay/:seconds
// @access  Public
exports.delayedResponse = async (req, res) => {
  const { seconds } = req.params;
  const delaySeconds = Math.min(parseInt(seconds) || 1, 10); // Cap at 10 seconds
  
  // Wait for specified time
  await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
  
  res.json({
    message: `Response delayed by ${delaySeconds} seconds`,
    delaySeconds,
    timestamp: new Date().toISOString()
  });
};
