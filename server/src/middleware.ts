import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import type { User } from 'lucia'

import { lucia } from './lib/auth'

export async function authMiddleware(c: Context, next: Next) {
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
    if (!sessionId) {
        c.set('user', null)
        c.set('session', null)
        return await next()
    }

    const { session, user } = await lucia.validateSession(sessionId)
    if (session && session.fresh) {
        c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), {
            append: true
        })
    }
    if (!session) {
        c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
            append: true
        })
    }

    c.set('user', user)
    c.set('session', session)
    return await next()
}

type Env = {
    Variables: {
        user: User
    }
}

export const getUser = createMiddleware<Env>(async (c, next) => {
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
    if (!sessionId) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    const { session, user } = await lucia.validateSession(sessionId)
    if (session && session.fresh) {
        c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), {
            append: true
        })
    }
    if (!session) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    c.set('user', user)
    await next()
})
