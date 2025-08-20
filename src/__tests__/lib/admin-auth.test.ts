import { checkAdminAuth, hasAdminPermission, withAdminAuth } from '@/lib/admin-auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Mock dependencies
jest.mock('next-auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

const mockAdminUser = {
  id: 'admin-1',
  username: 'admin',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'ADMIN' as const,
  image: null,
  isActive: true,
}

const mockModeratorUser = {
  id: 'mod-1',
  username: 'moderator',
  name: 'Moderator User',
  email: 'mod@example.com',
  role: 'MODERATOR' as const,
  image: null,
  isActive: true,
}

const mockRegularUser = {
  id: 'user-1',
  username: 'user',
  name: 'Regular User',
  email: 'user@example.com',
  role: 'USER' as const,
  image: null,
  isActive: true,
}

describe('checkAdminAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return admin user for valid admin session', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'admin-1' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser)

    const result = await checkAdminAuth()

    expect(result).toEqual({
      id: 'admin-1',
      username: 'admin',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      image: null,
    })
  })

  it('should return moderator user for valid moderator session', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'mod-1' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockModeratorUser)

    const result = await checkAdminAuth()

    expect(result).toEqual({
      id: 'mod-1',
      username: 'moderator',
      name: 'Moderator User',
      email: 'mod@example.com',
      role: 'MODERATOR',
      image: null,
    })
  })

  it('should return null for regular user', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-1' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockRegularUser)

    const result = await checkAdminAuth()

    expect(result).toBeNull()
  })

  it('should return null for inactive user', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'admin-1' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...mockAdminUser,
      isActive: false,
    })

    const result = await checkAdminAuth()

    expect(result).toBeNull()
  })

  it('should return null for no session', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const result = await checkAdminAuth()

    expect(result).toBeNull()
  })

  it('should return null for non-existent user', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'nonexistent' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const result = await checkAdminAuth()

    expect(result).toBeNull()
  })
})

describe('hasAdminPermission', () => {
  const adminUser = {
    id: 'admin-1',
    username: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN' as const,
    image: null,
  }

  const moderatorUser = {
    id: 'mod-1',
    username: 'moderator',
    name: 'Moderator User',
    email: 'mod@example.com',
    role: 'MODERATOR' as const,
    image: null,
  }

  it('should grant all permissions to admin', () => {
    expect(hasAdminPermission(adminUser, 'USER_MANAGEMENT')).toBe(true)
    expect(hasAdminPermission(adminUser, 'CONTENT_MODERATION')).toBe(true)
    expect(hasAdminPermission(adminUser, 'SYSTEM_SETTINGS')).toBe(true)
  })

  it('should grant limited permissions to moderator', () => {
    expect(hasAdminPermission(moderatorUser, 'USER_MANAGEMENT')).toBe(false)
    expect(hasAdminPermission(moderatorUser, 'CONTENT_MODERATION')).toBe(true)
    expect(hasAdminPermission(moderatorUser, 'SYSTEM_SETTINGS')).toBe(false)
  })
})

describe('withAdminAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call handler with admin user when authenticated', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'admin-1' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser)

    const mockHandler = jest.fn().mockResolvedValue(
      NextResponse.json({ success: true })
    )
    const wrappedHandler = withAdminAuth(mockHandler)

    const request = new NextRequest('http://localhost:3000/api/admin/test')
    const response = await wrappedHandler(request)

    expect(mockHandler).toHaveBeenCalledWith(request, {
      id: 'admin-1',
      username: 'admin',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      image: null,
    })

    const data = await response.json()
    expect(data.success).toBe(true)
  })

  it('should return 403 when not authenticated as admin', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-1' },
    })
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockRegularUser)

    const mockHandler = jest.fn()
    const wrappedHandler = withAdminAuth(mockHandler)

    const request = new NextRequest('http://localhost:3000/api/admin/test')
    const response = await wrappedHandler(request)

    expect(mockHandler).not.toHaveBeenCalled()
    expect(response.status).toBe(403)

    const data = await response.json()
    expect(data.error).toBe('Admin access required')
  })

  it('should return 403 when no session', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const mockHandler = jest.fn()
    const wrappedHandler = withAdminAuth(mockHandler)

    const request = new NextRequest('http://localhost:3000/api/admin/test')
    const response = await wrappedHandler(request)

    expect(mockHandler).not.toHaveBeenCalled()
    expect(response.status).toBe(403)

    const data = await response.json()
    expect(data.error).toBe('Admin access required')
  })
})

