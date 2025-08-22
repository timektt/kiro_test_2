'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type PostComposerState = {
  isVisible: boolean
  content: string
  selectedImage: File | null
  imagePreview: string | null
  isSubmitting: boolean
}

export type PostComposerContextType = {
  state: PostComposerState
  showComposer: () => void
  hideComposer: () => void
  setContent: (content: string) => void
  setSelectedImage: (file: File | null) => void
  addEmoji: (emoji: string) => void
  clearImage: () => void
  resetComposer: () => void
  setSubmitting: (submitting: boolean) => void
  focusComposer: () => void
}

export const PostComposerContext = createContext<PostComposerContextType | undefined>(undefined)

const initialState: PostComposerState = {
  isVisible: false,
  content: '',
  selectedImage: null,
  imagePreview: null,
  isSubmitting: false
}

export function PostComposerContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PostComposerState>(initialState)

  const showComposer = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: true }))
  }, [])

  const hideComposer = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false }))
  }, [])

  const setContent = useCallback((content: string) => {
    setState(prev => ({ ...prev, content }))
  }, [])

  const setSelectedImage = useCallback((file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setState(prev => ({
          ...prev,
          selectedImage: file,
          imagePreview: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    } else {
      setState(prev => ({
        ...prev,
        selectedImage: null,
        imagePreview: null
      }))
    }
  }, [])

  const addEmoji = useCallback((emoji: string) => {
    setState(prev => ({
      ...prev,
      content: prev.content + emoji
    }))
  }, [])

  const clearImage = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedImage: null,
      imagePreview: null
    }))
  }, [])

  const resetComposer = useCallback(() => {
    setState(initialState)
  }, [])

  const setSubmitting = useCallback((submitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting: submitting }))
  }, [])

  const focusComposer = useCallback(() => {
    // Focus on the composer textarea
    setTimeout(() => {
      const textarea = document.querySelector('[data-post-composer] textarea')
      if (textarea) {
        (textarea as HTMLTextAreaElement).focus()
      }
    }, 100)
  }, [])

  const contextValue: PostComposerContextType = {
    state,
    showComposer,
    hideComposer,
    setContent,
    setSelectedImage,
    addEmoji,
    clearImage,
    resetComposer,
    setSubmitting,
    focusComposer
  }

  return (
    <PostComposerContext.Provider value={contextValue}>
      {children}
    </PostComposerContext.Provider>
  )
}

export function usePostComposer() {
  const context = useContext(PostComposerContext)
  if (context === undefined) {
    throw new Error('usePostComposer must be used within a PostComposerProvider')
  }
  return context
}

// Removed default export to prevent import misuse
