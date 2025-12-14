import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    // Note: In production, add admin authentication here
    
    // Get overall statistics
    const [
      totalPlayers,
      totalRaces,
      totalGhosts,
      activeLobbies,
      guestPlayers,
      registeredPlayers,
    ] = await Promise.all([
      prisma.player.count(),
      prisma.raceResult.count(),
      prisma.ghostReplay.count(),
      prisma.lobby.count({ where: { status: { in: ['waiting', 'ready', 'racing'] } } }),
      prisma.player.count({ where: { isGuest: true } }),
      prisma.player.count({ where: { isGuest: false } }),
    ])
    
    // Get recent activity (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const [
      recentPlayers,
      recentRaces,
      recentGhosts,
    ] = await Promise.all([
      prisma.player.count({ where: { createdAt: { gte: yesterday } } }),
      prisma.raceResult.count({ where: { createdAt: { gte: yesterday } } }),
      prisma.ghostReplay.count({ where: { createdAt: { gte: yesterday } } }),
    ])
    
    // Get top players
    const topPlayers = await prisma.player.findMany({
      where: {
        totalRaces: { gt: 0 },
      },
      orderBy: {
        totalWins: 'desc',
      },
      take: 10,
      select: {
        id: true,
        displayName: true,
        totalRaces: true,
        totalWins: true,
        highestRank: true,
      },
    })
    
    return successResponse({
      overall: {
        totalPlayers,
        totalRaces,
        totalGhosts,
        activeLobbies,
        guestPlayers,
        registeredPlayers,
      },
      recent24h: {
        newPlayers: recentPlayers,
        racesCompleted: recentRaces,
        ghostsCreated: recentGhosts,
      },
      topPlayers,
    })
  } catch (error: any) {
    console.error('Get admin stats error:', error)
    return errorResponse('Failed to fetch statistics', 500)
  }
}
