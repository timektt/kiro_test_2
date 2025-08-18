import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

export interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE'
  showEmail: boolean
  showMBTI: boolean
  showBio: boolean
  showJoinDate: boolean
  showFollowerCount: boolean
  showFollowingCount: boolean
  defaultPostVisibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE' | 'CUSTOM'
  allowComments: boolean
  allowLikes: boolean
  allowShares: boolean
  allowDirectMessages: boolean
  allowMentions: boolean
  allowTagging: boolean
  showOnlineStatus: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

export class PrivacyService {
  /**
   * Check if a user is blocked by another user
   */
  static async isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    try {
      const block = await prisma.blockedUser.findUnique({
        where: {
          userId_blockedId: {
            userId: blockerId,
            blockedId: blockedId
          }
        }
      })
      return !!block
    } catch (error) {
      logger.error('Error checking if user is blocked:', error)
      return false
    }
  }

  /**
   * Check if two users have blocked each other
   */
  static async areUsersBlocked(userId1: string, userId2: string): Promise<boolean> {
    try {
      const [block1, block2] = await Promise.all([
        this.isUserBlocked(userId1, userId2),
        this.isUserBlocked(userId2, userId1)
      ])
      return block1 || block2
    } catch (error) {
      logger.error('Error checking if users are blocked:', error)
      return false
    }
  }

  /**
   * Get user's privacy settings
   */
  static async getUserPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    try {
      const settings = await prisma.privacySetting.findUnique({
        where: { userId }
      })
      return settings
    } catch (error) {
      logger.error('Error fetching user privacy settings:', error)
      return null
    }
  }

  /**
   * Check if a user can view another user's profile
   */
  static async canViewProfile(viewerId: string | null, targetUserId: string): Promise<boolean> {
    try {
      // If no viewer (anonymous), only public profiles are visible
      if (!viewerId) {
        const settings = await this.getUserPrivacySettings(targetUserId)
        return !settings || settings.profileVisibility === 'PUBLIC'
      }

      // Users can always view their own profile
      if (viewerId === targetUserId) {
        return true
      }

      // Check if users are blocked
      if (await this.areUsersBlocked(viewerId, targetUserId)) {
        return false
      }

      const settings = await this.getUserPrivacySettings(targetUserId)
      if (!settings || settings.profileVisibility === 'PUBLIC') {
        return true
      }

      if (settings.profileVisibility === 'PRIVATE') {
        return false
      }

      if (settings.profileVisibility === 'FOLLOWERS_ONLY') {
        // Check if viewer is following the target user
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: viewerId,
              followingId: targetUserId
            }
          }
        })
        return !!follow
      }

      return false
    } catch (error) {
      logger.error('Error checking profile visibility:', error)
      return false
    }
  }

  /**
   * Check if a user can view a post
   */
  static async canViewPost(viewerId: string | null, post: { authorId: string; visibility: string }): Promise<boolean> {
    try {
      // Users can always view their own posts
      if (viewerId === post.authorId) {
        return true
      }

      // Check if users are blocked
      if (viewerId && await this.areUsersBlocked(viewerId, post.authorId)) {
        return false
      }

      if (post.visibility === 'PUBLIC') {
        return true
      }

      if (!viewerId) {
        return false // Anonymous users can't see non-public posts
      }

      if (post.visibility === 'PRIVATE') {
        return false
      }

      if (post.visibility === 'FOLLOWERS_ONLY') {
        // Check if viewer is following the post author
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: viewerId,
              followingId: post.authorId
            }
          }
        })
        return !!follow
      }

      return false
    } catch (error) {
      logger.error('Error checking post visibility:', error)
      return false
    }
  }

  /**
   * Filter user profile data based on privacy settings
   */
  static async filterProfileData(viewerId: string | null, targetUser: any): Promise<any> {
    try {
      const canView = await this.canViewProfile(viewerId, targetUser.id)
      if (!canView) {
        return null
      }

      const settings = await this.getUserPrivacySettings(targetUser.id)
      if (!settings) {
        return targetUser // No privacy settings, return full profile
      }

      const filteredUser = { ...targetUser }

      // Apply privacy filters
      if (!settings.showEmail) {
        delete filteredUser.email
      }
      if (!settings.showMBTI) {
        delete filteredUser.mbti
      }
      if (!settings.showBio) {
        delete filteredUser.bio
      }
      if (!settings.showJoinDate) {
        delete filteredUser.createdAt
      }
      if (!settings.showFollowerCount) {
        delete filteredUser._count?.followers
        delete filteredUser.followersCount
      }
      if (!settings.showFollowingCount) {
        delete filteredUser._count?.following
        delete filteredUser.followingCount
      }

      return filteredUser
    } catch (error) {
      logger.error('Error filtering profile data:', error)
      return null
    }
  }

  /**
   * Get blocked user IDs for a user (for filtering queries)
   */
  static async getBlockedUserIds(userId: string): Promise<string[]> {
    try {
      const blocks = await prisma.blockedUser.findMany({
        where: {
          OR: [
            { userId: userId },
            { blockedId: userId }
          ]
        },
        select: {
          userId: true,
          blockedId: true
        }
      })

      const blockedIds = new Set<string>()
      blocks.forEach(block => {
        if (block.userId === userId) {
          blockedIds.add(block.blockedId)
        } else {
          blockedIds.add(block.userId)
        }
      })

      return Array.from(blockedIds)
    } catch (error) {
      logger.error('Error getting blocked user IDs:', error)
      return []
    }
  }
}