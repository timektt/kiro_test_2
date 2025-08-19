import { renderHook, waitFor } from '@testing-library/react'
import { useProfileVisibility, useBlockUser, useReportUser, getVisibleProfileInfo, canPerformAction } from '@/hooks/use-privacy'
import type { PrivacySettings, User } from '@/types'

// Mock fetch
global.fetch = jest.fn()

const mockUser: User = {
  id: 'user-1',
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  image: null,
  bio: null,
  role: 'USER',
  isActive: true,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
}

const mockPrivacySettings: PrivacySettings = {
  id: 'privacy-1',
  userId: 'user-1',
  profileVisibility: 'PUBLIC',
  showMBTI: true,
  showFollowerCount: true,
  showFollowingCount: true,
  showBio: true,
  showJoinDate: true,
  allowMessages: 'EVERYONE',
  allowFollows: 'EVERYONE',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
}

describe('useProfileVisibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches privacy settings successfully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ privacySettings: mockPrivacySettings }),
    })

    const { result } = renderHook(() => useProfileVisibility('user-1'))

    expect(result.current.visibility).toBeNull()
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.visibility).toEqual(mockPrivacySettings)
      expect(result.current.error).toBeNull()
    })

    expect(fetch).toHaveBeenCalledWith('/api/privacy/user-1')
  })

  it('handles fetch error', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useProfileVisibility('user-1'))

    await waitFor(() => {
      expect(result.current.visibility).toBeNull()
      expect(result.current.error).toEqual(new Error('Network error'))
    })
  })

  it('handles API error response', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'User not found' }),
    })

    const { result } = renderHook(() => useProfileVisibility('user-1'))

    await waitFor(() => {
      expect(result.current.visibility).toBeNull()
      expect(result.current.error).toEqual(new Error('User not found'))
    })
  })

  it('does not fetch when userId is not provided', () => {
    const { result } = renderHook(() => useProfileVisibility(undefined))

    expect(result.current.visibility).toBeNull()
    expect(result.current.error).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('useBlockUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('blocks user successfully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const { result } = renderHook(() => useBlockUser())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()

    await result.current.blockUser('user-1')

    expect(fetch).toHaveBeenCalledWith('/api/users/user-1/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('handles block error', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useBlockUser())

    await expect(result.current.blockUser('user-1')).rejects.toThrow('Network error')

    await waitFor(() => {
      expect(result.current.error).toEqual(new Error('Network error'))
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('handles API error response', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Cannot block yourself' }),
    })

    const { result } = renderHook(() => useBlockUser())

    await expect(result.current.blockUser('user-1')).rejects.toThrow('Cannot block yourself')

    await waitFor(() => {
      expect(result.current.error).toEqual(new Error('Cannot block yourself'))
    })
  })

  it('sets loading state during block operation', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })

    ;(fetch as jest.Mock).mockReturnValueOnce(promise)

    const { result } = renderHook(() => useBlockUser())

    const blockPromise = result.current.blockUser('user-1')

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })

    resolvePromise!({
      ok: true,
      json: async () => ({ success: true }),
    })

    await blockPromise

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })
})

describe('useReportUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('reports user successfully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const { result } = renderHook(() => useReportUser())

    await result.current.reportUser('user-1', 'spam', 'This user is spamming')

    expect(fetch).toHaveBeenCalledWith('/api/users/user-1/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: 'spam',
        description: 'This user is spamming',
      }),
    })
  })

  it('handles report error', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useReportUser())

    await expect(
      result.current.reportUser('user-1', 'spam', 'This user is spamming')
    ).rejects.toThrow('Network error')

    await waitFor(() => {
      expect(result.current.error).toEqual(new Error('Network error'))
    })
  })

  it('sets loading state during report operation', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })

    ;(fetch as jest.Mock).mockReturnValueOnce(promise)

    const { result } = renderHook(() => useReportUser())

    const reportPromise = result.current.reportUser('user-1', 'spam', 'This user is spamming')

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })

    resolvePromise!({
      ok: true,
      json: async () => ({ success: true }),
    })

    await reportPromise

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })
})

