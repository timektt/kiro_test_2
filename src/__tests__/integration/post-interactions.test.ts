import { NextRequest } from 'next/server'
import { POST as createPostHandler, GET as getPostsHandler } from '@/app/api/posts/route'
import { POST as likeHandler, DELETE as unlikeHandler } from '@/app/api/posts/[postId]/like/route'
import { POST as commentHandler, GET as getCommentsHandler } from '@/app/api/posts/[postId]/comments/route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    like: {
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
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

describe('Post Interactions Integration Tests', () => {
  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
  }

  const mockSession = {
    user: mockUser,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetServerSession.mockResolvedValue(mockSession as any)
  })

  describe('Post Creation Flow', () => {
    it('should create a post successfully', async () => {
      const postData = {
        content: 'This is a test post content',
        imageUrl: 'https://example.com/image.jpg',
      }

      const mockPost = {
        id: 'post-123',
        ...postData,
        authorId: mockUser.id,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: mockUser,
        _count: { likes: 0, comments: 0 },
      }

      mockPrisma.post.create.mockResolvedValue(mockPost as any)

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const response = await createPostHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.post).toEqual(expect.objectContaining({
        id: mockPost.id,
        content: mockPost.content,
        imageUrl: mockPost.imageUrl,
        author: expect.objectContaining({
          id: mockUser.id,
          username: mockUser.username,
        }),
      }))

      expect(mockPrisma.post.create).toHaveBeenCalledWith({
        data: {
          content: postData.content,
          imageUrl: postData.imageUrl,
          authorId: mockUser.id,
        },
        include: expect.objectContaining({
          author: expect.any(Object),
          _count: expect.any(Object),
        }),
      })
    })

    it('should validate post content', async () => {
      const invalidPostData = {
        content: '', // Empty content
      }

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPostData),
      })

      const response = await createPostHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.errors).toBeDefined()
    })

    it('should require authentication for post creation', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const postData = {
        content: 'This should fail without auth',
      }

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const response = await createPostHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(401)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Unauthorized')
    })
  })

  describe('Post Feed Retrieval', () => {
    it('should retrieve posts with pagination', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          content: 'First post',
          authorId: 'user-1',
          isPublic: true,
          createdAt: new Date(),
          author: { id: 'user-1', username: 'user1', name: 'User One' },
          _count: { likes: 5, comments: 2 },
        },
        {
          id: 'post-2',
          content: 'Second post',
          authorId: 'user-2',
          isPublic: true,
          createdAt: new Date(),
          author: { id: 'user-2', username: 'user2', name: 'User Two' },
          _count: { likes: 3, comments: 1 },
        },
      ]

      const mockLikes = [{ postId: 'post-1' }] // User liked post-1

      mockPrisma.post.findMany.mockResolvedValue(mockPosts as any)
      mockPrisma.post.count.mockResolvedValue(10)
      mockPrisma.like.findMany.mockResolvedValue(mockLikes as any)

      const request = new NextRequest('http://localhost:3000/api/posts?page=1&limit=2')

      const response = await getPostsHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.posts).toHaveLength(2)
      expect(responseData.posts[0].isLiked).toBe(true) // post-1 is liked
      expect(responseData.posts[1].isLiked).toBe(false) // post-2 is not liked
      expect(responseData.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 10,
        hasMore: true,
      })
    })

    it('should handle empty feed', async () => {
      mockPrisma.post.findMany.mockResolvedValue([])
      mockPrisma.post.count.mockResolvedValue(0)
      mockPrisma.like.findMany.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/posts')

      const response = await getPostsHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.posts).toEqual([])
      expect(responseData.pagination.total).toBe(0)
      expect(responseData.pagination.hasMore).toBe(false)
    })
  })

  describe('Like System', () => {
    it('should like a post successfully', async () => {
      const postId = 'post-123'
      const mockPost = {
        id: postId,
        content: 'Test post',
        authorId: 'author-123',
        author: { id: 'author-123', username: 'author' },
      }

      const mockLike = {
        id: 'like-123',
        postId,
        userId: mockUser.id,
        createdAt: new Date(),
      }

      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.like.findUnique.mockResolvedValue(null) // Not already liked
      mockPrisma.like.create.mockResolvedValue(mockLike as any)
      mockPrisma.notification.create.mockResolvedValue({} as any)

      const request = new NextRequest(`http://localhost:3000/api/posts/${postId}/like`, {
        method: 'POST',
      })

      const response = await likeHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.liked).toBe(true)

      expect(mockPrisma.like.create).toHaveBeenCalledWith({
        data: {
          postId,
          userId: mockUser.id,
        },
      })

      // Should create notification for post author
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          type: 'LIKE',
          message: expect.stringContaining('liked your post'),
          userId: 'author-123',
          relatedId: postId,
        },
      })
    })

    it('should unlike a post successfully', async () => {
      const postId = 'post-123'
      const mockPost = {
        id: postId,
        content: 'Test post',
        authorId: 'author-123',
      }

      const mockLike = {
        id: 'like-123',
        postId,
        userId: mockUser.id,
      }

      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.like.findUnique.mockResolvedValue(mockLike as any)
      mockPrisma.like.delete.mockResolvedValue(mockLike as any)

      const request = new NextRequest(`http://localhost:3000/api/posts/${postId}/like`, {
        method: 'DELETE',
      })

      const response = await unlikeHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.liked).toBe(false)

      expect(mockPrisma.like.delete).toHaveBeenCalledWith({
        where: {
          postId_userId: {
            postId,
            userId: mockUser.id,
          },
        },
      })
    })

    it('should prevent duplicate likes', async () => {
      const postId = 'post-123'
      const mockPost = {
        id: postId,
        content: 'Test post',
        authorId: 'author-123',
      }

      const existingLike = {
        id: 'like-123',
        postId,
        userId: mockUser.id,
      }

      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.like.findUnique.mockResolvedValue(existingLike as any)

      const request = new NextRequest(`http://localhost:3000/api/posts/${postId}/like`, {
        method: 'POST',
      })

      const response = await likeHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.liked).toBe(true)
      expect(responseData.message).toBe('Post already liked')

      expect(mockPrisma.like.create).not.toHaveBeenCalled()
    })

    it('should handle non-existent post', async () => {
      const postId = 'non-existent-post'

      mockPrisma.post.findUnique.mockResolvedValue(null)

      const request = new NextRequest(`http://localhost:3000/api/posts/${postId}/like`, {
        method: 'POST',
      })

      const response = await likeHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(404)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Post not found')
    })
  })

  describe('Comment System', () => {
    it('should create a comment successfully', async () => {
      const postId = 'post-123'
      const commentData = {
        content: 'This is a test comment',
      }

      const mockPost = {
        id: postId,
        content: 'Test post',
        authorId: 'author-123',
        author: { id: 'author-123', username: 'author' },
      }

      const mockComment = {
        id: 'comment-123',
        content: commentData.content,
        postId,
        authorId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: mockUser,
      }

      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.comment.create.mockResolvedValue(mockComment as any)
      mockPrisma.notification.create.mockResolvedValue({} as any)

      const request = new NextRequest(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      })

      const response = await commentHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.comment).toEqual(expect.objectContaining({
        id: mockComment.id,
        content: mockComment.content,
        author: expect.objectContaining({
          id: mockUser.id,
          username: mockUser.username,
        }),
      }))

      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: commentData.content,
          postId,
          authorId: mockUser.id,
        },
        include: expect.objectContaining({
          author: expect.any(Object),
        }),
      })

      // Should create notification for post author
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          type: 'COMMENT',
          message: expect.stringContaining('commented on your post'),
          userId: 'author-123',
          relatedId: postId,
        },
      })
    })

    it('should retrieve comments with pagination', async () => {
      const postId = 'post-123'
      const mockComments = [
        {
          id: 'comment-1',
          content: 'First comment',
          postId,
          authorId: 'user-1',
          createdAt: new Date(),
          author: { id: 'user-1', username: 'user1', name: 'User One' },
        },
        {
          id: 'comment-2',
          content: 'Second comment',
          postId,
          authorId: 'user-2',
          createdAt: new Date(),
          author: { id: 'user-2', username: 'user2', name: 'User Two' },
        },
      ]

      mockPrisma.comment.findMany.mockResolvedValue(mockComments as any)
      mockPrisma.comment.count.mockResolvedValue(5)

      const request = new NextRequest(`http://localhost:3000/api/posts/${postId}/comments?page=1&limit=2`)

      const response = await getCommentsHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.comments).toHaveLength(2)
      expect(responseData.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 5,
        hasMore: true,
      })
    })

    it('should validate comment content', async () => {
      const postId = 'post-123'
      const invalidCommentData = {
        content: '', // Empty content
      }

      const request = new NextRequest(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidCommentData),
      })

      const response = await commentHandler(request, { params: { postId } })
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.errors).toBeDefined()
    })
  })

  describe('Complete Post Interaction Flow', () => {
    it('should handle complete post lifecycle', async () => {
      // 1. Create a post
      const postData = {
        content: 'Integration test post',
        imageUrl: 'https://example.com/image.jpg',
      }

      const mockPost = {
        id: 'post-integration',
        ...postData,
        authorId: mockUser.id,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: mockUser,
        _count: { likes: 0, comments: 0 },
      }

      mockPrisma.post.create.mockResolvedValue(mockPost as any)

      const createRequest = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const createResponse = await createPostHandler(createRequest)
      expect(createResponse.status).toBe(201)

      // 2. Like the post
      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.like.findUnique.mockResolvedValue(null)
      mockPrisma.like.create.mockResolvedValue({
        id: 'like-integration',
        postId: mockPost.id,
        userId: mockUser.id,
        createdAt: new Date(),
      } as any)

      const likeRequest = new NextRequest(`http://localhost:3000/api/posts/${mockPost.id}/like`, {
        method: 'POST',
      })

      const likeResponse = await likeHandler(likeRequest, { params: { postId: mockPost.id } })
      expect(likeResponse.status).toBe(200)

      // 3. Comment on the post
      const commentData = { content: 'Great post!' }
      mockPrisma.comment.create.mockResolvedValue({
        id: 'comment-integration',
        content: commentData.content,
        postId: mockPost.id,
        authorId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: mockUser,
      } as any)

      const commentRequest = new NextRequest(`http://localhost:3000/api/posts/${mockPost.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      })

      const commentResponse = await commentHandler(commentRequest, { params: { postId: mockPost.id } })
      expect(commentResponse.status).toBe(201)

      // 4. Verify all interactions were recorded
      expect(mockPrisma.post.create).toHaveBeenCalled()
      expect(mockPrisma.like.create).toHaveBeenCalled()
      expect(mockPrisma.comment.create).toHaveBeenCalled()
      expect(mockPrisma.notification.create).toHaveBeenCalledTimes(2) // Like + Comment notifications
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const postData = {
        content: 'This will cause a database error',
      }

      mockPrisma.post.create.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const response = await createPostHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Internal server error')
    })

    it('should handle malformed JSON requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      })

      const response = await createPostHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('Invalid JSON')
    })
  })
})