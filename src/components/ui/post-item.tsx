'use client'

import { useState, memo, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserBadge } from '@/components/ui/user-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatRelativeTime, cn } from '@/lib/utils'
import { useLikePost, useBookmarkPost, useSharePost } from '@/hooks/use-posts'
import type { Post } from '@/types'

interface PostItemProps {
  post: Post & {
    author: {
      id: string
      username: string
      name: string | null
      image: string | null
      role: 'USER' | 'ADMIN' | 'MODERATOR'
      mbti?: { type: string } | null
    }
    _count?: {
      likes: number
      comments: number
    }
  }
  currentUserId?: string
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onBookmark?: (postId: string) => void
  onEdit?: (postId: string) => void
  onDelete?: (postId: string) => void
  onReport?: (postId: string) => void
  onHide?: (postId: string) => void
  onBlock?: (userId: string) => void
  className?: string
}

export const PostItem = memo<PostItemProps>(function PostItem({
  post,
  currentUserId,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onEdit,
  onDelete,
  onReport,
  onHide,
  onBlock,
  className,
}) {
  // Initialize hooks
  const { toggleLike, isToggling: isLikeToggling } = useLikePost()
  const { toggleBookmark, isToggling: isBookmarkToggling } = useBookmarkPost()
  const { sharePost, isSharing } = useSharePost()

  // Local state for optimistic updates
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)

  const handleLike = useCallback(async () => {
    try {
      // Use the hook instead of prop callback
      await toggleLike(post.id)
      // Optimistic update is handled by the hook
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }, [toggleLike, post.id])

  const handleComment = useCallback(() => {
    // Navigate to post detail page for comments
    window.location.href = `/post/${post.id}`
  }, [post.id])

  const handleShare = useCallback(async (platform?: string) => {
    try {
      if (platform === 'copy') {
        // Copy link to clipboard
        const shareUrl = `${window.location.origin}/post/${post.id}`
        await navigator.clipboard.writeText(shareUrl)
      } else {
        // Use the share hook
        await sharePost({ postId: post.id, platform })
      }
    } catch (error) {
      console.error('Failed to share post:', error)
    }
  }, [sharePost, post.id])

  const handleBookmark = useCallback(async () => {
    try {
      await toggleBookmark(post.id)
      // Optimistic update is handled by the hook
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }, [toggleBookmark, post.id])

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(post.id)
    }
  }, [onEdit, post.id])

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(post.id)
    }
  }, [onDelete, post.id])

  const handleReport = useCallback(() => {
    if (onReport) {
      onReport(post.id)
    }
  }, [onReport, post.id])

  const handleHide = useCallback(() => {
    if (onHide) {
      onHide(post.id)
    }
  }, [onHide, post.id])

  const handleBlock = useCallback(() => {
    if (onBlock) {
      onBlock(post.author.id)
    }
  }, [onBlock, post.author.id])

  const formattedTime = useMemo(() => 
    formatRelativeTime(post.createdAt), 
    [post.createdAt]
  )

  const commentCount = useMemo(() => 
    post._count?.comments || 0, 
    [post._count?.comments]
  )

  const isOwnPost = currentUserId === post.authorId

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <UserBadge user={post.author} size="sm" showMBTI />
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {formattedTime}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 min-h-[44px] sm:min-h-[32px]">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwnPost ? (
                  <>
                    <DropdownMenuItem onClick={handleEdit}>
                      Edit post
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-destructive"
                    >
                      Delete post
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleReport}>
                      Report post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleHide}>
                      Hide post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBlock}>
                      Block user
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* Post Content */}
        <div className="space-y-3">
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Post Image */}
          {post.imageUrl && (
            <div className="relative rounded-lg overflow-hidden border">
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority={false}
              />
            </div>
          )}

          {/* Engagement Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLikeToggling}
                className={cn(
                  'flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-red-500 min-h-[44px] sm:min-h-[auto] px-2 sm:px-3',
                  isLiked && 'text-red-500'
                )}
              >
                <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
                <span className="text-xs sm:text-sm">{likeCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-blue-500 min-h-[44px] sm:min-h-[auto] px-2 sm:px-3"
                asChild
              >
                <Link href={`/post/${post.id}`}>
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">{commentCount}</span>
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isSharing}
                    className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-green-500 min-h-[44px] sm:min-h-[auto] px-2 sm:px-3"
                  >
                    <Share className="h-4 w-4" />
                    <span className="text-xs sm:text-sm hidden sm:inline">Share</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleShare('copy')}>
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('facebook')}>
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('twitter')}>
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                    Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                    Share on WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              disabled={isBookmarkToggling}
              aria-label="Bookmark post"
              className={cn(
                'text-muted-foreground hover:text-yellow-500 min-h-[44px] sm:min-h-[auto] px-2 sm:px-3',
                isBookmarked && 'text-yellow-500'
              )}
            >
              <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

PostItem.displayName = 'PostItem'

export default PostItem