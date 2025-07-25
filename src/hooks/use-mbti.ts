import useSWR from 'swr'
import { MBTI, MBTIType, ApiResponse } from '@/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useMBTI(userId: string | null) {
  const { data, error, mutate, isLoading } = useSWR<ApiResponse<MBTI>>(
    userId ? `/api/users/${userId}/mbti` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const setMBTI = async (type: MBTIType, description?: string) => {
    if (!userId) throw new Error('User ID is required')

    const response = await fetch(`/api/users/${userId}/mbti`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, description })
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to set MBTI')
    }

    // Update the cache
    mutate(result, false)
    return result.data
  }

  const updateMBTI = async (updates: { description?: string; isLocked?: boolean }) => {
    if (!userId) throw new Error('User ID is required')

    const response = await fetch(`/api/users/${userId}/mbti`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to update MBTI')
    }

    // Update the cache
    mutate(result, false)
    return result.data
  }

  const removeMBTI = async () => {
    if (!userId) throw new Error('User ID is required')

    const response = await fetch(`/api/users/${userId}/mbti`, {
      method: 'DELETE'
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to remove MBTI')
    }

    // Update the cache to reflect removal
    mutate(undefined, false)
    return true
  }

  return {
    mbti: data?.success ? data.data : null,
    isLoading,
    error: error || (!data?.success ? data?.error : null),
    setMBTI,
    updateMBTI,
    removeMBTI,
    refresh: mutate
  }
}

export function useMBTIStats() {
  const { data, error, isLoading } = useSWR<ApiResponse<{
    totalUsers: number
    typeDistribution: Record<MBTIType, number>
    categoryDistribution: Record<string, number>
    recentAssignments: Array<{
      userId: string
      type: MBTIType
      assignedAt: string
      user: {
        username: string
        name: string | null
        image: string | null
      }
    }>
  }>>(
    '/api/admin/mbti/stats',
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000 // Refresh every 30 seconds
    }
  )

  return {
    stats: data?.success ? data.data : null,
    isLoading,
    error: error || (!data?.success ? data?.error : null)
  }
}
