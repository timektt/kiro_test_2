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
    const subject = 'ยินดีต้อนรับสู่ Community Platform!'
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
        return `${senderName} ถูกใจโพสต์ของคุณ`
      case 'comment':
        return `${senderName} แสดงความคิดเห็นในโพสต์ของคุณ`
      case 'follow':
        return `${senderName} เริ่มติดตามคุณแล้ว`
      case 'mention':
        return `${senderName} กล่าวถึงคุณในโพสต์`
      case 'chat':
        return `${senderName} ส่งข้อความถึงคุณ`
      default:
        return 'คุณมีการแจ้งเตือนใหม่'
    }
  }

  private generateNotificationEmailHTML(data: NotificationEmailData): string {
    const { recipientName, senderName, notificationType, contentPreview, actionUrl } = data
    
    const actionText = {
      like: 'ถูกใจโพสต์ของคุณ',
      comment: 'แสดงความคิดเห็นในโพสต์ของคุณ',
      follow: 'เริ่มติดตามคุณแล้ว',
      mention: 'กล่าวถึงคุณในโพสต์',
      chat: 'ส่งข้อความถึงคุณ'
    }[notificationType] || 'มีการแจ้งเตือนใหม่'

    return `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>การแจ้งเตือน - Community Platform</title>
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
            <h2>สวัสดี ${recipientName}!</h2>
            
            <div class="notification">
              <h3>🔔 การแจ้งเตือนใหม่</h3>
              <p><strong>${senderName}</strong> ${actionText}</p>
              ${contentPreview ? `<div class="preview">"${contentPreview}"</div>` : ''}
            </div>
            
            <p>คลิกปุ่มด้านล่างเพื่อดูรายละเอียดเพิ่มเติม:</p>
            
            <a href="${actionUrl}" class="action-button">ดูรายละเอียด</a>
            
            <p>หรือคัดลอกลิงก์นี้ไปที่เบราว์เซอร์: <br>
            <a href="${actionUrl}">${actionUrl}</a></p>
          </div>
          
          <div class="footer">
            <p>อีเมลนี้ส่งโดยอัตโนมัติ กรุณาอย่าตอบกลับ</p>
            <p>© 2024 Community Platform. {'สงวนลิขสิทธิ์'}.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generateNotificationEmailText(data: NotificationEmailData): string {
    const { recipientName, senderName, notificationType, contentPreview, actionUrl } = data
    
    const actionText = {
      like: 'ถูกใจโพสต์ของคุณ',
      comment: 'แสดงความคิดเห็นในโพสต์ของคุณ',
      follow: 'เริ่มติดตามคุณแล้ว',
      mention: 'กล่าวถึงคุณในโพสต์',
      chat: 'ส่งข้อความถึงคุณ'
    }[notificationType] || 'มีการแจ้งเตือนใหม่'

    return `
สวัสดี ${recipientName}!

การแจ้งเตือนใหม่:
${senderName} ${actionText}

${contentPreview ? (() => {
  const contentLabel = 'เนื้อหา: '
  return `${contentLabel}"${contentPreview}"\n\n`
})() : ''}
ดูรายละเอียดเพิ่มเติม: ${actionUrl}

---
อีเมลนี้ส่งโดยอัตโนมัติ กรุณาอย่าตอบกลับ
© 2024 Community Platform
    `
  }

  private generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    const { recipientName, username, verificationUrl } = data

    return `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ยินดีต้อนรับ - Community Platform</title>
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
          .feature-item:before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; }
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
              <h1>🎉 ยินดีต้อนรับ ${recipientName}!</h1>
              <p>ขอบคุณที่เข้าร่วมชุมชนของเรา</p>
            </div>
            
            <p>สวัสดี <strong>@${username}</strong>!</p>
            
            <p>เราดีใจมากที่คุณได้เข้าร่วม Community Platform ชุมชนที่ผู้คนสามารถแบ่งปันประสบการณ์ ความคิดเห็น และเชื่อมต่อกันผ่าน MBTI personality types</p>
            
            <div class="features">
              <h3>🌟 คุณสมบัติที่น่าสนใจ:</h3>
              <ul style="list-style: none; padding: 0;">
                <li>📝 สร้างและแบ่งปันโพสต์ของคุณ</li>
                <li>🧠 เชื่อมต่อกับผู้คนที่มี MBTI Type เดียวกัน</li>
                <li>💬 แชทแบบเรียลไทม์</li>
                <li>👥 ติดตามผู้ใช้ที่คุณสนใจ</li>
                <li>🔔 รับการแจ้งเตือนเมื่อมีกิจกรรมใหม่</li>
              </ul>
            </div>
            
            ${verificationUrl ? `
              <p>กรุณายืนยันอีเมลของคุณเพื่อเริ่มใช้งานเต็มรูปแบบ:</p>
               <a href="${verificationUrl}" class="action-button">ยืนยันอีเมล</a>
            ` : `
              <p>คุณสามารถเริ่มใช้งานได้ทันที:</p>
               <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/feed" class="action-button">เริ่มใช้งาน</a>
            `}
            
            <p>หากคุณมีคำถามหรือต้องการความช่วยเหลือ สามารถติดต่อทีมสนับสนุนของเราได้ตลอดเวลา</p>
          </div>
          
          <div class="footer">
            <p>ขอบคุณที่เข้าร่วมชุมชนของเรา!</p>
            <p>© 2024 Community Platform. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generateWelcomeEmailText(data: WelcomeEmailData): string {
    const { recipientName, username, verificationUrl } = data

    return `
{'ยินดีต้อนรับ'} ${recipientName}!

{'ขอบคุณที่เข้าร่วม'} Community Platform

{'สวัสดี'} @${username}!

{'เราดีใจมากที่คุณได้เข้าร่วมชุมชนของเรา ที่ผู้คนสามารถแบ่งปันประสบการณ์ ความคิดเห็น และเชื่อมต่อกันผ่าน'} MBTI personality types

{'สิ่งที่คุณสามารถทำได้'}:
✓ {'สร้างโพสต์และแบ่งปันความคิดเห็น'}
✓ {'ค้นหาและเชื่อมต่อกับผู้คนที่มี'} MBTI {'เหมือนกัน'}
✓ {'แชทแบบเรียลไทม์กับสมาชิกอื่น ๆ'}
✓ {'ติดตามผู้ใช้ที่น่าสนใจ'}
✓ {'รับการแจ้งเตือนเมื่อมีกิจกรรมใหม่'}

${verificationUrl ? (() => {
  const verifyText = 'กรุณายืนยันอีเมลของคุณ: '
  return `${verifyText}${verificationUrl}`
})() : (() => {
  const startText = 'เริ่มใช้งาน: '
  return `${startText}${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/feed`
})()}

{'หากคุณมีคำถามหรือต้องการความช่วยเหลือ สามารถติดต่อทีมสนับสนุนของเราได้ตลอดเวลา'}

{'ขอบคุณที่เข้าร่วมชุมชนของเรา'}!
© 2024 Community Platform
    `
  }
}

// Export singleton instance
export const emailService = new EmailService()