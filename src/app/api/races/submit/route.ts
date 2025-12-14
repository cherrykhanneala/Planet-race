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
    const validationError = validateRequiredFields(body, [
      'trackId',
      'raceMode',
      'finishTime',
      'lapTimes',
      'checkpointTimes',
      'gameVersion',
      'platformType',
    ])
    if (validationError) {
      return errorResponse(validationError)
    }
    
    const {
      trackId,
      raceMode,
      finishTime,
      lapTimes,
      checkpointTimes,
      gameVersion,
      platformType,
      includeGhostData,
      replayData,
    } = body
    
    // Create race result
    const raceResult = await prisma.raceResult.create({
      data: {
        playerId: player.id,
        trackId,
        raceMode,
        finishTime,
        lapTimes: JSON.stringify(lapTimes),
        checkpointTimes: JSON.stringify(checkpointTimes),
        gameVersion,
        platformType,
      },
    })
    
    // Create ghost replay if data provided
    let ghostReplay = null
    if (includeGhostData && replayData) {
      ghostReplay = await prisma.ghostReplay.create({
        data: {
          playerId: player.id,
          raceResultId: raceResult.id,
          trackId,
          finishTime,
          replayData: JSON.stringify(replayData),
        },
      })
    }
    
    // Update player stats
    await prisma.player.update({
      where: { id: player.id },
      data: {
        totalRaces: { increment: 1 },
        lastActiveAt: new Date(),
      },
    })
    
    // Calculate rankings
    // NOTE: Synchronous for MVP. In production, move to background job queue
    // to avoid blocking the response and improve scalability.
    // See ARCHITECTURE.md for background job recommendations.
    await updateRankings(raceResult.id, trackId, finishTime)
    
    // Fetch updated result with rankings
    const updatedResult = await prisma.raceResult.findUnique({
      where: { id: raceResult.id },
      include: {
        player: {
          select: {
            displayName: true,
          },
        },
      },
    })
    
    return successResponse({
      raceResult: {
        id: updatedResult!.id,
        playerId: updatedResult!.playerId,
        playerName: updatedResult!.player.displayName,
        trackId: updatedResult!.trackId,
        raceMode: updatedResult!.raceMode,
        finishTime: updatedResult!.finishTime,
        lapTimes: JSON.parse(updatedResult!.lapTimes),
        checkpointTimes: JSON.parse(updatedResult!.checkpointTimes),
        globalRank: updatedResult!.globalRank,
        dailyRank: updatedResult!.dailyRank,
        createdAt: updatedResult!.createdAt.toISOString(),
      },
      ghostReplayId: ghostReplay?.id,
    })
  } catch (error: any) {
    console.error('Submit race error:', error)
    return errorResponse('Failed to submit race result', 500)
  }
}

async function updateRankings(raceResultId: string, trackId: string, finishTime: number) {
  // Calculate global rank
  const fasterGlobalCount = await prisma.raceResult.count({
    where: {
      trackId,
      finishTime: { lt: finishTime },
    },
  })
  const globalRank = fasterGlobalCount + 1
  
  // Calculate daily rank
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const fasterDailyCount = await prisma.raceResult.count({
    where: {
      trackId,
      finishTime: { lt: finishTime },
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  })
  const dailyRank = fasterDailyCount + 1
  
  // Update the race result
  await prisma.raceResult.update({
    where: { id: raceResultId },
    data: {
      globalRank,
      dailyRank,
    },
  })
}
