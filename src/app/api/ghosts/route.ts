import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-helpers'

// Get list of ghost replays (metadata only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackId = searchParams.get('trackId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'time' // 'time' or 'popular'
    
    if (!trackId) {
      return errorResponse('trackId is required')
    }
    
    const where = { trackId }
    
    const orderBy: any = sortBy === 'popular'
      ? { downloadCount: 'desc' }
      : { finishTime: 'asc' }
    
    const ghosts = await prisma.ghostReplay.findMany({
      where,
      include: {
        player: {
          select: {
            displayName: true,
          },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    })
    
    const total = await prisma.ghostReplay.count({ where })
    
    const formattedGhosts = ghosts.map(ghost => ({
      id: ghost.id,
      playerId: ghost.playerId,
      playerName: ghost.player.displayName,
      trackId: ghost.trackId,
      finishTime: ghost.finishTime,
      downloadCount: ghost.downloadCount,
      createdAt: ghost.createdAt.toISOString(),
    }))
    
    return successResponse({
      ghosts: formattedGhosts,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Get ghosts error:', error)
    return errorResponse('Failed to fetch ghost replays', 500)
  }
}
