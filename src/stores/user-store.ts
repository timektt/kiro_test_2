import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  mbti?: {
    type: string
  } | null
  _count?: {
    followers: number
    following: number
    posts: number
  }
}

interface UserState {
  // Current user
  currentUser: User | null
  isAuthenticated: boolean
  
  // User interactions
  followingUsers: Set<string>
  blockedUsers: Set<string>
  
  // User preferences
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: {
      likes: boolean
      comments: boolean
      follows: boolean
      mentions: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'private'
      showEmail: boolean
      showMBTI: boolean
    }
  }
  
  // Actions
  setCurrentUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  updateUser: (updates: Partial<User>) => void
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void
  updatePreferences: (preferences: Partial<UserState['preferences']>) => void
  clearUserData: () => void
}

const defaultPreferences = {
  theme: 'system' as const,
  notifications: {
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
  },
  privacy: {
    profileVisibility: 'public' as const,
    showEmail: false,
    showMBTI: true,
  },
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentUser: null,
        isAuthenticated: false,
        followingUsers: new Set(),
        blockedUsers: new Set(),
        preferences: defaultPreferences,

        // Actions
        setCurrentUser: (user) => 
          set({ currentUser: user, isAuthenticated: !!user }),
        
        setAuthenticated: (authenticated) => 
          set({ isAuthenticated: authenticated }),
        
        updateUser: (updates) => {
          const currentUser = get().currentUser
          if (currentUser) {
            set({ currentUser: { ...currentUser, ...updates } })
          }
        },
        
        followUser: (userId) => {
          const following = new Set(get().followingUsers)
          following.add(userId)
          set({ followingUsers: following })
        },
        
        unfollowUser: (userId) => {
          const following = new Set(get().followingUsers)
          following.delete(userId)
          set({ followingUsers: following })
        },
        
        blockUser: (userId) => {
          const blocked = new Set(get().blockedUsers)
          blocked.add(userId)
          set({ blockedUsers: blocked })
        },
        
        unblockUser: (userId) => {
          const blocked = new Set(get().blockedUsers)
          blocked.delete(userId)
          set({ blockedUsers: blocked })
        },
        
        updatePreferences: (newPreferences) => {
          const currentPreferences = get().preferences
          set({ 
            preferences: { 
              ...currentPreferences, 
              ...newPreferences 
            } 
          })
        },
        
        clearUserData: () => set({
          currentUser: null,
          isAuthenticated: false,
          followingUsers: new Set(),
          blockedUsers: new Set(),
          preferences: defaultPreferences,
        }),
      }),
      {
        name: 'user-store',
        // Only persist certain fields
        partialize: (state) => ({
          preferences: state.preferences,
          followingUsers: Array.from(state.followingUsers),
          blockedUsers: Array.from(state.blockedUsers),
        }),
        // Custom serialization for Sets
        serialize: (state) => JSON.stringify({
          ...state,
          followingUsers: Array.from(state.followingUsers),
          blockedUsers: Array.from(state.blockedUsers),
        }),
        deserialize: (str) => {
          const parsed = JSON.parse(str)
          return {
            ...parsed,
            followingUsers: new Set(parsed.followingUsers || []),
            blockedUsers: new Set(parsed.blockedUsers || []),
          }
        },
      }
    ),
    {
      name: 'user-store',
    }
  )
)