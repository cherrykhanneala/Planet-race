import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const docs = {
    name: 'Planet Race API',
    version: '1.0.0',
    description: 'Mobile-first multiplayer arcade racing game platform API',
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    
    endpoints: {
      authentication: {
        'POST /api/auth/register': {
          description: 'Register a new player account',
          body: {
            username: 'string (required)',
            displayName: 'string (required)',
            email: 'string (optional)',
            password: 'string (required)',
          },
          response: {
            player: 'PlayerProfile',
            token: 'string',
            expiresAt: 'string (ISO date)',
          },
        },
        'POST /api/auth/login': {
          description: 'Login with username and password',
          body: {
            username: 'string (required)',
            password: 'string (required)',
          },
          response: {
            player: 'PlayerProfile',
            token: 'string',
            expiresAt: 'string (ISO date)',
          },
        },
        'POST /api/auth/guest': {
          description: 'Create a guest account',
          body: {
            displayName: 'string (optional)',
            deviceId: 'string (optional)',
          },
          response: {
            player: 'PlayerProfile',
            token: 'string',
            expiresAt: 'string (ISO date)',
          },
        },
        'POST /api/auth/logout': {
          description: 'Logout (invalidate session token)',
          headers: {
            Authorization: 'Bearer {token}',
          },
          response: {
            message: 'string',
          },
        },
      },
      
      players: {
        'GET /api/players/me': {
          description: 'Get current player profile',
          headers: {
            Authorization: 'Bearer {token}',
          },
          response: 'PlayerProfile',
        },
        'GET /api/players/{id}': {
          description: 'Get player profile by ID',
          params: {
            id: 'string (player ID)',
          },
          response: 'PlayerProfile',
        },
      },
      
      races: {
        'POST /api/races/submit': {
          description: 'Submit a race result',
          headers: {
            Authorization: 'Bearer {token}',
          },
          body: {
            trackId: 'string (required)',
            raceMode: 'string (required) - time_trial, ghost_race, or multiplayer',
            finishTime: 'number (required) - milliseconds',
            lapTimes: 'number[] (required)',
            checkpointTimes: 'number[] (required)',
            gameVersion: 'string (required)',
            platformType: 'string (required) - ios, android, or unity_editor',
            includeGhostData: 'boolean (optional)',
            replayData: 'object (optional) - ghost replay data',
          },
          response: {
            raceResult: 'RaceResult',
            ghostReplayId: 'string (if ghost data included)',
          },
        },
        'GET /api/races/results': {
          description: 'Get race results',
          query: {
            playerId: 'string (optional)',
            trackId: 'string (optional)',
            limit: 'number (optional, default 50)',
            offset: 'number (optional, default 0)',
          },
          response: {
            results: 'RaceResult[]',
            total: 'number',
            limit: 'number',
            offset: 'number',
          },
        },
      },
      
      ghosts: {
        'GET /api/ghosts': {
          description: 'Get ghost replay list (metadata only)',
          query: {
            trackId: 'string (required)',
            limit: 'number (optional, default 20)',
            offset: 'number (optional, default 0)',
            sortBy: 'string (optional) - time or popular',
          },
          response: {
            ghosts: 'GhostReplayData[]',
            total: 'number',
            limit: 'number',
            offset: 'number',
          },
        },
        'GET /api/ghosts/{id}': {
          description: 'Get full ghost replay data',
          params: {
            id: 'string (ghost replay ID)',
          },
          response: 'GhostReplayFull',
        },
      },
      
      leaderboard: {
        'GET /api/leaderboard': {
          description: 'Get leaderboard for a track',
          query: {
            trackId: 'string (required)',
            type: 'string (required) - global or daily',
            limit: 'number (optional, default 100)',
            offset: 'number (optional, default 0)',
          },
          response: {
            trackId: 'string',
            type: 'string',
            entries: 'LeaderboardEntry[]',
            limit: 'number',
            offset: 'number',
          },
        },
      },
      
      lobbies: {
        'POST /api/lobbies/create': {
          description: 'Create a new lobby',
          headers: {
            Authorization: 'Bearer {token}',
          },
          body: {
            name: 'string (required)',
            trackId: 'string (required)',
            raceMode: 'string (required)',
            maxPlayers: 'number (optional, default 8)',
            minPlayers: 'number (optional, default 2)',
            isPublic: 'boolean (optional, default true)',
            password: 'string (optional)',
          },
          response: 'LobbyDetails',
        },
        'GET /api/lobbies/list': {
          description: 'List available lobbies',
          query: {
            trackId: 'string (optional)',
            status: 'string (optional, default waiting)',
            limit: 'number (optional, default 50)',
            offset: 'number (optional, default 0)',
          },
          response: {
            lobbies: 'LobbyData[]',
            total: 'number',
            limit: 'number',
            offset: 'number',
          },
        },
        'GET /api/lobbies/{id}': {
          description: 'Get lobby details',
          params: {
            id: 'string (lobby ID)',
          },
          response: 'LobbyDetails',
        },
        'DELETE /api/lobbies/{id}': {
          description: 'Delete a lobby',
          params: {
            id: 'string (lobby ID)',
          },
          response: {
            message: 'string',
          },
        },
        'POST /api/lobbies/{id}/join': {
          description: 'Join a lobby',
          headers: {
            Authorization: 'Bearer {token}',
          },
          params: {
            id: 'string (lobby ID)',
          },
          body: {
            password: 'string (optional, required for private lobbies)',
          },
          response: 'LobbyDetails',
        },
        'POST /api/lobbies/{id}/leave': {
          description: 'Leave a lobby',
          headers: {
            Authorization: 'Bearer {token}',
          },
          params: {
            id: 'string (lobby ID)',
          },
          response: {
            message: 'string',
          },
        },
        'POST /api/lobbies/{id}/ready': {
          description: 'Update ready status in lobby',
          headers: {
            Authorization: 'Bearer {token}',
          },
          params: {
            id: 'string (lobby ID)',
          },
          body: {
            isReady: 'boolean (required)',
          },
          response: {
            message: 'string',
            isReady: 'boolean',
          },
        },
      },
      
      matchmaking: {
        'POST /api/matchmaking': {
          description: 'Find or create a suitable lobby',
          headers: {
            Authorization: 'Bearer {token}',
          },
          body: {
            trackId: 'string (optional)',
            raceMode: 'string (optional)',
            skillLevel: 'number (optional)',
          },
          response: {
            lobbyId: 'string',
            lobby: 'LobbyDetails',
            created: 'boolean (true if new lobby was created)',
          },
        },
      },
      
      admin: {
        'GET /api/admin/stats': {
          description: 'Get platform statistics',
          note: 'In production, add admin authentication',
          response: {
            overall: 'object',
            recent24h: 'object',
            topPlayers: 'PlayerProfile[]',
          },
        },
      },
    },
    
    types: {
      PlayerProfile: {
        id: 'string',
        username: 'string',
        displayName: 'string',
        isGuest: 'boolean',
        totalRaces: 'number',
        totalWins: 'number',
        highestRank: 'number | null',
        createdAt: 'string (ISO date)',
      },
      RaceResult: {
        id: 'string',
        playerId: 'string',
        playerName: 'string',
        trackId: 'string',
        raceMode: 'string',
        finishTime: 'number',
        lapTimes: 'number[]',
        checkpointTimes: 'number[]',
        globalRank: 'number | null',
        dailyRank: 'number | null',
        createdAt: 'string (ISO date)',
      },
      GhostReplayData: {
        id: 'string',
        playerId: 'string',
        playerName: 'string',
        trackId: 'string',
        finishTime: 'number',
        downloadCount: 'number',
        createdAt: 'string (ISO date)',
      },
      GhostReplayFull: {
        '...GhostReplayData': 'all GhostReplayData fields',
        replayData: 'object (replay data)',
      },
      LeaderboardEntry: {
        rank: 'number',
        playerId: 'string',
        playerName: 'string',
        finishTime: 'number',
        raceResultId: 'string',
        createdAt: 'string (ISO date)',
      },
      LobbyData: {
        id: 'string',
        name: 'string',
        trackId: 'string',
        raceMode: 'string',
        maxPlayers: 'number',
        minPlayers: 'number',
        status: 'string (waiting, ready, racing, finished)',
        isPublic: 'boolean',
        hostPlayerId: 'string | null',
        currentPlayers: 'number',
        createdAt: 'string (ISO date)',
      },
      LobbyDetails: {
        '...LobbyData': 'all LobbyData fields',
        members: 'LobbyMemberData[]',
      },
      LobbyMemberData: {
        playerId: 'string',
        playerName: 'string',
        isReady: 'boolean',
        joinedAt: 'string (ISO date)',
      },
    },
    
    authentication: {
      description: 'Most endpoints require authentication via Bearer token',
      header: 'Authorization: Bearer {token}',
      obtaining: 'Use /api/auth/register, /api/auth/login, or /api/auth/guest to get a token',
      expiry: 'Tokens expire after 30 days',
    },
  }
  
  return Response.json(docs, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
