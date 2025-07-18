const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { requireCompanyOrAdmin } = require('../middleware/auth');
const { logger } = require('../config/logger');
const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // Calculate date range
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
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get total counts
    const [
      { data: totalUsers, error: usersError },
      { data: totalClients, error: clientsError },
      { data: totalProjects, error: projectsError },
      { data: totalInquiries, error: inquiriesError }
    ] = await Promise.all([
      supabaseAdmin.from('users').select('id', { count: 'exact' }),
      supabaseAdmin.from('clients').select('id', { count: 'exact' }),
      supabaseAdmin.from('projects').select('id', { count: 'exact' }),
      supabaseAdmin.from('inquiries').select('id', { count: 'exact' })
    ]);

    // Get projects by status
    const { data: projectsByStatus, error: projectStatusError } = await supabaseAdmin
      .from('projects')
      .select('status');

    // Get recent activity
    const { data: recentActivity, error: activityError } = await supabaseAdmin
      .from('company_activities')
      .select(`
        *,
        user:users(first_name, last_name)
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Get user registrations over time
    const { data: userRegistrations, error: registrationError } = await supabaseAdmin
      .from('users')
      .select('created_at, role')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Get project completion rate
    const { data: completedProjects, error: completedError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('status', 'completed');

    // Get inquiry response times
    const { data: inquiryStats, error: inquiryStatsError } = await supabaseAdmin
      .from('inquiries')
      .select('created_at, responded_at, status')
      .gte('created_at', startDate.toISOString());

    // Process data for charts
    const projectStatusCounts = projectsByStatus?.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const usersByRole = userRegistrations?.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {}) || {};

    // Calculate average response time for inquiries
    const averageResponseTime = inquiryStats?.reduce((acc, inquiry) => {
      if (inquiry.responded_at) {
        const responseTime = new Date(inquiry.responded_at) - new Date(inquiry.created_at);
        acc.total += responseTime;
        acc.count += 1;
      }
      return acc;
    }, { total: 0, count: 0 });

    const avgResponseHours = averageResponseTime?.count > 0 
      ? Math.round((averageResponseTime.total / averageResponseTime.count) / (1000 * 60 * 60)) 
      : 0;

    // Group registrations by date
    const registrationsByDate = userRegistrations?.reduce((acc, user) => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {}) || {};

    res.json({
      totals: {
        users: totalUsers?.length || 0,
        clients: totalClients?.length || 0,
        projects: totalProjects?.length || 0,
        inquiries: totalInquiries?.length || 0
      },
      projectsByStatus: projectStatusCounts,
      usersByRole,
      completionRate: totalProjects?.length > 0 
        ? Math.round((completedProjects?.length || 0) / totalProjects.length * 100) 
        : 0,
      averageResponseTime: avgResponseHours,
      registrationsByDate,
      recentActivity: recentActivity || [],
      timeRange,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Dashboard analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get user engagement metrics
router.get('/engagement', [requireCompanyOrAdmin], async (req, res) => {
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

    // Get message activity
    const { data: messageActivity, error: messageError } = await supabaseAdmin
      .from('messages')
      .select('created_at, sender_id, recipient_id')
      .gte('created_at', startDate.toISOString());

    // Get project activity
    const { data: projectActivity, error: projectError } = await supabaseAdmin
      .from('company_activities')
      .select('created_at, activity_type, user_id')
      .gte('created_at', startDate.toISOString());

    // Get user login activity (placeholder - would need to track logins)
    const activeUsers = new Set();
    messageActivity?.forEach(msg => {
      activeUsers.add(msg.sender_id);
      activeUsers.add(msg.recipient_id);
    });
    projectActivity?.forEach(activity => {
      activeUsers.add(activity.user_id);
    });

    // Group activities by date
    const activityByDate = {};
    messageActivity?.forEach(msg => {
      const date = new Date(msg.created_at).toISOString().split('T')[0];
      activityByDate[date] = (activityByDate[date] || 0) + 1;
    });

    // Activity types distribution
    const activityTypes = projectActivity?.reduce((acc, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
      return acc;
    }, {}) || {};

    res.json({
      activeUsers: activeUsers.size,
      totalMessages: messageActivity?.length || 0,
      totalActivities: projectActivity?.length || 0,
      activityByDate,
      activityTypes,
      timeRange,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Engagement analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get revenue/financial metrics (placeholder)
router.get('/financial', [requireCompanyOrAdmin], async (req, res) => {
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

    // Get projects with budget information
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('budget, status, created_at')
      .gte('created_at', startDate.toISOString())
      .not('budget', 'is', null);

    if (projectsError) {
      logger.error('Error fetching financial data:', projectsError);
      return res.status(500).json({
        error: 'Failed to fetch financial data',
        statusCode: 500
      });
    }

    // Calculate financial metrics
    const totalBudget = projects?.reduce((sum, project) => sum + (project.budget || 0), 0) || 0;
    const completedProjects = projects?.filter(p => p.status === 'completed') || [];
    const completedRevenue = completedProjects.reduce((sum, project) => sum + (project.budget || 0), 0);

    // Group by month
    const revenueByMonth = {};
    completedProjects.forEach(project => {
      const month = new Date(project.created_at).toISOString().substr(0, 7); // YYYY-MM
      revenueByMonth[month] = (revenueByMonth[month] || 0) + (project.budget || 0);
    });

    // Average project value
    const avgProjectValue = projects?.length > 0 ? totalBudget / projects.length : 0;

    res.json({
      totalBudget,
      completedRevenue,
      pendingRevenue: totalBudget - completedRevenue,
      totalProjects: projects?.length || 0,
      completedProjects: completedProjects.length,
      avgProjectValue,
      revenueByMonth,
      timeRange,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Financial analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get client satisfaction metrics (placeholder)
router.get('/satisfaction', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // This would typically integrate with feedback/rating systems
    // For now, we'll provide placeholder data based on project completion rates
    
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

    const { data: projects, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('status, created_at, client_id')
      .gte('created_at', startDate.toISOString());

    if (projectsError) {
      logger.error('Error fetching satisfaction data:', projectsError);
      return res.status(500).json({
        error: 'Failed to fetch satisfaction data',
        statusCode: 500
      });
    }

    // Calculate satisfaction metrics based on project completion
    const completedProjects = projects?.filter(p => p.status === 'completed') || [];
    const cancelledProjects = projects?.filter(p => p.status === 'cancelled') || [];
    
    const satisfactionRate = projects?.length > 0 
      ? Math.round((completedProjects.length / projects.length) * 100)
      : 0;

    // Get unique clients
    const uniqueClients = new Set(projects?.map(p => p.client_id) || []);

    res.json({
      satisfactionRate,
      totalProjects: projects?.length || 0,
      completedProjects: completedProjects.length,
      cancelledProjects: cancelledProjects.length,
      uniqueClients: uniqueClients.size,
      timeRange,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Satisfaction analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Export analytics data
router.get('/export', [requireCompanyOrAdmin], async (req, res) => {
  try {
    const { format = 'json', timeRange = '30d' } = req.query;
    
    // Get all analytics data
    const dashboardData = await getDashboardData(timeRange);
    const engagementData = await getEngagementData(timeRange);
    const financialData = await getFinancialData(timeRange);

    const exportData = {
      dashboard: dashboardData,
      engagement: engagementData,
      financial: financialData,
      exportedAt: new Date().toISOString(),
      timeRange
    };

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csvData = convertToCSV(exportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${timeRange}.csv"`);
      res.send(csvData);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${timeRange}.json"`);
      res.json(exportData);
    }

    logger.info(`Analytics data exported in ${format} format for ${timeRange} by user ${req.user.id}`);
  } catch (error) {
    logger.error('Export analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Helper functions
async function getDashboardData(timeRange) {
  // Implementation similar to dashboard endpoint
  return {};
}

async function getEngagementData(timeRange) {
  // Implementation similar to engagement endpoint
  return {};
}

async function getFinancialData(timeRange) {
  // Implementation similar to financial endpoint
  return {};
}

function convertToCSV(data) {
  // Simple CSV conversion (would need proper implementation)
  return 'data,value\n' + Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');
}

module.exports = router;