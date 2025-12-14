import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSession } from '@/lib/auth'
import { errorResponse, successResponse, validateRequiredFields } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const validationError = validateRequiredFields(body, ['username', 'password'])
    if (validationError) {
      return errorResponse(validationError)
    }
    
    const { username, password } = body
    
    // Find player
    const player = await prisma.player.findUnique({
      where: { username },
    })
    
    if (!player || !player.passwordHash) {
      return errorResponse('Invalid credentials', 401)
    }
    
    // Verify password
    const isValid = await verifyPassword(password, player.passwordHash)
    
    if (!isValid) {
      return errorResponse('Invalid credentials', 401)
    }
    
    // Update last active time
    await prisma.player.update({
      where: { id: player.id },
      data: { lastActiveAt: new Date() },
    })
    
    // Create session
    const session = await createSession(player.id)
    
    // Return player profile and token
    return successResponse({
      player: {
        id: player.id,
        username: player.username,
        displayName: player.displayName,
        isGuest: player.isGuest,
        totalRaces: player.totalRaces,
        totalWins: player.totalWins,
        highestRank: player.highestRank,
        createdAt: player.createdAt.toISOString(),
      },
      token: session.token,
      expiresAt: session.expiresAt.toISOString(),
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return errorResponse('Login failed', 500)
  }
}
