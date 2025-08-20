import { RankingType } from '@/types'

export interface RankingCalculation {
  userId: string
  type: RankingType
  score: number
  period: string
}

export interface UserStats {
  postsCount: number
  likesReceived: number
  commentsCount: number
  followersCount: number
  weeklyPosts: number
  monthlyPosts: number
  weeklyLikes: number
  monthlyLikes: number
  weeklyComments: number
  monthlyComments: number
}

export const RANKING_WEIGHTS = {
  POSTS_LIKES: {
    likes: 1,
    posts: 0.1,
    comments: 0.05,
    followers: 0.2
  },
  POSTS_COUNT: {
    posts: 1,
    likes: 0.1,
    comments: 0.2,
    followers: 0.05
  },
  COMMENTS_COUNT: {
    comments: 1,
    posts: 0.2,
    likes: 0.1,
    followers: 0.05
  },
  FOLLOWERS_COUNT: {
    followers: 1,
    posts: 0.1,
    likes: 0.2,
    comments: 0.05
  },
  ENGAGEMENT: {
    likes: 0.4,
    comments: 0.3,
    posts: 0.2,
    followers: 0.1
  },
  WEEKLY_ACTIVE: {
    weeklyPosts: 0.4,
    weeklyLikes: 0.3,
    weeklyComments: 0.3
  },
  MONTHLY_ACTIVE: {
    monthlyPosts: 0.4,
    monthlyLikes: 0.3,
    monthlyComments: 0.3
  }
}

export function calculateRankingScore(type: RankingType, stats: UserStats): number {
  const weights = RANKING_WEIGHTS[type]
  let score = 0

  switch (type) {
    case 'POSTS_LIKES':
      score = (
        stats.likesReceived * weights.likes +
        stats.postsCount * weights.posts +
        stats.commentsCount * weights.comments +
        stats.followersCount * weights.followers
      )
      break

    case 'POSTS_COUNT':
      score = (
        stats.postsCount * weights.posts +
        stats.likesReceived * weights.likes +
        stats.commentsCount * weights.comments +
        stats.followersCount * weights.followers
      )
      break

    case 'COMMENTS_COUNT':
      score = (
        stats.commentsCount * weights.comments +
        stats.postsCount * weights.posts +
        stats.likesReceived * weights.likes +
        stats.followersCount * weights.followers
      )
      break

    case 'FOLLOWERS_COUNT':
      score = (
        stats.followersCount * weights.followers +
        stats.postsCount * weights.posts +
        stats.likesReceived * weights.likes +
        stats.commentsCount * weights.comments
      )
      break

    case 'ENGAGEMENT':
      score = (
        stats.likesReceived * weights.likes +
        stats.commentsCount * weights.comments +
        stats.postsCount * weights.posts +
        stats.followersCount * weights.followers
      )
      break

    case 'WEEKLY_ACTIVE':
      score = (
        stats.weeklyPosts * weights.weeklyPosts +
        stats.weeklyLikes * weights.weeklyLikes +
        stats.weeklyComments * weights.weeklyComments
      )
      break

    case 'MONTHLY_ACTIVE':
      score = (
        stats.monthlyPosts * weights.monthlyPosts +
        stats.monthlyLikes * weights.monthlyLikes +
        stats.monthlyComments * weights.monthlyComments
      )
      break

    default:
      score = 0
  }

  return Math.round(score * 100) / 100 // Round to 2 decimal places
}

export function getCurrentPeriod(type: RankingType): string {
  const now = new Date()
  
  switch (type) {
    case 'WEEKLY_ACTIVE':
      // Get the Monday of current week
      const monday = new Date(now)
      monday.setDate(now.getDate() - now.getDay() + 1)
      return `${monday.getFullYear()}-W${getWeekNumber(monday)}`
    
    case 'MONTHLY_ACTIVE':
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    
    default:
      return 'all-time'
  }
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export const RANKING_INFO = {
  POSTS_LIKES: {
    name: 'Most Liked',
    description: 'Users with the most likes on their posts',
    icon: '[HEART]',
    color: 'red'
  },
  POSTS_COUNT: {
    name: 'Most Active Poster',
    description: 'Users who create the most posts',
    icon: '[POST]',
    color: 'blue'
  },
  COMMENTS_COUNT: {
    name: 'Most Engaged',
    description: 'Users who comment the most',
    icon: '[CHAT]',
    color: 'green'
  },
  FOLLOWERS_COUNT: {
    name: 'Most Followed',
    description: 'Users with the most followers',
    icon: '[USERS]',
    color: 'purple'
  },
  ENGAGEMENT: {
    name: 'Overall Engagement',
    description: 'Combined engagement across all activities',
    icon: '[STAR]',
    color: 'yellow'
  },
  WEEKLY_ACTIVE: {
    name: 'Weekly Champion',
    description: 'Most active user this week',
    icon: '[TROPHY]',
    color: 'orange'
  },
  MONTHLY_ACTIVE: {
    name: 'Monthly Champion',
    description: 'Most active user this month',
    icon: '[CROWN]',
    color: 'gold'
  }
}

export function getRankingInfo(type: RankingType) {
  return RANKING_INFO[type]
}

export function getRankingColorClass(type: RankingType): string {
  const info = getRankingInfo(type)
  const colorMap: Record<string, string> = {
    red: 'bg-red-100 text-red-800 border-red-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    gold: 'bg-amber-100 text-amber-800 border-amber-200'
  }
  return colorMap[info.color] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export function getRankBadgeColor(rank: number): string {
  if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300' // Gold
  if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-300' // Silver
  if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-300' // Bronze
  if (rank <= 10) return 'bg-blue-100 text-blue-800 border-blue-200' // Top 10
  return 'bg-slate-100 text-slate-800 border-slate-200' // Others
}

export function getRankEmoji(rank: number): string {
  if (rank === 1) return '[GOLD]'
  if (rank === 2) return '[SILVER]'
  if (rank === 3) return '[BRONZE]'
  if (rank <= 10) return '[MEDAL]'
  return '[CHART]'
}


