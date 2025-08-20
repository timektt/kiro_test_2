'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Settings, 
  UserPlus, 
  MessageCircle, 
  MoreHorizontal, 
  Share,
  Flag,
  Shield,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FollowButton } from '@/components/ui/follow-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProfileEditForm } from '@/components/profile/profile-edit-form'
import { formatDate, cn } from '@/lib/utils'
import { useFollowers, useFollowing } from '@/hooks/use-follow'
import { useProfileVisibility, useBlockUser, useReportUser, getVisibleProfileInfo, canPerformAction } from '@/hooks/use-privacy'
import { toast } from 'sonner'
import type { User, MBTIType } from '@/types'

interface ProfileHeaderProps {
  user: User & {
    mbti?: { type: MBTIType; description?: string | null } | null
    _count?: {
      posts: number
      followers: number
      following: number
    }
  }
  currentUserId?: string
  isFollowing?: boolean
  isToggling?: boolean
  onFollow?: () => void
  onUnfollow?: () => void
  onMessage?: () => void
  className?: string
}

const mbtiColors: Record<MBTIType, string> = {
  // Analysts
  INTJ: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  INTP: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ENTJ: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ENTP: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  // Diplomats
  INFJ: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  INFP: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ENFJ: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ENFP: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  // Sentinels
  ISTJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ISFJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ESTJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ESFJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  // Explorers
  ISTP: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  ISFP: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  ESTP: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  ESFP: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

const roleColors = {
  USER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  MODERATOR: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
}

export function ProfileHeader({
  user,
  currentUserId,
  isFollowing = false,
  isToggling = false,
  onFollow,
  onUnfollow,
  onMessage,
  className,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isOwnProfile = currentUserId === user.id

  // Real-time follower counts
  const { totalCount: followersCount, isLoading: followersLoading, refresh: refreshFollowers } = useFollowers(user.id, 1, 1)
  const { totalCount: followingCount, isLoading: followingLoading, refresh: refreshFollowing } = useFollowing(user.id, 1, 1)
  
  // Get privacy visibility settings with error handling
  const { visibility } = useProfileVisibility(user.id, currentUserId)
  const { blockUser, isLoading: isBlockLoading } = useBlockUser()
  const { reportUser, isLoading: isReportLoading } = useReportUser()
  
  // Use real-time counts if available, fallback to user._count
  const followerCount = followersLoading ? user._count?.followers || 0 : followersCount || user._count?.followers || 0
  const finalFollowingCount = followingLoading ? user._count?.following || 0 : followingCount || user._count?.following || 0
  
  // Get visible profile information based on privacy settings
  const visibleInfo = getVisibleProfileInfo(visibility, isOwnProfile)

  // Privacy hooks are handled internally with toast notifications

  // Refresh counts when follow status changes
  useEffect(() => {
    if (!isToggling) {
      refreshFollowers()
      refreshFollowing()
    }
  }, [isFollowing, isToggling, refreshFollowers, refreshFollowing])
  const socialLinks = user.socialLinks as Record<string, string> || {}

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const handleFollowToggle = async () => {
    if (!canPerformAction(visibility, 'viewProfile')) {
      toast.error('You cannot follow this user due to privacy settings')
      return
    }

    if (!currentUserId) {
      toast.error('Please log in to follow users')
      return
    }
    
    setIsFollowLoading(true)
    try {
      if (isFollowing) {
        await onUnfollow?.()
        toast.success('Unfollowed successfully')
      } else {
        await onFollow?.()
        toast.success('Following successfully')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update follow status'
      toast.error(errorMessage)
      console.error('Error toggling follow:', error)
    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleShare = async () => {
    if (!canPerformAction(visibility, 'viewProfile')) {
      toast.error('This profile cannot be shared due to privacy settings')
      return
    }
    
    try {
      const url = `${window.location.origin}/profile/${user.username}`
      
      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: `${user.name || user.username}'s Profile`,
          text: `Check out ${user.name || user.username}'s profile on our platform`,
          url: url,
        })
        toast.success('Profile shared successfully')
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
        toast.success('Profile link copied to clipboard!')
      }
    } catch (error) {
      // If sharing was cancelled, don't show error
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to share profile'
      toast.error(errorMessage)
      console.error('Error sharing profile:', error)
    }
  }

  const handleMessage = async () => {
    if (!canPerformAction(visibility, 'sendMessage')) {
      toast.error('You cannot message this user due to privacy settings')
      return
    }

    if (!currentUserId) {
      toast.error('Please log in to send messages')
      return
    }

    if (currentUserId === user.id) {
      toast.error('You cannot message yourself')
      return
    }
    
    try {
      // Navigate to chat or open message modal
      onMessage?.()
      toast.success('Opening chat...')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to open chat'
      toast.error(errorMessage)
      console.error('Error opening message:', error)
    }
  }
  
  const handleBlock = async () => {
    if (!currentUserId) {
      toast.error('Please log in to block users')
      return
    }

    if (currentUserId === user.id) {
      toast.error('You cannot block yourself')
      return
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to block @${user.username}? This will prevent them from following you or sending you messages.`
    )
    
    if (!confirmed) {
      return
    }

    try {
      await blockUser(user.id)
      toast.success(`@${user.username} has been blocked`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to block user'
      toast.error(errorMessage)
      console.error('Error blocking user:', error)
    }
  }
  
  const handleReport = async () => {
    if (!currentUserId) {
      toast.error('Please log in to report users')
      return
    }

    if (currentUserId === user.id) {
      toast.error('You cannot report yourself')
      return
    }

    // Show confirmation dialog with reason selection
    const reason = window.prompt(
      `Why are you reporting @${user.username}?\n\nCommon reasons:\n- Harassment or bullying\n- Spam or fake account\n- Inappropriate content\n- Impersonation\n- Other\n\nPlease enter your reason:`
    )
    
    if (!reason || reason.trim() === '') {
      return
    }

    try {
      await reportUser(user.id, 'inappropriate_behavior', reason.trim())
      toast.success(`Report submitted for @${user.username}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to report user'
      toast.error(errorMessage)
      console.error('Error reporting user:', error)
    }
  }

  // Show loading state if privacy data is still loading
  if (!visibility) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:gap-6 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="h-24 w-24 sm:h-32 sm:w-32 bg-muted rounded-full flex-shrink-0" />
              <div className="text-center sm:text-left space-y-2 sm:space-y-3 flex-1 min-w-0">
                <div className="space-y-1">
                  <div className="h-6 sm:h-8 bg-muted rounded w-48 mx-auto sm:mx-0" />
                  <div className="h-4 bg-muted rounded w-32 mx-auto sm:mx-0" />
                </div>
                <div className="flex justify-center sm:justify-start gap-2">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
                <div className="flex justify-center sm:justify-start gap-4">
                  <div className="text-center">
                    <div className="h-5 bg-muted rounded w-8 mx-auto mb-1" />
                    <div className="h-3 bg-muted rounded w-12" />
                  </div>
                  <div className="text-center">
                    <div className="h-5 bg-muted rounded w-8 mx-auto mb-1" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                  <div className="text-center">
                    <div className="h-5 bg-muted rounded w-8 mx-auto mb-1" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center sm:justify-start">
              <div className="flex gap-2">
                <div className="h-10 bg-muted rounded w-24" />
                <div className="h-10 bg-muted rounded w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isEditing) {
    return (
      <ProfileEditForm
        user={user}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg flex-shrink-0">
              <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
              <AvatarFallback className="text-2xl sm:text-3xl">
                {user.name ? getInitials(user.name) : user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left space-y-2 sm:space-y-3 flex-1 min-w-0">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
                  {user.name || user.username}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground truncate">@{user.username}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2">
                {user.mbti && visibleInfo.showMBTI && (
                  <Badge className={cn('text-xs sm:text-sm', mbtiColors[user.mbti.type])}>
                    {user.mbti.type}
                  </Badge>
                )}
                {user.role !== 'USER' && (
                  <Badge className={cn('text-xs sm:text-sm', roleColors[user.role])}>
                    {user.role}
                  </Badge>
                )}
                {!user.isActive && (
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    Inactive
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-base sm:text-lg">{user._count?.posts || 0}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Posts</div>
                </div>
                {visibleInfo.showFollowerCount && (
                  <div className="text-center">
                    {followersLoading ? (
                      <div className="h-5 w-8 bg-muted animate-pulse rounded mx-auto mb-1" />
                    ) : (
                      <div className="font-bold text-base sm:text-lg">{followerCount}</div>
                    )}
                    <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
                  </div>
                )}
                {visibleInfo.showFollowingCount && (
                  <div className="text-center">
                    {followingLoading ? (
                      <div className="h-5 w-8 bg-muted animate-pulse rounded mx-auto mb-1" />
                    ) : (
                      <div className="font-bold text-base sm:text-lg">{finalFollowingCount}</div>
                    )}
                    <div className="text-xs sm:text-sm text-muted-foreground">Following</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center sm:justify-start">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2 w-full sm:w-auto">
              {isOwnProfile ? (
                <>
                  <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                    <Edit className="mr-2 h-4 w-4" />
                    <span className="sm:inline">Edit Profile</span>
                  </Button>
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span className="sm:inline">Settings</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant={isFollowing ? 'outline' : 'default'}
                      onClick={handleFollowToggle}
                      disabled={isFollowLoading}
                      onClick={handleFollowClick}
                    >
                      {isFollowLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          {isFollowing ? 'Unfollowing...' : 'Following...'}
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          {isFollowing ? 'Following' : 'Follow'}
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleMessage} 
                      className="flex-1 sm:flex-none"
                      disabled={!canPerformAction(visibility, 'sendMessage') || !currentUserId || currentUserId === user.id}
                      title={
                        !currentUserId ? 'Please log in to send messages' :
                        currentUserId === user.id ? 'You cannot message yourself' :
                        !canPerformAction(visibility, 'sendMessage') ? 'Cannot message due to privacy settings' :
                        undefined
                      }
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Message</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="px-3">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={handleShare}
                          disabled={!canPerformAction(visibility, 'viewProfile')}
                        >
                          <Share className="mr-2 h-4 w-4" />
                          Share Profile
                          {!canPerformAction(visibility, 'viewProfile') && (
                            <span className="ml-auto text-xs text-muted-foreground">(Private)</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={handleReport} 
                          className="text-destructive"
                          disabled={isReportLoading || !currentUserId || currentUserId === user.id}
                        >
                          {isReportLoading ? (
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Flag className="mr-2 h-4 w-4" />
                          )}
                          {isReportLoading ? 'Reporting...' : 'Report User'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleBlock} 
                          className="text-destructive"
                          disabled={isBlockLoading || !currentUserId || currentUserId === user.id}
                        >
                          {isBlockLoading ? (
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Shield className="mr-2 h-4 w-4" />
                          )}
                          {isBlockLoading ? 'Blocking...' : 'Block User'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && visibleInfo.showBio && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {user.bio}
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t space-y-2 sm:space-y-3">
          {visibleInfo.showJoinDate && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          )}

          {/* Social Links */}
          {Object.keys(socialLinks).length > 0 && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {Object.entries(socialLinks).map(([platform, url]) => (
                <Link
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] sm:min-h-[auto] py-2 sm:py-0"
                >
                  <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="capitalize">{platform}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileHeader