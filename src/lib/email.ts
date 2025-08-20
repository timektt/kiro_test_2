import nodemailer from 'nodemailer'
import { logger } from './logger'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

interface NotificationEmailData {
  recipientName: string
  senderName: string
  notificationType: 'like' | 'comment' | 'follow' | 'mention' | 'chat'
  contentPreview?: string
  actionUrl: string
}

interface WelcomeEmailData {
  recipientName: string
  username: string
  verificationUrl?: string
}

class EmailService {
  private transporter: nodemailer.Transporter
  private isConfigured: boolean = false

  constructor() {
    this.setupTransporter()
  }

  private setupTransporter() {
    try {
      // Check if email configuration is available
      const emailConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      }

      // If no SMTP configuration, use development mode
      if (!emailConfig.host || !emailConfig.auth.user) {
        logger.warn('SMTP configuration not found, using development mode')
        
        // Create test account for development
        nodemailer.createTestAccount().then((testAccount) => {
          this.transporter = nodemailer.createTransporter({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass
            }
          })
          this.isConfigured = true
          logger.info('Email service configured with test account')
        }).catch((error) => {
          logger.error('Failed to create test email account:', error)
        })
        return
      }

      this.transporter = nodemailer.createTransporter(emailConfig)
      this.isConfigured = true
      logger.info('Email service configured with SMTP')

