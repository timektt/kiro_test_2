import useSWR from 'swr'
import { Ranking, RankingType, ApiResponse } from '@/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface RankingsData {
  rankings: Record<string, Record<string, Ranking[]>>
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export function useRankings(
  type?: RankingType,
  period?: string,
  limit: number = 50,
  page: number = 1
) {
  const params = new URLSearchParams()
  if (type) params.append('type', type)
  if (period) params.append('period', period)
  params.append('limit', limit.toString())
  params.append('page', page.toString())

  const { data, error, mutate, isLoading } = useSWR<ApiResponse<RankingsData>>(
    `/api/rankings?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000 // Refresh every minute
    }
  )

  return {
    rankings: data?.success && data.data ? data.data.rankings : {},
    pagination: data?.success && data.data ? data.data.pagination : null,
    isLoading,
    error: error || (!data?.success ? data?.error : null),
    refresh: mutate
  }
}

export function useUserRanking(userId: string | null) {
  const { data, error, isLoading } = useSWR<ApiResponse<{
    rankings: Ranking[]
    bestRanks: Record<RankingType, { rank: number; score: number; period: string }>
    totalPoints: number
    averageRank: number
  }>>(
    userId ? `/api/users/${userId}/rankings` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 300000 // Refresh every 5 minutes
    }
  )

  return {
    userRankings: data?.success ? data.data : null,
    isLoading,
    error: error || (!data?.success ? data?.error : null)
  }
}

export function useRankingStats() {
  const { data, error, isLoading } = useSWR<ApiResponse<{
    totalUsers: number
    activeUsers: number
    topPerformers: Array<{
      userId: string
      username: string
      name: string | null
      totalScore: number
      bestRank: number
      categories: number
    }>
    categoryStats: Record<RankingType, {
      totalParticipants: number
      averageScore: number
      topScore: number
    }>
    recentUpdates: Array<{
      type: RankingType
      period: string
      updatedAt: string
      topUser: {
        username: string
        name: string | null
        score: number
      }
    }>
  }>>(
    '/api/rankings/stats',
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 300000 // Refresh every 5 minutes
    }
  )

  return {
    stats: data?.success ? data.data : null,
    isLoading,
    error: error || (!data?.success ? data?.error : null)
  }
}

export function useTriggerRankingCalculation() {
  const triggerCalculation = async (types?: RankingType[], periods?: string[]) => {
    const response = await fetch('/api/rankings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ types, periods })
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to trigger ranking calculation')
    }

    return result.data
  }

  return { triggerCalculation }
}

