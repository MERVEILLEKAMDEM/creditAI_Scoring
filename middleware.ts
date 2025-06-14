import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Declare global type
declare global {
  var dbInitialized: boolean
}

// Initialize global state
if (typeof global.dbInitialized === 'undefined') {
  global.dbInitialized = false
}

// Middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/init (database initialization API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/init|_next/static|_next/image|favicon.ico).*)',
  ],
}

export default async function middleware(request: NextRequest) {
  // Initialize database only once
  if (!global.dbInitialized) {
    try {
      const baseUrl = request.nextUrl.origin
      const response = await fetch(`${baseUrl}/api/init`)
      if (response.ok) {
        global.dbInitialized = true
        console.log('Database initialized successfully')
      } else {
        console.error('Database initialization failed:', await response.text())
      }
    } catch (error) {
      console.error('Failed to initialize database:', error)
    }
  }

  return NextResponse.next()
} 