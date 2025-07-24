import { NextRequest, NextResponse } from 'next/server'
import { createAdminHandler } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/db-utils'

export const GET = createAdminHandler('USER_MANAGEMENT')(
  async (request: NextRequest, adminUser, { params }: { params: { userId: string } }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
        include: {
          mbti: true,
          _count: {
            select: {
              posts: true,
              followers: true,
              following: true,
              likes: true,
              comments: true,
            },
          },
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: user,
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)

export const PUT = createAdminHandler('USER_MANAGEMENT')(
  async (request: NextRequest, adminUser, { params }: { params: { userId: string } }) => {
    try {
      const body = await request.json()
      const { action, role, reason } = body

      const user = await prisma.user.findUnique({
        where: { id: params.userId },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Prevent self-modification
      if (user.id === adminUser.id) {
        return NextResponse.json(
          { error: 'Cannot modify your own account' },
          { status: 400 }
        )
      }

      let updatedUser
      let notificationMessage = ''

      switch (action) {
        case 'ACTIVATE':
          updatedUser = await prisma.user.update({
            where: { id: params.userId },
            data: { isActive: true },
          })
          notificationMessage = 'Your account has been reactivated by an administrator'
          break

        case 'DEACTIVATE':
          updatedUser = await prisma.user.update({
            where: { id: params.userId },
            data: { isActive: false },
          })
          notificationMessage = `Your account has been deactivated${reason ? `: ${reason}` : ''}`
          break

        case 'CHANGE_ROLE':
          // Only ADMIN can change roles
          if (adminUser.role !== 'ADMIN') {
            return NextResponse.json(
              { error: 'Only administrators can change user roles' },
              { status: 403 }
            )
          }

          if (!role || !['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
            return NextResponse.json(
              { error: 'Invalid role specified' },
              { status: 400 }
            )
          }

          updatedUser = await prisma.user.update({
            where: { id: params.userId },
            data: { role },
          })
          notificationMessage = `Your account role has been changed to ${role}`
          break

        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          )
      }

      // Send notification to user
      if (notificationMessage) {
        await createNotification(
          params.userId,
          'SYSTEM',
          notificationMessage
        )
      }

      return NextResponse.json({
        success: true,
        data: updatedUser,
        message: `User ${action.toLowerCase()}d successfully`,
      })
    } catch (error) {
      console.error('Error updating user:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)

export const DELETE = createAdminHandler('USER_MANAGEMENT')(
  async (request: NextRequest, adminUser, { params }: { params: { userId: string } }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Prevent self-deletion
      if (user.id === adminUser.id) {
        return NextResponse.json(
          { error: 'Cannot delete your own account' },
          { status: 400 }
        )
      }

      // Only ADMIN can delete users
      if (adminUser.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Only administrators can delete users' },
          { status: 403 }
        )
      }

      // Delete user (cascade will handle related data)
      await prisma.user.delete({
        where: { id: params.userId },
      })

      return NextResponse.json({
        success: true,
        message: 'User deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)