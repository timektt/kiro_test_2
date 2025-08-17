import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { prisma } from './prisma'
import { logger } from './logger'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

export interface ChatUser {
  id: string
  username: string
  name: string | null
  image: string | null
}

export interface ChatMessage {
  id: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
  chatId: string
  senderId: string
  sender: ChatUser
  replyToId?: string
  isEdited: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface ChatRoom {
  id: string
  name?: string
  type: 'DIRECT' | 'GROUP'
  participants: ChatUser[]
  lastMessage?: ChatMessage
  lastMessageAt?: string
  unreadCount: number
}

export const initializeSocket = (server: NetServer) => {
  if (!server.io) {
    logger.info('Initializing Socket.IO server')
    
    const io = new ServerIO(server, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXTAUTH_URL 
          : ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      }
    })

    // Store active users
    const activeUsers = new Map<string, { socketId: string, userId: string, username: string }>()

    io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`)

      // User joins
      socket.on('user:join', async (userData: { userId: string, username: string }) => {
        try {
          activeUsers.set(socket.id, {
            socketId: socket.id,
            userId: userData.userId,
            username: userData.username
          })

          // Join user to their chat rooms
          const userChats = await prisma.chatParticipant.findMany({
            where: {
              userId: userData.userId,
              isActive: true
            },
            select: {
              chatId: true
            }
          })

          for (const chat of userChats) {
            socket.join(`chat:${chat.chatId}`)
          }

          // Notify others that user is online
          socket.broadcast.emit('user:online', {
            userId: userData.userId,
            username: userData.username
          })

          logger.info(`User ${userData.username} joined with socket ${socket.id}`)
        } catch (error) {
          logger.error('Error in user:join:', error)
        }
      })

      // Join chat room
      socket.on('chat:join', (chatId: string) => {
        socket.join(`chat:${chatId}`)
        logger.info(`Socket ${socket.id} joined chat ${chatId}`)
      })

      // Leave chat room
      socket.on('chat:leave', (chatId: string) => {
        socket.leave(`chat:${chatId}`)
        logger.info(`Socket ${socket.id} left chat ${chatId}`)
      })

      // Send message
      socket.on('message:send', async (data: {
        chatId: string
        content: string
        type?: 'TEXT' | 'IMAGE' | 'FILE'
        replyToId?: string
      }) => {
        try {
          const user = activeUsers.get(socket.id)
          if (!user) {
            socket.emit('error', { message: 'User not authenticated' })
            return
          }

          // Create message in database
          const message = await prisma.chatMessage.create({
            data: {
              content: data.content,
              type: data.type || 'TEXT',
              chatId: data.chatId,
              senderId: user.userId,
              replyToId: data.replyToId
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
            where: { id: data.chatId },
            data: { lastMessageAt: new Date() }
          })

          // Emit message to all users in the chat
          io.to(`chat:${data.chatId}`).emit('message:new', {
            id: message.id,
            content: message.content,
            type: message.type,
            chatId: message.chatId,
            senderId: message.senderId,
            sender: message.sender,
            replyToId: message.replyToId,
            replyTo: message.replyTo,
            isEdited: message.isEdited,
            isDeleted: message.isDeleted,
            createdAt: message.createdAt.toISOString(),
            updatedAt: message.updatedAt.toISOString()
          })

          logger.info(`Message sent in chat ${data.chatId} by user ${user.userId}`)
        } catch (error) {
          logger.error('Error in message:send:', error)
          socket.emit('error', { message: 'Failed to send message' })
        }
      })

      // Mark messages as read
      socket.on('message:read', async (data: { messageIds: string[] }) => {
        try {
          const user = activeUsers.get(socket.id)
          if (!user) return

          // Mark messages as read
          await prisma.chatMessageRead.createMany({
            data: data.messageIds.map(messageId => ({
              messageId,
              userId: user.userId
            })),
            skipDuplicates: true
          })

          // Emit read status to other users in the chat
          const messages = await prisma.chatMessage.findMany({
            where: { id: { in: data.messageIds } },
            select: { chatId: true }
          })

          const chatIds = [...new Set(messages.map(m => m.chatId))]
          for (const chatId of chatIds) {
            socket.to(`chat:${chatId}`).emit('message:read', {
              userId: user.userId,
              messageIds: data.messageIds
            })
          }
        } catch (error) {
          logger.error('Error in message:read:', error)
        }
      })

      // Typing indicators
      socket.on('typing:start', (data: { chatId: string }) => {
        const user = activeUsers.get(socket.id)
        if (!user) return

        socket.to(`chat:${data.chatId}`).emit('typing:start', {
          userId: user.userId,
          username: user.username,
          chatId: data.chatId
        })
      })

      socket.on('typing:stop', (data: { chatId: string }) => {
        const user = activeUsers.get(socket.id)
        if (!user) return

        socket.to(`chat:${data.chatId}`).emit('typing:stop', {
          userId: user.userId,
          chatId: data.chatId
        })
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        const user = activeUsers.get(socket.id)
        if (user) {
          // Notify others that user is offline
          socket.broadcast.emit('user:offline', {
            userId: user.userId,
            username: user.username
          })

          activeUsers.delete(socket.id)
          logger.info(`User ${user.username} disconnected`)
        }
        logger.info(`Socket disconnected: ${socket.id}`)
      })
    })

    server.io = io
    logger.info('Socket.IO server initialized successfully')
  }

  return server.io
}