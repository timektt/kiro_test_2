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
    id: 'user-1',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
  }

  const mockPost = {
    id: 'post-1',
    title: 'Test Post',
    content: 'This is a test post',
    authorId: 'user-1',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    author: mockUser,
    _count: {
      likes: 0,
      comments: 0,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetServerSession.mockResolvedValue({
      user: mockUser,
    } as any)
  })

  describe('Post Creation', () => {
    it('should create a new post successfully', async () => {
      mockPrisma.post.create.mockResolvedValue(mockPost as any)

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Post',
          content: 'This is a test post',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await createPostHandler(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.post).toEqual(mockPost)
      expect(mockPrisma.post.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Post',
          content: 'This is a test post',
          authorId: 'user-1',
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      })
    })

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Post',
          content: 'This is a test post',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await createPostHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(mockPrisma.post.create).not.toHaveBeenCalled()
    })

    it('should return 400 for invalid post data', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: '', // Empty title should be invalid
          content: 'This is a test post',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await createPostHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(mockPrisma.post.create).not.toHaveBeenCalled()
    })
  })

  describe('Post Retrieval', () => {
    it('should fetch posts successfully', async () => {
      const mockPosts = [mockPost]
      mockPrisma.post.findMany.mockResolvedValue(mockPosts as any)

      const request = new NextRequest('http://localhost:3000/api/posts')
      const response = await getPostsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toEqual(mockPosts)
      expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
        skip: 0,
      })
    })

    it('should handle pagination correctly', async () => {
      const mockPosts = [mockPost]
      mockPrisma.post.findMany.mockResolvedValue(mockPosts as any)

      const request = new NextRequest('http://localhost:3000/api/posts?page=2&limit=10')
      const response = await getPostsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toEqual(mockPosts)
      expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: 10,
      })
    })
  })

  describe('Post Likes', () => {
    it('should like a post successfully', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.like.findUnique.mockResolvedValue(null)
      mockPrisma.like.create.mockResolvedValue({
        id: 'like-1',
        userId: 'user-1',
        postId: 'post-1',
        createdAt: new Date(),
      } as any)
      mockPrisma.notification.create.mockResolvedValue({} as any)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/like', {
        method: 'POST',
      })

      const response = await likeHandler(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockPrisma.like.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          postId: 'post-1',
        },
      })
      expect(mockPrisma.notification.create).toHaveBeenCalled()
    })

    it('should not create duplicate likes', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.like.findUnique.mockResolvedValue({
        id: 'like-1',
        userId: 'user-1',
        postId: 'post-1',
      } as any)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/like', {
        method: 'POST',
      })

      const response = await likeHandler(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Post already liked')
      expect(mockPrisma.like.create).not.toHaveBeenCalled()
    })

    it('should unlike a post successfully', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.like.findUnique.mockResolvedValue({
        id: 'like-1',
        userId: 'user-1',
        postId: 'post-1',
      } as any)
      mockPrisma.like.delete.mockResolvedValue({} as any)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/like', {
        method: 'DELETE',
      })

      const response = await unlikeHandler(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockPrisma.like.delete).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: 'user-1',
            postId: 'post-1',
          },
        },
      })
    })

    it('should return 404 when trying to unlike non-existent like', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.like.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/like', {
        method: 'DELETE',
      })

      const response = await unlikeHandler(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Like not found')
      expect(mockPrisma.like.delete).not.toHaveBeenCalled()
    })
  })

  describe('Post Comments', () => {
    const mockComment = {
      id: 'comment-1',
      content: 'This is a test comment',
      authorId: 'user-1',
      postId: 'post-1',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      author: mockUser,
    }

    it('should create a comment successfully', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)
      mockPrisma.comment.create.mockResolvedValue(mockComment as any)
      mockPrisma.notification.create.mockResolvedValue({} as any)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: 'This is a test comment',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await commentHandler(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.comment).toEqual(mockComment)
      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'This is a test comment',
          authorId: 'user-1',
          postId: 'post-1',
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      })
      expect(mockPrisma.notification.create).toHaveBeenCalled()
    })

    it('should fetch comments successfully', async () => {
      const mockComments = [mockComment]
      mockPrisma.comment.findMany.mockResolvedValue(mockComments as any)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments')
      const response = await getCommentsHandler(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.comments).toEqual(mockComments)
      expect(mockPrisma.comment.findMany).toHaveBeenCalledWith({
        where: {
          postId: 'post-1',
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
    })

    it('should return 400 for empty comment content', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: '', // Empty content should be invalid
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await commentHandler(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(mockPrisma.comment.create).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      mockPrisma.post.findMany.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/posts')
      const response = await getPostsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('should return 404 for non-existent post', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts/non-existent/like', {
        method: 'POST',
      })

      const response = await likeHandler(request, { params: { postId: 'non-existent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Post not found')
    })

    it('should handle malformed JSON gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await createPostHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid JSON')
    })
  })

  describe('Authorization', () => {
    it('should prevent unauthorized users from creating posts', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Post',
          content: 'This is a test post',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await createPostHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should prevent unauthorized users from liking posts', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/like', {
        method: 'POST',
      })

      const response = await likeHandler(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should prevent unauthorized users from commenting', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: 'This is a test comment',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await commentHandler(request, { params: { postId: 'post-1' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('Notification Creation', () => {
    it('should create notification when post is liked', async () => {
      const postByAnotherUser = {
        ...mockPost,
        authorId: 'author-2',
        author: {
          id: 'author-2',
          username: 'author',
          name: 'Post Author',
          email: 'author@example.com',
        },
      }

      mockPrisma.post.findUnique.mockResolvedValue(postByAnotherUser as any)
      mockPrisma.like.findUnique.mockResolvedValue(null)
      mockPrisma.like.create.mockResolvedValue({
        id: 'like-1',
        userId: 'user-1',
        postId: 'post-1',
        createdAt: new Date(),
      } as any)
      mockPrisma.notification.create.mockResolvedValue({} as any)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/like', {
        method: 'POST',
      })

      await likeHandler(request, { params: { postId: 'post-1' } })

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          type: 'LIKE',
          userId: 'author-2', // Post author should receive notification
          fromUserId: 'user-1', // User who liked the post
          postId: 'post-1',
          message: 'Test User liked your post',
        },
      })
    })

    it('should not create notification when user likes own post', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(mockPost as any) // Post by same user
      mockPrisma.like.findUnique.mockResolvedValue(null)
      mockPrisma.like.create.mockResolvedValue({
        id: 'like-1',
        userId: 'user-1',
        postId: 'post-1',
        createdAt: new Date(),
      } as any)

      const request = new NextRequest('http://localhost:3000/api/posts/post-1/like', {
        method: 'POST',
      })

      await likeHandler(request, { params: { postId: 'post-1' } })

      expect(mockPrisma.notification.create).not.toHaveBeenCalled()
    })
  })
})