      // Verify connection
      this.transporter.verify((error) => {
        if (error) {
          logger.error('SMTP connection verification failed:', error)
          this.isConfigured = false
        } else {
          logger.info('SMTP connection verified successfully')
        }
      })

    } catch (error) {
      logger.error('Failed to setup email transporter:', error)
      this.isConfigured = false
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured) {
      logger.warn('Email service not configured, skipping email send')
      return false
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'Community Platform <noreply@community-platform.com>',
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      }

      const info = await this.transporter.sendMail(mailOptions)
      
      // Log preview URL for development
      if (process.env.NODE_ENV === 'development') {
        const previewUrl = nodemailer.getTestMessageUrl(info)
        if (previewUrl) {
          logger.info(`Email preview URL: ${previewUrl}`)
        }
      }

      logger.info(`Email sent successfully to ${options.to}`, {
        messageId: info.messageId,
        subject: options.subject
      })

      return true
    } catch (error) {
      logger.error('Failed to send email:', error)
      return false
    }
  }

  async sendNotificationEmail(to: string, data: NotificationEmailData): Promise<boolean> {
    const subject = this.getNotificationSubject(data.notificationType, data.senderName)
    const html = this.generateNotificationEmailHTML(data)
    const text = this.generateNotificationEmailText(data)

    return this.sendEmail({
      to,
      subject,
      html,
      text
    })
  }

  async sendWelcomeEmail(to: string, data: WelcomeEmailData): Promise<boolean> {
    const subject = 'Welcome to Community Platform!'
    const html = this.generateWelcomeEmailHTML(data)
    const text = this.generateWelcomeEmailText(data)

    return this.sendEmail({
      to,
      subject,
      html,
      text
    })
  }

  private getNotificationSubject(type: string, senderName: string): string {
    switch (type) {
      case 'like':
        return `${senderName} liked your post`
      case 'comment':
        return `${senderName} commented on your post`
      case 'follow':
        return `${senderName} started following you`
      case 'mention':
        return `${senderName} mentioned you in a post`
      case 'chat':
        return `${senderName} sent you a message`
      default:
        return 'You have a new notification'
    }
  }

  private generateNotificationEmailHTML(data: NotificationEmailData): string {
    const { recipientName, senderName, notificationType, contentPreview, actionUrl } = data
    
    const actionText = {
      like: 'liked your post',
      comment: 'commented on your post',
      follow: 'started following you',
      mention: 'mentioned you in a post',
      chat: 'sent you a message'
    }[notificationType] || 'sent you a new notification'

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notification - Community Platform</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #e0e0e0; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .content { padding: 30px 0; }
          .notification { background-color: #f8fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb; margin: 20px 0; }
          .action-button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .action-button:hover { background-color: #1d4ed8; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
          .preview { background-color: #f1f5f9; padding: 15px; border-radius: 4px; margin: 15px 0; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Community Platform</div>
          </div>
          
          <div class="content">
            <h2>Hello ${recipientName}!</h2>
            
            <div class="notification">
              <h3>[NOTIFICATION] New Notification</h3>
              <p><strong>${senderName}</strong> ${actionText}</p>
              ${contentPreview ? `<div class="preview">"${contentPreview}"</div>` : ''}
            </div>
            
            <p>Click the button below to view more details:</p>
            
            <a href="${actionUrl}" class="action-button">View Details</a>
            
            <p>Or copy this link to your browser: <br>
            <a href="${actionUrl}">${actionUrl}</a></p>
          </div>
          
          <div class="footer">
            <p>This email was sent automatically. Please do not reply.</p>
            <p>© 2024 Community Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generateNotificationEmailText(data: NotificationEmailData): string {
    const { recipientName, senderName, notificationType, contentPreview, actionUrl } = data
    
    const actionText = {
      like: 'liked your post',
      comment: 'commented on your post',
      follow: 'started following you',
      mention: 'mentioned you in a post',
      chat: 'sent you a message'
    }[notificationType] || 'sent you a new notification'

    return `
Hello ${recipientName}!

New Notification:
${senderName} ${actionText}

${contentPreview ? (() => {
  const contentLabel = 'Content: '
  return `${contentLabel}"${contentPreview}"\n\n`
})() : ''}
View more details: ${actionUrl}

---
This email was sent automatically. Please do not reply.
© 2024 Community Platform
    `
  }

  private generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    const { recipientName, username, verificationUrl } = data

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome - Community Platform</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #e0e0e0; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .content { padding: 30px 0; }
          .welcome-box { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .action-button { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .action-button:hover { background-color: #059669; }
          .features { background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .feature-item { margin: 10px 0; padding-left: 20px; position: relative; }
          .feature-item:before { content: '\u2022'; position: absolute; left: 0; color: #10b981; font-weight: bold; }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Community Platform</div>
          </div>
          
          <div class="content">
            <div class="welcome-box">
              <h1>[WELCOME] Welcome ${recipientName}!</h1>
              <p>Thank you for joining our community</p>
            </div>
            
            <p>Hello <strong>@${username}</strong>!</p>
            
            <p>We're excited that you've joined Community Platform, a community where people can share experiences, thoughts, and connect through MBTI personality types</p>
            
            <div class="features">
              <h3>[FEATURES] Exciting Features:</h3>
              <ul style="list-style: none; padding: 0;">
                <li>&bull; Create and share your posts</li>
                <li>&bull; Connect with people who have the same MBTI Type</li>
                <li>&bull; Real-time chat</li>
                <li>&bull; Follow users you're interested in</li>
                <li>&bull; Get notifications when there's new activity</li>
              </ul>
            </div>
            
            ${verificationUrl ? `
              <p>Please verify your email to start using the full features:</p>
               <a href="${verificationUrl}" class="action-button">Verify Email</a>
            ` : `
              <p>You can start using it right away:</p>
               <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/feed" class="action-button">Get Started</a>
            `}
            
            <p>If you have any questions or need help, you can contact our support team anytime</p>
          </div>
          
          <div class="footer">
            <p>Thank you for joining our community!</p>
            <p>© 2024 Community Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generateWelcomeEmailText(data: WelcomeEmailData): string {
    const { recipientName, username, verificationUrl } = data

    return `
Welcome ${recipientName}!

Thank you for joining Community Platform

Hello @${username}!

We're excited that you've joined our community where people can share experiences, thoughts, and connect through MBTI personality types

What you can do:
- Create posts and share your thoughts
- Find and connect with people who have the same MBTI type
- Real-time chat with other members
- Follow interesting users
- Get notifications when there's new activity

${verificationUrl ? (() => {
  const verifyText = 'Please verify your email: '
  return `${verifyText}${verificationUrl}`
})() : (() => {
  const startText = 'Get started: '
  return `${startText}${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/feed`
})()}

If you have any questions or need help, you can contact our support team anytime

Thank you for joining our community!
© 2024 Community Platform
    `
  }
}

// Export singleton instance
export const emailService = new EmailService()
