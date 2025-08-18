'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Users, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import logger from '@/lib/logger'

interface User {
  id: string
  username: string
  name: string
  image?: string
  mbti?: {
    type: string
  }
}

interface NewChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateChat: (participantIds: string[], type: 'DIRECT' | 'GROUP', name?: string) => Promise<void>
}

export function NewChatModal({ open, onOpenChange, onCreateChat }: NewChatModalProps) {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [groupName, setGroupName] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [activeTab, setActiveTab] = useState('direct')

  // Search users
  useEffect(() => {
    if (!open || !searchQuery.trim()) {
      setUsers([])
      return
    }

    const searchUsers = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}&limit=20`)
        if (response.ok) {
          const data = await response.json()
          // Filter out current user
          const filteredUsers = data.users?.filter((user: User) => user.id !== session?.user?.id) || []
          setUsers(filteredUsers)
        }
      } catch (error) {
        logger.error('Failed to search users:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, open, session?.user?.id])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      setUsers([])
      setSelectedUsers([])
      setGroupName('')
      setActiveTab('direct')
    }
  }, [open])

  const handleUserSelect = (user: User) => {
    if (activeTab === 'direct') {
      // For direct chat, immediately create chat
      handleCreateChat([user.id], 'DIRECT')
    } else {
      // For group chat, add to selection
      setSelectedUsers(prev => {
        const isSelected = prev.some(u => u.id === user.id)
        if (isSelected) {
          return prev.filter(u => u.id !== user.id)
        } else {
          return [...prev, user]
        }
      })
    }
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId))
  }

  const handleCreateChat = async (participantIds: string[], type: 'DIRECT' | 'GROUP', name?: string) => {
    if (creating) return

    setCreating(true)
    try {
      await onCreateChat(participantIds, type, name)
      onOpenChange(false)
    } catch (error) {
      logger.error('Failed to create chat:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleCreateGroup = () => {
    if (selectedUsers.length === 0) return
    
    const participantIds = selectedUsers.map(u => u.id)
    const finalGroupName = groupName.trim() || `กลุ่ม ${selectedUsers.length + 1} คน`
    
    handleCreateChat(participantIds, 'GROUP', finalGroupName)
  }

  const canCreateGroup = selectedUsers.length > 0 && !creating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>สร้างแชทใหม่</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              แชทส่วนตัว
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              กลุ่ม
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาผู้ใช้..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <TabsContent value="direct" className="mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  เลือกผู้ใช้เพื่อเริ่มแชทส่วนตัว
                </p>
                
                <ScrollArea className="h-64">
                  {loading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : users.length > 0 ? (
                    <div className="space-y-1">
                      {users.map((user) => (
                        <Button
                          key={user.id}
                          variant="ghost"
                          onClick={() => handleUserSelect(user)}
                          disabled={creating}
                          className="w-full justify-start h-auto p-3"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.image || undefined} />
                              <AvatarFallback>
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left">
                              <p className="font-medium">{user.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">@{user.username}</p>
                                {user.mbti && (
                                  <Badge variant="secondary" className="text-xs">
                                    {user.mbti.type}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="h-8 w-8 mx-auto mb-2" />
                      <p>ไม่พบผู้ใช้</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2" />
                      <p>ค้นหาผู้ใช้เพื่อเริ่มแชท</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="group" className="mt-4">
              <div className="space-y-4">
                {/* Group Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="groupName">ชื่อกลุ่ม (ไม่บังคับ)</Label>
                   <Input
                     id="groupName"
                     placeholder="ใส่ชื่อกลุ่ม..."
                     value={groupName}
                     onChange={(e) => setGroupName(e.target.value)}
                   />
                </div>

                {/* Selected Users */}
                {selectedUsers.length > 0 && (
                  <div className="space-y-2">
                    <Label>สมาชิกที่เลือก ({selectedUsers.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                          {user.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUser(user.id)}
                            className="h-4 w-4 p-0 hover:bg-transparent"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* User List */}
                <div className="space-y-2">
                  <Label>เลือกสมาชิก</Label>
                  <ScrollArea className="h-48">
                    {loading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3 p-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="flex-1 space-y-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : users.length > 0 ? (
                      <div className="space-y-1">
                        {users.map((user) => {
                          const isSelected = selectedUsers.some(u => u.id === user.id)
                          return (
                            <div
                              key={user.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                              onClick={() => handleUserSelect(user)}
                            >
                              <Checkbox checked={isSelected} readOnly />
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.image || undefined} />
                                <AvatarFallback className="text-xs">
                                  {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{user.name}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                                  {user.mbti && (
                                    <Badge variant="secondary" className="text-xs">
                                      {user.mbti.type}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : searchQuery ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2" />
                        <p>ไม่พบผู้ใช้</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="h-8 w-8 mx-auto mb-2" />
                        <p>ค้นหาผู้ใช้เพื่อเพิ่มในกลุ่ม</p>
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Create Group Button */}
                <Button
                  onClick={handleCreateGroup}
                  disabled={!canCreateGroup}
                  className="w-full"
                >
                  {creating ? 'กำลังสร้าง...' : `สร้างกลุ่ม (${selectedUsers.length} คน)`}
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}