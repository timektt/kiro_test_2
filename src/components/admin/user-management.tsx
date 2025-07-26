'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Shield, 
  Trash2,
  Eye,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import page from '@/app/page'
import page from '@/app/page'
import page from '@/app/page'

interface User {
  id: string
  username: string
  name: string | null
  email: string
  role: 'USER' | 'MODERATOR' | 'ADMIN'
  isActive: boolean
  image: string | null
  createdAt: Date
  mbti?: {
    type: string
  } | null
  _count: {
    posts: number
    followers: number
    following: number
    likes: number
    comments: number
  }
}

interface UserManagementProps {
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

export function UserManagement({ adminUser }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    type: 'activate' | 'deactivate' | 'delete' | 'changeRole'
    user: User
    newRole?: string
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
    if (roleFilter !== 'ALL') {
      params.append('role', roleFilter)
    }
    if (statusFilter !== 'ALL') {
      params.append('status', statusFilter)
    }

    return `/api/admin/users?${params.toString()}`
  }, [page, searchQuery, roleFilter, statusFilter])

  // Fetch users
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

  const handleFilterChange = (type: 'role' | 'status', value: string) => {
    if (type === 'role') {
      setRoleFilter(value)
    } else {
      setStatusFilter(value)
    }
    setPage(1)
  }

  const handleUserAction = async (action: string, userId: string, additionalData?: any) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...additionalData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to perform action')
      }

      // Refresh data
      mutate()
      setActionDialog(null)
    } catch (error) {
      console.error('Error performing user action:', error)
      // TODO: Show error toast
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      // Refresh data
      mutate()
      setActionDialog(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      // TODO: Show error toast
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'
      case 'MODERATOR':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (error) {
    return (
      <EmptyState
        icon={Users}
        title="Error Loading Users"
        description={error.message || 'Failed to load users'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and account status
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
                placeholder="Search users by username, name, or email..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={(value) => handleFilterChange('role', value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
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
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users
            {data?.pagination.total && (
              <span className="text-sm font-normal text-muted-foreground">
                ({data.pagination.total} total)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingFeed />
          ) : !data?.users?.length ? (
            <div className="p-8">
              <EmptyState
                icon={Users}
                title=\"No users found\"
                description=\"No users match your current filters\"
              />
            </div>
          ) : (
            <div>
              {data.users.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback>
                        {user.name?.[0] || user.username[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {user.name || user.username}
                        </h3>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                        {!user.isActive && (
                          <Badge variant=\"outline\" className="text-red-600">
                            Inactive
                          </Badge>
                        )}
                        {user.mbti && (
                          <Badge variant=\"secondary\" className="text-xs">
                            {user.mbti.type}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        @{user.username} • {user.email}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{user._count.posts} posts</span>
                        <span>{user._count.followers} followers</span>
                        <span>{user._count.following} following</span>
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 ml-4">
                    {user.id !== adminUser.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant=\"ghost\" size=\"sm\" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align=\"end\" className="w-48">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.isActive ? (
                            <DropdownMenuItem 
                              onClick={() => setActionDialog({ type: 'deactivate', user })}
                              className="text-yellow-600"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => setActionDialog({ type: 'activate', user })}
                              className="text-green-600"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => setActionDialog({ type: 'changeRole', user })}>
                            <Shield className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setActionDialog({ type: 'delete', user })}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {data.pagination.hasMore && (
                <div className="p-6 text-center border-t">
                  <Button 
                    variant=\"outline\" 
                    onClick={() => setPage(page + 1)}
                  >
                    Load More Users
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing {data.users.length} of {data.pagination.total} users
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog?.type === 'delete' && 'Delete User'}
              {actionDialog?.type === 'activate' && 'Activate User'}
              {actionDialog?.type === 'deactivate' && 'Deactivate User'}
              {actionDialog?.type === 'changeRole' && 'Change User Role'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog?.type === 'delete' && 
                `Are you sure you want to delete ${actionDialog.user.name || actionDialog.user.username}? This action cannot be undone.`
              }
              {actionDialog?.type === 'activate' && 
                `Are you sure you want to activate ${actionDialog.user.name || actionDialog.user.username}?`
              }
              {actionDialog?.type === 'deactivate' && 
                `Are you sure you want to deactivate ${actionDialog.user.name || actionDialog.user.username}?`
              }
              {actionDialog?.type === 'changeRole' && 
                `Select a new role for ${actionDialog.user.name || actionDialog.user.username}:`
              }
            </AlertDialogDescription>
            {actionDialog?.type === 'changeRole' && (
              <Select 
                value={actionDialog.newRole || actionDialog.user.role} 
                onValueChange={(value) => setActionDialog({...actionDialog, newRole: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=\"USER\">User</SelectItem>
                  <SelectItem value=\"MODERATOR\">Moderator</SelectItem>
                  <SelectItem value=\"ADMIN\">Admin</SelectItem>
                </SelectContent>
              </Select>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (actionDialog?.type === 'delete') {
                  handleDeleteUser(actionDialog.user.id)
                } else if (actionDialog?.type === 'changeRole') {
                  handleUserAction('CHANGE_ROLE', actionDialog.user.id, { role: actionDialog.newRole })
                } else {
                  handleUserAction(
                    actionDialog?.type === 'activate' ? 'ACTIVATE' : 'DEACTIVATE',
                    actionDialog?.user.id || ''
                  )
                }
              }}
              className={actionDialog?.type === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {actionDialog?.type === 'delete' && 'Delete'}
              {actionDialog?.type === 'activate' && 'Activate'}
              {actionDialog?.type === 'deactivate' && 'Deactivate'}
              {actionDialog?.type === 'changeRole' && 'Change Role'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
