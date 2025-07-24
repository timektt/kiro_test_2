import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/auth/register/route'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}))

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register a new user successfully', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null) // User doesn't exist
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password')
    ;(prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
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

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashed-password',
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
      },
    })
  })

  it('should return 400 for invalid input', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: not a valid email
        username: 'ab', // Invalid: too short
        password: '123', // Invalid: too short
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error.message).toContain('validation')
  })

  it('should return 409 when email already exists', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
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

  it('should return 409 when username already exists', async () => {
    ;(prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(null) // Email check
      .mockResolvedValueOnce({ id: 'existing-user', username: 'testuser' }) // Username check

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
    expect(data.error.message).toBe('Username already taken')
  })

  it('should handle database error during user creation', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password')
    ;(prisma.user.create as jest.Mock).mockRejectedValue(new Error('Database error'))

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

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error.message).toBe('Internal server error')
  })

  it('should handle bcrypt error', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Bcrypt error'))

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

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error.message).toBe('Internal server error')
  })

  it('should validate password strength', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'weak', // Too short
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error.message).toContain('validation')
  })

  it('should validate email format', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'not-an-email',
        username: 'testuser',
        password: 'password123',
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error.message).toContain('validation')
  })

  it('should validate username format', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        username: 'invalid username!', // Contains invalid characters
        password: 'password123',
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error.message).toContain('validation')
  })
})