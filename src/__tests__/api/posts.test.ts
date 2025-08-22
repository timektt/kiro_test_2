import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET, POST } from '@/app/api/posts/route'
import { GET as getPost, PUT, DELETE } from '@/app/api/posts/[postId]/route'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    follow: {
      findMany: jest.fn(),
    },
  },
}))

const mockSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
  },
}

const mockPost = {
  id: 'post-1',
  content: 'Test post content',
  imageUrl: null,
  authorId: 'user-1',
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  author: {
    id: 'user-1',
    username: 'testuser',
    name: 'Test User',
    image: null,
    mbti: { type: 'INTJ' },
  },
  _count: {
    likes: 5,
    comments: 3,
  },
}

describe('/api/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/posts', () => {
    it('should return posts with pagination', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findMany as jest.Mock).mockResolvedValue([mockPost])
      ;(prisma.post.count as jest.Mock).mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/posts?page=1&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.posts).toHaveLength(1)
      expect(data.data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        hasMore: false,
      })
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should filter posts by following users', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.follow.findMany as jest.Mock).mockResolvedValue([
        { followingId: 'user-2' },
        { followingId: 'user-3' },
      ])
      ;(prisma.post.findMany as jest.Mock).mockResolvedValue([mockPost])
      ;(prisma.post.count as jest.Mock).mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/posts?following=true')
      const response = await GET(request)

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isPublic: true,
            authorId: {
              in: ['user-2', 'user-3', 'user-1'], // includes own posts
            },
          },
        })
      )
    })
  })

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.create as jest.Mock).mockResolvedValue(mockPost)

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Test post content',
          imageUrl: 'https://example.com/image.jpg',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockPost)
      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          content: 'Test post content',
          imageUrl: 'https://example.com/image.jpg',
          authorId: 'user-1',
          isPublic: true,
        },
        include: expect.any(Object),
      })
    })

    it('should return 400 for invalid input', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: '', // Invalid: empty content
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input data')
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })
})

describe('/api/posts/[postId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/posts/[postId]', () => {
    it('should return a specific post', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue({
        ...mockPost,
        comments: [],
        likes: [],
      })

      const response = await getPost(
        new NextRequest('http://localhost:3000/api/posts/post-1'),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('post-1')
    })

    it('should return 404 if post not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await getPost(
        new NextRequest('http://localhost:3000/api/posts/nonexistent'),
        { params: { postId: 'nonexistent' } }
      )
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Post not found')
    })

    it('should return 403 for private post access', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue({
        ...mockPost,
        isPublic: false,
        authorId: 'other-user',
      })

      const response = await getPost(
        new NextRequest('http://localhost:3000/api/posts/post-1'),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })
  })

  describe('PUT /api/posts/[postId]', () => {
    it('should update a post', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.post.update as jest.Mock).mockResolvedValue({
        ...mockPost,
        content: 'Updated content',
      })

      const request = new NextRequest('http://localhost:3000/api/posts/post-1', {
        method: 'PUT',
        body: JSON.stringify({
          content: 'Updated content',
        }),
      })

      const response = await PUT(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        data: {
          content: 'Updated content',
          imageUrl: undefined,
          updatedAt: expect.any(Date),
        },
        include: expect.any(Object),
      })
    })

    it('should return 403 if user does not own the post', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue({
        ...mockPost,
        authorId: 'other-user',
      })

      const request = new NextRequest('http://localhost:3000/api/posts/post-1', {
        method: 'PUT',
        body: JSON.stringify({ content: 'Updated content' }),
      })

      const response = await PUT(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })
  })

  describe('DELETE /api/posts/[postId]', () => {
    it('should delete a post', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.post.delete as jest.Mock).mockResolvedValue(mockPost)

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/posts/post-1', { method: 'DELETE' }),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Post deleted successfully')
      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      })
    })

    it('should return 403 if user does not own the post', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue({
        ...mockPost,
        authorId: 'other-user',
      })

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/posts/post-1', { method: 'DELETE' }),
        { params: { postId: 'post-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })
  })
})

