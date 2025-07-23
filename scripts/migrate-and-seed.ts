#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database migration and seeding...')

  try {
    // Check if database is accessible
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Run Prisma migrations
    console.log('📦 Running database migrations...')
    execSync('npx prisma db push', { stdio: 'inherit' })

    // Generate Prisma client
    console.log('🔧 Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })

    // Check if database is empty (no users)
    const userCount = await prisma.user.count()
    
    if (userCount === 0) {
      console.log('🌱 Database is empty, running seed...')
      execSync('npm run db:seed', { stdio: 'inherit' })
    } else {
      console.log(`📊 Database already has ${userCount} users, skipping seed`)
    }

    console.log('✅ Database setup completed successfully!')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()