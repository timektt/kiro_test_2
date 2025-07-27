import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { POST, DELETE, GET } from '@/app/api/posts/[postId]/like/route'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/db-utils'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findUnique: jest.fn(),
    },
    like: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}))
jest.mock('@/lib/db-utils')

const mockSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
  },
}

const mockPost = {
  id: 'post-1',
  authorId: 'user-2',
}

const mockLike = {
  id: 'like-1',
  postId: 'post-1',
  userId: 'user-1',
  createdAt: new Date(),
}

describe('/api/posts/[postId]/like', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/posts/[postId]/like', () => {
    it('should create a like', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.like.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.like.create as jest.Mock).mockResolvedValue(mockLike)
      ;(prisma.like.count as jest.Mock).mockResolvedValue(1)
      ;(createNotification as jest.Mock).mockResolvedValue(undefined)

      const response = await POST(
        new NextRequest('http://localhost:3000/api/posts/post-1/like', { method: 'POST' }),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.like).toEqual(mockLike)
      expect(data.data.likeCount).toBe(1)
      expect(prisma.like.create).toHaveBeenCalledWith({
        data: {
          postId: 'post-1',
          userId: 'user-1',
        },
      })
    })

    it('should create notification for post author', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.like.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.like.create as jest.Mock).mockResolvedValue(mockLike)
      ;(prisma.like.count as jest.Mock).mockResolvedValue(1)
      ;(createNotification as jest.Mock).mockResolvedValue(undefined)

      await POST(
        new NextRequest('http://localhost:3000/api/posts/post-1/like', { method: 'POST' }),
        { params: { postId: 'post-1' } }
      )

      expect(createNotification).toHaveBeenCalledWith(
        'user-2',
        'LIKE',
        'Test User liked your post',
        'post-1'
      )
    })

    it('should not create notification for own post', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue({
        ...mockPost,
        authorId: 'user-1', // Same as session user
      })
      ;(prisma.like.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.like.create as jest.Mock).mockResolvedValue(mockLike)
      ;(prisma.like.count as jest.Mock).mockResolvedValue(1)

      await POST(
        new NextRequest('http://localhost:3000/api/posts/post-1/like', { method: 'POST' }),
        { params: { postId: 'post-1' } }
      )

      expect(createNotification).not.toHaveBeenCalled()
    })

    it('should return 409 if already liked', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.like.findUnique as jest.Mock).mockResolvedValue(mockLike)

      const response = await POST(
        new NextRequest('http://localhost:3000/api/posts/post-1/like', { method: 'POST' }),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Post already liked')
    })

    it('should return 404 if post not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await POST(
        new NextRequest('http://localhost:3000/api/posts/nonexistent/like', { method: 'POST' }),
        { params: { postId: 'nonexistent' } }
      )
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Post not found')
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const response = await POST(
        new NextRequest('http://localhost:3000/api/posts/post-1/like', { method: 'POST' }),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('DELETE /api/posts/[postId]/like', () => {
    it('should remove a like', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.like.findUnique as jest.Mock).mockResolvedValue(mockLike)
      ;(prisma.like.delete as jest.Mock).mockResolvedValue(mockLike)
      ;(prisma.like.count as jest.Mock).mockResolvedValue(0)

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/posts/post-1/like', { method: 'DELETE' }),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.likeCount).toBe(0)
      expect(prisma.like.delete).toHaveBeenCalledWith({
        where: { id: 'like-1' },
      })
    })

    it('should return 404 if like not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.like.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/posts/post-1/like', { method: 'DELETE' }),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Like not found')
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/posts/post-1/like', { method: 'DELETE' }),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('GET /api/posts/[postId]/like', () => {
    it('should return like status for authenticated user', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.like.findUnique as jest.Mock).mockResolvedValue(mockLike)
      ;(prisma.like.count as jest.Mock).mockResolvedValue(5)

      const response = await GET(
        new NextRequest('http://localhost:3000/api/posts/post-1/like'),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual({
        isLiked: true,
        likeCount: 5,
        likedAt: mockLike.createdAt,
      })
    })

    it('should return false for unliked post', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.like.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.like.count as jest.Mock).mockResolvedValue(3)

      const response = await GET(
        new NextRequest('http://localhost:3000/api/posts/post-1/like'),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual({
        isLiked: false,
        likeCount: 3,
        likedAt: null,
      })
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const response = await GET(
        new NextRequest('http://localhost:3000/api/posts/post-1/like'),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })
})
