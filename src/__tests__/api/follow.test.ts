import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { POST, DELETE, GET } from '@/app/api/users/[userId]/follow/route'
import { GET as getFollowers } from '@/app/api/users/[userId]/followers/route'
import { GET as getFollowing } from '@/app/api/users/[userId]/following/route'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/db-utils'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    follow: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
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

const mockUser = {
  id: 'user-2',
  username: 'targetuser',
  name: 'Target User',
  email: 'target@example.com',
}

const mockFollow = {
  id: 'follow-1',
  followerId: 'user-1',
  followingId: 'user-2',
  createdAt: new Date(),
}

describe('/api/users/[userId]/follow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/users/[userId]/follow', () => {
    it('should create a follow relationship', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.follow.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.follow.create as jest.Mock).mockResolvedValue(mockFollow)
      ;(createNotification as jest.Mock).mockResolvedValue(undefined)

      const response = await POST(
        new NextRequest('http://localhost:3000/api/users/user-2/follow', { method: 'POST' }),
        { params: { userId: 'user-2' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockFollow)
      expect(prisma.follow.create).toHaveBeenCalledWith({
        data: {
          followerId: 'user-1',
          followingId: 'user-2',
        },
      })
      expect(createNotification).toHaveBeenCalledWith(
        'user-2',
        'FOLLOW',
        'Test User started following you',
        'user-1'
      )
    })

    it('should return 400 when trying to follow yourself', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const response = await POST(
        new NextRequest('http://localhost:3000/api/users/user-1/follow', { method: 'POST' }),
        { params: { userId: 'user-1' } }
      )
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Cannot follow yourself')
    })

    it('should return 404 when user does not exist', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await POST(
        new NextRequest('http://localhost:3000/api/users/nonexistent/follow', { method: 'POST' }),
        { params: { userId: 'nonexistent' } }
      )
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('User not found')
    })

    it('should return 409 when already following', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.follow.findUnique as jest.Mock).mockResolvedValue(mockFollow)

      const response = await POST(
        new NextRequest('http://localhost:3000/api/users/user-2/follow', { method: 'POST' }),
        { params: { userId: 'user-2' } }
      )
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Already following this user')
    })

    it('should return 401 when not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const response = await POST(
        new NextRequest('http://localhost:3000/api/users/user-2/follow', { method: 'POST' }),
        { params: { userId: 'user-2' } }
      )
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('DELETE /api/users/[userId]/follow', () => {
    it('should delete a follow relationship', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.follow.findUnique as jest.Mock).mockResolvedValue(mockFollow)
      ;(prisma.follow.delete as jest.Mock).mockResolvedValue(mockFollow)

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/users/user-2/follow', { method: 'DELETE' }),
        { params: { userId: 'user-2' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Unfollowed successfully')
      expect(prisma.follow.delete).toHaveBeenCalledWith({
        where: { id: 'follow-1' },
      })
    })

    it('should return 404 when not following', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.follow.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/users/user-2/follow', { method: 'DELETE' }),
        { params: { userId: 'user-2' } }
      )
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Not following this user')
    })

    it('should return 401 when not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const response = await DELETE(
        new NextRequest('http://localhost:3000/api/users/user-2/follow', { method: 'DELETE' }),
        { params: { userId: 'user-2' } }
      )
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('GET /api/users/[userId]/follow', () => {
    it('should return follow status when following', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.follow.findUnique as jest.Mock).mockResolvedValue(mockFollow)

      const response = await GET(
        new NextRequest('http://localhost:3000/api/users/user-2/follow'),
        { params: { userId: 'user-2' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual({
        isFollowing: true,
        followedAt: mockFollow.createdAt,
      })
    })

    it('should return follow status when not following', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      ;(prisma.follow.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await GET(
        new NextRequest('http://localhost:3000/api/users/user-2/follow'),
        { params: { userId: 'user-2' } }
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual({
        isFollowing: false,
        followedAt: null,
      })
    })

    it('should return 401 when not authenticated', async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const response = await GET(
        new NextRequest('http://localhost:3000/api/users/user-2/follow'),
        { params: { userId: 'user-2' } }
      )
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })
})

describe('/api/users/[userId]/followers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockFollowers = [
    {
      id: 'follow-1',
      followerId: 'user-2',
      followingId: 'user-1',
      createdAt: new Date(),
      follower: {
        id: 'user-2',
        username: 'follower1',
        name: 'Follower 1',
        image: null,
        bio: 'Bio 1',
        isActive: true,
        mbti: { type: 'INTJ' },
        _count: { followers: 5, following: 10, posts: 3 },
      },
    },
  ]

  it('should return followers list', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValueOnce(mockFollowers).mockResolvedValueOnce([])
    ;(prisma.follow.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/users/user-1/followers?page=1&limit=20')
    const response = await getFollowers(request, { params: { userId: 'user-1' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.followers).toHaveLength(1)
    expect(data.data.followers[0].username).toBe('follower1')
    expect(data.data.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      hasMore: false,
    })
  })

  it('should filter followers by search query', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValueOnce(mockFollowers).mockResolvedValueOnce([])
    ;(prisma.follow.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/users/user-1/followers?search=follower')
    const response = await getFollowers(request, { params: { userId: 'user-1' } })

    expect(prisma.follow.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          followingId: 'user-1',
          follower: {
            OR: [
              { username: { contains: 'follower', mode: 'insensitive' } },
              { name: { contains: 'follower', mode: 'insensitive' } },
            ],
          },
        },
      })
    )
  })

  it('should return 404 when user does not exist', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/users/nonexistent/followers')
    const response = await getFollowers(request, { params: { userId: 'nonexistent' } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('User not found')
  })

  it('should return 401 when not authenticated', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/users/user-1/followers')
    const response = await getFollowers(request, { params: { userId: 'user-1' } })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })
})

describe('/api/users/[userId]/following', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockFollowing = [
    {
      id: 'follow-1',
      followerId: 'user-1',
      followingId: 'user-2',
      createdAt: new Date(),
      following: {
        id: 'user-2',
        username: 'following1',
        name: 'Following 1',
        image: null,
        bio: 'Bio 1',
        isActive: true,
        mbti: { type: 'ENFP' },
        _count: { followers: 15, following: 5, posts: 8 },
      },
    },
  ]

  it('should return following list', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValueOnce(mockFollowing).mockResolvedValueOnce([])
    ;(prisma.follow.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/users/user-1/following?page=1&limit=20')
    const response = await getFollowing(request, { params: { userId: 'user-1' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.following).toHaveLength(1)
    expect(data.data.following[0].username).toBe('following1')
    expect(data.data.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      hasMore: false,
    })
  })

  it('should filter following by search query', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(prisma.follow.findMany as jest.Mock).mockResolvedValueOnce(mockFollowing).mockResolvedValueOnce([])
    ;(prisma.follow.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/users/user-1/following?search=following')
    const response = await getFollowing(request, { params: { userId: 'user-1' } })

    expect(prisma.follow.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          followerId: 'user-1',
          following: {
            OR: [
              { username: { contains: 'following', mode: 'insensitive' } },
              { name: { contains: 'following', mode: 'insensitive' } },
            ],
          },
        },
      })
    )
  })

  it('should return 404 when user does not exist', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/users/nonexistent/following')
    const response = await getFollowing(request, { params: { userId: 'nonexistent' } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('User not found')
  })

  it('should return 401 when not authenticated', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/users/user-1/following')
    const response = await getFollowing(request, { params: { userId: 'user-1' } })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })
})