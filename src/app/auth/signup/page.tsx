import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignUpForm } from '@/components/auth/signup-form'

export const metadata = {
  title: 'Sign Up | Community Platform',
  description: 'Create a new account to join the community platform',
}

export default async function SignUpPage() {
  const session = await getServerSession(authOptions)

  // Redirect if already authenticated
  if (session) {
    redirect('/feed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>Loading...</div>}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  )
}
