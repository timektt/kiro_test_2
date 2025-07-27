'use client'

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

type Preferences = {
  theme: 'light' | 'dark'
  language: 'en' | 'th'
}

type UserState = {
  preferences: Preferences
  followingUsers: Set<string>
  blockedUsers: Set<string>
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
        preferences: defaultPreferences,
        followingUsers: new Set(),
        blockedUsers: new Set(),

        clearUserData: () =>
          set({
            preferences: defaultPreferences,
            followingUsers: new Set(),
            blockedUsers: new Set(),
          }),
      }),
      {
        name: 'user-store',
        // ✅ ป้องกันการใช้ persist ตอน SSR
        storage: isClient
          ? createJSONStorage(() => localStorage)
          : undefined!, // ใช้ `undefined!` เพื่อบอกว่ามั่นใจจะไม่ run บน SSR

        partialize: (state) => ({
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
