import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET, POST } from '@/app/api/posts/[postId]/comments/route'
import { GET as getComment, PUT, DELETE } from '@/app/api/comments/[commentId]/route'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/db-utils'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findUnique: jest.fn(),
    },
    comment: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
    role: 'USER',
  },
}

const mockPost = {
  id: 'post-1',
  authorId: 'user-2',
  isPublic: true,
}

const mockComment = {
  id: 'comment-1',
  content: 'Test comment',
  postId: 'post-1',
  authorId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  author: {
    id: 'user-1',
    username: 'testuser',
    name: 'Test User',
    image: null,
    mbti: { type: 'INTJ' },
  },
}

describe('/api/posts/[postId]/comments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/posts/[postId]/comments', () => {
    it('should return comments with pagination', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.comment.findMany as jest.Mock).mockResolvedValue([mockComment])
      ;(prisma.comment.count as jest.Mock).mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments?page=1&limit=20')
      const response = await GET(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.comments).toHaveLength(1)
      expect(data.data.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        hasMore: false,
      })
    })

    it('should return 404 if post not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts/nonexistent/comments')
      const response = await GET(request, { params: { postId: 'nonexistent' } })
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

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments')
      const response = await GET(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments')
      const response = await GET(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('POST /api/posts/[postId]/comments', () => {
    it('should create a comment', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.comment.create as jest.Mock).mockResolvedValue(mockComment)
      ;(createNotification as jest.Mock).mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Test comment',
        }),
      })

      const response = await POST(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockComment)
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'Test comment',
          postId: 'post-1',
          authorId: 'user-1',
        },
        include: expect.any(Object),
      })
    })

    it('should create notification for post author', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(prisma.comment.create as jest.Mock).mockResolvedValue(mockComment)
      ;(createNotification as jest.Mock).mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test comment' }),
      })

      await POST(request, { params: { postId: 'post-1' } })

      expect(createNotification).toHaveBeenCalledWith(
        'user-2',
        'COMMENT',
        'Test User commented on your post',
        'post-1'
      )
    })

    it('should not create notification for own post', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue({
        ...mockPost,
        authorId: 'user-1', // Same as session user
      })
      ;(prisma.comment.create as jest.Mock).mockResolvedValue(mockComment)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test comment' }),
      })

      await POST(request, { params: { postId: 'post-1' } })

      expect(createNotification).not.toHaveBeenCalled()
    })

    it('should return 400 for invalid input', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: '', // Invalid: empty content
        }),
      })

      const response = await POST(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input data')
    })

    it('should return 404 if post not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.post.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts/nonexistent/comments', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test comment' }),
      })

      const response = await POST(request, { params: { postId: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Post not found')
    })

    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test comment' }),
      })

      const response = await POST(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })
})

describe('/api/comments/[commentId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/comments/[commentId]', () => {
    it('should return a specific comment', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.comment.findUnique as jest.Mock).mockResolvedValue({
        ...mockComment,
        post: mockPost,
      })

      const response = await getComment(
        new NextRequest('http://localhost:3000/api/comments/comment-1'),
        { params: { commentId: 'comment-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('comment-1')
    })

    it('should return 404 if comment not found', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.comment.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await getComment(
        new NextRequest('http://localhost:3000/api/comments/nonexistent'),
        { params: { commentId: 'nonexistent' } }
      )
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Comment not found')
    })

    it('should return 403 for private post access', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.comment.findUnique as jest.Mock).mockResolvedValue({
        ...mockComment,
        post: {
          ...mockPost,
          isPublic: false,
          authorId: 'other-user',
        },
      })

      const response = await getComment(
        new NextRequest('http://localhost:3000/api/comments/comment-1'),
        { params: { commentId: 'comment-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })
  })

  describe('PUT /api/comments/[commentId]', () => {
    it('should update a comment', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.comment.findUnique as jest.Mock).mockResolvedValue(mockComment)
      ;(prisma.comment.update as jest.Mock).mockResolvedValue({
        ...mockComment,
        content: 'Updated comment',
      })

      const request = new NextRequest('http://localhost:3000/api/comments/comment-1', {
        method: 'PUT',
        body: JSON.stringify({
          content: 'Updated comment',
        }),
      })

      const response = await PUT(request, { params: { commentId: 'comment-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
        data: {
          content: 'Updated comment',
          updatedAt: expect.any(Date),
        },
        include: expect.any(Object),
      })
    })

    it('should return 403 if user does not own the comment', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.comment.findUnique as jest.Mock).mockResolvedValue({
        ...mockComment,
        authorId: 'other-user',
      })

      const request = new NextRequest('http://localhost:3000/api/comments/comment-1', {
        method: 'PUT',
        body: JSON.stringify({ content: 'Updated comment' }),
      })

      const response = await PUT(request, { params: { commentId: 'comment-1' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })

    it('should allow admin to update any comment', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({
        ...mockSession,
        user: { ...mockSession.user, role: 'ADMIN' },
      })
      ;(prisma.comment.findUnique as jest.Mock).mockResolvedValue({
        ...mockComment,
        authorId: 'other-user',
      })
      ;(prisma.comment.update as jest.Mock).mockResolvedValue({
        ...mockComment,
        content: 'Updated by admin',
      })

      const request = new NextRequest('http://localhost:3000/api/comments/comment-1', {
        method: 'PUT',
        body: JSON.stringify({ content: 'Updated by admin' }),
      })

      const response = await PUT(request, { params: { commentId: 'comment-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('DELETE /api/comments/[commentId]', () => {
    it('should delete a comment', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.comment.findUnique as jest.Mock).mockResolvedValue(mockComment)
      ;(prisma.comment.delete as jest.Mock).mockResolvedValue(mockComment)

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/comments/comment-1', { method: 'DELETE' }),
        { params: { commentId: 'comment-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Comment deleted successfully')
      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
      })
    })

    it('should return 403 if user does not own the comment', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.comment.findUnique as jest.Mock).mockResolvedValue({
        ...mockComment,
        authorId: 'other-user',
      })

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/comments/comment-1', { method: 'DELETE' }),
        { params: { commentId: 'comment-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied')
    })

    it('should allow admin to delete any comment', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue({
        ...mockSession,
        user: { ...mockSession.user, role: 'ADMIN' },
      })
      ;(prisma.comment.findUnique as jest.Mock).mockResolvedValue({
        ...mockComment,
        authorId: 'other-user',
      })
      ;(prisma.comment.delete as jest.Mock).mockResolvedValue(mockComment)

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/comments/comment-1', { method: 'DELETE' }),
        { params: { commentId: 'comment-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})
