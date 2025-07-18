const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { requireAdmin, requireCompanyOrAdmin } = require('../middleware/auth');
const { validateClientCreation, validatePagination, validateUUID } = require('../middleware/validation');
const { logger } = require('../config/logger');
const router = express.Router();

// Get all clients
router.get('/', [requireCompanyOrAdmin, ...validatePagination], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, search } = req.query;

    let query = supabaseAdmin.from('clients').select(`
      *,
      user:users(id, email, first_name, last_name, status)
    `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: clients, error, count } = await query;

    if (error) {
      logger.error('Error fetching clients:', error);
      return res.status(500).json({
        error: 'Failed to fetch clients',
        statusCode: 500
      });
    }

    res.json({
      clients,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get clients error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get client by ID
router.get('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select(`
        *,
        user:users(id, email, first_name, last_name, status),
        projects:projects(id, title, status, created_at)
      `)
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching client:', error);
      return res.status(404).json({
        error: 'Client not found',
        statusCode: 404
      });
    }

    res.json({ client });
  } catch (error) {
    logger.error('Get client error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Create new client
router.post('/', [requireCompanyOrAdmin, ...validateClientCreation], async (req, res) => {
  try {
    const { email, firstName, lastName, companyName, phone, password } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || Math.random().toString(36).slice(-8), // Generate random password if not provided
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
        role: 'client'
      }
    });

    if (authError) {
      logger.error('Supabase auth error during client creation:', authError);
      return res.status(400).json({
        error: authError.message,
        statusCode: 400
      });
    }

    // Create user profile in database
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName,
        last_name: lastName,
        role: 'client',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (userError) {
      logger.error('Database error during user profile creation:', userError);
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({
        error: 'Failed to create user profile',
        statusCode: 500
      });
    }

    // Create client profile
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert({
        id: authData.user.id,
        user_id: authData.user.id,
        company_name: companyName,
        phone: phone,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        user:users(id, email, first_name, last_name, status)
      `)
      .single();

    if (clientError) {
      logger.error('Database error during client profile creation:', clientError);
      // Clean up auth user and user profile if client creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      await supabaseAdmin.from('users').delete().eq('id', authData.user.id);
      return res.status(500).json({
        error: 'Failed to create client profile',
        statusCode: 500
      });
    }

    logger.info(`New client created: ${email} (${companyName})`);

    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    logger.error('Create client error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Update client
router.put('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, phone, status } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (companyName) updateData.company_name = companyName;
    if (phone) updateData.phone = phone;
    if (status) updateData.status = status;

    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        user:users(id, email, first_name, last_name, status)
      `)
      .single();

    if (error) {
      logger.error('Error updating client:', error);
      return res.status(400).json({
        error: 'Failed to update client',
        statusCode: 400
      });
    }

    logger.info(`Client updated: ${id}`);

    res.json({
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    logger.error('Update client error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Delete client (admin only)
router.delete('/:id', [validateUUID('id'), requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Delete client from database
    const { error: clientError } = await supabaseAdmin
      .from('clients')
      .delete()
      .eq('id', id);

    if (clientError) {
      logger.error('Error deleting client from database:', clientError);
      return res.status(500).json({
        error: 'Failed to delete client',
        statusCode: 500
      });
    }

    // Delete user from database
    const { error: userError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (userError) {
      logger.error('Error deleting user from database:', userError);
    }

    // Delete user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      logger.error('Error deleting user from auth:', authError);
    }

    logger.info(`Client deleted: ${id}`);

    res.json({
      message: 'Client deleted successfully'
    });
  } catch (error) {
    logger.error('Delete client error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get client's projects
router.get('/:id/projects', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status } = req.query;

    let query = supabaseAdmin.from('projects').select('*', { count: 'exact' }).eq('client_id', id);

    if (status) {
      query = query.eq('status', status);
    }

    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: projects, error, count } = await query;

    if (error) {
      logger.error('Error fetching client projects:', error);
      return res.status(500).json({
        error: 'Failed to fetch client projects',
        statusCode: 500
      });
    }

    res.json({
      projects,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get client projects error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get client statistics
router.get('/:id/stats', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Get project counts by status
    const { data: projectStats, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('status')
      .eq('client_id', id);

    if (projectError) {
      logger.error('Error fetching project stats:', projectError);
      return res.status(500).json({
        error: 'Failed to fetch client statistics',
        statusCode: 500
      });
    }

    // Count projects by status
    const stats = projectStats.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    // Get recent activities
    const { data: activities, error: activityError } = await supabaseAdmin
      .from('client_activities')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (activityError) {
      logger.error('Error fetching client activities:', activityError);
    }

    res.json({
      stats: {
        totalProjects: projectStats.length,
        projectsByStatus: stats
      },
      recentActivities: activities || []
    });
  } catch (error) {
    logger.error('Get client stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;