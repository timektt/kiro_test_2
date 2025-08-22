import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { FollowButton } from '@/components/ui/follow-button'
import useSWR from 'swr'

// Mock dependencies
jest.mock('next-auth/react')
jest.mock('swr')

const mockSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
  },
}

describe('FollowButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('should not render when user is not authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: null, 
      status: 'unauthenticated',
      update: jest.fn()
    })

    const { container } = render(<FollowButton userId="user-2" />)
    expect(container.firstChild).toBeNull()
  })

  it('should not render when userId is same as current user', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })

    const { container } = render(<FollowButton userId="user-1" />)
    expect(container.firstChild).toBeNull()
  })

  it('should render follow button when not following', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: false, followedAt: null },
      error: null,
      mutate: jest.fn(),
    })

    render(<FollowButton userId="user-2" />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Follow')
    expect(screen.getByTestId('user-plus-icon')).toBeInTheDocument()
  })

  it('should render following button when already following', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: true, followedAt: new Date() },
      error: null,
      mutate: jest.fn(),
    })

    render(<FollowButton userId="user-2" />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Following')
    expect(screen.getByTestId('user-minus-icon')).toBeInTheDocument()
  })

  it('should show unfollow text on hover when following', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: true, followedAt: new Date() },
      error: null,
      mutate: jest.fn(),
    })

    render(<FollowButton userId="user-2" username="targetuser" />)

    const button = screen.getByRole('button')
    fireEvent.mouseEnter(button)
    
    expect(screen.getByText('Unfollow targetuser')).toBeInTheDocument()
  })

  it('should handle follow action', async () => {
    const mockMutate = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: false, followedAt: null },
      error: null,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<FollowButton userId="user-2" />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button).toHaveTextContent('Following...')
    expect(button).toBeDisabled()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users/user-2/follow', {
        method: 'POST',
      })
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should handle unfollow action', async () => {
    const mockMutate = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: true, followedAt: new Date() },
      error: null,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<FollowButton userId="user-2" />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button).toHaveTextContent('Unfollowing...')
    expect(button).toBeDisabled()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users/user-2/follow', {
        method: 'DELETE',
      })
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should handle follow error and revert optimistic update', async () => {
    const mockOnFollowChange = jest.fn()
    const mockMutate = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: false, followedAt: null },
      error: null,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<FollowButton userId="user-2" onFollowChange={mockOnFollowChange} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should call onFollowChange with optimistic update
    expect(mockOnFollowChange).toHaveBeenCalledWith(true)

    await waitFor(() => {
      // Should revert the optimistic update on error
      expect(mockOnFollowChange).toHaveBeenCalledWith(false)
    })
  })

  it('should show error state when SWR has error', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: new Error('Failed to fetch'),
      mutate: jest.fn(),
    })

    render(<FollowButton userId="user-2" />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Error')
    expect(button).toBeDisabled()
  })

  it('should render without icon when showIcon is false', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: false, followedAt: null },
      error: null,
      mutate: jest.fn(),
    })

    render(<FollowButton userId="user-2" showIcon={false} />)

    expect(screen.queryByTestId('user-plus-icon')).not.toBeInTheDocument()
    expect(screen.getByText('Follow')).toBeInTheDocument()
  })

  it('should apply custom variant and size', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: false, followedAt: null },
      error: null,
      mutate: jest.fn(),
    })

    render(<FollowButton userId="user-2" variant="outline" size="sm" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('variant-outline', 'size-sm')
  })

  it('should call onFollowChange callback', async () => {
    const mockOnFollowChange = jest.fn()
    const mockMutate = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: false, followedAt: null },
      error: null,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<FollowButton userId="user-2" onFollowChange={mockOnFollowChange} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnFollowChange).toHaveBeenCalledWith(true)
  })

  it('should handle optimistic updates correctly', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: false, followedAt: null },
      error: null,
      mutate: jest.fn(),
    })

    const { rerender } = render(<FollowButton userId="user-2" />)

    // Initially should show Follow
    expect(screen.getByText('Follow')).toBeInTheDocument()

    // Click to follow
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should show optimistic Following state
    expect(screen.getByText('Following...')).toBeInTheDocument()

    // Simulate SWR data update
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { isFollowing: true, followedAt: new Date() },
      error: null,
      mutate: jest.fn(),
    })

    rerender(<FollowButton userId="user-2" />)

    // Should show Following state
    expect(screen.getByText('Following')).toBeInTheDocument()
  })
})

