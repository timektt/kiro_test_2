'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Users, 
  Bell,
  Search,
  Plus,
  TrendingUp,
  Award,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MockPost {
  id: string
  author: {
    name: string
    username: string
    mbti: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
}

const mockPosts: MockPost[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      username: 'sarahc_intj',
      mbti: 'INTJ',
      avatar: '/avatars/sarah-chen.svg'
    },
    content: 'Just finished reading about cognitive functions and how they shape our decision-making process. The depth of MBTI theory never ceases to amaze me!',
    timestamp: '2m ago',
    likes: 24,
    comments: 8,
    isLiked: false
  },
  {
    id: '2',
    author: {
      name: 'Marcus Johnson',
      username: 'marcus_enfp',
      mbti: 'ENFP',
      avatar: '/avatars/marcus-johnson.svg'
    },
    content: 'Anyone else get super excited about new projects but struggle with the follow-through? Looking for accountability partners!',
    timestamp: '15m ago',
    likes: 42,
    comments: 15,
    isLiked: true
  },
  {
    id: '3',
    author: {
      name: 'Emily Rodriguez',
      username: 'emily_infj',
      mbti: 'INFJ',
    avatar: '/avatars/emily-rodriguez.svg'
    },
    content: 'The connection between personality types and communication styles is fascinating. We should have more discussions about this!',
    timestamp: '1h ago',
    likes: 18,
    comments: 6,
    isLiked: false
  }
]

const mockNotifications = [
  { type: 'like', user: 'David Kim', action: 'liked your post', time: '2m ago' },
  { type: 'comment', user: 'Lisa Thompson', action: 'commented on your post', time: '5m ago' },
  { type: 'follow', user: 'Alex Chen', action: 'started following you', time: '10m ago' }
]

const mockRankings = [
  { rank: 1, name: 'Sarah Chen', mbti: 'INTJ', points: 2847 },
  { rank: 2, name: 'Marcus Johnson', mbti: 'ENFP', points: 2651 },
  { rank: 3, name: 'Emily Rodriguez', mbti: 'INFJ', points: 2398 }
]

export function PlatformPreview() {
  const [activeTab, setActiveTab] = useState<'feed' | 'notifications' | 'rankings'>('feed')
  const [posts, setPosts] = useState(mockPosts)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-cycle through tabs for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        switch (prev) {
          case 'feed': return 'notifications'
          case 'notifications': return 'rankings'
          case 'rankings': return 'feed'
          default: return 'feed'
        }
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleLike = (postId: string) => {
    setIsAnimating(true)
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
    setTimeout(() => setIsAnimating(false), 300)
  }

  const renderFeed = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-primary-foreground" />
          </div>
          <h3 className="font-semibold">Community Feed</h3>
        </div>
        <Button size="sm" className="gap-2" suppressHydrationWarning={true}>
          <Plus className="w-4 h-4" />
          Post
        </Button>
      </div>

      {/* Posts */}
      <div className="space-y-4 px-4 pb-4">
        {posts.slice(0, 2).map((post) => (
          <Card key={post.id} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{post.author.name}</span>
                    <Badge variant="secondary" className="text-xs">{post.author.mbti}</Badge>
                    <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "gap-2 text-xs",
                        post.isLiked && "text-red-500",
                        isAnimating && "animate-pulse"
                      )}
                      onClick={() => handleLike(post.id)}
                      suppressHydrationWarning={true}
                    >
                      <Heart className={cn("w-4 h-4", post.isLiked && "fill-current")} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-xs" suppressHydrationWarning={true}>
                      <MessageSquare className="w-4 h-4" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-xs" suppressHydrationWarning={true}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-xs ml-auto" suppressHydrationWarning={true}>
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <Bell className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold">Notifications</h3>
        <Badge variant="secondary" className="ml-auto">3 new</Badge>
      </div>

      {/* Notifications */}
      <div className="space-y-2 px-4 pb-4">
        {mockNotifications.map((notification, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">{notification.user}</span>
                {' '}{notification.action}
              </p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderRankings = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
          <Award className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold">Community Rankings</h3>
        <Badge variant="secondary" className="ml-auto">Weekly</Badge>
      </div>

      {/* Rankings */}
      <div className="space-y-2 px-4 pb-4">
        {mockRankings.map((user) => (
          <div key={user.rank} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              user.rank === 1 && "bg-yellow-500 text-white",
              user.rank === 2 && "bg-gray-400 text-white",
              user.rank === 3 && "bg-amber-600 text-white"
            )}>
              {user.rank}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{user.name}</span>
                <Badge variant="outline" className="text-xs">{user.mbti}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{user.points.toLocaleString()} points</p>
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-md mx-auto bg-background border rounded-xl shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b">
        {[
          { id: 'feed', label: 'Feed', icon: Users },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'rankings', label: 'Rankings', icon: Award }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors",
              activeTab === id 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            suppressHydrationWarning={true}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'feed' && renderFeed()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'rankings' && renderRankings()}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Brain className="w-4 h-4" />
          <span>Interactive Platform Preview</span>
        </div>
      </div>
    </div>
  )
}

export default PlatformPreview
