const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { requireCompanyOrAdmin } = require('../middleware/auth');
const { validatePagination, validateUUID } = require('../middleware/validation');
const { logger } = require('../config/logger');
const router = express.Router();

// Get all approvals
router.get('/', [requireCompanyOrAdmin, ...validatePagination], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, type, clientId } = req.query;

    let query = supabaseAdmin.from('approvals').select(`
      *,
      client:clients(
        id,
        company_name,
        user:users(id, first_name, last_name, email)
      ),
      project:projects(id, title)
    `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: approvals, error, count } = await query;

    if (error) {
      logger.error('Error fetching approvals:', error);
      return res.status(500).json({
        error: 'Failed to fetch approvals',
        statusCode: 500
      });
    }

    res.json({
      approvals,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get approvals error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get approval by ID
router.get('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const { data: approval, error } = await supabaseAdmin
      .from('approvals')
      .select(`
        *,
        client:clients(
          id,
          company_name,
          user:users(id, first_name, last_name, email)
        ),
        project:projects(id, title),
        requester:users!approvals_requested_by_fkey(id, first_name, last_name, email),
        approver:users!approvals_approved_by_fkey(id, first_name, last_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching approval:', error);
      return res.status(404).json({
        error: 'Approval not found',
        statusCode: 404
      });
    }

    res.json({ approval });
  } catch (error) {
    logger.error('Get approval error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Create new approval request
router.post('/', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const { 
      type, 
      title, 
      description, 
      clientId, 
      projectId, 
      metadata,
      requiredApprovals = 1
    } = req.body;

    // Validate required fields
    if (!type || !title || !description || !clientId) {
      return res.status(400).json({
        error: 'Missing required fields: type, title, description, clientId',
        statusCode: 400
      });
    }

    // Validate approval type
    const validTypes = ['project_start', 'project_completion', 'budget_change', 'scope_change', 'timeline_change', 'custom'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid approval type. Must be one of: ${validTypes.join(', ')}`,
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

    // Verify project exists if projectId is provided
    if (projectId) {
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .single();

      if (projectError || !project) {
        return res.status(400).json({
          error: 'Project not found',
          statusCode: 400
        });
      }
    }

    const { data: approval, error } = await supabaseAdmin
      .from('approvals')
      .insert({
        type,
        title,
        description,
        client_id: clientId,
        project_id: projectId || null,
        metadata: metadata || null,
        required_approvals: requiredApprovals,
        current_approvals: 0,
        status: 'pending',
        requested_by: req.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        client:clients(
          id,
          company_name,
          user:users(id, first_name, last_name, email)
        ),
        project:projects(id, title),
        requester:users!approvals_requested_by_fkey(id, first_name, last_name, email)
      `)
      .single();

    if (error) {
      logger.error('Error creating approval:', error);
      return res.status(500).json({
        error: 'Failed to create approval request',
        statusCode: 500
      });
    }

    // Log activity
    await supabaseAdmin
      .from('company_activities')
      .insert({
        user_id: req.user.id,
        activity_type: 'approval_requested',
        description: `Requested approval: ${title}`,
        metadata: { approval_id: approval.id, type, client_id: clientId },
        created_at: new Date().toISOString()
      });

    logger.info(`Approval request created: ${title} for client ${clientId}`);

    res.status(201).json({
      message: 'Approval request created successfully',
      approval
    });
  } catch (error) {
    logger.error('Create approval error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Update approval status
router.patch('/:id/status', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comments } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        error: 'Invalid action. Must be either "approve" or "reject"',
        statusCode: 400
      });
    }

    // Get current approval
    const { data: currentApproval, error: fetchError } = await supabaseAdmin
      .from('approvals')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentApproval) {
      return res.status(404).json({
        error: 'Approval not found',
        statusCode: 404
      });
    }

    if (currentApproval.status !== 'pending') {
      return res.status(400).json({
        error: 'Approval is not in pending status',
        statusCode: 400
      });
    }

    let updateData = {
      updated_at: new Date().toISOString()
    };

    if (action === 'approve') {
      const newApprovalCount = currentApproval.current_approvals + 1;
      updateData.current_approvals = newApprovalCount;
      updateData.approved_by = req.user.id;
      updateData.approved_at = new Date().toISOString();
      
      // Check if we have enough approvals
      if (newApprovalCount >= currentApproval.required_approvals) {
        updateData.status = 'approved';
      }
    } else {
      updateData.status = 'rejected';
      updateData.rejected_by = req.user.id;
      updateData.rejected_at = new Date().toISOString();
    }

    if (comments) {
      updateData.comments = comments;
    }

    const { data: approval, error } = await supabaseAdmin
      .from('approvals')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        client:clients(
          id,
          company_name,
          user:users(id, first_name, last_name, email)
        ),
        project:projects(id, title),
        requester:users!approvals_requested_by_fkey(id, first_name, last_name, email),
        approver:users!approvals_approved_by_fkey(id, first_name, last_name, email)
      `)
      .single();

    if (error) {
      logger.error('Error updating approval status:', error);
      return res.status(400).json({
        error: 'Failed to update approval status',
        statusCode: 400
      });
    }

    // Log activity
    await supabaseAdmin
      .from('company_activities')
      .insert({
        user_id: req.user.id,
        activity_type: `approval_${action}${action === 'approve' && approval.status === 'approved' ? 'ed' : 'ed'}`,
        description: `${action.charAt(0).toUpperCase() + action.slice(1)}${action === 'approve' && approval.status === 'approved' ? 'ed' : 'ed'} approval: ${approval.title}`,
        metadata: { approval_id: id, action, final_status: approval.status },
        created_at: new Date().toISOString()
      });

    logger.info(`Approval ${action}ed: ${id} by user ${req.user.id}`);

    res.json({
      message: `Approval ${action}ed successfully`,
      approval
    });
  } catch (error) {
    logger.error('Update approval status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Delete approval
router.delete('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Get approval details before deletion
    const { data: approval, error: fetchError } = await supabaseAdmin
      .from('approvals')
      .select('title, client_id, requested_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({
        error: 'Approval not found',
        statusCode: 404
      });
    }

    // Check if user can delete (only requester or admin)
    if (approval.requested_by !== req.user.id && req.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Access denied. You can only delete your own approval requests.',
        statusCode: 403
      });
    }

    const { error } = await supabaseAdmin
      .from('approvals')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting approval:', error);
      return res.status(500).json({
        error: 'Failed to delete approval',
        statusCode: 500
      });
    }

    // Log activity
    await supabaseAdmin
      .from('company_activities')
      .insert({
        user_id: req.user.id,
        activity_type: 'approval_deleted',
        description: `Deleted approval: ${approval.title}`,
        metadata: { approval_id: id, client_id: approval.client_id },
        created_at: new Date().toISOString()
      });

    logger.info(`Approval deleted: ${id}`);

    res.json({
      message: 'Approval deleted successfully'
    });
  } catch (error) {
    logger.error('Delete approval error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get approval statistics
router.get('/stats/summary', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const { data: approvals, error } = await supabaseAdmin
      .from('approvals')
      .select('status, type, created_at');

    if (error) {
      logger.error('Error fetching approval stats:', error);
      return res.status(500).json({
        error: 'Failed to fetch approval statistics',
        statusCode: 500
      });
    }

    // Count by status
    const statusCounts = approvals.reduce((acc, approval) => {
      acc[approval.status] = (acc[approval.status] || 0) + 1;
      return acc;
    }, {});

    // Count by type
    const typeCounts = approvals.reduce((acc, approval) => {
      acc[approval.type] = (acc[approval.type] || 0) + 1;
      return acc;
    }, {});

    // Count this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthCount = approvals.filter(
      approval => new Date(approval.created_at) >= thisMonth
    ).length;

    // Count pending approvals
    const pendingCount = approvals.filter(
      approval => approval.status === 'pending'
    ).length;

    res.json({
      stats: {
        total: approvals.length,
        byStatus: statusCounts,
        byType: typeCounts,
        thisMonth: thisMonthCount,
        pending: pendingCount
      }
    });
  } catch (error) {
    logger.error('Get approval stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;