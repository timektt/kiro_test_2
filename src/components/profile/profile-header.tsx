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
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
              <AvatarFallback className="text-3xl">
                {user.name ? getInitials(user.name) : user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left space-y-2">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {user.name || user.username}
                </h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {user.mbti && (
                  <Badge className={cn('text-sm', mbtiColors[user.mbti.type])}>
                    {user.mbti.type}
                  </Badge>
                )}
                {user.role !== 'USER' && (
                  <Badge className={cn('text-sm', roleColors[user.role])}>
                    {user.role}
                  </Badge>
                )}
                {!user.isActive && (
                  <Badge variant="secondary" className="text-sm">
                    Inactive
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">{user._count?.posts || 0}</div>
                  <div className="text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{user._count?.followers || 0}</div>
                  <div className="text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{user._count?.following || 0}</div>
                  <div className="text-muted-foreground">Following</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="flex items-start gap-2">
              {isOwnProfile ? (
                <>
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <FollowButton
                    userId={user.id}
                    username={user.username}
                  />
                  
                  <Button variant="outline" onClick={onMessage}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="px-2">
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {user.bio}
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>

          {/* Social Links */}
          {Object.keys(socialLinks).length > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              {Object.entries(socialLinks).map(([platform, url]) => (
                <Link
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
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
