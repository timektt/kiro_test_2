'use client'

import { useState } from 'react'
import { Send, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CommentBoxProps {
  postId: string
  currentUser?: {
    id: string
    name: string | null
    username: string
    image: string | null
  }
  onSubmit?: (postId: string, content: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CommentBox({
  postId,
  currentUser,
  onSubmit,
  placeholder = "Write a comment...",
  className,
  disabled = false,
}: CommentBoxProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || isSubmitting || disabled) return

    setIsSubmitting(true)
    
    try {
      if (onSubmit) {
        await onSubmit(postId, content.trim())
      }
      setContent('')
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!currentUser) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <p>Please sign in to comment</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex items-start gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={currentUser.image || undefined} alt={currentUser.name || 'User'} />
            <AvatarFallback className="text-xs">
              {currentUser.name ? getInitials(currentUser.name) : currentUser.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="relative">
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled || isSubmitting}
                className="pr-20 resize-none"
                maxLength={1000}
              />
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  disabled={disabled || isSubmitting}
                >
                  <Smile className="h-4 w-4" />
                </Button>
                
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-6 w-6 p-0 text-muted-foreground',
                    content.trim() && 'text-primary hover:text-primary/80'
                  )}
                  disabled={!content.trim() || disabled || isSubmitting}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>{content.length}/1000</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
