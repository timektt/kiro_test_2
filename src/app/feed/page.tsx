import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FeedLayout } from '@/components/layouts/feed-layout'
import { PostComposer } from '@/components/ui/post-composer'
import { TrendingSidebar } from '@/components/ui/trending-sidebar'
import { InteractiveFeed } from '@/components/feed/interactive-feed'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import { getMockPosts } from '@/lib/mock-data'

export const metadata = {
  title: 'Feed | Community Platform',
  description: 'Your personalized community feed',
}

export default async function FeedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Get mock posts for demonstration
  const posts = getMockPosts(10)
  const currentUser = session.user

  // Sidebar content
  const sidebar = <TrendingSidebar />

  return (
    <FeedLayout sidebar={sidebar}>
      <div className="space-y-6">
        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  Welcome back, {session.user.name}! 👋
                </h1>
                <p className="text-muted-foreground text-sm">
                  Catch up with your community and share what&apos;s on your mind.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Post */}
        <PostComposer
          currentUser={{
            id: currentUser.id,
            name: currentUser.name || null,
            username: currentUser.username || '',
            image: currentUser.image || null,
          }}
          onSubmit={(content, imageUrl, visibility) => {
            console.log('Creating post:', { content, imageUrl, visibility })
            // TODO: Implement post creation
          }}
        />

        {/* Interactive Feed */}
        <InteractiveFeed
          initialPosts={posts}
          currentUserId={currentUser.id}
        />
      </div>

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton
        onCreatePost={() => {
          console.log('Create post from FAB')
          // TODO: Scroll to post composer or open modal
        }}
        onAddImage={() => {
          console.log('Add image from FAB')
          // TODO: Open image picker
        }}
        onAddEmoji={() => {
          console.log('Add emoji from FAB')
          // TODO: Open emoji picker
        }}
      />
    </FeedLayout>
  )
}