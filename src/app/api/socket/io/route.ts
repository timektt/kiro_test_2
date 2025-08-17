import { NextRequest } from 'next/server'
import { Server as NetServer } from 'http'
import { Server as ServerIO } from 'socket.io'
import { initializeSocket, NextApiResponseServerIO } from '@/lib/socket'

// This is a hack to get the server instance in Next.js 13+ App Router
// We need to create a custom server or use a different approach for production
export async function GET(req: NextRequest) {
  // In development, we can use this approach
  // For production, you might want to use a separate server or different setup
  
  if (process.env.NODE_ENV === 'development') {
    // This is a workaround for development
    // In production, you should set up Socket.IO with a custom server
    return new Response('Socket.IO endpoint - use WebSocket connection', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  return new Response('Socket.IO not available in this environment', {
    status: 503,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

export async function POST(req: NextRequest) {
  return GET(req)
}