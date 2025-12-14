import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-helpers'

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
    
    // Note: In production, you'd want to verify the requester is the host
    
    await prisma.lobby.delete({
      where: { id },
    })
    
    return successResponse({ message: 'Lobby deleted successfully' })
  } catch (error: any) {
    console.error('Delete lobby error:', error)
    return errorResponse('Failed to delete lobby', 500)
  }
}
