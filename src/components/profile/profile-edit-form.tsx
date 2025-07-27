'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, X, Save, Loader2, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { userSchema, type UserInput } from '@/lib/validations'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

interface ProfileEditFormProps {
  user: User & {
    mbti?: { type: string } | null
  }
  onCancel: () => void
  onSuccess?: (updatedUser: User) => void
}

export function ProfileEditForm({ user, onCancel, onSuccess }: ProfileEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user.image || '')
  const [avatarPreview, setAvatarPreview] = useState(user.image || '')

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user.username,
      name: user.name || '',
      bio: user.bio || '',
      socialLinks: {
        twitter: (user.socialLinks as any)?.twitter || '',
        github: (user.socialLinks as any)?.github || '',
        linkedin: (user.socialLinks as any)?.linkedin || '',
      },
    },
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url)
    setAvatarPreview(url)
  }

  const handleAvatarUpload = async () => {
    if (!avatarUrl || avatarUrl === user.image) return

    try {
      const response = await fetch(`/api/users/${user.id}/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: avatarUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to update avatar')
      }

      const result = await response.json()
      if (result.success) {
        setAvatarPreview(avatarUrl)
      }
    } catch (error) {
      console.error('Error updating avatar:', error)
      setAvatarUrl(user.image || '')
      setAvatarPreview(user.image || '')
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/avatar`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove avatar')
      }

      const result = await response.json()
      if (result.success) {
        setAvatarUrl('')
        setAvatarPreview('')
      }
    } catch (error) {
      console.error('Error removing avatar:', error)
    }
  }

  const onSubmit = async (data: UserInput) => {
    setIsLoading(true)

    try {
      // Update avatar if changed
      if (avatarUrl !== user.image) {
        await handleAvatarUpload()
      }

      // Update profile data
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      if (result.success) {
        onSuccess?.(result.data)
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your profile information and avatar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview} alt={user.name || 'User'} />
                  <AvatarFallback className="text-2xl">
                    {user.name ? getInitials(user.name) : user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="avatar-url"
                    type="url"
                    placeholder="Enter image URL..."
                    value={avatarUrl}
                    onChange={(e) => handleAvatarChange(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarUpload}
                    disabled={!avatarUrl || avatarUrl === user.image}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a URL to your profile image
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  className={cn(errors.username && 'border-destructive')}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={cn(errors.name && 'border-destructive')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Tell us about yourself..."
                className={cn('min-h-[100px]', errors.bio && 'border-destructive')}
                maxLength={500}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('bio')?.length || 0}/500 characters
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Social Links</Label>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="twitter" className="text-sm">Twitter</Label>
                    <Input
                      id="twitter"
                      type="url"
                      placeholder="https://twitter.com/username"
                      {...register('socialLinks.twitter')}
                      className={cn(errors.socialLinks?.twitter && 'border-destructive')}
                    />
                    {errors.socialLinks?.twitter && (
                      <p className="text-sm text-destructive">{errors.socialLinks.twitter.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="github" className="text-sm">GitHub</Label>
                    <Input
                      id="github"
                      type="url"
                      placeholder="https://github.com/username"
                      {...register('socialLinks.github')}
                      className={cn(errors.socialLinks?.github && 'border-destructive')}
                    />
                    {errors.socialLinks?.github && (
                      <p className="text-sm text-destructive">{errors.socialLinks.github.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      {...register('socialLinks.linkedin')}
                      className={cn(errors.socialLinks?.linkedin && 'border-destructive')}
                    />
                    {errors.socialLinks?.linkedin && (
                      <p className="text-sm text-destructive">{errors.socialLinks.linkedin.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading || !isDirty}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

