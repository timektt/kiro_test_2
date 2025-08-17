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
  { value: 'PUBLIC', label: 'สาธารณะ', description: 'ทุกคนสามารถเห็นได้' },
  { value: 'FOLLOWERS_ONLY', label: 'ผู้ติดตามเท่านั้น', description: 'เฉพาะผู้ที่ติดตามคุณ' },
  { value: 'PRIVATE', label: 'ส่วนตัว', description: 'เฉพาะคุณเท่านั้น' }
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
      toast.error('เกิดข้อผิดพลาดในการโหลดการตั้งค่า')
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
      toast.success('บันทึกการตั้งค่าเรียบร้อยแล้ว')
    } catch (error) {
      console.error('Error saving privacy settings:', error)
      toast.error('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
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
            การตั้งค่าความเป็นส่วนตัว
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">กำลังโหลด...</span>
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
            การตั้งค่าความเป็นส่วนตัว
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            ไม่สามารถโหลดการตั้งค่าได้
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
            การมองเห็นโปรไฟล์
          </CardTitle>
          <CardDescription>
            ควบคุมว่าใครสามารถเห็นโปรไฟล์และโพสต์ของคุณได้
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">การมองเห็นโปรไฟล์</Label>
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
            <Label htmlFor="post-visibility">การมองเห็นโพสต์</Label>
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
                <Label>แสดงสถานะออนไลน์</Label>
                <p className="text-sm text-muted-foreground">
                  ให้ผู้อื่นเห็นว่าคุณออนไลน์อยู่หรือไม่
                </p>
              </div>
              <Switch
                checked={settings.showOnlineStatus}
                onCheckedChange={(checked) => updateSetting('showOnlineStatus', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>แสดง MBTI</Label>
                <p className="text-sm text-muted-foreground">
                  แสดงประเภทบุคลิกภาพ MBTI ในโปรไฟล์
                </p>
              </div>
              <Switch
                checked={settings.showMBTI}
                onCheckedChange={(checked) => updateSetting('showMBTI', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>แสดงจำนวนผู้ติดตาม</Label>
                <p className="text-sm text-muted-foreground">
                  แสดงจำนวนผู้ติดตามในโปรไฟล์
                </p>
              </div>
              <Switch
                checked={settings.showFollowersCount}
                onCheckedChange={(checked) => updateSetting('showFollowersCount', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>แสดงจำนวนการติดตาม</Label>
                <p className="text-sm text-muted-foreground">
                  แสดงจำนวนคนที่คุณติดตามในโปรไฟล์
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
            การโต้ตอบ
          </CardTitle>
          <CardDescription>
            ควบคุมว่าใครสามารถโต้ตอบกับคุณได้อย่างไร
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>อนุญาตข้อความส่วนตัว</Label>
              <p className="text-sm text-muted-foreground">
                ให้ผู้อื่นส่งข้อความส่วนตัวถึงคุณได้
              </p>
            </div>
            <Switch
              checked={settings.allowDirectMessages}
              onCheckedChange={(checked) => updateSetting('allowDirectMessages', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>อนุญาตการแท็ก</Label>
              <p className="text-sm text-muted-foreground">
                ให้ผู้อื่นแท็กคุณในโพสต์และความคิดเห็นได้
              </p>
            </div>
            <Switch
              checked={settings.allowMentions}
              onCheckedChange={(checked) => updateSetting('allowMentions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>อนุญาตคำขอติดตาม</Label>
              <p className="text-sm text-muted-foreground">
                ให้ผู้อื่นส่งคำขอติดตามคุณได้
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
            การแจ้งเตือน
          </CardTitle>
          <CardDescription>
            เลือกประเภทการแจ้งเตือนที่คุณต้องการรับ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>การแจ้งเตือนทางอีเมล</Label>
              <p className="text-sm text-muted-foreground">
                รับการแจ้งเตือนผ่านอีเมล
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>การแจ้งเตือนแบบ Push</Label>
              <p className="text-sm text-muted-foreground">
                รับการแจ้งเตือนแบบ Push บนเบราว์เซอร์
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
              <Label>แจ้งเตือนความคิดเห็น</Label>
              <p className="text-sm text-muted-foreground">
                เมื่อมีคนแสดงความคิดเห็นในโพสต์ของคุณ
              </p>
            </div>
            <Switch
              checked={settings.commentNotifications}
              onCheckedChange={(checked) => updateSetting('commentNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>แจ้งเตือนการถูกใจ</Label>
              <p className="text-sm text-muted-foreground">
                เมื่อมีคนกดถูกใจโพสต์ของคุณ
              </p>
            </div>
            <Switch
              checked={settings.likeNotifications}
              onCheckedChange={(checked) => updateSetting('likeNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>แจ้งเตือนการติดตาม</Label>
              <p className="text-sm text-muted-foreground">
                เมื่อมีคนติดตามคุณ
              </p>
            </div>
            <Switch
              checked={settings.followNotifications}
              onCheckedChange={(checked) => updateSetting('followNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>แจ้งเตือนการแท็ก</Label>
              <p className="text-sm text-muted-foreground">
                เมื่อมีคนแท็กคุณในโพสต์หรือความคิดเห็น
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
                คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    'บันทึกการตั้งค่า'
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