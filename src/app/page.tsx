import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // Redirect authenticated users to feed
  if (session) {
    redirect('/feed')
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Welcome to{' '}
              <span className="text-primary">Community Platform</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect, share, and engage with a vibrant community. 
              Discover your personality type, share your thoughts, and build meaningful connections.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">
                Get Started
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signin">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧠 MBTI Integration
                </CardTitle>
                <CardDescription>
                  Discover your personality type and connect with like-minded individuals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💬 Social Feed
                </CardTitle>
                <CardDescription>
                  Share posts, engage with comments, and build your community presence
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏆 Leaderboards
                </CardTitle>
                <CardDescription>
                  Compete in various categories and climb the community rankings
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Authentication Options */}
          <div className="mt-16 p-6 bg-muted/50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Multiple Sign-in Options</h2>
            <p className="text-muted-foreground mb-4">
              Choose your preferred way to join the community
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Google OAuth
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                GitHub OAuth
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Email & Password
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}