import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackId = searchParams.get('trackId')
    const status = searchParams.get('status') || 'waiting'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const where: any = {
      isPublic: true,
      status,
    }
    
    if (trackId) {
      where.trackId = trackId
    }
    
    const lobbies = await prisma.lobby.findMany({
      where,
      include: {
        members: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })
    
    const total = await prisma.lobby.count({ where })
    
    const formattedLobbies = lobbies.map(lobby => ({
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
    }))
    
    return successResponse({
      lobbies: formattedLobbies,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('List lobbies error:', error)
    return errorResponse('Failed to fetch lobbies', 500)
  }
}
