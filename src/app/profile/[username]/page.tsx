import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FeedLayout } from '@/components/layouts/feed-layout'
import { ProfileSidebar } from '@/components/layouts/profile-sidebar'
import { PostItem } from '@/components/ui/post-item'
import { EmptyState } from '@/components/ui/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Calendar, Trophy } from 'lucide-react'
import { getMockUserByUsername, getMockPostsByUserId } from '@/lib/mock-data'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const user = getMockUserByUsername(params.username)
  
  if (!user) {
    return {
      title: 'User Not Found | Community Platform',
    }
  }

  return {
    title: `${user.name || user.username} (@${user.username}) | Community Platform`,
    description: user.bio || `View ${user.name || user.username}'s profile on Community Platform`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions)
  const user = getMockUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  const userPosts = getMockPostsByUserId(user.id)
  const currentUserId = session?.user?.id

  // Profile sidebar
  const sidebar = (
    <ProfileSidebar 
      user={user} 
      currentUserId={currentUserId}
    />
  )

  return (
    <FeedLayout sidebar={sidebar}>
      <div className="space-y-6">
        {/* Profile Header - Mobile */}
        <div className="lg:hidden">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{user.name || user.username}</CardTitle>
              <p className="text-muted-foreground">@{user.username}</p>
            </CardHeader>
            {user.bio && (
              <CardContent>
                <p className="text-sm leading-relaxed">{user.bio}</p>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <FileText className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <div className="text-2xl font-bold">{user._count?.posts || 0}</div>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Trophy className="h-8 w-8 text-yellow-500 mr-4" />
              <div>
                <div className="text-2xl font-bold">#42</div>
                <p className="text-xs text-muted-foreground">Ranking</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <p className="text-xs text-muted-foreground">Days Active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Posts ({userPosts.length})
            </CardTitle>
          </CardHeader>
        </Card>

        {/* User Posts */}
        {userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onLike={(postId) => {
                  console.log('Liked post:', postId)
                  // TODO: Implement like functionality
                }}
                onComment={(postId) => {
                  console.log('Comment on post:', postId)
                  // TODO: Implement comment functionality
                }}
                onShare={(postId) => {
                  console.log('Share post:', postId)
                  // TODO: Implement share functionality
                }}
                onBookmark={(postId) => {
                  console.log('Bookmark post:', postId)
                  // TODO: Implement bookmark functionality
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No posts yet"
            description={
              currentUserId === user.id
                ? "You haven't created any posts yet. Share your first thought!"
                : `${user.name || user.username} hasn't posted anything yet.`
            }
            action={
              currentUserId === user.id
                ? {
                    label: 'Create your first post',
                    onClick: () => {
                      // TODO: Navigate to create post
                      console.log('Navigate to create post')
                    },
                  }
                : undefined
            }
          />
        )}
      </div>
    </FeedLayout>
  )
}