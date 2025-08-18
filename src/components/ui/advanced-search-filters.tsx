'use client'

import { useState } from 'react'
import { Filter, X, Calendar, TrendingUp, Users, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { cn } from '@/lib/utils'

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

interface AdvancedSearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onReset: () => void
  className?: string
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

const TIME_RANGES = [
  { value: 'today', label: 'วันนี้' },
  { value: 'week', label: 'สัปดาห์นี้' },
  { value: 'month', label: 'เดือนนี้' },
  { value: 'year', label: 'ปีนี้' },
  { value: 'custom', label: 'กำหนดเอง' },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'ล่าสุด' },
  { value: 'popular', label: 'ยอดนิยม' },
  { value: 'trending', label: 'กำลังฮิต' },
  { value: 'relevant', label: 'เกี่ยวข้องมากที่สุด' },
]

export function AdvancedSearchFilters({
  filters,
  onFiltersChange,
  onReset,
  className
}: AdvancedSearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [dateFromOpen, setDateFromOpen] = useState(false)
  const [dateToOpen, setDateToOpen] = useState(false)

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false
      return value !== undefined && value !== '' && value !== false
    }).length
  }

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const getTimeRangeDate = (range: string) => {
    const now = new Date()
    switch (range) {
      case 'today':
        return { from: new Date(now.setHours(0, 0, 0, 0)), to: new Date() }
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return { from: weekAgo, to: new Date() }
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return { from: monthAgo, to: new Date() }
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        return { from: yearAgo, to: new Date() }
      default:
        return { from: undefined, to: undefined }
    }
  }

  const handleTimeRangeChange = (range: string) => {
    updateFilter('timeRange', range)
    if (range !== 'custom') {
      const { from, to } = getTimeRangeDate(range)
      updateFilter('dateFrom', from)
      updateFilter('dateTo', to)
    }
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>ตัวกรองขั้นสูง</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={getActiveFiltersCount() === 0}
            >
              รีเซ็ต
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'ย่อ' : 'ขยาย'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || key === 'sortBy' || key === 'sortOrder') return null
              
              let label = ''
              switch (key) {
                case 'category':
                  label = `หมวดหมู่: ${value}`
                  break
                case 'mbtiType':
                  label = `MBTI: ${value}`
                  break
                case 'authorMbti':
                  label = `ผู้เขียน MBTI: ${value}`
                  break
                case 'hasImage':
                  label = 'มีรูปภาพ'
                  break
                case 'hasVideo':
                  label = 'มีวิดีโอ'
                  break
                case 'verifiedOnly':
                  label = 'ยืนยันแล้วเท่านั้น'
                  break
                case 'timeRange':
                  const timeLabel = TIME_RANGES.find(t => t.value === value)?.label
                  label = `ช่วงเวลา: ${timeLabel}`
                  break
                default:
                  label = `${key}: ${value}`
              }
              
              return (
                <Badge key={key} variant="secondary" className="gap-1">
                  {label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => clearFilter(key as keyof SearchFilters)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )
            })}
          </div>
        )}

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>หมวดหมู่</Label>
            <Select value={filters.category || ''} onValueChange={(value) => updateFilter('category', value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ทั้งหมด</SelectItem>
                {POST_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>MBTI ของโพสต์</Label>
            <Select value={filters.mbtiType || ''} onValueChange={(value) => updateFilter('mbtiType', value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือก MBTI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ทั้งหมด</SelectItem>
                {MBTI_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>เรียงตาม</Label>
            <Select value={filters.sortBy || 'recent'} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters (Expandable) */}
        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* Time Range */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                ช่วงเวลา
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {TIME_RANGES.map(range => (
                  <Button
                    key={range.value}
                    variant={filters.timeRange === range.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTimeRangeChange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
              
              {filters.timeRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>จากวันที่</Label>
                    <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.dateFrom ? format(filters.dateFrom, 'PPP', { locale: th }) : 'เลือกวันที่'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={filters.dateFrom}
                          onSelect={(date) => {
                            updateFilter('dateFrom', date)
                            setDateFromOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>ถึงวันที่</Label>
                    <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.dateTo ? format(filters.dateTo, 'PPP', { locale: th }) : 'เลือกวันที่'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={filters.dateTo}
                          onSelect={(date) => {
                            updateFilter('dateTo', date)
                            setDateToOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>

            {/* Content Filters */}
            <div className="space-y-4">
              <Label>ประเภทเนื้อหา</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-image"
                    checked={filters.hasImage || false}
                    onCheckedChange={(checked) => updateFilter('hasImage', checked || undefined)}
                  />
                  <Label htmlFor="has-image">มีรูปภาพ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-video"
                    checked={filters.hasVideo || false}
                    onCheckedChange={(checked) => updateFilter('hasVideo', checked || undefined)}
                  />
                  <Label htmlFor="has-video">มีวิดีโอ</Label>
                </div>
              </div>
            </div>

            {/* Engagement Filters */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ระดับการมีส่วนร่วม
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm">จำนวนไลค์ขั้นต่ำ: {filters.minLikes || 0}</Label>
                  <Slider
                    value={[filters.minLikes || 0]}
                    onValueChange={([value]) => updateFilter('minLikes', value || undefined)}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm">จำนวนคอมเมนต์ขั้นต่ำ: {filters.minComments || 0}</Label>
                  <Slider
                    value={[filters.minComments || 0]}
                    onValueChange={([value]) => updateFilter('minComments', value || undefined)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Author Filters */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                ตัวกรองผู้เขียน
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>MBTI ของผู้เขียน</Label>
                  <Select value={filters.authorMbti || ''} onValueChange={(value) => updateFilter('authorMbti', value || undefined)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือก MBTI" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">ทั้งหมด</SelectItem>
                      {MBTI_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm">ผู้ติดตามขั้นต่ำ: {filters.minFollowers || 0}</Label>
                  <Slider
                    value={[filters.minFollowers || 0]}
                    onValueChange={([value]) => updateFilter('minFollowers', value || undefined)}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="verified-only"
                  checked={filters.verifiedOnly || false}
                  onCheckedChange={(checked) => updateFilter('verifiedOnly', checked || undefined)}
                />
                <Label htmlFor="verified-only">ผู้ใช้ที่ยืนยันแล้วเท่านั้น</Label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}