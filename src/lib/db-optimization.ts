import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * Database query optimization utilities
 */

// Common select fields to avoid over-fetching
export const selectFields = {
  user: {
    id: true,
    username: true,
    name: true,
    image: true,
    bio: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  },
  
  userPublic: {
    id: true,
    username: true,
    name: true,
    image: true,
    bio: true,
    createdAt: true,
  },
  
  userMinimal: {
    id: true,
    username: true,
    name: true,
    image: true,
  },
  
  post: {
    id: true,
    content: true,
    imageUrl: true,
    isPublic: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
  },
  
  comment: {
    id: true,
    content: true,
    createdAt: true,
    authorId: true,
    postId: true,
  },
  
  notification: {
    id: true,
    type: true,
    message: true,
    isRead: true,
    createdAt: true,
    userId: true,
    actorId: true,
  },
}

// Optimized include patterns
export const includePatterns = {
  postWithAuthor: {
    author: {
      select: selectFields.userMinimal,
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  },
  
  postWithDetails: {
    author: {
      select: selectFields.userPublic,
      include: {
        mbti: {
          select: {
            type: true,
          },
        },
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  },
  
  commentWithAuthor: {
    author: {
      select: selectFields.userMinimal,
    },
  },
  
  notificationWithActor: {
    actor: {
      select: selectFields.userMinimal,
    },
  },
  
  userWithStats: {
    mbti: {
      select: {
        type: true,
        description: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
        following: true,
      },
    },
  },
}

/**
 * Optimized query builders
 */
export class OptimizedQueries {
  /**
   * Get posts with optimized includes and pagination
   */
  static async getPosts(options: {
    where?: Prisma.PostWhereInput
    orderBy?: Prisma.PostOrderByWithRelationInput[]
    page?: number
    limit?: number
    userId?: string
  }) {
    const { where = {}, orderBy = [{ createdAt: 'desc' }], page = 1, limit = 20, userId } = options
    const skip = (page - 1) * limit

    // Build optimized where clause
    const optimizedWhere: Prisma.PostWhereInput = {
      ...where,
      isPublic: true,
      author: {
        isActive: true,
      },
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: optimizedWhere,
        include: includePatterns.postWithDetails,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.post.count({ where: optimizedWhere }),
    ])

    // If userId provided, get user's like status for posts
    let likedPostIds: string[] = []
    if (userId && posts.length > 0) {
      const likes = await prisma.like.findMany({
        where: {
          userId,
          postId: { in: posts.map(p => p.id) },
        },
        select: { postId: true },
      })
      likedPostIds = likes.map(l => l.postId)
    }

    const postsWithLikes = posts.map(post => ({
      ...post,
      isLiked: likedPostIds.includes(post.id),
    }))

    return {
      posts: postsWithLikes,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + posts.length < total,
      },
    }
  }

  /**
   * Get user feed with optimized queries
   */
  static async getUserFeed(userId: string, options: {
    page?: number
    limit?: number
    type?: 'following' | 'discover' | 'trending'
  }) {
    const { page = 1, limit = 20, type = 'following' } = options

    let where: Prisma.PostWhereInput = {
      isPublic: true,
      author: { isActive: true },
    }

    let orderBy: Prisma.PostOrderByWithRelationInput[] = [{ createdAt: 'desc' }]

    switch (type) {
      case 'following':
        // Get posts from followed users
        where = {
          ...where,
          author: {
            isActive: true,
            followers: {
              some: {
                followerId: userId,
              },
            },
          },
        }
        break

      case 'trending':
        // Get posts with high engagement in last 24 hours
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        where = {
          ...where,
          createdAt: { gte: yesterday },
        }
        orderBy = [
          { likes: { _count: 'desc' } },
          { comments: { _count: 'desc' } },
          { createdAt: 'desc' },
        ]
        break

      case 'discover':
        // Get posts from users not followed, ordered by engagement
        where = {
          ...where,
          author: {
            isActive: true,
            followers: {
              none: {
                followerId: userId,
              },
            },
          },
        }
        orderBy = [
          { likes: { _count: 'desc' } },
          { createdAt: 'desc' },
        ]
        break
    }

    return this.getPosts({ where, orderBy, page, limit, userId })
  }

  /**
   * Get user profile with optimized data
   */
  static async getUserProfile(username: string, currentUserId?: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        ...selectFields.userPublic,
        ...includePatterns.userWithStats,
      },
    })

    if (!user) return null

    // Check if current user follows this user
    let isFollowing = false
    if (currentUserId && currentUserId !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      })
      isFollowing = !!follow
    }

    return {
      ...user,
      isFollowing,
    }
  }

  /**
   * Get notifications with optimized includes
   */
  static async getNotifications(userId: string, options: {
    page?: number
    limit?: number
    unreadOnly?: boolean
  }) {
    const { page = 1, limit = 20, unreadOnly = false } = options
    const skip = (page - 1) * limit

    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(unreadOnly && { isRead: false }),
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: includePatterns.notificationWithActor,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ])

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + notifications.length < total,
      },
    }
  }

  /**
   * Search users with optimized query
   */
  static async searchUsers(query: string, options: {
    page?: number
    limit?: number
    mbtiFilter?: string
    currentUserId?: string
  }) {
    const { page = 1, limit = 20, mbtiFilter, currentUserId } = options
    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {
      isActive: true,
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ],
      ...(mbtiFilter && {
        mbti: { type: mbtiFilter },
      }),
      ...(currentUserId && {
        id: { not: currentUserId },
      }),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          ...selectFields.userPublic,
          ...includePatterns.userWithStats,
        },
        orderBy: [
          { followers: { _count: 'desc' } },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    // Get following status if currentUserId provided
    let followingMap: Record<string, boolean> = {}
    if (currentUserId && users.length > 0) {
      const follows = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: users.map(u => u.id) },
        },
        select: { followingId: true },
      })
      followingMap = follows.reduce((acc, f) => ({ ...acc, [f.followingId]: true }), {})
    }

    const usersWithFollowStatus = users.map(user => ({
      ...user,
      isFollowing: followingMap[user.id] || false,
    }))

    return {
      users: usersWithFollowStatus,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + users.length < total,
      },
    }
  }

  /**
   * Get post comments with optimized includes
   */
  static async getPostComments(postId: string, options: {
    page?: number
    limit?: number
  }) {
    const { page = 1, limit = 20 } = options
    const skip = (page - 1) * limit

    const where: Prisma.CommentWhereInput = {
      postId,
      author: { isActive: true },
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: includePatterns.commentWithAuthor,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ])

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + comments.length < total,
      },
    }
  }

  /**
   * Get user followers/following with optimized query
   */
  static async getUserConnections(userId: string, type: 'followers' | 'following', options: {
    page?: number
    limit?: number
    currentUserId?: string
  }) {
    const { page = 1, limit = 20, currentUserId } = options
    const skip = (page - 1) * limit

    const isFollowers = type === 'followers'
    const where = isFollowers
      ? { followingId: userId }
      : { followerId: userId }

    const [connections, total] = await Promise.all([
      prisma.follow.findMany({
        where,
        include: {
          [isFollowers ? 'follower' : 'following']: {
            select: {
              ...selectFields.userPublic,
              ...includePatterns.userWithStats,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.follow.count({ where }),
    ])

    const users = connections.map(conn => 
      isFollowers ? conn.follower : conn.following
    )

    // Get following status if currentUserId provided
    let followingMap: Record<string, boolean> = {}
    if (currentUserId && users.length > 0) {
      const follows = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: users.map(u => u.id) },
        },
        select: { followingId: true },
      })
      followingMap = follows.reduce((acc, f) => ({ ...acc, [f.followingId]: true }), {})
    }

    const usersWithFollowStatus = users.map(user => ({
      ...user,
      isFollowing: followingMap[user.id] || false,
    }))

    return {
      users: usersWithFollowStatus,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + users.length < total,
      },
    }
  }
}

