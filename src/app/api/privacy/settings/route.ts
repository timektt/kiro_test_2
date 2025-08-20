import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'
import { z } from 'zod'

const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['PUBLIC', 'FOLLOWERS_ONLY', 'PRIVATE']).optional(),
  showEmail: z.boolean().optional(),
  showMBTI: z.boolean().optional(),
  showBio: z.boolean().optional(),
  showJoinDate: z.boolean().optional(),
  showFollowerCount: z.boolean().optional(),
  showFollowingCount: z.boolean().optional(),
  defaultPostVisibility: z.enum(['PUBLIC', 'FOLLOWERS_ONLY', 'PRIVATE', 'CUSTOM']).optional(),
  allowComments: z.boolean().optional(),
  allowLikes: z.boolean().optional(),
  allowShares: z.boolean().optional(),
  allowDirectMessages: z.boolean().optional(),
  allowMentions: z.boolean().optional(),
  allowTagging: z.boolean().optional(),
  showOnlineStatus: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional()
})

// GET /api/privacy/settings - Get user's privacy settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let privacySettings = await prisma.privacySetting.findUnique({
      where: { userId: session.user.id }
    })

    // Create default privacy settings if they don't exist
    if (!privacySettings) {
      privacySettings = await prisma.privacySetting.create({
        data: {
          userId: session.user.id
        }
      })
    }

    return NextResponse.json({ settings: privacySettings })
  } catch (error) {
    logger.error('Error fetching privacy settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/privacy/settings - Update user's privacy settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = privacySettingsSchema.parse(body)

    // Upsert privacy settings
    const updatedSettings = await prisma.privacySetting.upsert({
      where: { userId: session.user.id },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData
      }
    })

    logger.info(`Privacy settings updated for user ${session.user.id}`, {
      userId: session.user.id,
      settings: validatedData
    })

    return NextResponse.json({
      message: 'Privacy settings updated successfully',
      settings: updatedSettings
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Error updating privacy settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
