'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Clock, TrendingUp, User, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

interface SearchSuggestion {
  id: string
  type: 'user' | 'post' | 'tag' | 'recent' | 'trending'
  title: string
  subtitle?: string
  image?: string
  category?: string
  mbti?: string
}

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (suggestion: SearchSuggestion) => void
  placeholder?: string
  className?: string
}

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'ค้นหาผู้ใช้, โพสต์, หรือแท็ก...',
  className
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedValue = useDebounce(value, 300)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('search-history')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading search history:', error)
      }
    }
  }, [])

  // Save search to history
  const saveToHistory = useCallback((query: string) => {
    if (!query.trim()) return
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('search-history', JSON.stringify(updated))
  }, [recentSearches])

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      // Show recent searches and trending when no query
      const recentSuggestions: SearchSuggestion[] = recentSearches.map((search, index) => ({
        id: `recent-${index}`,
        type: 'recent',
        title: search,
        subtitle: 'ค้นหาล่าสุด'
      }))
      
      setSuggestions(recentSuggestions)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}&limit=8`)
      if (!response.ok) throw new Error('Failed to fetch suggestions')
      
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [recentSearches])

  // Handle debounced search
  useEffect(() => {
    if (isOpen) {
      fetchSuggestions(debouncedValue)
    }
  }, [debouncedValue, isOpen, fetchSuggestions])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex])
        } else if (value.trim()) {
          saveToHistory(value)
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Handle suggestion selection
  const handleSelect = (suggestion: SearchSuggestion) => {
    onChange(suggestion.title)
    saveToHistory(suggestion.title)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect?.(suggestion)
  }

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true)
    fetchSuggestions(value)
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('search-history')
    fetchSuggestions(value)
  }

  // Get suggestion icon
  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'post':
        return <FileText className="h-4 w-4" />
      case 'recent':
        return <Clock className="h-4 w-4" />
      case 'trending':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                กำลังค้นหา...
              </div>
            ) : suggestions.length > 0 ? (
              <>
                {/* Recent searches header */}
                {suggestions.some(s => s.type === 'recent') && (
                  <div className="flex items-center justify-between p-3 border-b">
                    <span className="text-sm font-medium text-muted-foreground">
                      ค้นหาล่าสุด
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="h-6 text-xs"
                    >
                      ล้างทั้งหมด
                    </Button>
                  </div>
                )}
                
                {/* Suggestions list */}
                <div className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors',
                        selectedIndex === index && 'bg-accent'
                      )}
                      onClick={() => handleSelect(suggestion)}
                    >
                      {suggestion.image ? (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={suggestion.image} />
                          <AvatarFallback className="text-xs">
                            {suggestion.title[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center text-muted-foreground">
                          {getSuggestionIcon(suggestion)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {suggestion.title}
                          </span>
                          {suggestion.mbti && (
                            <Badge variant="secondary" className="text-xs">
                              {suggestion.mbti}
                            </Badge>
                          )}
                          {suggestion.category && (
                            <Badge variant="outline" className="text-xs">
                              {suggestion.category}
                            </Badge>
                          )}
                        </div>
                        {suggestion.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">
                            {suggestion.subtitle}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : value.trim() ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                ไม่พบผลการค้นหาสำหรับ "{value}"
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                เริ่มพิมพ์เพื่อค้นหา
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}