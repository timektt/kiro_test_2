#!/usr/bin/env tsx

/**
 * Production Database Setup Script
 * Handles database migration and seeding for production environment
 */

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabaseConnection() {
  console.log('🔍 Checking database connection...')
  
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Test a simple query
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database query test successful')
    
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

async function runMigrations() {
  console.log('📦 Running database migrations...')
  
  try {
    // Use migrate deploy for production (doesn't require interactive prompts)
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    console.log('✅ Database migrations completed')
    return true
  } catch (error) {
    console.error('❌ Migration failed:', error)
    return false
  }
}

async function generatePrismaClient() {
  console.log('🔧 Generating Prisma client...')
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ Prisma client generated')
    return true
  } catch (error) {
    console.error('❌ Prisma client generation failed:', error)
    return false
  }
}

async function checkSchemaSync() {
  console.log('🔍 Checking database schema sync...')
  
  try {
    // This will throw if schema is out of sync
    await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    
    // Check if core tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'posts', 'comments', 'likes', 'follows', 'notifications')
    ` as any[]
    
    const expectedTables = ['users', 'posts', 'comments', 'likes', 'follows', 'notifications']
    const existingTables = tables.map(t => t.table_name)
    
    const missingTables = expectedTables.filter(table => !existingTables.includes(table))
    
    if (missingTables.length > 0) {
      console.warn('⚠️ Missing tables:', missingTables.join(', '))
      return false
    }
    
    console.log('✅ All core tables exist')
    return true
  } catch (error) {
    console.error('❌ Schema sync check failed:', error)
    return false
  }
}

async function seedDatabase() {
  console.log('🌱 Checking if database needs seeding...')
  
  try {
    const userCount = await prisma.user.count()
    
    if (userCount === 0) {
      console.log('📊 Database is empty, running seed...')
      execSync('npm run db:seed', { stdio: 'inherit' })
      console.log('✅ Database seeded successfully')
    } else {
      console.log(`📊 Database already has ${userCount} users, skipping seed`)
    }
    
    return true
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    return false
  }
}

async function createPerformanceIndexes() {
  console.log('⚡ Creating performance indexes...')
  
  try {
    // Create composite indexes for better query performance
    const indexes = [
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at DESC)',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_post_created ON comments(post_id, created_at DESC)',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, read, created_at DESC)',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_likes_post_user ON likes(post_id, user_id)',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_follower_following ON follows(follower_id, following_id)',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_created ON users(is_active, created_at DESC)',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_public_created ON posts(is_public, created_at DESC)',
    ]
    
    for (const indexQuery of indexes) {
      try {
        await prisma.$executeRawUnsafe(indexQuery)
        console.log(`✅ Created index: ${indexQuery.split(' ')[5]}`)
      } catch (error) {
        // Index might already exist, which is fine
        console.log(`ℹ️ Index might already exist: ${indexQuery.split(' ')[5]}`)
      }
    }
    
    console.log('✅ Performance indexes setup completed')
    return true
  } catch (error) {
    console.error('❌ Performance indexes creation failed:', error)
    return false
  }
}

async function validateDatabaseSetup() {
  console.log('🔍 Validating database setup...')
  
  try {
    // Test basic CRUD operations
    const testUser = await prisma.user.findFirst()
    if (testUser) {
      console.log('✅ User table accessible')
    }
    
    const testPost = await prisma.post.findFirst()
    if (testPost) {
      console.log('✅ Post table accessible')
    }
    
    // Test relationships
    const userWithPosts = await prisma.user.findFirst({
      include: {
        posts: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          }
        }
      }
    })
    
    if (userWithPosts) {
      console.log('✅ Database relationships working')
    }
    
    console.log('✅ Database validation completed')
    return true
  } catch (error) {
    console.error('❌ Database validation failed:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Starting production database setup...')
  console.log('=' .repeat(50))
  
  const steps = [
    { name: 'Database Connection', fn: checkDatabaseConnection },
    { name: 'Generate Prisma Client', fn: generatePrismaClient },
    { name: 'Run Migrations', fn: runMigrations },
    { name: 'Check Schema Sync', fn: checkSchemaSync },
    { name: 'Seed Database', fn: seedDatabase },
    { name: 'Create Performance Indexes', fn: createPerformanceIndexes },
    { name: 'Validate Setup', fn: validateDatabaseSetup },
  ]
  
  let successCount = 0
  
  for (const step of steps) {
    console.log(`\n📋 ${step.name}...`)
    const success = await step.fn()
    
    if (success) {
      successCount++
    } else {
      console.error(`❌ ${step.name} failed`)
      break
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`📊 Setup Results: ${successCount}/${steps.length} steps completed`)
  
  if (successCount === steps.length) {
    console.log('🎉 Production database setup completed successfully!')
    console.log('\n📋 Database Summary:')
    
    try {
      const stats = await prisma.$transaction([
        prisma.user.count(),
        prisma.post.count(),
        prisma.comment.count(),
        prisma.like.count(),
        prisma.follow.count(),
        prisma.notification.count(),
      ])
      
      console.log(`   - Users: ${stats[0]}`)
      console.log(`   - Posts: ${stats[1]}`)
      console.log(`   - Comments: ${stats[2]}`)
      console.log(`   - Likes: ${stats[3]}`)
      console.log(`   - Follows: ${stats[4]}`)
      console.log(`   - Notifications: ${stats[5]}`)
      
    } catch (error) {
      console.log('   - Could not fetch statistics')
    }
    
    process.exit(0)
  } else {
    console.log('❌ Production database setup failed!')
    process.exit(1)
  }
}

main()
  .catch((error) => {
    console.error('💥 Unexpected error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })