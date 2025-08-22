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

// Mock fetch
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
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
  
  mockFetch.mockImplementation((url: string | URL | Request) => {
    const urlString = url.toString()
    
    if (urlString.includes('/api/users/testuser')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      } as Response)
    }
    
    if (urlString.includes('/api/users/testuser/privacy')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ privacySettings: mockPrivacySettings }),
      } as Response)
    }
    
    if (urlString.includes('/api/users/testuser/posts')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ posts: mockPosts }),
      } as Response)
    }
    
    if (urlString.includes('/api/users/testuser/follow')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)
    }
    
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    } as Response)
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
    setupMockFetch()
    jest.clearAllMocks()
  })

  it('renders user profile information correctly', async () => {
    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    expect(screen.getByText('@testuser')).toBeInTheDocument()
    expect(screen.getByText('This is a test bio')).toBeInTheDocument()
    expect(screen.getByText('INTJ')).toBeInTheDocument()
    expect(screen.getByText('The Architect')).toBeInTheDocument()
  })

  it('displays user stats correctly', async () => {
    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument() // Posts count
    })

    expect(screen.getByText('100')).toBeInTheDocument() // Followers count
    expect(screen.getByText('50')).toBeInTheDocument() // Following count
  })

  it('renders user posts', async () => {
    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    })

    expect(screen.getByText('Test Post 2')).toBeInTheDocument()
    expect(screen.getByText('This is test post content')).toBeInTheDocument()
    expect(screen.getByText('Another test post')).toBeInTheDocument()
  })

  it('handles follow/unfollow functionality', async () => {
    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    const followButton = screen.getByRole('button', { name: /follow/i })
    fireEvent.click(followButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/testuser/follow'),
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  it('respects privacy settings', async () => {
    const privateSettings = {
      ...mockPrivacySettings,
      showMBTI: false,
      showFollowerCount: false,
      showBio: false,
    }

    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementation((url: string | URL | Request) => {
      const urlString = url.toString()
      
      if (urlString.includes('/api/users/testuser/privacy')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ privacySettings: privateSettings }),
        } as Response)
      }
      
      if (urlString.includes('/api/users/testuser')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: mockUser }),
        } as Response)
      }
      
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      } as Response)
    })

    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    // MBTI should be hidden
    expect(screen.queryByText('INTJ')).not.toBeInTheDocument()
    
    // Bio should be hidden
    expect(screen.queryByText('This is a test bio')).not.toBeInTheDocument()
  })

  it('handles loading states', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ user: mockUser }),
        } as Response), 100)
      )
    )

    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    // Should show loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('handles user not found error', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'User not found' }),
      } as Response)
    )

    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'nonexistent' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/user not found/i)).toBeInTheDocument()
    })
  })

  it('handles network errors gracefully', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockRejectedValue(new Error('Network error'))

    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('displays correct MBTI information when available', async () => {
    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('INTJ')).toBeInTheDocument()
    })

    expect(screen.getByText('The Architect')).toBeInTheDocument()
  })

  it('handles missing MBTI information', async () => {
    const userWithoutMBTI = {
      ...mockUser,
      mbti: null,
    }

    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementation((url: string | URL | Request) => {
      const urlString = url.toString()
      
      if (urlString.includes('/api/users/testuser')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: userWithoutMBTI }),
        } as Response)
      }
      
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      } as Response)
    })

    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    // MBTI should not be displayed
    expect(screen.queryByText('INTJ')).not.toBeInTheDocument()
    expect(screen.queryByText('The Architect')).not.toBeInTheDocument()
  })

  it('shows edit profile button for own profile', async () => {
    // Mock session to match the profile user
    jest.doMock('next-auth/react', () => ({
      SessionProvider: ({ children }: { children: React.ReactNode }) => children,
      useSession: () => ({
        data: {
          user: {
            id: 'user-1', // Same as mockUser.id
            name: 'Test User',
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      }),
    }))

    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument()
  })

  it('shows follow button for other users profile', async () => {
    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument()
  })

  it('handles post interactions', async () => {
    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    })

    // Check like counts are displayed
    expect(screen.getByText('5')).toBeInTheDocument() // Like count for post 1
    expect(screen.getByText('2')).toBeInTheDocument() // Comment count for post 1
  })

  it('displays join date when privacy allows', async () => {
    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    // Should show join date
    expect(screen.getByText(/joined/i)).toBeInTheDocument()
  })

  it('hides join date when privacy settings disable it', async () => {
    const privateSettings = {
      ...mockPrivacySettings,
      showJoinDate: false,
    }

    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementation((url: string | URL | Request) => {
      const urlString = url.toString()
      
      if (urlString.includes('/api/users/testuser/privacy')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ privacySettings: privateSettings }),
        } as Response)
      }
      
      if (urlString.includes('/api/users/testuser')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: mockUser }),
        } as Response)
      }
      
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      } as Response)
    })

    render(
      <TestWrapper>
        <ProfilePage params={{ username: 'testuser' }} />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    // Join date should be hidden
    expect(screen.queryByText(/joined/i)).not.toBeInTheDocument()
  })
})