/**
 * Database performance monitoring
 */
export class DatabaseMonitor {
  private static queryTimes: Map<string, number[]> = new Map()

  static startQuery(queryName: string): () => void {
    const startTime = Date.now()
    
    return () => {
      const endTime = Date.now()
      const duration = endTime - startTime
      
      if (!this.queryTimes.has(queryName)) {
        this.queryTimes.set(queryName, [])
      }
      
      const times = this.queryTimes.get(queryName)!
      times.push(duration)
      
      // Keep only last 100 measurements
      if (times.length > 100) {
        times.shift()
      }
      
      // Log slow queries (> 1 second)
      if (duration > 1000) {
        console.warn(`Slow query detected: ${queryName} took ${duration}ms`)
      }
    }
  }

  static getQueryStats(queryName: string) {
    const times = this.queryTimes.get(queryName) || []
    if (times.length === 0) return null

    const avg = times.reduce((sum, time) => sum + time, 0) / times.length
    const min = Math.min(...times)
    const max = Math.max(...times)
    const p95 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)]

    return { avg, min, max, p95, count: times.length }
  }

  static getAllStats() {
    const stats: Record<string, any> = {}
    for (const [queryName] of this.queryTimes) {
      stats[queryName] = this.getQueryStats(queryName)
    }
    return stats
  }
}

/**
 * Query optimization middleware
 */
export function withQueryOptimization<T extends (...args: any[]) => Promise<any>>(
  queryName: string,
  queryFn: T
): T {
  return (async (...args: any[]) => {
    const endTimer = DatabaseMonitor.startQuery(queryName)
    try {
      const result = await queryFn(...args)
      return result
    } finally {
      endTimer()
    }
  }) as T
}


