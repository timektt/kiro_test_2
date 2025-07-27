import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/auth/register/route'

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
}))

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should complete user registration flow', async () => {
    const { prisma } = require('@/lib/prisma')
    const bcrypt = require('bcryptjs')

    // Mock successful registration
    prisma.user.findUnique.mockResolvedValue(null) // User doesn't exist
    bcrypt.hash.mockResolvedValue('hashed-password')
    prisma.user.create.mockResolvedValue({
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      createdAt: new Date(),
    })

    const { req } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data.email).toBe('test@example.com')
    expect(data.data.name).toBe('Test User')
  })

  it('should reject duplicate email registration', async () => {
    const { prisma } = require('@/lib/prisma')

    // Mock existing user
    prisma.user.findUnique.mockResolvedValue({
      id: 'existing-user',
      email: 'test@example.com',
    })

    const { req } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.success).toBe(false)
    expect(data.error.message).toBe('User already exists')
  })

  it('should validate input data', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: '',
        email: 'invalid-email',
        username: 'ab',
        password: '123',
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error.message).toContain('validation')
  })
})
