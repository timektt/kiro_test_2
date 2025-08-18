import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

interface RouteParams {
  params: {
    chatId: string
  }
}

// GET /api/chat/[chatId]/messages - Get messages for a chat
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId } = params
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') // For cursor-based pagination
    const skip = (page - 1) * limit

    // Verify user is participant in this chat
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        chatId,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Access denied to this chat' },
        { status: 403 }
      )
    }

    // Build where clause for pagination
    const whereClause: any = {
      chatId,
      isDeleted: false
    }

    if (before) {
      whereClause.createdAt = {
        lt: new Date(before)
      }
    }

    // Get messages
    const messages = await prisma.chatMessage.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true
              }
            }
          }
        },
        readBy: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: before ? 0 : skip
    })

    // Format messages
    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      type: message.type,
      chatId: message.chatId,
      senderId: message.senderId,
      sender: message.sender,
      replyToId: message.replyToId,
      replyTo: message.replyTo ? {
        id: message.replyTo.id,
        content: message.replyTo.content,
        sender: message.replyTo.sender,
        createdAt: message.replyTo.createdAt.toISOString()
      } : null,
      readBy: message.readBy.map(read => ({
        user: read.user,
        readAt: read.readAt.toISOString()
      })),
      isEdited: message.isEdited,
      isDeleted: message.isDeleted,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString()
    }))

    return NextResponse.json({
      messages: formattedMessages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit,
        cursor: messages.length > 0 ? messages[messages.length - 1].createdAt.toISOString() : null
      }
    })
  } catch (error) {
    logger.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/chat/[chatId]/messages - Send a message
export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId } = params
    const body = await req.json()
    const { content, type = 'TEXT', replyToId } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Verify user is participant in this chat
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        chatId,
        userId: session.user.id,
        isActive: true
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Access denied to this chat' },
        { status: 403 }
      )
    }

    // Verify reply-to message exists if provided
    if (replyToId) {
      const replyToMessage = await prisma.chatMessage.findFirst({
        where: {
          id: replyToId,
          chatId,
          isDeleted: false
        }
      })

      if (!replyToMessage) {
        return NextResponse.json(
          { error: 'Reply-to message not found' },
          { status: 400 }
        )
      }
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        content: content.trim(),
        type,
        chatId,
        senderId: session.user.id,
        replyToId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    // Update chat's last message timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() }
    })

    // Mark message as read by sender
    await prisma.chatMessageRead.create({
      data: {
        messageId: message.id,
        userId: session.user.id
      }
    })

    logger.info(`Message sent in chat ${chatId} by user ${session.user.id}`)

    // Format response
    const formattedMessage = {
      id: message.id,
      content: message.content,
      type: message.type,
      chatId: message.chatId,
      senderId: message.senderId,
      sender: message.sender,
      replyToId: message.replyToId,
      replyTo: message.replyTo ? {
        id: message.replyTo.id,
        content: message.replyTo.content,
        sender: message.replyTo.sender,
        createdAt: message.replyTo.createdAt.toISOString()
      } : null,
      readBy: [{
        user: message.sender,
        readAt: new Date().toISOString()
      }],
      isEdited: message.isEdited,
      isDeleted: message.isDeleted,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString()
    }

    return NextResponse.json({ message: formattedMessage }, { status: 201 })
  } catch (error) {
    logger.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}