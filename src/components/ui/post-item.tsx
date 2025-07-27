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

export const PostItem = memo<PostItemProps>(({
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
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)

  const handleLike = useCallback(() => {
    if (onLike) {
      onLike(post.id)
    }
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }, [onLike, post.id, isLiked])

  const handleComment = useCallback(() => {
    if (onComment) {
      onComment(post.id)
    }
  }, [onComment, post.id])

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(post.id)
    }
  }, [onShare, post.id])

  const handleBookmark = useCallback(() => {
    if (onBookmark) {
      onBookmark(post.id)
    }
    setIsBookmarked(!isBookmarked)
  }, [onBookmark, post.id, isBookmarked])

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
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <UserBadge user={post.author} size="md" showMBTI />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {formattedTime}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

      <CardContent className="pt-0">
        {/* Post Content */}
        <div className="space-y-3">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  'flex items-center gap-2 text-muted-foreground hover:text-red-500',
                  isLiked && 'text-red-500'
                )}
              >
                <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
                <span className="text-sm">{likeCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="flex items-center gap-2 text-muted-foreground hover:text-blue-500"
                asChild
              >
                <Link href={`/post/${post.id}`}>
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{commentCount}</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 text-muted-foreground hover:text-green-500"
              >
                <Share className="h-4 w-4" />
                <span className="text-sm">Share</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              aria-label="Bookmark post"
              className={cn(
                'text-muted-foreground hover:text-yellow-500',
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