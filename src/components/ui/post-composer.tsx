'use client'

import { useState, memo, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { ImageIcon, Smile, X, Globe, Users, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface PostComposerProps {
  currentUser?: {
    id: string
    name: string | null
    username: string
    image: string | null
  }
  onSubmit?: (content: string, imageUrl?: string, visibility?: 'public' | 'followers' | 'private') => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const PostComposer = memo<PostComposerProps>(({
  currentUser,
  onSubmit,
  placeholder = "What's on your mind?",
  className,
  disabled = false,
}) => {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || isSubmitting || disabled) return

    setIsSubmitting(true)
    
    try {
      if (onSubmit) {
        await onSubmit(content.trim(), imageUrl || undefined, visibility)
      }
      setContent('')
      setImageUrl('')
      setShowImageInput(false)
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [content, isSubmitting, disabled, onSubmit, imageUrl, visibility])

  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [])

  const visibilityIcons = useMemo(() => ({
    public: Globe,
    followers: Users,
    private: Lock,
  }), [])

  const VisibilityIcon = visibilityIcons[visibility]

  const canSubmit = useMemo(() => 
    content.trim().length > 0 && !isSubmitting && !disabled,
    [content, isSubmitting, disabled]
  )

  const handleImageToggle = useCallback(() => {
    setShowImageInput(prev => !prev)
  }, [])

  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }, [])

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }, [])

  const handleVisibilityChange = useCallback((value: 'public' | 'followers' | 'private') => {
    setVisibility(value)
  }, [])

  if (!currentUser) {
    return null
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.image || undefined} alt={currentUser.name || 'User'} />
            <AvatarFallback className="text-sm">
              {currentUser.name ? getInitials(currentUser.name) : currentUser.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">{currentUser.name || currentUser.username}</p>
            <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
              <SelectTrigger 
                className="w-auto h-auto p-0 border-none shadow-none text-xs text-muted-foreground"
                aria-label="Select post visibility"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="followers">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>Followers</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    <span>Private</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            className="min-h-[100px] resize-none border-none p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
            maxLength={2000}
          />

          {/* Image Input */}
          {showImageInput && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL..."
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowImageInput(false)
                    setImageUrl('')
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {imageUrl && (
                <div className="relative">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    width={500}
                    height={256}
                    className="w-full max-h-64 object-cover rounded-lg"
                    onError={() => setImageUrl('')}
                  />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowImageInput(!showImageInput)}
                disabled={disabled || isSubmitting}
                className="text-muted-foreground hover:text-foreground"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled || isSubmitting}
                className="text-muted-foreground hover:text-foreground"
              >
                <Smile className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                <VisibilityIcon className="h-3 w-3" />
                <span className="capitalize">{visibility}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {content.length}/2000
              </span>
              
              <Button
                type="submit"
                disabled={!content.trim() || disabled || isSubmitting}
                className="px-6"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
})

PostComposer.displayName = 'PostComposer'