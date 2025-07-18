const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { requireCompanyOrAdmin } = require('../middleware/auth');
const { validateProjectCreation, validatePagination, validateUUID } = require('../middleware/validation');
const { logger } = require('../config/logger');
const router = express.Router();

// Get all projects
router.get('/', [requireCompanyOrAdmin, ...validatePagination], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, clientId, search } = req.query;

    let query = supabaseAdmin.from('projects').select(`
      *,
      client:clients(
        id,
        company_name,
        phone,
        user:users(id, email, first_name, last_name)
      )
    `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: projects, error, count } = await query;

    if (error) {
      logger.error('Error fetching projects:', error);
      return res.status(500).json({
        error: 'Failed to fetch projects',
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
    logger.error('Get projects error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get project by ID
router.get('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        client:clients(
          id,
          company_name,
          phone,
          user:users(id, email, first_name, last_name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching project:', error);
      return res.status(404).json({
        error: 'Project not found',
        statusCode: 404
      });
    }

    res.json({ project });
  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Create new project
router.post('/', [requireCompanyOrAdmin, ...validateProjectCreation], async (req, res) => {
  try {
    const { title, description, clientId, budget, deadline, status = 'pending' } = req.body;

    // Verify client exists
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      return res.status(400).json({
        error: 'Client not found',
        statusCode: 400
      });
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert({
        title,
        description,
        client_id: clientId,
        budget: budget || null,
        deadline: deadline || null,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        client:clients(
          id,
          company_name,
          phone,
          user:users(id, email, first_name, last_name)
        )
      `)
      .single();

    if (error) {
      logger.error('Error creating project:', error);
      return res.status(500).json({
        error: 'Failed to create project',
        statusCode: 500
      });
    }

    // Log activity
    await supabaseAdmin
      .from('company_activities')
      .insert({
        user_id: req.user.id,
        activity_type: 'project_created',
        description: `Created project: ${title}`,
        metadata: { project_id: project.id, client_id: clientId },
        created_at: new Date().toISOString()
      });

    logger.info(`New project created: ${title} for client ${clientId}`);

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    logger.error('Create project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Update project
router.put('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, budget, deadline, status } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (budget !== undefined) updateData.budget = budget;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (status) updateData.status = status;

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        client:clients(
          id,
          company_name,
          phone,
          user:users(id, email, first_name, last_name)
        )
      `)
      .single();

    if (error) {
      logger.error('Error updating project:', error);
      return res.status(400).json({
        error: 'Failed to update project',
        statusCode: 400
      });
    }

    // Log activity
    await supabaseAdmin
      .from('company_activities')
      .insert({
        user_id: req.user.id,
        activity_type: 'project_updated',
        description: `Updated project: ${project.title}`,
        metadata: { project_id: id, changes: updateData },
        created_at: new Date().toISOString()
      });

    logger.info(`Project updated: ${id}`);

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    logger.error('Update project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Delete project
router.delete('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Get project details before deletion
    const { data: project, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('title, client_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      logger.error('Error fetching project for deletion:', fetchError);
      return res.status(404).json({
        error: 'Project not found',
        statusCode: 404
      });
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting project:', error);
      return res.status(500).json({
        error: 'Failed to delete project',
        statusCode: 500
      });
    }

    // Log activity
    await supabaseAdmin
      .from('company_activities')
      .insert({
        user_id: req.user.id,
        activity_type: 'project_deleted',
        description: `Deleted project: ${project.title}`,
        metadata: { project_id: id, client_id: project.client_id },
        created_at: new Date().toISOString()
      });

    logger.info(`Project deleted: ${id}`);

    res.json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    logger.error('Delete project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get project files
router.get('/:id/files', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // In a real implementation, you would fetch files from Supabase Storage
    // For now, we'll return a placeholder response
    res.json({
      files: [],
      message: 'File listing will be implemented with Supabase Storage'
    });
  } catch (error) {
    logger.error('Get project files error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Update project status
router.patch('/:id/status', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: pending, in_progress, completed, cancelled',
        statusCode: 400
      });
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        client:clients(
          id,
          company_name,
          phone,
          user:users(id, email, first_name, last_name)
        )
      `)
      .single();

    if (error) {
      logger.error('Error updating project status:', error);
      return res.status(400).json({
        error: 'Failed to update project status',
        statusCode: 400
      });
    }

    // Log activity
    await supabaseAdmin
      .from('company_activities')
      .insert({
        user_id: req.user.id,
        activity_type: 'project_status_changed',
        description: `Changed project status to: ${status}`,
        metadata: { project_id: id, new_status: status },
        created_at: new Date().toISOString()
      });

    logger.info(`Project status updated: ${id} -> ${status}`);

    res.json({
      message: 'Project status updated successfully',
      project
    });
  } catch (error) {
    logger.error('Update project status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get project statistics
router.get('/:id/stats', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Get project with basic stats
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching project for stats:', error);
      return res.status(404).json({
        error: 'Project not found',
        statusCode: 404
      });
    }

    // Calculate project duration
    const createdAt = new Date(project.created_at);
    const now = new Date();
    const durationDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

    // Get activity count (placeholder)
    const { data: activities, error: activityError } = await supabaseAdmin
      .from('company_activities')
      .select('id')
      .eq('metadata->project_id', id);

    const activityCount = activities?.length || 0;

    res.json({
      stats: {
        durationDays,
        activityCount,
        status: project.status,
        budget: project.budget,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      }
    });
  } catch (error) {
    logger.error('Get project stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;