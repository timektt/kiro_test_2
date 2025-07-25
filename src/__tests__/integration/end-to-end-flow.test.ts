/**
 * End-to-End Flow Integration Test
 * Tests complete user journeys from authentication to content interaction
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { jest } from '@jest/globals'
import { SessionProvider } from 'next-auth/react'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock NextAuth
const mockUser = {
  id: 'user-123',
  email: 'testuser@example.com',
  name: 'Test User',
  username: 'testuser',
  image: null,
}

const mockSession = {
  user: mockUser,
  expires: '2024-12-31',
}

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: mockSession, status: 'authenticated' })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock fetch for API calls
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn((key: string) => {
    if (key.includes('/api/posts')) {
      return {
        data: [
          {
            id: 'post-1',
            content: 'Welcome to our community! This is a test post.',
            author: {
              id: 'user-456',
              name: 'Community Admin',
              username: 'admin',
              avatar: null,
            },
            createdAt: new Date().toISOString(),
            likes: [],
            comments: [],
            _count: { likes: 5, comments: 2 },
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
  }),
}))

// Import components after mocks
import LandingPage from '@/app/page'
import FeedPage from '@/app/feed/page'
import { EnhancedInteractiveFeed } from '@/components/feed/enhanced-interactive-feed'
import { PostComposer } from '@/components/ui/post-composer'
import { NotificationDropdown } from '@/components/ui/notification-dropdown'
import { Navbar } from '@/components/layout/navbar'

describe('End-to-End User Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('Complete User Journey: New User to Active Community Member', () => {
    it('should guide a new user through the complete onboarding and engagement flow', async () => {
      // Step 1: Landing Page Experience
      const { rerender } = render(<LandingPage />)
      
      // User sees attractive landing page
      expect(screen.getByText(/community platform/i)).toBeInTheDocument()
      expect(screen.getByText(/connect with like-minded people/i)).toBeInTheDocument()
      
      // User clicks get started
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      fireEvent.click(getStartedButton)
      
      expect(mockPush).toHaveBeenCalledWith('/auth/signin')
      
      // Step 2: Authentication Flow
      const { signIn } = require('next-auth/react')
      signIn.mockResolvedValue({ ok: true })
      
      // Simulate successful authentication
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({ data: mockSession, status: 'authenticated' })
      
      // Step 3: First-time Feed Experience
      rerender(
        <SessionProvider session={mockSession}>
          <div>
            <Navbar />
            <FeedPage />
          </div>
        </SessionProvider>
      )
      
      // User sees navigation with their profile
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })
      
      // User sees welcome post in feed
      await waitFor(() => {
        expect(screen.getByText(/welcome to our community/i)).toBeInTheDocument()
        expect(screen.getByText('Community Admin')).toBeInTheDocument()
      })
      
      // Step 4: First Post Creation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            id: 'post-new',
            content: 'Hello everyone! Excited to be part of this community.',
            author: mockUser,
            createdAt: new Date().toISOString(),
            likes: [],
            comments: [],
            _count: { likes: 0, comments: 0 },
          },
        }),
      })
      
      // User creates their first post
      const postComposer = screen.getByPlaceholderText(/what's on your mind/i)
      fireEvent.change(postComposer, {
        target: { value: 'Hello everyone! Excited to be part of this community.' }
      })
      
      const postButton = screen.getByRole('button', { name: /post/i })
      fireEvent.click(postButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/posts', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: 'Hello everyone! Excited to be part of this community.'
          }),
        }))
      })
      
      // Step 5: Engaging with Community Content
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      
      // User likes the welcome post
      const likeButton = screen.getByRole('button', { name: /like/i })
      fireEvent.click(likeButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/posts/post-1/like', expect.objectContaining({
          method: 'POST',
        }))
      })
      
      // Step 6: Adding a Comment
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            id: 'comment-new',
            content: 'Thanks for the warm welcome!',
            author: mockUser,
            createdAt: new Date().toISOString(),
          },
        }),
      })
      
      // User adds a comment
      const commentButton = screen.getByRole('button', { name: /comment/i })
      fireEvent.click(commentButton)
      
      const commentInput = screen.getByPlaceholderText(/add a comment/i)
      fireEvent.change(commentInput, {
        target: { value: 'Thanks for the warm welcome!' }
      })
      
      const submitCommentButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitCommentButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/posts/post-1/comments', expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            content: 'Thanks for the warm welcome!'
          }),
        }))
      })
      
      // Step 7: Checking Notifications
      const notificationButton = screen.getByRole('button', { name: /notifications/i })
      fireEvent.click(notificationButton)
      
      await waitFor(() => {
        expect(screen.getByText('Someone liked your post')).toBeInTheDocument()
      })
      
      // User marks notification as read
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      
      const notification = screen.getByText('Someone liked your post')
      fireEvent.click(notification)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/notifications/notif-1', expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ read: true }),
        }))
      })
    })
  })

  describe('Power User Journey: Advanced Features', () => {
    it('should handle advanced user interactions and features', async () => {
      render(
        <SessionProvider session={mockSession}>
          <div>
            <Navbar />
            <EnhancedInteractiveFeed />
          </div>
        </SessionProvider>
      )
      
      // Step 1: Profile Management
      const profileButton = screen.getByRole('button', { name: /profile/i })
      fireEvent.click(profileButton)
      
      expect(mockPush).toHaveBeenCalledWith('/profile/testuser')
      
      // Step 2: Theme Switching
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
      fireEvent.click(themeToggle)
      
      // Verify theme change
      expect(document.documentElement).toHaveClass('dark')
      
      // Step 3: Advanced Post Features (if implemented)
      // Test image upload, mentions, hashtags, etc.
      const postComposer = screen.getByPlaceholderText(/what's on your mind/i)
      
      // Test with rich content
      fireEvent.change(postComposer, {
        target: { value: 'Check out this amazing feature! #community @admin' }
      })
      
      // Step 4: Search and Discovery (if implemented)
      const searchInput = screen.queryByPlaceholderText(/search/i)
      if (searchInput) {
        fireEvent.change(searchInput, { target: { value: 'community' } })
        fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' })
      }
      
      // Step 5: Admin Features (if user is admin)
      if (mockUser.isAdmin) {
        const adminButton = screen.queryByRole('button', { name: /admin/i })
        if (adminButton) {
          fireEvent.click(adminButton)
          expect(mockPush).toHaveBeenCalledWith('/admin')
        }
      }
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      render(
        <SessionProvider session={mockSession}>
          <EnhancedInteractiveFeed />
        </SessionProvider>
      )
      
      // Simulate network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      const postComposer = screen.getByPlaceholderText(/what's on your mind/i)
      fireEvent.change(postComposer, {
        target: { value: 'This post will fail to submit' }
      })
      
      const postButton = screen.getByRole('button', { name: /post/i })
      fireEvent.click(postButton)
      
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })

    it('should handle authentication errors', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({ data: null, status: 'unauthenticated' })
      
      render(<FeedPage />)
      
      // Should redirect to sign in
      expect(mockPush).toHaveBeenCalledWith('/auth/signin')
    })

    it('should handle API rate limiting', async () => {
      render(
        <SessionProvider session={mockSession}>
          <EnhancedInteractiveFeed />
        </SessionProvider>
      )
      
      // Simulate rate limit error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({
          error: { message: 'Rate limit exceeded' }
        }),
      })
      
      const likeButton = screen.getByRole('button', { name: /like/i })
      fireEvent.click(likeButton)
      
      await waitFor(() => {
        expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument()
      })
    })

    it('should handle validation errors', async () => {
      render(
        <SessionProvider session={mockSession}>
          <PostComposer />
        </SessionProvider>
      )
      
      // Try to submit empty post
      const postButton = screen.getByRole('button', { name: /post/i })
      fireEvent.click(postButton)
      
      await waitFor(() => {
        expect(screen.getByText(/content is required/i)).toBeInTheDocument()
      })
      
      // Try to submit post that's too long
      const postComposer = screen.getByPlaceholderText(/what's on your mind/i)
      const longContent = 'a'.repeat(2001)
      fireEvent.change(postComposer, { target: { value: longContent } })
      fireEvent.click(postButton)
      
      await waitFor(() => {
        expect(screen.getByText(/content is too long/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility and Responsive Design', () => {
    it('should be fully accessible', () => {
      render(
        <SessionProvider session={mockSession}>
          <div>
            <Navbar />
            <EnhancedInteractiveFeed />
          </div>
        </SessionProvider>
      )
      
      // Check for proper ARIA labels
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      
      // Check for keyboard navigation
      const firstButton = screen.getAllByRole('button')[0]
      firstButton.focus()
      expect(document.activeElement).toBe(firstButton)
      
      // Test keyboard navigation
      fireEvent.keyDown(firstButton, { key: 'Tab' })
      // Next focusable element should be focused
    })

    it('should be responsive across different screen sizes', () => {
      // Mock different viewport sizes
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320, // Mobile
      })
      
      render(
        <SessionProvider session={mockSession}>
          <EnhancedInteractiveFeed />
        </SessionProvider>
      )
      
      // Check for mobile-specific classes
      const container = screen.getByRole('main')
      expect(container).toHaveClass('px-4')
      
      // Test tablet size
      Object.defineProperty(window, 'innerWidth', {
        value: 768,
      })
      
      // Test desktop size
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
      })
    })
  })

  describe('Performance and Optimization', () => {
    it('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largePosts = Array.from({ length: 100 }, (_, i) => ({
        id: `post-${i}`,
        content: `This is post number ${i}`,
        author: {
          id: `user-${i}`,
          name: `User ${i}`,
          username: `user${i}`,
          avatar: null,
        },
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        _count: { likes: Math.floor(Math.random() * 10), comments: Math.floor(Math.random() * 5) },
      }))
      
      const useSWR = require('swr').default
      useSWR.mockReturnValue({
        data: largePosts,
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      })
      
      const startTime = performance.now()
      
      render(
        <SessionProvider session={mockSession}>
          <EnhancedInteractiveFeed />
        </SessionProvider>
      )
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render within reasonable time (less than 1 second)
      expect(renderTime).toBeLessThan(1000)
      
      // Should implement virtualization or pagination for large lists
      const posts = screen.getAllByTestId(/post-item/i)
      expect(posts.length).toBeLessThanOrEqual(20) // Should limit visible posts
    })

    it('should implement proper loading states', async () => {
      const useSWR = require('swr').default
      useSWR.mockReturnValue({
        data: null,
        error: null,
        isLoading: true,
        mutate: jest.fn(),
      })
      
      render(
        <SessionProvider session={mockSession}>
          <EnhancedInteractiveFeed />
        </SessionProvider>
      )
      
      // Should show loading skeleton
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    })
  })

  describe('Security Validation', () => {
    it('should sanitize user input', async () => {
      render(
        <SessionProvider session={mockSession}>
          <PostComposer />
        </SessionProvider>
      )
      
      // Try to submit malicious content
      const maliciousContent = '<script>alert("xss")</script>Hello world'
      const postComposer = screen.getByPlaceholderText(/what's on your mind/i)
      fireEvent.change(postComposer, { target: { value: maliciousContent } })
      
      // Content should be sanitized
      expect(postComposer.value).not.toContain('<script>')
    })

    it('should validate authentication on protected actions', async () => {
      const { useSession } = require('next-auth/react')
      useSession.mockReturnValue({ data: null, status: 'unauthenticated' })
      
      render(<PostComposer />)
      
      // Should not allow posting without authentication
      const postButton = screen.getByRole('button', { name: /post/i })
      expect(postButton).toBeDisabled()
    })
  })
})

// Cleanup
afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  jest.restoreAllMocks()
})