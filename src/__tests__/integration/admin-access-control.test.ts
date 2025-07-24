import { createMocks } from 'node-mocks-http'
import { GET } from '@/app/api/admin/users/route'
import { getServerSession } from 'next-auth'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}))

describe('Admin Access Control Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should allow admin access to admin endpoints', async () => {
    const adminSession = {
      user: {
        id: 'admin-123',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
    }

    ;(getServerSession as jest.Mock).mockResolvedValue(adminSession)

    const { prisma } = require('@/lib/prisma')
    prisma.user.findMany.mockResolvedValue([])
    prisma.user.count.mockResolvedValue(0)

    const { req } = createMocks({
      method: 'GET',
    })

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.users).toEqual([])
  })

  it('should deny regular user access to admin endpoints', async () => {
    const userSession = {
      user: {
        id: 'user-123',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'USER',
      },
    }

    ;(getServerSession as jest.Mock).mockResolvedValue(userSession)

    const { req } = createMocks({
      method: 'GET',
    })

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.success).toBe(false)
    expect(data.error.message).toBe('Forbidden')
  })

  it('should deny unauthenticated access to admin endpoints', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const { req } = createMocks({
      method: 'GET',
    })

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error.message).toBe('Unauthorized')
  })

  it('should allow moderator access to some admin endpoints', async () => {
    const moderatorSession = {
      user: {
        id: 'mod-123',
        name: 'Moderator User',
        email: 'mod@example.com',
        role: 'MODERATOR',
      },
    }

    ;(getServerSession as jest.Mock).mockResolvedValue(moderatorSession)

    const { prisma } = require('@/lib/prisma')
    prisma.user.findMany.mockResolvedValue([])
    prisma.user.count.mockResolvedValue(0)

    const { req } = createMocks({
      method: 'GET',
    })

    const response = await GET(req)
    const data = await response.json()

    // Moderators should have access to user management
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should handle database errors in admin endpoints', async () => {
    const adminSession = {
      user: {
        id: 'admin-123',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
    }

    ;(getServerSession as jest.Mock).mockResolvedValue(adminSession)

    const { prisma } = require('@/lib/prisma')
    prisma.user.findMany.mockRejectedValue(new Error('Database error'))

    const { req } = createMocks({
      method: 'GET',
    })

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error.message).toBe('Internal server error')
  })
})