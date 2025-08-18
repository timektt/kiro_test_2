'use client'

import { useState } from 'react'
import { useChat } from '@/hooks/use-chat'
import { useSocket } from '@/hooks/use-socket'
import { ChatSidebar } from './chat-sidebar'
import { ChatWindow } from './chat-window'
import { ChatHeader } from './chat-header'
import { NewChatModal } from './new-chat-modal'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatContainerProps {
  className?: string
}

export function ChatContainer({ className }: ChatContainerProps) {
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isConnected, onlineUsers } = useSocket()
  const {
    chats,
    currentChat,
    messages,
    loading,
    error,
    hasMoreMessages,
    hasMoreChats,
    loadMoreChats,
    loadMoreMessages,
    sendMessage,
    createChat,
    setCurrentChat,
    markMessagesAsRead
  } = useChat()

  const handleCreateChat = async (participantIds: string[], type: 'DIRECT' | 'GROUP', name?: string) => {
    const newChat = await createChat(participantIds, type, name)
    if (newChat) {
      setCurrentChat(newChat)
      setShowNewChatModal(false)
    }
  }

  return (
    <div className={cn('flex h-full bg-background', className)}>
      {/* Sidebar */}
      <div className={cn(
        'flex flex-col border-r transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-80'
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!sidebarCollapsed && (
            <>
              <h2 className="text-lg font-semibold">แชท</h2>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNewChatModal(true)}
                  className="h-8 w-8 p-0"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 p-0"
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>

        {/* Connection Status */}
        {!sidebarCollapsed && (
          <div className="px-4 py-2 border-b">
            <div className="flex items-center gap-2 text-sm">
              <div className={cn(
                'w-2 h-2 rounded-full',
                isConnected ? 'bg-green-500' : 'bg-red-500'
              )} />
              <span className="text-muted-foreground">
                {isConnected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}
              </span>
              {isConnected && onlineUsers.size > 0 && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {onlineUsers.size} คนออนไลน์
                </span>
              )}
            </div>
          </div>
        )}

        {/* Chat List */}
        <ChatSidebar
          chats={chats}
          currentChat={currentChat}
          onChatSelect={setCurrentChat}
          onLoadMore={loadMoreChats}
          hasMore={hasMoreChats}
          loading={loading}
          collapsed={sidebarCollapsed}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <ChatHeader
              chat={currentChat}
              onlineUsers={onlineUsers}
              isConnected={isConnected}
            />
            <ChatWindow
              chat={currentChat}
              messages={messages}
              onSendMessage={sendMessage}
              onLoadMore={loadMoreMessages}
              onMarkAsRead={markMessagesAsRead}
              hasMore={hasMoreMessages}
              loading={loading}
              error={error}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquarePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">เลือกแชทเพื่อเริ่มสนทนา</h3>
                <p className="text-muted-foreground mb-4">
                 เลือกแชทจากรายการด้านซ้าย หรือสร้างแชทใหม่
                </p>
                <Button onClick={() => setShowNewChatModal(true)}>
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                 สร้างแชทใหม่
                </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        open={showNewChatModal}
        onOpenChange={setShowNewChatModal}
        onCreateChat={handleCreateChat}
      />
    </div>
  )
}