import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`
    
    // Get basic system info
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024)
      },
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      environment: process.env.NODE_ENV || 'development'
    }, { status: 503 })
  }
}
