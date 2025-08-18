import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

// GET /api/chat - Get user's chats
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Get user's chats with participants and last message
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
            isActive: true
          }
        },
        isActive: true
      },
      include: {
        participants: {
          where: { isActive: true },
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
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
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
        _count: {
          select: {
            messages: {
              where: {
                readBy: {
                  none: {
                    userId: session.user.id
                  }
                },
                senderId: {
                  not: session.user.id
                }
              }
            }
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      },
      skip,
      take: limit
    })

    // Format response
    const formattedChats = chats.map(chat => ({
      id: chat.id,
      name: chat.name,
      type: chat.type,
      participants: chat.participants.map(p => p.user),
      lastMessage: chat.messages[0] ? {
        id: chat.messages[0].id,
        content: chat.messages[0].content,
        type: chat.messages[0].type,
        sender: chat.messages[0].sender,
        createdAt: chat.messages[0].createdAt.toISOString()
      } : null,
      lastMessageAt: chat.lastMessageAt?.toISOString(),
      unreadCount: chat._count.messages,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString()
    }))

    return NextResponse.json({
      chats: formattedChats,
      pagination: {
        page,
        limit,
        hasMore: chats.length === limit
      }
    })
  } catch (error) {
    logger.error('Error fetching chats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/chat - Create new chat
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { participantIds, name, type = 'DIRECT' } = body

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'Participant IDs are required' },
        { status: 400 }
      )
    }

    // Add current user to participants if not already included
    const allParticipantIds = [...new Set([session.user.id, ...participantIds])]

    // For direct chats, check if chat already exists
    if (type === 'DIRECT' && allParticipantIds.length === 2) {
      const existingChat = await prisma.chat.findFirst({
        where: {
          type: 'DIRECT',
          isActive: true,
          participants: {
            every: {
              userId: { in: allParticipantIds },
              isActive: true
            }
          }
        },
        include: {
          participants: {
            where: { isActive: true },
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
        }
      })

      if (existingChat && existingChat.participants.length === 2) {
        return NextResponse.json({
          chat: {
            id: existingChat.id,
            name: existingChat.name,
            type: existingChat.type,
            participants: existingChat.participants.map(p => p.user),
            lastMessage: null,
            lastMessageAt: existingChat.lastMessageAt?.toISOString(),
            unreadCount: 0,
            createdAt: existingChat.createdAt.toISOString(),
            updatedAt: existingChat.updatedAt.toISOString()
          }
        })
      }
    }

    // Verify all participants exist
    const users = await prisma.user.findMany({
      where: {
        id: { in: allParticipantIds },
        isActive: true
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true
      }
    })

    if (users.length !== allParticipantIds.length) {
      return NextResponse.json(
        { error: 'Some participants not found' },
        { status: 400 }
      )
    }

    // Create chat with participants
    const chat = await prisma.chat.create({
      data: {
        name: type === 'GROUP' ? name : null,
        type,
        participants: {
          create: allParticipantIds.map((userId, index) => ({
            userId,
            role: userId === session.user.id ? 'ADMIN' : 'MEMBER'
          }))
        }
      },
      include: {
        participants: {
          where: { isActive: true },
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
      }
    })

    logger.info(`Chat created: ${chat.id} by user ${session.user.id}`)

    return NextResponse.json({
      chat: {
        id: chat.id,
        name: chat.name,
        type: chat.type,
        participants: chat.participants.map(p => p.user),
        lastMessage: null,
        lastMessageAt: chat.lastMessageAt?.toISOString(),
        unreadCount: 0,
        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}