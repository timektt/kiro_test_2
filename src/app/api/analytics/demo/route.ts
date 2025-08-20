import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for demo analytics events
const demoAnalyticsSchema = z.object({
  event: z.string().min(1),
  step: z.number().optional(),
  stepTitle: z.string().optional(),
  duration: z.number().optional(),
  completed: z.boolean().optional(),
  timestamp: z.number(),
  userAgent: z.string().optional(),
  sessionId: z.string().optional(),
})

type DemoAnalyticsEvent = z.infer<typeof demoAnalyticsSchema>

// POST /api/analytics/demo - Track demo analytics event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    // Validate the request body
    const validatedData = demoAnalyticsSchema.parse(body)
    
    // Get user agent and IP for additional context
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : request.ip || 'Unknown'
    
    // Create analytics record in database
    const analyticsRecord = await prisma.demoAnalytics.create({
      data: {
        event: validatedData.event,
        step: validatedData.step,
        stepTitle: validatedData.stepTitle,
        duration: validatedData.duration,
        completed: validatedData.completed,
        timestamp: new Date(validatedData.timestamp),
        userAgent: validatedData.userAgent || userAgent,
        sessionId: validatedData.sessionId,
        userId: session?.user?.id,
        ipAddress: ip,
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      id: analyticsRecord.id 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error tracking demo analytics:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/analytics/demo - Get demo analytics summary (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }
    
    // Get analytics data
    const analytics = await prisma.demoAnalytics.findMany({
      where: {
        ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter })
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    })
    
    // Calculate summary statistics
    const summary = {
      totalEvents: analytics.length,
      uniqueUsers: new Set(analytics.filter(a => a.userId).map(a => a.userId)).size,
      uniqueSessions: new Set(analytics.filter(a => a.sessionId).map(a => a.sessionId)).size,
      demoStarts: analytics.filter(a => a.event === 'demo_started').length,
      demoCompletions: analytics.filter(a => a.event === 'demo_completed').length,
      completionRate: 0,
      averageDuration: 0,
      stepViews: {} as Record<number, number>,
      dropOffPoints: {} as Record<number, number>,
      popularInteractions: {} as Record<string, number>,
    }
    
    // Calculate completion rate
    if (summary.demoStarts > 0) {
      summary.completionRate = (summary.demoCompletions / summary.demoStarts) * 100
    }
    
    // Calculate average duration
    const completedEvents = analytics.filter(a => a.event === 'demo_completed' && a.duration)
    if (completedEvents.length > 0) {
      summary.averageDuration = completedEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / completedEvents.length
    }
    
    // Count step views
    analytics.filter(a => a.event === 'demo_step_viewed' && a.step !== null).forEach(a => {
      const step = a.step!
      summary.stepViews[step] = (summary.stepViews[step] || 0) + 1
    })
    
    // Count drop-off points
    analytics.filter(a => a.event === 'demo_exited' && !a.completed && a.step !== null).forEach(a => {
      const step = a.step!
      summary.dropOffPoints[step] = (summary.dropOffPoints[step] || 0) + 1
    })
    
    // Count popular interactions
    analytics.filter(a => a.event === 'demo_interaction' && a.stepTitle).forEach(a => {
      const interaction = a.stepTitle!
      summary.popularInteractions[interaction] = (summary.popularInteractions[interaction] || 0) + 1
    })
    
    return NextResponse.json({
      summary,
      events: analytics,
    })
    
  } catch (error) {
    console.error('Error fetching demo analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/analytics/demo - Clear demo analytics (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const olderThan = searchParams.get('olderThan') // ISO date string
    
    let deleteFilter: any = {}
    if (olderThan) {
      deleteFilter.timestamp = {
        lt: new Date(olderThan)
      }
    }
    
    const result = await prisma.demoAnalytics.deleteMany({
      where: deleteFilter
    })
    
    return NextResponse.json({
      success: true,
      deletedCount: result.count
    })
    
  } catch (error) {
    console.error('Error deleting demo analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
