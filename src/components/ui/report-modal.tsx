'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCreateReport } from '@/hooks/use-reports'
import { cn } from '@/lib/utils'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'POST' | 'USER' | 'COMMENT'
  targetId: string
  targetTitle?: string // For display purposes
}

const REPORT_REASONS = [
  {
    value: 'SPAM',
    label: 'Spam',
    description: 'Unwanted commercial content or repetitive posts',
  },
  {
    value: 'HARASSMENT',
    label: 'Harassment or Bullying',
    description: 'Abusive behavior targeting individuals',
  },
  {
    value: 'INAPPROPRIATE_CONTENT',
    label: 'Inappropriate Content',
    description: 'Content that violates community guidelines',
  },
  {
    value: 'FAKE_ACCOUNT',
    label: 'Fake Account',
    description: 'Impersonation or misleading identity',
  },
  {
    value: 'OTHER',
    label: 'Other',
    description: 'Other violations not listed above',
  },
] as const

export function ReportModal({
  isOpen,
  onClose,
  type,
  targetId,
  targetTitle,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [description, setDescription] = useState('')
  const { submitReport, isSubmitting } = useCreateReport()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedReason) {
      return
    }

    try {
      const reportData = {
        type,
        reason: selectedReason as any,
        description: description.trim() || undefined,
        ...(type === 'POST' && { reportedPostId: targetId }),
        ...(type === 'USER' && { reportedUserId: targetId }),
        ...(type === 'COMMENT' && { reportedCommentId: targetId }),
      }

      await submitReport(reportData)
      onClose()
      
      // Reset form
      setSelectedReason('')
      setDescription('')
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setSelectedReason('')
      setDescription('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Report {type.toLowerCase()}
            </h2>
            {targetTitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                "{targetTitle}"
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white">
                Why are you reporting this {type.toLowerCase()}?
              </Label>
              <RadioGroup
                value={selectedReason}
                onValueChange={setSelectedReason}
                className="mt-3 space-y-3"
              >
                {REPORT_REASONS.map((reason) => (
                  <div key={reason.value} className="flex items-start space-x-3">
                    <RadioGroupItem
                      value={reason.value}
                      id={reason.value}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={reason.value}
                        className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                      >
                        {reason.label}
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label 
                htmlFor="description"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Additional details (optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide any additional context that might help us understand the issue..."
                className="mt-2 min-h-[80px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description.length}/500 characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedReason || isSubmitting}
              className={cn(
                "min-w-[100px]",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}