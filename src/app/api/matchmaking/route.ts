import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, errorResponse, successResponse } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    // Authenticate player
    const player = await authenticateRequest(request)
    if (!player) {
      return errorResponse('Authentication required', 401)
    }
    
    const body = await request.json()
    const { trackId, raceMode } = body
    
    // Find available lobbies matching criteria
    const where: any = {
      isPublic: true,
      status: 'waiting',
    }
    
    if (trackId) {
      where.trackId = trackId
    }
    
    if (raceMode) {
      where.raceMode = raceMode
    }
    
    const availableLobbies = await prisma.lobby.findMany({
      where,
      include: {
        members: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // Filter lobbies that aren't full
    const joinableLobbies = availableLobbies.filter(
      lobby => lobby.members.length < lobby.maxPlayers
    )
    
    if (joinableLobbies.length === 0) {
      // No suitable lobby found, create one
      const newLobby = await prisma.lobby.create({
        data: {
          name: `Auto Match ${Date.now()}`,
          trackId: trackId || 'track_default',
          raceMode: raceMode || 'multiplayer',
          maxPlayers: 8,
          minPlayers: 2,
          isPublic: true,
          hostPlayerId: player.id,
          status: 'waiting',
        },
      })
      
      // Add creator as first member
      await prisma.lobbyMember.create({
        data: {
          lobbyId: newLobby.id,
          playerId: player.id,
        },
      })
      
      // Fetch lobby with members
      const lobbyWithMembers = await getLobbyDetails(newLobby.id)
      
      return successResponse({
        lobbyId: newLobby.id,
        lobby: lobbyWithMembers,
        created: true,
      })
    }
    
    // Join the first available lobby
    const targetLobby = joinableLobbies[0]
    
    // Check if already a member
    const existingMember = await prisma.lobbyMember.findUnique({
      where: {
        lobbyId_playerId: {
          lobbyId: targetLobby.id,
          playerId: player.id,
        },
      },
    })
    
    if (!existingMember) {
      // Add player to lobby
      await prisma.lobbyMember.create({
        data: {
          lobbyId: targetLobby.id,
          playerId: player.id,
        },
      })
    }
    
    // Fetch lobby with members
    const lobbyWithMembers = await getLobbyDetails(targetLobby.id)
    
    return successResponse({
      lobbyId: targetLobby.id,
      lobby: lobbyWithMembers,
      created: false,
    })
  } catch (error: any) {
    console.error('Matchmaking error:', error)
    return errorResponse('Matchmaking failed', 500)
  }
}

async function getLobbyDetails(lobbyId: string) {
  const lobby = await prisma.lobby.findUnique({
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
  
  if (!lobby) {
    return null
  }
  
  return {
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
  }
}
