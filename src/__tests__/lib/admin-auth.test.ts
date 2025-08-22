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
  const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
  const mockFindUnique = prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>

  it('should return admin user for valid admin session', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'admin-1' },
    } as any)
    
    mockFindUnique.mockResolvedValue(mockAdminUser as any)

    const result = await checkAdminAuth()
    expect(result).toEqual({
      id: 'admin-1',
      username: 'admin',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    })
  })

  it('should return moderator user for valid moderator session', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'mod-1' },
    } as any)
    
    mockFindUnique.mockResolvedValue(mockModeratorUser as any)

    const result = await checkAdminAuth()
    expect(result).toEqual({
      id: 'mod-1',
      username: 'moderator',
      name: 'Moderator User',
      email: 'mod@example.com',
      role: 'MODERATOR',
    })
  })

  it('should return null for regular user', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1' },
    } as any)
    
    mockFindUnique.mockResolvedValue(mockRegularUser as any)

    const result = await checkAdminAuth()
    expect(result).toBeNull()
  })

  it('should return null for inactive user', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'admin-1' },
    } as any)
    
    mockFindUnique.mockResolvedValue({
      ...mockAdminUser,
      isActive: false,
    } as any)

    const result = await checkAdminAuth()
    expect(result).toBeNull()
  })

  it('should return null for no session', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const result = await checkAdminAuth()
    expect(result).toBeNull()
  })

  it('should return null for non-existent user', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'nonexistent' },
    } as any)
    
    mockFindUnique.mockResolvedValue(null)

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
  }

  const moderatorUser = {
    id: 'mod-1',
    username: 'moderator',
    name: 'Moderator User',
    email: 'mod@example.com',
    role: 'MODERATOR' as const,
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
  const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
  const mockFindUnique = prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>
  const mockHandler = jest.fn()

  it('should call handler with admin user when authenticated', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'admin-1' },
    } as any)
    
    mockFindUnique.mockResolvedValue(mockAdminUser as any)
    
    const mockResponse = NextResponse.json({ success: true })
    mockHandler.mockResolvedValue(mockResponse)

    const request = new NextRequest('http://localhost:3000/api/admin/test')
    const wrappedHandler = withAdminAuth(mockHandler)

    const result = await wrappedHandler(request)
    expect(mockHandler).toHaveBeenCalledWith(request, {
      id: 'admin-1',
      username: 'admin',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    })
    expect(result).toBe(mockResponse)
  })

  it('should return 403 when not authenticated as admin', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1' },
    } as any)
    
    mockFindUnique.mockResolvedValue(mockRegularUser as any)

    const request = new NextRequest('http://localhost:3000/api/admin/test')
    const wrappedHandler = withAdminAuth(mockHandler)

    const result = await wrappedHandler(request)
    expect(result.status).toBe(403)
    
    const data = await result.json()
    expect(data.error).toBe('Admin access required')
  })

  it('should return 403 when no session', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/admin/test')
    const wrappedHandler = withAdminAuth(mockHandler)

    const result = await wrappedHandler(request)
    expect(result.status).toBe(403)
    
    const data = await result.json()
    expect(data.error).toBe('Admin access required')
  })
})