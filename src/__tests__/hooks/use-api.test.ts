import { renderHook, waitFor } from '@testing-library/react'
import { useApi, useAPIMutation, useInfiniteAPI } from '@/hooks/use-api'
import { useUIStore } from '@/stores/ui-store'

// Mock the UI store
jest.mock('@/stores/ui-store')
const mockAddToast = jest.fn()
;(useUIStore as jest.Mock).mockReturnValue({
  addToast: mockAddToast,
})

// Mock fetch
const mockFetch = global.fetch as jest.Mock

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: { test: 'data' } }),
    })
  })

  it('should have correct return structure', () => {
    const { result } = renderHook(() => useApi('/api/test'))

    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('isValidating')
    expect(result.current).toHaveProperty('mutate')
    expect(result.current).toHaveProperty('refresh')
  })

  it('should handle loading state correctly', () => {
    const { result } = renderHook(() => useApi('/api/test'))

    expect(typeof result.current.isLoading).toBe('boolean')
  })
})

describe('useAPIMutation', () => {
  const mockMutationFn = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockMutationFn.mockResolvedValue({ success: true })
  })

  it('should have mutation functionality', () => {
    const { result } = renderHook(() => useAPIMutation('test-key', mockMutationFn))

    expect(result.current).toHaveProperty('trigger')
    expect(result.current).toHaveProperty('isMutating')
    expect(typeof result.current.trigger).toBe('function')
  })
})