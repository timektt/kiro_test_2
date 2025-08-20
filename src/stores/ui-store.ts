import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  // Theme and appearance
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  
  // Modals and dialogs
  postComposerOpen: boolean
  profileEditOpen: boolean
  
  // Loading states
  isLoading: boolean
  loadingMessage: string
  
  // Toast notifications
  toasts: Toast[]
  
  // Search
  searchQuery: string
  searchResults: any[]
  searchLoading: boolean
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setPostComposerOpen: (open: boolean) => void
  setProfileEditOpen: (open: boolean) => void
  setLoading: (loading: boolean, message?: string) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  setSearchQuery: (query: string) => void
  setSearchResults: (results: any[]) => void
  setSearchLoading: (loading: boolean) => void
  clearSearch: () => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Initial state
      sidebarOpen: false,
      mobileMenuOpen: false,
      postComposerOpen: false,
      profileEditOpen: false,
      isLoading: false,
      loadingMessage: '',
      toasts: [],
      searchQuery: '',
      searchResults: [],
      searchLoading: false,

      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setPostComposerOpen: (open) => set({ postComposerOpen: open }),
      setProfileEditOpen: (open) => set({ profileEditOpen: open }),
      
      setLoading: (loading, message = '') => 
        set({ isLoading: loading, loadingMessage: message }),
      
      addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast = { ...toast, id }
        set((state) => ({ toasts: [...state.toasts, newToast] }))
        
        // Auto remove toast after duration
        const duration = toast.duration || 5000
        setTimeout(() => {
          get().removeToast(id)
        }, duration)
      },
      
      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchLoading: (loading) => set({ searchLoading: loading }),
      clearSearch: () => set({ searchQuery: '', searchResults: [], searchLoading: false }),
    }),
    {
      name: 'ui-store',
    }
  )
)


