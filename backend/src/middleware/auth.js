const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');
const { logger } = require('../config/logger');

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        statusCode: 401
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token with Supabase
    const { data: user, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      logger.warn(`Invalid token attempt from IP: ${req.ip}`);
      return res.status(401).json({
        error: 'Invalid token.',
        statusCode: 401
      });
    }

    // Attach user info to request
    req.user = user.user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error during authentication.',
      statusCode: 500
    });
  }
};

// Middleware to check if user has specific role
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required.',
          statusCode: 401
        });
      }

      // Get user role from database
      const { data: userProfile, error } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (error || !userProfile) {
        logger.error('Error fetching user role:', error);
        return res.status(500).json({
          error: 'Error checking user permissions.',
          statusCode: 500
        });
      }

      const userRole = userProfile.role;
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      if (!allowedRoles.includes(userRole)) {
        logger.warn(`Access denied for user ${req.user.id} with role ${userRole} to ${req.path}`);
        return res.status(403).json({
          error: 'Insufficient permissions.',
          statusCode: 403
        });
      }

      req.userRole = userRole;
      next();
    } catch (error) {
      logger.error('Role check error:', error);
      res.status(500).json({
        error: 'Internal server error during role verification.',
        statusCode: 500
      });
    }
  };
};

// Middleware to check if user is admin
const requireAdmin = requireRole(['admin']);

// Middleware to check if user is company or admin
const requireCompanyOrAdmin = requireRole(['company', 'admin']);

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = (resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required.',
          statusCode: 401
        });
      }

      // Get user role from database
      const { data: userProfile, error } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (error || !userProfile) {
        logger.error('Error fetching user role:', error);
        return res.status(500).json({
          error: 'Error checking user permissions.',
          statusCode: 500
        });
      }

      const userRole = userProfile.role;
      
      // Admin can access everything
      if (userRole === 'admin') {
        req.userRole = userRole;
        return next();
      }

      // Check if user owns the resource
      const resourceId = req.params[resourceIdParam];
      
      if (resourceId === req.user.id) {
        req.userRole = userRole;
        return next();
      }

      // For company users, check if they own the client/project
      if (userRole === 'company') {
        // Additional ownership checks can be added here based on resource type
        req.userRole = userRole;
        return next();
      }

      // For client users, they can only access their own resources
      if (userRole === 'client' && resourceId === req.user.id) {
        req.userRole = userRole;
        return next();
      }

      logger.warn(`Access denied for user ${req.user.id} to resource ${resourceId}`);
      return res.status(403).json({
        error: 'Access denied to this resource.',
        statusCode: 403
      });
    } catch (error) {
      logger.error('Ownership check error:', error);
      res.status(500).json({
        error: 'Internal server error during ownership verification.',
        statusCode: 500
      });
    }
  };
};

module.exports = {
  authMiddleware,
  requireRole,
  requireAdmin,
  requireCompanyOrAdmin,
  requireOwnershipOrAdmin
};