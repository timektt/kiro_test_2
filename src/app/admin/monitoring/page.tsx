'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, Activity, Database, Server, AlertTriangle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { fmtNumber, fmtDate } from '@/lib/format'

interface SystemMetrics {
  uptime: number
  memory: {
    used: number
    total: number
    external: number
    rss: number
    unit: string
  }
  cpu: {
    loadAverage: number[]
    platform: string
    arch: string
  }
  node: {
    version: string
    env: string
  }
}

interface PerformanceStats {
  count: number
  avg: number
  p50: number
  p95: number
  p99: number
  min: number
  max: number
}

interface MetricsData {
  timestamp: string
  system: SystemMetrics
  performance: Record<string, PerformanceStats>
  summary: {
    totalRequests: number
    dbQueries: number
    avgResponseTime: number
  }
}

interface HealthData {
  status: string
  timestamp: string
  uptime: number
  database: {
    status: string
    responseTime?: string
  }
  memory: {
    used: number
    total: number
    unit: string
  }
  environment: string
}

export default function MonitoringPage() {
  const { data: session, status } = useSession()
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Redirect if not admin
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session?.user?.isAdmin) {
    redirect('/auth/signin')
  }

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [metricsRes, healthRes] = await Promise.all([
        fetch('/api/metrics'),
        fetch('/api/health')
      ])
      
      if (!metricsRes.ok) {
        throw new Error('Failed to fetch metrics')
      }
      
      const metricsData = await metricsRes.json()
      const healthData = await healthRes.json()
      
      setMetrics(metricsData)
      setHealth(healthData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const resetMetrics = async () => {
    try {
      const response = await fetch('/api/metrics', { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to reset metrics')
      }
      await fetchMetrics()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset metrics')
    }
  }

  useEffect(() => {
    fetchMetrics()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return 'bg-green-500'
      case 'unhealthy':
      case 'disconnected':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  if (loading && !metrics) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading monitoring data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time performance and health metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchMetrics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={resetMetrics}>
            Reset Metrics
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {lastUpdated && (
        <p className="text-sm text-muted-foreground">
          Last updated: {fmtDate(lastUpdated.toISOString())}
        </p>
      )}

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(health?.status || 'unknown')}`} />
              <span className="text-2xl font-bold capitalize">{health?.status || 'Unknown'}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Uptime: {health ? formatUptime(health.uptime) : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(health?.database.status || 'unknown')}`} />
              <span className="text-2xl font-bold capitalize">{health?.database.status || 'Unknown'}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Response: {health?.database.responseTime || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fmtNumber(health?.memory.used || 0)} {health?.memory.unit || 'MB'}
            </div>
            <p className="text-xs text-muted-foreground">
              of {fmtNumber(health?.memory.total || 0)} {health?.memory.unit || 'MB'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fmtNumber(metrics?.summary.avgResponseTime || 0)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {fmtNumber(metrics?.summary.totalRequests || 0)} requests tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Performance Metrics</CardTitle>
              <CardDescription>
                Response time statistics for API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.performance && Object.keys(metrics.performance).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(metrics.performance)
                    .filter(([key]) => key.startsWith('api_'))
                    .map(([endpoint, stats]) => (
                      <div key={endpoint} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{endpoint.replace('api_', '').replace(/_/g, ' ')}</h4>
                          <Badge variant="outline">{fmtNumber(stats.count)} requests</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Avg</p>
                            <p className="font-medium">{fmtNumber(stats.avg)}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">P50</p>
                            <p className="font-medium">{fmtNumber(stats.p50)}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">P95</p>
                            <p className="font-medium">{fmtNumber(stats.p95)}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Min</p>
                            <p className="font-medium">{fmtNumber(stats.min)}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Max</p>
                            <p className="font-medium">{fmtNumber(stats.max)}ms</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No performance data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Node Version:</span>
                  <span>{metrics?.system.node.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <Badge variant="outline">{metrics?.system.node.env}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform:</span>
                  <span>{metrics?.system.cpu.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Architecture:</span>
                  <span>{metrics?.system.cpu.arch}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heap Used:</span>
                  <span>{fmtNumber(metrics?.system.memory.used)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heap Total:</span>
                  <span>{fmtNumber(metrics?.system.memory.total)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">External:</span>
                  <span>{fmtNumber(metrics?.system.memory.external)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RSS:</span>
                  <span>{fmtNumber(metrics?.system.memory.rss)} MB</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
