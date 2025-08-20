import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createConversationSchema = z.object({
  participantId: z.string().min(1, 'Participant ID is required')
})

// GET /api/chat/conversations - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const userId = session.user.id

    // Get conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
                isActive: true
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
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
                senderId: {
                  not: userId
                },
                readAt: null
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count for pagination
    const total = await prisma.conversation.count({
      where: {
        participants: {
          some: {
            userId: userId
          }
        }
      }
    })

    // Format conversations
    const formattedConversations = conversations.map(conversation => {
      const otherParticipant = conversation.participants.find(
        p => p.userId !== userId
      )?.user

      const lastMessage = conversation.messages[0]
      const unreadCount = conversation._count.messages

      return {
        id: conversation.id,
        type: conversation.type,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        participant: otherParticipant,
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          type: lastMessage.type,
          createdAt: lastMessage.createdAt,
          sender: lastMessage.sender
        } : null,
        unreadCount
      }
    })

    return NextResponse.json({
      conversations: formattedConversations,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/chat/conversations - Create or get existing conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { participantId } = createConversationSchema.parse(body)
    const userId = session.user.id

    // Can't create conversation with yourself
    if (userId === participantId) {
      return NextResponse.json(
        { error: 'Cannot create conversation with yourself' },
        { status: 400 }
      )
    }

    // Check if participant exists
    const participant = await prisma.user.findUnique({
      where: { id: participantId },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        isActive: true
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          {
            participants: {
              some: {
                userId: userId
              }
            }
          },
          {
            participants: {
              some: {
                userId: participantId
              }
            }
          }
        ]
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
                isActive: true
              }
            }
          }
        }
      }
    })

    if (existingConversation) {
      return NextResponse.json({
        conversation: {
          id: existingConversation.id,
          type: existingConversation.type,
          title: existingConversation.title,
          createdAt: existingConversation.createdAt,
          updatedAt: existingConversation.updatedAt,
          participant
        }
      })
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        type: 'DIRECT',
        participants: {
          create: [
            { userId: userId },
            { userId: participantId }
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
                isActive: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        type: conversation.type,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        participant
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
