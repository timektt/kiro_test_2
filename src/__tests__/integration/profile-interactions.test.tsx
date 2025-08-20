import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { toast } from 'sonner'
import ProfilePage from '@/app/profile/[username]/page'
import type { User, MBTIType } from '@/types'

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useParams: () => ({ username: 'testuser' }),
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSession: () => ({
    data: {
      user: {
        id: 'current-user',
        name: 'Current User',
        email: 'current@example.com',
      },
    },
    status: 'authenticated',
  }),
}))

// Mock fetch for API calls
global.fetch = jest.fn()

const mockUser: User & {
  mbti?: { type: MBTIType; description?: string | null } | null
  _count?: {
    posts: number
    followers: number
    following: number
  }
} = {
  id: 'user-1',
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  image: 'https://example.com/avatar.jpg',
  bio: 'This is a test bio',
  role: 'USER',
  isActive: true,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  mbti: {
    type: 'INTJ',
    description: 'The Architect',
  },
  _count: {
    posts: 10,
    followers: 100,
    following: 50,
  },
}

const mockPrivacySettings = {
  id: 'privacy-1',
  userId: 'user-1',
  profileVisibility: 'PUBLIC' as const,
  showMBTI: true,
  showFollowerCount: true,
  showFollowingCount: true,
  showBio: true,
  showJoinDate: true,
  allowMessages: 'EVERYONE' as const,
  allowFollows: 'EVERYONE' as const,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
}

const mockPosts = [
  {
    id: 'post-1',
    title: 'Test Post 1',
    content: 'This is test post content',
    authorId: 'user-1',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    author: mockUser,
    _count: {
      likes: 5,
      comments: 2,
    },
  },
  {
    id: 'post-2',
    title: 'Test Post 2',
    content: 'Another test post',
    authorId: 'user-1',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
    author: mockUser,
    _count: {
      likes: 3,
      comments: 1,
    },
  },
]

function setupMockFetch() {
  ;(fetch as jest.Mock).mockImplementation((url: string, options?: any) => {
    // User profile API
    if (url.includes('/api/users/testuser')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ user: mockUser }),
      })
    }

    // Privacy settings API
    if (url.includes('/api/privacy/user-1')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ privacySettings: mockPrivacySettings }),
      })
    }

    // Posts API
    if (url.includes('/api/posts') && url.includes('authorId=user-1')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ posts: mockPosts }),
      })
    }

    // Follow API
    if (url.includes('/api/users/user-1/follow')) {
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, isFollowing: true }),
        })
      }
      if (options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, isFollowing: false }),
        })
      }
      // GET follow status
      return Promise.resolve({
        ok: true,
        json: async () => ({ isFollowing: false }),
      })
    }

    // Followers count API
    if (url.includes('/api/users/user-1/followers')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ totalCount: 100 }),
      })
    }

    // Following count API
    if (url.includes('/api/users/user-1/following')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ totalCount: 50 }),
      })
    }

    // Block API
    if (url.includes('/api/users/user-1/block')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
      })
    }

    // Report API
    if (url.includes('/api/users/user-1/report')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
      })
    }

    // Post like API
    if (url.includes('/api/posts/') && url.includes('/like')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, isLiked: true }),
      })
    }

    // Default fallback
    return Promise.reject(new Error(`Unhandled request: ${url}`))
  })
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={null}>
      {children}
    </SessionProvider>
  )
}

