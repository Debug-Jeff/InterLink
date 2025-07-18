const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { requireAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');
const { validateUserCreation, validateUserUpdate, validatePagination, validateUUID } = require('../middleware/validation');
const { logger } = require('../config/logger');
const router = express.Router();

// Get all users (admin only)
router.get('/', [requireAdmin, ...validatePagination], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { role, status, search } = req.query;

    let query = supabaseAdmin.from('users').select('*', { count: 'exact' });

    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: users, error, count } = await query;

    if (error) {
      logger.error('Error fetching users:', error);
      return res.status(500).json({
        error: 'Failed to fetch users',
        statusCode: 500
      });
    }

    res.json({
      users,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get user by ID
router.get('/:id', [validateUUID('id'), requireOwnershipOrAdmin()], async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching user:', error);
      return res.status(404).json({
        error: 'User not found',
        statusCode: 404
      });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Create new user (admin only)
router.post('/', [requireAdmin, ...validateUserCreation], async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, status = 'active' } = req.body;

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
      logger.error('Supabase auth error during user creation:', authError);
      return res.status(400).json({
        error: authError.message,
        statusCode: 400
      });
    }

    // Create user profile in database
    const { data: user, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName,
        last_name: lastName,
        role: role,
        status: status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      logger.error('Database error during user profile creation:', profileError);
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({
        error: 'Failed to create user profile',
        statusCode: 500
      });
    }

    logger.info(`New user created by admin: ${email} with role: ${role}`);

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Update user
router.put('/:id', [validateUUID('id'), requireOwnershipOrAdmin(), ...validateUserUpdate], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.id;
    delete updateData.created_at;

    // Convert field names to snake_case for database
    const dbUpdateData = {};
    if (updateData.firstName) dbUpdateData.first_name = updateData.firstName;
    if (updateData.lastName) dbUpdateData.last_name = updateData.lastName;
    if (updateData.email) dbUpdateData.email = updateData.email;
    if (updateData.role) dbUpdateData.role = updateData.role;
    if (updateData.status) dbUpdateData.status = updateData.status;

    dbUpdateData.updated_at = new Date().toISOString();

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(dbUpdateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating user:', error);
      return res.status(400).json({
        error: 'Failed to update user',
        statusCode: 400
      });
    }

    // Update email in Supabase Auth if email was changed
    if (updateData.email) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        email: updateData.email
      });

      if (authError) {
        logger.error('Error updating user email in auth:', authError);
        // Revert database changes if auth update fails
        await supabaseAdmin
          .from('users')
          .update({ email: user.email })
          .eq('id', id);
      }
    }

    logger.info(`User updated: ${id}`);

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Delete user (admin only)
router.delete('/:id', [validateUUID('id'), requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Delete user from database
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (dbError) {
      logger.error('Error deleting user from database:', dbError);
      return res.status(500).json({
        error: 'Failed to delete user',
        statusCode: 500
      });
    }

    // Delete user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      logger.error('Error deleting user from auth:', authError);
      // User is already deleted from database, so we'll log this but continue
    }

    logger.info(`User deleted: ${id}`);

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get user's profile (current user)
router.get('/profile/me', async (req, res) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      logger.error('Error fetching user profile:', error);
      return res.status(404).json({
        error: 'User profile not found',
        statusCode: 404
      });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Update user's profile (current user)
router.put('/profile/me', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const dbUpdateData = {
      updated_at: new Date().toISOString()
    };

    if (firstName) dbUpdateData.first_name = firstName;
    if (lastName) dbUpdateData.last_name = lastName;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(dbUpdateData)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating user profile:', error);
      return res.status(400).json({
        error: 'Failed to update profile',
        statusCode: 400
      });
    }

    logger.info(`User profile updated: ${req.user.id}`);

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;