import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, errorResponse, successResponse, validateRequiredFields } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    // Authenticate player
    const player = await authenticateRequest(request)
    if (!player) {
      return errorResponse('Authentication required', 401)
    }
    
    const body = await request.json()
    
    // Validate required fields
    const validationError = validateRequiredFields(body, ['name', 'trackId', 'raceMode'])
    if (validationError) {
      return errorResponse(validationError)
    }
    
    const {
      name,
      trackId,
      raceMode,
      maxPlayers = 8,
      minPlayers = 2,
      isPublic = true,
      password,
    } = body
    
    // Create lobby
    const lobby = await prisma.lobby.create({
      data: {
        name,
        trackId,
        raceMode,
        maxPlayers,
        minPlayers,
        isPublic,
        password: password || null,
        hostPlayerId: player.id,
        status: 'waiting',
      },
    })
    
    // Add creator as first member
    await prisma.lobbyMember.create({
      data: {
        lobbyId: lobby.id,
        playerId: player.id,
      },
    })
    
    // Fetch lobby with members
    const lobbyWithMembers = await getLobbyDetails(lobby.id)
    
    return successResponse(lobbyWithMembers)
  } catch (error: any) {
    console.error('Create lobby error:', error)
    return errorResponse('Failed to create lobby', 500)
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
