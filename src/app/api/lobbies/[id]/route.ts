import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const lobby = await prisma.lobby.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            player: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
    })
    
    if (!lobby) {
      return errorResponse('Lobby not found', 404)
    }
    
    return successResponse({
      id: lobby.id,
      name: lobby.name,
      trackId: lobby.trackId,
      raceMode: lobby.raceMode,
      maxPlayers: lobby.maxPlayers,
      minPlayers: lobby.minPlayers,
      status: lobby.status,
      isPublic: lobby.isPublic,
      hostPlayerId: lobby.hostPlayerId,
      currentPlayers: lobby.members.length,
      createdAt: lobby.createdAt.toISOString(),
      members: lobby.members.map(member => ({
        playerId: member.playerId,
        playerName: member.player.displayName,
        isReady: member.isReady,
        joinedAt: member.joinedAt.toISOString(),
      })),
    })
  } catch (error: any) {
    console.error('Get lobby error:', error)
    return errorResponse('Failed to fetch lobby', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Authenticate player
    const player = await authenticateRequest(request)
    if (!player) {
      return errorResponse('Authentication required', 401)
    }
    
    // Verify player is the host
    const lobby = await prisma.lobby.findUnique({
      where: { id },
    })
    
    if (!lobby) {
      return errorResponse('Lobby not found', 404)
    }
    
    if (lobby.hostPlayerId !== player.id) {
      return errorResponse('Only the host can delete the lobby', 403)
    }
    
    await prisma.lobby.delete({
      where: { id },
    })
    
    return successResponse({ message: 'Lobby deleted successfully' })
  } catch (error: any) {
    console.error('Delete lobby error:', error)
    return errorResponse('Failed to delete lobby', 500)
  }
}
