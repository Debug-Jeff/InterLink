const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');
const { authRateLimiter } = require('../middleware/rateLimiter');
const { validateEmail, validatePassword, handleValidationErrors } = require('../middleware/validation');
const { logger } = require('../config/logger');
const router = express.Router();

// Apply auth rate limiting to all routes
router.use(authRateLimiter);

// Register new user
router.post('/register', [
  validateEmail,
  validatePassword,
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'client' } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
        role
      }
    });

    if (authError) {
      logger.error('Supabase auth error during registration:', authError);
      return res.status(400).json({
        error: authError.message,
        statusCode: 400
      });
    }

    // Wait for the trigger to create the user profile automatically
    // Give it a moment to process
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify user profile was created by the trigger
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !userProfile) {
      logger.error('Database error during user profile verification:', profileError);
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({
        error: 'Failed to create user profile',
        statusCode: 500
      });
    }

    logger.info(`New user registered: ${email} with role: ${role}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName,
        lastName,
        role
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error during registration',
      statusCode: 500
    });
  }
});

// Login user
router.post('/login', [
  validateEmail,
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      logger.warn(`Failed login attempt for email: ${email}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return res.status(401).json({
        error: 'Invalid credentials',
        statusCode: 401
      });
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !userProfile) {
      logger.error('Error fetching user profile during login:', profileError);
      return res.status(500).json({
        error: 'Failed to fetch user profile',
        statusCode: 500
      });
    }

    // Check if user is active
    if (userProfile.status !== 'active') {
      logger.warn(`Inactive user login attempt: ${email}`);
      return res.status(403).json({
        error: 'Account is not active',
        statusCode: 403
      });
    }

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role,
        status: userProfile.status
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login',
      statusCode: 500
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        error: 'Refresh token is required',
        statusCode: 400
      });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      logger.warn('Token refresh failed:', error);
      return res.status(401).json({
        error: 'Invalid refresh token',
        statusCode: 401
      });
    }

    res.json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({
      error: 'Internal server error during token refresh',
      statusCode: 500
    });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await supabase.auth.admin.signOut(token);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error during logout',
      statusCode: 500
    });
  }
});

// Forgot password
router.post('/forgot-password', [
  validateEmail,
  handleValidationErrors
], async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/auth/reset-password`
    });

    if (error) {
      logger.error('Password reset error:', error);
      return res.status(400).json({
        error: error.message,
        statusCode: 400
      });
    }

    logger.info(`Password reset requested for: ${email}`);

    res.json({
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Internal server error during password reset',
      statusCode: 500
    });
  }
});

// Reset password
router.post('/reset-password', [
  validatePassword,
  handleValidationErrors
], async (req, res) => {
  try {
    const { access_token, refresh_token, password } = req.body;

    if (!access_token || !refresh_token) {
      return res.status(400).json({
        error: 'Access token and refresh token are required',
        statusCode: 400
      });
    }

    // Set session
    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token
    });

    if (sessionError) {
      logger.error('Session error during password reset:', sessionError);
      return res.status(401).json({
        error: 'Invalid session tokens',
        statusCode: 401
      });
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password
    });

    if (updateError) {
      logger.error('Password update error:', updateError);
      return res.status(400).json({
        error: updateError.message,
        statusCode: 400
      });
    }

    logger.info('Password reset completed successfully');

    res.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      error: 'Internal server error during password reset',
      statusCode: 500
    });
  }
});

module.exports = router;