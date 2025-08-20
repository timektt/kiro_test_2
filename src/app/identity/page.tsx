'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { MBTIType } from '@/types'
import { useMBTI } from '@/hooks/use-mbti'
import { MBTIProfile } from '@/components/identity/mbti-profile'
import { MBTISelector } from '@/components/identity/mbti-selector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Lock, Unlock } from 'lucide-react'
import Link from 'next/link'

export default function IdentityPage() {
  const { data: session } = useSession()
  const { mbti, isLoading, setMBTI, updateMBTI } = useMBTI(session?.user?.id || null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [selectedType, setSelectedType] = useState<MBTIType | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEdit = () => {
    setSelectedType(mbti?.type || null)
    setIsEditing(true)
    setError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedType(null)
    setError(null)
  }

  const handleConfirm = async () => {
    if (!selectedType) return

    setIsSaving(true)
    setError(null)

    try {
      await setMBTI(selectedType)
      setIsEditing(false)
      setSelectedType(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update identity')
    } finally {
      setIsSaving(false)
    }
  }

  if (!session) {
    return (
      <div className="container max-w-2xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to manage your identity.
            </p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Identity</h1>
            <p className="text-muted-foreground">
              Manage your personality type and how others see you in the community
            </p>
          </div>
          
          {mbti && !isEditing && (
            <Button 
              onClick={handleEdit}
              disabled={mbti.isLocked}
              className="flex items-center gap-2"
            >
              {mbti.isLocked ? (
                <>
                  <Lock className="w-4 h-4" />
                  Locked
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Edit
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5 mb-6">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {mbti && <TabsTrigger value="details">Details</TabsTrigger>}
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {!mbti && !isEditing ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Set Up Your Identity</CardTitle>
                <CardDescription>
                  Choose your personality type to connect with like-minded community members
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setIsEditing(true)} size="lg">
                  Choose Your Type
                </Button>
              </CardContent>
            </Card>
          ) : isEditing ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {mbti ? 'Update Your Identity' : 'Choose Your Identity'}
                  </CardTitle>
                  <CardDescription>
                    {mbti ? 'Select a new personality type' : 'Select your personality type'}
                  </CardDescription>
                </CardHeader>
              </Card>

              <MBTISelector
                selectedType={selectedType}
                onSelect={setSelectedType}
                onConfirm={handleConfirm}
                isLoading={isSaving}
              />

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <MBTIProfile mbti={mbti} />
          )}
        </TabsContent>

        {mbti && (
          <TabsContent value="details" className="space-y-6">
            <MBTIProfile mbti={mbti} showDetails={true} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identity Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {mbti.isLocked ? 'Your identity is locked by an administrator' : 'You can change your identity type'}
                    </p>
                  </div>
                  <Badge variant={mbti.isLocked ? "destructive" : "secondary"}>
                    {mbti.isLocked ? (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 mr-1" />
                        Unlocked
                      </>
                    )}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium">Assigned Date</h4>
                  <p className="text-sm text-muted-foreground">
                    {mbti.assignedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Impact</CardTitle>
              <CardDescription>
                How your identity appears to other community members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Profile Display</h4>
                <p className="text-sm text-muted-foreground">
                  Your MBTI badge appears next to your name on posts, comments, and your profile
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Discoverability</h4>
                <p className="text-sm text-muted-foreground">
                  Other users with similar personality types can find and connect with you
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Community Features</h4>
                <p className="text-sm text-muted-foreground">
                  Participate in type-specific discussions and see personality-based insights
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


