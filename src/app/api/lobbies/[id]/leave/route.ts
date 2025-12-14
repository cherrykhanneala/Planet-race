import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api-helpers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate player
    const player = await authenticateRequest(request)
    if (!player) {
      return errorResponse('Authentication required', 401)
    }
    
    const { id: lobbyId } = await params
    
    // Remove player from lobby
    await prisma.lobbyMember.delete({
      where: {
        lobbyId_playerId: {
          lobbyId,
          playerId: player.id,
        },
      },
    }).catch(() => {
      // Ignore if member doesn't exist
    })
    
    // Check if lobby is now empty
    const remainingMembers = await prisma.lobbyMember.count({
      where: { lobbyId },
    })
    
    if (remainingMembers === 0) {
      // Delete empty lobby
      await prisma.lobby.delete({
        where: { id: lobbyId },
      })
      
      return successResponse({ message: 'Left lobby (lobby deleted as it was empty)' })
    }
    
    // Check if player was host and reassign if needed
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
    })
    
    if (lobby && lobby.hostPlayerId === player.id) {
      // Assign new host (first remaining member)
      const newHost = await prisma.lobbyMember.findFirst({
        where: { lobbyId },
      })
      
      if (newHost) {
        await prisma.lobby.update({
          where: { id: lobbyId },
          data: { hostPlayerId: newHost.playerId },
        })
      }
    }
    
    return successResponse({ message: 'Left lobby successfully' })
  } catch (error: any) {
    console.error('Leave lobby error:', error)
    return errorResponse('Failed to leave lobby', 500)
  }
}
