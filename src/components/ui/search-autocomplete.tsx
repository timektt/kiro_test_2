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
  onSubmit?: (query: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  showHistory?: boolean
  maxSuggestions?: number
}

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  onSubmit,
  placeholder = 'Search users, posts, or tags...',
  className,
  disabled = false,
  showHistory = true,
  maxSuggestions = 8,
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [searchHistory, setSearchHistory] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedValue = useDebounce(value, 300)

  // Load search history from localStorage
  useEffect(() => {
    if (showHistory) {
      try {
        const saved = localStorage.getItem('search-history')
        if (saved) {
          setSearchHistory(JSON.parse(saved).slice(0, 5))
        }
      } catch (error) {
        console.error('Error loading search history:', error)
      }
    }
  }, [showHistory])

  // Save to search history
  const saveToHistory = useCallback((suggestion: SearchSuggestion) => {
    if (!showHistory) return
    
    try {
      const updated = [suggestion, ...searchHistory.filter(item => item.id !== suggestion.id)].slice(0, 5)
      setSearchHistory(updated)
      localStorage.setItem('search-history', JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }, [searchHistory, showHistory])

  // Get initial suggestions (recent searches)
  const getInitialSuggestions = useCallback(() => {
    if (!showHistory || searchHistory.length === 0) return []
    
    return searchHistory.map(item => ({
      ...item,
      type: 'recent' as const,
      subtitle: 'Recent search'
    }))
  }, [searchHistory, showHistory])

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions(getInitialSuggestions())
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}&limit=${maxSuggestions}`)
      if (!response.ok) throw new Error('Failed to fetch suggestions')
      
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [maxSuggestions, getInitialSuggestions])

  // Handle debounced search
  useEffect(() => {
    if (isOpen) {
      fetchSuggestions(debouncedValue)
    }
  }, [debouncedValue, isOpen, fetchSuggestions])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
          handleSubmit()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }, [isOpen, suggestions, selectedIndex, value])

  // Handle suggestion selection
  const handleSelect = useCallback((suggestion: SearchSuggestion) => {
    onChange(suggestion.title)
    saveToHistory(suggestion)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect?.(suggestion)
  }, [onChange, saveToHistory, onSelect])

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      const suggestion: SearchSuggestion = {
        id: Date.now().toString(),
        type: 'recent',
        title: value.trim()
      }
      saveToHistory(suggestion)
      setIsOpen(false)
      onSubmit?.(value.trim())
    }
  }, [value, saveToHistory, onSubmit])

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

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem('search-history')
    setSuggestions([])
  }, [])

  // Get icon for suggestion type
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
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
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsOpen(true)
            if (!value.trim()) {
              setSuggestions(getInitialSuggestions())
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-10"
          disabled={disabled}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <Card className="absolute top-full z-50 mt-1 w-full shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : (
              <>
                <div className="max-h-80 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-muted',
                        selectedIndex === index && 'bg-muted'
                      )}
                      onClick={() => handleSelect(suggestion)}
                    >
                      <div className="flex-shrink-0 text-muted-foreground">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      
                      {suggestion.image && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={suggestion.image} />
                          <AvatarFallback className="text-xs">
                            {suggestion.title.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {suggestion.title}
                          </span>
                          {suggestion.mbti && (
                            <Badge variant="secondary" className="text-xs">
                              {suggestion.mbti}
                            </Badge>
                          )}
                        </div>
                        {suggestion.subtitle && (
                          <p className="truncate text-xs text-muted-foreground">
                            {suggestion.subtitle}
                          </p>
                        )}
                      </div>
                      
                      {suggestion.category && (
                        <Badge variant="outline" className="text-xs">
                          {suggestion.category}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                {showHistory && searchHistory.length > 0 && suggestions.some(s => s.type === 'recent') && (
                  <div className="border-t px-4 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear history
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}