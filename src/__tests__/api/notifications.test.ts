import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET, PUT, DELETE } from '@/app/api/notifications/route'
import { GET as getNotification, PUT as updateNotification, DELETE as deleteNotification } from '@/app/api/notifications/[notificationId]/route'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

const mockSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
  },
}

const mockNotification = {
  id: 'notification-1',
  userId: 'user-1',
  actorId: 'user-2',
  type: 'LIKE',
  message: 'User 2 liked your post',
  postId: 'post-1',
  isRead: false,
  readAt: null,
  createdAt: new Date(),
  actor: {
    id: 'user-2',
    username: 'user2',
    name: 'User 2',
    image: null,
  },
  post: {
    id: 'post-1',
    content: 'Test post content',
  },
}

describe('/api/notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/notifications', () => {
    it('should return notifications with pagination', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findMany as jest.Mock).mockResolvedValue([mockNotification])
      ;(prisma.notification.count as jest.Mock).mockResolvedValueOnce(1) // total count
      ;(prisma.notification.count as jest.Mock).mockResolvedValueOnce(1) // unread count

      const request = new NextRequest('http://localhost:3000/api/notifications?page=1&limit=20')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.notifications).toHaveLength(1)
      expect(data.data.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        hasMore: false,
      })
      expect(data.data.unreadCount).toBe(1)
    })

    it('should filter unread notifications only', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findMany as jest.Mock).mockResolvedValue([mockNotification])
      ;(prisma.notification.count as jest.Mock).mockResolvedValueOnce(1)
      ;(prisma.notification.count as jest.Mock).mockResolvedValueOnce(1)

      const request = new NextRequest('http://localhost:3000/api/notifications?unreadOnly=true')
      const response = await GET(request)

      expect(prisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: 'user-1',
            isRead: false,
          },
        })
      )
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/notifications')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('PUT /api/notifications', () => {
    it('should mark all notifications as read', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.updateMany as jest.Mock).mockResolvedValue({ count: 5 })

      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'PUT',
        body: JSON.stringify({ action: 'markAllAsRead' }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('All notifications marked as read')
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: expect.any(Date),
        },
      })
    })

    it('should mark specific notifications as read', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.updateMany as jest.Mock).mockResolvedValue({ count: 2 })

      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'PUT',
        body: JSON.stringify({
          action: 'markAsRead',
          notificationIds: ['notification-1', 'notification-2'],
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('2 notifications marked as read')
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['notification-1', 'notification-2'] },
          userId: 'user-1',
        },
        data: {
          isRead: true,
          readAt: expect.any(Date),
        },
      })
    })

    it('should mark specific notifications as unread', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.updateMany as jest.Mock).mockResolvedValue({ count: 1 })

      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'PUT',
        body: JSON.stringify({
          action: 'markAsUnread',
          notificationIds: ['notification-1'],
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('1 notifications marked as unread')
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['notification-1'] },
          userId: 'user-1',
        },
        data: {
          isRead: false,
          readAt: null,
        },
      })
    })

    it('should return 400 for invalid action', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'PUT',
        body: JSON.stringify({ action: 'invalidAction' }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid action or missing parameters')
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'PUT',
        body: JSON.stringify({ action: 'markAllAsRead' }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('DELETE /api/notifications', () => {
    it('should delete specific notifications', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.deleteMany as jest.Mock).mockResolvedValue({ count: 2 })

      const request = new NextRequest('http://localhost:3000/api/notifications?ids=notification-1,notification-2', {
        method: 'DELETE',
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('2 notifications deleted')
      expect(data.deletedCount).toBe(2)
      expect(prisma.notification.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['notification-1', 'notification-2'] },
          userId: 'user-1',
        },
      })
    })

    it('should return 400 if no notification IDs provided', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'DELETE',
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('No notification IDs provided')
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/notifications?ids=notification-1', {
        method: 'DELETE',
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })
})

describe('/api/notifications/[notificationId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/notifications/[notificationId]', () => {
    it('should return a specific notification', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findUnique as jest.Mock).mockResolvedValue(mockNotification)

      const response = await getNotification(
        new NextRequest('http://localhost:3000/api/notifications/notification-1'),
        { params: { notificationId: 'notification-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('notification-1')
    })

    it('should return 404 if notification not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await getNotification(
        new NextRequest('http://localhost:3000/api/notifications/nonexistent'),
        { params: { notificationId: 'nonexistent' } }
      )
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Notification not found')
    })

    it('should return 403 if user does not own notification', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findUnique as jest.Mock).mockResolvedValue({
        ...mockNotification,
        userId: 'other-user',
      })

      const response = await getNotification(
        new NextRequest('http://localhost:3000/api/notifications/notification-1'),
        { params: { notificationId: 'notification-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })
  })

  describe('PUT /api/notifications/[notificationId]', () => {
    it('should update notification read status', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findUnique as jest.Mock).mockResolvedValue(mockNotification)
      ;(prisma.notification.update as jest.Mock).mockResolvedValue({
        ...mockNotification,
        isRead: true,
        readAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3000/api/notifications/notification-1', {
        method: 'PUT',
        body: JSON.stringify({ isRead: true }),
      })

      const response = await updateNotification(request, { params: { notificationId: 'notification-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notification-1' },
        data: {
          isRead: true,
          readAt: expect.any(Date),
        },
        include: expect.any(Object),
      })
    })

    it('should return 404 if notification not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/notifications/nonexistent', {
        method: 'PUT',
        body: JSON.stringify({ isRead: true }),
      })

      const response = await updateNotification(request, { params: { notificationId: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Notification not found')
    })

    it('should return 403 if user does not own notification', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findUnique as jest.Mock).mockResolvedValue({
        ...mockNotification,
        userId: 'other-user',
      })

      const request = new NextRequest('http://localhost:3000/api/notifications/notification-1', {
        method: 'PUT',
        body: JSON.stringify({ isRead: true }),
      })

      const response = await updateNotification(request, { params: { notificationId: 'notification-1' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })
  })

  describe('DELETE /api/notifications/[notificationId]', () => {
    it('should delete a notification', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findUnique as jest.Mock).mockResolvedValue(mockNotification)
      ;(prisma.notification.delete as jest.Mock).mockResolvedValue(mockNotification)

      const response = await deleteNotification(
        new NextRequest('http://localhost:3000/api/notifications/notification-1', { method: 'DELETE' }),
        { params: { notificationId: 'notification-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Notification deleted successfully')
      expect(prisma.notification.delete).toHaveBeenCalledWith({
        where: { id: 'notification-1' },
      })
    })

    it('should return 404 if notification not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await deleteNotification(
        new NextRequest('http://localhost:3000/api/notifications/nonexistent', { method: 'DELETE' }),
        { params: { notificationId: 'nonexistent' } }
      )
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Notification not found')
    })

    it('should return 403 if user does not own notification', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.notification.findUnique as jest.Mock).mockResolvedValue({
        ...mockNotification,
        userId: 'other-user',
      })

      const response = await deleteNotification(
        new NextRequest('http://localhost:3000/api/notifications/notification-1', { method: 'DELETE' }),
        { params: { notificationId: 'notification-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })
  })
})

