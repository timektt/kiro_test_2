'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UseFabActionsProps {
  onPostComposerFocus?: () => void
  onImageSelect?: (file: File) => void
  onEmojiSelect?: (emoji: string) => void
}

export function useFabActions({
  onPostComposerFocus,
  onImageSelect,
  onEmojiSelect
}: UseFabActionsProps = {}) {
  const router = useRouter()

  const scrollToPostComposer = useCallback(() => {
    // Try to find post composer by data attribute
    const postComposer = document.querySelector('[data-post-composer]')
    if (postComposer) {
      postComposer.scrollIntoView({ behavior: 'smooth', block: 'center' })
      
      // Focus on textarea if available
      setTimeout(() => {
        const textarea = postComposer.querySelector('textarea')
        if (textarea) {
          textarea.focus()
        }
      }, 300) // Small delay to ensure smooth scroll completes
      
      onPostComposerFocus?.()
      return true
    }
    return false
  }, [onPostComposerFocus])

  const handleCreatePost = useCallback(() => {
    console.log('Create post from FAB')
    
    // Try to scroll to existing post composer first
    const scrolled = scrollToPostComposer()
    
    if (!scrolled) {
      // If no post composer found, navigate to feed page
      router.push('/feed')
      toast.info('Navigating to create post...')
    }
  }, [router, scrollToPostComposer])

  const handleAddImage = useCallback(() => {
    console.log('Add image from FAB')
    
    // Create a file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = false
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size must be less than 5MB')
          return
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file')
          return
        }
        
        onImageSelect?.(file)
        toast.success('Image selected successfully')
      }
    }
    
    // Trigger file picker
    input.click()
  }, [onImageSelect])

  const handleAddEmoji = useCallback(() => {
    console.log('Add emoji from FAB')
    
    // For now, show a simple emoji picker or navigate to post composer
    const scrolled = scrollToPostComposer()
    
    if (scrolled) {
      // Try to trigger emoji picker if available
      setTimeout(() => {
        const emojiButton = document.querySelector('[data-emoji-button]')
        if (emojiButton) {
          (emojiButton as HTMLButtonElement).click()
        } else {
          // Fallback: insert a random emoji
          const reactions = [':)', ':thumbsup:', ':heart:', ':party:', ':fire:', ':100:', ':sparkles:', ':rocket:']
          const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]
          onEmojiSelect?.(randomReaction)
          toast.success(`Added ${randomReaction}`)
        }
      }, 300)
    } else {
      // Navigate to feed if no post composer found
      router.push('/feed')
      toast.info('Navigating to add emoji...')
    }
  }, [router, scrollToPostComposer, onEmojiSelect])

  return {
    handleCreatePost,
    handleAddImage,
    handleAddEmoji,
    scrollToPostComposer
  }
}

export default useFabActions
