/**
 * Memoized components for performance optimization
 * Prevents unnecessary re-renders using React.memo, useMemo, and useCallback
 */

import React, { memo, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { User, Post, Comment, Notification } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'

// Memoized user avatar component
export const MemoizedUserAvatar = memo<{
  user: Pick<User, 'id' | 'name' | 'image' | 'username'>
  size?: number
  className?: string
}>(({ user, size = 40, className }) => {
  const avatarUrl = useMemo(() => {
    return user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.username}`
  }, [user.image, user.name, user.username])

  return (
    <Image
      src={avatarUrl}
      alt={`${user.name || user.username}'s avatar`}
      width={size}
      height={size}
      className={`rounded-full ${className || ''}`}
      loading="lazy"
    />
  )
})

MemoizedUserAvatar.displayName = 'MemoizedUserAvatar'

// Memoized post item component
export const MemoizedPostItem = memo<{
  post: Post & {
    author: Pick<User, 'id' | 'name' | 'username' | 'image'>
    _count: { likes: number; comments: number }
  }
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  isLiked?: boolean
}>(({ post, onLike, onComment, isLiked }) => {
  const timeAgo = useMemo(() => {
    return formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
  }, [post.createdAt])

  const handleLike = useCallback(() => {
    onLike?.(post.id)
  }, [onLike, post.id])

  const handleComment = useCallback(() => {
    onComment?.(post.id)
  }, [onComment, post.id])

  return (
    <article className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-3">
        <MemoizedUserAvatar user={post.author} size={32} />
        <div>
          <h4 className="font-medium">{post.author.name}</h4>
          <p className="text-sm text-muted-foreground">@{post.author.username}</p>
        </div>
        <time className="text-sm text-muted-foreground ml-auto">
          {timeAgo}
        </time>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <p>{post.content}</p>
      </div>
      
      <div className="flex items-center space-x-4 pt-2">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 text-sm ${
            isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
          }`}
        >
          <span>❤️</span>
          <span>{post._count.likes}</span>
        </button>
        
        <button
          onClick={handleComment}
          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-blue-500"
        >
          <span>💬</span>
          <span>{post._count.comments}</span>
        </button>
      </div>
    </article>
  )
})

MemoizedPostItem.displayName = 'MemoizedPostItem'

// Memoized comment component
export const MemoizedComment = memo<{
  comment: Comment & {
    author: Pick<User, 'id' | 'name' | 'username' | 'image'>
  }
}>(({ comment }) => {
  const timeAgo = useMemo(() => {
    return formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
  }, [comment.createdAt])

  return (
    <div className="flex space-x-3 p-3 border-l-2 border-muted">
      <MemoizedUserAvatar user={comment.author} size={24} />
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">{comment.author.name}</span>
          <time className="text-xs text-muted-foreground">{timeAgo}</time>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  )
})

MemoizedComment.displayName = 'MemoizedComment'

// Memoized notification item
export const MemoizedNotificationItem = memo<{
  notification: Notification
  onMarkAsRead?: (id: string) => void
}>(({ notification, onMarkAsRead }) => {
  const timeAgo = useMemo(() => {
    return formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
  }, [notification.createdAt])

  const handleMarkAsRead = useCallback(() => {
    if (!notification.read) {
      onMarkAsRead?.(notification.id)
    }
  }, [notification.id, notification.read, onMarkAsRead])

  const notificationIcon = useMemo(() => {
    switch (notification.type) {
      case 'LIKE':
        return '❤️'
      case 'COMMENT':
        return '💬'
      case 'FOLLOW':
        return '👤'
      case 'MENTION':
        return '@'
      case 'SYSTEM':
        return '🔔'
      default:
        return '📢'
    }
  }, [notification.type])

  return (
    <div
      className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
        !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg">{notificationIcon}</span>
        <div className="flex-1 space-y-1">
          <p className="text-sm">{notification.message}</p>
          <time className="text-xs text-muted-foreground">{timeAgo}</time>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </div>
    </div>
  )
})

MemoizedNotificationItem.displayName = 'MemoizedNotificationItem'

// Memoized user list item
export const MemoizedUserListItem = memo<{
  user: Pick<User, 'id' | 'name' | 'username' | 'image' | 'bio'>
  onFollow?: (userId: string) => void
  isFollowing?: boolean
  showFollowButton?: boolean
}>(({ user, onFollow, isFollowing, showFollowButton = true }) => {
  const handleFollow = useCallback(() => {
    onFollow?.(user.id)
  }, [onFollow, user.id])

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center space-x-3">
        <MemoizedUserAvatar user={user} size={40} />
        <div>
          <h4 className="font-medium">{user.name}</h4>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {user.bio}
            </p>
          )}
        </div>
      </div>
      
      {showFollowButton && (
        <button
          onClick={handleFollow}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isFollowing
              ? 'bg-muted text-muted-foreground hover:bg-muted/80'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  )
})

MemoizedUserListItem.displayName = 'MemoizedUserListItem'

// Memoized stats component
export const MemoizedStats = memo<{
  stats: {
    posts: number
    followers: number
    following: number
  }
}>(({ stats }) => {
  const formattedStats = useMemo(() => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
      }
      return num.toString()
    }

    return {
      posts: formatNumber(stats.posts),
      followers: formatNumber(stats.followers),
      following: formatNumber(stats.following),
    }
  }, [stats])

  return (
    <div className="flex space-x-6">
      <div className="text-center">
        <div className="font-bold text-lg">{formattedStats.posts}</div>
        <div className="text-sm text-muted-foreground">Posts</div>
      </div>
      <div className="text-center">
        <div className="font-bold text-lg">{formattedStats.followers}</div>
        <div className="text-sm text-muted-foreground">Followers</div>
      </div>
      <div className="text-center">
        <div className="font-bold text-lg">{formattedStats.following}</div>
        <div className="text-sm text-muted-foreground">Following</div>
      </div>
    </div>
  )
})

MemoizedStats.displayName = 'MemoizedStats'

// Higher-order component for memoization
export function withMemoization<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = memo(Component, areEqual)
  MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`
  return MemoizedComponent
}

// Custom hook for memoized callbacks
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps)
}

// Custom hook for memoized values
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps)
}
