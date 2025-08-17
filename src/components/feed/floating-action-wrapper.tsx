'use client'

import { FloatingActionButton } from '@/components/ui/floating-action-button'

export function FloatingActionWrapper() {
  const handleCreatePost = () => {
    console.log('Create post from FAB')
    // TODO: Scroll to post composer or open modal
    const postComposer = document.querySelector('[data-post-composer]')
    if (postComposer) {
      postComposer.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Focus on textarea if available
      const textarea = postComposer.querySelector('textarea')
      if (textarea) {
        textarea.focus()
      }
    }
  }

  const handleAddImage = () => {
    console.log('Add image from FAB')
    // TODO: Open image picker
    const imageInput = document.querySelector('input[type="file"][accept*="image"]')
    if (imageInput) {
      (imageInput as HTMLInputElement).click()
    }
  }

  const handleAddEmoji = () => {
    console.log('Add emoji from FAB')
    // TODO: Open emoji picker
    const emojiButton = document.querySelector('[data-emoji-button]')
    if (emojiButton) {
      (emojiButton as HTMLButtonElement).click()
    }
  }

  return (
    <FloatingActionButton
      onCreatePost={handleCreatePost}
      onAddImage={handleAddImage}
      onAddEmoji={handleAddEmoji}
    />
  )
}