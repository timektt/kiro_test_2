import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is trying to access admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }
        
        // Check if user is trying to access protected routes
        if (req.nextUrl.pathname.startsWith("/dashboard") || 
            req.nextUrl.pathname.startsWith("/profile") ||
            req.nextUrl.pathname.startsWith("/feed")) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*", 
    "/feed/:path*",
    "/admin/:path*",
    "/api/posts/:path*",
    "/api/comments/:path*",
    "/api/likes/:path*",
    "/api/follows/:path*",
    "/api/notifications/:path*",
    "/api/admin/:path*"
  ]
}

