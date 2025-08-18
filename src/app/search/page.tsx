'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, Users, FileText, Loader2, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PostCard } from '@/components/ui/post-card'
import { SearchAutocomplete } from '@/components/ui/search-autocomplete'
import { AdvancedSearchFilters } from '@/components/ui/advanced-search-filters'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface SearchUser {
  id: string
  username: string
  name: string
  image: string | null
  createdAt: string
  mbti: {
    type: string
  } | null
  stats: {
    posts: number
    followers: number
    following: number
  }
}

interface SearchPost {
  id: string
  content: string
  category: string | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  author: {
    id: string
    username: string
    name: string
    image: string | null
    mbti: {
      type: string
    } | null
  }
  stats: {
    likes: number
    comments: number
  }
  isLiked: boolean
}

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

const POST_CATEGORIES = [
  'general', 'question', 'discussion', 'advice',
  'experience', 'relationship', 'career', 'hobby'
]

interface SearchFilters {
  // Content filters
  category?: string
  mbtiType?: string
  hasImage?: boolean
  hasVideo?: boolean
  minLikes?: number
  maxLikes?: number
  minComments?: number
  maxComments?: number
  
  // Time filters
  dateFrom?: Date
  dateTo?: Date
  timeRange?: 'today' | 'week' | 'month' | 'year' | 'custom'
  
  // User filters
  authorMbti?: string
  minFollowers?: number
  verifiedOnly?: boolean
  
  // Sorting
  sortBy?: 'recent' | 'popular' | 'trending' | 'relevant'
  sortOrder?: 'asc' | 'desc'
}

