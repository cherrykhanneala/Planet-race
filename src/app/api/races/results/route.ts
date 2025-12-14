import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('playerId')
    const trackId = searchParams.get('trackId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const where: any = {}
    
    if (playerId) {
      where.playerId = playerId
    }
    
    if (trackId) {
      where.trackId = trackId
    }
    
    const results = await prisma.raceResult.findMany({
      where,
      include: {
        player: {
          select: {
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })
    
    const total = await prisma.raceResult.count({ where })
    
    const formattedResults = results.map(result => ({
      id: result.id,
      playerId: result.playerId,
      playerName: result.player.displayName,
      trackId: result.trackId,
      raceMode: result.raceMode,
      finishTime: result.finishTime,
      lapTimes: JSON.parse(result.lapTimes),
      checkpointTimes: JSON.parse(result.checkpointTimes),
      globalRank: result.globalRank,
      dailyRank: result.dailyRank,
      createdAt: result.createdAt.toISOString(),
    }))
    
    return successResponse({
      results: formattedResults,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Get race results error:', error)
    return errorResponse('Failed to fetch race results', 500)
  }
}
