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
    const body = await request.json()
    const { isReady } = body
    
    // Update member ready status
    await prisma.lobbyMember.update({
      where: {
        lobbyId_playerId: {
          lobbyId,
          playerId: player.id,
        },
      },
      data: {
        isReady: isReady === true,
      },
    })
    
    // Check if all members are ready
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: {
        members: true,
      },
    })
    
    if (lobby) {
      const allReady = lobby.members.length >= lobby.minPlayers &&
                       lobby.members.every(m => m.isReady)
      
      if (allReady && lobby.status === 'waiting') {
        // Update lobby status to ready
        await prisma.lobby.update({
          where: { id: lobbyId },
          data: { status: 'ready' },
        })
      } else if (!allReady && lobby.status === 'ready') {
        // Update lobby status back to waiting
        await prisma.lobby.update({
          where: { id: lobbyId },
          data: { status: 'waiting' },
        })
      }
    }
    
    return successResponse({ message: 'Ready status updated', isReady })
  } catch (error: any) {
    console.error('Update ready status error:', error)
    return errorResponse('Failed to update ready status', 500)
  }
}
