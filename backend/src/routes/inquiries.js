const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { requireCompanyOrAdmin } = require('../middleware/auth');
const { validateInquiry, validatePagination, validateUUID } = require('../middleware/validation');
const { logger } = require('../config/logger');
const emailService = require('../services/emailService');
const router = express.Router();

// Create new inquiry (public endpoint)
router.post('/', [...validateInquiry], async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .insert({
        name,
        email,
        subject,
        message,
        phone: phone || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating inquiry:', error);
      return res.status(500).json({
        error: 'Failed to create inquiry',
        statusCode: 500
      });
    }

    // Send confirmation email to the inquirer
    await emailService.sendInquiryConfirmation(email, name, subject);

    logger.info(`New inquiry created: ${subject} from ${email}`);

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry: {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        subject: inquiry.subject,
        status: inquiry.status,
        createdAt: inquiry.created_at
      }
    });
  } catch (error) {
    logger.error('Create inquiry error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get all inquiries (company/admin only)
router.get('/', [requireCompanyOrAdmin, ...validatePagination], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, search } = req.query;

    let query = supabaseAdmin.from('inquiries').select('*', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: inquiries, error, count } = await query;

    if (error) {
      logger.error('Error fetching inquiries:', error);
      return res.status(500).json({
        error: 'Failed to fetch inquiries',
        statusCode: 500
      });
    }

    res.json({
      inquiries,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get inquiries error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get inquiry by ID
router.get('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching inquiry:', error);
      return res.status(404).json({
        error: 'Inquiry not found',
        statusCode: 404
      });
    }

    res.json({ inquiry });
  } catch (error) {
    logger.error('Get inquiry error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Update inquiry status
router.patch('/:id/status', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    if (!['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: pending, in_progress, resolved, closed',
        statusCode: 400
      });
    }

    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    if (response) {
      updateData.response = response;
      updateData.responded_at = new Date().toISOString();
      updateData.responded_by = req.user.id;
    }

    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating inquiry status:', error);
      return res.status(400).json({
        error: 'Failed to update inquiry status',
        statusCode: 400
      });
    }

    // Log activity
    await supabaseAdmin
      .from('company_activities')
      .insert({
        user_id: req.user.id,
        activity_type: 'inquiry_status_changed',
        description: `Changed inquiry status to: ${status}`,
        metadata: { inquiry_id: id, new_status: status },
        created_at: new Date().toISOString()
      });

    logger.info(`Inquiry status updated: ${id} -> ${status}`);

    res.json({
      message: 'Inquiry status updated successfully',
      inquiry
    });
  } catch (error) {
    logger.error('Update inquiry status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Delete inquiry
router.delete('/:id', [validateUUID('id'), requireCompanyOrAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting inquiry:', error);
      return res.status(500).json({
        error: 'Failed to delete inquiry',
        statusCode: 500
      });
    }

    logger.info(`Inquiry deleted: ${id}`);

    res.json({
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    logger.error('Delete inquiry error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get inquiry statistics
router.get('/stats/summary', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const { data: inquiries, error } = await supabaseAdmin
      .from('inquiries')
      .select('status, created_at');

    if (error) {
      logger.error('Error fetching inquiry stats:', error);
      return res.status(500).json({
        error: 'Failed to fetch inquiry statistics',
        statusCode: 500
      });
    }

    // Count inquiries by status
    const statusCounts = inquiries.reduce((acc, inquiry) => {
      acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
      return acc;
    }, {});

    // Count inquiries this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthCount = inquiries.filter(
      inquiry => new Date(inquiry.created_at) >= thisMonth
    ).length;

    // Count inquiries today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = inquiries.filter(
      inquiry => new Date(inquiry.created_at) >= today
    ).length;

    res.json({
      stats: {
        total: inquiries.length,
        byStatus: statusCounts,
        thisMonth: thisMonthCount,
        today: todayCount
      }
    });
  } catch (error) {
    logger.error('Get inquiry stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;