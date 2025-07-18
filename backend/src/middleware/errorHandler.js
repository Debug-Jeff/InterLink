const { logger } = require('../config/logger');

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error response
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = 'Validation Error';
    error.details = err.details;
  }

  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    error.statusCode = 409;
    error.message = 'Duplicate field value';
  }

  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    delete error.stack;
    if (error.statusCode === 500) {
      error.message = 'Internal Server Error';
    }
  } else {
    error.stack = err.stack;
  }

  res.status(error.statusCode).json({
    error: error.message,
    statusCode: error.statusCode,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};

module.exports = { errorHandler };