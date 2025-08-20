import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface ProtectedLayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: 'USER' | 'ADMIN' | 'MODERATOR'
}

export async function ProtectedLayout({
  children,
  requireAuth = true,
  requiredRole,
}: ProtectedLayoutProps) {
  const session = await getServerSession(authOptions)

  // Check authentication
  if (requireAuth && !session) {
    redirect('/auth/signin')
  }

  // Check role requirements
  if (requiredRole && session?.user.role !== requiredRole) {
    if (requiredRole === 'ADMIN' && session?.user.role !== 'ADMIN') {
      redirect('/unauthorized')
    }
    if (requiredRole === 'MODERATOR' && !['ADMIN', 'MODERATOR'].includes(session?.user.role || '')) {
      redirect('/unauthorized')
    }
  }

  return <>{children}</>
}

export default ProtectedLayout
