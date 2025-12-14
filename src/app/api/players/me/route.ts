import { NextRequest } from 'next/server'
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    // Authenticate player
    const player = await authenticateRequest(request)
    if (!player) {
      return errorResponse('Authentication required', 401)
    }
    
    return successResponse({
      id: player.id,
      username: player.username,
      displayName: player.displayName,
      email: player.email,
      isGuest: player.isGuest,
      totalRaces: player.totalRaces,
      totalWins: player.totalWins,
      highestRank: player.highestRank,
      createdAt: player.createdAt.toISOString(),
      lastActiveAt: player.lastActiveAt.toISOString(),
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return errorResponse('Failed to fetch profile', 500)
  }
}
