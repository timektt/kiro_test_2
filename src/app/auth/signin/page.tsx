import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignInForm } from '@/components/auth/signin-form'

export const metadata = {
  title: 'Sign In | Community Platform',
  description: 'Sign in to your account to access the community platform',
}

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  // Redirect if already authenticated
  if (session) {
    redirect('/feed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>Loading...</div>}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}