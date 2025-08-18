'use client'

import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { useFabActions } from '@/hooks/use-fab-actions'
import { usePostComposer } from '@/contexts/post-composer-context'

export function FloatingActionWrapper() {
  const { setSelectedImage, addEmoji, focusComposer, showComposer } = usePostComposer()
  
  const { handleCreatePost, handleAddImage, handleAddEmoji } = useFabActions({
    onPostComposerFocus: () => {
      showComposer()
      focusComposer()
    },
    onImageSelect: (file: File) => {
      setSelectedImage(file)
      showComposer()
      focusComposer()
    },
    onEmojiSelect: (emoji: string) => {
      addEmoji(emoji)
      showComposer()
      focusComposer()
    }
  })

  return (
    <FloatingActionButton
      onCreatePost={handleCreatePost}
      onAddImage={handleAddImage}
      onAddEmoji={handleAddEmoji}
    />
  )
}