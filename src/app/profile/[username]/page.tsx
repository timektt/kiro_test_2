import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FeedLayout } from '@/components/layouts/feed-layout'
import { ProfileSidebar } from '@/components/layouts/profile-sidebar'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileTabs } from '@/components/profile/profile-tabs'
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
      description: 'The requested user profile could not be found.',
    }
  }

  const displayName = user.name || user.username
  const description = user.bio || `View ${displayName}'s profile, posts, and activity on Community Platform. Connect and discover shared interests.`

  return {
    title: `${displayName} (@${user.username})`,
    description,
    keywords: [
      'profile', 'user', user.username, displayName,
      'community', 'posts', 'social', 'MBTI', user.mbti?.type || 'personality'
    ].filter(Boolean),
    openGraph: {
      title: `${displayName} (@${user.username}) | Community Platform`,
      description,
      type: 'profile',
      url: `/profile/${user.username}`,
      images: user.image ? [
        {
          url: user.image,
          width: 400,
          height: 400,
          alt: `${displayName}'s profile picture`,
        }
      ] : [],
      profile: {
        firstName: user.name?.split(' ')[0],
        lastName: user.name?.split(' ').slice(1).join(' '),
        username: user.username,
      },
    },
    twitter: {
      card: 'summary',
      title: `${displayName} (@${user.username})`,
      description,
      images: user.image ? [user.image] : [],
    },
    alternates: {
      canonical: `/profile/${user.username}`,
    },
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
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          currentUserId={currentUserId}
          isFollowing={false} // TODO: Get actual follow status
          onFollow={() => {
            console.log('Follow user:', user.id)
            // TODO: Implement follow functionality
          }}
          onUnfollow={() => {
            console.log('Unfollow user:', user.id)
            // TODO: Implement unfollow functionality
          }}
          onMessage={() => {
            console.log('Message user:', user.id)
            // TODO: Implement messaging functionality
          }}
        />

        {/* Profile Tabs */}
        <ProfileTabs
          user={user}
          posts={userPosts}
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
      </div>
    </FeedLayout>
  )
}