'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, UserX, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

interface BlockedUser {
  id: string
  reason?: string
  blockedAt: string
  user: {
    id: string
    username: string
    name?: string
    image?: string
    bio?: string
  }
}

interface BlockedUsersListProps {
  onUserUnblocked?: (userId: string) => void
}

export default function BlockedUsersList({ onUserUnblocked }: BlockedUsersListProps) {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unblockingUsers, setUnblockingUsers] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadBlockedUsers()
  }, [])

  const loadBlockedUsers = async (pageNum = 1) => {
    try {
      setIsLoading(pageNum === 1)
      const response = await fetch(`/api/privacy/blocked-users?page=${pageNum}&limit=20`)
      
      if (!response.ok) {
        throw new Error('Failed to load blocked users')
      }

      const data = await response.json()
      
      if (pageNum === 1) {
        setBlockedUsers(data.blockedUsers)
      } else {
        setBlockedUsers(prev => [...prev, ...data.blockedUsers])
      }
      
      setTotal(data.pagination.total)
      setHasMore(data.pagination.hasNextPage)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading blocked users:', error)
      toast.error('เกิดข้อผิดพลาดในการโหลดรายการผู้ใช้ที่ถูกบล็อก')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblockUser = async (userId: string, username: string) => {
    try {
      setUnblockingUsers(prev => new Set(prev).add(userId))
      
      const response = await fetch('/api/privacy/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to unblock user')
      }

      // Remove user from blocked list
      setBlockedUsers(prev => prev.filter(blocked => blocked.user.id !== userId))
      setTotal(prev => prev - 1)
      
      toast.success(`ยกเลิกการบล็อก ${username} เรียบร้อยแล้ว`)
      onUserUnblocked?.(userId)
    } catch (error) {
      console.error('Error unblocking user:', error)
      toast.error('เกิดข้อผิดพลาดในการยกเลิกการบล็อก')
    } finally {
      setUnblockingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadBlockedUsers(page + 1)
    }
  }

  if (isLoading && blockedUsers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            ผู้ใช้ที่ถูกบล็อก
          </CardTitle>
          <CardDescription>
            จัดการรายการผู้ใช้ที่คุณได้บล็อกไว้
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">กำลังโหลด...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserX className="h-5 w-5" />
          ผู้ใช้ที่ถูกบล็อก
        </CardTitle>
        <CardDescription>
          จัดการรายการผู้ใช้ที่คุณได้บล็อกไว้ ({total} คน)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {blockedUsers.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">คุณยังไม่ได้บล็อกผู้ใช้คนใด</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blockedUsers.map((blocked) => (
              <div
                key={blocked.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={blocked.user.image || undefined} />
                    <AvatarFallback>
                      {blocked.user.name?.[0] || blocked.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {blocked.user.name || blocked.user.username}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        @{blocked.user.username}
                      </Badge>
                    </div>
                    {blocked.user.bio && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {blocked.user.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        บล็อกเมื่อ {formatDistanceToNow(new Date(blocked.blockedAt), { 
                          addSuffix: true, 
                          locale: th 
                        })}
                      </span>
                      {blocked.reason && (
                        <span className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          เหตุผล: {blocked.reason}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblockUser(blocked.user.id, blocked.user.username)}
                  disabled={unblockingUsers.has(blocked.user.id)}
                >
                  {unblockingUsers.has(blocked.user.id) ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      กำลังยกเลิก...
                    </>
                  ) : (
                    'ยกเลิกการบล็อก'
                  )}
                </Button>
              </div>
            ))}
            
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      กำลังโหลด...
                    </>
                  ) : (
                    'โหลดเพิ่มเติม'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}