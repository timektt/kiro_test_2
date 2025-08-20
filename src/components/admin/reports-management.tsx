'use client'

import { useState } from 'react'
import { Eye, MessageSquare, User, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAdminReports, useReportStats } from '@/hooks/use-reports'
import { cn } from '@/lib/utils'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  REVIEWED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  DISMISSED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const TYPE_ICONS = {
  POST: FileText,
  USER: User,
  COMMENT: MessageSquare,
  CHAT_MESSAGE: MessageSquare,
}

export function ReportsManagement() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL')
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [newStatus, setNewStatus] = useState<string>('')
  const [newPriority, setNewPriority] = useState<string>('')

  const {
    reports,
    pagination,
    isLoading,
    error,
    refresh,
    updateReport,
    isUpdating,
  } = useAdminReports({
    page: currentPage,
    limit: 20,
    status: statusFilter as any,
    type: typeFilter as any,
    priority: priorityFilter as any,
  })

  const { stats } = useReportStats()

  const handleUpdateReport = async () => {
    if (!selectedReport || !newStatus) return

    try {
      await updateReport(selectedReport, {
        status: newStatus as any,
        adminNotes: adminNotes.trim() || undefined,
        priority: newPriority as any || undefined,
      })
      
      // Reset form
      setSelectedReport(null)
      setAdminNotes('')
      setNewStatus('')
      setNewPriority('')
    } catch (error) {
      // Error handled by hook
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getReportTarget = (report: any) => {
    if (report.reportedUser) {
      return {
        type: 'User',
        title: `@${report.reportedUser.username}`,
        subtitle: report.reportedUser.name || report.reportedUser.email,
      }
    }
    if (report.reportedPost) {
      return {
        type: 'Post',
        title: report.reportedPost.content.substring(0, 50) + '...',
        subtitle: `by @${report.reportedPost.author.username}`,
      }
    }
    if (report.reportedComment) {
      return {
        type: 'Comment',
        title: report.reportedComment.content.substring(0, 50) + '...',
        subtitle: `by @${report.reportedComment.author.username}`,
      }
    }
    return { type: 'Unknown', title: 'Unknown target', subtitle: '' }
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          Error loading reports: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
                  <p className="text-2xl font-bold">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Reports Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REVIEWED">Reviewed</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="DISMISSED">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="POST">Posts</SelectItem>
                  <SelectItem value="USER">Users</SelectItem>
                  <SelectItem value="COMMENT">Comments</SelectItem>
                  <SelectItem value="CHAT_MESSAGE">Chat Messages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No reports found matching the current filters.
              </div>
            ) : (
              reports.map((report) => {
                const target = getReportTarget(report)
                const TypeIcon = TYPE_ICONS[report.type]
                
                return (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <TypeIcon className="h-5 w-5 text-gray-400 mt-1" />
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={cn('text-xs', STATUS_COLORS[report.status])}>
                                {report.status}
                              </Badge>
                              <Badge className={cn('text-xs', PRIORITY_COLORS[report.priority])}>
                                {report.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDate(report.createdAt)}
                              </span>
                            </div>
                            
                            <div className="mb-2">
                              <p className="font-medium text-sm">
                                {target.type}: {target.title}
                              </p>
                              <p className="text-xs text-gray-500">{target.subtitle}</p>
                            </div>
                            
                            <div className="mb-2">
                              <p className="text-sm">
                                <span className="font-medium">Reason:</span> {report.reason.replace('_', ' ')}
                              </p>
                              {report.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {report.description}
                                </p>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-500">
                              Reported by @{report.reporter.username}
                            </p>
                            
                            {report.adminNotes && (
                              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                                <span className="font-medium">Admin Notes:</span> {report.adminNotes}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report.id)
                            setNewStatus(report.status)
                            setNewPriority(report.priority)
                            setAdminNotes(report.adminNotes || '')
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} reports
              </p>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          />
          
          <Card className="relative w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Review Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="DISMISSED">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Priority</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your review..."
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReport(null)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateReport}
                  disabled={isUpdating || !newStatus}
                >
                  {isUpdating ? 'Updating...' : 'Update Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
