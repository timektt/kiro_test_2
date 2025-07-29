import Link from 'next/link'
import { Users, Trophy, Calendar, MapPin, Link as LinkIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, cn } from '@/lib/utils'
import type { User, MBTIType } from '@/types'

interface ProfileSidebarProps {
  user: User & {
    mbti?: { type: MBTIType; description?: string | null } | null
    _count?: {
      posts: number
      followers: number
      following: number
    }
  }
  currentUserId?: string
  className?: string
}

const mbtiDescriptions: Record<MBTIType, string> = {
  INTJ: 'The Architect',
  INTP: 'The Thinker', 
  ENTJ: 'The Commander',
  ENTP: 'The Debater',
  INFJ: 'The Advocate',
  INFP: 'The Mediator',
  ENFJ: 'The Protagonist',
  ENFP: 'The Campaigner',
  ISTJ: 'The Logistician',
  ISFJ: 'The Protector',
  ESTJ: 'The Executive',
  ESFJ: 'The Consul',
  ISTP: 'The Virtuoso',
  ISFP: 'The Adventurer',
  ESTP: 'The Entrepreneur',
  ESFP: 'The Entertainer',
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

export function ProfileSidebar({ user, currentUserId, className }: ProfileSidebarProps) {
  const isOwnProfile = currentUserId === user.id
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const socialLinks = user.socialLinks as Record<string, string> || {}

  return (
    <div className={cn('space-y-4 sm:space-y-6', className)}>
      {/* Profile Card */}
      <Card className="overflow-hidden">
        <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-3 sm:mb-4 ring-2 ring-border">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="text-xl sm:text-2xl font-semibold">
              {user.name ? getInitials(user.name) : user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <CardTitle className="text-lg sm:text-xl leading-tight">{user.name || user.username}</CardTitle>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            
            {user.mbti && (
              <div className="flex justify-center">
                <Badge className={cn('text-xs sm:text-sm px-2 py-1', mbtiColors[user.mbti.type])}>
                  <span className="hidden sm:inline">{user.mbti.type} - </span>
                  <span className="sm:hidden">{user.mbti.type}</span>
                  <span className="hidden sm:inline">{mbtiDescriptions[user.mbti.type]}</span>
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Bio */}
          {user.bio && (
            <div>
              <p className="text-sm leading-relaxed break-words">{user.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center py-2 sm:py-3 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <div className="font-semibold text-base sm:text-lg">{user._count?.posts || 0}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="space-y-1 border-x border-border/50">
              <div className="font-semibold text-base sm:text-lg">{user._count?.followers || 0}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-base sm:text-lg">{user._count?.following || 0}</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>

          {/* Social Links */}
          {Object.keys(socialLinks).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Links</h4>
              <div className="space-y-1">
                {Object.entries(socialLinks).map(([platform, url]) => (
                  <Link
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] sm:min-h-[auto] py-2 sm:py-1 -mx-2 px-2 rounded-md hover:bg-muted/50"
                  >
                    <LinkIcon className="h-3 w-3 flex-shrink-0" />
                    <span className="capitalize truncate">{platform}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {isOwnProfile ? (
              <Button 
                variant="outline" 
                className="w-full min-h-[44px] sm:min-h-[auto] text-sm" 
                asChild
              >
                <Link href="/settings/profile">Edit Profile</Link>
              </Button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button className="w-full min-h-[44px] sm:min-h-[auto] text-sm">
                  Follow
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full min-h-[44px] sm:min-h-[auto] text-sm"
                >
                  Message
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* MBTI Details */}
      {user.mbti && (
        <Card className="overflow-hidden">
          <CardHeader className="px-4 sm:px-6 pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <span className="text-lg">🧠</span>
              <span>Personality Type</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm sm:text-base">{user.mbti.type}</span>
                <Badge className={cn('text-xs px-2 py-1', mbtiColors[user.mbti.type])}>
                  <span className="hidden sm:inline">{mbtiDescriptions[user.mbti.type]}</span>
                  <span className="sm:hidden">{mbtiDescriptions[user.mbti.type].split(' ')[1]}</span>
                </Badge>
              </div>
              {user.mbti.description && (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                  {user.mbti.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking */}
      <Card className="overflow-hidden">
        <CardHeader className="px-4 sm:px-6 pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span>Community Ranking</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center min-h-[44px] sm:min-h-[auto] py-2 sm:py-1">
              <span className="text-sm">Posts Likes</span>
              <Badge variant="secondary" className="text-xs px-2 py-1">#42</Badge>
            </div>
            <div className="flex justify-between items-center min-h-[44px] sm:min-h-[auto] py-2 sm:py-1">
              <span className="text-sm">Engagement</span>
              <Badge variant="secondary" className="text-xs px-2 py-1">#28</Badge>
            </div>
            <div className="flex justify-between items-center min-h-[44px] sm:min-h-[auto] py-2 sm:py-1">
              <span className="text-sm">Followers</span>
              <Badge variant="secondary" className="text-xs px-2 py-1">#15</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileSidebar