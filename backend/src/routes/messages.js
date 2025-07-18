const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { validateMessage, validatePagination, validateUUID } = require('../middleware/validation');
const { logger } = require('../config/logger');
const emailService = require('../services/emailService');
const router = express.Router();

// Get all messages for current user
router.get('/', [...validatePagination], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { conversationWith } = req.query;

    let query = supabaseAdmin.from('messages').select(`
      *,
      sender:users!messages_sender_id_fkey(id, first_name, last_name, email, role),
      recipient:users!messages_recipient_id_fkey(id, first_name, last_name, email, role)
    `, { count: 'exact' });

    // Filter messages where user is either sender or recipient
    if (conversationWith) {
      query = query.or(`and(sender_id.eq.${req.user.id},recipient_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},recipient_id.eq.${req.user.id})`);
    } else {
      query = query.or(`sender_id.eq.${req.user.id},recipient_id.eq.${req.user.id}`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: messages, error, count } = await query;

    if (error) {
      logger.error('Error fetching messages:', error);
      return res.status(500).json({
        error: 'Failed to fetch messages',
        statusCode: 500
      });
    }

    res.json({
      messages,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get message by ID
router.get('/:id', [validateUUID('id')], async (req, res) => {
  try {
    const { id } = req.params;

    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, first_name, last_name, email, role),
        recipient:users!messages_recipient_id_fkey(id, first_name, last_name, email, role)
      `)
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching message:', error);
      return res.status(404).json({
        error: 'Message not found',
        statusCode: 404
      });
    }

    // Check if user is authorized to view this message
    if (message.sender_id !== req.user.id && message.recipient_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied to this message',
        statusCode: 403
      });
    }

    // Mark as read if user is the recipient
    if (message.recipient_id === req.user.id && !message.read_at) {
      await supabaseAdmin
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id);
    }

    res.json({ message });
  } catch (error) {
    logger.error('Get message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Send new message
router.post('/', [...validateMessage], async (req, res) => {
  try {
    const { content, recipientId } = req.body;

    // Verify recipient exists
    const { data: recipient, error: recipientError } = await supabaseAdmin
      .from('users')
      .select('id, first_name, last_name, email')
      .eq('id', recipientId)
      .single();

    if (recipientError || !recipient) {
      return res.status(400).json({
        error: 'Recipient not found',
        statusCode: 400
      });
    }

    // Get sender info
    const { data: sender, error: senderError } = await supabaseAdmin
      .from('users')
      .select('id, first_name, last_name, email')
      .eq('id', req.user.id)
      .single();

    if (senderError || !sender) {
      return res.status(400).json({
        error: 'Sender not found',
        statusCode: 400
      });
    }

    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .insert({
        sender_id: req.user.id,
        recipient_id: recipientId,
        content,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, first_name, last_name, email, role),
        recipient:users!messages_recipient_id_fkey(id, first_name, last_name, email, role)
      `)
      .single();

    if (error) {
      logger.error('Error creating message:', error);
      return res.status(500).json({
        error: 'Failed to send message',
        statusCode: 500
      });
    }

    // Send email notification to recipient
    const senderName = `${sender.first_name} ${sender.last_name}`;
    const recipientName = `${recipient.first_name} ${recipient.last_name}`;
    const messagePreview = content.length > 100 ? content.substring(0, 100) + '...' : content;

    await emailService.sendNewMessageNotification(
      recipient.email,
      recipientName,
      senderName,
      messagePreview
    );

    logger.info(`Message sent from ${req.user.id} to ${recipientId}`);

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: message
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Mark message as read
router.patch('/:id/read', [validateUUID('id')], async (req, res) => {
  try {
    const { id } = req.params;

    // Verify user is the recipient
    const { data: message, error: fetchError } = await supabaseAdmin
      .from('messages')
      .select('recipient_id, read_at')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({
        error: 'Message not found',
        statusCode: 404
      });
    }

    if (message.recipient_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        statusCode: 403
      });
    }

    if (message.read_at) {
      return res.status(400).json({
        error: 'Message already marked as read',
        statusCode: 400
      });
    }

    const { error } = await supabaseAdmin
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      logger.error('Error marking message as read:', error);
      return res.status(500).json({
        error: 'Failed to mark message as read',
        statusCode: 500
      });
    }

    logger.info(`Message marked as read: ${id}`);

    res.json({
      message: 'Message marked as read successfully'
    });
  } catch (error) {
    logger.error('Mark message as read error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Delete message
router.delete('/:id', [validateUUID('id')], async (req, res) => {
  try {
    const { id } = req.params;

    // Verify user is the sender
    const { data: message, error: fetchError } = await supabaseAdmin
      .from('messages')
      .select('sender_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({
        error: 'Message not found',
        statusCode: 404
      });
    }

    if (message.sender_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied. You can only delete your own messages.',
        statusCode: 403
      });
    }

    const { error } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting message:', error);
      return res.status(500).json({
        error: 'Failed to delete message',
        statusCode: 500
      });
    }

    logger.info(`Message deleted: ${id}`);

    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get conversations list
router.get('/conversations/list', async (req, res) => {
  try {
    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, first_name, last_name, email, role),
        recipient:users!messages_recipient_id_fkey(id, first_name, last_name, email, role)
      `)
      .or(`sender_id.eq.${req.user.id},recipient_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching conversations:', error);
      return res.status(500).json({
        error: 'Failed to fetch conversations',
        statusCode: 500
      });
    }

    // Group messages by conversation partner
    const conversations = {};
    messages.forEach(message => {
      const partnerId = message.sender_id === req.user.id ? message.recipient_id : message.sender_id;
      const partner = message.sender_id === req.user.id ? message.recipient : message.sender;
      
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partner,
          lastMessage: message,
          unreadCount: 0
        };
      }

      // Count unread messages where current user is recipient
      if (message.recipient_id === req.user.id && !message.read_at) {
        conversations[partnerId].unreadCount++;
      }
    });

    const conversationList = Object.values(conversations).sort((a, b) => 
      new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
    );

    res.json({
      conversations: conversationList
    });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

// Get unread message count
router.get('/unread/count', async (req, res) => {
  try {
    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select('id')
      .eq('recipient_id', req.user.id)
      .is('read_at', null);

    if (error) {
      logger.error('Error fetching unread count:', error);
      return res.status(500).json({
        error: 'Failed to fetch unread count',
        statusCode: 500
      });
    }

    res.json({
      unreadCount: messages.length
    });
  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});

module.exports = router;