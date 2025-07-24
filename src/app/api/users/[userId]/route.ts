import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { userSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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

    // Remove sensitive information
    const { password, ...safeUser } = user

    return NextResponse.json({
      success: true,
      data: safeUser,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is updating their own profile or is admin
    if (session.user.id !== params.userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const result = userSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: result.error.issues },
        { status: 400 }
      )
    }

    const { username, name, bio, socialLinks } = result.data

    // Check if username is already taken (if changing)
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      })

      if (existingUser && existingUser.id !== params.userId) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        )
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        username,
        name,
        bio,
        socialLinks: socialLinks || {},
        updatedAt: new Date(),
      },
      include: {
        mbti: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    // Remove sensitive information
    const { password, ...safeUser } = updatedUser

    return NextResponse.json({
      success: true,
      data: safeUser,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}