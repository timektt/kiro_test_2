# Community Platform

A modern full-stack web community platform built with Next.js 14, TypeScript, and PostgreSQL.

## Features

- 🔐 Multi-provider authentication (Google, GitHub, Email/Password)
- 📱 Responsive design with dark/light mode
- 💬 Social feed with posts, likes, and comments
- 👤 User profiles with avatars and social links
- 🔔 Real-time notifications
- 👨‍💼 Admin dashboard for content management
- 🎨 Modern UI with shadcn/ui components
- ⚡ Optimized performance and SEO

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL + Prisma ORM
- **State Management**: Zustand + SWR
- **File Upload**: Cloudinary
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel + Render

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Cloudinary account (for image uploads)
- OAuth app credentials (Google, GitHub)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd community-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:
- Database URL
- NextAuth configuration
- OAuth provider credentials
- Cloudinary configuration

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── auth/           # Authentication components
│   ├── feed/           # Social feed components
│   ├── profile/        # User profile components
│   └── admin/          # Admin dashboard components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and type checking
6. Submit a pull request

## License

This project is licensed under the MIT License.