import { render, screen, fireEvent } from '@testing-library/react'
import { PostItem } from '@/components/ui/post-item'

const mockPost = {
  id: 'post-1',
  content: 'This is a test post content',
  imageUrl: null,
  authorId: 'user-2',
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-01-01T10:00:00Z'),
  author: {
    id: 'user-2',
    name: 'Post Author',
    username: 'postauthor',
    image: null,
    role: 'USER' as const,
  },
  _count: {
    likes: 5,
    comments: 3,
  },
}

describe('PostItem', () => {
  it('should render post content and author info', () => {
    render(<PostItem post={mockPost} />)

    expect(screen.getByText('This is a test post content')).toBeInTheDocument()
    expect(screen.getByText('Post Author')).toBeInTheDocument()
    expect(screen.getByText('@postauthor')).toBeInTheDocument()
  })

  it('should display like and comment counts', () => {
    render(<PostItem post={mockPost} />)

    expect(screen.getByText('5')).toBeInTheDocument() // Like count
    expect(screen.getByText('3')).toBeInTheDocument() // Comment count
  })

  it('should handle like action', () => {
    const mockOnLike = jest.fn()
    render(<PostItem post={mockPost} onLike={mockOnLike} />)

    const likeButton = screen.getByText('5').closest('button')
    fireEvent.click(likeButton!)

    expect(mockOnLike).toHaveBeenCalledWith('post-1')
  })

  it('should handle comment action', () => {
    const mockOnComment = jest.fn()
    render(<PostItem post={mockPost} onComment={mockOnComment} />)

    const commentLink = screen.getByText('3').closest('a')
    expect(commentLink).toHaveAttribute('href', '/post/post-1')
  })

  it('should handle share action', () => {
    const mockOnShare = jest.fn()
    render(<PostItem post={mockPost} onShare={mockOnShare} />)

    const shareButton = screen.getByText('Share').closest('button')
    fireEvent.click(shareButton!)

    expect(mockOnShare).toHaveBeenCalledWith('post-1')
  })

  it('should handle bookmark action', () => {
    const mockOnBookmark = jest.fn()
    render(<PostItem post={mockPost} onBookmark={mockOnBookmark} />)

    const bookmarkButton = screen.getByRole('button', { name: '' }).closest('button')
    // Find the bookmark button (last button without text)
    const buttons = screen.getAllByRole('button')
    const bookmarkBtn = buttons[buttons.length - 1]
    fireEvent.click(bookmarkBtn)

    expect(mockOnBookmark).toHaveBeenCalledWith('post-1')
  })

  it('should display relative time', () => {
    render(<PostItem post={mockPost} />)

    // Should show relative time like "January 1, 2024" or similar
    expect(screen.getByText(/january/i)).toBeInTheDocument()
  })

  it('should handle image display when imageUrl is provided', () => {
    const postWithImage = { ...mockPost, imageUrl: 'https://example.com/image.jpg' }
    render(<PostItem post={postWithImage} />)

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Post image')
  })

  it('should show dropdown menu for post options', () => {
    render(<PostItem post={mockPost} currentUserId="user-1" />)

    // Find the dropdown trigger button (MoreHorizontal icon)
    const dropdownTrigger = screen.getByRole('button', { expanded: false })
    expect(dropdownTrigger).toBeInTheDocument()
  })

  it('should show delete option for post author', () => {
    render(<PostItem post={mockPost} currentUserId="user-2" />)

    const dropdownTrigger = screen.getByRole('button', { expanded: false })
    fireEvent.click(dropdownTrigger)

    expect(screen.getByText('Delete post')).toBeInTheDocument()
  })

  it('should show report option for other users', () => {
    render(<PostItem post={mockPost} currentUserId="user-1" />)

    const dropdownTrigger = screen.getByRole('button', { expanded: false })
    fireEvent.click(dropdownTrigger)

    expect(screen.getByText('Report post')).toBeInTheDocument()
  })

  it('should update like count when liked', () => {
    render(<PostItem post={mockPost} />)

    const likeButton = screen.getByText('5').closest('button')
    fireEvent.click(likeButton!)

    // Should increment to 6
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<PostItem post={mockPost} className="custom-class" />)
    
    expect(container.firstChild?.firstChild).toHaveClass('custom-class')
  })
})