import { NextRequest } from 'next/server'
import { deleteSession, extractBearerToken } from '@/lib/auth'
import { errorResponse, successResponse } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    const token = extractBearerToken(authorization)
    
    if (!token) {
      return errorResponse('No token provided', 401)
    }
    
    await deleteSession(token)
    
    return successResponse({ message: 'Logged out successfully' })
  } catch (error: any) {
    console.error('Logout error:', error)
    return errorResponse('Logout failed', 500)
  }
}
