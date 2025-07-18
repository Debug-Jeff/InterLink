const { Resend } = require('resend');
const { logger } = require('../config/logger');

// Initialize Resend only if API key is provided
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  logger.warn('Resend API key not configured. Email functionality will be disabled.');
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@interlink.com';
const FROM_NAME = process.env.FROM_NAME || 'InterLink';

class EmailService {
  constructor() {
    this.fromEmail = FROM_EMAIL;
    this.fromName = FROM_NAME;
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      // Check if Resend is configured
      if (!resend) {
        logger.warn(`Email sending skipped (Resend not configured): ${subject} to ${to}`);
        return { success: true, message: 'Email sending skipped - Resend not configured' };
      }

      const result = await resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [to],
        subject,
        html,
        text: text || this.stripHtml(html)
      });

      logger.info(`Email sent successfully to ${to}: ${subject}`);
      return { success: true, id: result.data?.id };
    } catch (error) {
      logger.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(userEmail, userName, userRole) {
    const subject = 'Welcome to InterLink!';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to InterLink</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to InterLink</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Welcome to InterLink, your new platform for seamless project management and client collaboration.</p>
              <p>Your account has been created with the role: <strong>${userRole}</strong></p>
              <p>You can now log in to your account and start exploring the platform.</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/auth/signin" class="button">Login to InterLink</a>
              </p>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2024 InterLink. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendPasswordResetEmail(userEmail, resetLink) {
    const subject = 'Password Reset Request';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password for your InterLink account.</p>
              <p>Click the button below to reset your password:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </p>
              <div class="warning">
                <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
              </div>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>© 2024 InterLink. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendProjectStatusUpdateEmail(clientEmail, clientName, projectTitle, newStatus) {
    const subject = `Project Status Update: ${projectTitle}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
            .status-completed { background: #D1FAE5; color: #065F46; }
            .status-in-progress { background: #DBEAFE; color: #1E40AF; }
            .status-pending { background: #FEF3C7; color: #92400E; }
            .status-cancelled { background: #FEE2E2; color: #991B1B; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Project Status Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${clientName}!</h2>
              <p>Your project <strong>"${projectTitle}"</strong> status has been updated.</p>
              <p>New Status: <span class="status-badge status-${newStatus.toLowerCase().replace('_', '-')}">${newStatus.replace('_', ' ')}</span></p>
              <p>You can view more details about your project by logging into your account.</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/client/projects" class="button">View Project</a>
              </p>
              <p>If you have any questions about this update, please don't hesitate to contact us.</p>
            </div>
            <div class="footer">
              <p>© 2024 InterLink. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(clientEmail, subject, html);
  }

  async sendNewMessageNotification(recipientEmail, recipientName, senderName, messagePreview) {
    const subject = `New Message from ${senderName}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Message</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .message-preview { background: white; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Message</h1>
            </div>
            <div class="content">
              <h2>Hello ${recipientName}!</h2>
              <p>You have received a new message from <strong>${senderName}</strong>.</p>
              <div class="message-preview">
                <p><strong>Message Preview:</strong></p>
                <p>${messagePreview}</p>
              </div>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/messages" class="button">View Messages</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2024 InterLink. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(recipientEmail, subject, html);
  }

  async sendInquiryConfirmation(inquiryEmail, inquiryName, inquirySubject) {
    const subject = 'Thank you for your inquiry';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for your inquiry</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Inquiry</h1>
            </div>
            <div class="content">
              <h2>Hello ${inquiryName}!</h2>
              <p>Thank you for reaching out to InterLink. We have received your inquiry regarding:</p>
              <p><strong>${inquirySubject}</strong></p>
              <p>Our team will review your message and get back to you within 24 hours.</p>
              <p>We appreciate your interest in our services and look forward to helping you with your project needs.</p>
            </div>
            <div class="footer">
              <p>© 2024 InterLink. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(inquiryEmail, subject, html);
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>?/gm, '');
  }
}

module.exports = new EmailService();