import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const player = await prisma.player.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        displayName: true,
        isGuest: true,
        totalRaces: true,
        totalWins: true,
        highestRank: true,
        createdAt: true,
      },
    })
    
    if (!player) {
      return errorResponse('Player not found', 404)
    }
    
    return successResponse({
      id: player.id,
      username: player.username,
      displayName: player.displayName,
      isGuest: player.isGuest,
      totalRaces: player.totalRaces,
      totalWins: player.totalWins,
      highestRank: player.highestRank,
      createdAt: player.createdAt.toISOString(),
    })
  } catch (error: any) {
    console.error('Get player error:', error)
    return errorResponse('Failed to fetch player', 500)
  }
}
