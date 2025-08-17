'use client'

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

type Preferences = {
  theme: 'light' | 'dark'
  language: 'en' | 'th'
}

type User = {
  id: string
  username: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

type UserState = {
  currentUser: User | null
  isAuthenticated: boolean
  preferences: Preferences
  followingUsers: Set<string>
  blockedUsers: Set<string>
  setCurrentUser: (user: User) => void
  setAuthenticated: (authenticated: boolean) => void
  clearUserData: () => void
}

const defaultPreferences: Preferences = {
  theme: 'light',
  language: 'en',
}

const isClient = typeof window !== 'undefined'

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        currentUser: null,
        isAuthenticated: false,
        preferences: defaultPreferences,
        followingUsers: new Set(),
        blockedUsers: new Set(),

        setCurrentUser: (user: User) =>
          set({ currentUser: user }),

        setAuthenticated: (authenticated: boolean) =>
          set({ isAuthenticated: authenticated }),

        clearUserData: () =>
          set({
            currentUser: null,
            isAuthenticated: false,
            preferences: defaultPreferences,
            followingUsers: new Set(),
            blockedUsers: new Set(),
          }),
      }),
      {
        name: 'user-store',
        // Prevent persist usage during SSR
        storage: isClient
          ? createJSONStorage(() => localStorage)
          : undefined, // Use undefined to ensure it won't run on SSR

        partialize: (state) => ({
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated,
          preferences: state.preferences,
          followingUsers: Array.from(state.followingUsers),
          blockedUsers: Array.from(state.blockedUsers),
        }),

        merge: (persistedState, currentState) => {
          const parsed = persistedState as any
          return {
            ...currentState,
            ...parsed,
            followingUsers: new Set(parsed.followingUsers ?? []),
            blockedUsers: new Set(parsed.blockedUsers ?? []),
          }
        },
      }
    )
  )
)
