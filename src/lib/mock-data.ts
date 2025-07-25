import type { Post, User, MBTIType } from '@/types'

// Mock users data
export const mockUsers: Array<User & { mbti?: { type: MBTIType } | null }> = [
  {
    id: '1',
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Software developer passionate about web technologies and clean code. Love building scalable applications.',
    socialLinks: {
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
    },
    role: 'USER' as const,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    mbti: { 
      id: 'mbti-1',
      type: 'INTJ',
      description: 'The Architect - Strategic and independent thinker',
      userId: '1',
      assignedAt: new Date('2024-01-15'),
      isLocked: true,
    },
    _count: {
      posts: 24,
      followers: 156,
      following: 89,
      likes: 342,
      comments: 128,
    },
  },
  {
    id: '2',
    username: 'janesmith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'UI/UX designer and frontend enthusiast. Creating beautiful and intuitive user experiences.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/janesmith',
      twitter: 'https://twitter.com/janesmith',
      github: 'https://github.com/janesmith',
    },
    role: 'USER' as const,
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    mbti: { 
      id: 'mbti-2',
      type: 'ENFP',
      description: 'The Campaigner - Enthusiastic and creative',
      userId: '2',
      assignedAt: new Date('2024-01-10'),
      isLocked: true,
    },
    _count: {
      posts: 18,
      followers: 203,
      following: 124,
      likes: 289,
      comments: 156,
    },
  },
  {
    id: '3',
    username: 'alexchen',
    name: 'Alex Chen',
    email: 'alex@example.com',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    bio: 'Full-stack developer and tech enthusiast. Always learning new technologies.',
    socialLinks: {
      github: 'https://github.com/alexchen',
      twitter: 'https://twitter.com/alexchen',
    },
    role: 'USER' as const,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
    mbti: { 
      id: 'mbti-3',
      type: 'ISTP',
      description: 'The Virtuoso - Practical and hands-on problem solver',
      userId: '3',
      assignedAt: new Date('2024-01-05'),
      isLocked: true,
    },
    _count: {
      posts: 31,
      followers: 98,
      following: 67,
      likes: 198,
      comments: 89,
    },
  },
  {
    id: '4',
    username: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Platform administrator with full access to manage users and content.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/admin',
    },
    role: 'ADMIN' as const,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-23'),
    mbti: { 
      id: 'mbti-4',
      type: 'ENTJ',
      description: 'The Commander - Bold and strong-willed leader',
      userId: '4',
      assignedAt: new Date('2024-01-01'),
      isLocked: true,
    },
    _count: {
      posts: 12,
      followers: 45,
      following: 23,
      likes: 67,
      comments: 34,
    },
  },
]

// Mock posts data
export const mockPosts: Array<Post & {
  author: User & { mbti?: { type: MBTIType } | null }
  _count: { likes: number; comments: number }
}> = [
  {
    id: '1',
    content: 'Welcome to our community platform! Excited to connect with everyone here and share knowledge. 🚀\n\nLooking forward to building amazing things together!',
    imageUrl: null,
    authorId: '1',
    isPublic: true,
    createdAt: new Date('2024-01-23T10:30:00Z'),
    updatedAt: new Date('2024-01-23T10:30:00Z'),
    author: mockUsers[0],
    _count: {
      likes: 12,
      comments: 5,
    },
  },
  {
    id: '2',
    content: 'Just finished working on a new design system. The power of consistent UI components is amazing!\n\nHere are some key principles I follow:\n- Consistency is key\n- Accessibility first\n- Performance matters',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    authorId: '2',
    isPublic: true,
    createdAt: new Date('2024-01-23T08:15:00Z'),
    updatedAt: new Date('2024-01-23T08:15:00Z'),
    author: mockUsers[1],
    _count: {
      likes: 8,
      comments: 3,
    },
  },
  {
    id: '3',
    content: 'Been experimenting with some new JavaScript frameworks lately. The ecosystem keeps evolving so fast!\n\nWhat are your favorite tools for modern web development?',
    imageUrl: null,
    authorId: '3',
    isPublic: true,
    createdAt: new Date('2024-01-22T16:45:00Z'),
    updatedAt: new Date('2024-01-22T16:45:00Z'),
    author: mockUsers[2],
    _count: {
      likes: 15,
      comments: 8,
    },
  },
  {
    id: '4',
    content: 'Community update: We\'ve added new features to enhance your experience!\n\n✨ New MBTI integration\n🎯 Improved ranking system\n📱 Better mobile experience\n\nLet us know what you think!',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    authorId: '4',
    isPublic: true,
    createdAt: new Date('2024-01-22T14:20:00Z'),
    updatedAt: new Date('2024-01-22T14:20:00Z'),
    author: mockUsers[3],
    _count: {
      likes: 24,
      comments: 12,
    },
  },
  {
    id: '5',
    content: 'Working on a new project that combines AI and web development. The possibilities are endless!\n\nAnyone else excited about the future of AI-assisted development?',
    imageUrl: null,
    authorId: '1',
    isPublic: true,
    createdAt: new Date('2024-01-21T11:30:00Z'),
    updatedAt: new Date('2024-01-21T11:30:00Z'),
    author: mockUsers[0],
    _count: {
      likes: 19,
      comments: 7,
    },
  },
  {
    id: '6',
    content: 'Just discovered this amazing color palette generator. Design tools keep getting better!\n\nSharing some inspiration for fellow designers 🎨',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=400&fit=crop',
    authorId: '2',
    isPublic: true,
    createdAt: new Date('2024-01-21T09:15:00Z'),
    updatedAt: new Date('2024-01-21T09:15:00Z'),
    author: mockUsers[1],
    _count: {
      likes: 11,
      comments: 4,
    },
  },
]

// Helper functions
export function getMockUserById(id: string) {
  return mockUsers.find(user => user.id === id)
}

export function getMockUserByUsername(username: string) {
  return mockUsers.find(user => user.username === username)
}

export function getMockPostById(id: string) {
  return mockPosts.find(post => post.id === id)
}

export function getMockPostsByUserId(userId: string) {
  return mockPosts.filter(post => post.authorId === userId)
}

export function getMockPosts(limit = 10, offset = 0) {
  return mockPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(offset, offset + limit)
}
