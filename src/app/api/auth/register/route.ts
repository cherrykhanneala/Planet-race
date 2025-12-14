import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'
import { errorResponse, successResponse, validateRequiredFields } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const validationError = validateRequiredFields(body, ['username', 'displayName', 'password'])
    if (validationError) {
      return errorResponse(validationError)
    }
    
    const { username, displayName, email, password } = body
    
    // Check if username already exists
    const existingPlayer = await prisma.player.findUnique({
      where: { username },
    })
    
    if (existingPlayer) {
      return errorResponse('Username already taken', 409)
    }
    
    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.player.findUnique({
        where: { email },
      })
      
      if (existingEmail) {
        return errorResponse('Email already registered', 409)
      }
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Create player
    const player = await prisma.player.create({
      data: {
        username,
        displayName,
        email: email || null,
        passwordHash,
        isGuest: false,
      },
    })
    
    // Create session
    const session = await createSession(player.id)
    
    // Return player profile and token
    return successResponse({
      player: {
        id: player.id,
        username: player.username,
        displayName: player.displayName,
        isGuest: player.isGuest,
        totalRaces: player.totalRaces,
        totalWins: player.totalWins,
        highestRank: player.highestRank,
        createdAt: player.createdAt.toISOString(),
      },
      token: session.token,
      expiresAt: session.expiresAt.toISOString(),
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return errorResponse('Registration failed', 500)
  }
}
