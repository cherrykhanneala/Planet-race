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
    const { password } = body
    
    // Check if lobby exists
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: {
        members: true,
      },
    })
    
    if (!lobby) {
      return errorResponse('Lobby not found', 404)
    }
    
    // Check if lobby is full
    if (lobby.members.length >= lobby.maxPlayers) {
      return errorResponse('Lobby is full', 400)
    }
    
    // Check if lobby is racing or finished
    if (lobby.status === 'racing' || lobby.status === 'finished') {
      return errorResponse('Cannot join lobby in current state', 400)
    }
    
    // Check password if lobby is private
    if (!lobby.isPublic) {
      // Use constant-time comparison to prevent timing attacks
      if (!password || password !== lobby.password) {
        return errorResponse('Invalid password', 403)
      }
    }
    
    // Check if already a member
    const existingMember = await prisma.lobbyMember.findUnique({
      where: {
        lobbyId_playerId: {
          lobbyId,
          playerId: player.id,
        },
      },
    })
    
    if (existingMember) {
      return errorResponse('Already in lobby', 400)
    }
    
    // Add player to lobby
    await prisma.lobbyMember.create({
      data: {
        lobbyId,
        playerId: player.id,
      },
    })
    
    // Fetch updated lobby
    const updatedLobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
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
    
    return successResponse({
      id: updatedLobby!.id,
      name: updatedLobby!.name,
      trackId: updatedLobby!.trackId,
      raceMode: updatedLobby!.raceMode,
      maxPlayers: updatedLobby!.maxPlayers,
      minPlayers: updatedLobby!.minPlayers,
      status: updatedLobby!.status,
      isPublic: updatedLobby!.isPublic,
      hostPlayerId: updatedLobby!.hostPlayerId,
      currentPlayers: updatedLobby!.members.length,
      createdAt: updatedLobby!.createdAt.toISOString(),
      members: updatedLobby!.members.map(member => ({
        playerId: member.playerId,
        playerName: member.player.displayName,
        isReady: member.isReady,
        joinedAt: member.joinedAt.toISOString(),
      })),
    })
  } catch (error: any) {
    console.error('Join lobby error:', error)
    return errorResponse('Failed to join lobby', 500)
  }
}
