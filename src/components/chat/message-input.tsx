'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Send, Paperclip, Image, File, Smile } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'TEXT' | 'IMAGE' | 'FILE') => Promise<void>
  onTypingStart: () => void
  onTypingStop: () => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = 'Type a message...'
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [message])

  // Handle typing indicators
  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true)
      onTypingStart()
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing
    if (message.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        onTypingStop()
      }, 1000)
    } else if (isTyping) {
      setIsTyping(false)
      onTypingStop()
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [message, isTyping, onTypingStart, onTypingStop])

  const handleSend = async () => {
    const content = message.trim()
    if (!content || isSending || disabled) return

    setIsSending(true)
    try {
      await onSendMessage(content)
      setMessage('')
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false)
        onTypingStop()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (type: 'IMAGE' | 'FILE') => {
    const input = type === 'IMAGE' ? imageInputRef.current : fileInputRef.current
    input?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'IMAGE' | 'FILE') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Here you would typically upload the file to your storage service
    // and get back a URL. For now, we'll just use the file name.
    try {
      setIsSending(true)
      
      // Simulate file upload
      const fileName = file.name
      await onSendMessage(fileName, type)
      
      // Reset file input
      e.target.value = ''
    } catch (error) {
      console.error('Failed to upload file:', error)
    } finally {
      setIsSending(false)
    }
  }

  const canSend = message.trim().length > 0 && !isSending && !disabled

  return (
    <div className="p-4">
      <div className="flex items-end gap-2">
        {/* Attachment Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled || isSending}
              className="h-10 w-10 p-0 flex-shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuItem onClick={() => handleFileUpload('IMAGE')}>
              <Image className="h-4 w-4 mr-2" />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileUpload('FILE')}>
              <File className="h-4 w-4 mr-2" />
              File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className={cn(
              'min-h-[40px] max-h-[120px] resize-none pr-12',
              'focus-visible:ring-1 focus-visible:ring-ring'
            )}
            rows={1}
          />
          
          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled || isSending}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="sm"
          className="h-10 w-10 p-0 flex-shrink-0"
        >
          <Send className={cn(
            'h-4 w-4 transition-transform',
            isSending && 'animate-pulse'
          )} />
        </Button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'IMAGE')}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFileChange(e, 'FILE')}
        className="hidden"
      />
    </div>
  )
}
