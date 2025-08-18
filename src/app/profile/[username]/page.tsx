'use client'

import { notFound } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FeedLayout } from '@/components/layouts/feed-layout'
import { ProfileSidebar } from '@/components/layouts/profile-sidebar'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileTabs } from '@/components/profile/profile-tabs'
import { getMockUserByUsername, getMockPostsByUserId } from '@/lib/mock-data'
import { useFollow } from '@/hooks/use-follow'
import { useMessaging } from '@/hooks/use-messaging'
import { useLikePost, useBookmarkPost, useSharePost } from '@/hooks/use-posts'
import { useRouter } from 'next/navigation'

interface ProfilePageProps {
  params: {
    username: string
  }
}

// Note: Metadata generation moved to layout.tsx since this is now a client component

export default function ProfilePage({ params }: ProfilePageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const user = getMockUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  const userPosts = getMockPostsByUserId(user.id)
  const currentUserId = session?.user?.id

  // Custom hooks for profile interactions
  const { isFollowing, isToggling, toggleFollow } = useFollow(user.id)
  const { startConversation } = useMessaging()
  const { toggleLike } = useLikePost()
  const { toggleBookmark } = useBookmarkPost()
  const { sharePost } = useSharePost()

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
          isFollowing={isFollowing}
          isToggling={isToggling}
          onFollow={toggleFollow}
          onUnfollow={toggleFollow}
          onMessage={() => startConversation(user.id)}
        />

        {/* Profile Tabs */}
        <ProfileTabs
          user={user}
          posts={userPosts}
          currentUserId={currentUserId}
          onLike={(postId) => toggleLike(postId)}
          onComment={(postId) => {
            router.push(`/posts/${postId}#comments`)
          }}
          onShare={(postId) => sharePost(postId)}
          onBookmark={(postId) => toggleBookmark(postId)}
        />
      </div>
    </FeedLayout>
  )
}