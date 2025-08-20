'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Loader2, Shield, Eye, Bell, MessageSquare, Users } from 'lucide-react'
import { toast } from 'sonner'

interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE'
  postVisibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE'
  allowDirectMessages: boolean
  allowMentions: boolean
  allowFollowRequests: boolean
  showOnlineStatus: boolean
  showMBTI: boolean
  showFollowersCount: boolean
  showFollowingCount: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  commentNotifications: boolean
  likeNotifications: boolean
  followNotifications: boolean
  mentionNotifications: boolean
}

const visibilityOptions = [
  { value: 'PUBLIC', label: 'Public', description: 'Everyone can see' },
  { value: 'FOLLOWERS_ONLY', label: 'Followers Only', description: 'Only your followers' },
  { value: 'PRIVATE', label: 'Private', description: 'Only you' }
]

export default function PrivacySettingsForm() {
  const [settings, setSettings] = useState<PrivacySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/privacy/settings')
      
      if (!response.ok) {
        throw new Error('Failed to load privacy settings')
      }

      const data = await response.json()
      setSettings(data.settings)
    } catch (error) {
      console.error('Error loading privacy settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => {
    if (!settings) return
    
    setSettings(prev => {
      if (!prev) return prev
      return { ...prev, [key]: value }
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!settings || !hasChanges) return

    try {
      setIsSaving(true)
      const response = await fetch('/api/privacy/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }

      setHasChanges(false)
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving privacy settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    loadSettings()
    setHasChanges(false)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Unable to load settings
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your profile and posts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE') => 
                updateSetting('profileVisibility', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visibilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-visibility">Post Visibility</Label>
            <Select
              value={settings.postVisibility}
              onValueChange={(value: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE') => 
                updateSetting('postVisibility', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visibilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Online Status</Label>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're online
                </p>
              </div>
              <Switch
                checked={settings.showOnlineStatus}
                onCheckedChange={(checked) => updateSetting('showOnlineStatus', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show MBTI</Label>
                <p className="text-sm text-muted-foreground">
                  Display MBTI personality type in profile
                </p>
              </div>
              <Switch
                checked={settings.showMBTI}
                onCheckedChange={(checked) => updateSetting('showMBTI', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Followers Count</Label>
                <p className="text-sm text-muted-foreground">
                  Display follower count in profile
                </p>
              </div>
              <Switch
                checked={settings.showFollowersCount}
                onCheckedChange={(checked) => updateSetting('showFollowersCount', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Following Count</Label>
                <p className="text-sm text-muted-foreground">
                  Display following count in profile
                </p>
              </div>
              <Switch
                checked={settings.showFollowingCount}
                onCheckedChange={(checked) => updateSetting('showFollowingCount', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interaction Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Interactions
          </CardTitle>
          <CardDescription>
            Control how others can interact with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Direct Messages</Label>
              <p className="text-sm text-muted-foreground">
                Let others send you private messages
              </p>
            </div>
            <Switch
              checked={settings.allowDirectMessages}
              onCheckedChange={(checked) => updateSetting('allowDirectMessages', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Tagging</Label>
              <p className="text-sm text-muted-foreground">
                Let others tag you in posts and comments
              </p>
            </div>
            <Switch
              checked={settings.allowMentions}
              onCheckedChange={(checked) => updateSetting('allowMentions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Follow Requests</Label>
              <p className="text-sm text-muted-foreground">
                Let others send you follow requests
              </p>
            </div>
            <Switch
              checked={settings.allowFollowRequests}
              onCheckedChange={(checked) => updateSetting('allowFollowRequests', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose which types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in browser
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Comment Notifications</Label>
              <p className="text-sm text-muted-foreground">
                When someone comments on your posts
              </p>
            </div>
            <Switch
              checked={settings.commentNotifications}
              onCheckedChange={(checked) => updateSetting('commentNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Like Notifications</Label>
              <p className="text-sm text-muted-foreground">
                When someone likes your posts
              </p>
            </div>
            <Switch
              checked={settings.likeNotifications}
              onCheckedChange={(checked) => updateSetting('likeNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Follow Notifications</Label>
              <p className="text-sm text-muted-foreground">
                When someone follows you
              </p>
            </div>
            <Switch
              checked={settings.followNotifications}
              onCheckedChange={(checked) => updateSetting('followNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mention Notifications</Label>
              <p className="text-sm text-muted-foreground">
                When someone mentions you in posts or comments
              </p>
            </div>
            <Switch
              checked={settings.mentionNotifications}
              onCheckedChange={(checked) => updateSetting('mentionNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Actions */}
      {hasChanges && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                You have unsaved changes
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
