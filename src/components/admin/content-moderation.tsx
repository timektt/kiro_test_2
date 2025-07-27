'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Trash2,
  FileText,
  MessageSquare,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingFeed } from '@/components/ui/loading-feed'
import { cn } from '@/lib/utils'

interface Post {
  id: string
  content: string
  imageUrl: string | null
  isPublic: boolean
  createdAt: Date
  author: {
    id: string
    username: string
    name: string | null
    image: string | null
  }
  _count: {
    likes: number
    comments: number
  }
}

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    username: string
    name: string | null
    image: string | null
  }
  post: {
    id: string
    content: string
  }
}

interface ContentModerationProps {
  adminUser: {
    id: string
    username: string
    name: string | null
    email: string
    role: 'ADMIN' | 'MODERATOR'
    image: string | null
  }
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'API Error')
  }
  return result.data
}

export function ContentModeration({ adminUser }: ContentModerationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [actionDialog, setActionDialog] = useState<{
    type: 'hide' | 'show' | 'delete'
    item: Post | Comment
    itemType: 'post' | 'comment'
    reason?: string
  } | null>(null)

  // Build API URL
  const buildApiUrl = useCallback(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
    })

    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim())
    }
    if (typeFilter !== 'ALL') {
      params.append('type', typeFilter)
    }
    if (statusFilter !== 'ALL') {
      params.append('status', statusFilter)
    }

    return `/api/admin/content?${params.toString()}`
  }, [page, searchQuery, typeFilter, statusFilter])

  // Fetch content
  const { data, error, isLoading, mutate } = useSWR(
    buildApiUrl(),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handleFilterChange = (type: 'type' | 'status', value: string) => {
    if (type === 'type') {
      setTypeFilter(value)
    } else {
      setStatusFilter(value)
    }
    setPage(1)
  }

  const handleContentAction = async (action: string, itemType: 'post' | 'comment', itemId: string, reason?: string) => {
    try {
      const endpoint = itemType === 'post' 
        ? `/api/admin/content/posts/${itemId}`
        : `/api/admin/content/comments/${itemId}`

      const method = action === 'DELETE' ? 'DELETE' : 'PUT'
      const body = action === 'DELETE' 
        ? { reason }
        : { action, reason }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to perform action')
      }

      // Refresh data
      mutate()
      setActionDialog(null)
    } catch (error) {
      console.error('Error performing content action:', error)
      // TODO: Show error toast
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Error Loading Content"
        description={error.message || 'Failed to load content'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Moderation</h1>
        <p className="text-muted-foreground">
          Review and moderate posts and comments
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Content</SelectItem>
                <SelectItem value="POSTS">Posts Only</SelectItem>
                <SelectItem value="COMMENTS">Comments Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="HIDDEN">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="space-y-4">
        {isLoading ? (
          <LoadingFeed />
        ) : (
          <>
            {/* Posts */}
            {(typeFilter === 'ALL' || typeFilter === 'POSTS') && data?.posts?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Posts ({data.posts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {data.posts.map((post: Post) => (
                    <div
                      key={post.id}
                      className="flex items-start justify-between p-4 border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Author Avatar */}
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.author.image || undefined} />
                          <AvatarFallback>
                            {post.author.name?.[0] || post.author.username[0]}
                          </AvatarFallback>
                        </Avatar>

                        {/* Post Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">
                              {post.author.name || post.author.username}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              @{post.author.username}
                            </span>
                            <Badge variant={post.isPublic ? 'default' : 'secondary'}>
                              {post.isPublic ? 'Public' : 'Hidden'}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{truncateText(post.content)}</p>
                          {post.imageUrl && (
                            <div className="mb-2">
                              <Badge variant="outline">Has Image</Badge>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{post._count.likes} likes</span>
                            <span>{post._count.comments} comments</span>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 ml-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {post.isPublic ? (
                              <DropdownMenuItem 
                                onClick={() => setActionDialog({ 
                                  type: 'hide', 
                                  item: post, 
                                  itemType: 'post' 
                                })}
                                className="text-yellow-600"
                              >
                                <EyeOff className="h-4 w-4 mr-2" />
                                Hide Post
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => setActionDialog({ 
                                  type: 'show', 
                                  item: post, 
                                  itemType: 'post' 
                                })}
                                className="text-green-600"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Show Post
                              </DropdownMenuItem>
                            )}
                            {adminUser.role === 'ADMIN' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => setActionDialog({ 
                                    type: 'delete', 
                                    item: post, 
                                    itemType: 'post' 
                                  })}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Post
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            {(typeFilter === 'ALL' || typeFilter === 'COMMENTS') && data?.comments?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments ({data.comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {data.comments.map((comment: Comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start justify-between p-4 border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Author Avatar */}
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.author.image || undefined} />
                          <AvatarFallback>
                            {comment.author.name?.[0] || comment.author.username[0]}
                          </AvatarFallback>
                        </Avatar>

                        {/* Comment Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">
                              {comment.author.name || comment.author.username}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              @{comment.author.username}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{truncateText(comment.content)}</p>
                          <div className="text-xs text-muted-foreground mb-2">
                            On post: "{truncateText(comment.post.content, 50)}"
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 ml-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => setActionDialog({ 
                                type: 'delete', 
                                item: comment, 
                                itemType: 'comment' 
                              })}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Comment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {(!data?.posts?.length && !data?.comments?.length) && (
              <EmptyState
                icon={FileText}
                title="No content found"
                description="No content matches your current filters"
              />
            )}
          </>
        )}
      </div>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog?.type === 'delete' && `Delete ${actionDialog.itemType}`}
              {actionDialog?.type === 'hide' && 'Hide Post'}
              {actionDialog?.type === 'show' && 'Show Post'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog?.type === 'delete' && 
                `Are you sure you want to delete this ${actionDialog.itemType}? This action cannot be undone.`
              }
              {actionDialog?.type === 'hide' && 
                'Are you sure you want to hide this post? It will no longer be visible to users.'
              }
              {actionDialog?.type === 'show' && 
                'Are you sure you want to make this post visible to users again?'
              }
            </AlertDialogDescription>
            <div className="mt-4">
              <label className="text-sm font-medium">Reason (optional):</label>
              <Textarea
                placeholder="Provide a reason for this action..."
                value={actionDialog?.reason || ''}
                onChange={(e) => setActionDialog(prev => prev ? {...prev, reason: e.target.value} : null)}
                className="mt-2"
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (actionDialog) {
                  handleContentAction(
                    actionDialog.type.toUpperCase(),
                    actionDialog.itemType,
                    actionDialog.item.id,
                    actionDialog.reason
                  )
                }
              }}
              className={actionDialog?.type === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {actionDialog?.type === 'delete' && 'Delete'}
              {actionDialog?.type === 'hide' && 'Hide'}
              {actionDialog?.type === 'show' && 'Show'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

