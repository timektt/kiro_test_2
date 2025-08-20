'use client'

import { useCallback } from 'react'

interface DemoAnalyticsEvent {
  event: string
  step?: number
  stepTitle?: string
  duration?: number
  completed?: boolean
  timestamp: number
}

interface DemoAnalytics {
  trackDemoStart: () => void
  trackDemoStep: (step: number, stepTitle: string) => void
  trackDemoComplete: (totalDuration: number) => void
  trackDemoPause: (step: number) => void
  trackDemoRestart: () => void
  trackDemoExit: (step: number, completed: boolean) => void
  trackInteraction: (step: number, interactionType: string) => void
}

export function useDemoAnalytics(): DemoAnalytics {
  const trackEvent = useCallback((eventData: DemoAnalyticsEvent) => {
    // Log to console for debugging
    console.log('Demo Analytics Event:', eventData)
    
    // Store in localStorage as backup
    const existingEvents = JSON.parse(localStorage.getItem('demo_analytics') || '[]')
    existingEvents.push(eventData)
    localStorage.setItem('demo_analytics', JSON.stringify(existingEvents))
    
    // Send to our analytics API endpoint
    const enhancedEventData = {
      ...eventData,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      sessionId: getOrCreateSessionId(),
    }
    
    fetch('/api/analytics/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enhancedEventData)
    }).catch(error => {
      console.error('Failed to send analytics event:', error)
      // Optionally, you could implement retry logic here
    })
    
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventData.event, {
        custom_parameter_step: eventData.step,
        custom_parameter_step_title: eventData.stepTitle,
        custom_parameter_duration: eventData.duration,
        custom_parameter_completed: eventData.completed
      })
    }
    
    // Send to other analytics services if configured
    // Example for Mixpanel
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(eventData.event, {
        step: eventData.step,
        step_title: eventData.stepTitle,
        duration: eventData.duration,
        completed: eventData.completed
      })
    }
  }, [])

  const trackDemoStart = useCallback(() => {
    trackEvent({
      event: 'demo_started',
      timestamp: Date.now()
    })
  }, [trackEvent])

  const trackDemoStep = useCallback((step: number, stepTitle: string) => {
    trackEvent({
      event: 'demo_step_viewed',
      step,
      stepTitle,
      timestamp: Date.now()
    })
  }, [trackEvent])

  const trackDemoComplete = useCallback((totalDuration: number) => {
    trackEvent({
      event: 'demo_completed',
      duration: totalDuration,
      completed: true,
      timestamp: Date.now()
    })
  }, [trackEvent])

  const trackDemoPause = useCallback((step: number) => {
    trackEvent({
      event: 'demo_paused',
      step,
      timestamp: Date.now()
    })
  }, [trackEvent])

  const trackDemoRestart = useCallback(() => {
    trackEvent({
      event: 'demo_restarted',
      timestamp: Date.now()
    })
  }, [trackEvent])

  const trackDemoExit = useCallback((step: number, completed: boolean) => {
    trackEvent({
      event: 'demo_exited',
      step,
      completed,
      timestamp: Date.now()
    })
  }, [trackEvent])

  const trackInteraction = useCallback((step: number, interactionType: string) => {
    trackEvent({
      event: 'demo_interaction',
      step,
      stepTitle: interactionType,
      timestamp: Date.now()
    })
  }, [trackEvent])

  return {
    trackDemoStart,
    trackDemoStep,
    trackDemoComplete,
    trackDemoPause,
    trackDemoRestart,
    trackDemoExit,
    trackInteraction
  }
}

// Generate or get session ID
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-session'
  
  let sessionId = sessionStorage.getItem('demo_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('demo_session_id', sessionId)
  }
  return sessionId
}

// Utility function to get analytics data from localStorage (fallback)
export function getDemoAnalytics(): DemoAnalyticsEvent[] {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem('demo_analytics') || '[]')
}

// Utility function to fetch analytics data from API (admin only)
export async function fetchDemoAnalytics(params?: {
  startDate?: string
  endDate?: string
  limit?: number
}) {
  try {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const response = await fetch(`/api/analytics/demo?${searchParams.toString()}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch demo analytics:', error)
    throw error
  }
}

// Utility function to clear analytics data
export function clearDemoAnalytics(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_analytics')
  }
}

// Utility function to get analytics summary
export function getDemoAnalyticsSummary() {
  const events = getDemoAnalytics()
  
  const summary = {
    totalViews: events.filter(e => e.event === 'demo_started').length,
    totalCompletions: events.filter(e => e.event === 'demo_completed').length,
    averageDuration: 0,
    mostViewedStep: 0,
    dropOffPoints: {} as Record<number, number>,
    interactionCounts: {} as Record<string, number>
  }
  
  // Calculate average duration
  const completedEvents = events.filter(e => e.event === 'demo_completed' && e.duration)
  if (completedEvents.length > 0) {
    summary.averageDuration = completedEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / completedEvents.length
  }
  
  // Find most viewed step
  const stepViews = {} as Record<number, number>
  events.filter(e => e.event === 'demo_step_viewed' && e.step !== undefined).forEach(e => {
    stepViews[e.step!] = (stepViews[e.step!] || 0) + 1
  })
  
  if (Object.keys(stepViews).length > 0) {
    summary.mostViewedStep = parseInt(Object.keys(stepViews).reduce((a, b) => stepViews[parseInt(a)] > stepViews[parseInt(b)] ? a : b))
  }
  
  // Calculate drop-off points
  events.filter(e => e.event === 'demo_exited' && !e.completed && e.step !== undefined).forEach(e => {
    summary.dropOffPoints[e.step!] = (summary.dropOffPoints[e.step!] || 0) + 1
  })
  
  // Count interactions
  events.filter(e => e.event === 'demo_interaction' && e.stepTitle).forEach(e => {
    summary.interactionCounts[e.stepTitle!] = (summary.interactionCounts[e.stepTitle!] || 0) + 1
  })
  
  return summary
}
