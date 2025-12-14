import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set')
}
const TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000 // 30 days

export interface TokenPayload {
  playerId: string
  username: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash)
}

/**
 * Generate a JWT token for a player
 */
export function generateToken(payload: TokenPayload): string {
  return sign(payload, JWT_SECRET as string, {
    expiresIn: '30d',
  })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return verify(token, JWT_SECRET as string) as TokenPayload
  } catch (error) {
    return null
  }
}

/**
 * Create a session in the database
 */
export async function createSession(playerId: string) {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY)
  
  await prisma.session.create({
    data: {
      playerId,
      token,
      expiresAt,
    },
  })
  
  return { token, expiresAt }
}

/**
 * Validate a session token
 */
export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
  })
  
  if (!session || session.expiresAt < new Date()) {
    return null
  }
  
  return session.playerId
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(token: string) {
  await prisma.session.delete({
    where: { token },
  }).catch(() => {
    // Ignore if session doesn't exist
  })
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions() {
  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

/**
 * Extract bearer token from Authorization header
 */
export function extractBearerToken(authorization: string | null): string | null {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }
  return authorization.substring(7)
}
