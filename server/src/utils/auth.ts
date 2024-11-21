import { sha256 } from '@oslojs/crypto/sha2'
import { encodeHexLowerCase } from '@oslojs/encoding'
import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'
import type { Context } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'

import { db } from '../lib/pg'
import type { Session } from '../lib/pg/schema'
import { sessions, users } from '../lib/pg/schema'
import type { NarrowedUser } from '../types'

export function generateSessionToken(): string {
    return createId()
}

export async function createSession(token: string, userId: string): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 Days
    }
    await db.insert(sessions).values(session)
    return session
}

type SessionValidationResult = { session: Session; user: NarrowedUser } | { session: null; user: null }

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

    const [result] = await db
        .select({
            user: {
                id: users.id,
                username: users.username,
                email: users.email
            },
            session: sessions
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, sessionId))

    if (!result) {
        return { session: null, user: null }
    }

    const { user, session } = result

    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(sessions).where(eq(sessions.id, sessionId))
        return { session: null, user: null }
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        await db
            .update(sessions)
            .set({
                expiresAt: session.expiresAt
            })
            .where(eq(sessions.id, session.id))
    }

    return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
}

export function setSessionTokenCookie(c: Context, token: string, expiresAt: Date): void {
    setCookie(c, 'session', token, {
        expires: expiresAt,
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
    })
}

export function deleteSessionTokenCookie(c: Context): void {
    deleteCookie(c, 'session', {
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production'
    })
}
