'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, UserX, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  name?: string
  image?: string
  bio?: string
}

interface BlockUserDialogProps {
  user: User
  trigger?: React.ReactNode
  onUserBlocked?: (userId: string) => void
}

export default function BlockUserDialog({ 
  user, 
  trigger, 
  onUserBlocked 
}: BlockUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [isBlocking, setIsBlocking] = useState(false)

  const handleBlock = async () => {
    try {
      setIsBlocking(true)
      
      const response = await fetch('/api/privacy/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: user.id,
          reason: reason.trim() || undefined
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to block user')
      }

      toast.success(`Successfully blocked ${user.username}`)
      setIsOpen(false)
      setReason('')
      onUserBlocked?.(user.id)
    } catch (error) {
      console.error('Error blocking user:', error)
      toast.error('Failed to block user')
    } finally {
      setIsBlocking(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setReason('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <UserX className="h-4 w-4 mr-2" />
            Block
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Block User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to block this user?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-4 p-4 border rounded-lg bg-muted/50">
            <Avatar>
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>
                {user.name?.[0] || user.username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">
                  {user.name || user.username}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  @{user.username}
                </Badge>
              </div>
              {user.bio && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-destructive">
                  Blocking this user will:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>&bull; They won't be able to see your profile and posts</li>
                <li>&bull; You won't see their posts and comments</li>
                <li>&bull; They won't be able to message or tag you</li>
                <li>&bull; Mutual follows will be automatically removed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for blocking (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Specify reason for blocking this user..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isBlocking}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleBlock}
            disabled={isBlocking}
          >
            {isBlocking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Blocking...
              </>
            ) : (
              <>
                <UserX className="h-4 w-4 mr-2" />
                Block User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
