# State Management and Data Fetching

This document describes the state management and data fetching architecture implemented in the community platform.

## Overview

The application uses a combination of:
- **Zustand** for client-side state management
- **SWR** for server state caching and data fetching
- **Custom hooks** for common data operations
- **Optimistic updates** for better user experience

## Architecture

### Stores (Zustand)

#### UI Store (`src/stores/ui-store.ts`)
Manages global UI state including:
- Sidebar and modal states
- Loading states
- Toast notifications
- Search state

```typescript
const { sidebarOpen, setSidebarOpen, addToast } = useUIStore()
```

#### User Store (`src/stores/user-store.ts`)
Manages user-related state:
- Current user information
- Authentication state
- User preferences
- Following/blocking relationships

```typescript
const { currentUser, followUser, updatePreferences } = useUserStore()
```

#### Feed Store (`src/stores/feed-store.ts`)
Manages feed and post-related state:
- Posts data
- Feed filters and sorting
- Post interactions (likes, bookmarks)
- Optimistic updates

```typescript
const { posts, toggleLike, setFeedType } = useFeedStore()
```

### Data Fetching Hooks

#### Posts Hooks (`src/hooks/use-posts.ts`)
- `usePosts()` - Fetch posts with filtering and pagination
- `usePost(id)` - Fetch single post
- `useCreatePost()` - Create posts with optimistic updates
- `useUpdatePost(id)` - Update posts
- `useDeletePost()` - Delete posts
- `useLikePost()` - Toggle likes with optimistic updates

#### User Hooks (`src/hooks/use-users.ts`)
- `useCurrentUser()` - Fetch current user profile
- `useUser(username)` - Fetch user by username
- `useUpdateProfile()` - Update user profile
- `useFollowUser()` - Follow/unfollow with optimistic updates
- `useUserFollowers(id)` - Fetch user followers
- `useUserFollowing(id)` - Fetch user following
- `useSearchUsers(query)` - Search users

#### Comment Hooks (`src/hooks/use-comments.ts`)
- `usePostComments(postId)` - Fetch post comments
- `useCreateComment(postId)` - Create comments with optimistic updates
- `useUpdateComment(id)` - Update comments
- `useDeleteComment()` - Delete comments

#### Notification Hooks (`src/hooks/use-notifications.ts`)
- `useNotifications()` - Fetch notifications with real-time updates
- `useMarkNotificationAsRead()` - Mark notifications as read
- `useMarkAllNotificationsAsRead()` - Mark all as read
- `useDeleteNotification()` - Delete notifications
- `useRealtimeNotifications()` - Real-time notification polling

#### Generic API Hook (`src/hooks/use-api.ts`)
- `useAPI(key, fetcher, options)` - Generic data fetching
- `useAPIMutation(mutationFn, options)` - Generic mutations
- `useInfiniteAPI(getKey, fetcher)` - Infinite loading/pagination
- `useOptimisticUpdate(key, updateFn)` - Optimistic updates
- `usePrefetch()` - Data prefetching
- `useLoadingState()` - Loading state management

## Usage Examples

### Basic Data Fetching

```typescript
import { usePosts } from '@/hooks/use-posts'

function FeedComponent() {
  const { posts, isLoading, error, mutate } = usePosts({
    type: 'following',
    sort: 'recent'
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}
```

### Optimistic Updates

```typescript
import { useCreatePost, useLikePost } from '@/hooks/use-posts'

function PostActions({ postId }) {
  const { createPost, isCreating } = useCreatePost()
  const { toggleLike, isToggling } = useLikePost()

  const handleCreatePost = async (content: string) => {
    // Optimistic update happens automatically
    await createPost(content)
  }

  const handleLike = async () => {
    // Optimistic update happens automatically
    await toggleLike(postId)
  }

  return (
    <div>
      <button onClick={handleLike} disabled={isToggling}>
        {isToggling ? 'Updating...' : 'Like'}
      </button>
    </div>
  )
}
```

### State Management

```typescript
import { useUIStore } from '@/stores/ui-store'
import { useFeedStore } from '@/stores/feed-store'

function FeedControls() {
  const { addToast } = useUIStore()
  const { feedType, setFeedType, setSortBy } = useFeedStore()

  const handleFilterChange = (type: string) => {
    setFeedType(type)
    addToast({
      type: 'info',
      title: `Switched to ${type} feed`
    })
  }

  return (
    <div>
      <select value={feedType} onChange={(e) => handleFilterChange(e.target.value)}>
        <option value="following">Following</option>
        <option value="discover">Discover</option>
        <option value="trending">Trending</option>
      </select>
    </div>
  )
}
```

### Toast Notifications

```typescript
import { useUIStore } from '@/stores/ui-store'

function SomeComponent() {
  const { addToast } = useUIStore()

  const handleAction = async () => {
    try {
      await someAsyncAction()
      addToast({
        type: 'success',
        title: 'Action completed',
        description: 'Your action was successful'
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Action failed',
        description: error.message
      })
    }
  }

  return <button onClick={handleAction}>Perform Action</button>
}
```

## Error Handling

All hooks include automatic error handling with toast notifications. You can also provide custom error handlers:

```typescript
const { posts, error } = usePosts({
  type: 'following'
}, {
  onError: (error) => {
    console.error('Custom error handling:', error)
    // Custom error handling logic
  }
})
```

## Caching Strategy

SWR provides automatic caching with the following configuration:
- **Revalidate on focus**: Disabled by default
- **Revalidate on reconnect**: Enabled
- **Error retry**: 3 attempts with exponential backoff
- **Stale while revalidate**: Fresh data in background

## Performance Optimizations

1. **Optimistic Updates**: Immediate UI feedback for user actions
2. **Data Prefetching**: Preload data for better UX
3. **Infinite Loading**: Efficient pagination
4. **Selective Revalidation**: Only update when necessary
5. **Store Persistence**: User preferences and state persist across sessions

## Setup

The state management system is automatically initialized in the app layout:

```typescript
// src/app/layout.tsx
import { StoreProvider } from '@/components/providers/store-provider'

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <StoreProvider>
        {children}
      </StoreProvider>
    </SessionProvider>
  )
}
```

## Best Practices

1. **Use hooks for data fetching** instead of direct API calls
2. **Leverage optimistic updates** for better UX
3. **Handle loading and error states** consistently
4. **Use stores for global state** only
5. **Keep component state local** when possible
6. **Implement proper error boundaries**
7. **Use TypeScript** for type safety

## Testing

Mock the hooks in your tests:

```typescript
import { usePosts } from '@/hooks/use-posts'

jest.mock('@/hooks/use-posts')
const mockUsePosts = usePosts as jest.MockedFunction<typeof usePosts>

test('renders posts', () => {
  mockUsePosts.mockReturnValue({
    posts: mockPosts,
    isLoading: false,
    error: null,
    mutate: jest.fn()
  })

  render(<FeedComponent />)
  // Test assertions
})
```