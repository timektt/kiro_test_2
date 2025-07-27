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
    <div className={cn('space-y-6', className)}>
      {/* Profile Card */}
      <Card>
        <CardHeader className="text-center pb-4">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="text-2xl">
              {user.name ? getInitials(user.name) : user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <CardTitle className="text-xl">{user.name || user.username}</CardTitle>
            <p className="text-muted-foreground">@{user.username}</p>
            
            {user.mbti && (
              <div className="flex justify-center">
                <Badge className={cn('text-sm', mbtiColors[user.mbti.type])}>
                  {user.mbti.type} - {mbtiDescriptions[user.mbti.type]}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Bio */}
          {user.bio && (
            <div>
              <p className="text-sm leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-semibold text-lg">{user._count?.posts || 0}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div>
              <div className="font-semibold text-lg">{user._count?.followers || 0}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="font-semibold text-lg">{user._count?.following || 0}</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
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
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LinkIcon className="h-3 w-3" />
                    <span className="capitalize">{platform}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {isOwnProfile ? (
              <Button variant="outline" className="w-full" asChild>
                <Link href="/settings/profile">Edit Profile</Link>
              </Button>
            ) : (
              <>
                <Button className="w-full">Follow</Button>
                <Button variant="outline" className="w-full">Message</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* MBTI Details */}
      {user.mbti && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🧠 Personality Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{user.mbti.type}</span>
                <Badge className={mbtiColors[user.mbti.type]}>
                  {mbtiDescriptions[user.mbti.type]}
                </Badge>
              </div>
              {user.mbti.description && (
                <p className="text-sm text-muted-foreground">
                  {user.mbti.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Community Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Posts Likes</span>
              <Badge variant="secondary">#42</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Engagement</span>
              <Badge variant="secondary">#28</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Followers</span>
              <Badge variant="secondary">#15</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

