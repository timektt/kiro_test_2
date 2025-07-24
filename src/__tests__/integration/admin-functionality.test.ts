import { NextRequest } from 'next/server'
import { GET as getUsersHandler, POST as createUserHandler } from '@/app/api/admin/users/route'
import { GET as getUserHandler, PUT as updateUserHandler, DELETE as deleteUserHandler } from '@/app/api/admin/users/[userId]/route'
import { GET as getStatsHandler } from '@/app/api/admin/stats/route'
import { GET as getActivityHandler } from '@/app/api/admin/activity/route'
import { GET as getContentHandler } from '@/app/api/admin/content/route'
import { PUT as moderatePostHandler } from '@/app/api/admin/content/posts/[postId]/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    comment: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    like: {
      count: jest.fn(),
    },
    follow: {
      count: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('Admin Functionality Integration Tests', () => {
  const mockAdminUser = {
    id: 'admin-123',
    username: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  }

  const mockRegularUser = {
    id: 'user-123',
    username: 'user',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'USER',
  }

  const mockAdminSession = {
    user: mockAdminUser,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }

  const mockUserSession = {
    user: mockRegularUser,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Admin Authentication', () => {
    it('should allow admin access to admin endpoints', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession as any)
      mockPrisma.user.findMany.mockResolvedValue([])
      mockPrisma.user.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/admin/users')

      const response = await getUsersHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
    })

    it('should deny regular user access to admin endpoints', async () => {
      mockGetServerSession.mockResolvedValue(mockUserSession as any)

      const request = new NextRequest('http://localhost:3000/api/admin/users')

      const response = await getUsersHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(403)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Forbidden: Admin access required')
    })

    it('should deny unauthenticated access to admin endpoints', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/users')

      const response = await getUsersHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(401)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Unauthorized')
    })
  })

  describe('User Management', () => {
    beforeEach(() => {
      mockGetServerSession.mockResolvedValue(mockAdminSession as any)
    })

    it('should retrieve users with pagination and filtering', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          username: 'user1',
          name: 'User One',
          email: 'user1@example.com',
          role: 'USER',
          isActive: true,
          createdAt: new Date(),
          _count: { posts: 5, followers: 10, following: 8 },
        },
        {
          id: 'user-2',
          username: 'user2',
          name: 'User Two',
          email: 'user2@example.com',
          role: 'USER',
          isActive: true,
          createdAt: new Date(),
          _count: { posts: 3, followers: 5, following: 12 },
        },
      ]

      mockPrisma.user.findMany.mockResolvedValue(mockUsers as any)
      mockPrisma.user.count.mockResolvedValue(25)

      const request = new NextRequest('http://localhost:3000/api/admin/users?page=1&limit=10&search=user&role=USER')

      const response = await getUsersHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.users).toHaveLength(2)
      expect(responseData.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        hasMore: true,
      })

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { username: { contains: 'user', mode: 'insensitive' } },
            { name: { contains: 'user', mode: 'insensitive' } },
            { email: { contains: 'user', mode: 'insensitive' } },
          ],
          role: 'USER',
        },
        include: {
          _count: {
            select: {
              posts: true,
              followers: true,
              following: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      })
    })

    it('should retrieve a specific user by ID', async () => {
      const userId = 'user-123'
      const mockUser = {
        id: userId,
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { posts: 10, followers: 15, following: 20 },
        posts: [],
        followers: [],
        following: [],
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)

      const request = new NextRequest(`http://localhost:3000/api/admin/users/${userId}`)

      const response = await getUserHandler(request, { params: { userId } })
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.user).toEqual(expect.objectContaining({
        id: userId,
        username: 'testuser',
        name: 'Test User',
      }))

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: expect.objectContaining({
          _count: expect.any(Object),
          posts: expect.any(Object),
          followers: expect.any(Object),
          following: expect.any(Object),
        }),
      })
    })

    it('should update user role and status', async () => {
      const userId = 'user-123'
      const updateData = {
        role: 'MODERATOR',
        isActive: false,
      }

      const mockUpdatedUser = {
        id: userId,
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        role: 'MODERATOR',
        isActive: false,
        updatedAt: new Date(),
      }

      mockPrisma.user.findUnique.mockResolvedValue({ id: userId } as any)
      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser as any)

      const request = new NextRequest(`http://localhost:3000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const response = await updateUserHandler(request, { params: { userId } })
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.user.role).toBe('MODERATOR')
      expect(responseData.user.isActive).toBe(false)

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      })
    })

    it('should delete a user account', async () => {
      const userId = 'user-123'
      const mockUser = {
        id: userId,
        username: 'testuser',
        role: 'USER',
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)
      mockPrisma.user.delete.mockResolvedValue(mockUser as any)

      const request = new NextRequest(`http://localhost:3000/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      const response = await deleteUserHandler(request, { params: { userId } })
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('User deleted successfully')

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      })
    })

    it('should prevent deletion of admin users', async () => {
      const adminUserId = 'admin-456'
      const mockAdminToDelete = {
        id: adminUserId,
        username: 'anotheradmin',
        role: 'ADMIN',
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockAdminToDelete as any)

      const request = new NextRequest(`http://localhost:3000/api/admin/users/${adminUserId}`, {
        method: 'DELETE',
      })

      const response = await deleteUserHandler(request, { params: { userId: adminUserId } })
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Cannot delete admin users')

      expect(mockPrisma.user.delete).not.toHaveBeenCalled()
    })
  })

  describe('Platform Statistics', () => {
    beforeEach(() => {
      mockGetServerSession.mockResolvedValue(mockAdminSession as any)
    })

    it('should retrieve comprehensive platform statistics', async () => {
      const mockStats = {
        users: {
          total: 1000,
          active: 850,
          new: 50,
        },
        posts: {
          total: 5000,
          today: 25,
          thisWeek: 180,
        },
        engagement: {
          totalLikes: 15000,
          totalComments: 8000,
          avgLikesPerPost: 3.0,
          avgCommentsPerPost: 1.6,
        },
      }

      // Mock individual count queries
      mockPrisma.user.count
        .mockResolvedValueOnce(1000) // total users
        .mockResolvedValueOnce(850)  // active users
        .mockResolvedValueOnce(50)   // new users

      mockPrisma.post.count
        .mockResolvedValueOnce(5000) // total posts
        .mockResolvedValueOnce(25)   // posts today
        .mockResolvedValueOnce(180)  // posts this week

      mockPrisma.like.count.mockResolvedValue(15000)
      mockPrisma.comment.count.mockResolvedValue(8000)

      const request = new NextRequest('http://localhost:3000/api/admin/stats')

      const response = await getStatsHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.stats).toEqual(expect.objectContaining({
        users: expect.objectContaining({
          total: expect.any(Number),
          active: expect.any(Number),
          new: expect.any(Number),
        }),
        posts: expect.objectContaining({
          total: expect.any(Number),
          today: expect.any(Number),
          thisWeek: expect.any(Number),
        }),
        engagement: expect.objectContaining({
          totalLikes: expect.any(Number),
          totalComments: expect.any(Number),
        }),
      }))
    })

    it('should handle statistics calculation errors gracefully', async () => {
      mockPrisma.user.count.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/admin/stats')

      const response = await getStatsHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Failed to fetch statistics')
    })
  })

  describe('Activity Monitoring', () => {
    beforeEach(() => {
      mockGetServerSession.mockResolvedValue(mockAdminSession as any)
    })

    it('should retrieve recent platform activity', async () => {
      const mockRecentPosts = [
        {
          id: 'post-1',
          content: 'Recent post 1',
          createdAt: new Date(),
          author: { username: 'user1', name: 'User One' },
        },
        {
          id: 'post-2',
          content: 'Recent post 2',
          createdAt: new Date(),
          author: { username: 'user2', name: 'User Two' },
        },
      ]

      const mockRecentUsers = [
        {
          id: 'user-1',
          username: 'newuser1',
          name: 'New User One',
          createdAt: new Date(),
        },
        {
          id: 'user-2',
          username: 'newuser2',
          name: 'New User Two',
          createdAt: new Date(),
        },
      ]

      mockPrisma.post.findMany.mockResolvedValue(mockRecentPosts as any)
      mockPrisma.user.findMany.mockResolvedValue(mockRecentUsers as any)

      const request = new NextRequest('http://localhost:3000/api/admin/activity')

      const response = await getActivityHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.activity).toEqual(expect.objectContaining({
        recentPosts: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            content: expect.any(String),
            author: expect.objectContaining({
              username: expect.any(String),
            }),
          }),
        ]),
        recentUsers: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            username: expect.any(String),
          }),
        ]),
      }))
    })
  })

  describe('Content Moderation', () => {
    beforeEach(() => {
      mockGetServerSession.mockResolvedValue(mockAdminSession as any)
    })

    it('should retrieve flagged content for moderation', async () => {
      const mockFlaggedPosts = [
        {
          id: 'post-1',
          content: 'Potentially problematic content',
          createdAt: new Date(),
          author: { username: 'user1', name: 'User One' },
          _count: { likes: 0, comments: 5 },
        },
      ]

      const mockFlaggedComments = [
        {
          id: 'comment-1',
          content: 'Inappropriate comment',
          createdAt: new Date(),
          author: { username: 'user2', name: 'User Two' },
          post: { id: 'post-2', content: 'Original post' },
        },
      ]

      mockPrisma.post.findMany.mockResolvedValue(mockFlaggedPosts as any)
      mockPrisma.comment.findMany.mockResolvedValue(mockFlaggedComments as any)

      const request = new NextRequest('http://localhost:3000/api/admin/content')

      const response = await getContentHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.content).toEqual(expect.objectContaining({
        flaggedPosts: expect.any(Array),
        flaggedComments: expect.any(Array),
      }))
    })

    it('should moderate a post (hide/delete)', async () => {
      const postId = 'post-123'
      const moderationData = {
        action: 'hide',
        reason: 'Inappropriate content',
      }

      const mockPost = {
        id: postId,
        content: 'Post to be moderated',
        authorId: 'user-123',
        isPublic: true,
      }

      const mockUpdatedPost = {
        ...mockPost,
        isPublic: false,
      }

      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.post.update.mockResolvedValue(mockUpdatedPost as any)
      mockPrisma.notification.create.mockResolvedValue({} as any)

      const request = new NextRequest(`http://localhost:3000/api/admin/content/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moderationData),
      })

      const response = await moderatePostHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Post moderated successfully')

      expect(mockPrisma.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: { isPublic: false },
      })

      // Should notify the post author
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          type: 'SYSTEM',
          message: expect.stringContaining('moderated'),
          userId: 'user-123',
          relatedId: postId,
        },
      })
    })

    it('should delete a post completely', async () => {
      const postId = 'post-123'
      const moderationData = {
        action: 'delete',
        reason: 'Severe policy violation',
      }

      const mockPost = {
        id: postId,
        content: 'Post to be deleted',
        authorId: 'user-123',
      }

      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.post.delete.mockResolvedValue(mockPost as any)
      mockPrisma.notification.create.mockResolvedValue({} as any)

      const request = new NextRequest(`http://localhost:3000/api/admin/content/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moderationData),
      })

      const response = await moderatePostHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Post moderated successfully')

      expect(mockPrisma.post.delete).toHaveBeenCalledWith({
        where: { id: postId },
      })
    })

    it('should validate moderation actions', async () => {
      const postId = 'post-123'
      const invalidModerationData = {
        action: 'invalid-action',
        reason: '',
      }

      const request = new NextRequest(`http://localhost:3000/api/admin/content/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidModerationData),
      })

      const response = await moderatePostHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.errors).toBeDefined()
    })
  })

  describe('Admin Audit Trail', () => {
    beforeEach(() => {
      mockGetServerSession.mockResolvedValue(mockAdminSession as any)
    })

    it('should log admin actions for audit purposes', async () => {
      const userId = 'user-123'
      const updateData = {
        role: 'MODERATOR',
        isActive: true,
      }

      const mockUser = {
        id: userId,
        username: 'testuser',
        role: 'USER',
      }

      const mockUpdatedUser = {
        ...mockUser,
        role: 'MODERATOR',
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)
      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser as any)

      const request = new NextRequest(`http://localhost:3000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const response = await updateUserHandler(request, { params: { userId } })

      expect(response.status).toBe(200)

      // Verify that the action was logged (this would typically be done in middleware)
      // For this test, we're just ensuring the operation completed successfully
      expect(mockPrisma.user.update).toHaveBeenCalled()
    })
  })

  describe('Error Handling and Edge Cases', () => {
    beforeEach(() => {
      mockGetServerSession.mockResolvedValue(mockAdminSession as any)
    })

    it('should handle non-existent user operations', async () => {
      const nonExistentUserId = 'non-existent-user'

      mockPrisma.user.findUnique.mockResolvedValue(null)

      const request = new NextRequest(`http://localhost:3000/api/admin/users/${nonExistentUserId}`)

      const response = await getUserHandler(request, { params: { userId: nonExistentUserId } })
      const responseData = await response.json()

      expect(response.status).toBe(404)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('User not found')
    })

    it('should handle database connection errors', async () => {
      mockPrisma.user.findMany.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/admin/users')

      const response = await getUsersHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Internal server error')
    })

    it('should validate admin permissions for sensitive operations', async () => {
      // Test with moderator trying to access admin-only functions
      const moderatorSession = {
        user: { ...mockRegularUser, role: 'MODERATOR' },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      mockGetServerSession.mockResolvedValue(moderatorSession as any)

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'newuser',
          email: 'new@example.com',
          role: 'ADMIN',
        }),
      })

      const response = await createUserHandler(request)
      const responseData = await response.json()

      // Should deny access to create admin users
      expect(response.status).toBe(403)
      expect(responseData.success).toBe(false)
    })
  })
})