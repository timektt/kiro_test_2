import useSWR from 'swr'
import { useState } from 'react'
import { toast } from 'sonner'

interface Report {
  id: string
  type: 'POST' | 'USER' | 'COMMENT' | 'CHAT_MESSAGE'
  reason: 'SPAM' | 'HARASSMENT' | 'INAPPROPRIATE_CONTENT' | 'FAKE_ACCOUNT' | 'OTHER'
  description?: string
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  reporterId: string
  reportedUserId?: string
  reportedPostId?: string
  reportedCommentId?: string
  reviewedById?: string
  reviewedAt?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
  reporter: {
    id: string
    username: string
    name: string | null
  }
  reportedUser?: {
    id: string
    username: string
    name: string | null
    email: string
    image: string | null
  }
  reportedPost?: {
    id: string
    content: string
    createdAt: string
    author: {
      username: string
      name: string | null
    }
  }
  reportedComment?: {
    id: string
    content: string
    createdAt: string
    author: {
      username: string
      name: string | null
    }
  }
  reviewedBy?: {
    id: string
    username: string
    name: string | null
  }
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface CreateReportData {
  type: 'POST' | 'USER' | 'COMMENT' | 'CHAT_MESSAGE'
  reason: 'SPAM' | 'HARASSMENT' | 'INAPPROPRIATE_CONTENT' | 'FAKE_ACCOUNT' | 'OTHER'
  description?: string
  reportedUserId?: string
  reportedPostId?: string
  reportedCommentId?: string
}

interface UpdateReportData {
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'
  adminNotes?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Hook for submitting reports (user-facing)
export function useCreateReport() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitReport = async (data: CreateReportData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result: ApiResponse<Report> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit report')
      }

      toast.success(result.message || 'Report submitted successfully')
      return result.data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit report'
      toast.error(message)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitReport,
    isSubmitting,
  }
}

// Hook for fetching user's reports
export function useUserReports() {
  const { data, error, mutate } = useSWR<ApiResponse<Report[]>>(
    '/api/reports',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    reports: data?.success ? data.data : [],
    isLoading: !error && !data,
    error: error || (!data?.success ? data?.error : null),
    refresh: mutate,
  }
}

// Hook for admin reports management
export function useAdminReports({
  page = 1,
  limit = 20,
  status = 'ALL',
  type = 'ALL',
  priority = 'ALL',
}: {
  page?: number
  limit?: number
  status?: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED' | 'ALL'
  type?: 'POST' | 'USER' | 'COMMENT' | 'CHAT_MESSAGE' | 'ALL'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'ALL'
} = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    status,
    type,
    priority,
  })

  const { data, error, mutate } = useSWR<ApiResponse<{
    reports: Report[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }>>(
    `/api/admin/reports?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const [isUpdating, setIsUpdating] = useState(false)

  const updateReport = async (reportId: string, updateData: UpdateReportData) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          ...updateData,
        }),
      })

      const result: ApiResponse<Report> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update report')
      }

      toast.success(result.message || 'Report updated successfully')
      await mutate() // Refresh the list
      return result.data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update report'
      toast.error(message)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    reports: data?.success ? data.data?.reports : [],
    pagination: data?.success ? data.data?.pagination : null,
    isLoading: !error && !data,
    error: error || (!data?.success ? data?.error : null),
    refresh: mutate,
    updateReport,
    isUpdating,
  }
}

// Hook for report statistics (admin)
export function useReportStats() {
  const { data, error } = useSWR<ApiResponse<{
    total: number
    pending: number
    resolved: number
    byType: Record<string, number>
    byReason: Record<string, number>
    byPriority: Record<string, number>
    recentReports: Report[]
  }>>(
    '/api/admin/reports/stats',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
    }
  )

  return {
    stats: data?.success ? data.data : null,
    isLoading: !error && !data,
    error: error || (!data?.success ? data?.error : null),
  }
}