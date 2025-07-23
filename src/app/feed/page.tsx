import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Feed | Community Platform',
  description: 'Your personalized community feed',
}

export default async function FeedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to your Feed</h1>
          <p className="text-muted-foreground mt-2">
            Hello, {session.user.name}! Your community feed will appear here.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🎉 Authentication Success!</CardTitle>
            <CardDescription>
              You have successfully signed in to the community platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {session.user.name}</p>
              <p><strong>Username:</strong> @{session.user.username}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Role:</strong> {session.user.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              The social feed with posts, likes, and comments will be implemented in the next tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stay tuned for more features including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Create and share posts</li>
              <li>Like and comment on posts</li>
              <li>Follow other users</li>
              <li>Real-time notifications</li>
              <li>User profiles and MBTI types</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}