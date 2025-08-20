import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'

// Mock all the hooks and stores
jest.mock('@/hooks/use-posts', () => ({
  usePosts: jest.fn(),
  useCreatePost: jest.fn(),
  useLikePost: jest.fn(),
}))

jest.mock('@/hooks/use-load-more-posts', () => ({
  useLoadMorePosts: jest.fn(),
}))

jest.mock('@/stores/feed-store', () => ({
  useFeedStore: jest.fn(),
}))

jest.mock('@/stores/ui-store', () => ({
  useUIStore: jest.fn(),
}))

jest.mock('@/stores/user-store', () => ({
  useUserStore: jest.fn(),
}))

jest.mock('@/hooks/use-infinite-scroll', () => ({
  useInfiniteScroll: jest.fn(),
}))

jest.mock('@/hooks/use-debounce', () => ({
  useDebounce: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock react-window
jest.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount, itemSize }: any) => {
    const items = []
    for (let i = 0; i < itemCount; i++) {
      items.push(
        <div key={i} style={{ height: itemSize }}>
          {children({ index: i, style: { height: itemSize } })}
        </div>
      )
    }
    return <div data-testid="virtual-list">{items}</div>
  },
}))

// Simple test component that uses load more functionality
const LoadMoreTestComponent = () => {
  const [posts, setPosts] = React.useState([
    { id: '1', content: 'Post 1', author: { username: 'user1' } },
    { id: '2', content: 'Post 2', author: { username: 'user2' } },
  ])
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)

  const loadMore = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100))
    const newPosts = [
      { id: '3', content: 'Post 3', author: { username: 'user3' } },
      { id: '4', content: 'Post 4', author: { username: 'user4' } },
    ]
    setPosts(prev => [...prev, ...newPosts])
    setIsLoading(false)
    setHasMore(false)
  }

  return (
    <div>
      <div data-testid="posts-container">
        {posts.map(post => (
          <div key={post.id} data-testid={`post-${post.id}`}>
            <h3>{post.content}</h3>
            <p>By: {post.author.username}</p>
          </div>
        ))}
      </div>
      {isLoading && <div data-testid="loading">Loading...</div>}
      {hasMore && !isLoading && (
        <button 
          data-testid="load-more-button" 
          onClick={loadMore}
        >
          Load More
        </button>
      )}
      {!hasMore && <div data-testid="no-more-posts">No more posts</div>}
    </div>
  )
}

describe('Load More Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should render initial posts', () => {
    render(<LoadMoreTestComponent />)
    
    expect(screen.getByTestId('post-1')).toBeInTheDocument()
    expect(screen.getByTestId('post-2')).toBeInTheDocument()
    expect(screen.getByText('Post 1')).toBeInTheDocument()
    expect(screen.getByText('Post 2')).toBeInTheDocument()
  })

  test('should show load more button when there are more posts', () => {
    render(<LoadMoreTestComponent />)
    
    expect(screen.getByTestId('load-more-button')).toBeInTheDocument()
    expect(screen.getByText('Load More')).toBeInTheDocument()
  })

  test('should show loading state when loading more posts', async () => {
    render(<LoadMoreTestComponent />)
    
    const loadMoreButton = screen.getByTestId('load-more-button')
    fireEvent.click(loadMoreButton)
    
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('should load more posts when load more button is clicked', async () => {
    render(<LoadMoreTestComponent />)
    
    const loadMoreButton = screen.getByTestId('load-more-button')
    fireEvent.click(loadMoreButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('post-3')).toBeInTheDocument()
      expect(screen.getByTestId('post-4')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Post 3')).toBeInTheDocument()
    expect(screen.getByText('Post 4')).toBeInTheDocument()
  })

  test('should hide load more button when no more posts available', async () => {
    render(<LoadMoreTestComponent />)
    
    const loadMoreButton = screen.getByTestId('load-more-button')
    fireEvent.click(loadMoreButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('no-more-posts')).toBeInTheDocument()
    })
    
    expect(screen.queryByTestId('load-more-button')).not.toBeInTheDocument()
    expect(screen.getByText('No more posts')).toBeInTheDocument()
  })

  test('should not show loading when not loading', () => {
    render(<LoadMoreTestComponent />)
    
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })
})
