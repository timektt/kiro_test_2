import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PostComposer } from '@/components/ui/post-composer'

const mockUser = {
  id: 'user-1',
  name: 'Test User',
  username: 'testuser',
  image: null,
}

describe('PostComposer', () => {
  it('should not render when user is not provided', () => {
    const { container } = render(<PostComposer />)
    expect(container.firstChild).toBeNull()
  })

  it('should render post composer for authenticated user', () => {
    render(<PostComposer currentUser={mockUser} />)

    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument()
  })

  it('should handle text input', () => {
    render(<PostComposer currentUser={mockUser} />)

    const textarea = screen.getByPlaceholderText("What's on your mind?")
    fireEvent.change(textarea, { target: { value: 'Test post content' } })

    expect(textarea).toHaveValue('Test post content')
  })

  it('should disable post button when content is empty', () => {
    render(<PostComposer currentUser={mockUser} />)

    const postButton = screen.getByRole('button', { name: /post/i })
    expect(postButton).toBeDisabled()
  })

  it('should enable post button when content is provided', () => {
    render(<PostComposer currentUser={mockUser} />)

    const textarea = screen.getByPlaceholderText("What's on your mind?")
    const postButton = screen.getByRole('button', { name: /post/i })

    fireEvent.change(textarea, { target: { value: 'Test post content' } })

    expect(postButton).not.toBeDisabled()
  })

  it('should handle successful post submission', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
    render(<PostComposer currentUser={mockUser} onSubmit={mockOnSubmit} />)

    const textarea = screen.getByPlaceholderText("What's on your mind?")
    const postButton = screen.getByRole('button', { name: /post/i })

    fireEvent.change(textarea, { target: { value: 'Test post content' } })
    fireEvent.click(postButton)

    expect(postButton).toHaveTextContent('Posting...')
    expect(postButton).toBeDisabled()

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Test post content', undefined, 'public')
    })

    expect(textarea).toHaveValue('') // Should clear after successful post
  })

  it('should handle post submission error', async () => {
    const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Network error'))
    render(<PostComposer currentUser={mockUser} onSubmit={mockOnSubmit} />)

    const textarea = screen.getByPlaceholderText("What's on your mind?")
    const postButton = screen.getByRole('button', { name: /post/i })

    fireEvent.change(textarea, { target: { value: 'Test post content' } })
    fireEvent.click(postButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    expect(textarea).toHaveValue('Test post content') // Should not clear on error
  })

  it('should show character count', () => {
    render(<PostComposer currentUser={mockUser} />)

    const textarea = screen.getByPlaceholderText("What's on your mind?")
    fireEvent.change(textarea, { target: { value: 'Test content' } })

    expect(screen.getByText('12/2000')).toBeInTheDocument()
  })

  it('should handle image URL input', () => {
    render(<PostComposer currentUser={mockUser} />)

    // Click image button to show image input
    const buttons = screen.getAllByRole('button')
    const imageButton = buttons.find(btn => btn.querySelector('svg'))
    fireEvent.click(imageButton!)

    const imageInput = screen.getByPlaceholderText('Enter image URL...')
    fireEvent.change(imageInput, { target: { value: 'https://example.com/image.jpg' } })

    expect(imageInput).toHaveValue('https://example.com/image.jpg')
  })

  it('should display user info', () => {
    render(<PostComposer currentUser={mockUser} />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    render(<PostComposer currentUser={mockUser} disabled />)

    const textarea = screen.getByPlaceholderText("What's on your mind?")
    const postButton = screen.getByRole('button', { name: /post/i })

    expect(textarea).toBeDisabled()
    expect(postButton).toBeDisabled()
  })

  it('should use custom placeholder', () => {
    render(<PostComposer currentUser={mockUser} placeholder="Custom placeholder" />)

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<PostComposer currentUser={mockUser} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})