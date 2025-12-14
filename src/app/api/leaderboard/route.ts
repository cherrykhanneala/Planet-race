import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackId = searchParams.get('trackId')
    const type = searchParams.get('type') || 'global' // 'global' or 'daily'
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    if (!trackId) {
      return errorResponse('trackId is required')
    }
    
    let entries: any[] = []
    
    if (type === 'daily') {
      // Daily leaderboard
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const results = await prisma.raceResult.findMany({
        where: {
          trackId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          player: {
            select: {
              displayName: true,
            },
          },
        },
        orderBy: {
          finishTime: 'asc',
        },
        take: limit,
        skip: offset,
      })
      
      entries = results.map((result, index) => ({
        rank: offset + index + 1,
        playerId: result.playerId,
        playerName: result.player.displayName,
        finishTime: result.finishTime,
        raceResultId: result.id,
        createdAt: result.createdAt.toISOString(),
      }))
    } else {
      // Global leaderboard
      const results = await prisma.raceResult.findMany({
        where: {
          trackId,
        },
        include: {
          player: {
            select: {
              displayName: true,
            },
          },
        },
        orderBy: {
          finishTime: 'asc',
        },
        take: limit,
        skip: offset,
      })
      
      entries = results.map((result, index) => ({
        rank: offset + index + 1,
        playerId: result.playerId,
        playerName: result.player.displayName,
        finishTime: result.finishTime,
        raceResultId: result.id,
        createdAt: result.createdAt.toISOString(),
      }))
    }
    
    return successResponse({
      trackId,
      type,
      entries,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Get leaderboard error:', error)
    return errorResponse('Failed to fetch leaderboard', 500)
  }
}
