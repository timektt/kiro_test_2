import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Post {
  id: string
  content: string
  imageUrl: string | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
  author: {
    id: string
    username: string
    name: string | null
    image: string | null
    mbti?: {
      type: string
    } | null
  }
  _count: {
    likes: number
    comments: number
  }
  isLiked?: boolean
  isBookmarked?: boolean
}

interface Comment {
  id: string
  content: string
  createdAt: Date
  authorId: string
  postId: string
  author: {
    id: string
    username: string
    name: string | null
    image: string | null
  }
}

interface FeedState {
  // Feed data
  posts: Post[]
  hasMore: boolean
  isLoading: boolean
  error: string | null
  
  // Feed filters
  feedType: 'following' | 'discover' | 'trending'
  sortBy: 'recent' | 'popular' | 'trending'
  mbtiFilter: string | null
  
  // Post interactions
  likedPosts: Set<string>
  bookmarkedPosts: Set<string>
  
  // Comments
  postComments: Record<string, Comment[]>
  commentCounts: Record<string, number>
  
  // Optimistic updates
  optimisticPosts: Post[]
  optimisticLikes: Record<string, boolean>
  optimisticComments: Record<string, Comment[]>
  
  // Actions
  setPosts: (posts: Post[]) => void
  addPost: (post: Post) => void
  updatePost: (postId: string, updates: Partial<Post>) => void
  removePost: (postId: string) => void
  setHasMore: (hasMore: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Feed controls
  setFeedType: (type: FeedState['feedType']) => void
  setSortBy: (sort: FeedState['sortBy']) => void
  setMbtiFilter: (mbti: string | null) => void
  
  // Post interactions
  toggleLike: (postId: string) => void
  toggleBookmark: (postId: string) => void
  
  // Comments
  setPostComments: (postId: string, comments: Comment[]) => void
  addComment: (postId: string, comment: Comment) => void
  updateCommentCount: (postId: string, count: number) => void
  
  // Optimistic updates
  addOptimisticPost: (post: Post) => void
  removeOptimisticPost: (postId: string) => void
  setOptimisticLike: (postId: string, liked: boolean) => void
  addOptimisticComment: (postId: string, comment: Comment) => void
  
  // Utility
  clearFeed: () => void
  refreshFeed: () => void
}

export const useFeedStore = create<FeedState>()(
  devtools(
    (set, get) => ({
      // Initial state
      posts: [],
      hasMore: true,
      isLoading: false,
      error: null,
      feedType: 'following',
      sortBy: 'recent',
      mbtiFilter: null,
      likedPosts: new Set(),
      bookmarkedPosts: new Set(),
      postComments: {},
      commentCounts: {},
      optimisticPosts: [],
      optimisticLikes: {},
      optimisticComments: {},

      // Actions
      setPosts: (posts) => set({ posts }),
      
      addPost: (post) => 
        set((state) => ({ posts: [post, ...state.posts] })),
      
      updatePost: (postId, updates) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updates } : post
          ),
        })),
      
      removePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),
      
      setHasMore: (hasMore) => set({ hasMore }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // Feed controls
      setFeedType: (type) => set({ feedType: type }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setMbtiFilter: (mbti) => set({ mbtiFilter: mbti }),
      
      // Post interactions
      toggleLike: (postId) => {
        const likedPosts = new Set(get().likedPosts)
        const isLiked = likedPosts.has(postId)
        
        if (isLiked) {
          likedPosts.delete(postId)
        } else {
          likedPosts.add(postId)
        }
        
        set({ likedPosts })
        
        // Update post like count optimistically
        get().updatePost(postId, {
          isLiked: !isLiked,
          _count: {
            ...get().posts.find(p => p.id === postId)?._count,
            likes: (get().posts.find(p => p.id === postId)?._count.likes || 0) + (isLiked ? -1 : 1),
          } as any,
        })
      },
      
      toggleBookmark: (postId) => {
        const bookmarkedPosts = new Set(get().bookmarkedPosts)
        const isBookmarked = bookmarkedPosts.has(postId)
        
        if (isBookmarked) {
          bookmarkedPosts.delete(postId)
        } else {
          bookmarkedPosts.add(postId)
        }
        
        set({ bookmarkedPosts })
        
        // Update post bookmark status
        get().updatePost(postId, { isBookmarked: !isBookmarked })
      },
      
      // Comments
      setPostComments: (postId, comments) =>
        set((state) => ({
          postComments: { ...state.postComments, [postId]: comments },
        })),
      
      addComment: (postId, comment) => {
        const currentComments = get().postComments[postId] || []
        get().setPostComments(postId, [...currentComments, comment])
        
        // Update comment count
        const currentCount = get().commentCounts[postId] || 0
        get().updateCommentCount(postId, currentCount + 1)
        
        // Update post comment count
        get().updatePost(postId, {
          _count: {
            ...get().posts.find(p => p.id === postId)?._count,
            comments: currentCount + 1,
          } as any,
        })
      },
      
      updateCommentCount: (postId, count) =>
        set((state) => ({
          commentCounts: { ...state.commentCounts, [postId]: count },
        })),
      
      // Optimistic updates
      addOptimisticPost: (post) =>
        set((state) => ({
          optimisticPosts: [post, ...state.optimisticPosts],
        })),
      
      removeOptimisticPost: (postId) =>
        set((state) => ({
          optimisticPosts: state.optimisticPosts.filter((p) => p.id !== postId),
        })),
      
      setOptimisticLike: (postId, liked) =>
        set((state) => ({
          optimisticLikes: { ...state.optimisticLikes, [postId]: liked },
        })),
      
      addOptimisticComment: (postId, comment) =>
        set((state) => ({
          optimisticComments: {
            ...state.optimisticComments,
            [postId]: [...(state.optimisticComments[postId] || []), comment],
          },
        })),
      
      // Utility
      clearFeed: () => set({
        posts: [],
        hasMore: true,
        isLoading: false,
        error: null,
        optimisticPosts: [],
        optimisticLikes: {},
        optimisticComments: {},
      }),
      
      refreshFeed: () => {
        get().clearFeed()
        set({ isLoading: true })
      },
    }),
    {
      name: 'feed-store',
    }
  )
)