describe('getVisibleProfileInfo', () => {
  it('returns all visible when privacy settings allow public access', () => {
    const result = getVisibleProfileInfo(mockPrivacySettings, 'current-user', 'user-1')

    expect(result).toEqual({
      showMBTI: true,
      showFollowerCount: true,
      showFollowingCount: true,
      showBio: true,
      showJoinDate: true,
    })
  })

  it('returns all visible for own profile', () => {
    const privateSettings: PrivacySettings = {
      ...mockPrivacySettings,
      profileVisibility: 'PRIVATE',
      showMBTI: false,
      showFollowerCount: false,
      showFollowingCount: false,
      showBio: false,
      showJoinDate: false,
    }

    const result = getVisibleProfileInfo(privateSettings, 'user-1', 'user-1')

    expect(result).toEqual({
      showMBTI: true,
      showFollowerCount: true,
      showFollowingCount: true,
      showBio: true,
      showJoinDate: true,
    })
  })

  it('respects privacy settings for other users', () => {
    const restrictedSettings: PrivacySettings = {
      ...mockPrivacySettings,
      showMBTI: false,
      showFollowerCount: false,
      showFollowingCount: true,
      showBio: true,
      showJoinDate: false,
    }

    const result = getVisibleProfileInfo(restrictedSettings, 'current-user', 'user-1')

    expect(result).toEqual({
      showMBTI: false,
      showFollowerCount: false,
      showFollowingCount: true,
      showBio: true,
      showJoinDate: false,
    })
  })

  it('hides everything for private profiles when not owner', () => {
    const privateSettings: PrivacySettings = {
      ...mockPrivacySettings,
      profileVisibility: 'PRIVATE',
    }

    const result = getVisibleProfileInfo(privateSettings, 'current-user', 'user-1')

    expect(result).toEqual({
      showMBTI: false,
      showFollowerCount: false,
      showFollowingCount: false,
      showBio: false,
      showJoinDate: false,
    })
  })
})

describe('canPerformAction', () => {
  it('allows actions when user is logged in and not blocked', () => {
    const result = canPerformAction('current-user', 'user-1', mockPrivacySettings, false)
    expect(result).toBe(true)
  })

  it('prevents actions when user is not logged in', () => {
    const result = canPerformAction(undefined, 'user-1', mockPrivacySettings, false)
    expect(result).toBe(false)
  })

  it('prevents actions when user is blocked', () => {
    const result = canPerformAction('current-user', 'user-1', mockPrivacySettings, true)
    expect(result).toBe(false)
  })

  it('prevents actions on own profile', () => {
    const result = canPerformAction('user-1', 'user-1', mockPrivacySettings, false)
    expect(result).toBe(false)
  })

  it('prevents actions when profile is private and user is not owner', () => {
    const privateSettings: PrivacySettings = {
      ...mockPrivacySettings,
      profileVisibility: 'PRIVATE',
    }

    const result = canPerformAction('current-user', 'user-1', privateSettings, false)
    expect(result).toBe(false)
  })

  it('allows actions when profile is friends-only and users are friends', () => {
    const friendsOnlySettings: PrivacySettings = {
      ...mockPrivacySettings,
      profileVisibility: 'FRIENDS_ONLY',
    }

    // Assuming friendship check would be implemented
    const result = canPerformAction('current-user', 'user-1', friendsOnlySettings, false, true)
    expect(result).toBe(true)
  })

  it('prevents actions when profile is friends-only and users are not friends', () => {
    const friendsOnlySettings: PrivacySettings = {
      ...mockPrivacySettings,
      profileVisibility: 'FRIENDS_ONLY',
    }

    const result = canPerformAction('current-user', 'user-1', friendsOnlySettings, false, false)
    expect(result).toBe(false)
  })
})