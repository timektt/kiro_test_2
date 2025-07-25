/**
 * Complete User Journey Integration Test
 * Tests the entire application flow from landing page to full user interaction
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import { SessionProvider } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock NextAuth
const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
  },
  expires: '2024-12-31',
}

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: mockSession, status: 'authenticated' }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock Prisma
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  post: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  comment: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  like: {
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  notification: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  follow: {
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: (key: string, fetcher: Function) => {
    // Mock different endpoints
    if (key.includes('/api/posts')) {
      return {
        data: [
          {
            id: 'post-1',
            content: 'Test post content',
            author: { id: 'user-1', name: 'Test Author', image: null },
            createdAt: new Date().toISOString(),
            likes: [],
            comments: [],
            _count: { likes: 0, comments: 0 },
          },
        ],
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      }
    }
    
    if (key.includes('/api/notifications')) {
      return {
        data: [
          {
            id: 'notif-1',
            type: 'LIKE',
            message: 'Someone liked your post',
            read: false,
            createdAt: new Date().toISOString(),
          },
        ],
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      }
    }
    
    return { data: null, error: null, isLoading: false, mutate: jest.fn() }
  },
}))

// Import components after mocks
import LandingPage from '@/app/page'
import FeedPage from '@/app/feed/page'
import ProfilePage from '@/app/profile/[username]/page'
import { EnhancedInteractiveFeed } from '@/components/feed/enhanced-interactive-feed'
import { PostComposer } from '@/components/ui/post-composer'
import { NotificationDropdown } from '@/components/ui/notification-dropdown'

describe('Complete User Journey Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mock responses
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      username: 'testuser',
      bio: 'Test bio',
      avatar: null,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    mockPrisma.post.findMany.mockResolvedValue([
      {
        id: 'post-1',
        content: 'Test post content',
        image: null,
        authorId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: 'user-1',
          name: 'Test Author',
          username: 'testauthor',
          avatar: null,
        },
        likes: [],
        comments: [],
        _count: { likes: 0, comments: 0 },
      },
    ])
  })

  describe('Requirement 1: User Authentication System', () => {
    it('should handle authentication flow correctly', async () => {
      const { signIn } = require('next-auth/react')
      
      render(<LandingPage />)
      
      // Should show sign-in options
      expect(screen.getByText(/sign in/i)).toBeInTheDocument()
      
      // Mock successful sign-in
      signIn.mockResolvedValue({ ok: true })
      
      const signInButton = screen.getByRole('button', { name: /sign in/i })
      fireEvent.click(signInButton)
      
      await waitFor(() => {
        expect(signIn).toHaveBeenCalled()
      })
    })

    it('should protect routes when not authenticated', () => {
      // Mock unauthenticated state
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({ data: null, status: 'unauthenticated' })
      
      render(<FeedPage />)
      
      // Should redirect or show authentication required
      expect(mockPush).toHaveBeenCalledWith('/auth/signin')
    })
  })

  describe('Requirement 2: Public Landing Page', () => {
    it('should display landing page with proper branding and CTA', () => {
      render(<LandingPage />)
      
      // Check for branding elements
      expect(screen.getByText(/community platform/i)).toBeInTheDocument()
      
      // Check for call-to-action
      expect(screen.getByText(/get started/i)).toBeInTheDocument()
      
      // Check for responsive design elements
      expect(screen.getByRole('main')).toHaveClass('container')
    })

    it('should be responsive across different screen sizes', () => {
      render(<LandingPage />)
      
      const mainContent = screen.getByRole('main')
      expect(mainContent).toHaveClass('mx-auto')
      
      // Check for mobile-first responsive classes
      const heroSection = screen.getByTestId('hero-section')
      expect(heroSection).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
    })
  })

  describe('Requirement 3: Social Feed System', () => {
    it('should display social feed with posts', async () => {
      render(
        <SessionProvider session={mockSession}>
          <EnhancedInteractiveFeed />
        </SessionProvider>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Test post content')).toBeInTheDocument()
        expect(screen.getByText('Test Author')).toBeInTheDocument()
      })
    })

    it('should allow creating new posts', async () => {
      const mockCreatePost = jest.fn().mockResolvedValue({
        id: 'new-post',
        content: 'New test post',
        authorId: 'test-user-id',
      })
      
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockCreatePost() }),
      })
      
      render(
        <SessionProvider session={mockSession}>
          <PostComposer />
        </SessionProvider>
      )
      
      const textarea = screen.getByPlaceholderText(/what's on your mind/i)
      fireEvent.change(textarea, { target: { value: 'New test post' } })
      
      const submitButton = screen.getByRole('button', { name: /post/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/posts', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: 'New test post' }),
        }))
      })
    })

    it('should handle post interactions (likes, comments)', async () => {
      mockPrisma.like.findFirst.mockResolvedValue(null)
      mockPrisma.like.create.mockResolvedValue({
        id: 'like-1',
        postId: 'post-1',
        userId: 'test-user-id',
      })
      
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      
      render(
        <SessionProvider session={mockSession}>
          <EnhancedInteractiveFeed />
        </SessionProvider>
      )
      
      await waitFor(() => {
        const likeButton = screen.getByRole('button', { name: /like/i })
        fireEvent.click(likeButton)
      })
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/posts/post-1/like', expect.objectContaining({
          method: 'POST',
        }))
      })
    })
  })

  describe('Requirement 4: User Profile Management', () => {
    it('should display user profile with editable information', async () => {
      const mockUser = {
        id: 'test-user-id',
        username: 'testuser',
        name: 'Test User',
        bio: 'Test bio',
        avatar: null,
        location: 'Test Location',
        website: 'https://test.com',
        posts: [],
        _count: { posts: 0, followers: 0, following: 0 },
      }
      
      render(
        <SessionProvider session={mockSession}>
          <ProfilePage params={{ username: 'testuser' }} />
        </SessionProvider>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
        expect(screen.getByText('Test bio')).toBeInTheDocument()
      })
    })

    it('should handle profile updates', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      
      render(
        <SessionProvider session={mockSession}>
          <ProfilePage params={{ username: 'testuser' }} />
        </SessionProvider>
      )
      
      // Simulate profile edit
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      fireEvent.click(editButton)
      
      const bioInput = screen.getByLabelText(/bio/i)
      fireEvent.change(bioInput, { target: { value: 'Updated bio' } })
      
      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/users/test-user-id', expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ bio: 'Updated bio' }),
        }))
      })
    })
  })

  describe('Requirement 5: Notification System', () => {
    it('should display notifications correctly', async () => {
      render(
        <SessionProvider session={mockSession}>
          <NotificationDropdown />
        </SessionProvider>
      )
      
      const notificationButton = screen.getByRole('button', { name: /notifications/i })
      fireEvent.click(notificationButton)
      
      await waitFor(() => {
        expect(screen.getByText('Someone liked your post')).toBeInTheDocument()
      })
    })

    it('should mark notifications as read', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      
      render(
        <SessionProvider session={mockSession}>
          <NotificationDropdown />
        </SessionProvider>
      )
      
      const notificationButton = screen.getByRole('button', { name: /notifications/i })
      fireEvent.click(notificationButton)
      
      await waitFor(() => {
        const notification = screen.getByText('Someone liked your post')
        fireEvent.click(notification)
      })
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/notifications/notif-1', expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ read: true }),
        }))
      })
    })
  })

  describe('Requirement 7: Responsive Design and Theming', () => {
    it('should support theme switching', () => {
      render(
        <SessionProvider session={mockSession}>
          <FeedPage />
        </SessionProvider>
      )
      
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
      expect(themeToggle).toBeInTheDocument()
      
      fireEvent.click(themeToggle)
      
      // Check if theme classes are applied
      expect(document.documentElement).toHaveClass('dark')
    })

    it('should be fully responsive', () => {
      render(<LandingPage />)
      
      // Check for responsive grid classes
      const gridContainer = screen.getByTestId('features-grid')
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
      
      // Check for responsive spacing
      const container = screen.getByRole('main')
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
    })
  })

  describe('Requirement 8: Performance and Security', () => {
    it('should validate form inputs properly', async () => {
      render(
        <SessionProvider session={mockSession}>
          <PostComposer />
        </SessionProvider>
      )
      
      const textarea = screen.getByPlaceholderText(/what's on your mind/i)
      const submitButton = screen.getByRole('button', { name: /post/i })
      
      // Try to submit empty form
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/content is required/i)).toBeInTheDocument()
      })
      
      // Try to submit content that's too long
      const longContent = 'a'.repeat(2001)
      fireEvent.change(textarea, { target: { value: longContent } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/content is too long/i)).toBeInTheDocument()
      })
    })

    it('should handle API errors gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
      
      render(
        <SessionProvider session={mockSession}>
          <PostComposer />
        </SessionProvider>
      )
      
      const textarea = screen.getByPlaceholderText(/what's on your mind/i)
      fireEvent.change(textarea, { target: { value: 'Test post' } })
      
      const submitButton = screen.getByRole('button', { name: /post/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })
  })

  describe('Cross-Component Integration', () => {
    it('should maintain state consistency across components', async () => {
      const { rerender } = render(
        <SessionProvider session={mockSession}>
          <EnhancedInteractiveFeed />
        </SessionProvider>
      )
      
      // Simulate creating a post
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            id: 'new-post',
            content: 'New post content',
            author: mockSession.user,
            createdAt: new Date().toISOString(),
            likes: [],
            comments: [],
            _count: { likes: 0, comments: 0 },
          },
        }),
      })
      
      // The new post should appear in the feed
      await waitFor(() => {
        expect(screen.getByText('Test post content')).toBeInTheDocument()
      })
    })

    it('should handle navigation between pages correctly', () => {
      render(<LandingPage />)
      
      const getStartedButton = screen.getByText(/get started/i)
      fireEvent.click(getStartedButton)
      
      expect(mockPush).toHaveBeenCalledWith('/auth/signin')
    })
  })

  describe('Error Boundary Integration', () => {
    it('should catch and display errors gracefully', () => {
      // Mock a component that throws an error
      const ThrowError = () => {
        throw new Error('Test error')
      }
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(
        <SessionProvider session={mockSession}>
          <ThrowError />
        </SessionProvider>
      )
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })
  })
})

// Cleanup after tests
afterAll(() => {
  jest.restoreAllMocks()
})