import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      bio: 'Platform administrator with full access to manage users and content.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/admin',
      },
    },
  })

  // Create regular users with MBTI types
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      username: 'johndoe',
      email: 'john@example.com',
      name: 'John Doe',
      bio: 'Software developer passionate about web technologies and clean code. Love building scalable applications.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      socialLinks: {
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
      },
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      username: 'janesmith',
      email: 'jane@example.com',
      name: 'Jane Smith',
      bio: 'UI/UX designer and frontend enthusiast. Creating beautiful and intuitive user experiences.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/janesmith',
        twitter: 'https://twitter.com/janesmith',
        github: 'https://github.com/janesmith',
      },
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      username: 'alexchen',
      email: 'alex@example.com',
      name: 'Alex Chen',
      bio: 'Full-stack developer and tech enthusiast. Always learning new technologies.',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      socialLinks: {
        github: 'https://github.com/alexchen',
        twitter: 'https://twitter.com/alexchen',
      },
    },
  })

  // Assign MBTI types to users
  await prisma.mBTI.create({
    data: {
      type: 'INTJ',
      description: 'The Architect - Strategic and independent thinker',
      userId: user1.id,
    },
  })

  await prisma.mBTI.create({
    data: {
      type: 'ENFP',
      description: 'The Campaigner - Enthusiastic and creative',
      userId: user2.id,
    },
  })

  await prisma.mBTI.create({
    data: {
      type: 'ISTP',
      description: 'The Virtuoso - Practical and hands-on problem solver',
      userId: user3.id,
    },
  })

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      content: 'Welcome to our community platform! Excited to connect with everyone here and share knowledge. 🚀\n\nLooking forward to building amazing things together!',
      authorId: user1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      content: 'Just finished working on a new design system. The power of consistent UI components is amazing!\n\nHere are some key principles I follow:\n- Consistency is key\n- Accessibility first\n- Performance matters',
      authorId: user2.id,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      content: 'Been experimenting with some new JavaScript frameworks lately. The ecosystem keeps evolving so fast!\n\nWhat are your favorite tools for modern web development?',
      authorId: user3.id,
    },
  })

  // Create sample comments
  const comment1 = await prisma.comment.create({
    data: {
      content: 'Great to have you here! Looking forward to your contributions and insights.',
      postId: post1.id,
      authorId: user2.id,
    },
  })

  const comment2 = await prisma.comment.create({
    data: {
      content: 'Would love to see some screenshots of your design system! Sounds really interesting.',
      postId: post2.id,
      authorId: user1.id,
    },
  })

  const comment3 = await prisma.comment.create({
    data: {
      content: 'I\'ve been loving Next.js and TypeScript combo lately. What about you?',
      postId: post3.id,
      authorId: user2.id,
    },
  })

  // Create sample likes
  await prisma.like.create({
    data: {
      postId: post1.id,
      userId: user2.id,
    },
  })

  await prisma.like.create({
    data: {
      postId: post1.id,
      userId: user3.id,
    },
  })

  await prisma.like.create({
    data: {
      postId: post2.id,
      userId: user1.id,
    },
  })

  await prisma.like.create({
    data: {
      postId: post3.id,
      userId: user1.id,
    },
  })

  // Create sample follow relationships
  await prisma.follow.create({
    data: {
      followerId: user1.id,
      followingId: user2.id,
    },
  })

  await prisma.follow.create({
    data: {
      followerId: user2.id,
      followingId: user3.id,
    },
  })

  await prisma.follow.create({
    data: {
      followerId: user3.id,
      followingId: user1.id,
    },
  })

  // Create sample notifications
  await prisma.notification.create({
    data: {
      type: 'FOLLOW',
      message: 'John Doe started following you',
      userId: user2.id,
      relatedId: user1.id,
    },
  })

  await prisma.notification.create({
    data: {
      type: 'LIKE',
      message: 'Jane Smith liked your post',
      userId: user1.id,
      relatedId: post1.id,
    },
  })

  await prisma.notification.create({
    data: {
      type: 'COMMENT',
      message: 'Alex Chen commented on your post',
      userId: user2.id,
      relatedId: comment3.id,
    },
  })

  // Create sample rankings
  const currentPeriod = new Date().toISOString().slice(0, 7) // YYYY-MM format

  await prisma.ranking.create({
    data: {
      userId: user1.id,
      type: 'POSTS_LIKES',
      score: 2,
      rank: 2,
      period: currentPeriod,
    },
  })

  await prisma.ranking.create({
    data: {
      userId: user2.id,
      type: 'POSTS_LIKES',
      score: 1,
      rank: 3,
      period: currentPeriod,
    },
  })

  await prisma.ranking.create({
    data: {
      userId: user3.id,
      type: 'POSTS_LIKES',
      score: 1,
      rank: 3,
      period: currentPeriod,
    },
  })

  await prisma.ranking.create({
    data: {
      userId: user1.id,
      type: 'FOLLOWERS_COUNT',
      score: 1,
      rank: 2,
      period: currentPeriod,
    },
  })

  await prisma.ranking.create({
    data: {
      userId: user2.id,
      type: 'FOLLOWERS_COUNT',
      score: 1,
      rank: 2,
      period: currentPeriod,
    },
  })

  await prisma.ranking.create({
    data: {
      userId: user3.id,
      type: 'FOLLOWERS_COUNT',
      score: 1,
      rank: 2,
      period: currentPeriod,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - 4 users (1 admin, 3 regular)`)
  console.log(`   - 3 MBTI assignments`)
  console.log(`   - 3 posts`)
  console.log(`   - 3 comments`)
  console.log(`   - 4 likes`)
  console.log(`   - 3 follow relationships`)
  console.log(`   - 3 notifications`)
  console.log(`   - 6 ranking entries`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })