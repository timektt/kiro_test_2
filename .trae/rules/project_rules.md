# Community Platform - Project Development Rules

## 📋 Overview

นี่คือกฎเกณฑ์การพัฒนาสำหรับ Community Platform - แพลตฟอร์มชุมชนออนไลน์ที่สร้างด้วย Next.js 14, TypeScript, และ Prisma ORM

## 🏗️ Project Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: NextAuth.js (Google, GitHub, Credentials)
- **Database**: SQLite (development) / PostgreSQL (production) + Prisma ORM
- **State Management**: Zustand + SWR for data fetching
- **Real-time**: Socket.IO for chat and notifications
- **File Upload**: Cloudinary integration
- **Monitoring**: Sentry + Vercel Analytics
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel + Docker support

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── chat/              # Real-time chat
│   ├── feed/              # Social feed
│   ├── profile/           # User profiles
│   ├── search/            # Advanced search
│   ├── settings/          # User settings (including privacy)
│   └── notifications/     # Notification center
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── auth/             # Authentication components
│   ├── admin/            # Admin dashboard components
│   ├── chat/             # Chat system components
│   ├── feed/             # Social feed components
│   ├── privacy/          # Privacy settings components
│   ├── profile/          # User profile components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── middleware/       # Custom middleware
│   └── services/         # Business logic services
├── stores/               # Zustand state management
└── types/                # TypeScript type definitions
```

## 🎯 Development Guidelines

### 1. Code Style & Formatting

#### TypeScript Rules
- **Always use TypeScript** - ไม่อนุญาตให้ใช้ JavaScript files
- **Strict mode enabled** - ต้องผ่าน TypeScript strict checks
- **Explicit types** - ระบุ types อย่างชัดเจน โดยเฉพาะ function parameters และ return types
- **Interface over type** - ใช้ `interface` สำหรับ object types, `type` สำหรับ unions/primitives

```typescript
// ✅ Good
interface UserProfile {
  id: string
  username: string
  email: string
}

function getUserProfile(userId: string): Promise<UserProfile> {
  // implementation
}

// ❌ Bad
function getUserProfile(userId) {
  // implementation
}
```

#### Naming Conventions
- **Files**: kebab-case (`user-profile.tsx`, `auth-provider.ts`)
- **Components**: PascalCase (`UserProfile`, `AuthProvider`)
- **Functions/Variables**: camelCase (`getUserProfile`, `isAuthenticated`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `ApiResponse`)

#### Import Organization
```typescript
// 1. React imports
import React from 'react'
import { useState, useEffect } from 'react'

// 2. Next.js imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// 3. Third-party libraries
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

// 4. Internal imports (absolute paths)
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user-store'
import { cn } from '@/lib/utils'

// 5. Relative imports
import './component.css'
```

### 2. Component Development

#### Component Structure
```typescript
'use client' // เฉพาะเมื่อจำเป็น

import { ComponentProps } from 'react'

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Hooks
  // State
  // Effects
  // Event handlers
  // Render logic
  
  return (
    <div className="component-wrapper">
      {/* JSX */}
    </div>
  )
}

// Default export เฉพาะสำหรับ pages
export default ComponentName // เฉพาะใน app/ directory
```

#### UI Components (shadcn/ui)
- **ใช้ shadcn/ui components** เป็นหลักสำหรับ base UI
- **Customize ผ่าน className** แทนการแก้ไข component โดยตรง
- **Consistent spacing** ใช้ Tailwind spacing scale (4, 8, 12, 16, 20, 24...)
- **Responsive design** ใช้ Tailwind responsive prefixes (sm:, md:, lg:, xl:)

```typescript
// ✅ Good - ใช้ shadcn/ui + customization
import { Button } from '@/components/ui/button'

<Button 
  variant="outline" 
  size="lg"
  className="w-full md:w-auto bg-primary hover:bg-primary/90"
>
  Submit
</Button>

// ❌ Bad - สร้าง custom button จากศูนย์
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Submit
</button>
```

### 3. State Management

#### Zustand Stores
- **Feature-based stores** แยก store ตาม feature (user-store, feed-store, ui-store)
- **Immutable updates** ใช้ immer pattern หรือ spread operator
- **TypeScript interfaces** สำหรับ store state

```typescript
// stores/user-store.ts
import { create } from 'zustand'

interface UserState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  updateProfile: async (data) => {
    set({ isLoading: true })
    try {
      // API call
      const updatedUser = await updateUserProfile(data)
      set({ user: updatedUser, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
}))
```

#### SWR for Data Fetching
- **Use SWR hooks** สำหรับ server state management
- **Custom hooks** wrap SWR calls ใน custom hooks
- **Error handling** จัดการ error states อย่างเหมาะสม

```typescript
// hooks/use-posts.ts
import useSWR from 'swr'

export function usePosts() {
  const { data, error, mutate } = useSWR('/api/posts', fetcher)
  
  return {
    posts: data?.posts || [],
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  }
}
```

### 4. API Development

#### Route Structure
```
src/app/api/
├── auth/                  # Authentication endpoints
├── posts/                 # Post management
│   ├── route.ts          # GET /api/posts, POST /api/posts
│   ├── [postId]/         # Dynamic routes
│   └── search/           # Search functionality
├── users/                 # User management
├── chat/                  # Real-time chat
├── privacy/               # Privacy settings
├── notifications/         # Notification system
└── admin/                 # Admin endpoints
```

#### API Route Implementation
```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPostSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      include: { author: true, _count: { select: { likes: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPostSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: { author: true },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

#### Validation with Zod
- **Input validation** ใช้ Zod schemas สำหรับทุก API inputs
- **Centralized schemas** เก็บ validation schemas ใน `lib/validations.ts`
- **Type inference** ใช้ `z.infer<typeof schema>` สำหรับ TypeScript types

```typescript
// lib/validations.ts
import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  tags: z.array(z.string()).optional(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
```

### 5. Database & Prisma

#### Schema Design
- **Consistent naming** ใช้ camelCase สำหรับ field names
- **Proper relationships** กำหนด relations อย่างถูกต้อง
- **Indexes** เพิ่ม indexes สำหรับ fields ที่ query บ่อย
- **Constraints** ใช้ unique constraints และ validation

```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  posts     Post[]
  comments  Comment[]
  
  @@index([email])
  @@index([username])
  @@map("users")
}
```

#### Migration Strategy
- **Incremental migrations** สร้าง migration files สำหรับทุกการเปลี่ยนแปลง schema
- **Descriptive names** ใช้ชื่อ migration ที่อธิบายการเปลี่ยนแปลง
- **Backup before deploy** สำรองข้อมูลก่อน deploy production migrations

```bash
# Development
npm run db:migrate

# Production
npm run db:migrate:deploy
```

### 6. Authentication & Security

#### NextAuth.js Configuration
- **Multiple providers** รองรับ Google, GitHub, และ Credentials
- **JWT strategy** ใช้ JWT สำหรับ session management
- **Role-based access** implement RBAC (User, Admin, Moderator)

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ... other providers
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub!
      session.user.role = token.role as string
      return session
    },
  },
}
```

#### Security Middleware
- **Route protection** ใช้ middleware สำหรับ protected routes
- **Role-based access** ตรวจสอบ permissions ตาม user role
- **Privacy enforcement** implement privacy settings middleware

### 7. Real-time Features

#### Socket.IO Implementation
- **Namespace organization** แยก namespaces ตาม feature
- **Room management** ใช้ rooms สำหรับ private chats
- **Authentication** verify JWT tokens สำหรับ socket connections

```typescript
// lib/socket.ts
import { Server } from 'socket.io'

export function initializeSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: process.env.NEXTAUTH_URL },
  })

  io.use(async (socket, next) => {
    // JWT verification
    const token = socket.handshake.auth.token
    // Verify token and attach user to socket
    next()
  })

  io.on('connection', (socket) => {
    // Handle chat events
    socket.on('join-chat', (chatId) => {
      socket.join(`chat:${chatId}`)
    })

    socket.on('send-message', async (data) => {
      // Save message to database
      // Emit to chat room
      io.to(`chat:${data.chatId}`).emit('new-message', message)
    })
  })
}
```

### 8. Testing Strategy

#### Test Structure
```
src/__tests__/
├── components/          # Component tests
├── hooks/              # Hook tests
├── lib/                # Utility tests
├── stores/             # Store tests
├── api/                # API endpoint tests
└── integration/        # E2E tests
```

#### Testing Guidelines
- **Unit tests** สำหรับ components, hooks, utilities
- **Integration tests** สำหรับ API endpoints และ user flows
- **Mocking** ใช้ MSW สำหรับ API mocking
- **Coverage** maintain >80% test coverage

```typescript
// __tests__/components/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 9. Performance Optimization

#### Code Splitting
- **Dynamic imports** สำหรับ heavy components
- **Route-based splitting** automatic ใน Next.js App Router
- **Library splitting** แยก vendor bundles

```typescript
// Dynamic component loading
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // เฉพาะเมื่อจำเป็น
})
```

#### Image Optimization
- **Next.js Image component** ใช้ `next/image` เสมอ
- **Proper sizing** กำหนด width/height หรือ fill
- **Loading strategy** ใช้ lazy loading และ priority สำหรับ above-fold images

```typescript
import Image from 'next/image'

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={40}
  height={40}
  className="rounded-full"
  priority={isAboveFold}
/>
```

### 10. Deployment & DevOps

#### Environment Configuration
- **Environment variables** ใช้ `.env.local` สำหรับ development
- **Production secrets** จัดการผ่าน deployment platform
- **Validation** validate required env vars ใน startup

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

#### Docker Configuration
- **Multi-stage builds** สำหรับ production optimization
- **Health checks** implement health check endpoints
- **Security** run as non-root user

#### Monitoring
- **Sentry** สำหรับ error tracking
- **Vercel Analytics** สำหรับ performance monitoring
- **Winston** สำหรับ application logging

## 🚀 Development Workflow

### 1. Feature Development
1. **Create feature branch** จาก `main`
2. **Implement feature** ตาม guidelines
3. **Write tests** สำหรับ new functionality
4. **Update documentation** เมื่อจำเป็น
5. **Run quality checks**:
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```
6. **Create pull request** พร้อม description

### 2. Code Review Process
- **Peer review** required สำหรับทุก PR
- **Automated checks** ต้องผ่าน CI/CD pipeline
- **Testing** verify functionality ใน review environment

### 3. Release Process
1. **Merge to main** หลังจาก review approved
2. **Automated deployment** ผ่าน CI/CD
3. **Post-deployment validation** ตรวจสอบ production health
4. **Monitor** error rates และ performance metrics

## 📝 Scripts & Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
```

### Database
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create and run migration
npm run db:migrate:deploy # Deploy migrations (production)
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database and reseed
```

### Testing
```bash
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:ci          # Run tests for CI/CD
```

### Deployment
```bash
npm run docker:build     # Build Docker image
npm run docker:run       # Run with Docker Compose
npm run health-check     # Check application health
npm run validate-env     # Validate environment variables
```

## 🔧 Tools & Extensions

### Required VS Code Extensions
- **TypeScript** - Language support
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Tailwind CSS IntelliSense** - CSS class suggestions
- **Prisma** - Database schema support
- **Auto Rename Tag** - HTML/JSX tag renaming

### Recommended Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 🐛 Common Issues & Solutions

### 1. TypeScript Errors
- **Missing types**: Install `@types/` packages
- **Import errors**: Check path aliases in `tsconfig.json`
- **Strict mode**: Fix type annotations

### 2. Database Issues
- **Connection errors**: Check `DATABASE_URL`
- **Migration conflicts**: Reset database in development
- **Schema sync**: Run `prisma db push`

### 3. Authentication Issues
- **OAuth setup**: Verify provider credentials
- **Session errors**: Check `NEXTAUTH_SECRET`
- **Redirect issues**: Verify `NEXTAUTH_URL`

### 4. Build Errors
- **Memory issues**: Increase Node.js memory limit
- **Import errors**: Check dynamic imports
- **Environment variables**: Verify all required vars

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Socket.IO Documentation](https://socket.io/docs)

---

**หมายเหตุ**: กฎเกณฑ์เหล่านี้อาจมีการปรับปรุงตามความต้องการของโปรเจค ควรทบทวนและอัปเดตเป็นระยะ ๆ