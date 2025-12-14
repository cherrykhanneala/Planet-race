import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'
import { errorResponse, successResponse } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId } = body
    
    // Generate unique guest username
    const guestId = uuidv4().split('-')[0]
    const username = `guest_${guestId}`
    const displayName = body.displayName || `Guest ${guestId}`
    
    // Create guest player
    const player = await prisma.player.create({
      data: {
        username,
        displayName,
        isGuest: true,
      },
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
    console.error('Guest login error:', error)
    return errorResponse('Guest login failed', 500)
  }
}
