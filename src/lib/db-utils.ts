import { prisma } from './prisma'
import type { User, Post, Comment, Ranking, RankingType } from '@/types'

// User utilities
export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      mbti: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  })
}

export async function getUserWithStats(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      mbti: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
          likes: true,
          comments: true,
        },
      },
    },
  })
}

// Post utilities
export async function getPostsWithEngagement(limit = 10, cursor?: string) {
  return await prisma.post.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        include: {
          mbti: true,
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
}

export async function getPostWithDetails(postId: string) {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        include: {
          mbti: true,
        },
      },
      comments: {
        include: {
          author: {
            include: {
              mbti: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      likes: {
        include: {
          user: true,
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
}

// Ranking utilities
export async function updateUserRanking(
  userId: string,
  type: RankingType,
  score: number,
  period: string = new Date().toISOString().slice(0, 7)
) {
  return await prisma.ranking.upsert({
    where: {
      userId_type_period: {
        userId,
        type,
        period,
      },
    },
    update: {
      score,
      updatedAt: new Date(),
    },
    create: {
      userId,
      type,
      score,
      period,
    },
  })
}

export async function calculateAndUpdateRankings(period: string) {
  // Calculate post likes rankings
  const postLikesRankings = await prisma.$queryRaw<
    Array<{ userId: string; totalLikes: number }>
  >`
    SELECT 
      p."authorId" as "userId",
      COUNT(l.id)::int as "totalLikes"
    FROM posts p
    LEFT JOIN likes l ON p.id = l."postId"
    WHERE p."createdAt" >= date_trunc('month', CURRENT_DATE)
    GROUP BY p."authorId"
    ORDER BY "totalLikes" DESC
  `

  // Update rankings with calculated ranks
  for (let i = 0; i < postLikesRankings.length; i++) {
    const ranking = postLikesRankings[i]
    await prisma.ranking.upsert({
      where: {
        userId_type_period: {
          userId: ranking.userId,
          type: 'POSTS_LIKES',
          period,
        },
      },
      update: {
        score: ranking.totalLikes,
        rank: i + 1,
        updatedAt: new Date(),
      },
      create: {
        userId: ranking.userId,
        type: 'POSTS_LIKES',
        score: ranking.totalLikes,
        rank: i + 1,
        period,
      },
    })
  }

  // Calculate followers count rankings
  const followersRankings = await prisma.$queryRaw<
    Array<{ userId: string; followersCount: number }>
  >`
    SELECT 
      u.id as "userId",
      COUNT(f.id)::int as "followersCount"
    FROM users u
    LEFT JOIN follows f ON u.id = f."followingId"
    GROUP BY u.id
    ORDER BY "followersCount" DESC
  `

  // Update followers rankings
  for (let i = 0; i < followersRankings.length; i++) {
    const ranking = followersRankings[i]
    await prisma.ranking.upsert({
      where: {
        userId_type_period: {
          userId: ranking.userId,
          type: 'FOLLOWERS_COUNT',
          period,
        },
      },
      update: {
        score: ranking.followersCount,
        rank: i + 1,
        updatedAt: new Date(),
      },
      create: {
        userId: ranking.userId,
        type: 'FOLLOWERS_COUNT',
        score: ranking.followersCount,
        rank: i + 1,
        period,
      },
    })
  }
}

export async function getLeaderboard(
  type: RankingType,
  period: string = new Date().toISOString().slice(0, 7),
  limit = 10
) {
  return await prisma.ranking.findMany({
    where: {
      type,
      period,
    },
    include: {
      user: {
        include: {
          mbti: true,
        },
      },
    },
    orderBy: [
      { rank: 'asc' },
      { score: 'desc' },
    ],
    take: limit,
  })
}

// Notification utilities
export async function createNotification(
  userId: string,
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'SYSTEM',
  message: string,
  relatedId?: string,
  actorId?: string
) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      message,
      relatedId,
      actorId,
    },
  })
}

export async function markNotificationsAsRead(userId: string, notificationIds?: string[]) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      id: notificationIds ? { in: notificationIds } : undefined,
      read: false,
    },
    data: {
      read: true,
    },
  })
}

// MBTI utilities
export async function assignMBTI(userId: string, type: string, description?: string) {
  return await prisma.mBTI.upsert({
    where: { userId },
    update: {
      type: type as any,
      description,
      assignedAt: new Date(),
    },
    create: {
      userId,
      type: type as any,
      description,
    },
  })
}

export async function getMBTIDistribution() {
  return await prisma.mBTI.groupBy({
    by: ['type'],
    _count: {
      type: true,
    },
    orderBy: {
      _count: {
        type: 'desc',
      },
    },
  })
}

// Analytics utilities
export async function getPlatformStats() {
  const [
    totalUsers,
    totalPosts,
    totalComments,
    totalLikes,
    activeUsersThisMonth,
  ] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.like.count(),
    prisma.user.count({
      where: {
        isActive: true,
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ])

  return {
    totalUsers,
    totalPosts,
    totalComments,
    totalLikes,
    activeUsersThisMonth,
  }
}
