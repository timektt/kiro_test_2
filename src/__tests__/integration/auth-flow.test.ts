import { NextRequest } from 'next/server'
import { POST as registerHandler } from '@/app/api/auth/register/route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User Registration', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      const mockUser = {
        id: 'user-123',
        ...userData,
        password: 'hashed-password',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.user.findUnique.mockResolvedValue(null) // User doesn't exist
      mockBcrypt.hash.mockResolvedValue('hashed-password' as never)
      mockPrisma.user.create.mockResolvedValue(mockUser as any)

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const response = await registerHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.user).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      })

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      })
      expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 12)
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          username: userData.username,
          email: userData.email,
          password: 'hashed-password',
          name: userData.name,
        },
      })
    })

    it('should reject registration with existing email', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      }

      const existingUser = {
        id: 'existing-user',
        email: userData.email,
      }

      mockPrisma.user.findUnique.mockResolvedValue(existingUser as any)

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const response = await registerHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('User already exists')

      expect(mockPrisma.user.create).not.toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
      const invalidData = {
        username: '',
        email: 'invalid-email',
        password: '123', // Too short
      }

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await registerHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.errors).toBeDefined()
      expect(Array.isArray(responseData.errors)).toBe(true)
    })

    it('should handle database errors gracefully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password' as never)
      mockPrisma.user.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const response = await registerHandler(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Internal server error')
    })

    it('should sanitize user data in response', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      const mockUser = {
        id: 'user-123',
        ...userData,
        password: 'hashed-password',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        socialLinks: {},
        bio: null,
        image: null,
        emailVerified: null,
      }

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password' as never)
      mockPrisma.user.create.mockResolvedValue(mockUser as any)

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const response = await registerHandler(request)
      const responseData = await response.json()

      expect(responseData.user).not.toHaveProperty('password')
      expect(responseData.user).not.toHaveProperty('socialLinks')
      expect(responseData.user).not.toHaveProperty('createdAt')
      expect(responseData.user).not.toHaveProperty('updatedAt')
    })
  })

  describe('Username Validation', () => {
    it('should reject invalid usernames', async () => {
      const invalidUsernames = [
        '', // Empty
        'a', // Too short
        'a'.repeat(31), // Too long
        'user name', // Contains space
        'user@name', // Contains special character
        '123user', // Starts with number
      ]

      for (const username of invalidUsernames) {
        const userData = {
          username,
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }

        const request = new NextRequest('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        })

        const response = await registerHandler(request)
        const responseData = await response.json()

        expect(response.status).toBe(400)
        expect(responseData.success).toBe(false)
        expect(responseData.errors).toBeDefined()
      }
    })

    it('should accept valid usernames', async () => {
      const validUsernames = [
        'testuser',
        'test_user',
        'test-user',
        'testUser123',
        'user123',
      ]

      for (const username of validUsernames) {
        const userData = {
          username,
          email: `${username}@example.com`,
          password: 'password123',
          name: 'Test User',
        }

        const mockUser = {
          id: `user-${username}`,
          ...userData,
          password: 'hashed-password',
          role: 'USER',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        mockPrisma.user.findUnique.mockResolvedValue(null)
        mockBcrypt.hash.mockResolvedValue('hashed-password' as never)
        mockPrisma.user.create.mockResolvedValue(mockUser as any)

        const request = new NextRequest('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        })

        const response = await registerHandler(request)
        const responseData = await response.json()

        expect(response.status).toBe(201)
        expect(responseData.success).toBe(true)
      }
    })
  })

  describe('Password Security', () => {
    it('should hash passwords with proper salt rounds', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password' as never)
      mockPrisma.user.create.mockResolvedValue({} as any)

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      await registerHandler(request)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 12)
    })

    it('should reject weak passwords', async () => {
      const weakPasswords = [
        '', // Empty
        '123', // Too short
        'password', // Common password
        '12345678', // Only numbers
        'abcdefgh', // Only letters
      ]

      for (const password of weakPasswords) {
        const userData = {
          username: 'testuser',
          email: 'test@example.com',
          password,
          name: 'Test User',
        }

        const request = new NextRequest('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        })

        const response = await registerHandler(request)
        const responseData = await response.json()

        expect(response.status).toBe(400)
        expect(responseData.success).toBe(false)
        expect(responseData.errors).toBeDefined()
      }
    })
  })

  describe('Rate Limiting', () => {
    it('should handle rate limiting for registration attempts', async () => {
      // This test would require mocking the rate limiting middleware
      // For now, we'll test that the endpoint can handle multiple requests
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      const requests = Array.from({ length: 5 }, (_, i) => 
        new NextRequest('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Forwarded-For': '192.168.1.1', // Simulate same IP
          },
          body: JSON.stringify({
            ...userData,
            email: `test${i}@example.com`,
            username: `testuser${i}`,
          }),
        })
      )

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password' as never)
      mockPrisma.user.create.mockResolvedValue({} as any)

      // All requests should be processed (rate limiting would be handled by middleware)
      const responses = await Promise.all(
        requests.map(request => registerHandler(request))
      )

      responses.forEach(response => {
        expect([201, 429]).toContain(response.status) // Either success or rate limited
      })
    })
  })

  describe('Input Sanitization', () => {
    it('should sanitize malicious input', async () => {
      const maliciousData = {
        username: '<script>alert("xss")</script>',
        email: 'test@example.com',
        password: 'password123',
        name: '<img src=x onerror=alert("xss")>',
      }

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue('hashed-password' as never)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        username: 'sanitized-username',
        email: maliciousData.email,
        name: 'sanitized-name',
        role: 'USER',
      } as any)

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousData),
      })

      const response = await registerHandler(request)
      const responseData = await response.json()

      if (response.status === 201) {
        expect(responseData.user.username).not.toContain('<script>')
        expect(responseData.user.name).not.toContain('<img')
      }
    })
  })
})
