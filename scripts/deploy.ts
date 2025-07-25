#!/usr/bin/env tsx

/**
 * Production deployment script
 * Handles database migrations and seeding for production deployment
 */

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting production deployment...')

  try {
    // Check database connection
    console.log('📡 Checking database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Run database migrations
    console.log('🔄 Running database migrations...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    console.log('✅ Database migrations completed')

    // Generate Prisma client
    console.log('🔧 Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ Prisma client generated')

    // Check if we need to seed the database
    const userCount = await prisma.user.count()
    
    if (userCount === 0) {
      console.log('🌱 Database is empty, running seed...')
      execSync('npm run db:seed', { stdio: 'inherit' })
      console.log('✅ Database seeded successfully')
    } else {
      console.log(`📊 Database already has ${userCount} users, skipping seed`)
    }

    // Verify deployment
    console.log('🔍 Verifying deployment...')
    const stats = await prisma.$queryRaw`
      SELECT 
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM posts) as post_count,
        (SELECT COUNT(*) FROM comments) as comment_count
    `
    console.log('📈 Database stats:', stats)

    console.log('🎉 Production deployment completed successfully!')

  } catch (error) {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('❌ Deployment script failed:', error)
  process.exit(1)
})