'use client'

import { useState } from 'react'
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
  onFollow,
  onUnfollow,
  onMessage,
  className,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  
  const isOwnProfile = currentUserId === user.id
  const socialLinks = user.socialLinks as Record<string, string> || {}

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFollowToggle = async () => {
    setIsFollowLoading(true)
    try {
      if (isFollowing) {
        onUnfollow?.()
      } else {
        onFollow?.()
      }
    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.name || user.username} on Community Platform`,
          text: user.bio || `Check out ${user.name || user.username}'s profile`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        // TODO: Show toast notification
        console.log('Profile link copied to clipboard')
      }
    } catch (error) {
      console.error('Error sharing profile:', error)
    }
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
                {user.mbti && (
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
                <div className="text-center">
                  <div className="font-bold text-base sm:text-lg">{user._count?.followers || 0}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-base sm:text-lg">{user._count?.following || 0}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Following</div>
                </div>
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
                    <FollowButton
                      userId={user.id}
                      username={user.username}
                      className="flex-1 sm:flex-none"
                    />
                    
                    <Button variant="outline" onClick={onMessage} className="flex-1 sm:flex-none">
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
                        <DropdownMenuItem onClick={handleShare}>
                          <Share className="mr-2 h-4 w-4" />
                          Share Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Flag className="mr-2 h-4 w-4" />
                          Report User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Shield className="mr-2 h-4 w-4" />
                          Block User
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
        {user.bio && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {user.bio}
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>

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