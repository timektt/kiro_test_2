import { renderHook, waitFor } from '@testing-library/react'
import { useCurrentUser, useUser, useUpdateProfile, useFollowUser } from '@/hooks/use-users'
import { useUserStore } from '@/stores/user-store'
import { useUIStore } from '@/stores/ui-store'

// Mock the stores
jest.mock('@/stores/user-store')
jest.mock('@/stores/ui-store')

const mockSetCurrentUser = jest.fn()
const mockFollowUser = jest.fn()
const mockUnfollowUser = jest.fn()
const mockUpdateUser = jest.fn()
const mockAddToast = jest.fn()

;(useUserStore as jest.Mock).mockReturnValue({
  currentUser: null,
  setCurrentUser: mockSetCurrentUser,
  followUser: mockFollowUser,
  unfollowUser: mockUnfollowUser,
  updateUser: mockUpdateUser,
})

;(useUIStore as jest.Mock).mockReturnValue({
  addToast: mockAddToast,
})

// Mock fetch
const mockFetch = global.fetch as jest.Mock

describe('useCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        data: { id: '1', name: 'John Doe' },
      }),
    })
  })

  it('should have user data structure', () => {
    const { result } = renderHook(() => useCurrentUser())

    expect(result.current).toHaveProperty('user')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('mutate')
  })

  it('should handle loading state', () => {
    const { result } = renderHook(() => useCurrentUser())

    expect(typeof result.current.isLoading).toBe('boolean')
  })
})

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        data: {
          id: '1',
          username: 'testuser',
          name: 'Test User',
        },
      }),
    })
  })

  it('should fetch user by username', async () => {
    const { result } = renderHook(() => useUser('testuser'))

    await waitFor(() => {
      expect(result.current.user).toBeTruthy()
    })

    expect(result.current.isLoading).toBe(false)
  })
})

describe('useUpdateProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        data: { id: '1', name: 'Updated Name' },
      }),
    })
  })

  it('should have update profile functionality', () => {
    const { result } = renderHook(() => useUpdateProfile())

    expect(result.current).toHaveProperty('updateProfile')
    expect(result.current).toHaveProperty('isUpdating')
  })
})

describe('useFollowUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        data: { isFollowing: true },
      }),
    })
  })

  it('should have follow/unfollow functionality', () => {
    const { result } = renderHook(() => useFollowUser())

    expect(result.current).toHaveProperty('followUser')
    expect(result.current).toHaveProperty('unfollowUser')
    expect(result.current).toHaveProperty('isFollowing')
    expect(result.current).toHaveProperty('isUnfollowing')
  })

  it('should have function types', () => {
    const { result } = renderHook(() => useFollowUser())

    expect(typeof result.current.followUser).toBe('function')
    expect(typeof result.current.unfollowUser).toBe('function')
  })
})
