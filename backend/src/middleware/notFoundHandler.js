const { logger } = require('../config/logger');

// 404 handler middleware
const notFoundHandler = (req, res, next) => {
  logger.warn(`404 - Not Found: ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    error: 'Resource not found',
    statusCode: 404,
    path: req.url,
    method: req.method
  });
};

module.exports = { notFoundHandler };