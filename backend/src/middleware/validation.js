const { body, param, query, validationResult } = require('express-validator');
const { logger } = require('../config/logger');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', {
      errors: errors.array(),
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    return res.status(400).json({
      error: 'Validation failed',
      statusCode: 400,
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Common validation rules
const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

const validatePassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

const validateName = (field) => 
  body(field)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(`${field} must be between 2 and 50 characters`);

const validateUUID = (field) => 
  param(field)
    .isUUID()
    .withMessage(`${field} must be a valid UUID`);

const validateRole = body('role')
  .isIn(['admin', 'company', 'client'])
  .withMessage('Role must be either admin, company, or client');

const validateStatus = body('status')
  .isIn(['active', 'inactive', 'pending', 'suspended'])
  .withMessage('Status must be one of: active, inactive, pending, suspended');

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// User validation rules
const validateUserCreation = [
  validateEmail,
  validatePassword,
  validateName('firstName'),
  validateName('lastName'),
  validateRole,
  handleValidationErrors
];

const validateUserUpdate = [
  validateUUID('id'),
  body('email').optional().isEmail().normalizeEmail(),
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('role').optional().isIn(['admin', 'company', 'client']),
  body('status').optional().isIn(['active', 'inactive', 'pending', 'suspended']),
  handleValidationErrors
];

// Client validation rules
const validateClientCreation = [
  validateEmail,
  validateName('firstName'),
  validateName('lastName'),
  body('companyName').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().isMobilePhone(),
  handleValidationErrors
];

// Project validation rules
const validateProjectCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('clientId')
    .isUUID()
    .withMessage('Client ID must be a valid UUID'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  handleValidationErrors
];

// Inquiry validation rules
const validateInquiry = [
  validateName('name'),
  validateEmail,
  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// Message validation rules
const validateMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
  body('recipientId')
    .isUUID()
    .withMessage('Recipient ID must be a valid UUID'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateEmail,
  validatePassword,
  validateName,
  validateUUID,
  validateRole,
  validateStatus,
  validatePagination,
  validateUserCreation,
  validateUserUpdate,
  validateClientCreation,
  validateProjectCreation,
  validateInquiry,
  validateMessage
};