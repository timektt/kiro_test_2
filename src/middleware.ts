import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

console.log('[MIDDLEWARE]', 'RUNNING')

export default withAuth(
  function middleware(req) {
    console.log('[MIDDLEWARE] URL:', req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        console.log('[MIDDLEWARE] Checking auth:', pathname)
        
        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }

        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*", 
    "/feed/:path*",
    "/notifications/:path*",
    "/rankings/:path*",
    "/identity/:path*",
    "/admin/:path*",
    "/api/posts/:path*",
    "/api/comments/:path*",
    "/api/likes/:path*",
    "/api/follows/:path*",
    "/api/notifications/:path*",
    "/api/users/:path*",
    "/api/admin/:path*"
  ]
}
