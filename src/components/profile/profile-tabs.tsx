'use client'

import { useState } from 'react'
import { FileText, Heart, MessageSquare, Users, TrendingUp, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PostItem } from '@/components/ui/post-item'
import { EmptyState } from '@/components/ui/empty-state'
import { ProfileActivity } from '@/components/profile/profile-activity'
import { cn } from '@/lib/utils'
import type { User, Post } from '@/types'

interface ProfileTabsProps {
  user: User & {
    _count?: {
      posts: number
      followers: number
      following: number
      likes: number
      comments: number
    }
  }
  posts: Array<Post & {
    author: User & { mbti?: { type: string } | null }
    _count: { likes: number; comments: number }
  }>
  currentUserId?: string
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onBookmark?: (postId: string) => void
  className?: string
}

const tabs = [
  {
    id: 'posts',
    label: 'Posts',
    icon: FileText,
  },
  {
    id: 'likes',
    label: 'Likes',
    icon: Heart,
  },
  {
    id: 'comments',
    label: 'Comments',
    icon: MessageSquare,
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: TrendingUp,
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks',
    icon: Bookmark,
  },
]

export function ProfileTabs({
  user,
  posts,
  currentUserId,
  onLike,
  onComment,
  onShare,
  onBookmark,
  className,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('posts')
  const isOwnProfile = currentUserId === user.id

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  onLike={onLike}
                  onComment={onComment}
                  onShare={onShare}
                  onBookmark={onBookmark}
                />
              ))
            ) : (
              <EmptyState
                icon={FileText}
                title="No posts yet"
                description={
                  isOwnProfile
                    ? "You haven't created any posts yet. Share your first thought!"
                    : `${user.name || user.username} hasn't posted anything yet.`
                }
                action={
                  isOwnProfile
                    ? {
                        label: 'Create your first post',
                        onClick: () => {
                          console.log('Navigate to create post')
                        },
                      }
                    : undefined
                }
              />
            )}
          </div>
        )

      case 'likes':
        return (
          <EmptyState
            icon={Heart}
            title="Liked posts"
            description={
              isOwnProfile
                ? "Posts you've liked will appear here"
                : `${user.name || user.username}'s liked posts`
            }
          />
        )

      case 'comments':
        return (
          <EmptyState
            icon={MessageSquare}
            title="Comments"
            description={
              isOwnProfile
                ? "Your comments on posts will appear here"
                : `${user.name || user.username}'s comments`
            }
          />
        )

      case 'activity':
        return <ProfileActivity user={user} />

      case 'bookmarks':
        return isOwnProfile ? (
          <EmptyState
            icon={Bookmark}
            title="Bookmarked posts"
            description="Posts you've bookmarked will appear here"
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Bookmarks are private and only visible to the profile owner.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  // Filter tabs based on profile ownership
  const visibleTabs = tabs.filter(tab => {
    if (tab.id === 'bookmarks' && !isOwnProfile) {
      return false
    }
    return true
  })

  return (
    <div className={cn('space-y-6', className)}>
      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-2">
          <div className="flex flex-wrap gap-1">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 text-sm',
                    isActive && 'shadow-sm'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.id === 'posts' && (
                    <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                      {user._count?.posts || 0}
                    </span>
                  )}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  )
}