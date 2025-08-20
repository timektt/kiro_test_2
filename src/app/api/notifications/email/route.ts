import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'
import logger from '@/lib/logger'

interface EmailNotificationRequest {
  userId: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'chat'
  contentId?: string
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: EmailNotificationRequest = await request.json()
    const { userId, type, contentId, message } = body

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get recipient user
    const recipient = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailNotifications: true
      }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has email notifications enabled
    if (!recipient.emailNotifications) {
      return NextResponse.json(
        { message: 'Email notifications disabled for user' },
        { status: 200 }
      )
    }

    if (!recipient.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    // Get sender user
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true
      }
    })

    if (!sender) {
      return NextResponse.json(
        { error: 'Sender not found' },
        { status: 404 }
      )
    }

    // Don't send email to self
    if (recipient.id === sender.id) {
      return NextResponse.json(
        { message: 'Cannot send notification to self' },
        { status: 200 }
      )
    }

    // Get content preview and action URL based on type
    let contentPreview = ''
    let actionUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}`

    switch (type) {
      case 'like':
      case 'comment':
        if (contentId) {
          const post = await prisma.post.findUnique({
            where: { id: contentId },
            select: {
              id: true,
              content: true
            }
          })
          if (post) {
            contentPreview = post.content.length > 100 
              ? post.content.substring(0, 100) + '...' 
              : post.content
            actionUrl += `/feed?post=${post.id}`
          }
        }
        break
      
      case 'follow':
        actionUrl += `/profile/${sender.username}`
        break
      
      case 'mention':
        if (contentId) {
          const post = await prisma.post.findUnique({
            where: { id: contentId },
            select: {
              id: true,
              content: true
            }
          })
          if (post) {
            contentPreview = post.content.length > 100 
              ? post.content.substring(0, 100) + '...' 
              : post.content
            actionUrl += `/feed?post=${post.id}`
          }
        }
        break
      
      case 'chat':
        contentPreview = message || 'sent a new message'
        actionUrl += '/chat'
        break
    }

    // Send email notification
    const emailSent = await emailService.sendNotificationEmail(
      recipient.email,
      {
        recipientName: recipient.name || 'User',
        senderName: sender.name || sender.username,
        notificationType: type,
        contentPreview,
        actionUrl
      }
    )

    if (!emailSent) {
      logger.warn('Failed to send email notification', {
        recipientId: recipient.id,
        senderId: sender.id,
        type
      })
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    logger.info('Email notification sent successfully', {
      recipientId: recipient.id,
      senderId: sender.id,
      type,
      contentId
    })

    return NextResponse.json({
      message: 'Email notification sent successfully'
    })

  } catch (error) {
    logger.error('Error sending email notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Send welcome email
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    // Send welcome email
    const emailSent = await emailService.sendWelcomeEmail(
      user.email,
      {
        recipientName: user.name || user.username,
        username: user.username
      }
    )

    if (!emailSent) {
      logger.warn('Failed to send welcome email', {
        userId: user.id
      })
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      )
    }

    logger.info('Welcome email sent successfully', {
      userId: user.id
    })

    return NextResponse.json({
      message: 'Welcome email sent successfully'
    })

  } catch (error) {
    logger.error('Error sending welcome email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
