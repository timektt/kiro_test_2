import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { signInSchema } from './validations'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        // Validate input
        const result = signInSchema.safeParse(credentials)
        if (!result.success) {
          throw new Error('Invalid email or password format')
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { mbti: true },
        })

        if (!user) {
          throw new Error('No user found with this email')
        }

        // For OAuth users, they don't have a password
        if (!user.password) {
          throw new Error('Please sign in with your OAuth provider')
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        // Check if user is active
        if (!user.isActive) {
          throw new Error('Account has been deactivated')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For OAuth providers, ensure user has a username
        if (account.provider !== 'credentials' && user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { mbti: true },
          })

          if (dbUser && !dbUser.username) {
            // Generate username from email or name
            const baseUsername = (user.name || user.email)
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '')
              .slice(0, 15)

            let username = baseUsername
            let counter = 1

            // Ensure username is unique
            while (await prisma.user.findUnique({ where: { username } })) {
              username = `${baseUsername}${counter}`
              counter++
            }

            await prisma.user.update({
              where: { id: dbUser.id },
              data: { username },
            })

            token.username = username
          } else if (dbUser) {
            token.username = dbUser.username
          }
        }

        token.role = user.role || 'USER'
        token.username = user.username || token.username
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.username = token.username as string
      }

      return session
    },
    async signIn({ user, account, profile }) {
      // Allow all sign-ins
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async createUser({ user }) {
      // Auto-assign MBTI type for new users (can be changed later)
      const mbtiTypes = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP',
        'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
        'ISTP', 'ISFP', 'ESTP', 'ESFP'
      ]
      
      const randomType = mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)]
      
      await prisma.mBTI.create({
        data: {
          userId: user.id,
          type: randomType as any,
          description: `Randomly assigned ${randomType} type - update in your profile`,
          isLocked: false, // Allow users to change their initial assignment
        },
      })

      // Create welcome notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM',
          message: 'Welcome to the community! Complete your profile to get started.',
        },
      })
    },
  },
}

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      username?: string
      image?: string | null
      role: string
    }
  }

  interface User {
    username?: string
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    username?: string
  }
}