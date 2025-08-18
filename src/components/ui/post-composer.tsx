'use client'

import { useState, memo, useCallback, useMemo, useEffect } from 'react'
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
import { usePostComposer } from '@/contexts/post-composer-context'
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

export const PostComposer = memo<PostComposerProps>({
  currentUser,
  onSubmit,
  placeholder = "What's on your mind?",
  className,
  disabled = false,
}) => {
  const {
    state,
    setContent,
    setSelectedImage,
    addEmoji,
    clearImage,
    resetComposer,
    setSubmitting
  } = usePostComposer()
  
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public')
  const [showImageInput, setShowImageInput] = useState(false)

  // Sync local content with context state
  useEffect(() => {
    if (state.selectedImage && !showImageInput) {
      setShowImageInput(true)
    }
  }, [state.selectedImage, showImageInput])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!state.content.trim() || state.isSubmitting || disabled) return

    setSubmitting(true)
    
    try {
      let imageUrl: string | undefined
      
      // Upload image if selected
      if (state.selectedImage) {
        const formData = new FormData()
        formData.append('file', state.selectedImage)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json()
          imageUrl = url
        }
      }
      
      await onSubmit?.(state.content, imageUrl, visibility)
      resetComposer()
      setVisibility('public')
      setShowImageInput(false)
    } catch (error) {
      console.error('Error submitting post:', error)
    } finally {
      setSubmitting(false)
    }
  }, [state.content, state.selectedImage, state.isSubmitting, disabled, visibility, onSubmit, setSubmitting, resetComposer])

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      setSelectedImage(file)
    }
  }, [setSelectedImage])

  const canSubmit = useMemo(() => {
    return state.content.trim().length > 0 && !state.isSubmitting && !disabled
  }, [state.content, state.isSubmitting, disabled])

  const VisibilityIcon = useMemo(() => {
    switch (visibility) {
      case 'public': return Globe
      case 'followers': return Users
      case 'private': return Lock
      default: return Globe
    }
  }, [visibility])

  return (
    <Card className={cn('w-full', className)} data-post-composer>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={currentUser?.image || undefined} 
              alt={currentUser?.name || currentUser?.username || 'User'} 
            />
            <AvatarFallback className="text-sm">
              {(currentUser?.name || currentUser?.username || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">
              {currentUser?.name || currentUser?.username || 'Anonymous'}
            </p>
            <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
              <SelectTrigger className="w-auto h-6 text-xs border-none p-0 focus:ring-0">
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
          {/* Text Content */}
          <Textarea
            value={state.content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || state.isSubmitting}
            className={cn(
              'min-h-[100px] resize-none border-none p-0 text-base',
              'placeholder:text-muted-foreground',
              'focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
            rows={3}
          />

          {/* Image Input */}
          {showImageInput && (
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={disabled || state.isSubmitting}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              
              {/* Image Preview */}
              {state.imagePreview && (
                <div className="relative inline-block">
                  <Image
                    src={state.imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="w-full max-h-48 sm:max-h-64 object-cover rounded-lg"
                    onError={() => clearImage()}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={clearImage}
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowImageInput(!showImageInput)}
                disabled={disabled || state.isSubmitting}
                className="text-muted-foreground hover:text-foreground p-2 h-8 w-8 sm:h-9 sm:w-9"
                title="Add image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled || state.isSubmitting}
                className="text-muted-foreground hover:text-foreground p-2 h-8 w-8 sm:h-9 sm:w-9"
                title="Add emoji"
                data-emoji-button
                onClick={() => {
                  // Simple emoji picker - add a random emoji
                  const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '💯', '✨', '🚀']
                  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
                  addEmoji(randomEmoji)
                }}
              >
                <Smile className="h-4 w-4" />
              </Button>

              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground ml-2">
                <VisibilityIcon className="h-3 w-3" />
                <span className="capitalize">{visibility}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={cn(
                'text-xs',
                state.content.length > 280 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {state.content.length}/500
              </span>
              
              <Button
                type="submit"
                disabled={!canSubmit}
                size="sm"
                className="px-6"
              >
                {state.isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
})

PostComposer.displayName = 'PostComposer'

export default PostComposer