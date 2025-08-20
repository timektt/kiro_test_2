import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'
import { z } from 'zod'

const privacySettingsSchema = z.object({
  settings: z.object({
    emailNotifications: z.boolean(),
    profileVisibility: z.enum(['public', 'followers', 'private']),
    showOnlineStatus: z.boolean(),
    allowDirectMessages: z.boolean(),
    showMBTI: z.boolean(),
    showFollowersCount: z.boolean(),
    showFollowingCount: z.boolean(),
    allowMentions: z.boolean()
  })
})

// GET /api/user/privacy-settings - Get user's privacy settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailNotifications: true,
        profileVisibility: true,
        showOnlineStatus: true,
        allowDirectMessages: true,
        showMBTI: true,
        showFollowersCount: true,
        showFollowingCount: true,
        allowMentions: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Set default values for new fields if they don't exist
    const settings = {
      emailNotifications: user.emailNotifications ?? true,
      profileVisibility: user.profileVisibility ?? 'public',
      showOnlineStatus: user.showOnlineStatus ?? true,
      allowDirectMessages: user.allowDirectMessages ?? true,
      showMBTI: user.showMBTI ?? true,
      showFollowersCount: user.showFollowersCount ?? true,
      showFollowingCount: user.showFollowingCount ?? true,
      allowMentions: user.allowMentions ?? true
    }

    return NextResponse.json({ settings })
  } catch (error) {
    logger.error('Error fetching privacy settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/user/privacy-settings - Update user's privacy settings
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
    const { settings } = validatedData

    // Update user's privacy settings
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        emailNotifications: settings.emailNotifications,
        profileVisibility: settings.profileVisibility,
        showOnlineStatus: settings.showOnlineStatus,
        allowDirectMessages: settings.allowDirectMessages,
        showMBTI: settings.showMBTI,
        showFollowersCount: settings.showFollowersCount,
        showFollowingCount: settings.showFollowingCount,
        allowMentions: settings.allowMentions
      },
      select: {
        id: true,
        emailNotifications: true,
        profileVisibility: true,
        showOnlineStatus: true,
        allowDirectMessages: true,
        showMBTI: true,
        showFollowersCount: true,
        showFollowingCount: true,
        allowMentions: true
      }
    })

    logger.info(`Privacy settings updated for user ${session.user.id}`, {
      userId: session.user.id,
      settings: settings
    })

    return NextResponse.json({
      message: 'Privacy settings updated successfully',
      settings: updatedUser
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
