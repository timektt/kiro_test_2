import useSWR, { SWRConfiguration } from 'swr'
import useSWRMutation from 'swr/mutation'
import { useUIStore } from '@/stores/ui-store'

// Default fetcher function
const defaultFetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'API Error')
  }
  return result.data
}

// Generic API hook with error handling and loading states
export function useApi<T = any>(
  key: string | null,
  fetcher = defaultFetcher,
  options?: SWRConfiguration
) {
  const { addToast } = useUIStore()
  
  const { data, error, isLoading, mutate, isValidating } = useSWR<T>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      onError: (error) => {
        if (options?.onError) {
          options.onError(error, key, { revalidate: true })
        } else {
          addToast({
            type: 'error',
            title: 'Request failed',
            description: error.message,
          })
        }
      },
      ...options,
    }
  )
  
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    refresh: () => mutate(),
  }
}

// Generic mutation hook
export function useAPIMutation<T = any, K = any>(
  mutationFn: (url: string, options: { arg: K }) => Promise<T>,
  options?: {
    onSuccess?: (data: T, key: string, config: { arg: K }) => void
    onError?: (error: Error, key: string, config: { arg: K }) => void
  }
) {
  const { addToast } = useUIStore()
  
  const { trigger, isMutating, error } = useSWRMutation(
    null,
    mutationFn,
    {
      onSuccess: options?.onSuccess,
      onError: (error, key, config) => {
        if (options?.onError) {
          options.onError(error, key, config)
        } else {
          addToast({
            type: 'error',
            title: 'Operation failed',
            description: error.message,
          })
        }
      },
    }
  )
  
  return {
    trigger,
    isMutating,
    error,
  }
}

// Hook for infinite loading (pagination)
export function useInfiniteAPI<T = any>(
  getKey: (pageIndex: number, previousPageData: T | null) => string | null,
  fetcher = defaultFetcher,
  options?: SWRConfiguration
) {
  const { addToast } = useUIStore()
  
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    size,
    setSize,
  } = useSWR(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        if (options?.onError) {
          options.onError(error)
        } else {
          addToast({
            type: 'error',
            title: 'Failed to load data',
            description: error.message,
          })
        }
      },
      ...options,
    }
  )
  
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 20) // Assuming 20 items per page
  
  return {
    data: data ? data.flat() : [],
    error,
    isLoading,
    isLoadingMore,
    isValidating,
    isEmpty,
    isReachingEnd,
    mutate,
    size,
    setSize,
    loadMore: () => setSize(size + 1),
    refresh: () => mutate(),
  }
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  key: string,
  updateFn: (currentData: T, optimisticData: Partial<T>) => T,
  revertFn?: (currentData: T, originalData: T) => T
) {
  const { mutate } = useSWR(key)
  
  const optimisticUpdate = async (
    optimisticData: Partial<T>,
    asyncUpdate: () => Promise<T>
  ) => {
    // Get current data
    const currentData = await mutate()
    if (!currentData) return
    
    // Apply optimistic update
    const optimisticResult = updateFn(currentData, optimisticData)
    mutate(optimisticResult, false)
    
    try {
      // Perform actual update
      const result = await asyncUpdate()
      mutate(result)
      return result
    } catch (error) {
      // Revert on error
      if (revertFn) {
        const revertedData = revertFn(optimisticResult, currentData)
        mutate(revertedData, false)
      } else {
        mutate(currentData, false)
      }
      throw error
    }
  }
  
  return { optimisticUpdate }
}

// Hook for caching and prefetching
export function usePrefetch() {
  const prefetch = (key: string, fetcher = defaultFetcher) => {
    // This will cache the data for future use
    return useSWR(key, fetcher, {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    })
  }
  
  return { prefetch }
}

// Hook for managing loading states across multiple requests
export function useLoadingState() {
  const { isLoading, setLoading } = useUIStore()
  
  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> => {
    setLoading(true, loadingMessage)
    try {
      const result = await asyncFn()
      return result
    } finally {
      setLoading(false)
    }
  }
  
  return {
    isLoading,
    withLoading,
  }
}