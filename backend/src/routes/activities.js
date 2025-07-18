const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { requireCompanyOrAdmin } = require('../middleware/auth');
const { validatePagination, validateUUID } = require('../middleware/validation');
const { logger } = require('../config/logger');
const router = express.Router();

// Get all activities
router.get('/', [requireCompanyOrAdmin, ...validatePagination], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { type, userId, activityType } = req.query;

    let query;
    
    // Determine which activity table to query
    if (type === 'client') {
      query = supabaseAdmin.from('client_activities').select(`
        *,
        client:clients(
          id,
          company_name,
          user:users(id, first_name, last_name, email)
        )
      `, { count: 'exact' });
    } else {
      // Default to company activities
      query = supabaseAdmin.from('company_activities').select(`
        *,
        user:users(id, first_name, last_name, email, role)
      `, { count: 'exact' });
    }

    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: activities, error, count } = await query;

    if (error) {
      logger.error('Error fetching activities:', error);
      return res.status(500).json({
        error: 'Failed to fetch activities',
        statusCode: 500
      });
    }

    res.json({
      activities,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get activities error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get activity by ID
router.get('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    let query;
    
    if (type === 'client') {
      query = supabaseAdmin.from('client_activities').select(`
        *,
        client:clients(
          id,
          company_name,
          user:users(id, first_name, last_name, email)
        )
      `);
    } else {
      query = supabaseAdmin.from('company_activities').select(`
        *,
        user:users(id, first_name, last_name, email, role)
      `);
    }

    const { data: activity, error } = await query.eq('id', id).single();

    if (error) {
      logger.error('Error fetching activity:', error);
      return res.status(404).json({
        error: 'Activity not found',
        statusCode: 404
      });
    }

    res.json({ activity });
  } catch (error) {
    logger.error('Get activity error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Create new activity (company activities)
router.post('/', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const { activityType, description, metadata } = req.body;

    if (!activityType || !description) {
      return res.status(400).json({
        error: 'Activity type and description are required',
        statusCode: 400
      });
    }

    const { data: activity, error } = await supabaseAdmin
      .from('company_activities')
      .insert({
        user_id: req.user.id,
        activity_type: activityType,
        description,
        metadata: metadata || null,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        user:users(id, first_name, last_name, email, role)
      `)
      .single();

    if (error) {
      logger.error('Error creating activity:', error);
      return res.status(500).json({
        error: 'Failed to create activity',
        statusCode: 500
      });
    }

    logger.info(`Activity created: ${activityType} by user ${req.user.id}`);

    res.status(201).json({
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    logger.error('Create activity error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Create client activity
router.post('/client', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const { clientId, activityType, description, metadata } = req.body;

    if (!clientId || !activityType || !description) {
      return res.status(400).json({
        error: 'Client ID, activity type, and description are required',
        statusCode: 400
      });
    }

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

    const { data: activity, error } = await supabaseAdmin
      .from('client_activities')
      .insert({
        client_id: clientId,
        activity_type: activityType,
        description,
        metadata: metadata || null,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        client:clients(
          id,
          company_name,
          user:users(id, first_name, last_name, email)
        )
      `)
      .single();

    if (error) {
      logger.error('Error creating client activity:', error);
      return res.status(500).json({
        error: 'Failed to create client activity',
        statusCode: 500
      });
    }

    logger.info(`Client activity created: ${activityType} for client ${clientId}`);

    res.status(201).json({
      message: 'Client activity created successfully',
      activity
    });
  } catch (error) {
    logger.error('Create client activity error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get activities for a specific client
router.get('/client/:clientId', [validateUUID('clientId'), requireCompanyOrAdmin, ...validatePagination], async (req, res) => {
  try {
    const { clientId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { activityType } = req.query;

    let query = supabaseAdmin.from('client_activities').select(`
      *,
      client:clients(
        id,
        company_name,
        user:users(id, first_name, last_name, email)
      )
    `, { count: 'exact' }).eq('client_id', clientId);

    // Apply filters
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: activities, error, count } = await query;

    if (error) {
      logger.error('Error fetching client activities:', error);
      return res.status(500).json({
        error: 'Failed to fetch client activities',
        statusCode: 500
      });
    }

    res.json({
      activities,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get client activities error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get activities for a specific user
router.get('/user/:userId', [validateUUID('userId'), requireCompanyOrAdmin, ...validatePagination], async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { activityType } = req.query;

    let query = supabaseAdmin.from('company_activities').select(`
      *,
      user:users(id, first_name, last_name, email, role)
    `, { count: 'exact' }).eq('user_id', userId);

    // Apply filters
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: activities, error, count } = await query;

    if (error) {
      logger.error('Error fetching user activities:', error);
      return res.status(500).json({
        error: 'Failed to fetch user activities',
        statusCode: 500
      });
    }

    res.json({
      activities,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get user activities error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Delete activity
router.delete('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    let tableName = type === 'client' ? 'client_activities' : 'company_activities';

    const { error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting activity:', error);
      return res.status(500).json({
        error: 'Failed to delete activity',
        statusCode: 500
      });
    }

    logger.info(`Activity deleted: ${id} from ${tableName}`);

    res.json({
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    logger.error('Delete activity error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get activity statistics
router.get('/stats/summary', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get company activities
    const { data: companyActivities, error: companyError } = await supabaseAdmin
      .from('company_activities')
      .select('activity_type, created_at')
      .gte('created_at', startDate.toISOString());

    // Get client activities
    const { data: clientActivities, error: clientError } = await supabaseAdmin
      .from('client_activities')
      .select('activity_type, created_at')
      .gte('created_at', startDate.toISOString());

    if (companyError || clientError) {
      logger.error('Error fetching activity stats:', companyError || clientError);
      return res.status(500).json({
        error: 'Failed to fetch activity statistics',
        statusCode: 500
      });
    }

    // Count by activity type
    const companyTypeCounts = companyActivities.reduce((acc, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
      return acc;
    }, {});

    const clientTypeCounts = clientActivities.reduce((acc, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
      return acc;
    }, {});

    // Count by date
    const allActivities = [...companyActivities, ...clientActivities];
    const activitiesByDate = allActivities.reduce((acc, activity) => {
      const date = new Date(activity.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Count today's activities
    const today = new Date().toISOString().split('T')[0];
    const todayCount = allActivities.filter(
      activity => activity.created_at.startsWith(today)
    ).length;

    res.json({
      stats: {
        total: allActivities.length,
        company: companyActivities.length,
        client: clientActivities.length,
        today: todayCount,
        byType: {
          company: companyTypeCounts,
          client: clientTypeCounts
        },
        byDate: activitiesByDate
      },
      timeRange
    });
  } catch (error) {
    logger.error('Get activity stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get activity types
router.get('/types/list', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const activityTypes = {
      company: [
        'user_created',
        'user_updated',
        'user_deleted',
        'client_created',
        'client_updated',
        'client_deleted',
        'project_created',
        'project_updated',
        'project_deleted',
        'project_status_changed',
        'approval_requested',
        'approval_approved',
        'approval_rejected',
        'approval_deleted',
        'inquiry_status_changed',
        'message_sent',
        'file_uploaded',
        'file_deleted',
        'settings_updated',
        'login',
        'logout'
      ],
      client: [
        'profile_updated',
        'project_viewed',
        'message_sent',
        'file_uploaded',
        'file_downloaded',
        'approval_responded',
        'inquiry_submitted',
        'login',
        'logout'
      ]
    };

    res.json({
      activityTypes
    });
  } catch (error) {
    logger.error('Get activity types error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;