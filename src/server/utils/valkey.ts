import { redis } from 'bun'
import type { UserRole } from 'server/db/schema'

const SESSION_VERSION = 1
const SESSION_PREFIX = 'session:'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days
const USER_SESSION_PREFIX = 'user_sessions:'

interface SessionData {
  v: number
  userId: string
  userName: string
  role: UserRole
}

export async function verifyUserSession(sessionToken: string) {
  const res = await redis.get(`${SESSION_PREFIX}${sessionToken}`)
  if (!res) {
    return null
  }
  const sessionData: SessionData = JSON.parse(res)
  if (sessionData.v !== SESSION_VERSION) {
    return null
  }

  return sessionData
}

export async function createUserSession(options: Omit<SessionData, 'v'>) {
  const sessionToken = crypto.randomUUID()
  const sessionData: SessionData = {
    v: SESSION_VERSION,
    ...options,
  }
  await redis.set(
    `${SESSION_PREFIX}${sessionToken}`,
    JSON.stringify(sessionData)
  )
  await redis.expire(`${SESSION_PREFIX}${sessionToken}`, SESSION_TTL_SECONDS)
  await redis.sadd(`${USER_SESSION_PREFIX}${options.userId}`, sessionToken)
  return sessionToken
}

export async function refreshUserSession(sessionToken: string) {
  await redis.expire(`${SESSION_PREFIX}${sessionToken}`, SESSION_TTL_SECONDS)
}

export async function deleteUserSession(sessionToken: string) {
  await redis.del(`${SESSION_PREFIX}${sessionToken}`)
}

export async function deleteUserSessionsByUserId(userId: string) {
  const keys = await redis.smembers(`${USER_SESSION_PREFIX}${userId}`)
  if (keys.length === 0) {
    return
  }

  for (const key of keys) {
    await redis.del(`${SESSION_PREFIX}${key}`)
  }
  await redis.del(`${USER_SESSION_PREFIX}${userId}`)
}