export default function SearchPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'posts')
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  // Advanced filters
  const [advancedFilters, setAdvancedFilters] = useState<SearchFilters>({
    sortBy: 'recent',
    sortOrder: 'desc'
  })
  
  // Post filters (legacy - keeping for backward compatibility)
  const [postCategory, setPostCategory] = useState(searchParams.get('category') || 'all')
  const [postMbti, setPostMbti] = useState(searchParams.get('mbti') || 'all')
  const [postSort, setPostSort] = useState(searchParams.get('sort') || 'recent')
  
  // Results
  const [users, setUsers] = useState<SearchUser[]>([])
  const [posts, setPosts] = useState<SearchPost[]>([])
  const [userTotal, setUserTotal] = useState(0)
  const [postTotal, setPostTotal] = useState(0)
  const [postPage, setPostPage] = useState(1)
  const [postTotalPages, setPostTotalPages] = useState(0)
  
  const debouncedQuery = useDebounce(query, 500)
  
  const searchUsers = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setUsers([])
      setUserTotal(0)
      return
    }
    
    try {
      // Build query parameters with advanced filters
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '20'
      })
      
      // Add user-specific filters
      if (advancedFilters.authorMbti) params.append('mbti', advancedFilters.authorMbti)
      if (advancedFilters.minFollowers) params.append('minFollowers', advancedFilters.minFollowers.toString())
      if (advancedFilters.verifiedOnly) params.append('verified', 'true')
      if (advancedFilters.sortBy) params.append('sort', advancedFilters.sortBy)
      
      const response = await fetch(`/api/users/search?${params}`)
      if (!response.ok) throw new Error('Failed to search users')
      
      const data = await response.json()
      setUsers(data.users)
      setUserTotal(data.total)
    } catch (error) {
      console.error('Error searching users:', error)
      toast.error('เกิดข้อผิดพลาดในการค้นหาผู้ใช้')
    }
  }, [advancedFilters])
  
  const searchPosts = useCallback(async (searchQuery: string, page = 1, reset = true) => {
    if (!searchQuery.trim()) {
      setPosts([])
      setPostTotal(0)
      setPostTotalPages(0)
      return
    }
    
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        limit: '20'
      })
      
      // Add advanced filters
      if (advancedFilters.category) params.append('category', advancedFilters.category)
      if (advancedFilters.mbtiType) params.append('mbti', advancedFilters.mbtiType)
      if (advancedFilters.authorMbti) params.append('authorMbti', advancedFilters.authorMbti)
      if (advancedFilters.hasImage) params.append('hasImage', 'true')
      if (advancedFilters.hasVideo) params.append('hasVideo', 'true')
      if (advancedFilters.minLikes) params.append('minLikes', advancedFilters.minLikes.toString())
      if (advancedFilters.maxLikes) params.append('maxLikes', advancedFilters.maxLikes.toString())
      if (advancedFilters.minComments) params.append('minComments', advancedFilters.minComments.toString())
      if (advancedFilters.maxComments) params.append('maxComments', advancedFilters.maxComments.toString())
      if (advancedFilters.dateFrom) params.append('dateFrom', advancedFilters.dateFrom.toISOString())
      if (advancedFilters.dateTo) params.append('dateTo', advancedFilters.dateTo.toISOString())
      if (advancedFilters.minFollowers) params.append('minFollowers', advancedFilters.minFollowers.toString())
      if (advancedFilters.verifiedOnly) params.append('verifiedOnly', 'true')
      if (advancedFilters.sortBy) params.append('sort', advancedFilters.sortBy)
      if (advancedFilters.sortOrder) params.append('order', advancedFilters.sortOrder)
      
      // Legacy filters for backward compatibility
      if (postCategory !== 'all') params.append('category', postCategory)
      if (postMbti !== 'all') params.append('mbti', postMbti)
      if (postSort) params.append('sort', postSort)
      
      const response = await fetch(`/api/posts/search?${params}`)
      if (!response.ok) throw new Error('Failed to search posts')
      
      const data = await response.json()
      
      if (reset) {
        setPosts(data.posts)
      } else {
        setPosts(prev => [...prev, ...data.posts])
      }
      
      setPostTotal(data.total)
      setPostTotalPages(data.totalPages)
      setPostPage(page)
    } catch (error) {
      console.error('Error searching posts:', error)
      toast.error('เกิดข้อผิดพลาดในการค้นหาโพสต์')
    }
  }, [advancedFilters, postCategory, postMbti, postSort])
  
  const performSearch = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setUsers([])
      setPosts([])
      setUserTotal(0)
      setPostTotal(0)
      return
    }
    
    setIsLoading(true)
    
    try {
      if (activeTab === 'users') {
        await searchUsers(debouncedQuery)
      } else {
        await searchPosts(debouncedQuery, 1, true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery, activeTab, searchUsers, searchPosts])
  
  const loadMorePosts = async () => {
    if (postPage < postTotalPages) {
      setIsLoading(true)
      await searchPosts(debouncedQuery, postPage + 1, false)
      setIsLoading(false)
    }
  }

  // Advanced filters handlers
  const handleFiltersChange = (newFilters: SearchFilters) => {
    setAdvancedFilters(newFilters)
    // Reset search when filters change
    if (debouncedQuery) {
      if (activeTab === 'posts') {
        searchPosts(debouncedQuery, 1, true)
      } else {
        searchUsers(debouncedQuery)
      }
    }
  }

  const handleFiltersReset = () => {
    setAdvancedFilters({
      sortBy: 'recent',
      sortOrder: 'desc'
    })
    // Refresh search with reset filters
    if (debouncedQuery) {
      if (activeTab === 'posts') {
        searchPosts(debouncedQuery, 1, true)
      } else {
        searchUsers(debouncedQuery)
      }
    }
  }

  const handleSearchSelect = (suggestion: any) => {
    setQuery(suggestion.title || suggestion.username || suggestion.text)
  }
  
  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (activeTab !== 'posts') params.set('type', activeTab)
    if (postCategory !== 'all') params.set('category', postCategory)
    if (postMbti !== 'all') params.set('mbti', postMbti)
    if (postSort !== 'recent') params.set('sort', postSort)
    
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`
    router.replace(newUrl, { scroll: false })
  }, [query, activeTab, postCategory, postMbti, postSort, router])
  
  // Perform search when debounced query or filters change
  useEffect(() => {
    performSearch()
  }, [performSearch])
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {'กรุณาเข้าสู่ระบบเพื่อใช้งานการค้นหา'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{'ค้นหาขั้นสูง'}</h1>
        </div>
        
        {/* Enhanced Search Input */}
        <div className="space-y-4">
          <SearchAutocomplete
            value={query}
            onChange={setQuery}
            onSelect={handleSearchSelect}
            placeholder="ค้นหาโพสต์, ผู้ใช้, หรือหัวข้อ..."
            className="text-lg"
          />
          
          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              ตัวกรองขั้นสูง
              {Object.keys(advancedFilters).filter(key => 
                key !== 'sortBy' && key !== 'sortOrder' && advancedFilters[key as keyof SearchFilters]
              ).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {Object.keys(advancedFilters).filter(key => 
                    key !== 'sortBy' && key !== 'sortOrder' && advancedFilters[key as keyof SearchFilters]
                  ).length}
                </Badge>
              )}
            </Button>
          </div>
          
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <AdvancedSearchFilters
              filters={advancedFilters}
              onFiltersChange={handleFiltersChange}
              onReset={handleFiltersReset}
            />
          )}
        </div>
      </div>
      
      {/* Search Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>{'โพสต์'} ({postTotal})</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{'ผู้ใช้'} ({userTotal})</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          {/* Post Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>{'ตัวกรอง'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{'หมวดหมู่'}</label>
                  <Select value={postCategory} onValueChange={setPostCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{'ทั้งหมด'}</SelectItem>
                      {POST_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">MBTI</label>
                  <Select value={postMbti} onValueChange={setPostMbti}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{'ทั้งหมด'}</SelectItem>
                      {MBTI_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{'เรียงตาม'}</label>
                  <Select value={postSort} onValueChange={setPostSort}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">{'ล่าสุด'}</SelectItem>
                      <SelectItem value="popular">{'ยอดนิยม'}</SelectItem>
                      <SelectItem value="oldest">{'เก่าสุด'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Post Results */}
          <div className="space-y-4">
            {isLoading && posts.length === 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : posts.length > 0 ? (
              <>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
                
                {postPage < postTotalPages && (
                  <div className="flex justify-center">
                    <Button
                      onClick={loadMorePosts}
                      disabled={isLoading}
                      variant="outline"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {'โหลดเพิ่มเติม'}
                    </Button>
                  </div>
                )}
              </>
            ) : query ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {'ไม่พบโพสต์ที่ตรงกับการค้นหา'} "{query}"
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {'กรอกคำค้นหาเพื่อเริ่มต้น'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.image || ''} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold truncate">{user.name}</h3>
                          {user.mbti && (
                            <Badge variant="secondary" className="text-xs">
                              {user.mbti.type}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          @{user.username}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>{user.stats.posts} {'โพสต์'}</span>
                          <span>{user.stats.followers} {'ผู้ติดตาม'}</span>
                          <span>{user.stats.following} {'กำลังติดตาม'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/profile/${user.username}`)}
                    >
                      {'ดูโปรไฟล์'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : query ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {'ไม่พบผู้ใช้ที่ตรงกับการค้นหา'} "{query}"
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {'กรอกคำค้นหาเพื่อเริ่มต้น'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}