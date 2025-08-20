import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TestAuthPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Current Session Status:</h3>
            {session ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">[CHECK] Authenticated</p>
                <p className="text-sm text-green-600 mt-1">
                  User: {session.user.name || session.user.email}
                </p>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800">[X] Not authenticated</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Test Navigation:</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">Homepage</Button>
              </Link>
              <Link href="/feed">
                <Button variant="outline" size="sm">Feed</Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Expected Behavior:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>&bull; <strong>Homepage (/):</strong> Shows landing page for all users, with personalized CTAs for authenticated users</li>
                <li>&bull; <strong>Feed (/feed):</strong> Shows feed for authenticated users, redirects to signin for unauthenticated users</li>
                <li>&bull; <strong>Sign In/Up:</strong> Shows auth forms for unauthenticated users, redirects to homepage for authenticated users</li>
                <li>&bull; <strong>No automatic redirects:</strong> Users can stay on homepage regardless of auth status</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
