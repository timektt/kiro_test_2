'use client'

import { useState } from 'react'
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
  className?: string
}

export function PostItem({
  post,
  currentUserId,
  onLike,
  onComment,
  onShare,
  onBookmark,
  className,
}: PostItemProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)

  const handleLike = () => {
    if (onLike) {
      onLike(post.id)
    }
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleComment = () => {
    if (onComment) {
      onComment(post.id)
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare(post.id)
    }
  }

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(post.id)
    }
    setIsBookmarked(!isBookmarked)
  }

  const isOwnPost = currentUserId === post.authorId

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <UserBadge user={post.author} size="md" showMBTI />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {formatRelativeTime(post.createdAt)}
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
                    <DropdownMenuItem>Edit post</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete post
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>Report post</DropdownMenuItem>
                    <DropdownMenuItem>Hide post</DropdownMenuItem>
                    <DropdownMenuItem>Block user</DropdownMenuItem>
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
                  <span className="text-sm">{post._count?.comments || 0}</span>
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
}