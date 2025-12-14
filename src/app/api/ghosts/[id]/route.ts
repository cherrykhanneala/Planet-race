import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-helpers'

// Get full ghost replay data including replay data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const ghost = await prisma.ghostReplay.findUnique({
      where: { id },
      include: {
        player: {
          select: {
            displayName: true,
          },
        },
      },
    })
    
    if (!ghost) {
      return errorResponse('Ghost replay not found', 404)
    }
    
    // Increment download count
    await prisma.ghostReplay.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 },
      },
    })
    
    return successResponse({
      id: ghost.id,
      playerId: ghost.playerId,
      playerName: ghost.player.displayName,
      trackId: ghost.trackId,
      finishTime: ghost.finishTime,
      downloadCount: ghost.downloadCount + 1,
      replayData: JSON.parse(ghost.replayData),
      createdAt: ghost.createdAt.toISOString(),
    })
  } catch (error: any) {
    console.error('Get ghost detail error:', error)
    return errorResponse('Failed to fetch ghost replay', 500)
  }
}
