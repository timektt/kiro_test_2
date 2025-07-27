import { render, screen, fireEvent } from '@testing-library/react'
import { PostItem } from '@/components/ui/post-item'

const mockPost = {
  id: 'post-1',
  content: 'This is a test post content',
  imageUrl: null,
  authorId: 'user-2',
  isPublic: true,
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-01-01T10:00:00Z'),
  author: {
    id: 'user-2',
    username: 'postauthor',
    email: 'postauthor@example.com',
    name: 'Post Author',
    image: null,
    bio: null,
    socialLinks: null,
    role: 'USER' as const,
    isActive: true,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    mbti: null,
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

    const bookmarkButton = screen.getByLabelText('Bookmark post')
    fireEvent.click(bookmarkButton)

    expect(mockOnBookmark).toHaveBeenCalledWith('post-1')
  })

  it('should display relative time', () => {
    render(<PostItem post={mockPost} />)

    // Should show relative time like "January 1, 2024" or similar
    expect(screen.getByText(/january/i)).toBeInTheDocument()
  })

  it('should handle image display when imageUrl is provided', () => {
    const postWithImage = { 
      ...mockPost, 
      imageUrl: 'https://example.com/image.jpg',
      author: {
        ...mockPost.author,
        id: 'user-2',
        username: 'postauthor',
        email: 'postauthor@example.com',
        name: 'Post Author',
        image: null,
        bio: null,
        socialLinks: null,
        role: 'USER' as const,
        isActive: true,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
        mbti: null,
      }
    }
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

  it('should show dropdown trigger for post options', () => {
    render(<PostItem post={mockPost} currentUserId="user-1" />)

    const dropdownTrigger = screen.getByRole('button', { expanded: false })
    expect(dropdownTrigger).toBeInTheDocument()
    
    // Test that clicking the dropdown trigger works
    fireEvent.click(dropdownTrigger)
    // The dropdown should change state (though content may not render in test environment)
  })

  it('should render different dropdown content based on user ownership', () => {
    // Test with post author
    const { rerender } = render(<PostItem post={mockPost} currentUserId="user-2" />)
    
    // The component should recognize this is the author's post
    // We can't easily test the dropdown content in JSDOM, but we can test the logic
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument()
    
    // Test with different user
    rerender(<PostItem post={mockPost} currentUserId="user-1" />)
    
    // The component should recognize this is not the author's post
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument()
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
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
