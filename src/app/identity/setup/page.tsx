'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MBTIType } from '@/types'
import { MBTISelector } from '@/components/identity/mbti-selector'
import { useMBTI } from '@/hooks/use-mbti'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, PartyPopper } from 'lucide-react'
import Link from 'next/link'

export default function IdentitySetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { setMBTI } = useMBTI(session?.user?.id || null)
  
  const [selectedType, setSelectedType] = useState<MBTIType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!selectedType || !session?.user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      await setMBTI(selectedType)
      router.push('/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set identity')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="container max-w-2xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to set up your identity.
            </p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
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
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              Welcome to the Community!
              <PartyPopper className="w-6 h-6" />
            </CardTitle>
            <CardDescription className="text-base">
              Choose your personality type to help others understand you better and connect with like-minded community members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl">[MASK]</div>
                <h3 className="font-semibold">Express Yourself</h3>
                <p className="text-sm text-muted-foreground">
                  Show your unique personality to the community
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">[HANDSHAKE]</div>
                <h3 className="font-semibold">Find Your Tribe</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with others who share similar traits
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">[STAR]</div>
                <h3 className="font-semibold">Stand Out</h3>
                <p className="text-sm text-muted-foreground">
                  Your identity badge will appear on all your posts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        <MBTISelector
          selectedType={selectedType}
          onSelect={setSelectedType}
          onConfirm={handleConfirm}
          isLoading={isLoading}
        />

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-xl">[BULB]</div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Not sure about your type?</h4>
                <p className="text-xs text-muted-foreground">
                  Don't worry! You can always change your selection later. Choose the one that feels most like you right now.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


