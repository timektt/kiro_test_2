import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrivacyService } from '@/lib/services/privacy'
import logger from '@/lib/logger'

/**
 * Middleware to check if a user can access another user's data
 */
export async function withPrivacyCheck(
  request: NextRequest,
  targetUserId: string,
  action: 'view_profile' | 'view_posts' | 'send_message' | 'mention' | 'tag'
): Promise<NextResponse | null> {
  try {
    const session = await getServerSession(authOptions)
    const viewerId = session?.user?.id || null

    // Check if users are blocked
    if (viewerId && await PrivacyService.areUsersBlocked(viewerId, targetUserId)) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check specific action permissions
    switch (action) {
      case 'view_profile':
        const canViewProfile = await PrivacyService.canViewProfile(viewerId, targetUserId)
        if (!canViewProfile) {
          return NextResponse.json(
            { error: 'Profile not accessible' },
            { status: 403 }
          )
        }
        break

      case 'send_message':
        if (!viewerId) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }
        
        const targetSettings = await PrivacyService.getUserPrivacySettings(targetUserId)
        if (targetSettings && !targetSettings.allowDirectMessages) {
          // Check if they are following each other
          const canMessage = await checkMutualFollow(viewerId, targetUserId)
          if (!canMessage) {
            return NextResponse.json(
              { error: 'User does not accept direct messages' },
              { status: 403 }
            )
          }
        }
        break

      case 'mention':
        if (!viewerId) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }
        
        const mentionSettings = await PrivacyService.getUserPrivacySettings(targetUserId)
        if (mentionSettings && !mentionSettings.allowMentions) {
          return NextResponse.json(
            { error: 'User does not allow mentions' },
            { status: 403 }
          )
        }
        break

      case 'tag':
        if (!viewerId) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }
        
        const tagSettings = await PrivacyService.getUserPrivacySettings(targetUserId)
        if (tagSettings && !tagSettings.allowTagging) {
          return NextResponse.json(
            { error: 'User does not allow tagging' },
            { status: 403 }
          )
        }
        break
    }

    return null // No privacy violation, continue with request
  } catch (error) {
    logger.error('Privacy middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Check if two users follow each other
 */
async function checkMutualFollow(userId1: string, userId2: string): Promise<boolean> {
  try {
    const { prisma } = await import('@/lib/prisma')
    
    const [follow1, follow2] = await Promise.all([
      prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId1,
            followingId: userId2
          }
        }
      }),
      prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId2,
            followingId: userId1
          }
        }
      })
    ])

    return !!(follow1 && follow2)
  } catch (error) {
    logger.error('Error checking mutual follow:', error)
    return false
  }
}

/**
 * Filter posts based on privacy settings and blocked users
 */
export function createPostPrivacyFilter(viewerId: string | null, blockedUserIds: string[] = []) {
  const baseFilter = {
    // Exclude deleted posts
    deletedAt: null,
    
    // Exclude posts from blocked users
    authorId: {
      notIn: blockedUserIds
    }
  }

  if (!viewerId) {
    // Anonymous users can only see public posts
    return {
      ...baseFilter,
      visibility: 'PUBLIC'
    }
  }

  return {
    ...baseFilter,
    OR: [
      // Public posts
      { visibility: 'PUBLIC' },
      // Own posts
      { authorId: viewerId },
      // Followers-only posts where viewer follows the author
      {
        AND: [
          { visibility: 'FOLLOWERS_ONLY' },
          {
            author: {
              followers: {
                some: {
                  followerId: viewerId
                }
              }
            }
          }
        ]
      }
    ]
  }
}

/**
 * Filter users based on privacy settings and blocked users
 */
export function createUserPrivacyFilter(viewerId: string | null, blockedUserIds: string[] = []) {
  const baseFilter = {
    // Exclude inactive users
    isActive: true,
    
    // Exclude blocked users
    id: {
      notIn: blockedUserIds
    }
  }

  if (!viewerId) {
    // Anonymous users can only see public profiles
    return {
      ...baseFilter,
      OR: [
        { profileVisibility: 'public' },
        { profileVisibility: null } // Default to public
      ]
    }
  }

  return baseFilter // Authenticated users can see all non-blocked users (privacy is handled at data level)
}