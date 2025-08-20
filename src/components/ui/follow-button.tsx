'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
  userId: string
  username?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showIcon?: boolean
  className?: string
  onFollowChange?: (isFollowing: boolean) => void
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'API Error')
  }
  return result.data
}

export function FollowButton({
  userId,
  username,
  variant = 'default',
  size = 'default',
  showIcon = true,
  className,
  onFollowChange,
}: FollowButtonProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [optimisticFollowing, setOptimisticFollowing] = useState<boolean | null>(null)

  // Fetch follow status
  const { data, error, mutate } = useSWR(
    session && userId !== session.user.id ? `/api/users/${userId}/follow` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  const isFollowing = optimisticFollowing !== null ? optimisticFollowing : data?.isFollowing || false

  // Reset optimistic state when data changes
  useEffect(() => {
    if (data?.isFollowing !== undefined && optimisticFollowing !== null) {
      setOptimisticFollowing(null)
    }
  }, [data?.isFollowing, optimisticFollowing])

  const handleFollow = async () => {
    if (isLoading || !session) return

    setIsLoading(true)
    const newFollowingState = !isFollowing

    // Optimistic update
    setOptimisticFollowing(newFollowingState)
    onFollowChange?.(newFollowingState)

    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: newFollowingState ? 'POST' : 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to update follow status')
      }

      // Revalidate to get fresh data
      mutate()
    } catch (error) {
      console.error('Error updating follow status:', error)
      // Revert optimistic update
      setOptimisticFollowing(!newFollowingState)
      onFollowChange?.(!newFollowingState)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show button for own profile or when not authenticated
  if (!session || userId === session.user.id) {
    return null
  }

  if (error) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={cn('opacity-50', className)}
      >
        Error
      </Button>
    )
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : variant}
      size={size}
      onClick={handleFollow}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200 min-h-[44px] sm:min-h-[auto] group',
        isFollowing && 'hover:bg-destructive hover:text-destructive-foreground hover:border-destructive',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-1 sm:mr-2 animate-spin flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            {isFollowing ? 'Unfollowing...' : 'Following...'}
          </span>
        </>
      ) : (
        <>
          {showIcon && (
            <>
              {isFollowing ? (
                <UserMinus className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
              ) : (
                <UserPlus className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
              )}
            </>
          )}
          <span className="group-hover:hidden text-xs sm:text-sm">
            {isFollowing ? 'Following' : 'Follow'}
          </span>
          {isFollowing && (
            <span className="hidden group-hover:inline text-xs sm:text-sm">
              Unfollow{username ? ` ${username}` : ''}
            </span>
          )}
        </>
      )}
    </Button>
  )
}

export default FollowButton
