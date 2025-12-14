import { NextRequest } from 'next/server'
import { extractBearerToken, validateSession } from './auth'
import { prisma } from './prisma'

/**
 * Middleware to authenticate API requests
 * Returns the authenticated player or null
 */
export async function authenticateRequest(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  const token = extractBearerToken(authorization)
  
  if (!token) {
    return null
  }
  
  const playerId = await validateSession(token)
  
  if (!playerId) {
    return null
  }
  
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  })
  
  return player
}

/**
 * Helper to create JSON responses
 */
export function jsonResponse(data: any, status: number = 200) {
  return Response.json(data, { status })
}

/**
 * Helper for success responses
 */
export function successResponse(data: any, message?: string) {
  return jsonResponse({
    success: true,
    data,
    ...(message && { message }),
  })
}

/**
 * Helper for error responses
 */
export function errorResponse(error: string, status: number = 400) {
  return jsonResponse({
    success: false,
    error,
  }, status)
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(body: any, fields: string[]): string | null {
  for (const field of fields) {
    if (!body[field]) {
      return `Missing required field: ${field}`
    }
  }
  return null
}
