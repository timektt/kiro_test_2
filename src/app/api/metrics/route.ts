import { NextRequest, NextResponse } from 'next/server'
import { PerformanceMonitor } from '@/lib/performance'
import logger from '@/lib/logger'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const monitor = PerformanceMonitor.getInstance()
    const stats = monitor.getAllStats()
    
    // Get system metrics
    const systemMetrics = {
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        unit: 'MB'
      },
      cpu: {
        loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0],
        platform: process.platform,
        arch: process.arch
      },
      node: {
        version: process.version,
        env: process.env.NODE_ENV
      }
    }
    
    const metricsData = {
      timestamp: new Date().toISOString(),
      system: systemMetrics,
      performance: stats,
      summary: {
        totalRequests: Object.keys(stats).filter(key => key.startsWith('api_')).length,
        dbQueries: stats.db_query?.count || 0,
        avgResponseTime: calculateAverageResponseTime(stats)
      }
    }
    
    logger.info('Performance metrics requested', {
      admin: session.user.email,
      metricsCount: Object.keys(stats).length
    })
    
    return NextResponse.json(metricsData)
  } catch (error) {
    logger.error('Failed to get performance metrics', error)
    
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    )
  }
}

function calculateAverageResponseTime(stats: Record<string, any>): number {
  const apiStats = Object.entries(stats)
    .filter(([key]) => key.startsWith('api_'))
    .map(([, value]) => value?.avg || 0)
    .filter(avg => avg > 0)
  
  if (apiStats.length === 0) return 0
  
  return Math.round(
    apiStats.reduce((sum, avg) => sum + avg, 0) / apiStats.length
  )
}

// Reset metrics (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Create new instance to reset metrics
    const monitor = PerformanceMonitor.getInstance()
    // Clear the metrics map
    ;(monitor as any).metrics.clear()
    
    logger.info('Performance metrics reset', {
      admin: session.user.email,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({
      message: 'Metrics reset successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Failed to reset performance metrics', error)
    
    return NextResponse.json(
      { error: 'Failed to reset metrics' },
      { status: 500 }
    )
  }
}