'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingFeed } from '@/components/ui/loading-feed'
import { EmptyState } from '@/components/ui/empty-state'
import { useUIStore } from '@/stores/ui-store'

interface AdminDashboardProps {
  adminUser: {
    id: string
    username: string
    name: string | null
    email: string
    role: 'ADMIN' | 'MODERATOR'
    image: string | null
  }
}

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalPosts: number
  totalComments: number
  totalLikes: number
  pendingReports: number
  newUsersToday: number
  postsToday: number
}

interface RecentActivity {
  id: string
  type: 'USER_REGISTERED' | 'POST_CREATED' | 'REPORT_SUBMITTED' | 'USER_BANNED'
  message: string
  timestamp: Date
  severity: 'info' | 'warning' | 'error'
}

export function AdminDashboard({ adminUser }: AdminDashboardProps) {
  const { addToast } = useUIStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/stats')
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats')
      }
      const statsData = await statsResponse.json()
      setStats(statsData.data)

      // Fetch recent activity
      const activityResponse = await fetch('/api/admin/activity?limit=10')
      if (!activityResponse.ok) {
        throw new Error('Failed to fetch activity')
      }
      const activityData = await activityResponse.json()
      setRecentActivity(activityData.data)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard'
      setError(errorMessage)
      addToast({
        type: 'error',
        title: 'Dashboard Error',
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingFeed />
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Error Loading Dashboard"
        description={error}
        action={{
          label: 'Retry',
          onClick: fetchDashboardData,
        }}
      />
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: `+${stats?.newUsersToday || 0} today`,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      change: `${Math.round(((stats?.activeUsers || 0) / (stats?.totalUsers || 1)) * 100)}% of total`,
      icon: Activity,
      color: 'text-green-600',
    },
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      change: `+${stats?.postsToday || 0} today`,
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      title: 'Comments',
      value: stats?.totalComments || 0,
      change: 'All time',
      icon: MessageSquare,
      color: 'text-orange-600',
    },
    {
      title: 'Likes',
      value: stats?.totalLikes || 0,
      change: 'All time',
      icon: Heart,
      color: 'text-red-600',
    },
    {
      title: 'Pending Reports',
      value: stats?.pendingReports || 0,
      change: 'Requires attention',
      icon: AlertTriangle,
      color: 'text-yellow-600',
    },
  ]

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'USER_REGISTERED':
        return Users
      case 'POST_CREATED':
        return FileText
      case 'REPORT_SUBMITTED':
        return AlertTriangle
      case 'USER_BANNED':
        return Shield
      default:
        return Activity
    }
  }

  const getActivityColor = (severity: RecentActivity['severity']) => {
    switch (severity) {
      case 'info':
        return 'text-blue-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back, {adminUser.name || adminUser.username}
          </p>
        </div>
        <Badge variant={adminUser.role === 'ADMIN' ? 'default' : 'secondary'} className="w-fit">
          {adminUser.role}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium truncate">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color} flex-shrink-0`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm sm:text-base">
              No recent activity to display
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start gap-2 sm:gap-3">
                    <Icon className={`h-4 w-4 mt-0.5 sm:mt-1 ${getActivityColor(activity.severity)} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-1 sm:gap-2">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-1 sm:gap-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm">Review Content</span>
            </Button>
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-1 sm:gap-2">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm">Handle Reports</span>
            </Button>
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-1 sm:gap-2">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard