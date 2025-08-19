import { useEffect, useRef, useCallback, useState } from 'react'

interface UseInfiniteScrollOptions {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

interface UseInfiniteScrollReturn {
  sentinelRef: React.RefObject<HTMLDivElement>
  isIntersecting: boolean
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      const isCurrentlyIntersecting = entry.isIntersecting
      
      setIsIntersecting(isCurrentlyIntersecting)
      
      if (
        isCurrentlyIntersecting &&
        hasMore &&
        !isLoading &&
        enabled
      ) {
        // Debounce the load more call to prevent rapid successive calls
        if (loadMoreTimeoutRef.current) {
          clearTimeout(loadMoreTimeoutRef.current)
        }
        
        loadMoreTimeoutRef.current = setTimeout(() => {
          onLoadMore()
        }, 200) // 200ms debounce
      }
    },
    [hasMore, isLoading, onLoadMore, enabled]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !enabled) return

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observerRef.current.observe(sentinel)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current)
      }
    }
  }, [handleIntersection, threshold, rootMargin, enabled])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current)
      }
    }
  }, [])

  return {
    sentinelRef,
    isIntersecting,
  }
}

// Hook for detecting when user scrolls near the bottom
export function useScrollToBottom({
  onScrollToBottom,
  threshold = 200,
  enabled = true,
}: {
  onScrollToBottom: () => void
  threshold?: number
  enabled?: boolean
}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleScroll = useCallback(() => {
    if (!enabled) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight

    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    if (distanceFromBottom <= threshold) {
      // Debounce the callback
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        onScrollToBottom()
      }, 100)
    }
  }, [onScrollToBottom, threshold, enabled])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [handleScroll, enabled])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
}