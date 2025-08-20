import { createMocks } from 'node-mocks-http'
import { GET, PUT } from '@/app/api/users/[userId]/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

const mockSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
  },
}

const mockUser = {
  id: 'user-1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  bio: 'Test bio',
  image: null,
  socialLinks: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('/api/users/[userId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return user profile', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const { req } = createMocks({
        method: 'GET',
      })

      const response = await GET(req, { params: { userId: 'user-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('user-1')
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: expect.objectContaining({
          id: true,
          name: true,
          username: true,
          bio: true,
          image: true,
          socialLinks: true,
          createdAt: true,
        }),
      })
    })

    it('should return 404 when user not found', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const { req } = createMocks({
        method: 'GET',
      })

      const response = await GET(req, { params: { userId: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('User not found')
    })

    it('should handle database error', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'))

      const { req } = createMocks({
        method: 'GET',
      })

      const response = await GET(req, { params: { userId: 'user-1' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Internal server error')
    })
  })

  describe('PUT', () => {
    it('should update user profile when authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        bio: 'Updated bio',
      })

      const { req } = createMocks({
        method: 'PUT',
        body: {
          bio: 'Updated bio',
          socialLinks: {
            twitter: 'https://twitter.com/testuser',
          },
        },
      })

      const response = await PUT(req, { params: { userId: 'user-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          bio: 'Updated bio',
          socialLinks: {
            twitter: 'https://twitter.com/testuser',
          },
        },
      })
    })

    it('should return 401 when not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const { req } = createMocks({
        method: 'PUT',
        body: { bio: 'Updated bio' },
      })

      const response = await PUT(req, { params: { userId: 'user-1' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Unauthorized')
    })

    it('should return 403 when trying to update another user', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const { req } = createMocks({
        method: 'PUT',
        body: { bio: 'Updated bio' },
      })

      const response = await PUT(req, { params: { userId: 'user-2' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Forbidden')
    })

    it('should validate input data', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const { req } = createMocks({
        method: 'PUT',
        body: {
          bio: 'a'.repeat(501), // Exceeds max length
        },
      })

      const response = await PUT(req, { params: { userId: 'user-1' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('validation')
    })

    it('should validate social links URLs', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const { req } = createMocks({
        method: 'PUT',
        body: {
          socialLinks: {
            twitter: 'invalid-url',
          },
        },
      })

      const response = await PUT(req, { params: { userId: 'user-1' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('validation')
    })

    it('should handle database error during update', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.user.update as jest.Mock).mockRejectedValue(new Error('Database error'))

      const { req } = createMocks({
        method: 'PUT',
        body: { bio: 'Updated bio' },
      })

      const response = await PUT(req, { params: { userId: 'user-1' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error.message).toBe('Internal server error')
    })
  })
})