describe('Profile Page Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupMockFetch()
  })

  describe('Profile Loading and Display', () => {
    it('loads and displays user profile with all information', async () => {
      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      // Wait for profile to load
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })

      // Check user information
      expect(screen.getByText('@testuser')).toBeInTheDocument()
      expect(screen.getByText('This is a test bio')).toBeInTheDocument()
      expect(screen.getByText('INTJ')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument() // Posts count
      expect(screen.getByText('100')).toBeInTheDocument() // Followers count
      expect(screen.getByText('50')).toBeInTheDocument() // Following count

      // Check posts are loaded
      await waitFor(() => {
        expect(screen.getByText('Test Post 1')).toBeInTheDocument()
        expect(screen.getByText('Test Post 2')).toBeInTheDocument()
      })
    })

    it('handles privacy settings correctly', async () => {
      // Mock private profile
      ;(fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('/api/privacy/user-1')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              privacySettings: {
                ...mockPrivacySettings,
                profileVisibility: 'PRIVATE',
                showMBTI: false,
                showFollowerCount: false,
                showBio: false,
              },
            }),
          })
        }
        return setupMockFetch()(url)
      })

      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })

      // Check that private information is hidden
      expect(screen.queryByText('INTJ')).not.toBeInTheDocument()
      expect(screen.queryByText('This is a test bio')).not.toBeInTheDocument()
      expect(screen.queryByText('Followers')).not.toBeInTheDocument()
    })
  })

  describe('Follow Interactions', () => {
    it('handles follow/unfollow workflow', async () => {
      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      // Wait for profile to load
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })

      // Find and click follow button
      const followButton = await screen.findByRole('button', { name: /follow/i })
      fireEvent.click(followButton)

      // Check follow API was called
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/users/user-1/follow',
          expect.objectContaining({ method: 'POST' })
        )
        expect(toast.success).toHaveBeenCalledWith('Following successfully')
      })

      // Button should change to "Following"
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument()
      })

      // Click unfollow
      const unfollowButton = screen.getByRole('button', { name: /following/i })
      fireEvent.click(unfollowButton)

      // Check unfollow API was called
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/users/user-1/follow',
          expect.objectContaining({ method: 'DELETE' })
        )
        expect(toast.success).toHaveBeenCalledWith('Unfollowed successfully')
      })
    })

    it('handles follow error gracefully', async () => {
      // Mock follow API to fail
      ;(fetch as jest.Mock).mockImplementation((url: string, options?: any) => {
        if (url.includes('/api/users/user-1/follow') && options?.method === 'POST') {
          return Promise.reject(new Error('Network error'))
        }
        return setupMockFetch()(url, options)
      })

      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })

      const followButton = await screen.findByRole('button', { name: /follow/i })
      fireEvent.click(followButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Network error')
      })

      // Button should remain as "Follow"
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument()
    })
  })

  describe('Post Interactions', () => {
    it('handles post like interaction', async () => {
      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      // Wait for posts to load
      await waitFor(() => {
        expect(screen.getByText('Test Post 1')).toBeInTheDocument()
      })

      // Find and click like button on first post
      const likeButtons = screen.getAllByRole('button', { name: /like/i })
      fireEvent.click(likeButtons[0])

      // Check like API was called
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/posts/post-1/like',
          expect.objectContaining({ method: 'POST' })
        )
      })
    })

    it('handles post comment interaction', async () => {
      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Post 1')).toBeInTheDocument()
      })

      // Find and click comment button
      const commentButtons = screen.getAllByRole('button', { name: /comment/i })
      fireEvent.click(commentButtons[0])

      // Comment form should appear
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument()
      })
    })
  })

  describe('User Actions', () => {
    it('handles share profile action', async () => {
      // Mock Web Share API
      const mockShare = jest.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { share: mockShare })

      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })

      // Open more menu
      const moreButton = screen.getByRole('button', { name: /more/i })
      fireEvent.click(moreButton)

      // Click share
      const shareButton = screen.getByText('Share Profile')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: "Test User's Profile",
          text: "Check out Test User's profile on our platform",
          url: expect.stringContaining('/profile/testuser'),
        })
        expect(toast.success).toHaveBeenCalledWith('Profile shared successfully')
      })
    })

    it('handles block user action', async () => {
      // Mock window.confirm
      ;(window.confirm as jest.Mock) = jest.fn().mockReturnValue(true)

      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })

      // Open more menu
      const moreButton = screen.getByRole('button', { name: /more/i })
      fireEvent.click(moreButton)

      // Click block
      const blockButton = screen.getByText('Block User')
      fireEvent.click(blockButton)

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith(
          expect.stringContaining('Are you sure you want to block @testuser?')
        )
        expect(fetch).toHaveBeenCalledWith(
          '/api/users/user-1/block',
          expect.objectContaining({ method: 'POST' })
        )
        expect(toast.success).toHaveBeenCalledWith('@testuser has been blocked')
      })
    })

    it('handles report user action', async () => {
      // Mock window.prompt
      ;(window.prompt as jest.Mock) = jest.fn().mockReturnValue('Spam content')

      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })

      // Open more menu
      const moreButton = screen.getByRole('button', { name: /more/i })
      fireEvent.click(moreButton)

      // Click report
      const reportButton = screen.getByText('Report User')
      fireEvent.click(reportButton)

      await waitFor(() => {
        expect(window.prompt).toHaveBeenCalledWith(
          expect.stringContaining('Why are you reporting @testuser?')
        )
        expect(fetch).toHaveBeenCalledWith(
          '/api/users/user-1/report',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              reason: 'inappropriate_behavior',
              description: 'Spam content',
            }),
          })
        )
        expect(toast.success).toHaveBeenCalledWith('Report submitted for @testuser')
      })
    })
  })

  describe('Error Handling', () => {
    it('handles user not found error', async () => {
      ;(fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('/api/users/testuser')) {
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ error: 'User not found' }),
          })
        }
        return setupMockFetch()(url)
      })

      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('User not found')).toBeInTheDocument()
      })
    })

    it('handles network errors gracefully', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/error loading profile/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading states during data fetching', async () => {
      // Mock slow API response
      ;(fetch as jest.Mock).mockImplementation((url: string) => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(setupMockFetch()(url))
          }, 100)
        })
      })

      render(
        <TestWrapper>
          <ProfilePage params={{ username: 'testuser' }} />
        </TestWrapper>
      )

      // Check loading states
      expect(screen.getByTestId('profile-loading') || document.querySelector('.animate-pulse')).toBeInTheDocument()

      // Wait for content to load
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })
})
