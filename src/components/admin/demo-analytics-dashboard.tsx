'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Play, 
  CheckCircle, 
  Clock, 
  MousePointer, 
  Calendar as CalendarIcon,
  Download,
  RefreshCw,
  Trash2
} from 'lucide-react'
import { fetchDemoAnalytics } from '@/hooks/use-demo-analytics'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { fmtNumber } from '@/lib/format'

interface AnalyticsSummary {
  totalEvents: number
  uniqueUsers: number
  uniqueSessions: number
  demoStarts: number
  demoCompletions: number
  completionRate: number
  averageDuration: number
  stepViews: Record<number, number>
  dropOffPoints: Record<number, number>
  popularInteractions: Record<string, number>
}

interface AnalyticsData {
  summary: AnalyticsSummary
  events: any[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function DemoAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {}
      if (dateRange.from) {
        params.startDate = dateRange.from.toISOString()
      }
      if (dateRange.to) {
        params.endDate = dateRange.to.toISOString()
      }
      
      const result = await fetchDemoAnalytics(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const clearOldData = async () => {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const response = await fetch(`/api/analytics/demo?olderThan=${thirtyDaysAgo.toISOString()}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await refreshData()
      }
    } catch (err) {
      console.error('Failed to clear old data:', err)
    }
  }

  const exportData = () => {
    if (!data) return
    
    const csvContent = [
      ['Event', 'Step', 'Step Title', 'Duration', 'Completed', 'Timestamp', 'User ID', 'Session ID'].join(','),
      ...data.events.map(event => [
        event.event,
        event.step || '',
        event.stepTitle || '',
        event.duration || '',
        event.completed || '',
        event.timestamp,
        event.userId || '',
        event.sessionId || ''
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `demo-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  useEffect(() => {
    fetchData()
  }, [dateRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading analytics data: {error}</p>
            <Button onClick={fetchData} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    )
  }

  const { summary } = data

  // Prepare chart data
  const stepViewsData = Object.entries(summary.stepViews).map(([step, views]) => ({
    step: `Step ${step}`,
    views
  }))

  const dropOffData = Object.entries(summary.dropOffPoints).map(([step, count]) => ({
    step: `Step ${step}`,
    dropOffs: count
  }))

  const interactionData = Object.entries(summary.popularInteractions)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([interaction, count]) => ({
      interaction,
      count
    }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Demo Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track and analyze demo usage patterns and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={refreshData} disabled={refreshing} variant="outline">
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          </Button>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={clearOldData} variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Demo Views</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtNumber(summary.demoStarts)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.uniqueSessions} unique sessions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {summary.demoCompletions} completions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(summary.averageDuration / 1000)}s
            </div>
            <p className="text-xs text-muted-foreground">
              Time to complete
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="steps">Step Analysis</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="events">Event Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Step Views</CardTitle>
                <CardDescription>
                  Number of times each demo step was viewed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stepViewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="step" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Drop-off Points</CardTitle>
                <CardDescription>
                  Steps where users most commonly exit the demo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dropOffData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="step" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="dropOffs" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Step Performance</CardTitle>
              <CardDescription>
                Detailed analysis of each demo step
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(summary.stepViews).map(([step, views]) => {
                  const dropOffs = summary.dropOffPoints[parseInt(step)] || 0
                  const retentionRate = views > 0 ? ((views - dropOffs) / views) * 100 : 0
                  
                  return (
                    <div key={step} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Step {step}</span>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{views} views</span>
                          <span>{dropOffs} drop-offs</span>
                          <Badge variant={retentionRate > 80 ? "default" : retentionRate > 60 ? "secondary" : "destructive"}>
                            {retentionRate.toFixed(1)}% retention
                          </Badge>
                        </div>
                      </div>
                      <Progress value={retentionRate} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Interactions</CardTitle>
              <CardDescription>
                Most common user interactions during the demo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={interactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ interaction, percent }) => `${interaction} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {interactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>
                Latest demo analytics events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.events.slice(0, 50).map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{event.event}</Badge>
                      {event.step !== null && (
                        <span className="text-sm text-muted-foreground">Step {event.step}</span>
                      )}
                      {event.stepTitle && (
                        <span className="text-sm">{event.stepTitle}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(event.timestamp), 'MMM dd, HH:mm:ss')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
