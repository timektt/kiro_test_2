import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/posts/route'
import { getServerSession } from 'next-auth'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      create: jest.fn(),
    },
  },
}))

const mockSession = {
  user: {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
  },
}

describe('Post Creation Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  })

  it('should create a post successfully', async () => {
    const { prisma } = require('@/lib/prisma')

    const mockPost = {
      id: 'post-123',
      content: 'Test post content',
      authorId: 'user-123',
      createdAt: new Date(),
      author: {
        id: 'user-123',
        name: 'Test User',
        username: 'testuser',
      },
      _count: { likes: 0, comments: 0 },
    }

    prisma.post.create.mockResolvedValue(mockPost)

    const { req } = createMocks({
      method: 'POST',
      body: {
        content: 'Test post content',
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data.content).toBe('Test post content')
    expect(data.data.author.name).toBe('Test User')
  })

  it('should require authentication', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const { req } = createMocks({
      method: 'POST',
      body: {
        content: 'Test post content',
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error.message).toBe('Unauthorized')
  })

  it('should validate post content', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        content: '', // Empty content
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error.message).toContain('validation')
  })

  it('should handle database errors', async () => {
    const { prisma } = require('@/lib/prisma')

    prisma.post.create.mockRejectedValue(new Error('Database error'))

    const { req } = createMocks({
      method: 'POST',
      body: {
        content: 'Test post content',
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error.message).toBe('Internal server error')
  })
})

